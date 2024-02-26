const App = require("../core/App");

/**
 * Since we use a long-running libreoffice instance, to reduce memory leaks, we have to kill
 * the process and restart it. So, this function sends a SIGTERM to unoserver, which in turn
 * kills the libreoffice listener and restarts it
 */
async function restartUnoserver() {
  try {
    await App.killUnoserver();
    // after one second
    setTimeout(async () => {
      await App.run();
    }, 1000);
  } catch (err) {
    console.log("Error occurred during unoserver restart:\n");
    console.error(err);
  }
  return true;
}

module.exports = { restartUnoserver };
