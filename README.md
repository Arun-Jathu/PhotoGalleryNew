Photo Gallery App
The Photo Gallery App is a modern, responsive web application built with React and Redux, designed to display and manage a collection of photos. It fetches photo data from the JSONPlaceholder API (all 5000 photos) and allows users to browse photos in a grid view, view detailed information, upload their own images, toggle between light and night modes, and explore enhanced visual features like color palette extraction and zoomable image modals. The app features a sleek design with teal accents, consistent usability, and accessibility focus.
Live Demo
You can view the live version of the Photo Gallery App here:
Live Demo
Setup Instructions
Follow these steps to set up and run the Photo Gallery App locally on your machine.
Prerequisites

Node.js: Version 14.x or higher (recommended: 18.x). Download it from nodejs.org.
npm: Version 6.x or higher (comes with Node.js). Alternatively, you can use Yarn if preferred.
Git: Required to clone the repository. Install it from git-scm.com.

Installation

Clone the Repository:
git clone https://github.com/your-username/PhotoGalleryNew.git
cd PhotoGalleryNew

Replace your-username with your GitHub username.

Install Dependencies:
npm install

This will install all required packages listed in package.json, including dependencies for new features like image compression and Framer Motion.

Run the App:
npm run dev

The app will start in development mode and open in your default browser at http://localhost:5173 (or another port if 5173 is in use).

Build for Production
To create a production-ready build:
npm run build

The output will be in the dist folder, which you can deploy to a hosting service (e.g., Netlify, Vercel).
Troubleshooting

If you encounter issues with npm install, ensure you’re using the recommended Node.js version (18.x). Use a version manager like nvm to switch versions.
If the app doesn’t start, check for error messages in the terminal and ensure all dependencies (e.g., browser-image-compression, framer-motion) are installed.
Ensure an active internet connection, as the app fetches data from the JSONPlaceholder API.

Features

Photo Grid View: Browse photos in a responsive grid layout with search and pagination (8 photos per page). Fetches all 5000 photos from the JSONPlaceholder API.
Photo Details View: View detailed information about each photo, including metadata (photo ID, album ID) and up to 3 related photos from the same album.
Description Editing: Add and edit descriptions for photos from both Gallery and Photo Details pages, with data persisted in localStorage.
Night Mode Toggle: Switch between light and dark themes for better viewing comfort, with dynamic styling adjustments.
Image Upload Functionality: Upload personal photos with compression to optimize size, displayed alongside fetched photos.
Color Palette Extraction: Automatically extracts and displays the dominant color of each photo as a swatch and shadow effect for enhanced visual appeal.
Image Modal for Zoom: Open a full-screen modal to zoom and navigate through photos using arrow keys or buttons.
Consistent Design: Modern theme with teal accents, consistent card designs, and hover effects across all interfaces.
Responsive Layout: Fully responsive design optimized for desktop and mobile devices.
Accessibility: Keyboard navigation, focus states, and screen reader support.
Download Photos: Download individual photos from the Photo Details page.
Error Handling: Graceful handling of loading and error states with user-friendly messages (e.g., loading spinners, retry options).

Screenshots

Gallery View (Desktop):

Gallery View (Mobile):

Photo Details View (Desktop):

Photo Details View (Mobile):

Night Mode (Desktop):
(Add if available)

Image Upload and Color Swatch:
(Add if available)

Zoom Modal (Desktop):
(Add if available)

Project Structure
PhotoGalleryNew/
├── public/ # Static assets (e.g., favicon, index.html)
├── src/ # Source code
│ ├── components/ # React components
│ │ ├── Gallery.jsx # Gallery page with photo grid, pagination, upload, color extraction, and modal
│ │ └── PhotoDetails.jsx # Photo Details page with metadata and download
│ ├── features/ # Redux slices
│ │ └── photosSlice.js # Redux slice for fetching and managing photo data
│ ├── App.jsx # Main app component with routing, header, and night mode toggle
│ ├── App.css # Global styles (Tailwind CSS)
│ ├── main.jsx # Entry point for the React app
│ └── store.js # Redux store configuration
├── screenshots/ # Screenshots for the README
├── README.md # Project documentation
└── package.json # Dependencies and scripts

Technologies Used

React: Frontend library for building user interfaces.
Redux Toolkit: State management for photo data and UI states (e.g., night mode).
React Router: Routing for navigation between Gallery and Photo Details pages.
Tailwind CSS: Utility-first CSS framework for styling, including night mode.
Framer Motion: Animation library for smooth transitions, including zoom modal effects.
browser-image-compression: Library for compressing uploaded images.
JSONPlaceholder API: Public API for fetching all 5000 photos.

State Management
The Photo Gallery App uses Redux Toolkit for state management. This approach ensures predictable and scalable state handling:

Photos Data: Fetches all 5000 photos from the JSONPlaceholder API using a Redux thunk (fetchPhotos) in photosSlice.js. Data is stored in the Redux store for Gallery and Photo Details components.
Loading and Error States: Manages loading and error states during API calls and uploads, with feedback like spinners and retry options.
UI States: Tracks night mode toggle and modal states centrally, ensuring consistent behavior across components using useSelector and useDispatch.

Future Improvements

Backend Integration: Add a backend (e.g., Node.js with Express) to store descriptions and uploads persistently in a database.
User Authentication: Enable user logins for personalized photo collections.
Advanced Search: Implement filters (e.g., by album ID, color) and sorting options.
Multi-Color Palettes: Extend color extraction to show a palette of top colors per image.
Offline Support: Add service workers for offline access to uploaded photos.
