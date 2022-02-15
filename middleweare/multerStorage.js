import multer from "multer";
import ErrorResponse from "../helpers/errorResponse.js";

const uploadMiddleware = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/png||jpeg||jpg||gif$i/)) {
      // You can always pass an error if something goes wrong:
      cb(new ErrorResponse("File does not support", 400));
      return;
    }

    cb(null, true);
  },
});

export default uploadMiddleware;
