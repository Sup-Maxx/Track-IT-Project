const { Schema, model } = require("mongoose");

const daySchema = new Schema({
  name: String,
  done: Boolean,
});

const habitSchema = new Schema(
  {
    title: {
      type: String,
      trim: false,
      required: [true, "What do you want to track?"],
      unique: false,
      lowercase: false,
    },
    category: {
      type: String,
      enum: ["Health", "Sport", "Daily Routine", "Work", "Art"],
    },
    duration: {
      type: String,
      enum: ["7", "14", "21"],
    },
    description: {
      type: String,
    },
    author: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    days: [
      {
        type: daySchema,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Habit = model("Habit", habitSchema);
const Days = model("Days", daySchema);

module.exports = Habit;

