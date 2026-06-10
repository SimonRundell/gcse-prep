<?php
/**
 * @file scores.php
 * @description REST endpoint for leaderboard scores (MySQL-backed).
 * GET    ?playerId=xxx           → returns up to 50 recent scores for that player
 * POST   { playerId, game, score, gameType } → add a new score entry
 * DELETE ?playerId=xxx           → clear all scores for that player
 * @license Creative Commons NC-BY-SA 4.0
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

try {
    $pdo = new PDO(
        "mysql:host={$config['db']['host']};dbname={$config['db']['name']};charset=utf8mb4",
        $config['db']['user'],
        $config['db']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(['error' => 'Database unavailable']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $playerId = $_GET['playerId'] ?? '';
    $stmt = $pdo->prepare(
        "SELECT game, score, game_type AS type, DATE_FORMAT(date_played, '%d/%m/%Y') AS date
         FROM gcse_scores
         WHERE player_id = ?
         ORDER BY created_at DESC
         LIMIT 50"
    );
    $stmt->execute([$playerId]);
    echo json_encode($stmt->fetchAll());

} elseif ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare(
        "INSERT INTO gcse_scores (player_id, game, score, game_type, date_played)
         VALUES (?, ?, ?, ?, CURDATE())"
    );
    $stmt->execute([
        $body['playerId']  ?? '',
        $body['game']      ?? '',
        (int) ($body['score']    ?? 0),
        $body['gameType']  ?? '',
    ]);
    echo json_encode(['ok' => true]);

} elseif ($method === 'DELETE') {
    $playerId = $_GET['playerId'] ?? '';
    $stmt = $pdo->prepare("DELETE FROM gcse_scores WHERE player_id = ?");
    $stmt->execute([$playerId]);
    echo json_encode(['ok' => true]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
