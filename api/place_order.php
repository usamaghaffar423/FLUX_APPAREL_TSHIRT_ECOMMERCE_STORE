<?php
/**
 * Place Order API
 * Validates all inputs and computes the order total server-side.
 * Never trusts the client-submitted price or total.
 */

require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid or missing request body']);
    exit;
}

// ── Require authenticated user ────────────────────────────────────────────
// Users must be registered and logged in to place an order
try {
    $pdo = getDbConnection();
    $session = validateAuthToken($pdo);
    // Override username with the authenticated session username
    $input['username'] = $session['username'];
} catch (\Exception $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'You must be logged in to place an order. Please register or sign in.']);
    exit;
}

// ── Input Validation ─────────────────────────────────────────────────────

$requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode', 'paymentMethod', 'items'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit;
    }
}

// Email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL) || strlen($input['email']) > 255) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Text field length limits
$fieldLimits = [
    'firstName'     => 50,
    'lastName'      => 50,
    'address'       => 255,
    'city'          => 100,
    'postalCode'    => 20,
];
foreach ($fieldLimits as $field => $maxLen) {
    if (strlen($input[$field]) > $maxLen) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Field '$field' exceeds maximum length"]);
        exit;
    }
}

// Payment method whitelist
$allowedPaymentMethods = ['cod', 'bank', 'easypaisa', 'jazzcash'];
if (!in_array($input['paymentMethod'], $allowedPaymentMethods, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid payment method']);
    exit;
}

// Items array: must be non-empty, max 100 items
if (!is_array($input['items']) || count($input['items']) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Order must contain at least one item']);
    exit;
}

if (count($input['items']) > 100) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Too many items in order']);
    exit;
}

// Validate each item and collect product IDs
$itemProductIds = [];
foreach ($input['items'] as $item) {
    if (!isset($item['id']) || !isset($item['quantity'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Each item must have an id and quantity']);
        exit;
    }
    $qty = (int)$item['quantity'];
    if ($qty < 1 || $qty > 50) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Item quantity must be between 1 and 50']);
        exit;
    }
    $itemProductIds[] = (int)$item['id'];
}

try {
    // $pdo already opened above for auth — reuse it
    // ── Fetch real prices from cf_products ────────────────────────────────
    $placeholders = implode(',', array_fill(0, count($itemProductIds), '?'));
    $stmt = $pdo->prepare("SELECT id, price FROM cf_products WHERE id IN ($placeholders) AND active = 1");
    $stmt->execute($itemProductIds);
    $dbProducts = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // [id => price]

    // Verify all products exist and are active
    foreach ($itemProductIds as $pid) {
        if (!isset($dbProducts[$pid])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => "Product ID $pid is unavailable"]);
            exit;
        }
    }

    // Compute server-side total
    $serverTotal = 0;
    $sanitizedItems = [];

    foreach ($input['items'] as $item) {
        $pid   = (int)$item['id'];
        $qty   = (int)$item['quantity'];
        $price = (float)$dbProducts[$pid];
        $serverTotal += $price * $qty;

        $sanitizedItems[] = [
            'id'       => $pid,
            'title'    => htmlspecialchars(substr($item['title'] ?? '', 0, 255), ENT_QUOTES, 'UTF-8'),
            'price'    => $price,
            'quantity' => $qty,
        ];
    }

    $serverTotal = round($serverTotal, 2);

    // ── Insert Order ──────────────────────────────────────────────────────
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO orders (username, email, first_name, last_name, address, city, postal_code, payment_method, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        isset($input['username']) ? substr($input['username'], 0, 100) : null,
        $input['email'],
        $input['firstName'],
        $input['lastName'],
        $input['address'],
        $input['city'],
        $input['postalCode'],
        $input['paymentMethod'],
        $serverTotal,
    ]);

    $orderId = $pdo->lastInsertId();

    // ── Insert Items ──────────────────────────────────────────────────────
    $itemStmt = $pdo->prepare("
        INSERT INTO order_items (order_id, product_id, title, price, quantity)
        VALUES (?, ?, ?, ?, ?)
    ");
    foreach ($sanitizedItems as $item) {
        $itemStmt->execute([$orderId, $item['id'], $item['title'], $item['price'], $item['quantity']]);
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'orderId' => (int)$orderId, 'total' => $serverTotal]);

} catch (\Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    error_log('place_order error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not place order. Please try again.']);
}
?>
