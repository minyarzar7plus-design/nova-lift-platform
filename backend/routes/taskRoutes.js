const r=require('express').Router(), c=require('../controllers/taskController'); r.get('/',c.list); r.post('/:id/complete',c.complete); module.exports=r;
