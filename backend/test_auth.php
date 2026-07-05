<?php
require __DIR__."/vendor/autoload.php";
$app = require_once __DIR__."/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create("http://127.0.0.1:8000/api/asset-inspections/get-assets?room_id=45", "GET");
$request->headers->set("Accept", "application/json");
$request->headers->set("Authorization", "Bearer 14|9H46J7XVwZ1GkPxJzQmqXEbVh2vwO2ZGSAAdYImmc7225a07");
$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
