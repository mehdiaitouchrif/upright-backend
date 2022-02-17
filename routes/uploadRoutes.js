import express from "express";
import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../controllers/uploadController.js";
import uploadMiddleware from "../middleweare/multerStorage.js";

const router = express.Router();

router.post("/profile", uploadMiddleware.single("profile"), uploadSingleImage);

router.post("/post", uploadMiddleware.array("post", 6), uploadMultipleImages);

export default router;
