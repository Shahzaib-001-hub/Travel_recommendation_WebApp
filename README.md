# TravelBloom - Travel Recommendation Web Application

A responsive, interactive **Travel Recommendation Web Application** designed and built for the Final Project capstone. This project allows users to discover world-class travel destinations including exotic beaches, historic temples, and vibrant countries through a dynamic keyword search powered by asynchronous JavaScript and a JSON API.

---

## 🌟 Live Demo & Repository
- **GitHub Repository URL**: `https://github.com/<your-username>/travel-recommendation` *(Replace with your GitHub repository URL)*
- **Live GitHub Pages URL**: `https://<your-username>.github.io/travel-recommendation/` *(Replace with your deployed GitHub Pages URL)*

---

## 🚀 Key Features

1. **Navigation Bar**:
   - Fixed, translucent glassmorphism navigation header.
   - Links to **Home** (`index.html`), **About Us** (`about_us.html`), and **Contact Us** (`contact_us.html`).
   - Integrated search input bar with dedicated **Search** and **Clear** buttons.

2. **Hero & Interactive Booking**:
   - Compelling hero presentation ("EXPLORE DREAM DESTINATION").
   - Interactive **BOOK NOW** button triggering destination booking details.

3. **Dynamic Keyword Search**:
   - Asynchronously fetches data from `travel_recommendation_api.json` using the `fetch()` API.
   - Supports search keywords:
     - **`beach`** or **`beaches`** &rarr; Displays tropical beach recommendations (e.g. *Bora Bora*, *Copacabana*).
     - **`temple`** or **`temples`** &rarr; Displays historic temples (e.g. *Angkor Wat*, *Taj Mahal*).
     - **`country`** or **`countries`** &rarr; Displays destinations across countries.
     - **Specific country / city names** (e.g. *Japan*, *Australia*, *Brazil*, *Tokyo*, *Sydney*) &rarr; Displays matching cities.
     - Case-insensitive matching and handles extra whitespace.

4. **Recommendation Cards with Real-Time Local Time**:
   - Displays high-resolution imagery, destination title, detailed description, and a **Visit Destination** interactive action.
   - Includes real-time local destination time formatted via JavaScript `toLocaleTimeString()` and timezone identifiers.

5. **Clear / Reset Functionality**:
   - Clicking **Clear** resets the search input, clears rendered cards, and restores the default view.

6. **About Us Page**:
   - Company background, mission, and values.
   - "Our Team" profile cards showcasing team members, roles, photos, and biographies.

7. **Contact Us Page**:
   - Contact details (Headquarters address, email, phone).
   - Interactive contact form with real-time feedback upon submission.

8. **Fixed Social Media Sidebar**:
   - Quick-access icons for Twitter/X, Facebook, Instagram, and YouTube.

---

## 📁 Project Structure

```text
reavel_recommendation/
├── index.html                   # Main Home page (entry point for GitHub Pages)
├── travel_recommendation.html   # Home page alias
├── about_us.html                # About Us & Team page
├── contact_us.html              # Contact form & information page
├── travel_recommendation.css    # Complete stylesheet with responsive design
├── travel_recommendation.js     # Search logic, fetch API, and DOM manipulations
├── travel_recommendation_api.json # JSON database of recommendations
└── README.md                    # Project documentation & deployment guide
```

---

## 💻 Running the Project Locally

Because this project uses the `fetch()` API to read `travel_recommendation_api.json`, it should be run on a local HTTP server (to prevent browser `file://` CORS restrictions).

### Option 1: Using Python
```bash
# Python 3
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

### Option 2: Using Node.js / npx
```bash
npx serve .
```

### Option 3: Using VS Code Live Server
Right-click `index.html` and click **"Open with Live Server"**.

---

## 🚢 Deployment to GitHub & GitHub Pages

Follow these steps to publish and deploy your project:

### Step 1: Initialize Git and Commit
```bash
git init
git add .
git commit -m "Initial commit: Complete Travel Recommendation Web Application"
```

### Step 2: Create a Public Repository on GitHub
1. Go to [GitHub](https://github.com/new).
2. Create a new **public** repository named `travel-recommendation` (or your preferred name).
3. Do **not** initialize with a README (we already have one).

### Step 3: Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/travel-recommendation.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. On GitHub, navigate to your repository **Settings** tab.
2. Under the left-hand menu, select **Pages**.
3. Under **Build and deployment** &gt; **Branch**, select `main` branch and `/ (root)` folder.
4. Click **Save**.
5. Wait 1-2 minutes. Your live website URL will be displayed at the top (e.g., `https://<your-username>.github.io/travel-recommendation/`).

---

## 📸 Screenshots for Assignment Submission

For the assignment tasks, you can capture screenshots of:
1. **Home Page UI**: Navigation bar, hero section, and social media icons.
2. **Search Results for Beaches**: Querying `beach` showing Bora Bora and Copacabana with images and descriptions.
3. **Search Results for Temples**: Querying `temple` showing Angkor Wat and Taj Mahal.
4. **Search Results for Countries**: Querying `countries`, `japan`, or `australia`.
5. **Clear Button Action**: Search input and results reset after clicking Clear.
6. **About Us Page**: Mission cards and team profile section.
7. **Contact Us Page**: Contact form filled and submitted message.

