<?php
/**
 * GET Categories — returns distinct categories from cf_products.
 * Shop.jsx expects: [{id, name, slug}]
 */

require_once 'config.php';
header('Content-Type: application/json');

try {
    $pdo = getDbConnection();

    // If cf_products doesn't exist yet, return empty
    $tableExists = $pdo->query("SHOW TABLES LIKE 'cf_products'")->fetchColumn();
    if (!$tableExists) {
        echo json_encode([]);
        exit;
    }

    $rows = $pdo->query("
        SELECT DISTINCT category
        FROM cf_products
        WHERE active = 1 AND category != ''
        ORDER BY category ASC
    ")->fetchAll();

    $cats = [];
    foreach ($rows as $i => $row) {
        $cats[] = [
            'id'   => $i + 1,
            'name' => $row['category'],
            'slug' => strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $row['category'])),
        ];
    }

    echo json_encode($cats);

} catch (\Throwable $e) {
    error_log('get_categories error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load categories.']);
}
?>
