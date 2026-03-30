<?php
/**
 * Local Development Database Configuration
 * Use this for local testing with XAMPP
 */

// Hostinger DB Host is usually 'localhost'
define('DB_HOST', 'localhost');

// Your Local Database User (usually 'root' for XAMPP)
define('DB_USER', 'root');

// Your Local Database Password (usually empty for XAMPP)
define('DB_PASS', '');

// Your Local Database Name
define('DB_NAME', 'classyfitters_db');

// CORS Headers for development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

/**
 * Get a PDO connection to classyfitters_db
 */
function getDbConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Connection failed', 'message' => $e->getMessage()]);
        exit;
    }
}
?>