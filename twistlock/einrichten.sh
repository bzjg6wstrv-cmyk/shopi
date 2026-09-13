#!/bin/bash
# =====================================================================
#  TWISTLOCK auf einem Server einrichten (Ubuntu 24.04)
#
#  Vorher:  1. Server bei Hetzner bestellen (Ubuntu 24.04)
#           2. Domain oder Subdomain auf die IP des Servers zeigen lassen
#           3. Diesen Ordner auf den Server kopieren, z. B. nach /opt/twistlock
#
#  Aufruf:  sudo bash einrichten.sh meine-domain.de
# =====================================================================
set -e

DOMAIN="$1"
if [ -z "$DOMAIN" ]; then
  echo "So starten:  sudo bash einrichten.sh dispo.deine-domain.de"
  exit 1
fi
ORDNER="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "==> 1 von 5: System aktualisieren"
apt update -y
apt install -y curl ca-certificates debian-keyring debian-archive-keyring apt-transport-https

echo ""
echo "==> 2 von 5: Node.js installieren"
if ! command -v node >/dev/null 2>&1; then
  apt install -y nodejs
fi
node --version

echo ""
echo "==> 3 von 5: Caddy installieren (macht https von allein)"
# Quelle: https://caddyserver.com/docs/install
if ! command -v caddy >/dev/null 2>&1; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    | tee /etc/apt/sources.list.d/caddy-stable.list
  chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  chmod o+r /etc/apt/sources.list.d/caddy-stable.list
  apt update -y
  apt install -y caddy
fi

echo ""
echo "==> 4 von 5: TWISTLOCK als Dienst einrichten (startet nach Neustart von allein)"
cat > /etc/systemd/system/twistlock.service <<DIENST
[Unit]
Description=TWISTLOCK
After=network.target

[Service]
Type=simple
WorkingDirectory=$ORDNER
ExecStart=$(command -v node) $ORDNER/server.js
Environment=PORT=3000
Environment=TZ=Europe/Berlin
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
DIENST

systemctl daemon-reload
systemctl enable twistlock
systemctl restart twistlock

echo ""
echo "==> 5 von 5: https einrichten für $DOMAIN"
cat > /etc/caddy/Caddyfile <<CADDY
$DOMAIN {
    encode gzip
    reverse_proxy 127.0.0.1:3000
}
CADDY
systemctl reload caddy || systemctl restart caddy

# Nächtliche Sicherung der Daten, 14 Tage aufbewahren
mkdir -p /var/backups/twistlock
cat > /etc/cron.daily/twistlock-backup <<'SICHERUNG'
#!/bin/bash
TAG=$(date +%F)
tar czf /var/backups/twistlock/$TAG.tar.gz -C ORDNERPLATZ daten fotos 2>/dev/null
find /var/backups/twistlock -name "*.tar.gz" -mtime +14 -delete
SICHERUNG
sed -i "s#ORDNERPLATZ#$ORDNER#" /etc/cron.daily/twistlock-backup
chmod +x /etc/cron.daily/twistlock-backup

echo ""
echo "====================================================="
echo "  Fertig."
echo ""
echo "  Adresse fuer die Fahrer:  https://$DOMAIN"
echo ""
echo "  Laeuft es?          systemctl status twistlock"
echo "  Neu starten:        systemctl restart twistlock"
echo "  Fehler ansehen:     journalctl -u twistlock -n 50"
echo "  Sicherungen:        /var/backups/twistlock"
echo "====================================================="
echo ""
echo "  Das https-Zertifikat kommt in ein bis zwei Minuten von allein."
echo "  Wichtig: Die Domain muss schon auf diesen Server zeigen."
echo ""
