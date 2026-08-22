#!/usr/bin/env python3
"""
Erzeugt die gekennzeichneten Bildplatzhalter in src/assets/img/.

Nur ein Hilfsmittel für die Bauphase — für den Betrieb der Website nicht nötig.
Sobald echte Fotos vorliegen, werden die Dateien einfach überschrieben
(siehe src/assets/img/README.md).

    pip install Pillow
    python3 tools/make-placeholders.py [--font-bold Archivo-Bold.ttf --font-regular Archivo-Medium.ttf]
"""
import argparse
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'img')

NAVY_MID = (12, 36, 63)
NAVY_LINE = (20, 51, 84)
YELLOW = (242, 196, 0)
WHITE = (255, 255, 255)
MUTED = (157, 173, 190)

DEJAVU = '/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'

SLOTS = [
    ('hero-fernverkehr', 1200, 1600, 'Sattelzug im Fernverkehr'),
    ('containerverkehr', 1800, 1200, 'Containerverkehr / Terminal'),
    ('autobahn-band', 2400, 1030, 'Autobahn / Europaverkehr'),
    ('verladung', 1600, 1200, 'Verladung / Logistikhof'),
]


def bez(p0, p1, p2, p3, n=96):
    pts = []
    for i in range(n + 1):
        t = i / n
        m = 1 - t
        pts.append((
            m ** 3 * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t ** 3 * p3[0],
            m ** 3 * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t ** 3 * p3[1],
        ))
    return pts


def swoosh(target, x, y, w, ss=4):
    """Bewegungslinie aus dem Logo, überabgetastet für saubere Kanten."""
    s = w / 711.0
    h = round(204 * s)
    layer = Image.new('RGBA', (max(1, round(w * ss)), max(1, h * ss)), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    sc = s * ss
    width = max(2, round(45 * sc))
    p = lambda px, py: (px * sc, py * sc)
    pts = [p(22.5, 181.5), p(400, 181.5)] + bez(p(400, 181.5), p(525, 181.5), p(525, 22.5), p(650, 22.5)) + [p(688.5, 22.5)]
    d.line(pts, fill=YELLOW + (255,), width=width, joint='curve')
    r = width / 2
    for cx, cy in (p(22.5, 181.5), p(688.5, 22.5)):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=YELLOW + (255,))
    layer = layer.resize((round(w), h), Image.LANCZOS)
    target.paste(layer, (round(x), round(y)), layer)


def tracked(draw, xy, text, font, fill, spacing):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + spacing


def tracked_width(draw, text, font, spacing):
    return sum(draw.textlength(c, font=font) for c in text) + spacing * max(0, len(text) - 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--font-bold', help='TTF für Überschriften (Standard: DejaVu Sans Bold)')
    ap.add_argument('--font-regular', help='TTF für Beschriftungen (Standard: DejaVu Sans)')
    args = ap.parse_args()

    bold = args.font_bold or DEJAVU % '-Bold'
    regular = args.font_regular or DEJAVU % ''

    for name, w, h, motif in SLOTS:
        im = Image.new('RGB', (w, h), NAVY_MID)
        d = ImageDraw.Draw(im)

        step = max(28, w // 48)
        for i in range(-h, w + h, step):
            d.line([(i, 0), (i + h, h)], fill=(15, 43, 74), width=1)

        pad = round(w * 0.045)
        d.rectangle([pad, pad, w - pad, h - pad], outline=NAVY_LINE, width=2)

        base = max(14, round(w / 62))
        f_label = ImageFont.truetype(regular, base)
        f_title = ImageFont.truetype(bold, round(base * 2.3))
        f_sub = ImageFont.truetype(regular, round(base * 0.92))
        cy = h // 2

        label = 'BILDPLATZHALTER'
        tracked(d, ((w - tracked_width(d, label, f_label, base * 0.22)) / 2, cy - base * 4.2), label, f_label, YELLOW, base * 0.22)

        title = motif.upper()
        tracked(d, ((w - tracked_width(d, title, f_title, base * 0.05)) / 2, cy - base * 2.2), title, f_title, WHITE, base * 0.05)

        sub = f'{w} × {h}  ·  {name}.jpg  ·  Foto ersetzen / replace photo'
        tracked(d, ((w - tracked_width(d, sub, f_sub, base * 0.08)) / 2, cy + base * 1.6), sub, f_sub, MUTED, base * 0.08)

        swoosh(im, (w - round(w * 0.16)) / 2, cy + base * 4.4, round(w * 0.16))

        im.save(os.path.join(OUT, f'{name}.jpg'), quality=82, optimize=True, progressive=True)
        im.save(os.path.join(OUT, f'{name}.webp'), quality=80, method=6)
        print('geschrieben:', name)


if __name__ == '__main__':
    main()
