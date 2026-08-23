"""
Oversamples minority classes by generating augmented copies of existing
images — a legitimate, standard technique for handling small classes when
more real data isn't immediately available. This does NOT replace real
data (it can't teach the model genuinely new visual information), but it
gives the model more varied examples of the same underlying images,
which measurably helps with very small classes like contact_dermatitis
and urticaria in the meantime.

Usage:
    python scripts/oversample_minority.py --data_dir data/train --target 700

This brings every class up to at least --target images by generating
augmented copies (random rotation, flip, brightness/contrast jitter,
slight crop) of its existing images, saved alongside the originals with
an "_aug<N>" suffix. Run this BEFORE scripts/train.py.

Safe to re-run: it only tops classes up to the target count, and skips
classes that already meet it.
"""
import argparse
import os
import random

from PIL import Image, ImageEnhance


def augment_image(img: Image.Image) -> Image.Image:
    # Random rotation
    angle = random.uniform(-25, 25)
    img = img.rotate(angle, expand=True, fillcolor=(255, 255, 255))

    # Random horizontal flip
    if random.random() < 0.5:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)

    # Random brightness
    img = ImageEnhance.Brightness(img).enhance(random.uniform(0.8, 1.2))

    # Random contrast
    img = ImageEnhance.Contrast(img).enhance(random.uniform(0.85, 1.15))

    # Random slight crop-and-resize (zoom effect)
    w, h = img.size
    crop_pct = random.uniform(0.0, 0.12)
    left = int(w * crop_pct * random.random())
    top = int(h * crop_pct * random.random())
    right = w - int(w * crop_pct * random.random())
    bottom = h - int(h * crop_pct * random.random())
    if right > left and bottom > top:
        img = img.crop((left, top, right, bottom)).resize((w, h))

    return img


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", default="data/train", help="Folder containing one subfolder per class")
    parser.add_argument("--target", type=int, default=700, help="Minimum images per class after oversampling")
    args = parser.parse_args()

    if not os.path.isdir(args.data_dir):
        print(f"ERROR: {args.data_dir} not found.")
        return

    class_dirs = [d for d in os.listdir(args.data_dir) if os.path.isdir(os.path.join(args.data_dir, d))]

    for class_name in class_dirs:
        class_path = os.path.join(args.data_dir, class_name)
        images = [f for f in os.listdir(class_path) if f.lower().endswith((".jpg", ".jpeg", ".png")) and "_aug" not in f]
        current_count = len([f for f in os.listdir(class_path) if f.lower().endswith((".jpg", ".jpeg", ".png"))])

        if current_count >= args.target or not images:
            print(f"  {class_name}: {current_count} images (already at/above target, skipping)")
            continue

        needed = args.target - current_count
        print(f"  {class_name}: {current_count} images -> generating {needed} augmented copies...")

        generated = 0
        aug_index = 0
        while generated < needed:
            for fname in images:
                if generated >= needed:
                    break
                src_path = os.path.join(class_path, fname)
                try:
                    img = Image.open(src_path).convert("RGB")
                except Exception as e:
                    print(f"    Skipping unreadable file {fname}: {e}")
                    continue

                augmented = augment_image(img)
                base_name = os.path.splitext(fname)[0]
                out_name = f"{base_name}_aug{aug_index}.jpg"
                augmented.save(os.path.join(class_path, out_name), quality=90)
                generated += 1
            aug_index += 1

        print(f"    Done: {class_name} now has {args.target} images")

    print("\nOversampling complete. You can now run scripts/train.py as usual.")
    print("Note: re-running this script is safe — it only tops up classes below the target.")


if __name__ == "__main__":
    main()
