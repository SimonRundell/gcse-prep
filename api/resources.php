<?php
/**
 * @file resources.php
 * @description CRUD REST endpoint for all editable resources.
 *   GET    /api/resources.php?type=<type>         → open (no auth)
 *   POST   /api/resources.php?type=<type>         → create  (auth required)
 *   PUT    /api/resources.php?type=<type>&id=<id> → update  (auth required)
 *   DELETE /api/resources.php?type=<type>&id=<id> → delete  (auth required)
 *
 *   Types: questions | words | videos | blueprint | boards
 *
 * Copyright (c) 2026 Becky Hingston & Simon Rundell, Exeter College Faculty of ITDD
 * Creative Commons NC-BY-SA 4.0
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require 'config.php';

/** @return PDO */
function db(): PDO {
    static $pdo;
    if ($pdo) return $pdo;
    global $config;
    $d = $config['db'] ?? [];
    $pdo = new PDO(
        'mysql:host=' . ($d['host'] ?? 'localhost') . ';dbname=' . ($d['name'] ?? 'gcse_prep') . ';charset=utf8mb4',
        $d['user'] ?? 'root',
        $d['password'] ?? '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    return $pdo;
}

function requireAuth(): void {
    if (empty($_SESSION['admin_logged_in'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorised']);
        exit;
    }
}

function json_decode_field(array &$row, string $field): void {
    if (isset($row[$field]) && is_string($row[$field])) {
        $row[$field] = json_decode($row[$field], true);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$type   = $_GET['type'] ?? '';
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$body   = ($method !== 'GET') ? json_decode(file_get_contents('php://input'), true) ?? [] : [];

// ----------------------------------------------------------------
try {
    switch ($type) {

        // ---- QUESTION BANK ----------------------------------------
        case 'questions':
            if ($method === 'GET') {
                $rows = db()->query('SELECT * FROM question_bank ORDER BY sort_order, slot')->fetchAll();
                echo json_encode($rows);
                break;
            }
            requireAuth();
            if ($method === 'POST') {
                $s = db()->prepare('INSERT INTO question_bank (slot, topic, question, answer, marks, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
                $s->execute([$body['slot']??'', $body['topic']??'', $body['question']??'', $body['answer']??'', (int)($body['marks']??1), (int)($body['sort_order']??0)]);
                echo json_encode(['id' => (int)db()->lastInsertId()]);
                break;
            }
            if ($method === 'PUT' && $id) {
                $s = db()->prepare('UPDATE question_bank SET slot=?, topic=?, question=?, answer=?, marks=?, sort_order=? WHERE id=?');
                $s->execute([$body['slot']??'', $body['topic']??'', $body['question']??'', $body['answer']??'', (int)($body['marks']??1), (int)($body['sort_order']??0), $id]);
                echo json_encode(['ok' => true]);
                break;
            }
            if ($method === 'DELETE' && $id) {
                db()->prepare('DELETE FROM question_bank WHERE id=?')->execute([$id]);
                echo json_encode(['ok' => true]);
                break;
            }
            break;

        // ---- WORDS ------------------------------------------------
        case 'words':
            if ($method === 'GET') {
                $rows = db()->query('SELECT * FROM words ORDER BY sort_order, word')->fetchAll();
                echo json_encode($rows);
                break;
            }
            requireAuth();
            if ($method === 'POST') {
                $s = db()->prepare('INSERT INTO words (word, clue, subject, sort_order) VALUES (?, ?, ?, ?)');
                $s->execute([$body['word']??'', $body['clue']??'', $body['subject']??'', (int)($body['sort_order']??0)]);
                echo json_encode(['id' => (int)db()->lastInsertId()]);
                break;
            }
            if ($method === 'PUT' && $id) {
                $s = db()->prepare('UPDATE words SET word=?, clue=?, subject=?, sort_order=? WHERE id=?');
                $s->execute([$body['word']??'', $body['clue']??'', $body['subject']??'', (int)($body['sort_order']??0), $id]);
                echo json_encode(['ok' => true]);
                break;
            }
            if ($method === 'DELETE' && $id) {
                db()->prepare('DELETE FROM words WHERE id=?')->execute([$id]);
                echo json_encode(['ok' => true]);
                break;
            }
            break;

        // ---- VIDEO CHANNELS ---------------------------------------
        case 'videos':
            if ($method === 'GET') {
                $rows = db()->query('SELECT * FROM video_channels ORDER BY subject, sort_order')->fetchAll();
                foreach ($rows as &$r) json_decode_field($r, 'topics');
                echo json_encode($rows);
                break;
            }
            requireAuth();
            $topicsJson = json_encode($body['topics'] ?? [], JSON_UNESCAPED_UNICODE);
            if ($method === 'POST') {
                $s = db()->prepare('INSERT INTO video_channels (subject, name, emoji, bg, url, description, topics, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
                $s->execute([$body['subject']??'', $body['name']??'', $body['emoji']??'', $body['bg']??'', $body['url']??'', $body['description']??'', $topicsJson, (int)($body['sort_order']??0)]);
                echo json_encode(['id' => (int)db()->lastInsertId()]);
                break;
            }
            if ($method === 'PUT' && $id) {
                $s = db()->prepare('UPDATE video_channels SET subject=?, name=?, emoji=?, bg=?, url=?, description=?, topics=?, sort_order=? WHERE id=?');
                $s->execute([$body['subject']??'', $body['name']??'', $body['emoji']??'', $body['bg']??'', $body['url']??'', $body['description']??'', $topicsJson, (int)($body['sort_order']??0), $id]);
                echo json_encode(['ok' => true]);
                break;
            }
            if ($method === 'DELETE' && $id) {
                db()->prepare('DELETE FROM video_channels WHERE id=?')->execute([$id]);
                echo json_encode(['ok' => true]);
                break;
            }
            break;

        // ---- BLUEPRINT --------------------------------------------
        case 'blueprint':
            if ($method === 'GET') {
                $rows = db()->query('SELECT * FROM blueprint ORDER BY sort_order, q_ref')->fetchAll();
                echo json_encode($rows);
                break;
            }
            requireAuth();
            if ($method === 'POST') {
                $s = db()->prepare('INSERT INTO blueprint (q_ref, topic, style, marks, sort_order) VALUES (?, ?, ?, ?, ?)');
                $s->execute([$body['q_ref']??'', $body['topic']??'', $body['style']??'', (int)($body['marks']??1), (int)($body['sort_order']??0)]);
                echo json_encode(['id' => (int)db()->lastInsertId()]);
                break;
            }
            if ($method === 'PUT' && $id) {
                $s = db()->prepare('UPDATE blueprint SET q_ref=?, topic=?, style=?, marks=?, sort_order=? WHERE id=?');
                $s->execute([$body['q_ref']??'', $body['topic']??'', $body['style']??'', (int)($body['marks']??1), (int)($body['sort_order']??0), $id]);
                echo json_encode(['ok' => true]);
                break;
            }
            if ($method === 'DELETE' && $id) {
                db()->prepare('DELETE FROM blueprint WHERE id=?')->execute([$id]);
                echo json_encode(['ok' => true]);
                break;
            }
            break;

        // ---- BOARDS -----------------------------------------------
        case 'boards':
            if ($method === 'GET') {
                $rows = db()->query('SELECT * FROM boards ORDER BY board_code')->fetchAll();
                foreach ($rows as &$r) json_decode_field($r, 'data');
                $configRows = db()->query('SELECT config_key, config_value FROM board_config')->fetchAll();
                $config = [];
                foreach ($configRows as $cr) {
                    $config[$cr['config_key']] = json_decode($cr['config_value'], true);
                }
                echo json_encode(['boards' => $rows, 'config' => $config]);
                break;
            }
            requireAuth();
            if ($method === 'PUT' && $id) {
                // Update board row (color + data JSON)
                $dataJson = is_string($body['data'] ?? null) ? $body['data'] : json_encode($body['data'] ?? [], JSON_UNESCAPED_UNICODE);
                $s = db()->prepare('UPDATE boards SET color=?, data=? WHERE id=?');
                $s->execute([$body['color']??'', $dataJson, $id]);
                echo json_encode(['ok' => true]);
                break;
            }
            if ($method === 'POST' && ($body['config_key'] ?? '')) {
                // Upsert a board_config row
                $s = db()->prepare('INSERT INTO board_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)');
                $s->execute([$body['config_key'], json_encode($body['config_value'] ?? [], JSON_UNESCAPED_UNICODE)]);
                echo json_encode(['ok' => true]);
                break;
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Unknown resource type']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
