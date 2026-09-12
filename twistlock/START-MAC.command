#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js fehlt noch."
  echo "  Bitte einmalig von https://nodejs.org herunterladen und installieren,"
  echo "  danach diese Datei nochmal starten."
  echo ""
  read -n 1 -s
  exit 1
fi
echo ""
echo "  TWISTLOCK startet..."
echo "  Gleich oeffnet sich der Browser. Dieses Fenster bitte offen lassen."
echo ""
( sleep 2; open http://localhost:3000 ) &
node server.js
