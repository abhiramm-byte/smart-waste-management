# EcoTrack — Smart Waste Management System

Responsive college mini-project using HTML, CSS, and vanilla JavaScript.

## Features
- Submit waste reports with location, waste type, priority, and details
- Dashboard totals for all, pending, in-progress, and collected reports
- Search locations and filter report status
- Update status, delete reports, or clear all reports
- Persist data in the browser's localStorage
- Responsive desktop/mobile layout

## Run locally
Open `index.html` in a modern browser. No packages, database, or server are required.

## Publish on GitHub Pages
1. Create a public GitHub repository named `smart-waste-management`.
2. Upload `index.html`, `style.css`, and `script.js` to the repository root.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/(root)`, then click **Save**.
6. Wait for deployment. Your site URL will look like:
   `https://YOUR-GITHUB-USERNAME.github.io/smart-waste-management/`

Replace `YOUR-GITHUB-USERNAME` with your username. The public URL only works after GitHub Pages deploys your repository.

## Limitations
This is a prototype, not a live municipal service. Reports are stored in the current browser only and are not shared between devices. It has no physical sensors, authentication, backend, or database.
