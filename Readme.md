# Videonest Backend

A robust backend for a video streaming platform, built with **Node.js**, **Express**, and **MongoDB**. This project supports user authentication, video upload/streaming, playlists, likes, comments, subscriptions, tweets, and more. Media files are managed via **Cloudinary**. The project is containerized with Docker and includes test coverage.

---

## Features

- **User Authentication**: Register, login, JWT-based authentication, password change, and profile management.
- **Video Management**: Upload, update, delete, and stream videos with thumbnails.
- **Playlists**: Create, update, delete playlists and manage videos within them.
- **Likes & Comments**: Like/unlike videos, comments, and tweets. Add, update, and delete comments.
- **Subscriptions**: Subscribe/unsubscribe to channels, view subscribers and subscriptions.
- **Tweets**: Post, update, and delete short messages (tweets).
- **Dashboard**: Channel statistics and video analytics.
- **Health Check**: API endpoint to check server and database health.
- **Cloudinary Integration**: Media uploads and deletions are handled via Cloudinary.
- **Testing**: Unit tests using Jest with coverage reports.
- **Dockerized**: Ready for deployment with Docker.

---

## Tech Stack

- **Node.js** / **Express.js**
- **MongoDB** / **Mongoose**
- **Cloudinary** (media storage)
- **JWT** (authentication)
- **Multer** (file uploads)
- **Jest** (testing)
- **Docker**

---

## Project Structure

```
.
├── src/
│   ├── app.js
│   ├── constants.js
│   ├── index.js
│   ├── __test__/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
├── public/
│   └── temp/
├── coverage/
├── Dockerfile
├── package.json
├── Readme.md
```

---

## Getting Started

### 1. Clone the Repository

```powershell
git clone https://github.com/ChiragRathod25/videonest-backend
cd videonest-backend
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
PORT=3000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=<your-mongodb-uri>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
REFRESH_TOKEN_EXPIRY=7d
ACCESS_TOKEN_SECRET=<your-access-token-secret>
ACCESS_TOKEN_EXPIRY=1d
```

### 4. Run the Application

#### Development

```powershell
npm run dev
```

#### Production

```powershell
npm start
```

### 5. Run Tests

```powershell
npm test
```

Coverage reports will be generated in the `coverage/` directory.

---

## API Endpoints

All endpoints are prefixed with `/api/v1/`.

### Users
- `POST   /users/register` — Register a new user
- `POST   /users/login` — Login
- `POST   /users/logout` — Logout
- `POST   /users/refresh-token` — Refresh JWT
- `PATCH  /users/change-password` — Change password
- `PATCH  /users/update-account` — Update email/fullname
- `PATCH  /users/update-avatar` — Update avatar
- `PATCH  /users/update-coverImage` — Update cover image
- `GET    /users/current-user` — Get current user
- `GET    /users/channel/:username` — Get channel profile
- `GET    /users/history` — Get watch history

### Videos
- `GET    /videos/` — List/search videos
- `POST   /videos/` — Upload a new video
- `GET    /videos/:videoId` — Get video by ID
- `DELETE /videos/:videoId` — Delete video
- `PATCH  /videos/update/thumbnail/:videoId` — Update thumbnail
- `PATCH  /videos/update/details/:videoId` — Update title/description
- `PATCH  /videos/toggle/publish/:videoId` — Toggle publish status

### Playlists
- `POST   /playlist/` — Create playlist
- `GET    /playlist/user/:userId` — Get user's playlists
- `GET    /playlist/:playlistId` — Get playlist by ID
- `PATCH  /playlist/:playlistId` — Update playlist
- `DELETE /playlist/:playlistId` — Delete playlist
- `PATCH  /playlist/add/:videoId/:playlistId` — Add video to playlist
- `PATCH  /playlist/remove/:videoId/:playlistId` — Remove video from playlist

### Comments
- `GET    /commenets/:VideoId` — Get comments for a video
- `POST   /commenets/:VideoId` — Add comment
- `PATCH  /commenets/c/:commentId` — Update comment
- `DELETE /commenets/c/:commentId` — Delete comment

### Likes
- `PATCH  /likes/toggle/v/:videoId` — Like/unlike video
- `PATCH  /likes/toggle/c/:commentId` — Like/unlike comment
- `PATCH  /likes/toggle/t/:tweetId` — Like/unlike tweet
- `GET    /likes/videos` — Get liked videos

### Subscriptions
- `GET    /subscriptions/c/:channelId` — Get channel subscribers
- `POST   /subscriptions/c/:channelId` — Toggle subscription
- `GET    /subscriptions/u/:subscriberId` — Get subscribed channels

### Tweets
- `POST   /tweets/` — Create tweet
- `GET    /tweets/user/:userId` — Get user's tweets
- `PATCH  /tweets/:tweetId` — Update tweet
- `DELETE /tweets/:tweetId` — Delete tweet

### Dashboard
- `GET    /dashboard/stats` — Get channel stats
- `GET    /dashboard/videos` — Get channel videos

### Health Check
- `GET    /healthcheck/` — Server and DB health status

---

## Docker 
To run the backend in a Docker container, ensure you have a `.env` file with all required environment variables in your project root. The provided `Dockerfile` sets up the Node.js environment, installs dependencies, and exposes port 3000.

**Steps:**
1. Build the Docker image:
    ```powershell
    docker build -t videonest-backend .
    ```
2. Run the container:
    ```powershell
    docker run -p 3000:3000 --env-file .env videonest-backend
    ```

**Notes:**
- The app will be accessible at `http://localhost:3000` by default.
- Make sure your MongoDB and Cloudinary credentials are correct in the `.env` file.
- For development, you can mount your code as a volume and use `npm run dev` for hot-reloading.

## Docker image Usage
You can pull and run the pre-built Docker image from Docker Hub:

```bash
docker pull chiragrathod25/videonest-backend:latest
```

To run the container:

```bash
docker run -p 3000:3000 --env-file .env chiragrathod25/videonest-backend:latest
```

**Environment Variables:**  
Make sure to provide a valid `.env` file with all required environment variables as described above.

**Updating:**  
To get the latest version, simply pull the image again:

```bash
docker pull chiragrathod25/videonest-backend:latest
```

For more details, visit the [Docker Hub repository](https://hub.docker.com/repository/docker/chiragrathod25/videonest-backend/general).

## Testing

- All tests are located in `src/__test__/`.
- Run `npm test` to execute tests and generate coverage.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Author

**Chirag Rathod**

---

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Jest](https://jestjs.io/)
- [Docker](https://www.docker.com/)
