# Note Taking App

A simple, responsive, single-page note-taking web application.

## Features

- Create, edit, and delete notes.
- All notes are saved to local storage.
- Responsive design for both mobile and desktop.
- Live UI updates without page reloads.

## Project Structure

- `index.html`: The main HTML file.
- `styles.css`: The CSS file for styling.
- `app.js`: The JavaScript file for the application logic.

## Installation

1. Clone the repository or download the files.
2. Open `index.html` in your web browser.

## Deployment

This is a static web application and can be deployed to any static hosting service like GitHub Pages, Netlify, or Vercel.

## Acceptance Criteria

- A user can create a new note.
- A user can edit an existing note.
- A user can delete a note.
- Notes are saved automatically to local storage.
- The app is responsive and works on mobile and desktop.

## Firebase Firestore Version

To use Firebase Firestore for persistence, you will need to create a Firebase project and configure it in the application. The `app-firestore.js` file contains the necessary code to connect to Firestore. You will need to replace the placeholder Firebase configuration with your own.

### Firebase Configuration

1. Go to the Firebase console and create a new project.
2. In your project, create a new web app.
3. Copy the Firebase configuration object.
4. Paste it into the `app-firestore.js` file, replacing the placeholder.
5. Enable Firestore in your Firebase project.
6. Update `index.html` to use `app-firestore.js` instead of `app.js`.
