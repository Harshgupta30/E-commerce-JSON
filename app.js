const express = require("express");
const app = express();
const fs = require("fs");
const session = require('express-session')
const port = 3000;
var count = 0;


app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.urlencoded({extended:true}));

const multer = require('multer')
const upload = multer({ dest: 'uploads' })

var checkAuth = require("./middleware/checkAuth");
const { name } = require("ejs");

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))



app.set("view engine","ejs");

app.get("/",(req,res)=>{
    if(req.session.logged_in){
        res.redirect("/home");
        return;
    }
    res.render("root");
})

app.get('/login',(req,res)=>{
    if(req.session.logged_in){
        res.redirect("/home");
        return;
    }
    res.render('login',{error : ""});
})

app.post("/upl",upload.single('pf'),(req,res)=>{
    const pn = req.body.pname;
    const pp = req.body.pprice;
    const pd = req.body.pd;
    const pf = req.file.filename;
    let arr;
    fs.readFile("products.json",(err,data)=>{
        if(data.length===0){
            arr = [];
            var temp = {"id":count,"image":pf,"name":pn,"price":pp,"details":pd};
            arr.push(temp);
            fs.writeFile("products.json",JSON.stringify(arr),(err)=>{
                res.end();
            })
        }
        else {
            arr = JSON.parse(data);
            if (arr.length === 0) {
                var temp = {"id":count,"image":pf,"name":pn,"price":pp,"details":pd};
                arr.push(temp);
                fs.writeFile("products.json", JSON.stringify(arr), (err) => {
                    res.end();
                })
            }
            else {
                // console.log(typeof (arr));
                // count = arr[-1].id+1;
                // console.log(arr[arr.length-1].id);
                count = arr[arr.length - 1].id + 1;
                var temp = {"id":count,"image":pf,"name":pn,"price":pp,"details":pd};
                arr.push(temp);
                fs.writeFile("products.json", JSON.stringify(arr), (err) => {
                    res.end();
                })
            }

        }
    })
})
app.get('/new',(req,res)=>{
    if(req.session.logged_in){
        res.render("new");
    }
})


app.get('/signup',(req,res)=>{
    if(req.session.logged_in){
        res.redirect("/home");
        return;
    }
    res.render('signup',{error : ""});
})
app.post('/login',(req,res)=>{
    let {username,password}  = req.body;
    fs.readFile("./userdata.json","utf-8",(err,data)=>{
        if(err){
            res.render("login",{error: "something wengt wrong"})
            return;
        }
        let users = [];
        if(data.length>0){
            users = JSON.parse(data);
        }
        for(let i=0;i<users.length;i++){
            let user = users[i];
            if(user.username === username && user.password === password){
                req.session.logged_in = true;
                req.session.username = user.username;
                res.redirect("/home");
                return;
            }
        }
        res.render("login",{error:"username or password is incorrect"});
    })

})
app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
  })
app.post('/signup',(req,res)=>{
    let{name,username, password,email} = req.body;
    fs.readFile("./userdata.json","utf-8",(err,data)=>{
        if(err){
            res.render("signup",{error: "something went wrong"})
            return;
        }
        let users = [];
        if(data.length>0){
            users = JSON.parse(data);
        }
        for(let i=0;i<users.length;i++){
            let user = users[i];
            if(user.username === username){
                res.render("signup",{error : "userexist"});
                return;
            }
        }
        let user = {name:name,username:username, password:password,email:email}
        users.push(user);
        fs.writeFile("./userdata.json",JSON.stringify(users),function(err){
            if(err){
                res.render("signup",{error:"something went wrong"});
            }
            req.session.logged_in = true;
            req.session.username = user.username;
            res.redirect("/home");
        })    
    })
})

app.get('/getpro',(req,res)=>{
    fs.readFile("products.json",(err,data)=>{
        let arr;
        if(data.length===0){
            arr = [];
        }
        else{
            arr = JSON.parse(data);
        }
        res.json(arr);
    })
})

app.get("/home",checkAuth,(req,res)=>{
    res.render("home",{name:req.session.username});
})

app.get('*',(req,res)=>{
    res.send(404);
})

app.listen(port,()=>{
    console.log(`app listening at http://localhost:${port}`);
})