from flask import Flask, request, jsonify, render_template, send_from_directory
import json, os
from datetime import datetime

app = Flask(__name__)

# === 1. BACKEND FOLDER CONFIGURATION ===
# Get the directory where flask_app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define the path to the backend folder
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

# Define the full path to the JSON file inside the backend folder
DATA_FILE = os.path.join(BACKEND_DIR, "reflections.json")

# AUTOMATIC SETUP: Check if backend folder exists. If not, create it.
if not os.path.exists(BACKEND_DIR):
    os.makedirs(BACKEND_DIR)

# === 2. DATA HANDLING FUNCTIONS ===

def load_reflections():
    """Loads all reflections from the backend/reflections.json file."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return [] # Return empty list if file is corrupted/empty
    return []

def save_reflections(reflections):
    """Saves the list of reflections back to the backend/reflections.json file."""
    with open(DATA_FILE, "w") as f:
        json.dump(reflections, f, indent=4)

# === 3. WEBSITE ROUTES (PAGES) ===

@app.route("/")
@app.route("/index.html")
def index():
    return render_template("index.html")

@app.route("/journal.html")
def journal_page():
    return render_template("journal.html")

@app.route("/projects.html")
def projects_page():
    return render_template("projects.html")

@app.route("/about.html")
def about_page():
    return render_template("about.html")

# === 4. API ROUTES (DATA) ===

@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    """Returns the JSON data to the frontend."""
    reflections = load_reflections()
    return jsonify(reflections)

@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    """Receives new data from the frontend and saves it."""
    data = request.get_json()

    new_reflection = {
        "name": data.get("name", "Anonymous"),
        "date": datetime.now().strftime("%a %b %d %Y"),
        "reflection": data.get("reflection", "")
    }

    reflections = load_reflections()
    reflections.append(new_reflection)
    save_reflections(reflections)

    return jsonify(new_reflection), 201

# === 5. PWA ROUTES (LAB 7) ===

@app.route('/manifest.json')
def manifest():
    # Serves the manifest from the 'static' folder
    return send_from_directory('static', 'manifest.json')

@app.route('/sw.js')
def service_worker():
    # CRITICAL: Serves sw.js from 'static/js' but makes it appear at the root URL.
    # This allows the Service Worker to control the entire app.
    response = send_from_directory('static/js', 'sw.js')
    response.headers['Content-Type'] = 'application/javascript'
    return response

# This block is only for local testing; PythonAnywhere uses the WSGI file.
if __name__ == '__main__':
    app.run(debug=True)
