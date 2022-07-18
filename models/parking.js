import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
    },
    mobile_number: {
      type: Number,
      maxlength: 10,
      unique: true,
    },
    vehicle_name: {
      type: String,
    },
    vehicle_number: {
      type: String,
    },

    entry_date: {
      type: String,
      default: new Date().toLocaleDateString(),
    },
    document: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Parking_details", parkingSchema);
