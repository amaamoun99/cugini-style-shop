const { v4: uuidv4 } = require('uuid');

function ensureSessionId(req, res, next) {
  if (!req.cookies.sessionId) {
    const newSessionId = uuidv4();
    res.cookie('sessionId', newSessionId, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    req.cookies.sessionId = newSessionId; // add it to request immediately
  }

  // ✅ THIS LINE IS CRUCIAL
  next();
}

module.exports = { ensureSessionId };
