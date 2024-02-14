const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    order : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order' 
    },
    
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    products: [{
        product: {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },

        quantity : {
            type: Number,
            required : true,
            default :1
        },

        price : {
            type : String,
            required : true
        }
    }],

    totalAmount : {
        type: String,
        required : true
    },

    paymentMethod : {
        type : String,
        required : true
    }
},{timestamps: true});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;