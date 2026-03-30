<?php
/**
 * Admin Products API — simple CRUD on the cf_products flat table.
 * Table is auto-created on first call — no migrations needed.
 *
 * GET              → list all products (admin view, incl. inactive)
 * POST             → create product
 * PUT  ?id=X       → update product
 * DELETE ?id=X     → soft-delete  (active = 0)
 *
 * All methods require admin Bearer token.
 */

require_once 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$pdo     = getDbConnection();
$session = validateAuthToken($pdo, 'admin');

// ── Auto-create table on first use ────────────────────────────────────────
$pdo->exec("CREATE TABLE IF NOT EXISTS cf_products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    category    VARCHAR(100)   NOT NULL DEFAULT 'General',
    price       DECIMAL(10,2)  NOT NULL,
    old_price   DECIMAL(10,2)  DEFAULT NULL,
    description TEXT,
    image       VARCHAR(500)   DEFAULT '',
    sizes       VARCHAR(200)   DEFAULT '',
    colors      VARCHAR(200)   DEFAULT '',
    stock       INT            NOT NULL DEFAULT 0,
    featured    TINYINT(1)     NOT NULL DEFAULT 0,
    active      TINYINT(1)     NOT NULL DEFAULT 1,
    sort_order  INT            NOT NULL DEFAULT 0,
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$method = $_SERVER['REQUEST_METHOD'];

// ── Resolve image URL helper ──────────────────────────────────────────────
function imgUrl($raw) {
    if (!$raw) return '';
    if (str_starts_with($raw, 'http')) return $raw;
    $protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host      = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $root      = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api/')), '/');
    return $protocol . '://' . $host . $root . '/' . ltrim($raw, '/');
}

switch ($method) {

    // ── LIST ─────────────────────────────────────────────────────────────
    case 'GET':
        $search = trim($_GET['search'] ?? '');
        $cat    = trim($_GET['category'] ?? '');

        $sql    = "SELECT * FROM cf_products WHERE 1=1";
        $params = [];

        if ($search) {
            $sql .= " AND (name LIKE ? OR description LIKE ? OR category LIKE ?)";
            $params = array_merge($params, ["%$search%", "%$search%", "%$search%"]);
        }
        if ($cat) {
            $sql .= " AND category = ?";
            $params[] = $cat;
        }
        $sql .= " ORDER BY sort_order ASC, created_at DESC LIMIT 500";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        foreach ($rows as &$r) {
            $r['id']        = (int)$r['id'];
            $r['price']     = (float)$r['price'];
            $r['old_price'] = $r['old_price'] ? (float)$r['old_price'] : null;
            $r['stock']     = (int)$r['stock'];
            $r['featured']  = (bool)$r['featured'];
            $r['active']    = (bool)$r['active'];
            $r['sort_order']= (int)$r['sort_order'];
            $r['image']     = imgUrl($r['image']);
        }
        unset($r);
        echo json_encode($rows);
        break;

    // ── CREATE ────────────────────────────────────────────────────────────
    case 'POST':
        $d = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($d['name']) || !isset($d['price'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and price are required.']);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO cf_products
                (name, category, price, old_price, description, image, sizes, colors, stock, featured, active, sort_order)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        ");
        $stmt->execute([
            trim($d['name']),
            trim($d['category']    ?? 'General'),
            (float)$d['price'],
            !empty($d['old_price']) ? (float)$d['old_price'] : null,
            trim($d['description'] ?? ''),
            trim($d['image']       ?? ''),
            trim($d['sizes']       ?? ''),
            trim($d['colors']      ?? ''),
            (int)($d['stock']      ?? 0),
            (int)(bool)($d['featured'] ?? false),
            (int)(bool)($d['active']   ?? true),
            (int)($d['sort_order'] ?? 0),
        ]);
        echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);
        break;

    // ── UPDATE ────────────────────────────────────────────────────────────
    case 'PUT':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID required.']); exit; }

        $d = json_decode(file_get_contents('php://input'), true) ?? [];
        if (empty($d['name']) || !isset($d['price'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and price are required.']);
            exit;
        }

        $stmt = $pdo->prepare("
            UPDATE cf_products SET
                name        = ?, category    = ?, price    = ?, old_price = ?,
                description = ?, image       = ?, sizes    = ?, colors    = ?,
                stock       = ?, featured    = ?, active   = ?, sort_order = ?
            WHERE id = ?
        ");
        $stmt->execute([
            trim($d['name']),
            trim($d['category']    ?? 'General'),
            (float)$d['price'],
            !empty($d['old_price']) ? (float)$d['old_price'] : null,
            trim($d['description'] ?? ''),
            trim($d['image']       ?? ''),
            trim($d['sizes']       ?? ''),
            trim($d['colors']      ?? ''),
            (int)($d['stock']      ?? 0),
            (int)(bool)($d['featured'] ?? false),
            (int)(bool)($d['active']   ?? true),
            (int)($d['sort_order'] ?? 0),
            $id,
        ]);
        echo json_encode(['success' => true]);
        break;

    // ── DELETE (soft) ─────────────────────────────────────────────────────
    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID required.']); exit; }

        $pdo->prepare("UPDATE cf_products SET active = 0 WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed.']);
}
?>
