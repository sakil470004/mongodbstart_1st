const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
// middleware
app.use(cors());
app.use(express.json());

// username:myFirstMongoDb
// password:rQdRL90tWAHAfjfW


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://myFirstMongoDb:rQdRL90tWAHAfjfW@cluster0.poyqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("users");

        // get api
        // git all user
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // find single user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            res.send(user);

        })

        // post Api
        // insert new user
        app.post('/users', async (req, res) => {

            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            // console.log('added user ',newUser)
            res.json(result)
        })


        // update api
        // update user details
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }

            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, option);
            // console.log('updateing uper')
            res.json(result)
        })

        // delete api
        // delete user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            // console.log('deleting user with id ',id);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my CRUD server');
})

app.listen(port, () => {
    console.log('Runnig surver on ', port)
})