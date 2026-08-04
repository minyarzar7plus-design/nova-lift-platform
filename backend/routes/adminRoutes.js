const r=require('express').Router(), c=require('../controllers/adminController'), admin=require('../middleware/adminAuth'); r.get('/overview',admin,c.overview); module.exports=r;
