Contact Book App
A full-stack web application for managing a contact list. Users can add, view, edit, and delete contacts. The application features a responsive design, client-side and server-side validation, and paginated data fetching.

Features
Add New Contacts: A form to add new contacts with name, email, and phone number.

View Contacts: A paginated list to display all contacts.

Edit Contacts: Update existing contact information.

Favorite Contacts: Mark contacts as "favorite" to have them displayed in a separate, prioritized section.

Delete Contacts: Permanently remove contacts from the list.

Pagination: Efficiently load contacts in batches to improve performance.

Responsive UI: The application's interface is designed to work seamlessly on both desktop and mobile devices.

Tech Stack
Frontend

React: For building the user interface and managing component state.

Axios: A promise-based HTTP client for making API requests.

React Icons: A library for adding professional-looking icons.

Backend

Node.js & Express: A robust and scalable backend for handling API requests.

SQLite: A lightweight, file-based database for simple and quick data storage.

CORS: Middleware to handle Cross-Origin Resource Sharing.

Getting Started
Follow these steps to set up and run the project on your local machine.

Prerequisites
Node.js (v18 or higher): You can download it from nodejs.org.

npm: The Node Package Manager, which is included with Node.js.

Installation
Clone the repository:

Bash

git clone <repository-url>
cd contact-book-app
Set up the backend:
Navigate to the backend directory, install dependencies, and start the server.

Bash

cd backend
npm install
node server.js
The backend server will run on http://localhost:5000.

Set up the frontend:
Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server.

Bash

cd ../frontend
npm install
npm start
The frontend application will run on http://localhost:3000.

Your contact book application should now be accessible in your web browser.