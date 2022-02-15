import asyncHandler from "../middleweare/asyncHandler.js";
import ErrorResponse from "../helpers/errorResponse.js";
import cloudinary from "../helpers/cloudinary.js";

export const uploadMultipleImages = asyncHandler(async (req, res, next) => {
  const files = req.files;
  if (!files) {
    return next(new ErrorResponse("Please upload image(s) ", 400));
  }

  const promises = files.map((file) =>
    cloudinary.v2.uploader.upload(file.path, {
      folder: `Upright/posts`,
    })
  );

  const data = (await Promise.all(promises)).map((obj) => obj.secure_url);

  res.status(200).json({ success: true, data });
});

export const uploadSingleImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse("Please import an image ", 400));
  }
  const data = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: `Upright/profiles/${req.user.username}`,
  });

  res.status(200).json({ success: true, data: data.secure_url });
});
