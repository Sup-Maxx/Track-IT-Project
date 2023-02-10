// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
};

// if an already logged in user tries to access the login page
// it redirects the user to the profile page
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/profile");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
