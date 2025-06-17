const { userService, jwtService } = require('../services')
const jwt = require('jsonwebtoken');
const { TOKEN_PURPOSE } = require('../constants');
const { constants } = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Only fetch id, name, and email
        const users = await userService.findAllUsers({ _id: { $ne: currentUserId } })
            .select("_id name email");

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

async function signUpController(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Email, password and name are required." })
        }
        //check for existing User
        existingUser = await userService.findUser({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });
        //Add a new user
        const user = await userService.addUser({ name, email, password });
        const token = await jwtService.createJwtToken({ id: user._id, purpose: TOKEN_PURPOSE.email_verification });
        console.log(`${CLIENT_URL}/auth/verify-email/${token}`);

        res.status(201).json({
            message: 'User created. Please verify your email.',
        });

    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

async function logInController(req, res) {
    try {
        //find user
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." })
        }
        const user = await userService.findUser({ email });

        //check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email" });
        };
        //check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Please enter correct password" });
        }
        // Assign a token if everything valid
        const token = await jwtService.createJwtToken({ id: user._id }, JWT_SECRET);
        const { password: _, ...userObject } = user.toObject();
        res.json({ token, userObject });
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

async function emailVerificationController(req, res) {
    const { token } = req.params;
    try {

        if (!token) {
            return res.status(400).json({ error: "Token is required." })
        }
        // decode with otp to get email
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.purpose !== TOKEN_PURPOSE.email_verification) {
            return res.status(403).json({ error: "Invalid token purpose" });
        }

        // find user with email
        const user = await userService.findUser({ _id: decoded.id });


        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User already verified. Please login." });
        }


        const updatedUser = await userService.updateUser({ _id: decoded.id }, {
            isVerified: true
        });


        res.json({ message: 'Email successfully verified' });

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // Generate the token and OTP again
            const decoded = jwt.decode(token);
            const newToken = jwt.sign(
                { email: decoded.email, purpose: "email-verification" },
                JWT_SECRET,
                { expiresIn: "24h" }
            );
            

            // Resend email with new OTP + token
            return res.status(400).json({
                error: 'Token expired. A new OTP has been sent.',
                newToken
            });
        }

        res.status(500).json({ error: err.message });
    }
}

async function changePasswordController(req, res) {

    try {
        //get user id and find user by this id
        const userId = req.user.id;
        const user = await userService.findUser({ _id: userId });
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Old password and new password are required" });
        }
        //Check if user exists
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        //check password 
        if (! await user.comparePassword(oldPassword)) {
            return res.status(401).json({ error: "Please enter correct current password" });
        }
        //update the password
        await userService.updateUser({ email: user.email },
            { password: newPassword }
        );
        return res.json({ message: "Password changed successfully" });
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

async function forgotPasswordController(req, res) {

    try {
        //Get email from request and find user
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ error: "Email is required." })
        }
        const user = await userService.findUser({ email });
        //Check if user exists
        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        };
        //Generate a new password-reset-token
        const token = await jwtService.createJwtToken({ id:user._id, purpose: TOKEN_PURPOSE.reset_password },user.password);
        console.log(`${CLIENT_URL}/auth/reset-password/${token}`);

        return res.status(201).json({
            message: 'Please use this token to reset your password.',
        });

    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


async function resetPasswordController(req, res) {

    const { token, newPassword } = req.body;
    try {

        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token New Password are required." })
        }

        // Decode the token without verifying to get user ID
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id || decoded.purpose !== TOKEN_PURPOSE.reset_password) {
            return res.status(403).json({ error: "Invalid token" });
        }

        // Find the user
        const user = await userService.findUser({ _id: decoded.id });
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Verify the token using user's current password hash
        jwt.verify(token, user.password);

        // Update the password
        await userService.updateUser({ _id: user._id }, {
            password: newPassword
        });

        res.status(200).json({ message: 'Password changed successfully' });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
module.exports = { signUpController, logInController, emailVerificationController, changePasswordController, forgotPasswordController, resetPasswordController, getAllUsers }