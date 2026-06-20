// const router = require('express').Router();
// const ctrl = require('../controllers/fuel.controller');
// const { isAuthenticated } = require('../middlewares/auth.middleware');
// const { isManager, scopeDriverTo } = require('../middlewares/role.middleware');

// router.get('/',                  isAuthenticated, scopeDriverTo('driver_id'), ctrl.getAll);
// router.post('/',                 isAuthenticated, isManager,                  ctrl.create);
// router.get('/stats/:vehicle_id', isAuthenticated,                             ctrl.getStats);
// router.delete('/:id',            isAuthenticated, isManager,                  ctrl.remove);

// module.exports = router;
const router = require('express').Router();
const ctrl = require('../controllers/fuel.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { isManager, scopeDriverTo } = require('../middlewares/role.middleware');

router.get('/',                  isAuthenticated, scopeDriverTo('driver_id'), ctrl.getAll);
router.post('/',                 isAuthenticated, isManager,                  ctrl.create);
router.get('/stats/:vehicle_id', isAuthenticated,                             ctrl.getStats);
router.delete('/:id',            isAuthenticated, isManager,                  ctrl.remove);

module.exports = router;
