<?php
/**
 * Update Order Status API — Admin only
 */

require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDbConnection();

    // ── Require admin token ───────────────────────────────────────────────
    validateAuthToken($pdo, 'admin');

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['order_id']) || !isset($input['status'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing order_id or status']);
        exit;
    }

    $orderId = (int)$input['order_id'];
    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid order ID']);
        exit;
    }

    $allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!in_array($input['status'], $allowedStatuses, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status value']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$input['status'], $orderId]);

    echo json_encode(['success' => true, 'message' => 'Order status updated']);

} catch (\PDOException $e) {
    error_log('update_order_status error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update order status. Please try again.']);
}
?>
