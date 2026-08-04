const r=require('express').Router(), c=require('../controllers/authController'); r.post('/login',c.login); r.post('/register',c.register); module.exports=r;
