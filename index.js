const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Data = require('./dataSchema'); 
const cors = require("cors");
// Connect to MongoDB

// MongoDB connection
mongoose.connect('mongodb+srv://ansariamaan854:Amaan_123@cluster0.otm7zmp.mongodb.net/DecoLivings', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("connected successfully"))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });


 

  app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
// Endpoint to save the data
app.post('/data', async (req, res) => {
  const data = req.body;

  // Find the highest uniqueId in the collection
  const lastEntry = await Data.findOne({}, {}, { sort: { uniqueId: -1 } });

  let uniqueId = 100;
  if (lastEntry) {
    uniqueId = lastEntry.uniqueId + 1;
  }

  // Create a new Data document with the uniqueId
  const newData = new Data({ uniqueId, ...data });

  // Save the document to the database
  newData.save()
    .then((savedData) => {
      res.json({ message: 'Data saved successfully', id: savedData.uniqueId });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Failed to save data to MongoDB' ,err});
    });
});
//Defined a route to get data
app.get('/data/:id', (req, res) => {
  const id = req.params.id;

  // Find the Data document by uniqueId
  Data.findOne({ uniqueId: id })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Failed to retrieve data from MongoDB' });
    });
});

//Defined a route to get specific  data's subData
app.get('/data/:id/:category', (req, res) => {
  const id = req.params.id;
  const category = req.params.category;

  // Find the Data document by uniqueId
  Data.findOne({ uniqueId: id })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      // Find the item with the specified category
      const item = data.items.find((item) => item.category === category);

      if (!item) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Extract the properties for the specified category
      const properties = item.properties;

      res.json(properties);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Failed to retrieve data from MongoDB' });
    });
});

// define a route to get all data
app.get('/data', (req, res) => {

  Data.find()
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: 'Data not found' });
      }

      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Failed to retrieve data from MongoDB' });
    });
});
//delete all the entry
app.delete('/api/data', (req, res) => {
  Data.deleteMany({})
    .then(() => {
      console.log('All entries deleted successfully');
      res.status(200).json({ message: 'All entries deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting entries:', error);
      res.status(500).json({ error: 'Error deleting entries' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
