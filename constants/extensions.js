// The converter service depends on the exportFilters specified here
// mime types here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const SUPPORTED_EXTENSIONS = {
  docx: {
    extension: "docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // most stable export filter
    exportFilter: "MS Word 2007 XML",
  },
  png: {
    extension: "png",
    mimeType: "image/png",
    // most stable export filter
    exportFilter: "writer_png_Export",
  },
  // export filters below have not been tested
  //   html: {
  //     extension: "html",
  //     mimeType: "text/html",
  //     // most stable export filter
  //     exportFilter: "HTML",
  //   },
  //   xlsx: {
  //     extension: "xlsx",
  //     mimeType:
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     // most stable export filter
  //     exportFilter: "Calc MS Excel 2007 XML",
  //   },
  //   pdf: {
  //     extension: "pdf",
  //     mimeType: "application/pdf",
  //     // most stable export filter
  //     exportFilter: "writer_pdf_Export",
  //   },
};

module.exports = SUPPORTED_EXTENSIONS;
