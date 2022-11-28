const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { isLoggedIn } = require('../middleware');
const customerController = require('../controllers/customer');

router.put('/update/:customerId', isLoggedIn, customerController.updateDataCustomer);

module.exports = router;
