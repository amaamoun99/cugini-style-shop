// middlewares/isAdmin.js
const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }
    next();
  };
  
  module.exports = isAdmin;
  