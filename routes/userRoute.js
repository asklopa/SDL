const express = require('express');
const { registerUser, loginUser, dashboard } = require('../controllers/userController');


const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/dashboardtable', dashboard);



module.exports = router;







