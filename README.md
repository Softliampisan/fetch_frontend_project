# Fetch Frontend Project 🐶

This is a React + Vite website for finding and matching with dogs. Get started right now by clicking this [link](https://softliampisan.github.io/fetch_frontend_project)! 

Follow the steps below to set up and run the project locally.

---
⚠️ **Important Notes**  

- **Enable Cookies:** Make sure your browser allows cookies and cross-site tracking. The backend sends an HTTPOnly cookie with a JSON Web Token (JWT), and browser settings may block it by default. Enable cookies in your browser settings to ensure proper authentication and session management.  
- **Page Refresh Issue on GitHub Pages:** Since GitHub Pages does not support client-side routing, refreshing any non-home page (e.g., `/available_dogs`) may result in a **404 error**. To handle this, a workaround has been applied by copying `index.html` to `404.html`. The site will still work, but browsers may return a 404 status for non-root pages.  

## Getting Started

### 1️⃣ **Clone the Repository**
First, clone this repository to your local machine:

```console
git clone https://github.com/your-username/fetch_frontend_project.git
```
Then navigate into the project directory:

```console
cd fetch_frontend_project
```
## Installation

### 2️⃣ **Install Dependencies**

Make sure you have Node.js installed, then install the required dependencies:

```console
npm install
```
## ⚙️ Environment Variables Setup
Before running the project, you may need to configure environment variables.

Create a .env.local file in the root directory.
Add the required environment variables:

VITE_BASE_URL=https://frontend-take-home-service.fetch.com

## Running the Development Server
### 3️⃣ **Start the App**
Once dependencies are installed and the environment variables are setup, start the development server:

```console
npm run dev
```
The app should now be running at:
http://localhost:5173/fetch_frontend_project.
If you see an error, make sure no other application is using port 5173.

