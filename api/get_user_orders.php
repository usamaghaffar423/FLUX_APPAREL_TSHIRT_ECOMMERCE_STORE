<?php
/**
 * Get User Orders API — Authenticated users only.
 * Users can only see their own orders; admins can see any.
 */

require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDbConnection();

    // ── Require any authenticated user ────────────────────────────────────
    $session = validateAuthToken($pdo);

    $requestedUsername = trim($_GET['username'] ?? '');

    if (empty($requestedUsername)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username is required']);
        exit;
    }

    // Non-admins can only fetch their own orders
    if ($session['role'] !== 'admin' && $session['username'] !== $requestedUsername) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied. You can only view your own orders.']);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, CAST(total AS DECIMAL(10,2)) AS total, status, created_at, payment_method
        FROM orders
        WHERE username = ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$requestedUsername]);
    $orders = $stmt->fetchAll();

    echo json_encode(['success' => true, 'orders' => $orders]);

} catch (\PDOException $e) {
    error_log('get_user_orders error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch orders. Please try again.']);
}
?>
