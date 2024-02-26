const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
const { converterRoutes, healthRoutes } = require("./routes");
const { MAX_FILE_SIZE } = require("./constants");
const { errorResponse } = require("./responses/general");
const App = require("./core/App");
const { scheduleJobs } = require("./jobs");
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || "development";

(async function start() {
  try {
    await App.run();
    // schedule all jobs
    scheduleJobs();
  } catch (err) {
    console.error(err);
  }
})();

// Middleware stack
// enable Cross-Origin Resource Sharing for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to log requests
app.use(morgan("tiny"));

// Routes
app.use("/api/v1/conversions", converterRoutes);
app.use("/api/v1/health", healthRoutes);

// General error handling
app.use((err, req, res, next) => {
  // console.log(err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(422)
      .send(
        errorResponse(
          `File too large. Must be less than ${MAX_FILE_SIZE} bytes`
        )
      );
  }

  return res
    .status(500)
    .send(
      environment == "production" ? errorResponse() : errorResponse(err.message)
    );
  // next(err);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
