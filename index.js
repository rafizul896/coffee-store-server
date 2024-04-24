const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y7qmkns.mongodb.net/?retryWrites=true&w=majority&appName=cluster0`;

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

        const coffeeCollection = client.db("coffeeDB").collection("coffee");
        const userCollection = client.db("coffeeDB").collection("users");

        app.get('/coffee', async (req, res) => {
            const curson = coffeeCollection.find();
            const result = await curson.toArray()
            res.send(result);
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.put('/coffee/:id', async (req, res) => {
            const coffee = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCoffee = {
                $set: {
                    coffeeName: coffee.coffeeName,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category,
                    details: coffee.details,
                    price: coffee.price,
                    photo: coffee.photo
                }
            }
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })

        // Users related APIs :

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
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
    res.send('Coffee making server is running..!')
})

app.listen(port, () => {
    console.log(`Coffee server is runnig on Port: ${port}`)
})