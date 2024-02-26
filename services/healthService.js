const App = require("../core/App");
const { successResponse } = require("../responses/health");

async function getHealthStatus() {
  const isUnoserverRunning = await App.isUnoserverRunning();
  const isSofficeRunning = await App.isSofficeRunning();

  return successResponse(isUnoserverRunning, isSofficeRunning);
}

module.exports = {
  getHealthStatus,
};
