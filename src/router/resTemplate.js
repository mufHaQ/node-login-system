// Response JSON Template
module.exports = function (req, message, error, data) {
  const date = new Date().toLocaleString("id-id").split("/").join("-");
  switch (typeof message) {
    case "string":
      if (data) {
        return {
          date,
          url: req.url,
          method: req.method,
          error,
          message,
          data,
        };
      } else {
        return {
          date,
          url: req.url,
          method: req.method,
          error,
          message,
        };
      }
    case "boolean":
      if (error) {
        return {
          date,
          url: req.url,
          method: req.method,
          error: message,
          data: error,
        };
      } else {
        return {
          date,
          url: req.url,
          method: req.method,
          error: message,
        };
      }
  }
};
