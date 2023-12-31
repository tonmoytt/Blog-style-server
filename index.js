
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middelware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.NAME_Db}:${process.env.PASSWORD_Pb}@cluster0.jfgqsm5.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // const databaseSample = client.db("blogDB");
        // const testCollection = databaseSample.collection("testComments")
        const database = client.db("Blog").collection("blog user");
        const wishlistdatabase = client.db("wishlist").collection("wishlist user");
        const commenttdatabase = client.db("comment").collection("comment user");


        // commnet post data//
        app.post('/comment', async (req, res) => {
            const body = req.body
            const result = await commenttdatabase.insertOne(body);
            res.send(result)
        })


        // get data in server at comment  from commentdatabase//
        app.get('/comment', async (req, res) => {
            const cursor = commenttdatabase.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/comment/:id',async (req,res) =>{
            const id =req.params.id;
            const cursor={_id: new ObjectId(id)}
            const result= await commenttdatabase.findOne(cursor)
            res.send(result)
        })
        
   // update commented user//
        app.patch("/updateComment/:commentId", async(req, res)=> {
            const commentId = req.params.commentId;
            const comment = req.body;
            const updatedComment = {
                $set: {
                    ...comment
                }
            }
            const filter = {_id: new ObjectId(commentId)}
            const result = await commenttdatabase.updateOne(filter, updatedComment);
            res.send(result)
        })

     
         
        //   wishlist//
        app.post('/wishlist', async (req, res) => {
            const body = req.body
            const result = await wishlistdatabase.insertOne(body);
            res.send(result)
        })


        // get data in server at wishlist  from database//
        app.get('/wishlist', async (req, res) => {
            const cursor = wishlistdatabase.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // deleted from wishlist//
        app.delete('/wishlist/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: id };
            const result = await wishlistdatabase.deleteOne(query);
            res.send(result)
        })

        // get all blog user alldata database//
        app.get('/users', async (req, res) => {
            const cursor = database.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // by addblog post in allblog database//

        app.post('/users', async (req, res) => {
            const body = req.body
            const result = await database.insertOne(body);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})