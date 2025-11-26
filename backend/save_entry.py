import json
from datetime import datetime
import os

# CORRECT PATH - since both files are in the same 'backend' folder
DATA_FILE = 'reflections.json'

new_reflection_text = input("Please type your reflection: ")

try:
    with open(DATA_FILE, 'r') as file:
        reflections = json.load(file)
except FileNotFoundError:
    # If file doesn't exist, start with empty list
    reflections = []

new_entry = {
    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "reflection": new_reflection_text,
}
reflections.append(new_entry)

with open(DATA_FILE, 'w') as file:
    json.dump(reflections, file, indent=4)

print("Reflection successfully saved.")
