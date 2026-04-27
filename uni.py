import pandas as pd

# Load dataset
df = pd.read_csv("data\mental_health_dataset.csv")

# Get unique values for each column
for col in df.columns:
    print(f"\n🔹 Column: {col}")
    print(df[col].dropna().unique())