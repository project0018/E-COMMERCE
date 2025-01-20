import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
      type: String,
      default: 'https://goguides.azureedge.net/media/0j3ofphy/1d2fed61-de3f-417e-934d-bd3ec1064a4c.jpg?anchor=center&mode=crop&width=1600&height=1066&quality=50'  
    },
    location:{
        type: String,
        required: true
    }
},{ timestamps: true} );

 const Project = mongoose.model('Project', projectSchema);
 export default Project;