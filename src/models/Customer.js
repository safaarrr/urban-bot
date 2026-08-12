import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({

    phone: {
        type: String,
        required: true,
        unique: true
    },

    altPhone: {
        type: String,
        default: null
    },

    optedOut: {
        type: Boolean,
        default: false
    }

}, {

    timestamps: true

});

export default mongoose.model("Customer", customerSchema);
