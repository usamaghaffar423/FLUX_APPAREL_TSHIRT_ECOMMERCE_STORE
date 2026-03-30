<?php
/**
 * GET Product Images API
 * Returns all images for a given product with resolved full URLs.
 */

require_once 'config.php';

header('Content-Type: application/json');

if (empty($_GET['product_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing product_id parameter']);
    exit;
}

try {
    $pdo = getDbConnection();

    $productId = (int)$_GET['product_id'];
    if ($productId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid product_id']);
        exit;
    }

    // Build image base URL
    $protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host      = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptDir = dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api/get_product_images.php'));
    $imageBase = $protocol . '://' . $host . rtrim($scriptDir, '/') . '/';

    $stmt = $pdo->prepare("
        SELECT id, product_id, image_url, alt_text, is_primary, sort_order
        FROM product_images
        WHERE product_id = ?
        ORDER BY is_primary DESC, sort_order ASC, id ASC
    ");
    $stmt->execute([$productId]);
    $images = $stmt->fetchAll();

    foreach ($images as &$img) {
        $img['id']         = (int)$img['id'];
        $img['product_id'] = (int)$img['product_id'];
        $img['is_primary'] = (bool)$img['is_primary'];
        $img['sort_order'] = (int)$img['sort_order'];

        if ($img['image_url'] && !str_starts_with($img['image_url'], 'http')) {
            $img['image_url'] = $imageBase . $img['image_url'];
        }
    }
    unset($img);

    echo json_encode($images);

} catch (\PDOException $e) {
    error_log('get_product_images error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load images. Please try again.']);
}
?>
