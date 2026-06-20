// const isAuthenticated = (req, res, next) => {
//   if (req.session && req.session.user) return next();
//   return res.status(401).json({ success: false, message: 'Please login to continue' });
// };
// module.exports = { isAuthenticated };
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ success: false, message: 'Please login to continue' });
};
module.exports = { isAuthenticated };
