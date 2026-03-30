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
$email    = trim($data['email']    ?? '');
$password = $data['password']      ?? '';

// ── Input Validation ─────────────────────────────────────────────────────

if (empty($username) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

// Username: 3-30 chars, letters/numbers/underscores only
if (strlen($username) < 3 || strlen($username) > 30) {
    http_response_code(400);
    echo json_encode(['error' => 'Username must be between 3 and 30 characters']);
    exit;
}

if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username can only contain letters, numbers, and underscores']);
    exit;
}

// Email: valid format, max 255 chars
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a valid email address']);
    exit;
}

// Password: 8-128 chars minimum
if (strlen($password) < 8 || strlen($password) > 128) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be between 8 and 128 characters']);
    exit;
}

try {
    $pdo = getDbConnection();

    // Check if username or email already taken
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1");
    $stmt->execute([$username, $email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Username or email is already registered']);
        exit;
    }

    // Hash with bcrypt (PASSWORD_DEFAULT)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'customer')");
    $stmt->execute([$username, $email, $hashedPassword]);

    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully',
        'user'    => [
            'username' => $username,
            'role'     => 'customer'
        ]
    ]);

} catch (\PDOException $e) {
    error_log('Register error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Could not create account. Please try again.']);
}
?>
