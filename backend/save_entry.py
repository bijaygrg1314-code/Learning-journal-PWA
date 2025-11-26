import json
from datetime import datetime
import os
import time

# 1. Define the path to the JSON file relative to the script
json_file_path = os.path.join(os.path.dirname(__file__), 'reflections.json')

# 2. Get user input
reflection_text = input("Type your weekly reflection: ")

if reflection_text:
    # Generate a unique ID (based on current time in milliseconds, similar to JS Date.now())
    unique_id = int(time.time() * 1000)

    # 3. Create a new entry object that matches the JS class expectations
    new_entry = {
        "id": unique_id,
        "title": "Python Reflection", # Added default title
        "content": reflection_text,   # Changed 'text' to 'content'
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now().strftime("%H:%M:%S"),
        "source": "python"            # Explicitly mark the source
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

    # 5. Append the new entry (Prepended to display newest first when fetching)
    data.insert(0, new_entry) 

    # 6. Save the updated data back to the JSON file
    with open(json_file_path, 'w') as f:
        json.dump(data, f, indent=2)

    print("Entry saved successfully to reflections.json.")
else:
    print("No reflection entered, cancelling save.")
