const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
require('dotenv').config()
const sequelize = require('./src/db/db')
const { DataTypes } = require("sequelize")
const user = require('./src/models/user')(sequelize, DataTypes)
const friendship = require('./src/models/friends')(sequelize, DataTypes)
const friendRequest = require('./src/models/friendRequests')(sequelize, DataTypes)
const passport = require('passport')
require('./config/passport')
const session = require('express-session')
const https = require('https');

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
var SEQUELIZE = require('sequelize');
var Op = SEQUELIZE.Op;
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


// app.get('/read/tokens', (req,res) => {


// })


function UserUpsert(values, condition) {
    return Model
        .findOne({ where: condition })
        .then(function(obj) {
            // update
            if(obj)
                return obj.update(values);
            // insert
            return Model.create(values);
        })
}

app.post('/read/user', (req, res) => {
    console.log("UMMMM")
    console.log("READING USER")
    console.log(req.body)

    user.findOne({ where: { spotify_id: req.body.spotify_id} }).then(function(obj){
        console.log("HHHHHH")
        console.log(obj)
        if(obj){
            console.log("updating...")
            obj.update({
                spotify_id: req.body.spotify_id,
                display_name: req.body.display_name,
                email: req.body.email,
                status: "ACTIVE"
            }).then((instance) => {
                        console.log("INSTANCE")
                        console.log(instance["dataValues"])
                        const responseUserObject = { ...instance["dataValues"] }
                        const token = jwt.sign(
                            { id: instance["dataValues"]["id"], spotify_id: instance["dataValues"]["spotify_id"] },
                            process.env.TOKEN_KEY,
                            {
                                // expiresIn: 1,
                                expiresIn: "9999 years",
                            }
                        )
                        res.json({ user: responseUserObject, rcastToken: token })
                });
        }

        else{
            user.create({
                spotify_id: req.body.spotify_id,
                display_name: req.body.display_name,
                email: req.body.email,
                status: "ACTIVE"
            }).then((instance) => {
                        console.log("INSTANCE")
                        console.log(instance["dataValues"])
                        const responseUserObject = { ...instance["dataValues"] }
                        const token = jwt.sign(
                            { id: instance["dataValues"]["id"], spotify_id: instance["dataValues"]["spotify_id"] },
                            process.env.TOKEN_KEY,
                            {
                                // expiresIn: 1,
                                expiresIn: "9999 years",
                            }
                        )
                        res.json({ user: responseUserObject, rcastToken: token })
                });
        } 
        // console.log("RRR USER")
        // console.log(responseUserObject)
        // const token = jwt.sign(
        //     { id: responseUserObject["id"], spotify_id: responseUserObject["spotify_id"] },
        //     process.env.TOKEN_KEY,
        //     {
        //         // expiresIn: 1,
        //         expiresIn: "9999 years",
        //     }
        // )
        // res.json({ user: responseUserObject, rcastToken: token })

    })
    // user.upsert({
    //         spotify_id: req.body.spotify_id,
    //         display_name: req.body.display_name,
    //         email: req.body.email,
    //         status: "ACTIVE"
    //     }).then((instance) => {
    //         console.log("INSTANCE")
    //         console.log(instance[0]["dataValues"])
    //         const responseUserObject = { ...instance[0]["dataValues"] }
    //         const token = jwt.sign(
    //             { id: instance[0]["dataValues"]["id"], spotify_id: instance[0]["dataValues"]["spotify_id"] },
    //             process.env.TOKEN_KEY,
    //             {
    //                 // expiresIn: 1,
    //                 expiresIn: "9999 years",
    //             }
    //         )
    //         res.json({ user: responseUserObject, rcastToken: token })
    // });
})

// app.get('/logged', async (req, res) => {
//     const body = {
//       grant_type: 'authorization_code',
//       code: req.query.code,
//       redirect_uri: process.env.REDIRECTURI,
//       client_id: process.env.CLIENT_ID,
//       client_secret: process.env.CLIENT_SECRET,
//     }
  
//     await fetch('https://accounts.spotify.com/api/token', {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Accept": "application/json"
//       },
//       body: encodeFormData(body)
//     })
//     .then(response => response.json())
//     .then(data => {
//       const query = querystring.stringify(data);
//       res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);
//     });
//   });




app.get('/search-for-user/:string', (req,res) => {
    console.log(req.params.string)

    if (req.headers.authorization) {
            var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
            console.log("USER INFO")
            console.log(userInfo)
            var searchString = req.params.string.toLocaleLowerCase()
            console.log(searchString)
            if(userInfo.hasOwnProperty("id")){
                console.log("OK GURL")
                // try{
                    user.findAll({
                        where: {
                            [Op.or]: [
                                {display_name: { [Op.like]: '%' + searchString + '%' }},
                                {email: { [Op.like]: '%' + searchString + '%' }},
                                {spotify_id: { [Op.like]: '%' + searchString + '%' }}
                            ]
                        }, 
                        attributes: ['display_name', 'email','id']
                      }).then(function(users) {
                        console.log("USERRS")
                        console.log(users)
                        return res.json(users)
                    });
                    
                // }catch(err){
                //     res.send({data:false, success:false})
                // }       
            }
     

    }


})



app.post("/new-friend-request", (req, res) => {
    console.log(req.headers.authorization)
    // console.log(req.body.username)
    var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
    console.log(userInfo)
    if (req.headers.authorization) {

        try {
            var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
            user.findOne({
                    where: { id: req.body.userRequested }
                }).then(user => {
                    var userID = user.dataValues.id
                    friendRequest.create({
                        user_requesting: parseInt(userInfo.id), 
                        user_requested: parseInt(userID), 
                        request_status : "ACTIVE"
                    }).then((request) => {
                        console.log(request.dataValues)
                        if (request.dataValues.friend_request_id) {
                            console.log("POST ID")
        
                            res.send({ data : true, success: true})
                        } else {
                            res.send({ data: false, success: false })
                        }
                    })
                })

        } catch (err) {
            res.send({ data: false, success: false })
        }
 
    }else{
        res.send({ data: false, success: false })
    }
})


app.get('/get-all-friend-requests', (req,res) => {
    user.hasMany(friendRequest, {foreignKey: 'user_requesting'})
    friendRequest.belongsTo(user, {foreignKey: 'user_requesting'})
    if (req.headers.authorization) {
            var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
            if(userInfo.hasOwnProperty("id")){
                console.log("OK GURL")         
                try{
                    friendRequest.findAll({
                        where: {
                            user_requested: [userInfo.id], 
                            request_status: "ACTIVE"
                        }, 
                        include: [{model: user, attributes: ['display_name', 'email', 'id']}],
                        attributes: ['friend_request_id']

                      }).then(function(requests) {
                        console.log(requests)
                        return res.json({data: requests, success: true})
                    });
                    
                }catch(err){
                    console.log(err)
                    res.send({data:false, success:false})
                }       
            }

    }

})


app.get('/get-all-friends-requested', (req,res) => {
    user.hasMany(friendRequest, {foreignKey: 'user_requested'})
    friendRequest.belongsTo(user, {foreignKey: 'user_requested'})
    if (req.headers.authorization) {
            var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
            if(userInfo.hasOwnProperty("id")){
                console.log("OK GURL")         
                try{
                    friendRequest.findAll({
                        where: {
                            user_requesting: [userInfo.id], 
                            request_status: "ACTIVE"
                        }, 
                        include: [{model: user, attributes: ['display_name', 'email', 'id']}],
                        attributes: ['friend_request_id']
                      }).then(function(requests) {
                        console.log(requests)
                        return res.json({data: requests, success: true})
                    });
                    
                }catch(err){
                    console.log(err)
                    res.send({data:false, success:false})
                }       
            }

    }

})


app.put('/update-friend-request', (req,res) => {
    if (req.headers.authorization) {
            var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
            if(userInfo.hasOwnProperty("id")){
                console.log("OK GURL")      
                try{

                    friendRequest.update({
                        request_status: req.body.status,
                    }, { where: { friend_request_id: req.body.friend_request_id}, returning: true }).then((instance) => {
                        console.log(req.body.status)
                        if(req.body.status === "ACCEPTED"){
                            console.log(instance[1][0]['dataValues'])
                            var userOne = instance[1][0]['dataValues']['user_requesting']
                            var userTwo = instance[1][0]['dataValues']['user_requested']
                            console.log("REQ and REQ")
                            console.log(userOne)
                            console.log(userTwo)
                            friendship.create({
                                user_id_one: parseInt(userOne), 
                                user_id_two: parseInt(userTwo), 
                            }).then((friends) => {
                               
                                    // console.log(request.dataValues)
                                    if (friends.dataValues.friendship_id) {
                                        // console.log("POST ID")
                    
                                        res.send({ data : friends.dataValues.friendship_id, success: true})
                                    } else {
                                        res.send({ data: false, success: false })
                                    }
         

                            })
                        }else{
                            // console.log("MAMI")
                            if (instance[0] > 0) {
                                res.send({ data: true, success: true})
                            } else {
                                res.send({ data: false, success: false })
                            }
                        }

                    })
                }catch(err){
                    console.log(err)
                    res.send({data:false, success:false})
                }  

            }
     

    }


})

                        // where: {
                        //     [Op.or]: [
                        //         {user_id_one: [userInfo.id]},
                        //         {user_id_two: [userInfo.id]}
                        //     ]
                        // },






app.get('/get-all-friends', (req,res) => {
    user.hasMany(friendship, {foreignKey: 'user_id_two'})
    friendship.belongsTo(user, {foreignKey: 'user_id_two'})
    // User.hasMany(Friendship, {foreignKey: 'user_id_one'})
    // Friendship.belongsTo(User, {foreignKey: 'user_id_one'})
    if (req.headers.authorization) {
            var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
            if(userInfo.hasOwnProperty("id")){
                console.log("OK GURL")         
                try{
                    user.hasMany(friendship, {foreignKey: 'user_id_two'})
                    friendship.belongsTo(user, {foreignKey: 'user_id_two'})
                    friendship.findAll({
                        where: {
                            user_id_one: [userInfo.id], 
                        }, 
                        include: [{model: user, attributes: ['display_name', 'email', 'id']}],
                        attributes: ['friendship_id']
                      }).then(function(friends) {
                            console.log(friends)
                            user.hasMany(friendship, {foreignKey: 'user_id_one'})
                            friendship.belongsTo(user, {foreignKey: 'user_id_one'})
                            friendship.findAll({
                                where: {
                                    user_id_two: [userInfo.id], 
                                }, 
                                include: [{model: user, attributes: ['display_name', 'email', 'id']}],
                                attributes: ['friendship_id']
                              }).then(function(friends2) {
                                console.log(friends2)
                                return res.json({data: friends.concat(friends2), success: true})
                              })

                    });
                    
                }catch(err){
                    console.log(err)
                    res.send({data:false, success:false})
                }       
            }
     
    }

})


app.post('/remove-friendship', (req,res) => {


    if (req.headers.authorization) {
            var userInfo = jwt.verify(req.headers.authorization, process.env.TOKEN_KEY)
            console.log(userInfo)
            try{    
                if(userInfo.hasOwnProperty("id")){
                    console.log("OK GURL BAI")         
                
                    friendship.destroy({
                        where: {
                           friendship_id: req.body.friendshipId
                        }
                    }).then(function(instance) {
                        return res.json({data: true, success: true})

                    });
                    
                }
            }catch(err){
                    console.log(err)
                    res.send({data:false, success:false})
                }       
    }
     
})


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