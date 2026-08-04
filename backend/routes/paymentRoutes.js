const r=require('express').Router(), c=require('../controllers/paymentController'); r.get('/wallet',c.wallet); r.post('/submit',c.submit); module.exports=r;
