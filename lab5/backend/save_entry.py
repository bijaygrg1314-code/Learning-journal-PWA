
import json
import os
from datetime import datetime

def save_reflection():
    """Save a new reflection entry to the JSON file"""
    
    # Define the path to the JSON file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(script_dir, 'reflections.json')
    
    print("\n" + "="*50)
    print("LEARNING JOURNAL - ADD NEW REFLECTION")
    print("="*50)
    
    # Get user input
    reflection_text = input("Type your weekly reflection: ").strip()
    
    # Validation
    if not reflection_text:
        print(" No reflection entered. Operation cancelled.")
        return False
    
    if len(reflection_text) < 10:
        print(" Reflection too short. Please write at least 10 characters.")
        return False
    
    # Create new entry
    new_entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "text": reflection_text
    }
    
    try:
        # Load existing data
        if os.path.exists(json_file_path):
            with open(json_file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = []
            print(" Creating new reflections.json file...")
        
        # Append new entry
        data.append(new_entry)
        
        # Save back to file
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f" Reflection saved successfully!")
        print(f" Date: {new_entry['date']}")
        print(f" Entry #{len(data)} added to reflections.json")
        return True
        
    except Exception as e:
        print(f" Error saving reflection: {e}")
        return False

if __name__ == "__main__":
    save_reflection()
