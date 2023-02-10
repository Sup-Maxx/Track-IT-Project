const mongoose = require("mongoose")
const MONGODB_URI = "mongodb://127.0.0.1/lab-movies-celebrities";

const Habit = require("./models/Habbit.model")

const habitList = [
    {
        title: "Make the bed",
        category: "Daily Routine",
        duration: "21 days",
        description: "Make the bed all days, like in the army"
    }, {
        title: "Drink glass of water with empty stomach",
        category: "Health",
        duration: "21 days",
        description: "How about to start a day with one glass of fresh water before eat something?"
    },
]

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("Connection Established 1️⃣✅")
        return Habit.create(habitList)
    })
    .then(() => {
        console.log("DB Updated 2️⃣🌀")
        console.log("Connection closed 3️⃣❌")
        mongoose.connection.close()
    })
    .catch((error) => {
        console.log("Error while seeding DB: " + error)
    })