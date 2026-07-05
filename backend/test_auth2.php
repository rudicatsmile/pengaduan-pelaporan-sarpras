<?php
require __DIR__."/vendor/autoload.php";
$app = require_once __DIR__."/bootstrap/app.php";

$tokenStr = "14|9H46J7XVwZ1GkPxJzQmqXEbVh2vwO2ZGSAAdYImmc7225a07";
$accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);
if (!$accessToken) {
    echo "findToken failed\n";
} else {
    echo "Found token!\n";
    $guard = new \Laravel\Sanctum\Guard(app("auth"), config("sanctum.expiration"), "sanctum");
    
    // Check if valid
    $reflection = new ReflectionClass($guard);
    $method = $reflection->getMethod("isValidAccessToken");
    $method->setAccessible(true);
    $isValid = $method->invoke($guard, $accessToken);
    echo "isValidAccessToken: " . ($isValid ? "true" : "false") . "\n";
    
    $method2 = $reflection->getMethod("supportsTokens");
    $method2->setAccessible(true);
    $supports = $method2->invoke($guard, $accessToken->tokenable);
    echo "supportsTokens: " . ($supports ? "true" : "false") . "\n";
}

