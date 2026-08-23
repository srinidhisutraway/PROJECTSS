"""
Generic tool to fold a new dataset (a single folder of images for ONE
class) into the existing data/train, data/val, data/test structure — use
this for any dataset you download later (rosacea, vitiligo, seborrheic
dermatitis, or anything else), regardless of its original folder layout.

Usage:
    python scripts/add_class_data.py --source raw_datasets/rosacea_images --class_name rosacea

This will:
  1. Find every image file in --source (searches subfolders too, so it
     doesn't matter how the downloaded dataset is organized internally)
  2. Shuffle and split 80/10/10 into train/val/test
  3. Copy them into data/train/rosacea, data/val/rosacea, data/test/rosacea

Safe to re-run for the same class — it skips files that were already
copied (based on filename), so you can add more images to the same class
later without duplicating what's already there.
"""
import argparse
import os
import random
import shutil

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")


def find_all_images(source_dir):
    found = []
    for root, _dirs, files in os.walk(source_dir):
        for f in files:
            if f.lower().endswith(IMAGE_EXTENSIONS):
                found.append(os.path.join(root, f))
    return found


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, help="Folder containing the downloaded images (any structure, searched recursively)")
    parser.add_argument("--class_name", required=True, help="Class name to use, e.g. rosacea, vitiligo, seborrheic_dermatitis")
    parser.add_argument("--data_dir", default="data", help="Root data folder (contains train/val/test)")
    parser.add_argument("--split", default="80,10,10", help="train,val,test percentages, must sum to 100")
    args = parser.parse_args()

    if not os.path.isdir(args.source):
        print(f"ERROR: source folder not found: {args.source}")
        return

    train_pct, val_pct, test_pct = [int(x) for x in args.split.split(",")]
    if train_pct + val_pct + test_pct != 100:
        print("ERROR: split percentages must sum to 100")
        return

    images = find_all_images(args.source)
    if not images:
        print(f"ERROR: no image files found in {args.source} (searched recursively).")
        return

    print(f"Found {len(images)} images for class '{args.class_name}' in {args.source}")

    random.Random(42).shuffle(images)
    n = len(images)
    n_train = int(n * train_pct / 100)
    n_val = int(n * val_pct / 100)

    splits = {
        "train": images[:n_train],
        "val": images[n_train:n_train + n_val],
        "test": images[n_train + n_val:],
    }

    for split_name, paths in splits.items():
        dest_dir = os.path.join(args.data_dir, split_name, args.class_name)
        os.makedirs(dest_dir, exist_ok=True)
        copied = 0
        skipped = 0
        for src in paths:
            dest = os.path.join(dest_dir, os.path.basename(src))
            if os.path.exists(dest):
                skipped += 1
                continue
            shutil.copyfile(src, dest)
            copied += 1
        print(f"  {split_name}: {copied} copied, {skipped} already existed")

    print(f"\nDone. '{args.class_name}' is now in data/train, data/val, and data/test.")
    print("Next: add a matching entry to app/core/knowledge_base.py if this is a")
    print("brand new condition, then run scripts/train.py to retrain on all classes.")


if __name__ == "__main__":
    main()
