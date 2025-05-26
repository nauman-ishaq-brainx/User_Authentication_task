const { findUser, addUser, updateUser } = require('../services/user')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { TOKEN_PURPOSE } = require('../constants');
const JWT_SECRET = process.env.JWT_SECRET;


async function signUpController(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Email, password and name are required." })
        }
        //check for existing User
        existingUser = await findUser({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });
        //Add a new user
        const user = await addUser({ name, email, password });
        //Generate a jwt token and send it to user
        const token = jwt.sign(
            { email, purpose: TOKEN_PURPOSE.email_verification },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            message: 'User created. Please verify your email.',
            token
        });

    }
    catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

async function logInController(req, res) {
    try {
        //find user
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." })
        }
        const user = await findUser({ email });

        //check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(user);
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
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        const { password: _, ...userObject } = user.toObject();

        res.json({ token, userObject });
    }
    catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

async function emailVerificationController(req, res) {
    const { token } = req.body;
    try {

        if (!token) {
            return res.status(400).json({ error: "Token and OTP are required." })
        }
        // decode with otp to get email
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(jwt.decode(token));
        if (decoded.purpose !== TOKEN_PURPOSE.email_verification) {
            return res.status(403).json({ error: "Invalid token purpose" });
        }

        // find user with email
        const user = await findUser({ email: decoded.email });


        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        await updateUser({ email: decoded.email }, {
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

        res.status(400).json({ error: err.message });
    }
}

async function changePasswordController(req, res) {
    try {
        //get user id and find user by this id
        const userId = req.user.id;
        const user = await findUser({ _id: userId });
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Old password and new password are required" });
        }

        //Check if user exists
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }
        console.log(user);

        //check password 
        if (!user.comparePassword(oldPassword)) {
            return res.status(401).json({ error: "Please enter correct current password" });
        }
        //update the password
        await updateUser({ email: user.email },
            { password: newPassword }
        );
        return res.json({ message: "Password changed successfully" });
    }
    catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

async function forgotPasswordController(req, res) {

    try {
        //Get email from request and find user
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required." })
        }
        const user = await findUser({ email });
        //Check if user exists
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        };
        //Generate a new password-reset-token
        const token = jwt.sign(
            { email, purpose: TOKEN_PURPOSE.reset_password },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(201).json({
            message: 'Please use this token and OTP to reset your password.',
            token
        });

    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}


async function resetPasswordController(req, res) {

    const { token, newPassword } = req.body;
    try {

        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token, OTP and New Password are required." })
        }
        // decode with otp to get email
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.purpose !== TOKEN_PURPOSE.reset_password) {
            return res.status(403).json({ error: "Invalid token purpose" });
        }
        // find user with email
        const user = await findUser({ email: decoded.email });


        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        await updateUser({ email: decoded.email }, {
            password: newPassword
        });

        res.json({ message: 'Password changes successfully' });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}
module.exports = { signUpController, logInController, emailVerificationController, changePasswordController, forgotPasswordController, resetPasswordController }