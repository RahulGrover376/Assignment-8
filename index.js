const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const Data=require('./models/data');
const seedDB=require('./seed');
const methodOverride=require('method-override');

if(process.env.NODE_ENV!=='production')
require('dotenv').config();



mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB Connected!"))
.catch((err)=>console.log(err));

// seedDB();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


// console.log(process.env);

app.get('/',(req,res)=>
{
    res.redirect('/home');
})

app.get('/home',async(req,res)=>
{   
    const data=await Data.find();
    res.render('home',{data});
})
 
app.get('/home/enter',(req,res)=>
{
    res.render('enter');
})

app.post('/home',async(req,res)=>
{
    const {name,email,phone,cinh,cinm}=req.body;
    sendemail(email,cinh,cinm);
    await Data.create({name,email,phone,cinh,cinm});
    res.redirect('/home');
})

app.get('/home/:id',async(req,res)=>
{
    const {id}=req.params;
    const d=await Data.findById(id);
    res.render('exit',{d});
})

app.put('/home/:id',async(req,res)=>
{   
    const {id}=req.params;
    const {couth,coutm}=req.body;
    const oh=couth;
    const om=coutm;
    const d=await Data.findById(id);
    sendexmail(d.email,oh,om)
    await Data.findByIdAndUpdate(id,{$set:{status:"Checked Out",couth:oh,coutm,om}});
    res.redirect('/home');

})

app.delete('/home/:id',async(req,res)=>
{
    const {id}=req.params;
    await Data.findByIdAndDelete(id);
    res.redirect('/home');
})


function sendemail(email,cinh,cinm){
    const sgMail=require('@sendgrid/mail');
   const  sendgrid=process.env.API_KEY;
  sgMail.setApiKey(sendgrid);
  let m=cinm.toString();
  let h=cinh.toString();;
  if(cinm<=9){
      m='0'+cinm.toString();
  }
  if(cinh<=9){
      h='0'+cinh.toString();
  }
  const msg={
      to: email,
    from:"rgrover376@gmail.com",
      subject:"Entering building",
      text:`Heyy!!,You entered the building at ${h}:${m}`
  };
  sgMail.send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}


function sendexmail(email,couth,coutm){
    const sgMail=require('@sendgrid/mail');
   const  sendgrid=process.env.API_KEY;
  sgMail.setApiKey(sendgrid);
  let m=coutm.toString();
  let h=couth.toString();
  if(coutm<=9){
      m='0'+coutm.toString();
  }
  if(couth<=9){
      h='0'+couth.toString()
  }
  const msg={
      to: email,
        from:"rgrover376@gmail.com",
      subject:"Checking out",
      text:`See yaaa!!,checked out at ${h}:${m}`
  };
  sgMail.send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}
const port=process.env.PORT || 2323;
app.listen(port,()=>
{
    console.log("Server running at port 2323");
})