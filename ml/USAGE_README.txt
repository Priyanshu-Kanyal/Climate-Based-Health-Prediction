Files:
- Dataset (balanced): /mnt/data/environment_health_dataset_perfectly_balanced.csv
- Trained model: /mnt/data/disease_category_model_balanced.joblib

In Python:
>>> import joblib, pandas as pd
>>> pipe = joblib.load('/mnt/data/disease_category_model_balanced.joblib')
>>> # Use predict_from_summary defined in this notebook, or feed a DataFrame with the schema used in training.
