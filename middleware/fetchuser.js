const jwt = require("jsonwebtoken");

const JWT_SECRET = "MySecurityString";

const fetchuser = (req, res, next) => {
  // Get the user from the Jwt token and add id to req object

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token" });
  }

  try {
    const string = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (err) {
    res.status(400).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
