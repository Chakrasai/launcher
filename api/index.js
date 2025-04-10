dotenv = require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const io = require('socket.io-client');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log('MongoDB connected successfully');
}).catch((err)=>{
    console.log("error in connecting to mongodb",err);
})

const launch = require('./models/launch');
const user = require('./models/user')

app.use(cors({ 
    credentials: true, 
    origin: process.env.CLIENT_ORIGIN, 
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

const socket = io.connect(process.env.SOCKET)
console.log(socket.id);
socket.on("connect",()=> console.log("Socket connected successfully"));
socket.on("disconnect",()=> console.log("Socket disconnected successfully"));
socket.on("error",()=> console.log("Socket error"));

socket.on("launchsuccess",(data)=> console.log("success:",data));
socket.on("launchfailure",(data)=> console.log("error:",data));


const verifytoken = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'no token Unauthorized'});
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(403).json({message:'Forbidden'});
        }
        req.user = decoded;
        next();
    })
}


app.post('/login',async (req,res)=>{
    try{
        const {username,password} = req.body;
        const userdata = await user.findOne({username});
        if(!userdata){
            return res.status(400).json({message:'User not found'});
        }
        if (userdata.password !== password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        let token = jwt.sign(
            { username: userdata.username, id: userdata._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.cookie("token", token, { httpOnly: true, sameSite: "Lax", secure: false }); 
        return res.json({ message: "Login successful!", token });
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal server error'});
    }

    
})

app.post('/register',async(req,res)=>{
    try{
        const {username,password} = req.body;
        let existing = await user.findOne({username});
        if(existing){
            return res.status(400).json({message:'User already exists'});
        }
        const newuser = await user.create({username,password});
        let token = jwt.sign({ username: newuser.username, id: newuser._id }, process.env.JWT_SECRET, { expiresIn: "20h" });
        res.cookie("token", token, { httpOnly: true, sameSite: "Lax" });
        return res.status(201).json({ message: "Signup successful!", user: newuser });
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal server error'});
    }
})


app.get('/logout',async (req,res)=>{
    res.clearCookie('token')
    return res.json({message:"Logged out successfully"})
})

app.get("/user", verifytoken, (req, res) => {
    res.json({ username: req.user.username, id: req.user.id });
});

app.post('/enroll',verifytoken,async(req,res)=>{
    const {apps,websites,command} = req.body;
    const id = req.user.id;
    try {
        const existing = await launch.findOne({ command, id });
        if (existing) {
            return res.status(400).json({ message: 'Command already exists' });
        }
        const newEnroll = await launch.create({
            userid: id,
            command: command,
            apps: apps,
            websites: websites
        });
        console.log(newEnroll);
        res.status(201).json({ message: 'Enrolled successfully', data: newEnroll });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/getlaunch',verifytoken,async(req,res)=>{
    const {command} = req.body;
    const id = req.user.id;
    try{
        const launchdata = await launch.findOne({command,userid:id});
        if(!launchdata){
            return res.status(400).json({message:'Command not found'});
        }
        const apps = launchdata.apps;
        const websites = launchdata.websites;
        
        socket.emit("launch",{apps,websites});
        
        res.status(200).json({message:'Launch found',data:launchdata});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Internal server error'});
    }

})

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});