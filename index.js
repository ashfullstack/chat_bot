let express=require('express');
let app=express();
let bodyparser=require('body-parser');
let mysql=require('mysql');
let util=require('util');
let con=mysql.createConnection({
    host:'bzhptgetmvbsrp4i6jca-mysql.services.clever-cloud.com',
    user:"uljrzl4t3vxvmyw2",
    password:"6psLgCNLNyZWxtaYtsLD",
    database:"bzhptgetmvbsrp4i6jca"
})

let exe=util.promisify(con.query).bind(con);
app.use(bodyparser.urlencoded({extended:true}));


app.get("/warning/:msg",async (req,res)=>{
       let v =req.params.msg;
       let data={
        "warn":v
       }
       res.redirect(`/?msg=warn`);
       
})


app.get("/",async (req,res)=>{
    let i="";
    if(req.query.id!=null){
    i=req.query.id;
    }
    let chatdata=await exe(`select*from insta_chat`);
   
    let data={
        warn:req.query.msg,
        id:i,
        w:req.query.w,
        'chatdata':chatdata
    }
    
res.render('index.ejs',data);
})
app.post("/login",async (req,res)=>{
    let formdata=req.body;
    let validateemail=`select*from insta_user where email='${formdata.email}'`;
    let emaildata=await exe(validateemail);
    let msg="This email does not exists";
    if(emaildata.length!=0){
    msg="Wrong password";
        let validatepass=`select *from insta_user where email='${formdata.email}'AND password='${formdata.password}'`;
        let passdata=await exe(validatepass);
        if(passdata.length!=0){
  
            
                    res.redirect(`/?id=${passdata[0].id}`);

        }
        else{
         res.redirect(`/?w=${msg}`);
        }
    }
    else{
        res.redirect(`/?w=${msg}`);
    }
})

app.post("/chat",async (req,res)=>{
    let id=req.query.id;
    let d=new Date();
    let time=d.getHours()+":"+ d.getMinutes();
   let sql=`insert into insta_chat(message,uid,time) values('${req.body.message}','${id}','${time}')`;
   let data=await exe(sql);
   if(data.length!=0){
    res.redirect(`/?id=${id}#b`);
   }
})
app.post("/signup",async (req,res)=>{
    let formdata=req.body;
    let insertquery=`INSERT INTO insta_user(name,email,number,password) VALUES('${formdata.name}','${formdata.email}','${formdata.number}','${formdata.password}')`;
    let checkquery=`SELECT *FROM insta_user WHERE email='${formdata.email}'OR number='${formdata.number}'`;
    let data=await exe(checkquery);
 
    if(data.length==0){
        let insertdata=await exe(insertquery);
        let id=insertdata.insertId;
        res.redirect(`/?id=${id}`);
    }
    else{
      let msg="This deletails is already in use"
        res.redirect(`/warning/${msg}`);
    }
})
//create table insta_chat(chatid int primary key auto_increment,message text,uid varchar(10));
app.listen(1010);
