<?php
/**
 * Admin Image Upload API
 * POST multipart/form-data with field 'image'
 * Returns { success: true, url: "images/products/filename.jpg" }
 *
 * Requires valid admin Bearer token.
 */

require_once 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

$pdo = getDbConnection();
validateAuthToken($pdo, 'admin');

if (empty($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No image file provided.']);
    exit;
}

$file = $_FILES['image'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    $errMap = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server limit.',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form limit.',
        UPLOAD_ERR_PARTIAL    => 'File only partially uploaded.',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder.',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
        UPLOAD_ERR_EXTENSION  => 'Upload blocked by PHP extension.',
    ];
    http_response_code(400);
    echo json_encode(['error' => $errMap[$file['error']] ?? 'Upload failed.']);
    exit;
}

// Validate MIME type using finfo (not the spoofable $_FILES['type'])
$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);
$extMap   = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];
if (!array_key_exists($mimeType, $extMap)) {
    http_response_code(400);
    echo json_encode(['error' => 'Only JPEG, PNG, WebP and GIF images are allowed.']);
    exit;
}

// 5 MB max
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'Image must be under 5 MB.']);
    exit;
}

// Upload directory: <project-root>/images/products/
$uploadDir = dirname(__DIR__) . '/images/products/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$filename = 'product_' . bin2hex(random_bytes(8)) . '.' . $extMap[$mimeType];
$destPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save the uploaded file.']);
    exit;
}

echo json_encode([
    'success'  => true,
    'url'      => 'images/products/' . $filename,
    'filename' => $filename,
]);
?>
