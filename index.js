const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8joqcm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// let verifyJWT=(req,res,next)=>{

//  const authHeader=req.headers.authorization;
//  console.log(authHeader)
//  if(!authHeader){
//     return res.status(401).send('Unauthorized access');
//  }
//  const  token=authHeader.split(' ')[1];
 
//  jwt.verify(token, process.env.ACCESS_TOKEN, function(err,decoded){
//     if(err){
//         return res.status(403).send({message: 'Forbidden Aceess'})
//     }
//     req.decoded=decoded;
//     next();
//  })
// }

async function run() {
    try {
        
        const usersCollection = client.db('memoralbum').collection('users');
        const imageCollection = client.db('memoralbum').collection('images');
        

  



//Images operation start
app.get('/images/:email',async(req,res)=>{
    // const id= req.params.id;
    const query={email: req.params.email};
    const images=await imageCollection.find(query).toArray();
    res.send(images)
})
app.get('/images', async(req,res)=>{
    const query ={};
    const images=await imageCollection.find(query).toArray();
    res.send(images)
})
app.post('/images',async(req,res)=>{
    const image=req.body;
    const result= await imageCollection.insertOne(image)
    res.send(result)
 })

 app.get(`/images/:id`,async(req,res)=>{
    const _id=req.params.id;
   const query={_id: ObjectId(_id)}
    const result = await imageCollection.findOne(query);
    res.send(result)
   })
  app.delete('/images/:id',async(req,res)=>{
    const _id=req.params.id;
    
    const query={_id:new ObjectId(_id)}
    const result=await imageCollection.deleteOne(query)
    res.send(result)
   })

/
   //Images operation ends



 
//jwt
app.get('/jwt',async(req,res)=>{
    const email=req.query.email;
    const query ={email: email};
    const user=await usersCollection.findOne(query);
    if(user){
         const token=jwt.sign({email},process.env.ACCESS_TOKEN,{expiresIn:'1h'}) 
         return res.send({accessToken: token})
    }
    res.status(403).send({accessToken: ''})
    
})
//users operation starts
app.get('/users', async(req,res)=>{
    const query ={};
    const users=await usersCollection.find(query).toArray();
    res.send(users)
})

app.get('/users/admin/:email', async(req,res)=>{
    const email=req.params.email;
    const query= {email}
    const user =await usersCollection.findOne(query)
    res.send({isAdmin: user?.role === 'admin' })
})

 app.post('/users',async(req,res)=>{
    const user=req.body;
    const result= await usersCollection.insertOne(user)
    res.send(result)
 })






    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('memoralbum server is running');
})

app.listen(port, () => console.log(`Memoralbum running on ${port}`))