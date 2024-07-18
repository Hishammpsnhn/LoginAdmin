import { errorMsg, sessionStore } from "../middleware/authMiddleware.js";
import User from "../model/userSchema.js";
import validator from "validator";
import bcrypt from "bcrypt";
// @desc    login user credentials
// @route   POST /route/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const exitingUser = await User.findOne({ email });
  if (!exitingUser) {
    errorMsg(req, res, "User not found");
    return;
  }
  bcrypt.compare(password, exitingUser.password, function (err, result) {
    if (result) {
      sessionStore(req, res, exitingUser);
      if (exitingUser.isAdmin) {
        req.session.isAdmin = true;
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    }else{
      errorMsg(req, res, "Incorrect password");
    }
  });
};

// @desc    signUp user credentials
// @route   POST /route/signup
export const signUp = async (req, res) => {
  const { email, password, name, confirmPassword } = req.body;

  if (!email || !password || !name || !confirmPassword) {
    return errorMsg(req, res, "complete all feilds", "/signup");
  }

  if (!validator.isEmail(email))
    return errorMsg(req, res, "Invalid email", "/signup");

  if (!validator.equals(password, confirmPassword))
    return errorMsg(req, res, "Passwords do not match", "/signup");

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    errorMsg(req, res, "User already exists");
    return;
  }
  let hashedPassword;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      //hashedPassword = hash
      const user = await User.create({
        userName: name,
        email,
        password: hash,
      });
      if (user) {
        sessionStore(req, res, user);
        res.redirect("/");
        res.status(200).json();
      }
    });
  });
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
