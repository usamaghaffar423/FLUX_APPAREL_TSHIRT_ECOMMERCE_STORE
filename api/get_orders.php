<?php
/**
 * Get Orders API — Admin only
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

    // ── Require admin token ───────────────────────────────────────────────
    validateAuthToken($pdo, 'admin');

    $stmt = $pdo->query("
        SELECT id, email, first_name, last_name, address, city, postal_code,
               payment_method, CAST(total AS DECIMAL(10,2)) AS total, status, created_at
        FROM orders
        ORDER BY created_at DESC
    ");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $itemStmt = $pdo->prepare("
        SELECT id, product_id, title, CAST(price AS DECIMAL(10,2)) AS price, quantity
        FROM order_items
        WHERE order_id = ?
    ");

    foreach ($orders as &$order) {
        $itemStmt->execute([$order['id']]);
        $order['items'] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
    }
    unset($order);

    echo json_encode($orders);

} catch (\PDOException $e) {
    error_log('get_orders error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch orders. Please try again.']);
}
?>
