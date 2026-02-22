import pandas as pd
df = pd.read_csv("../data/student_depression.csv")
for col in df.columns:
    print(f"{col}: dtype={df[col].dtype}, sample={df[col].iloc[0]}")
