const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const productVariantSchema = new mongoose.Schema({
  colorAndImage: [
   { color: {
      type: String,
      required: true
    },
    image_urls: [{
      type: String
    }]}
  ],
  sizeAndPrice:[
    {size:{
      type: String,
      required: true
    },
    actual_price: {
      type: Number,
      required: true
    },
    discounted_price: {
      type: Number,
      required: true
    },}
  ],
  stock: {
      type: Number,
      required: true
  },
});

const productSchema = new mongoose.Schema({
  productName: {
      type: String,
      required: true,
      index: true
  },
  shortDescription: {
      type: String,
      trim: true
  },
  categories: [{
      type: String
  }],
  brand: {
      type: String,
      required: true
  },
  variants: [productVariantSchema], // This is the array of product variants
  lastMonthSell: {
      type: Number,
      default: 0
  },
  discount: {
      startDate: {
          type: Date
      },
      discount: {
          type: Number,
          default: 0
      },
      endDate: {
          type: Date
      }
  },
  material: {
      type: String,
      required: true
  },
  longDescription: {
      type: String,
      trim: true
  },
  giftPackaging: {
      type: Boolean,
      default: false
  },
  qr: {
      type: String
  }
}, { timestamps: true });

productSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Product = mongoose.model('Product', productSchema )
module.exports = Product;