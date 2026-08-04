const r=require('express').Router(), c=require('../controllers/authController'); r.post('/login',c.login); r.post('/register',c.register); r.post('/verify-email',c.verifyEmail); module.exports=r;
