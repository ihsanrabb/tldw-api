const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const tenantController = require('../controllers/tenant');
const { isLoggedIn } = require('../middleware');

const tenantValidator = [
  check('tenant_name', 'tenant_name is required').trim().isLength({ min: 6 }),
  check('location', 'location is required').trim().isLength({ min:6 }),
  check('description', 'description is required').trim().isLength({ min: 6 }),
  check('category', 'category is required').trim().isLength({ min: 6 }),
  check('image_url', 'image_url is required').trim().isLength({ min: 6 })
];


router.get('/', tenantController.getAllTenant);
router.post('/create', isLoggedIn, tenantValidator, tenantController.createTenant);
router.put('/update/:tenantId', isLoggedIn, tenantController.updateTenant);
router.delete('/delete/:tenantId', isLoggedIn, tenantController.deleteTenant);

module.exports = router;
