import User from "../model/userSchema.js";
import data from "../utils.js";
import { errorMsg, sessionStore } from "../middleware/authMiddleware.js";
import validator from "validator";
import bcrypt from "bcrypt";


// @desc    Get all usets
// @route   GET /admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200);
   res.render("admin", { user: req.session.Username, users: users });
  } catch (error) {
    res.status(400).json({ message: "something went wrong!" });
  }
};

// @desc    delete a user
// @route   GET /admin:id
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ message: "User deleted successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!" });
  }
};

// @desc    update a user
// @route   PUT /admin:id
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  console.log(updateData, id);
  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    console.log(user);
    if (user) {
      res.status(200).json({ message: "User Updated successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!" });
  }
};

// @desc    getUser
// @route   GET /admin/user:id
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");

    if (user) {
      res.status(200).json({ message: "User details get successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    console.log(query);
    // Perform a case-insensitive search on userName and email fields
    const users = await User.find({
      $or: [
        { userName: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
      ],
    });
    //res.render("admin", { user: req.session.Username, users: users });
    //res.redirect('/admin')
    res.status(200).json({msg:"User found",user:users});
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
};

export const createUser = async(req, res) => {
  const { email, password, name, confirmPassword } = req.body;

  if (!email || !password || !name || !confirmPassword) {
    return errorMsg(req, res, "complete all feilds", "/admin/createUser");
  }

  if (!validator.isEmail(email))
    return errorMsg(req, res, "Invalid email", "/admin/createUser");

  if (!validator.equals(password, confirmPassword))
    return errorMsg(req, res, "Passwords do not match", "/admin/createUser");

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    errorMsg(req, res, "User already exists","/admin/createUser");
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
        //sessionStore(req, res, user);
        console.log("opopopopopo",user)
        res.redirect("/");
        res.status(200).json();
      }
    });
  });
}
