
const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
  uniqueId: { type: Number, required: true, unique: true, default: 100  },
  address: String,
  date: String,
  name: String,
  items: [
    {
      category: String,
      categoryPrice: String,
      properties: [
        {
          subCategory: String,
          length: Number,
          width: Number,
          unitPrice: Number,
          totalSqft: Number,
          totalPrice: Number,
          categoryKey: String,
        }
      ]
    }
  ]
});



const dataSchema = new mongoose.Schema([categorySchema]);


// Create the model
const Data = mongoose.model('Data', dataSchema);

// Export the model
module.exports = Data;
