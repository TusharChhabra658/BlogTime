const jwt = require("jsonwebtoken");

const jwtsecret = process.env.JWT_SECRET_KEY;

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = jwt.sign(payload, jwtsecret);
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, jwtsecret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
