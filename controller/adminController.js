import User from "../model/userSchema.js";
import data from "../utils.js";

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
// @route   PUT /admin
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(id,updateData,{new:true,runValidators:true})
    if (user) {
      res.status(200).json({ message: "User Updated successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!" });
  }
};
