function successResponse(isUnoserverRunning = false, isSofficeRunning = false) {
  return {
    status: isSofficeRunning && isUnoserverRunning,
    details: {
      unoserver: isUnoserverRunning,
      libreoffice: isSofficeRunning,
    },
  };
}

module.exports = {
  successResponse,
};
