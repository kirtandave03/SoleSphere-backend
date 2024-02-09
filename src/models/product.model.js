const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
        type: String,
        required: true,
        index: true
    },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  shortDescription:{
        type: String,
        trim: true
    },

  categories : [
      {
        type: String
      }
  ],

  brand: {
    type : String,
    required: true
  },

  price : {
    type : String,
    required: true
  },

  image_url: [{
    type: String
  }],

  lastMonthSell: {
    type: Number,
    default : 0
  },

  stock: {
    type: Number,
    required : true
  },

  discount : {
    startDate : {
        type : Date
    },

    discount:{
        type: Number,
        default: 0
    },

    endDate : {
        type : Date
    }
  }, 

  material: {
    type : String,
    required : true
  },

  color : {
    type : String,
    required : true
  },

  rating : [{
    user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User'
    },
    rating : {
      type: Number
    }
  }],

  review : [{

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
      },
    tag: {
        type : String
    },
    image_url : [{
        type : String
      }],

    review : {
        type: String
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }


    }],

    longDescription : 
       {
            type : String,
            trim: true
       },
    
    giftPackaging :{
        type : Boolean,
        default: false
    }, 

    qr :
      {
        type : String
      }

}, {timestamps: true});


const Product = mongoose.model('Product', productSchema )
module.exports = Product;