const User = require('../models/userSchema');
const { errorHandler } = require('../utils/errorHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return next(errorHandler(400, "enter all the fields"));
    }
    try {

        let user = await User.findOne({ email });

        if (user) {
            return next(errorHandler(401, "user already exists"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            wishList:[]
        })

        const savedUser = await newUser.save();
        const { password: pass, ...rest } = savedUser._doc;

        res.status(200).json({
            message: "user created successfully",
            success: true,
            user: rest
        })
    } catch (error) {
        next(error)
    }
}

exports.signIn = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(errorHandler(400, "enter all fields"));
    }
    try {
        let user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, "email doesn't exists"));
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(errorHandler(404, "incorrect password"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = user._doc

        res.cookie("access_token", token).status(200).json({
            message: 'verification successfull',
            success: true,
            user: rest
        });

    } catch (error) {
        next(error)
    }
}

exports.signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json({ message: "signout successfully", success: true });
    } catch (error) {
        next(error)
    }
}