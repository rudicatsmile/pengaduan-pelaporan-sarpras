<?php
$ch = curl_init('https://kudus.wablas.com/api/send-message');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: dummy']);
$res = curl_exec($ch);
echo "V1 RESPONSE:\n";
var_dump($res);

$ch2 = curl_init('https://kudus.wablas.com/api/v2/send-message');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_POST, true);
curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Authorization: dummy']);
$res2 = curl_exec($ch2);
echo "V2 RESPONSE:\n";
var_dump($res2);
