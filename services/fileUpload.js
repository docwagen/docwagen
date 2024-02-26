const multer = require("multer");
const fs = require("fs");
const { FILE_UPLOAD_DIR, MAX_FILE_SIZE } = require("../constants");

/**
 * creates a multer object for file uploads. Checks if the storage destination folder exists
 * and creates it if it doesn't
 */
function createMulterInstance() {
  // Set up storage for uploaded files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, FILE_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  // Create the multer instance
  return multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE } });
}

const upload = createMulterInstance();

module.exports = upload;
