import mongoose from "mongoose";




const masterDataSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique:true
  },
  district: {
    type: String,
   
  },
  location: {
    type: String,
  },
  type: {
    type: String,
    enum: ["location", "car"],
  },
  model: {
    type: String,
  },
  variant: {
    type: String,
  },
  photoUrl : {
    type:String
  },
  brand:{
    type:String
  }
});

const MasterData = mongoose.model("MasterData", masterDataSchema);

export default MasterData


