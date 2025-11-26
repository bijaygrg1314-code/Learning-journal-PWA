import json
from datetime import datetime

def save_reflection():
    reflection = input("Write your reflection: ")
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "text": reflection
    }

    try:
        with open("reflections.json", "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        data = []

    data.append(entry)

    with open("reflections.json", "w") as f:
        json.dump(data, f, indent=2)

save_reflection()
