import pandas as pd
import os

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

TEXT_COLUMN_CANDIDATES = ["review_text", "text", "review"]
LABEL_COLUMN_CANDIDATES = ["label", "fake", "is_fake", "class"]

# -------------------------------
# Helper functions
# -------------------------------
def find_column(df, candidates, purpose):
    """
    Find the first matching column from candidates.
    """
    for col in candidates:
        if col in df.columns:
            return col
    raise ValueError(f"❌ No valid {purpose} column found. Checked: {candidates}")


# -------------------------------
# Main validation logic
# -------------------------------
def main():
    print("=== DATA VALIDATION STARTED ===\n")

    # 1. Load dataset
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"❌ Dataset not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    print(f"Loaded dataset from: {DATA_PATH}")
    print(f"Dataset shape: {df.shape}\n")

    # 2. Identify columns
    text_col = find_column(df, TEXT_COLUMN_CANDIDATES, "text")
    label_col = find_column(df, LABEL_COLUMN_CANDIDATES, "label")

    print(f"Using text column : '{text_col}'")
    print(f"Using label column: '{label_col}'\n")

    # 3. Missing value check
    missing_text = df[text_col].isna().sum()
    missing_label = df[label_col].isna().sum()

    print("Missing values:")
    print(f" - Missing text rows  : {missing_text}")
    print(f" - Missing label rows : {missing_label}\n")

    # 4. Drop rows with missing critical values (report only, do not modify yet)
    valid_rows = df.dropna(subset=[text_col, label_col])
    dropped = len(df) - len(valid_rows)

    print(f"Rows with valid text + label: {len(valid_rows)}")
    print(f"Rows that would be dropped : {dropped}\n")

    # 5. Label distribution
    label_counts = valid_rows[label_col].value_counts(normalize=False)
    label_ratios = valid_rows[label_col].value_counts(normalize=True)

    print("Label distribution (counts):")
    print(label_counts, "\n")

    print("Label distribution (ratios):")
    print(label_ratios, "\n")

    # 6. Review length statistics
    review_lengths = valid_rows[text_col].astype(str).apply(len)

    print("Review length statistics:")
    print(f" - Mean length   : {review_lengths.mean():.2f}")
    print(f" - Median length : {review_lengths.median():.2f}")
    print(f" - Min length    : {review_lengths.min()}")
    print(f" - Max length    : {review_lengths.max()}\n")

    # 7. Basic sanity checks
    if label_counts.min() < 0.1 * label_counts.max():
        print("⚠️ WARNING: Strong class imbalance detected.")
        print("   You MUST handle this during training (class weights / sampling).\n")

    if review_lengths.mean() < 20:
        print("⚠️ WARNING: Average review length is very small.")
        print("   Short texts may reduce semantic model effectiveness.\n")

    print("=== DATA VALIDATION COMPLETED SUCCESSFULLY ===")


# -------------------------------
# Entry point
# -------------------------------
if __name__ == "__main__":
    main()