import mongoose from "mongoose";

const BroilerSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Broiler ||
  mongoose.model("Broiler", BroilerSchema);
