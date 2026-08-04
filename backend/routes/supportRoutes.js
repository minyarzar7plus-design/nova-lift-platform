const r=require('express').Router(),auth=require('../middleware/auth'),c=require('../controllers/platformController'); r.post('/tickets',auth,c.createTicket); module.exports=r;
