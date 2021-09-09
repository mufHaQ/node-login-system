const jwt = require("jsonwebtoken");

async function Sign(req) {
  const username = req.body["username"];
  return await jwt.sign({ username: username }, "privatekeyjsonwebtoken", {
    algorithm: "HS256",
  });
}

async function Auth(req, instance) {
  const token = await jwt.verify(req.cookies["jwt"], "privatekeyjsonwebtoken");
  return await instance.findOne({
    where: {
      username: token["username"],
    },
  });
}

module.exports = {
  Sign,
  Auth,
};
