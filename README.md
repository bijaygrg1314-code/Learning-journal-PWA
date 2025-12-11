# 📱 Learning Journal PWA

A Progressive Web App (PWA) designed to document my weekly learning journey in Mobile Application Development. This project has evolved from a static website into a fully dynamic, server-side application powered by **Flask** and capable of working **offline**.

## 🚀 Live Demo
**[View Live App on PythonAnywhere](https://bijaya07.pythonanywhere.com/)**

---

## 📅 Project Evolution

This project was built incrementally over 7 weeks of laboratory sessions:

* **Lab 2:** Created the foundational structure using semantic **HTML5** and responsive **CSS3**.
* **Lab 3:** Added interactivity with **JavaScript** (Dark Mode, Live Clock, Collapsible entries).
* **Lab 4:** Integrated Browser APIs (**LocalStorage**, **Clipboard API**, **Notifications API**) and Third-party APIs (**YouTube Embeds**).
* **Lab 5:** Developed a local Python script to manage data via JSON.
* **Lab 6:** Migrated to a **Flask Backend**, serving the app dynamically and persisting data to a server-side JSON file.
* **Lab 7 (Current):** Transformed into a **Progressive Web App (PWA)** with a Service Worker for offline access and "Add to Home Screen" installability.

---

## 🌟 Key Features

### 🛠 Backend & Data (Flask)
* **Dynamic Routing:** Powered by Python/Flask to serve HTML templates.
* **RESTful API:** Implements custom `GET` and `POST` endpoints (`/api/reflections`) to fetch and save data.
* **Persistent Storage:** Saves all journal entries to a server-side `reflections.json` file (persists across devices).
* **Search Functionality:** Real-time filtering of journal entries.

### ⚡ PWA & Offline Capabilities (Lab 7)
* **Installable:** Includes a Web App Manifest (`manifest.json`) allowing users to install the app on mobile and desktop.
* **Offline Access:** Uses a **Service Worker** (`sw.js`) with a **Network-First Caching Strategy**.
    * *Online:* Fetches fresh content from the server.
    * *Offline:* Falls back to the cached version, ensuring the app never breaks.
* **Offline Notification:** A custom feature that detects network status and alerts the user with a visual banner when they go offline or come back online.

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
* **Deployment:** PythonAnywhere Cloud Hosting

---

## 📂 Project Structure

```
/mysite
├── flask_app.py        # Main Flask Application (Routes & Logic)
├── backend/
│   └── reflections.json # Server-side data storage
├── templates/          # HTML Files (Served by Flask)
│   ├── index.html
│   ├── journal.html
│   ├── projects.html
│   └── about.html
└── static/             # Static Assets
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── script.js   # Main frontend logic
    │   ├── sw.js       # Service Worker (PWA)
    │   └── ...
    ├── images/
    │   ├── icon1.png   # PWA Icon (192x192)
    │   └── icon2.png   # PWA Icon (512x512)
    └── manifest.json   # Web App Manifest
```

git clone [https://github.com/bijaygrg1314-code/Learning-journal-PWA.git](https://github.com/bijaygrg1314-code/Learning-journal-PWA.git)
cd Learning-journal-PWA
```
pip install flask

```
python flask_app.py



