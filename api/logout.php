<?php
/**
 * Logout API — Invalidates the session token server-side.
 */

require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
    $token = substr($authHeader, 7);

    if (strlen($token) === 64 && ctype_xdigit($token)) {
        try {
            $pdo = getDbConnection();
            $pdo->prepare("DELETE FROM user_sessions WHERE token = ?")->execute([$token]);
        } catch (\Exception $e) {
            // Silently log — token will expire naturally anyway
            error_log('Logout error: ' . $e->getMessage());
        }
    }
}

// Always respond with success — client should clear its storage regardless
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>
