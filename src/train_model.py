import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
 

# -------------------------------
# Configuration
# -------------------------------
DATA_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "data",
    "raw",
    "final_labeled_fake_reviews.csv"
)

MODEL_DIR = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models"
)

TEXT_COLUMN = "text"
LABEL_COLUMN = "label"

RANDOM_STATE = 42
TEST_SIZE = 0.2

# -------------------------------
# Main training logic
# -------------------------------
def main():
    print("=== TRAINING BASELINE MODEL ===\n")

    # 1. Load data
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=[TEXT_COLUMN, LABEL_COLUMN])

    X = df[TEXT_COLUMN].astype(str)
    y = df[LABEL_COLUMN]

    print(f"Total samples: {len(df)}")

    # 2. Train / test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y
    )

    print(f"Train size: {len(X_train)}")
    print(f"Test size : {len(X_test)}\n")

    # 3. TF-IDF vectorization
    vectorizer = TfidfVectorizer(
        max_features=50000,
        ngram_range=(1, 2),
        stop_words="english",
        min_df=2
    )

    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    print(f"TF-IDF feature size: {X_train_vec.shape[1]}\n")

    # 4. Train Logistic Regression (baseline)
    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        n_jobs=-1
    )

    model.fit(X_train_vec, y_train)

    # 5. Evaluation
    y_pred = model.predict(X_test_vec)

    print("=== CLASSIFICATION REPORT ===")
    print(classification_report(y_test, y_pred))

    print("=== CONFUSION MATRIX ===")
    print(confusion_matrix(y_test, y_pred), "\n")

    # 6. Save artifacts
    os.makedirs(MODEL_DIR, exist_ok=True)

    joblib.dump(model, os.path.join(MODEL_DIR, "baseline_logreg.pkl"))
    joblib.dump(vectorizer, os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl"))

    print("Saved baseline model and vectorizer.")
    print("=== BASELINE TRAINING COMPLETE ===")


# -------------------------------
# Entry point
# -------------------------------
if __name__ == "__main__":
    main()