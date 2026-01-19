# 📱 Learning Journal PWA

A Progressive Web App (PWA) designed to document my weekly learning journey in Mobile Application Development. This project has evolved from a static website into a fully dynamic, server-side application powered by **Flask**, capable of working **offline**, and now featuring interactive creative tools.

## 🚀 Live Demo
**[View Live App on PythonAnywhere](https://bijaya07.pythonanywhere.com/)**

---

## 📅 Project Evolution

This project was built incrementally over 8 weeks of laboratory sessions:

* **Lab 2:** Created the foundational structure using semantic **HTML5** and responsive **CSS3**.
* **Lab 3:** Added interactivity with **JavaScript** (Dark Mode, Live Clock, Collapsible entries).
* **Lab 4:** Integrated Browser APIs (**LocalStorage**, **Clipboard API**, **Notifications API**) and Third-party APIs (**YouTube Embeds**).
* **Lab 5:** Developed a local Python script to manage data via JSON.
* **Lab 6:** Migrated to a **Flask Backend**, serving the app dynamically and persisting data to a server-side JSON file.
* **Lab 7:** Transformed into a **Progressive Web App (PWA)** with a Service Worker for offline access and "Add to Home Screen" installability.
* **Lab 8 (Mini Project):** Added a **Creative Canvas** feature using the HTML5 Canvas API, allowing users to sketch, save diagrams, and visualize ideas directly in the app.

---

## 🌟 Key Features

### 🛠 Backend & Data (Flask)
* **Dynamic Routing:** Powered by Python/Flask to serve HTML templates.
* **RESTful API:** Implements custom `GET` and `POST` endpoints (`/api/reflections`) to fetch and save data.
* **Persistent Storage:** Saves all journal entries to a server-side `reflections.json` file (persists across devices).
* **Search Functionality:** Real-time filtering of journal entries.

### ⚡ PWA & Offline Capabilities
* **Installable:** Includes a Web App Manifest (`manifest.json`) allowing users to install the app on mobile and desktop.
* **Offline Access:** Uses a **Service Worker** (`sw.js`) with a **Network-First Caching Strategy**.
* **Offline Notification:** A custom feature that detects network status and alerts the user with a visual banner when they go offline or come back online.

### 🎨 Creative Canvas (New!)
* **Interactive Drawing:** A fully functional sketchpad using the **HTML5 Canvas API**.
* **Custom Tools:** Users can adjust brush size and pick any color from the spectrum.
* **Mobile Touch Support:** Custom event listeners handle touch gestures (`touchstart`, `touchmove`) for smooth drawing on phones and tablets.
* **Download to Device:** Users can instantly save their creations as PNG files.

### 🎨 UI/UX Design
* **Responsive Design:** Mobile-first layout that adapts to all screen sizes.
* **Dark Mode:** Toggleable theme that persists user preference via LocalStorage.
* **Interactive Elements:** Collapsible journal entries and copy-to-clipboard functionality.

---

## 💻 Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend:** Python 3, Flask
* **Data:** JSON (File-based storage)
* **PWA:** Web App Manifest, Service Worker (Cache API)
* **Graphics:** HTML5 Canvas API
* **Deployment:** PythonAnywhere Cloud Hosting

---

## 📂 Project Structure

```text
/mysite
├── flask_app.py        # Main Flask Application (Routes & Logic)
├── backend/
│   └── reflections.json # Server-side data storage
├── templates/          # HTML Files (Served by Flask)
│   ├── index.html
│   ├── journal.html
│   ├── projects.html
│   ├── creative.html   # NEW: Canvas Page
│   └── about.html
└── static/             # Static Assets
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── script.js   # Main frontend logic
    │   ├── sw.js       # Service Worker (PWA)
    │   ├── canvas.js   # NEW: Drawing logic
    │   └── ...
    ├── images/
    │   ├── icon1.png   # PWA Icon (192x192)
    │   └── icon2.png   # PWA Icon (512x512)
    └── manifest.json   # Web App Manifest

```

## 🛠 How to Run Locally

To run this project on your own machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/bijaygrg1314-code/Learning-journal-PWA.git](https://github.com/bijaygrg1314-code/Learning-journal-PWA.git)
    cd Learning-journal-PWA
    ```

2.  **Install dependencies:**
    This project requires Python and Flask.
    ```bash
    pip install flask
    ```

3.  **Run the Application:**
    Start the local Flask server.
    ```bash
    python flask_app.py
    ```

4.  **View in Browser:**
    Open your web browser and navigate to:
    ```text
    [http://127.0.0.1:5000](http://127.0.0.1:5000)
    ```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

2026 Bijaya Gurung | Learning Journal PWA


