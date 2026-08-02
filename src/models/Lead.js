import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({

    name: {
        type: String,
        default: ""
    },

    businessName: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        required: true
    },

    service: {
        type: String,
        required: true
    },

    location: {
        type: String,
        default: ""
    },

    requirements: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: "New"
    }

}, {

    timestamps: true

});

export default mongoose.model("Lead", leadSchema);
