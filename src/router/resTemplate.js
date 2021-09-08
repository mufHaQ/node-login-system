// Response JSON Template
module.exports = function (req, message, error = false, data) {
  const date = new Date().toLocaleString("id-id").split("/").join("-");
  if (data) {
    return {
      date,
      method: req.method,
      error,
      message,
      data,
    };
  } else {
    return {
      date,
      method: req.method,
      error,
      message,
    };
  }
};
