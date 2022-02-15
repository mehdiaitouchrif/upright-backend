import express from "express";
import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../controllers/uploadController.js";
import uploadMiddleware from "../middleweare/multerStorage.js";
import protect from "../middleweare/requireAuth.js";

const router = express.Router();

router.post(
  "/profile",
  [protect, uploadMiddleware.single("profile")],
  uploadSingleImage
);

router.post(
  "/post",
  [protect, uploadMiddleware.array("post", 6)],
  uploadMultipleImages
);

export default router;
