# Upright API

This is a the backend API for the [Upright wesbite](https://github.com/mehdiaitouchrif/upright-client) built with Node.js Express & MongoDB.

# Quick Start 🚀

### Create .env file in the root directory and fill it with your own data:

```
NODE_ENV = development
PORT = 5000
MONGO_URI =

JWT_SECRET = you get to choose
JWT_EXPIRE = 30d
JWT_COOKIE_EXPIRE = 30

CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =

SMTP_HOST=
SMTP_EMAIL =
SMTP_PASSWORD =
FROM_EMAIL =
FROM_NAME =
```

### Install Backend dependencies

```bash
npm install
```

## Run server in dev mode

```
npm run server
```

## Run server in prod mode

change NODE_ENV in your .env file to production and run the server again.

## Live application

The documentation is live at [upright-backend.herokuapp.com](https://upright-backend.herokuapp.com/)

## App Info

### Author

Mehdi Ait Ouchrif

### Version

1.0.0

### Licence

This project is licenced under the MIT License
