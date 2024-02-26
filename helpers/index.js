const path = require("path");
const fs = require("fs/promises");

/**
 * returns the absolute path of the public directory. Tries to resolve the path relative to the project root
 */
function getPublicFolderPath() {
  const currentDir = __dirname;
  return path.resolve(currentDir, "..", "public");
}

/**
 * deletes all files in folder with `folderPath`
 * @param {string} folderPath
 */
async function clearFilesInFolder(folderPath) {
  for (const file of await fs.readdir(folderPath)) {
    await fs.unlink(path.join(folderPath, file));
  }
  return true;
}

module.exports = {
  getPublicFolderPath,
  clearFilesInFolder,
};
