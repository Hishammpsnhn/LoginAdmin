import User from "../model/userSchema.js";

// const credential = {
//   userName: "Hisham",
//   email: "hisham@gmail.com",
//   password: "123",
// };

// @desc    login user credentials
// @route   POST /route/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  const exitingUser = await User.findOne({ email });
  console.log(exitingUser);
  if (!exitingUser) {
    res.status(404).json({ msg: "User not found" });
    return;
  }
  console.log(exitingUser.password, password);

  if (exitingUser.password === password) {
    req.session.email = exitingUser.email;
    req.session.password = exitingUser.password;
    req.session.Username = exitingUser.userName;
    
    if (exitingUser.isAdmin) {
      res.render('admin', { user: req.session.Username });
    } else {
      res.redirect("/");
    }
  } else {
    req.session.passwordWrong = true;
    res.redirect("/login");
  }
};
// @desc    signUp user credentials
// @route   POST /route/signup
export const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ msg: "Email already exists" });
    return;
  }
  const user = await User.create({
    userName: name,
    email,
    password,
  });
  if (user) {
    req.session.email = user.email;
    req.session.password = user.password;
    req.session.Username = user.userName;
    res.redirect("/");
    res.status(200).json();
  }
};

// @desc    logout user credentials
// @route   GET /route/logout
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    // Clear the session cookie
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};
