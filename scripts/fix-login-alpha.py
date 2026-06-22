"""Xóa nền checkerboard/trắng còn sót trong asset login (đặc biệt frame.png)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DIRS = [ROOT / "src" / "assets" / "login", ROOT / "public" / "images" / "login"]
SKIP = {"bg.png"}


def is_flat_background(r: int, g: int, b: int, a: int) -> bool:
    if a < 10:
        return True
    if abs(r - g) > 12 or abs(g - b) > 12 or abs(r - b) > 12:
        return False
    return r >= 175


def process(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_flat_background(r, g, b, a):
                px[x, y] = (0, 0, 0, 0)
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(path, "PNG")
    print(f"OK {path.name} -> {im.size}")


def main() -> None:
    for folder in DIRS:
        if not folder.exists():
            continue
        for path in sorted(folder.glob("*.png")):
            if path.name in SKIP:
                continue
            process(path)


if __name__ == "__main__":
    main()
