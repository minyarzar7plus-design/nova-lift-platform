const router = require('express').Router();
const auth = require('../middleware/auth'); const admin = require('../middleware/adminAuth'); const controller = require('../controllers/exceptionController');
router.use(auth, admin); router.get('/', controller.list); router.post('/:id/decisions', controller.decide);
module.exports = router;
