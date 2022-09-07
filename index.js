import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/masterdata", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () =>{
    console.log("Connected to MongoDB");
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const User = new mongoose.model('User', userSchema)


//Routes
app.post("/login", (req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password) {
                res.send({message: 'Login successful', user: user});
            } else{
                res.send({message: 'Password incorrect'});

            }
        } else {
            res.send({ message: "User not exist"})
        }
    })
})

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body
    User.findOne({ email: email}, (err, user) => {
        if (user) {
            res.send({message: "User already exists"})
        } else {
            const user = new User({
                name, 
                email, 
                password
            })
            user.save( err => {
                if (err) {
                    res.send(err)
                }else {
                    res.send ({ message: "Successfully signed up"})
                }
        
            })
        }
    })
    
})

app.listen(9002, () => {
    console.log("Listening on port 9002")
})