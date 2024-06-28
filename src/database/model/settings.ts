import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    pin: {
      type: String,
      required: true,
    },
  },
  { timestamps: false }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
