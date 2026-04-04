<?php
/**
 * Admin Product Gallery Images API
 *
 * GET    ?product_id=X  → list gallery images for a product
 * POST   {product_id, image_url, alt_text?, sort_order?} → add image
 * DELETE ?id=X          → remove image
 *
 * All methods require admin Bearer token.
 */

require_once 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$pdo = getDbConnection();
validateAuthToken($pdo, 'admin');

// Auto-create table
$pdo->exec("CREATE TABLE IF NOT EXISTS product_images (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    product_id  INT NOT NULL,
    image_url   VARCHAR(500) NOT NULL,
    alt_text    VARCHAR(255) DEFAULT '',
    is_primary  TINYINT(1)   NOT NULL DEFAULT 0,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

function imgUrl($raw) {
    if (!$raw) return '';
    if (str_starts_with($raw, 'http')) return $raw;
    $protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host      = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $root      = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api/')), '/');
    return $protocol . '://' . $host . $root . '/' . ltrim($raw, '/');
}

switch ($_SERVER['REQUEST_METHOD']) {

    // ── LIST ─────────────────────────────────────────────────────────────────
    case 'GET':
        $productId = (int)($_GET['product_id'] ?? 0);
        if (!$productId) {
            http_response_code(400);
            echo json_encode(['error' => 'product_id required']);
            exit;
        }
        $stmt = $pdo->prepare(
            "SELECT id, product_id, image_url, alt_text, is_primary, sort_order
             FROM product_images
             WHERE product_id = ?
             ORDER BY is_primary DESC, sort_order ASC, id ASC"
        );
        $stmt->execute([$productId]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['id']         = (int)$r['id'];
            $r['product_id'] = (int)$r['product_id'];
            $r['is_primary'] = (bool)$r['is_primary'];
            $r['sort_order'] = (int)$r['sort_order'];
            $r['image_url']  = imgUrl($r['image_url']);
        }
        echo json_encode($rows);
        break;

    // ── ADD ──────────────────────────────────────────────────────────────────
    case 'POST':
        $d         = json_decode(file_get_contents('php://input'), true) ?? [];
        $productId = (int)($d['product_id'] ?? 0);
        $imageUrl  = trim($d['image_url']  ?? '');
        if (!$productId || !$imageUrl) {
            http_response_code(400);
            echo json_encode(['error' => 'product_id and image_url are required']);
            exit;
        }
        $stmt = $pdo->prepare(
            "INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
             VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $productId,
            $imageUrl,
            trim($d['alt_text']   ?? ''),
            (int)(bool)($d['is_primary'] ?? false),
            (int)($d['sort_order'] ?? 0),
        ]);
        echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);
        break;

    // ── DELETE ───────────────────────────────────────────────────────────────
    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'id required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM product_images WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>
