<?php
/**
 * Database Connection Test
 * Upload this to your api/ folder and visit it in browser to test DB connection
 */

require_once 'config.php';

try {
    $pdo = getDbConnection();
    echo "<h2>✅ Database Connection Successful!</h2>";
    echo "<p>Connected to: " . DB_NAME . "</p>";

    // Test if tables exist
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<h3>Available Tables:</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>" . htmlspecialchars($table) . "</li>";
    }
    echo "</ul>";

    // Test a simple query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM products");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p>Products in database: " . $result['count'] . "</p>";

} catch (PDOException $e) {
    echo "<h2>❌ Database Connection Failed</h2>";
    echo "<p>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Please check your database credentials in config.php</p>";
}
?>