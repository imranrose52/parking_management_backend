import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Refresh_token_model",
  refreshTokenSchema,
  "refresh_tokens"
);
