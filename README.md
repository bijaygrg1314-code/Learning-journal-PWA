# Learning Journal PWA

A Progressive Web App (PWA) built to document my journey in **Mobile Application Development**.  
This project showcases journal reflections, completed projects, and a clean portfolio layout.

---

## ✨ Features

- 📖 **Journal Page** – Weekly reflections with collapsible entries and saved entries section  
- 💻 **Projects Page** – Showcases completed projects with card layout  
- 🏠 **Homepage** – Hero section with CTA buttons and a location badge (no manual counters)  
- 👤 **About Page** – Profile image with responsive styling, circular avatar, and hover zoom  
- 🎥 **YouTube Embed** – Supports embedded videos with responsive container  
- 🌗 **Dark Mode Toggle** – Switch themes with one click  
- 📝 **Journal Form** – Add, copy, and delete entries with localStorage persistence  

---

## 🛠️ Tech Stack

- **HTML5** – Semantic structure  
- **CSS3** – Responsive design, gradients, shadows, dark mode  
- **JavaScript (ES6)** – Interactivity split across four modular files  
- **PWA Features** – Offline support, installable app  

---

## 📂 Project Structure

├── index.html # Homepage 
├── about.html # About page with profile image 
├── journal.html # Journal entries 
├── projects.html # Projects showcase 
├── css/ 
│ └── style.css # Main stylesheet 
├── js/ 
│ ├── script.js # General interactivity (date/time, theme toggle, location badge) │ ├── storage.js # LocalStorage helpers (save, load, delete journal entries/projects) 
│ ├── browser.js # Browser APIs (geolocation, clipboard, etc.) 
│ └── thirdparty.js # Integrations with external APIs or services 
└── images/ # Profile & project images

---

## 📥 Clone This Repository

To clone this project to your local machine, run:

```bash
git clone https://github.com/bijaygrg1314-code/Learning-journal-PWA.git
