<?php
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

$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

// Basic input presence + length check
if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password are required']);
    exit;
}

if (strlen($username) > 100 || strlen($password) > 128) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input length']);
    exit;
}

try {
    $pdo = getDbConnection();

    // ── Auto-create supporting tables if they don't exist ─────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        ip_address   VARCHAR(45) NOT NULL,
        attempted_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ip_time (ip_address, attempted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $pdo->exec("CREATE TABLE IF NOT EXISTS user_sessions (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        username   VARCHAR(100) NOT NULL,
        role       VARCHAR(20)  NOT NULL,
        token      VARCHAR(64)  NOT NULL UNIQUE,
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME     NOT NULL,
        INDEX idx_token    (token),
        INDEX idx_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // ── Rate limiting: 5 attempts per IP per 15 minutes ───────────────────
    $rawIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    // Use only the first IP if comma-separated (proxy chain)
    $rawIp = explode(',', $rawIp)[0];
    $ip = filter_var(trim($rawIp), FILTER_VALIDATE_IP) ?: '0.0.0.0';

    // Purge stale attempts to keep the table lean
    $pdo->exec("DELETE FROM login_attempts WHERE attempted_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE)");

    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM login_attempts
        WHERE ip_address = ? AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
    ");
    $stmt->execute([$ip]);
    $recentAttempts = (int)$stmt->fetchColumn();

    if ($recentAttempts >= 5) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many login attempts. Please wait 15 minutes and try again.']);
        exit;
    }

    // ── Authenticate ──────────────────────────────────────────────────────
    $stmt = $pdo->prepare("
        SELECT id, username, email, password, role
        FROM users
        WHERE username = ? OR email = ?
        LIMIT 1
    ");
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Clear failed attempts for this IP on success
        $pdo->prepare("DELETE FROM login_attempts WHERE ip_address = ?")->execute([$ip]);

        // Remove expired sessions for this user
        $pdo->prepare("DELETE FROM user_sessions WHERE username = ? AND expires_at <= NOW()")
            ->execute([$user['username']]);

        // Generate cryptographically secure 256-bit token (64-char hex)
        $token = bin2hex(random_bytes(32));

        $pdo->prepare("
            INSERT INTO user_sessions (username, role, token, expires_at)
            VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
        ")->execute([$user['username'], $user['role'], $token]);

        echo json_encode([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'username' => $user['username'],
                'email'    => $user['email'],
                'role'     => $user['role'],
            ]
        ]);

    } else {
        // Record failed attempt
        $pdo->prepare("INSERT INTO login_attempts (ip_address) VALUES (?)")->execute([$ip]);

        http_response_code(401);
        // Generic — don't reveal whether username or password was wrong
        echo json_encode(['error' => 'Invalid username or password']);
    }

} catch (\Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Service temporarily unavailable. Please try again.']);
}
?>
