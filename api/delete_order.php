<?php
/**
 * Delete Order API — Admin only
 */

require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Accept DELETE or POST (Apache may block DELETE on some configs)
if (!in_array($_SERVER['REQUEST_METHOD'], ['DELETE', 'POST'])) {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDbConnection();
    validateAuthToken($pdo, 'admin');

    // Read ID from query string first, then request body
    $orderId = (int)($_GET['id'] ?? 0);
    if ($orderId <= 0) {
        $input   = json_decode(file_get_contents('php://input'), true);
        $orderId = (int)($input['order_id'] ?? 0);
    }

    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or missing order ID']);
        exit;
    }

    $pdo->beginTransaction();

    $pdo->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$orderId]);

    $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);

    if ($stmt->rowCount() === 0) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['error' => 'Order not found']);
        exit;
    }

    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (\PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    error_log('delete_order error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete order.']);
}
?>
