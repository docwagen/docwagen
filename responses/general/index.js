function errorResponse(error = "An error occurred", message = "Unsuccessful") {
  const status = false;
  return { status, message, error };
}

module.exports = { errorResponse };
