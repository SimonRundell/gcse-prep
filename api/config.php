<?php
/**
 * @file config.php
 * @description Loads application configuration from .config.json.
 * @license Creative Commons NC-BY-SA 4.0
 */

$configPath = __DIR__ . '/../.config.json';
if (!file_exists($configPath)) {
    http_response_code(503);
    echo json_encode(['error' => '.config.json not found']);
    exit;
}
$config = json_decode(file_get_contents($configPath), true);
