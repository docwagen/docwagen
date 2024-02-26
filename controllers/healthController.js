const { healthService } = require("../services");
async function getHealthStatus(req, res, next) {
  try {
    const healthDetails = await healthService.getHealthStatus();
    res.status(200).send(healthDetails);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  getHealthStatus,
};
