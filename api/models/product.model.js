import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    companyname: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://www.shutterstock.com/image-photo/small-shopping-cart-set-construction-600nw-2449653613.jpg',
    },
    stock: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: 'uncategorized',
    },
    content: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    previousprice: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,    
    },
}, {timestamps: true} );

const Product = mongoose.model('Product', productSchema);

export default Product;  