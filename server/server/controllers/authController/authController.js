const User = require('../../models/User');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../../utils/token');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password, password2, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Check if the passwords match
    if (password !== password2) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = await User.create({
      email,
      password: hashedPassword,
      role
    });

    // Generate access and refresh token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Return the user (without password) and access token
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body

  try{
    //check if the user exists
    const user = await User.findOne({ email })
    if(!user){
      return res.status(401).json({ error: "Invalid email"})
    }

    //check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch){
      return res.status(401).json({ error: "Invalid password" })
    }

    // Generate access and refresh token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();


    // Return user (without password) and access token
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }catch(err){
    res.status(400).json({ error: err.message });
  }
}

exports.signout = async (req, res) => {
   // logout in a JWT context is handled on the client side
  // by simply removing the token from local storage
  res.json({ message: 'Logout successful' });
}

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Return user (without password) and access token
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setRole = async (req, res, next) => {
  // Store the role in session
  req.session.role = req.query.role || 'jobSeeker'; // Default role if none provided
  next();
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("User not found");
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    if (user.refreshToken !== token) {
      console.log("Token mismatch");
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};