const { CONVERTED_FILES_DIR, SUPPORTED_EXTENSIONS } = require("../constants");
const { Unoconverter } = require("@docwagen/unoserver-node");
const crypto = require("crypto");

async function convertFile(req) {
  const convertTo = req.body.convertTo;
  const inFilePath = req.file.path;
  const randomFileUuid = crypto.randomUUID();
  const fileName = `${Date.now()}_${randomFileUuid}.${convertTo}`;
  // out file name and new format as extension
  const outFilePath = `${CONVERTED_FILES_DIR}${fileName}`;
  // const mimeType = req.file.mimetype;
  // perform conversion
  const { stdout, stderr } = await convert(convertTo, inFilePath, outFilePath);

  if (stderr.length) {
    throw new Error(`error from unoconvert: \n${stderr}`);
  }
  // successful conversion
  return { outFilePath, fileName };
}

async function convert(outputFormat, inFilePath, outFilePath) {
  const unoconverter = new Unoconverter(true)
    .setConvertTo(outputFormat)
    .setInFile(inFilePath)
    .setOutFile(outFilePath);
  if (outputFormat in SUPPORTED_EXTENSIONS) {
    unoconverter.setFilter(SUPPORTED_EXTENSIONS[outputFormat].exportFilter);
  }
  const { stdout, stderr } = await unoconverter.execCmd();
  return { stdout, stderr };
}
module.exports = { convertFile };
