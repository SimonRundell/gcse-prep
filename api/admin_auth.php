<?php
/**
 * @file admin_auth.php
 * @description Admin authentication endpoint.
 *   GET  → {loggedIn: bool, hasAdmin: bool}
 *   POST {action:'login',  email, password} → {ok: true} | {error}
 *   POST {action:'logout'}                  → {ok: true}
 *   POST {action:'setup',  email, password} → {ok: true} | {error}  (only if no admin exists)
 *
 * Copyright (c) 2026 Becky Hingston & Simon Rundell, Exeter College Faculty of ITDD
 * Creative Commons NC-BY-SA 4.0
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require 'config.php';

/** @return PDO */
function db(): PDO {
    static $pdo;
    if ($pdo) return $pdo;
    global $config;
    $db = $config['db'] ?? [];
    $pdo = new PDO(
        'mysql:host=' . ($db['host'] ?? 'localhost') . ';dbname=' . ($db['name'] ?? 'gcse_prep') . ';charset=utf8mb4',
        $db['user'] ?? 'root',
        $db['password'] ?? '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    return $pdo;
}

/** @return bool */
function hasAdminUsers(): bool {
    try {
        $row = db()->query('SELECT COUNT(*) AS n FROM admin_users')->fetch();
        return (int)($row['n'] ?? 0) > 0;
    } catch (Exception $e) {
        return false;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode([
        'loggedIn' => !empty($_SESSION['admin_logged_in']),
        'hasAdmin' => hasAdminUsers(),
    ]);
    exit;
}

if ($method === 'POST') {
    $body   = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $body['action'] ?? '';

    if ($action === 'logout') {
        session_destroy();
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($action === 'login') {
        $email    = trim($body['email']    ?? '');
        $password = trim($body['password'] ?? '');
        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            exit;
        }
        try {
            $stmt = db()->prepare('SELECT id, password_hash FROM admin_users WHERE email = ?');
            $stmt->execute([$email]);
            $row  = $stmt->fetch();
            if ($row && password_verify($password, $row['password_hash'])) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_email']     = $email;
                echo json_encode(['ok' => true]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid email or password']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
        exit;
    }

    if ($action === 'setup') {
        if (hasAdminUsers()) {
            http_response_code(403);
            echo json_encode(['error' => 'Admin account already exists']);
            exit;
        }
        $email    = trim($body['email']    ?? '');
        $password = trim($body['password'] ?? '');
        if (!$email || !$password || strlen($password) < 8) {
            http_response_code(400);
            echo json_encode(['error' => 'A valid email and a password of at least 8 characters are required']);
            exit;
        }
        try {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            db()->prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)')->execute([$email, $hash]);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_email']     = $email;
            echo json_encode(['ok' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not create admin account']);
        }
        exit;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Unknown action']);
}
