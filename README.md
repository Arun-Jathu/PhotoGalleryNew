# Photo Gallery App

The Photo Gallery App is a modern, responsive web application built with React and Redux, designed to display and manage a collection of photos. It fetches photo data from a public API (JSONPlaceholder) and allows users to browse photos in a grid view, view detailed information about each photo, and add/edit descriptions for photos. The app features a sleek dark theme, consistent design across all interfaces, and a focus on usability and accessibility.

## Live Demo

You can view the live version of the Photo Gallery App here:

[https://jathuphotogalleryapp.netlify.app/](https://jathuphotogalleryapp.netlify.app/)

## Features

- **Photo Grid View**: Browse photos in a responsive grid layout with search and pagination functionality. Each card includes a "View Details" button for easy navigation to the photo’s details page. Fetches all 5000 photos available from the JSONPlaceholder API.
- **Photo Details View**: View detailed information about each photo, including metadata and related photos from the same album.
- **Description Editing**: Add and edit descriptions for photos directly from both the Gallery and Photo Details pages, with data persisted in `localStorage`.
- **Consistent Design**: Modern dark theme with teal accents, consistent card designs, and hover effects across all interfaces.
- **Responsive Layout**: Fully responsive design that works seamlessly on desktop and mobile devices.
- **Accessibility**: Keyboard navigation, focus states for interactive elements, and screen reader support.
- **Download Photos**: Download individual photos from the Photo Details page.
- **Error Handling**: Graceful handling of loading and error states with user-friendly messages.

## Screenshots

- **Gallery View (Desktop)**:  
  ![Gallery Desktop](screenshots/gallery-desktop.png)
- **Gallery View (Mobile)**:  
  ![Gallery Mobile](screenshots/gallery-mobile.png)
- **Photo Details View (Desktop)**:  
  ![Photo Details Desktop](screenshots/photo-details-desktop.png)
- **Photo Details View (Mobile)**:  
  ![Photo Details Mobile](screenshots/photo-details-mobile.png)

## Setup Instructions

Follow these steps to set up and run the Photo Gallery App locally on your machine.

### Prerequisites

- **Node.js**: Version 14.x or higher (recommended: 18.x). You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Version 6.x or higher (comes with Node.js). Alternatively, you can use Yarn if preferred.
- **Git**: Required to clone the repository. Install it from [git-scm.com](https://git-scm.com/).

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/example-user/PhotoGalleryNew.git
   cd PhotoGalleryNew
   ```
