const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

/**
 * @name registerUserController
 * @description Register a new user
 * @access Public
 */

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token= jwt.sign({ id: newUser._id,username:newUser.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.cookie("token",token, { httpOnly: true });
        
        res.status(201).json({ message: "User registered successfully",user:{
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        } ,token });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name loginUserController
 * @description Login a user,expects email and password in req.body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username, email: user.email }, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name logoutUserController
 * @description Logout a user,expects token in req.cookies , clears the token cookie and adds the token to blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        // Add token to blacklist
        await tokenBlacklistModel.create({ token });

        // Clear the token cookie
        res.clearCookie("token");

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name getMeController
 * @description Get the logged in user's details.
 * @access Private
 */
// This controller is now handled directly in the route using authMiddleware to verify the token and attach user info to req.user

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User details retrieved successfully", user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error("GetMe error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };