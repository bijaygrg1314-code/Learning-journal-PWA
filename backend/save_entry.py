import json
from datetime import datetime
import os

# 1. Define the path to the JSON file relative to the script
json_file_path = os.path.join(os.path.dirname(__file__), 'reflections.json')

# 2. Get user input
reflection_text = input("Type your weekly reflection: ")

if reflection_text:
    # 3. Create a new entry object
    new_entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "text": reflection_text
    }

    # 4. Load existing data
    data = []
    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"File not found, creating new one: {json_file_path}")
    except json.JSONDecodeError:
        print("JSON file is empty or invalid, starting with an empty list.")

    # 5. Append the new entry
    data.append(new_entry)

    # 6. Save the updated data back to the JSON file
    with open(json_file_path, 'w') as f:
        json.dump(data, f, indent=2)

    print("Entry saved successfully to reflections.json.")
else:
    print("No reflection entered, cancelling save.")

