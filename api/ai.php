<?php
/**
 * @file ai.php
 * @description LLM API proxy — keeps the API key server-side and out of the browser.
 *   The provider, endpoint URL, model and key are read from the "ai" block of
 *   .config.json, so the app can be pointed at any Anthropic or OpenAI-compatible
 *   endpoint (Ollama, OpenRouter, Groq, Mistral, etc.) without code changes:
 *
 *   "ai": {
 *     "provider": "anthropic",                              // "anthropic" | "openai"
 *     "endpoint": "https://api.anthropic.com/v1/messages",  // full URL of the chat endpoint
 *     "model":    "claude-sonnet-4-6",
 *     "apiKey":   ""                                        // falls back to anthropicApiKey
 *   }
 *
 *   "anthropic" speaks the Anthropic Messages API; "openai" speaks the
 *   chat-completions format used by most other providers and local runtimes.
 *
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

$ai       = $config['ai'] ?? [];
$provider = $ai['provider'] ?? 'anthropic';
$model    = $ai['model']    ?? 'claude-sonnet-4-6';
$apiKey   = $ai['apiKey']   ?: ($config['anthropicApiKey'] ?? '');
$endpoint = $ai['endpoint'] ?? ($provider === 'anthropic'
    ? 'https://api.anthropic.com/v1/messages'
    : 'https://api.openai.com/v1/chat/completions');

$body      = json_decode(file_get_contents('php://input'), true);
$system    = trim($body['system']   ?? '');
$userMsg   = trim($body['userMsg']  ?? '');
$maxTokens = (int) ($body['maxTokens'] ?? 800);

if (!$system || !$userMsg) {
    http_response_code(400);
    echo json_encode(['error' => 'system and userMsg are required']);
    exit;
}

if ($provider === 'anthropic') {
    $payload = json_encode([
        'model'      => $model,
        'max_tokens' => $maxTokens,
        'system'     => $system,
        'messages'   => [['role' => 'user', 'content' => $userMsg]],
    ]);
    $headers = [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
    ];
} else {
    // OpenAI-compatible chat completions (OpenAI, Ollama, OpenRouter, Groq, …)
    $payload = json_encode([
        'model'      => $model,
        'max_tokens' => $maxTokens,
        'messages'   => [
            ['role' => 'system', 'content' => $system],
            ['role' => 'user',   'content' => $userMsg],
        ],
    ]);
    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
    ];
}

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => $headers,
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
    echo json_encode(['error' => 'AI provider error', 'provider' => $provider, 'status' => $httpCode, 'body' => $response]);
    exit;
}

$data = json_decode($response, true);

if ($provider === 'anthropic') {
    $text = implode('', array_map(fn($c) => $c['text'] ?? '', $data['content'] ?? []));
} else {
    $text = $data['choices'][0]['message']['content'] ?? '';
}

echo json_encode(['text' => $text]);
