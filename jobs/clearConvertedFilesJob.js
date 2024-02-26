const { clearFilesInFolder } = require("../helpers");
const { FILE_UPLOAD_DIR, CONVERTED_FILES_DIR } = require("../constants");
const App = require("../core/App");

/**
 * Deletes every file in both the default file upload directory and the converted files' folder
 */
async function clearConvertedFiles() {
  try {
    const debug = App.getDebug();
    debug("clearing uploaded and converted files...");
    await clearFilesInFolder(FILE_UPLOAD_DIR);
    await clearFilesInFolder(CONVERTED_FILES_DIR);
    debug(`All files cleared! - ${new Date()}`);
  } catch (err) {
    console.log("Error clearing converted files:\n");
    console.error(err);
  }
}

module.exports = { clearConvertedFiles };
