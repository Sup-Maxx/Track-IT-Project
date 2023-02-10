const router = require("express").Router();
const User = require("../models/User.model");
const Habit = require("../models/Habbit.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//route GET for the HabitBoard page (1)
router.get("/profile", isLoggedIn, (req, res) => {
  // console.log(req.body)

  User.findById(req.session.currentUser._id)
    .populate("habit")
    .then((info) => {
      // res.render("profile/habitboard", info);
      res.render("profile/habitboard", { info, theme: "colored" });
    });
});

//route GET for create a new habit page (2)
router.get("/profile/create-habit", (req, res) => {
  // res.render("profile/create-habit");
  res.render("profile/create-habit", { theme: "colored" });
});

//route POST for "create a new HABIT" (3)
router.post("/profile/create-habit", (req, res) => {
  const { title, category, description, author, days } = req.body;
  // console.log(days);

  if (!title) {
    // return res.render('profile/create-habit', {
    return res.render("profile/create-habit", {
      theme: "colored",
      errorMessage: "The title field is mandatory. Please provide this detail.",
    });
  }

  let daysOfHabit = [];

  if (days) {
    // console.log(days);
    const arrayToLoop = Array.from(Array(Number(days)).keys());
    // console.log(arrayToLoop);
    arrayToLoop.forEach((element) => {
      const day = { name: `day${element + 1}`, done: false };
      daysOfHabit = [...daysOfHabit, day];
    });
  }
  // console.log("daysOfHabit", daysOfHabit);
  Habit.create({
    title,
    category,
    duration: days,
    description,
    author: req.session.currentUser._id,
    days: daysOfHabit,
  })
    .then((habit) => {
      return User.findByIdAndUpdate(req.session.currentUser._id, {
        $push: { habit: habit._id },
      });
    })
    .then(() => {
      res.redirect("/profile");
    });
});

//route GET for habit details page (4)
router.get("/profile/habit/:habitId", (req, res) => {
  const { habitId } = req.params;

  Habit.findById(habitId)
    .then((habit) => {
      // console.log("This is your habit: " + habit);
      // res.render("profile/habit-details", habit);
      res.render("profile/habit-details", { habit, theme: "colored" });
    })
    .catch((error) => {
      console.log("There was an error retrieving your habit page: " + error);
    });
});

//route GET for edit habit page (5)
router.get("/profile/:habitId/edit", (req, res) => {
  const { habitId } = req.params;

  Habit.findById(habitId)
    .then((habitToEdit) => {
      // console.log("The habit you want to edit is this one: " + habitToEdit);
      // res.render("profile/edit-habit", habitToEdit);
      res.render("profile/edit-habit", { habitToEdit, theme: "colored" });
    })
    .catch((error) => {
      console.log("there was an error trying to edit your habit: " + error);
    });
});

//route POST for editing a habit (6)
router.post("/profile/:habitId/edit", (req, res) => {
  const { habitId } = req.params;
  const { title, category, duration, description } = req.body;

  Habit.findByIdAndUpdate(
    habitId,
    { title, category, duration, description },
    { new: true }
  )
    .then((updatedHabit) => {
      res.redirect(`/profile`);
    })
    .catch((error) => {
      console.log("Error occured while editing your habit: " + error);
    });
});

//route POST for deleting a habit (7)
router.post("/profile/:habitId/delete", (req, res) => {
  const { habitId } = req.params;

  Habit.findByIdAndDelete(habitId)
    .then((deletedHabit) => {
      res.redirect("/profile");
    })
    .catch((error) => {
      console.log("Error while deleting a habit: " + error);
    });
});

//route POST for editing a progression (8)
router.post("/profile/:habitId/edit-progression", (req, res) => {
  const { habitId } = req.params;

  const daysToChange = req.body;

  Habit.findById(habitId)
    .then((myHabit) => {
      const newDays = myHabit.days.map((day) => {
        const foundInDaysToChange = Object.keys(daysToChange).find(
          (el) => el === day.name
        );
        if (foundInDaysToChange) {
          day.done = true;
        } else {
          day.done = false;
        }
        return day;
      });
      return newDays;
    })
    .then((newDays) => {
      Habit.updateOne({ _id: habitId }, { days: newDays }).then(() => {
        res.redirect("/profile");
      });
    });
});

module.exports = router;
