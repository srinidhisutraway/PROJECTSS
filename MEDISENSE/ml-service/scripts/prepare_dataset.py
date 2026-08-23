"""
Prepares training data for MediSense from raw downloaded Kaggle datasets:
  - DermNet (shubhamgoel27/dermnet)
  - HAM10000 (kmader/skin-cancer-mnist-ham10000)

Maps their folder/label structures into the data/train, data/val, data/test
layout expected by scripts/train.py, using ONLY mappings that are medically
sound (see the warnings printed below for classes that are intentionally
skipped or need manual curation).

Usage:
    python scripts/prepare_dataset.py --dermnet raw_datasets/dermnet --ham10000 raw_datasets/ham10000

Expected raw layout:
    raw_datasets/dermnet/train/<DermNet class folder name>/*.jpg
    raw_datasets/dermnet/test/<DermNet class folder name>/*.jpg
    raw_datasets/ham10000/HAM10000_images_part_1/*.jpg (+ part_2)
    raw_datasets/ham10000/HAM10000_metadata.csv
"""
import argparse
import csv
import os
import random
import shutil
import sys

# --- DermNet folder name -> our class name -----------------------------
# Only clean, unambiguous mappings are included by default. See the
# WARNINGS section below for classes that are deliberately left out.
DERMNET_CLASS_MAP = {
    "Eczema Photos": "eczema",
    "Psoriasis pictures Lichen Planus and related diseases": "psoriasis",
    "Tinea Ringworm Candidiasis and other Fungal Infections": "fungal_infection",
    "Poison Ivy Photos and other Contact Dermatitis": "contact_dermatitis",
    "Urticaria Hives": "urticaria",
    "Warts Molluscum and other Viral Infections": "wart",
    # Acne and Rosacea come from DermNet as ONE combined folder. We map it
    # to 'acne' by default since acne images dominate this folder in
    # practice — if you want a clean separate 'rosacea' class, manually
    # split this folder by hand first, or source a dedicated rosacea
    # dataset instead.
    "Acne and Rosacea Photos": "acne",
}

# WARNINGS — intentionally NOT auto-mapped:
#   "Melanoma Skin Cancer Nevi and Moles" -> mixes benign moles with actual
#     skin cancer photos. Do NOT map this to 'melanocytic_nevus' — use
#     HAM10000's 'nv' class instead (handled separately below), which
#     Kaggle/ISIC clinically labels as melanocytic nevi specifically.
#   "Seborrheic Keratoses and other Benign Tumors" -> this is a DIFFERENT
#     condition from 'seborrheic_dermatitis' despite the similar name.
#     Left unmapped; source a dedicated seborrheic dermatitis dataset if
#     you want this class trained on real data.
#   Vitiligo is bundled inside "Light Diseases and Disorders of
#     Pigmentation" alongside other pigmentation conditions. Left
#     unmapped by default — manually curate this folder down to just
#     vitiligo images if you want this class included.
#   "healthy" has no source here at all — DermNet/HAM10000 are both
#     disease-only datasets. Supply your own normal-skin photos.

HAM10000_LABEL_MAP = {
    "nv": "melanocytic_nevus",  # melanocytic nevi — cleanly separated from melanoma in this dataset
}


def split_and_copy(image_paths, class_name, out_root, split_ratios=(0.8, 0.1, 0.1), seed=42):
    random.Random(seed).shuffle(image_paths)
    n = len(image_paths)
    n_train = int(n * split_ratios[0])
    n_val = int(n * split_ratios[1])

    splits = {
        "train": image_paths[:n_train],
        "val": image_paths[n_train:n_train + n_val],
        "test": image_paths[n_train + n_val:],
    }

    for split_name, paths in splits.items():
        dest_dir = os.path.join(out_root, split_name, class_name)
        os.makedirs(dest_dir, exist_ok=True)
        for src in paths:
            dest = os.path.join(dest_dir, os.path.basename(src))
            if not os.path.exists(dest):
                shutil.copyfile(src, dest)

    return {k: len(v) for k, v in splits.items()}


def prepare_dermnet(dermnet_root, out_root):
    print("\n=== Processing DermNet ===")
    summary = {}
    for subset in ("train", "test"):
        subset_dir = os.path.join(dermnet_root, subset)
        if not os.path.isdir(subset_dir):
            continue
        for folder_name, target_class in DERMNET_CLASS_MAP.items():
            folder_path = os.path.join(subset_dir, folder_name)
            if not os.path.isdir(folder_path):
                continue
            images = [
                os.path.join(folder_path, f)
                for f in os.listdir(folder_path)
                if f.lower().endswith((".jpg", ".jpeg", ".png"))
            ]
            if not images:
                continue
            existing = summary.setdefault(target_class, [])
            existing.extend(images)

    for target_class, images in summary.items():
        counts = split_and_copy(images, target_class, out_root)
        print(f"  {target_class}: {len(images)} images -> train={counts['train']} val={counts['val']} test={counts['test']}")

    return summary


def prepare_ham10000(ham_root, out_root):
    print("\n=== Processing HAM10000 (melanocytic_nevus only) ===")
    metadata_path = os.path.join(ham_root, "HAM10000_metadata.csv")
    if not os.path.exists(metadata_path):
        print(f"  Skipped: metadata file not found at {metadata_path}")
        return {}

    image_dirs = [
        os.path.join(ham_root, "HAM10000_images_part_1"),
        os.path.join(ham_root, "HAM10000_images_part_2"),
    ]

    nv_images = []
    with open(metadata_path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            label = HAM10000_LABEL_MAP.get(row["dx"])
            if label != "melanocytic_nevus":
                continue
            image_id = row["image_id"] + ".jpg"
            for d in image_dirs:
                candidate = os.path.join(d, image_id)
                if os.path.exists(candidate):
                    nv_images.append(candidate)
                    break

    if not nv_images:
        print("  No melanocytic nevus images found — check the extracted folder structure.")
        return {}

    counts = split_and_copy(nv_images, "melanocytic_nevus", out_root)
    print(f"  melanocytic_nevus: {len(nv_images)} images -> train={counts['train']} val={counts['val']} test={counts['test']}")
    return {"melanocytic_nevus": nv_images}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dermnet", default="raw_datasets/dermnet", help="Path to extracted DermNet folder")
    parser.add_argument("--ham10000", default="raw_datasets/ham10000", help="Path to extracted HAM10000 folder")
    parser.add_argument("--out", default="data", help="Output data root (matches scripts/train.py's --data_dir)")
    args = parser.parse_args()

    if not os.path.isdir(args.dermnet) and not os.path.isdir(args.ham10000):
        print("ERROR: neither dataset path exists. Check --dermnet / --ham10000 paths.")
        sys.exit(1)

    all_classes = {}
    if os.path.isdir(args.dermnet):
        all_classes.update(prepare_dermnet(args.dermnet, args.out))
    else:
        print(f"Skipping DermNet — not found at {args.dermnet}")

    if os.path.isdir(args.ham10000):
        all_classes.update(prepare_ham10000(args.ham10000, args.out))
    else:
        print(f"Skipping HAM10000 — not found at {args.ham10000}")

    print("\n=== Summary ===")
    print(f"Classes prepared: {list(all_classes.keys())}")
    print("\nNOT included (see comments in this script for why):")
    print("  - rosacea (combined with acne in DermNet — split manually for a clean class)")
    print("  - vitiligo (bundled with other pigmentation disorders in DermNet)")
    print("  - seborrheic_dermatitis (DermNet's 'Seborrheic Keratoses' is a different condition)")
    print("  - healthy (no disease dataset includes this — add your own normal-skin photos to")
    print("             data/train/healthy, data/val/healthy, data/test/healthy manually)")
    print("\nNext step:")
    print(f"  python scripts/train.py --data_dir {args.out} --epochs 20 --fine_tune_epochs 5")
    print("(train.py automatically detects whichever class folders you've populated —")
    print(" it's fine to train on fewer than 11 classes if that's what you have real data for.)")


if __name__ == "__main__":
    main()