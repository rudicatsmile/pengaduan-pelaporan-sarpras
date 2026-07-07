<!DOCTYPE html>
<html>
<head>
    <title>QR Code Ruangan - {{ $room->name }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .container {
            border: 2px solid #333;
            padding: 20px;
            display: inline-block;
            border-radius: 10px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        h2 {
            font-size: 18px;
            color: #666;
            margin-bottom: 30px;
        }
        .qr-image {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- <h1>LAPOR KERUSAKAN</h1> -->
        <h2>{{ $room->name }}</h2>
        
        <div class="qr-image">
            <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR Code">
        </div>
        
        <p>Scan QR Code ini melalui aplikasi {{ $appName ?? (\App\Models\Setting::where('key', 'app_name')->value('value') ?? 'SIGAP') }}.</p>
    </div>
</body>
</html>
