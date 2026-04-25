import joblib
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.utils.class_weight import compute_sample_weight
from sklearn.metrics import confusion_matrix, f1_score
from xgboost import XGBClassifier

from matches.dataset_builder import build_dataset


def train_model():

    X, y = build_dataset()

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.2,
        random_state=42,
        stratify=y_encoded
    )

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    sample_weights = compute_sample_weight(
        class_weight="balanced",
        y=y_train
    )

    model = XGBClassifier(
        n_estimators=400,
        max_depth=6,
        learning_rate=0.03,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="multi:softprob",
        num_class=3,
        eval_metric="mlogloss",
        tree_method="hist",
        random_state=42
    )

    model.fit(X_train, y_train, sample_weight=sample_weights)

    preds = model.predict(X_test)

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, preds))

    print("Macro F1:", f1_score(y_test, preds, average="macro"))

    joblib.dump(model, "xgb_match_model.pkl")
    joblib.dump(le, "label_encoder.pkl")
    joblib.dump(scaler, "scaler.pkl")

    return model, le, scaler


if __name__ == "__main__":
    train_model()