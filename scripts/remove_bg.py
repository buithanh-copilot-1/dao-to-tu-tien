import sys
import numpy as np
from PIL import Image
from scipy import ndimage


def remove_background(src_path, dst_path, tol_lo=14, tol_hi=40, feather=2.0):
    img = Image.open(src_path).convert("RGB")
    arr = np.asarray(img).astype(np.int16)
    h, w, _ = arr.shape

    border_pixels = np.concatenate([
        arr[0, :, :], arr[-1, :, :], arr[:, 0, :], arr[:, -1, :],
    ], axis=0)
    samples = border_pixels[::max(1, len(border_pixels) // 400)]
    uniq = np.unique((samples // 4 * 4), axis=0)

    dist = np.full((h, w), 1e9, dtype=np.float32)
    for tone in uniq:
        d = np.abs(arr - tone.astype(np.int16)).sum(axis=2).astype(np.float32)
        dist = np.minimum(dist, d)

    bg_like = dist <= tol_hi
    border_mask = np.zeros((h, w), dtype=bool)
    border_mask[0, :] = border_mask[-1, :] = True
    border_mask[:, 0] = border_mask[:, -1] = True
    seed = bg_like & border_mask

    structure = np.ones((3, 3), dtype=bool)
    labeled, _ = ndimage.label(bg_like, structure=structure)
    touched_labels = set(np.unique(labeled[seed]))
    touched_labels.discard(0)
    bg_region = np.isin(labeled, list(touched_labels))

    ramp = np.clip((dist - tol_lo) / max(tol_hi - tol_lo, 1), 0, 1)
    alpha = np.where(bg_region, ramp * 255.0, 255.0).astype(np.float32)

    if feather > 0:
        alpha = ndimage.gaussian_filter(alpha, sigma=feather)
    alpha = np.clip(alpha, 0, 255).astype(np.uint8)

    rgba = np.dstack([np.asarray(img), alpha])
    Image.fromarray(rgba, mode="RGBA").save(dst_path)
    removed_pct = (alpha < 128).mean() * 100
    print(f"{src_path} -> {dst_path}  ~{removed_pct:.1f}% transparent")


if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    tol_hi = int(sys.argv[3]) if len(sys.argv) > 3 else 40
    tol_lo = int(sys.argv[4]) if len(sys.argv) > 4 else 14
    remove_background(src, dst, tol_lo=tol_lo, tol_hi=tol_hi)
