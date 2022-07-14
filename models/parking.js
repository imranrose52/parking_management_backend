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
    slot: {
      type: String,
    },
    entry_date: {
      type: String,
      default: new Date().toLocaleDateString(),
    },
    payment_status: {
      type: String,
      default: "un-paid",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Parking_details", parkingSchema);
