<?php
/**
 * @file ai.php
 * @description Anthropic API proxy — keeps the API key server-side and out of the browser.
 * POST { system: string, userMsg: string, maxTokens?: number }
 * Returns { text: string }
 * @license Creative Commons NC-BY-SA 4.0
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/config.php';

$body      = json_decode(file_get_contents('php://input'), true);
$system    = trim($body['system']   ?? '');
$userMsg   = trim($body['userMsg']  ?? '');
$maxTokens = (int) ($body['maxTokens'] ?? 800);

if (!$system || !$userMsg) {
    http_response_code(400);
    echo json_encode(['error' => 'system and userMsg are required']);
    exit;
}

$payload = json_encode([
    'model'      => 'claude-sonnet-4-6',
    'max_tokens' => $maxTokens,
    'system'     => $system,
    'messages'   => [['role' => 'user', 'content' => $userMsg]],
]);

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . $config['anthropicApiKey'],
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_TIMEOUT        => 60,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(502);
    echo json_encode(['error' => 'cURL error: ' . $curlErr]);
    exit;
}

if ($httpCode !== 200) {
    http_response_code(502);
    echo json_encode(['error' => 'Anthropic API error', 'status' => $httpCode, 'body' => $response]);
    exit;
}

$data = json_decode($response, true);
$text = implode('', array_map(fn($c) => $c['text'] ?? '', $data['content'] ?? []));

echo json_encode(['text' => $text]);
