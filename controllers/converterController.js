const converterService = require("../services").converterService;
const fs = require("fs");
const { errorResponse } = require("../responses/general");

async function convertFile(req, res, next) {
  // validations here
  if (!req.file) {
    return res
      .status(422)
      .send(errorResponse("No file uploaded, please upload file"));
  }
  try {
    const { outFilePath, fileName } = await converterService.convertFile(req);
    const fileStream = fs.createReadStream(outFilePath);
    fileStream.on("open", () => {
      res.attachment(fileName);
      fileStream.pipe(res);
    });

    fileStream.on("error", (err) => {
      next(err);
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = { convertFile };
