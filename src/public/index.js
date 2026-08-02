<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Urban Sync Bot</title>

    <link rel="stylesheet" href="style.css" />
</head>

<body>

    <div class="container">

        <h1>🤖 Urban Sync Bot</h1>

        <div class="card">

            <h2>Status</h2>

            <p id="status">
                🔴 Disconnected
            </p>

        </div>

        <div class="card">

            <h2>Phone Number</h2>

            <p id="number">
                Not Connected
            </p>

        </div>

        <div class="card">

            <button id="qrBtn">
                Generate QR
            </button>

            <button id="pairBtn">
                Pair with Phone Number
            </button>

        </div>

        <div class="card">

            <h2>Logs</h2>

            <pre id="logs">
Waiting...
            </pre>

        </div>

    </div>

    <script src="script.js"></script>

</body>

</html>
