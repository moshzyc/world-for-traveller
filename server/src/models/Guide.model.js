import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    images:{
        type:[String]
    },
})
export const Guide = mongoose.model("guide", GuideSchema)