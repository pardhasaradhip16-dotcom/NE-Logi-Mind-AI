"""
NE-Logi Mind AI - Machine Learning Training Pipeline
Trained on North East India Logistics & Mountain Accessibility Dataset (20,000 records)
"""

import os
import json
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import HistGradientBoostingClassifier, HistGradientBoostingRegressor
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

DATASET_CANDIDATE_PATHS = [
    r"C:\Users\musht\Downloads\NE_LogiMind_Synthetic_Logistics_Dataset_20000 (1).csv",
    os.path.join(os.path.dirname(__file__), "NE_LogiMind_Synthetic_Logistics_Dataset_20000 (1).csv"),
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "NE_LogiMind_Synthetic_Logistics_Dataset_20000 (1).csv"),
]

def find_dataset():
    for p in DATASET_CANDIDATE_PATHS:
        if os.path.exists(p):
            return p
    raise FileNotFoundError(f"Could not find dataset in candidate paths: {DATASET_CANDIDATE_PATHS}")

def load_and_preprocess_data(dataset_path):
    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    print(f"Dataset shape: {df.shape}")

    # Feature Engineering
    # Extract departure hour from departure_time
    if 'departure_time' in df.columns:
        df['departure_hour'] = pd.to_datetime(df['departure_time'], errors='coerce').dt.hour.fillna(12)
    else:
        df['departure_hour'] = 12

    # Derived interaction features
    # Severe conditions interaction: high rainfall combined with poor road
    df['monsoon_road_stress'] = df['rainfall_mm'] * (df['road_condition'].isin(['poor', 'very_poor'])).astype(float)
    df['mountain_hazard_index'] = (df['landslide_risk'] * 100.0) + (df['road_blockage'] * 50.0)

    numeric_features = [
        'distance_km',
        'vehicle_capacity',
        'vehicle_load_percentage',
        'rainfall_mm',
        'landslide_risk',
        'road_blockage',
        'route_accessibility_score',
        'expected_delivery_hours',
        'departure_hour',
        'monsoon_road_stress',
        'mountain_hazard_index',
    ]

    categorical_features = [
        'origin',
        'destination',
        'vehicle_type',
        'traffic_level',
        'weather_condition',
        'road_condition',
    ]

    feature_cols = numeric_features + categorical_features
    X = df[feature_cols].copy()
    y_class = df['delivery_delayed'].astype(int).values
    y_delay_hours = df['delay_hours'].astype(float).values
    y_actual_hours = df['actual_delivery_hours'].astype(float).values

    return df, X, y_class, y_delay_hours, y_actual_hours, numeric_features, categorical_features

def build_preprocessor(numeric_features, categorical_features):
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )
    return preprocessor

def train_and_evaluate():
    dataset_path = find_dataset()
    df, X, y_class, y_delay_hours, y_actual_hours, num_cols, cat_cols = load_and_preprocess_data(dataset_path)

    # 80/20 Train Test Split
    X_train, X_test, y_cls_train, y_cls_test, y_reg_train, y_reg_test = train_test_split(
        X, y_class, y_delay_hours, test_size=0.20, random_state=42, stratify=y_class
    )

    print(f"Training set: {X_train.shape[0]} samples, Test set: {X_test.shape[0]} samples")

    # Build Preprocessors
    cls_preprocessor = build_preprocessor(num_cols, cat_cols)
    reg_preprocessor = build_preprocessor(num_cols, cat_cols)

    # 1. Delay Risk Classifier
    print("\n--- Training Model 1: Delay Risk Classifier (HistGradientBoosting) ---")
    classifier = Pipeline(steps=[
        ('preprocessor', cls_preprocessor),
        ('model', HistGradientBoostingClassifier(
            max_iter=150,
            learning_rate=0.08,
            max_leaf_nodes=31,
            random_state=42
        ))
    ])
    classifier.fit(X_train, y_cls_train)

    y_cls_pred = classifier.predict(X_test)
    y_cls_proba = classifier.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_cls_test, y_cls_pred)
    prec = precision_score(y_cls_test, y_cls_pred, zero_division=0)
    rec = recall_score(y_cls_test, y_cls_pred, zero_division=0)
    f1 = f1_score(y_cls_test, y_cls_pred, zero_division=0)
    roc_auc = roc_auc_score(y_cls_test, y_cls_proba)

    print(f"Classifier Accuracy: {acc*100:.2f}%")
    print(f"Classifier Precision: {prec*100:.2f}%")
    print(f"Classifier Recall: {rec*100:.2f}%")
    print(f"Classifier F1-Score: {f1*100:.2f}%")
    print(f"Classifier ROC-AUC: {roc_auc:.4f}")

    # 2. Dynamic Delay Hours Regressor
    print("\n--- Training Model 2: Delay Hours & Transit Time Regressor ---")
    regressor = Pipeline(steps=[
        ('preprocessor', reg_preprocessor),
        ('model', HistGradientBoostingRegressor(
            max_iter=150,
            learning_rate=0.08,
            max_leaf_nodes=31,
            random_state=42
        ))
    ])
    regressor.fit(X_train, y_reg_train)

    y_reg_pred = regressor.predict(X_test)
    # Delay hours cannot be negative
    y_reg_pred = np.clip(y_reg_pred, 0, None)

    mae = mean_absolute_error(y_reg_test, y_reg_pred)
    rmse = np.sqrt(mean_squared_error(y_reg_test, y_reg_pred))
    r2 = r2_score(y_reg_test, y_reg_pred)

    print(f"Regressor MAE (hours): {mae:.3f} hrs")
    print(f"Regressor RMSE (hours): {rmse:.3f} hrs")
    print(f"Regressor R2 Score: {r2:.4f}")

    # Save Models and Metadata
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)

    cls_path = os.path.join(models_dir, "delay_classifier.joblib")
    reg_path = os.path.join(models_dir, "delay_regressor.joblib")

    joblib.dump(classifier, cls_path)
    joblib.dump(regressor, reg_path)
    print(f"\nSaved models to: {models_dir}")

    # Compute high-level dataset statistics for frontend display
    metrics = {
        "dataset_total_records": int(len(df)),
        "dataset_delayed_records": int(df['delivery_delayed'].sum()),
        "dataset_delayed_percentage": round(float(df['delivery_delayed'].mean() * 100), 2),
        "test_sample_size": int(len(X_test)),
        "classifier": {
            "model_type": "HistGradientBoostingClassifier",
            "accuracy": round(float(acc * 100), 2),
            "precision": round(float(prec * 100), 2),
            "recall": round(float(rec * 100), 2),
            "f1_score": round(float(f1 * 100), 2),
            "roc_auc": round(float(roc_auc), 4),
        },
        "regressor": {
            "model_type": "HistGradientBoostingRegressor",
            "mae_hours": round(float(mae), 3),
            "rmse_hours": round(float(rmse), 3),
            "r2_score": round(float(r2), 4),
        },
        "features": {
            "numeric": num_cols,
            "categorical": cat_cols,
        },
        "origins": sorted(df['origin'].unique().tolist()),
        "destinations": sorted(df['destination'].unique().tolist()),
        "vehicle_types": sorted(df['vehicle_type'].unique().tolist()),
        "weather_conditions": sorted(df['weather_condition'].unique().tolist()),
        "road_conditions": sorted(df['road_condition'].unique().tolist()),
    }

    metrics_path = os.path.join(models_dir, "metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"Saved metrics summary to: {metrics_path}")

    return metrics

if __name__ == "__main__":
    train_and_evaluate()
