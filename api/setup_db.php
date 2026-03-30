<?php
/**
 * Classyfitters — One-Click Database Setup
 *
 * Run this ONCE after uploading to Hostinger:
 *   https://yourdomain.com/api/setup_db.php
 *
 * It creates every table, seeds the admin user, and is safe
 * to run again (uses CREATE TABLE IF NOT EXISTS + INSERT IGNORE).
 *
 * DELETE THIS FILE from the server after setup is complete.
 */

require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

$log   = [];
$error = null;

function ok($msg)  { global $log; $log[] = ['ok',   $msg]; }
function info($msg){ global $log; $log[] = ['info', $msg]; }

try {
    $pdo = getDbConnection();
    ok('Connected to database: <strong>' . DB_NAME . '</strong>');

    // ── 1. users ─────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        username   VARCHAR(100) NOT NULL UNIQUE,
        email      VARCHAR(255) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        role       VARCHAR(50)  NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    ok('Table <code>users</code> ready');

    // ── 2. Admin user seed ────────────────────────────────────────────────
    $exists = $pdo->query("SELECT COUNT(*) FROM users WHERE username = 'admin'")->fetchColumn();
    if (!$exists) {
        $hash = password_hash('admin123', PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)")
            ->execute(['admin', 'admin@classyfitters.com', $hash, 'admin']);
        ok('Admin user created → username: <strong>admin</strong> / password: <strong>admin123</strong>');
    } else {
        info('Admin user already exists — skipped');
    }

    // ── 3. login_attempts ────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        ip_address   VARCHAR(45) NOT NULL,
        attempted_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ip_time (ip_address, attempted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    ok('Table <code>login_attempts</code> ready');

    // ── 4. user_sessions ─────────────────────────────────────────────────
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
    ok('Table <code>user_sessions</code> ready');

    // ── 5. cf_products ───────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS cf_products (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255)  NOT NULL,
        category    VARCHAR(100)  NOT NULL DEFAULT 'General',
        price       DECIMAL(10,2) NOT NULL,
        old_price   DECIMAL(10,2) DEFAULT NULL,
        description TEXT,
        image       VARCHAR(500)  DEFAULT '',
        sizes       VARCHAR(200)  DEFAULT '',
        colors      VARCHAR(200)  DEFAULT '',
        stock       INT           NOT NULL DEFAULT 0,
        featured    TINYINT(1)    NOT NULL DEFAULT 0,
        active      TINYINT(1)    NOT NULL DEFAULT 1,
        sort_order  INT           NOT NULL DEFAULT 0,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_active   (active),
        INDEX idx_featured (featured)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    ok('Table <code>cf_products</code> ready');

    $prodCount = $pdo->query("SELECT COUNT(*) FROM cf_products")->fetchColumn();
    info("Products currently in database: <strong>{$prodCount}</strong>");

    // ── 6. orders ────────────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        username       VARCHAR(100)  NOT NULL,
        email          VARCHAR(255)  NOT NULL,
        first_name     VARCHAR(100)  NOT NULL,
        last_name      VARCHAR(100)  NOT NULL,
        address        TEXT          NOT NULL,
        city           VARCHAR(100)  NOT NULL,
        postal_code    VARCHAR(20)   NOT NULL,
        payment_method VARCHAR(50)   NOT NULL,
        total          DECIMAL(10,2) NOT NULL,
        status         VARCHAR(50)   NOT NULL DEFAULT 'Pending',
        created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_status   (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    ok('Table <code>orders</code> ready');

    // ── 7. order_items ───────────────────────────────────────────────────
    $pdo->exec("CREATE TABLE IF NOT EXISTS order_items (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        order_id   INT           NOT NULL,
        product_id INT           NOT NULL,
        title      VARCHAR(255)  NOT NULL,
        price      DECIMAL(10,2) NOT NULL,
        quantity   INT           NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    ok('Table <code>order_items</code> ready');

    // ── 8. Verify images folder ───────────────────────────────────────────
    $imgDir = dirname(__DIR__) . '/images/products/';
    if (!is_dir($imgDir)) {
        mkdir($imgDir, 0755, true);
        ok('Created folder <code>images/products/</code> for product image uploads');
    } else {
        $imgCount = count(glob($imgDir . '*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE));
        info("Image upload folder exists — <strong>{$imgCount}</strong> product image(s) found");
    }

} catch (\Exception $e) {
    $error = $e->getMessage();
    error_log('setup_db error: ' . $error);
}

// ── Output ────────────────────────────────────────────────────────────────
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Classyfitters — DB Setup</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',sans-serif;background:#f7f7f9;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:#fff;border-radius:24px;padding:40px;max-width:620px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.08)}
  h1{font-size:22px;font-weight:900;color:#111;text-transform:uppercase;letter-spacing:-0.5px;margin-bottom:4px}
  .sub{font-size:11px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:2px;margin-bottom:28px}
  .log{list-style:none;space-y:4px}
  .log li{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border-radius:12px;font-size:13px;font-weight:600;margin-bottom:6px;line-height:1.5}
  .ok{background:#f0fdf4;color:#15803d}.ok::before{content:'✓';color:#22c55e;font-weight:900;flex-shrink:0}
  .info{background:#f0f9ff;color:#0369a1}.info::before{content:'ℹ';color:#38bdf8;font-weight:900;flex-shrink:0}
  .error-box{background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:20px;margin-top:20px;color:#dc2626;font-weight:700;font-size:13px}
  .success-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:16px;padding:20px;margin-top:20px;color:#15803d;font-weight:700;font-size:13px}
  .warn-box{background:#fffbeb;border:1px solid #fde68a;border-radius:16px;padding:16px;margin-top:20px;color:#92400e;font-size:12px;font-weight:600}
  code{background:#f1f5f9;padding:1px 6px;border-radius:4px;font-size:12px}
  strong{font-weight:900}
</style>
</head>
<body>
<div class="card">
  <h1>Classyfitters</h1>
  <div class="sub">Database Setup</div>

  <?php if ($error): ?>
    <div class="error-box">❌ Setup failed: <?= htmlspecialchars($error) ?></div>
    <div class="error-box" style="margin-top:12px;font-weight:600">
      Check that your DB credentials in <code>api/config.php</code> are correct and the database exists on Hostinger.
    </div>
  <?php else: ?>
    <ul class="log">
      <?php foreach ($log as [$type, $msg]): ?>
        <li class="<?= $type ?>"><?= $msg ?></li>
      <?php endforeach; ?>
    </ul>
    <div class="success-box">
      ✅ All tables are ready. Your store is live and connected to the database.
    </div>
    <div class="warn-box">
      ⚠️ <strong>Security:</strong> Delete or rename <code>api/setup_db.php</code> from the server now that setup is complete. This file is no longer needed and should not be publicly accessible.
    </div>
  <?php endif; ?>
</div>
</body>
</html>
