const r=require('express').Router(), c=require('../controllers/userController'), auth=require('../middleware/auth'); r.get('/profile',auth,c.profile); module.exports=r;
