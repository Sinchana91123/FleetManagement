// const isAdmin = (req, res, next) => {
//   if (req.session.user?.role === 'admin') return next();
//   return res.status(403).json({ success: false, message: 'Admin access required' });
// };

// const isManager = (req, res, next) => {
//   const role = req.session.user?.role;
//   if (role === 'admin' || role === 'manager') return next();
//   return res.status(403).json({ success: false, message: 'Manager access required' });
// };

// const isDriver = (req, res, next) => {
//   if (req.session.user?.role === 'driver') return next();
//   return res.status(403).json({ success: false, message: 'Driver access required' });
// };

// /**
//  * Allows Admin/Manager through unconditionally. If the requester is a
//  * Driver, restricts the query to only their own data by forcing
//  * req.query[scopeField] = the driver's own Driver record id.
//  *
//  * Usage: router.get('/', isAuthenticated, scopeDriverTo('driver_id'), ctrl.getAll)
//  * The controller must already support filtering by that query param.
//  *
//  * Note: this middleware expects req.session.user.driverId to be present
//  * for driver accounts — see attachDriverId below to populate it at login.
//  */
// const scopeDriverTo = (queryField) => (req, res, next) => {
//   const { role, driverId } = req.session.user || {};
//   if (role === 'admin' || role === 'manager') return next();
//   if (role === 'driver') {
//     if (!driverId) {
//       return res.status(403).json({ success: false, message: 'No driver profile linked to this account' });
//     }
//     req.query[queryField] = driverId;
//     return next();
//   }
//   return res.status(403).json({ success: false, message: 'Access denied' });
// };

// module.exports = { isAdmin, isManager, isDriver, scopeDriverTo };
const isAdmin = (req, res, next) => {
  if (req.session.user?.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Admin access required' });
};

const isManager = (req, res, next) => {
  const role = req.session.user?.role;
  if (role === 'admin' || role === 'manager') return next();
  return res.status(403).json({ success: false, message: 'Manager access required' });
};

const isDriver = (req, res, next) => {
  if (req.session.user?.role === 'driver') return next();
  return res.status(403).json({ success: false, message: 'Driver access required' });
};

/**
 * Allows Admin/Manager through unconditionally. If the requester is a
 * Driver, restricts the query to only their own data by forcing
 * req.query[scopeField] = the driver's own Driver record id.
 *
 * Usage: router.get('/', isAuthenticated, scopeDriverTo('driver_id'), ctrl.getAll)
 * The controller must already support filtering by that query param.
 *
 * Note: this middleware expects req.session.user.driverId to be present
 * for driver accounts — see attachDriverId below to populate it at login.
 */
const scopeDriverTo = (queryField) => (req, res, next) => {
  const { role, driverId } = req.session.user || {};
  if (role === 'admin' || role === 'manager') return next();
  if (role === 'driver') {
    if (!driverId) {
      return res.status(403).json({ success: false, message: 'No driver profile linked to this account' });
    }
    req.query[queryField] = driverId;
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied' });
};

module.exports = { isAdmin, isManager, isDriver, scopeDriverTo };
