import joblib
import numpy as np

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, f1_score
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

from matches.dataset_builder import build_dataset


def train_model():

    X, y = build_dataset()

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.2,
        shuffle=False # <--- STOP TIME TRAVEL
        # stratify=y_encoded (DELETE THIS LINE. You cannot stratify if you don't shuffle)
    )

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Apply SMOTE to balance the classes
    smote = SMOTE(random_state=42)
    X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)

    base_model = XGBClassifier(
        objective="multi:softprob",
        num_class=3,
        eval_metric="mlogloss",
        tree_method="hist",
        random_state=42
    )

    param_grid = {
        'n_estimators': [100, 300, 500],
        'max_depth': [3, 5, 7],
        'learning_rate': [0.01, 0.05, 0.1],
        'subsample': [0.7, 0.9, 1.0],
        'colsample_bytree': [0.7, 0.9, 1.0]
    }

    print("Starting Hyperparameter tuning...")
    random_search = RandomizedSearchCV(
        estimator=base_model,
        param_distributions=param_grid,
        n_iter=15,
        scoring='f1_macro',
        cv=3,
        verbose=1,
        random_state=42,
        n_jobs=-1
    )
    
    random_search.fit(X_train_smote, y_train_smote)
    model = random_search.best_estimator_
    print("Best parameters found:", random_search.best_params_)

    preds = model.predict(X_test)

    print("\nClassification Report:")
    print(classification_report(y_test, preds, target_names=le.classes_))

    print("Macro F1:", f1_score(y_test, preds, average="macro"))

    joblib.dump(model, "xgb_match_model.pkl")
    joblib.dump(le, "label_encoder.pkl")
    joblib.dump(scaler, "scaler.pkl")

    return model, le, scaler


if __name__ == "__main__":
    train_model()