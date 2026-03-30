<?php
/**
 * Database Configuration & Security Utilities
 *
 * Auto-detects local vs production environment.
 * Local  → XAMPP (localhost, root, no password)
 * Production → Hostinger (fill credentials below)
 */

// ── Environment Detection ─────────────────────────────────────────────────
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$isProduction = !in_array(strtolower(explode(':', $host)[0]), ['localhost', '127.0.0.1', '::1']);

// ── Database Credentials ──────────────────────────────────────────────────
if ($isProduction) {
    // ▼▼ HOSTINGER — fill these in once, never touch again ▼▼
    define('DB_HOST', 'localhost');                      // Hostinger always uses localhost
    define('DB_USER', 'u463999436_classyfitters');        // Hostinger DB username
    define('DB_PASS', 'Fitters@9911323!');     // ← Paste your password here
    define('DB_NAME', 'u463999436_classyfitters');      // Hostinger DB name
} else {
    // ▼▼ LOCAL (XAMPP) ▼▼
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'classifitter_db');
}

// ── CORS ──────────────────────────────────────────────────────────────────
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost',
    'https://classyfitters.shop',
    'https://www.classyfitters.shop',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
} elseif (!empty($origin)) {
    http_response_code(403);
    header('Content-Type: application/json');
    die(json_encode(['error' => 'Origin not allowed']));
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// ── PDO Connection ────────────────────────────────────────────────────────
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        return $pdo;
    } catch (\PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        error_log('DB Connection failed: ' . $e->getMessage());
        die(json_encode(['error' => 'Service temporarily unavailable. Please try again later.']));
    }
}

// ── Auth Token Validator ──────────────────────────────────────────────────
function validateAuthToken($pdo, $requiredRole = null) {
    // Apache may strip HTTP_AUTHORIZATION — check all known locations
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
               ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
               ?? '';

    if (empty($authHeader) && function_exists('getallheaders')) {
        $all = getallheaders();
        $authHeader = $all['Authorization'] ?? $all['authorization'] ?? '';
    }

    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        header('Content-Type: application/json');
        die(json_encode(['error' => 'Authentication required. Please log in.']));
    }

    $token = substr($authHeader, 7);

    if (strlen($token) !== 64 || !ctype_xdigit($token)) {
        http_response_code(401);
        header('Content-Type: application/json');
        die(json_encode(['error' => 'Invalid token format.']));
    }

    $stmt = $pdo->prepare("
        SELECT username, role FROM user_sessions
        WHERE token = ? AND expires_at > NOW()
        LIMIT 1
    ");
    $stmt->execute([$token]);
    $session = $stmt->fetch();

    if (!$session) {
        http_response_code(401);
        header('Content-Type: application/json');
        die(json_encode(['error' => 'Session expired or invalid. Please log in again.']));
    }

    if ($requiredRole !== null && $session['role'] !== $requiredRole) {
        http_response_code(403);
        header('Content-Type: application/json');
        die(json_encode(['error' => 'Access denied. Insufficient permissions.']));
    }

    return $session;
}
?>
