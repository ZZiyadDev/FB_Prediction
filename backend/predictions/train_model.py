import joblib
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier

from matches.dataset_builder import build_dataset


def train_model():
    # ----------------------------
    # 1. Build dataset
    # ----------------------------
    X, y = build_dataset()

    X = np.array(X)
    y = np.array(y)

    le = LabelEncoder()
    y = le.fit_transform(y)

    # ----------------------------
    # 2. Train / test split
    # ----------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # ----------------------------
    # 3. Model definition (XGBoost)
    # ----------------------------
    model = XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="multi:softprob",
        num_class=3,
        eval_metric="mlogloss",
        random_state=42
    )

    # ----------------------------
    # 4. Training
    model.fit(X_train, y_train)

    # ----------------------------
    # 5. Evaluation
    # ----------------------------
    predictions = model.predict(X_test)

    print("Accuracy:", accuracy_score(y_test, predictions))
    print(classification_report(y_test, predictions))

    # ----------------------------
    # 6. Save model
    # ----------------------------
    joblib.dump(model, "xgb_match_model.pkl")
D
    return model


if __name__ == "__main__":
    train_model()