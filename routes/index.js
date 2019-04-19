var express = require('express');
const user =require('../database/user');
const USER= user.model;
const USERSCHEMA=user.schema;
var valid=require("../utils/valid");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    msn: "tarea 2 crud"
  })
});
router.post('/user',async (req, res)=>{
  var params=req.body;

  params["registerdate"]=new Date();
    //console.log(params);
  if(!valid.checkParams(USERSCHEMA, params)){
    res.status(300).json({
      msn:"parametros incorrectos"
    });
    return;
  }
  var user=new USER(params);
  var result = await user.save();
  res.status(200).json(result);
});
router.get("/user", async (req,res)=>{
  var params =req.query;
  var limit=100;
  if(params.limit != null){
    limit=parseInt(params.limit);
  }
  if(params.sort !=null){
    if(params.sort=="desc"){
      order=-1;
    }else if(params.sort=="asc"){
      order=1;
    }
  }
  var filter={};
  if (params.id!=null){
    filter={_id: params.id}
  }
  var list = await USER.find(filter).limit(limit).sort({_id: order});
  res.status(200).json(list);
});
router.put('/user',async (req, res)=>{
  var params=req.body;
  var id=req.query.id;
  if(id==null){
      res.status(300).json({
        msn:"falta de id del item"
      });
      return;
  }
  params["registerdate"]=new Date();
  params["updatedate"]=new Date();
  if(!valid.checkParams(USERSCHEMA, params)){
    res.status(300).json({
      msn:"parametros incorrectos"
    });
    return;
  }
  delete params.registerdate;
  var result= await USER.finOneAndUpdate(({_id:id}, params));
  res.status(200).json(result);
});
router.patch('/user',async (req, res)=>{
  var params=req.body;
  var id=req.query.id;
  if(id==null){
      res.status(300).json({
        msn:"falta de id del item"
      });
      return;
  }
  params["updatedate"]=new Date();
  if(!valid.checkParams(USERSCHEMA, params)){
    res.status(300).json({
      msn:"parametros incorrectos"
    });
    return;
  }
  var result= await USER.finOneAndUpdate(({_id:id}, params));
  res.status(200).json(result);
});
router.delete("/user",async (req, res)=>{
  var id=req.query.id;
  if(id==null){
      res.status(300).json({
        msn:"falta de id del item"
      });
      return;
  }
  var result= await USER.remove({_id: id})
  res.status(200).json({result});
});
module.exports = router;
