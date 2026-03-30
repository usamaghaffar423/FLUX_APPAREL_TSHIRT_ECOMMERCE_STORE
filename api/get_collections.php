<?php
/**
 * GET Collections API
 * Returns all collections from classyfitters_db.
 */

require_once 'config.php';

try {
    $pdo = getDbConnection();

    $stmt = $pdo->query("SELECT * FROM collections ORDER BY name ASC");
    $collections = $stmt->fetchAll();

    header('Content-Type: application/json');
    echo json_encode($collections);

} catch (\PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
}
?>
