# Backend-Youtube-Project

A full-featured backend for a YouTube-like video sharing platform, built with Node.js, Express, MongoDB (Mongoose), and Cloudinary for media storage. This project supports user authentication, video upload and streaming, comments, likes, playlists, and more.

---

## Features

- **User Authentication**: Register, login, JWT-based authentication, profile management.
- **Video Management**: Upload, stream, update, and delete videos.
- **Comments**: Add, update, delete, and fetch comments on videos.
- **Likes**: Like/unlike videos, fetch liked videos.
- **Playlists**: Create, update, delete playlists, add/remove videos from playlists.
- **Media Storage**: Cloudinary integration for image and video storage.
- **Pagination & Aggregation**: Efficient data fetching for large collections.
- **Error Handling**: Centralized and consistent error responses.
- **Production-Ready**: Follows best practices for validation, error handling, and code structure.

---

## Tech Stack

- **Node.js** & **Express.js** – REST API server
- **MongoDB** & **Mongoose** – Database and ODM
- **Cloudinary** – Media storage (images, videos)
- **JWT** – Authentication
- **bcrypt** – Password hashing
- **Multer** – File uploads
- **dotenv** – Environment variable management

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Cloudinary account
