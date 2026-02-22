"""Quick test of the /api/predict endpoint with Logistic_A."""
import urllib.request
import json

payload = {
    "Gender": "Male",
    "Age": 22,
    "City": "Bangalore",
    "Profession": "Student",
    "Academic Pressure": 4,
    "Work Pressure": 0,
    "CGPA": 5.5,
    "Study Satisfaction": 2,
    "Job Satisfaction": 0,
    "Sleep Duration": "Less than 5 hours",
    "Dietary Habits": "Unhealthy",
    "Degree": "BSc",
    "Have you ever had suicidal thoughts ?": "Yes",
    "Work/Study Hours": 8,
    "Financial Stress": "4",
    "Family History of Mental Illness": "Yes",
}

data = json.dumps(payload).encode("utf-8")
req = urllib.request.Request(
    "http://127.0.0.1:8000/api/predict",
    data=data,
    headers={"Content-Type": "application/json"},
)

try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    print("SUCCESS:", json.dumps(result, indent=2))
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"HTTP {e.code}: {body}")
