import User from "../Models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
// import mail from "../Services/nodemail.js";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(email)
    const olduser = await User.findOne({ email });
    if (olduser) {
      res.status(400).json({ message: "User already exists" });
      return 
    }
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("hashPassword", hashPassword);

    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(200).json({ message: "User registered", data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Register failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email:email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid user password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // mail()
    res.status(200).json({ message: "Login success", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
};

