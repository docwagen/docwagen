const { clearConvertedFiles } = require("./clearConvertedFilesJob");
const { restartUnoserver } = require("./restartUnoserverJob");
const schedule = require("node-schedule");
const App = require("../core/App");

function scheduleJobs() {
  const debug = App.getDebug();
  debug("Scheduling jobs...");
  // clear all files every 12 am
  const clearConvertedFilesJob = schedule.scheduleJob(
    "0 0 * * *",
    clearConvertedFiles
  );

  // restart unoserver every 12:05 am
  const restartUnoserverJob = schedule.scheduleJob(
    "5 0 * * *",
    restartUnoserver
  );
  debug("Jobs scheduled!");
}

module.exports = {
  scheduleJobs,
};
