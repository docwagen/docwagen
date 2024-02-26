const { getPublicFolderPath } = require("../helpers");
const SUPPORTED_EXTENSIONS = require("./extensions");

const MIME_TYPE_MAP = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  pdf: "application/pdf",
};

const FILE_UPLOAD_DIR = `${getPublicFolderPath()}/local/`;

const CONVERTED_FILES_DIR = `${getPublicFolderPath()}/converted/`;
// console.log(FILE_UPLOAD_DIR, CONVERTED_FILES_DIR);

const APP_NAME = "docwagen";

const MAX_FILE_SIZE = 2_000_000; // 2 MB

module.exports = {
  MIME_TYPE_MAP,
  FILE_UPLOAD_DIR,
  CONVERTED_FILES_DIR,
  APP_NAME,
  SUPPORTED_EXTENSIONS,
  MAX_FILE_SIZE,
};
