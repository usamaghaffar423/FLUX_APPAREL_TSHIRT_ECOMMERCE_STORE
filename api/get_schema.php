<?php
/**
 * Schema Inspector
 * Opens in browser to dump all table/column info from classyfitters_db.
 * Used to verify exact column names before writing the main API files.
 */

require_once 'config.php';

try {
    $pdo = getDbConnection();

    $stmt = $pdo->query("
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_KEY, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '" . DB_NAME . "'
        ORDER BY TABLE_NAME, ORDINAL_POSITION
    ");

    $schema = [];
    while ($row = $stmt->fetch()) {
        $schema[$row['TABLE_NAME']][] = [
            'column'   => $row['COLUMN_NAME'],
            'type'     => $row['DATA_TYPE'],
            'key'      => $row['COLUMN_KEY'],
            'nullable' => $row['IS_NULLABLE'],
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($schema, JSON_PRETTY_PRINT);

} catch (\PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
}
?>
