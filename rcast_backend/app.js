const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
require('dotenv').config()
const sequelize = require('./src/db/db')
const { DataTypes } = require("sequelize")
const User = require('./src/models/user')(sequelize, DataTypes)
const passport = require('passport')
require('./config/passport')
const session = require('express-session')

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

var cors=require('cors');
var jwt = require('jsonwebtoken');

//Initializing express
const app = express()

//Express Middleware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized:true}));
app.use(passport.initialize())
app.use(passport.session())

app.use(cors({origin:true,credentials: true}));




// //Logout Route
// app.get('/logout-user', (req, res) => {
//     if(req.headers.authorization){
//         try{
//             var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
//             User.findOne({
//                 where: { id: userInfo.id, email: userInfo.email}
//             }).then(user => {
//                 var userTokens = user.dataValues.tokens
//                 if(userTokens){
//                     filterExpiredTokens(userTokens).then((finalTokens) => {
//                         if(finalTokens.includes(req.headers.authorization)){
//                             var filteredTokens = finalTokens.filter(function (str) { return !str.includes(req.headers.authorization); })
//                             User.update({ tokens: filteredTokens }, {where: { id: userInfo.id }}).then((instance2)=>{
//                                 res.send({message: "Logged out"})
//                             })
//                         }else{
//                             res.send({message: "Logged out"})
//                         }
//                     })
//                 }
//             }).catch(err => {
//                 res.send({message: "Logged out with error oh well"})
//             });;
//         }catch(err2){
//             res.send({message: "Logged out with error oh well"})
//         }

//     }
    
// })

// async function filterExpiredTokens(tokens){
//     var finalTokens = []
//     var dateNow = Date.now()
//     for(let i = 0; i < tokens.length; i++){
        
//         if (dateNow < jwt.decode(tokens[i])["exp"] * 1000) {
//             finalTokens.push(tokens[i])
//         }
//     }
//     return finalTokens
// }

// app.post('/check-user', (req, res) => {
//     if(req.headers.authorization){
//         try{
//             var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
        
//         User.findOne({
//             where: { id: userInfo.id, email: req.body.user.email }
//         }).then(user => {
//             var userTokens = user.dataValues.tokens
//             if(userTokens){
//                 filterExpiredTokens(userTokens).then((finalTokens) => {
//                     if(finalTokens.includes(req.headers.authorization)){
        
//                         var finalUser = {...req.body.user}
//                         var newToken = jwt.sign(
//                             { id: userInfo.id, email: userInfo.email},
//                             process.env.TOKEN_KEY,
//                             {
//                               expiresIn: "7d",
//                             }
//                         )
//                         var filteredTokens = finalTokens.filter(function (str) { return !str.includes(req.headers.authorization); })
//                         var savedTokens = [...filteredTokens, newToken]
//                         User.update({ tokens: savedTokens }, {where: { id: userInfo.id }}).then((instance2)=>{
//                             // finalUser["token"]  = newToken;
//                             res.json({data: {user:finalUser, token: newToken}})
//                         })
//                     }else{
//                         res.json(null)
//                     }
//                 })
//             }
//         }).catch(err => {
//             res.json(null)
//         });
//         }catch(err2) {
//             res.json(null)
//         }
//     }
// })


// app.post('/oauth/google', (req,res) => {
//     const token  = req["body"]["idToken"]
//     client.verifyIdToken({
//         idToken: token,
//         audience: process.env.CLIENT_ID
//     }).then((ticket) => {
//         const { name, email, picture } = ticket.getPayload(); 
//         User.upsert({
//             name: name,
//             picture: picture,
//             email: email, 
//             username: null,
//             // tokens: []
//         }).then((instance) => {
//             const token = jwt.sign(
//                 { id: instance[0]["dataValues"]["id"], email: instance[0]["dataValues"]["email"] },
//                 process.env.TOKEN_KEY,
//                 {
//                     // expiresIn: 1,
//                   expiresIn: "7d",
//                 }
//             )

//             var savedTokens = instance[0]["dataValues"]["tokens"]
//             if(savedTokens === null){
//                 savedTokens = []
//             }
//             savedTokens.push(token)
//             User.update({ tokens: savedTokens }, {where: { id: instance[0]["dataValues"]["id"] }}).then((instance2)=>{
//                 const responseUserObject = {... instance[0]["dataValues"]}
//                 delete responseUserObject["tokens"]
//                 delete responseUserObject["id"]
//                 // responseUserObject["token"] = token
//                 res.json({user:responseUserObject, token:token})
//             })

            
//         } );


//     });
// })

// //Route
app.get('/', (req, res) => {
    res.send({message: 'Hello World'})
})


app.get('/api/spotify-credentials', (req, res) => {
    const clientId = process.env.clientId;
    const clientSecret = process.env.clientSecret;
    const redirectUri = process.env.redirectUri;
    const spotifyCredentials = { clientId, clientSecret, redirectUri };
    res.json(spotifyCredentials);
});


app.listen(process.env.PORT, async () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
    try{
        await sequelize.sync(
            //{force: true}
        )
    }catch(error){
        console.error(`Error: Cannot connect to database ${error}`)
    }
})