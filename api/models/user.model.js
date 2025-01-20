import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },    
    contactno: { 
        type: String,  // Changed to String because of leading zeros or long numbers
        required: true, 
        maxlength: 10,
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User; 
