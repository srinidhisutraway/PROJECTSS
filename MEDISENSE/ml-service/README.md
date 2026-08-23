# MediSense ML Service

FastAPI microservice that serves the skin condition classifier plus a
lightweight hydration/oiliness/texture analysis. Called internally by the
Node backend (`ML_SERVICE_URL` in `backend/.env`) — it is not meant to be
exposed directly to the public internet.

## Quick start

```bash
cd ml-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive Swagger docs.

### Mock mode (no trained model needed)

If `models/skin_classifier.h5` doesn't exist, the service **automatically
starts in mock mode**: it returns deterministic, plausible-looking
predictions derived from image statistics instead of crashing or blocking
the rest of the app. This lets you build/demo the full product (backend +
frontend) before you've trained a real model. The API response always
includes `"mockMode": true` in this case so the frontend can show a subtle
"demo model" badge if desired.

## Supported classes (extensible)

Defined in `app/core/knowledge_base.py`:
- `acne`
- `eczema`
- `psoriasis`
- `melanocytic_nevus`
- `healthy`

**To add a new disease class:**
1. Add a folder named after the new class under `data/train/<class>/`,
   `data/val/<class>/`, and `data/test/<class>/` with labeled images.
2. Add a matching entry to `CONDITIONS` in `app/core/knowledge_base.py`
   (explanation, symptoms, causes, routine, dos/don'ts, FAQs).
3. Re-run `scripts/train.py`. The label list is auto-derived from your
   folder names — no other code changes required.

## Training your own model

1. Collect/organize a labeled dataset (see layout below). Public
   dermatology datasets such as HAM10000 or the DermNet dataset can be
   remapped into this folder structure as a starting point — check their
   individual licenses before use.

```
data/
  train/
    acne/*.jpg
    eczema/*.jpg
    psoriasis/*.jpg
    melanocytic_nevus/*.jpg
    healthy/*.jpg
  val/
    acne/*.jpg
    ...
  test/
    acne/*.jpg
    ...
```

2. Train:
```bash
python scripts/train.py --data_dir data --epochs 20 --fine_tune_epochs 5
```
This trains a MobileNetV2-based transfer-learning classifier in two
phases (frozen base, then fine-tuning), applies class weighting for
imbalanced datasets, and saves the best checkpoint to
`models/skin_classifier.h5` plus `models/labels.json`.

3. Evaluate on a held-out test set:
```bash
python scripts/evaluate.py --data_dir data/test --model models/skin_classifier.h5
```
Prints a full precision/recall/F1 classification report and confusion
matrix.

4. Restart the service — it will detect the model file and load it
   automatically (mock mode turns off).

## Architecture

- `app/core/model_arch.py` — MobileNetV2 transfer-learning architecture
- `app/core/preprocessing.py` — shared preprocessing (train/serve parity)
  + the hydration/oiliness heuristic analysis
- `app/core/model_loader.py` — loads the trained model, or falls back to
  mock mode
- `app/core/severity.py` — confidence + redness → mild/moderate/severe
- `app/core/knowledge_base.py` — per-condition patient-facing guidance
- `app/routers/predict.py` — `POST /api/predict` endpoint
- `scripts/train.py` / `scripts/evaluate.py` — CLI training/eval tools

## Important medical disclaimer

This model provides **preliminary, educational, AI-assisted screening
only**. It is not a diagnostic medical device and must not be used as a
substitute for professional dermatological evaluation — this is enforced
throughout the product's UI copy as well.
