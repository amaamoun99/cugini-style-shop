const identifyCart = (req, res, next) => {
  try {
    console.log("🧠 identifyCart running");
    const user = req.user; // from auth middleware
    const sessionId = req.cookies.sessionId;
    console.log("👉 sessionId in identifyCart:", sessionId);
    if (!user && !sessionId) {
      return res.status(401).json({
        status: "fail",
        message: "Not authenticated",
      });
    }

    req.cartIdentity = {
      userId: user?.id || null,
      sessionId: sessionId || null,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error identifying cart",
    });
  }
};

module.exports = {
  identifyCart,
};
