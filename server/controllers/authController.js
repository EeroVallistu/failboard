const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// JWT secret key (should be in environment variables in production)
const JWT_SECRET = 'your_jwt_secret_key';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const { username, password, email, fullName, role } = req.body;
    
    // Validate input
    if (!username || !password || !email || !fullName || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate role
    if (role !== 'teacher' && role !== 'student') {
      return res.status(400).json({ message: 'Role must be either teacher or student' });
    }
    
    // Check if username already exists
    const existingUser = await userService.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmail = await userService.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const userData = {
      username,
      password: hashedPassword,
      email,
      full_name: fullName,
      role
    };
    
    const userId = await userService.createUser(userData);
    
    // If the user is a student, create a student record
    if (role === 'student') {
      // Split full name into first and last name
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      await userService.createStudent({
        first_name: firstName,
        last_name: lastName,
        email,
        user_id: userId
      });
    }
    
    // Create and send JWT token for automatic login
    const payload = {
      user: {
        id: userId,
        username,
        role
      }
    };
    
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: 'User registered successfully',
          userId,
          role,
          token,
          user: {
            id: userId,
            username,
            email,
            fullName,
            role
          }
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Find user
    const user = await userService.findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.full_name,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};