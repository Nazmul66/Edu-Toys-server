const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.rnkzyeb.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const usersToyCollection = client.db("EduToys").collection("AllToys");

    // addToy POST Method
     app.post("/Toy", async(req, res) =>{
         const body = req.body;
         console.log(body)
         const result = await usersToyCollection.insertOne(body);
         res.send(result);
     })

     // allToy GET Method
     app.get("/allToy", async(req, res) =>{
         const cursor = await usersToyCollection.find({}).toArray();
         res.send(cursor);
     })

     // updateToy GET method
     app.get("/allToy/:id", async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }

        const result = await usersToyCollection.findOne(query)
        res.send(result);
      })

      // updateToy PUT method
      app.put("/update/:id", async(req, res) =>{
          const id = req.params.id;
          console.log(id);
          const UpdateToy = req.body;
          console.log(UpdateToy)
          const filter = { _id: new ObjectId(id) }
          const options = { upsert: true };

          const updateToyInfo = {
                $set: {
                  ProductName  :  UpdateToy.ProductName, 
                  seller_Name  :  UpdateToy.seller_Name, 
                  Email        :  UpdateToy.Email, 
                  Category     :  UpdateToy.Category, 
                  Price        :  UpdateToy.Price, 
                  Rating       :  UpdateToy.Rating,  
                  Quantity     :  UpdateToy.Quantity, 
                  Photo        :  UpdateToy.Photo, 
                  Describe     :  UpdateToy.Describe, 
                }
          }

          const result = await usersToyCollection.updateOne(filter, updateToyInfo, options)
          res.send(result);
      })

      // myToy GET method to get all email data
     app.get("/myToy", async(req, res) =>{
      // console.log(req.query.email)
           let queries = {};
           if(req?.query?.email){
               queries = { Email : req.query.email }
           }
           const cursors = usersToyCollection.find(queries)
           const result = await cursors.toArray();
           res.send(result)
     })

     app.delete("/delete/:id", async(req, res) =>{
         const id = req.params.id;

         const deleteQuery = { _id: new ObjectId(id) }
         const result = await usersToyCollection.deleteOne(deleteQuery)
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