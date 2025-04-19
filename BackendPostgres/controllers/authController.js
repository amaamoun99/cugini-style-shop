const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient }= require('../generated/prisma')
const prisma = new PrismaClient();


const createToken = (user) => {
    console.log("Creating token for user:", user.id);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;
  
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, email, and password are required',
      });
    }
  
    try {
      console.log("Registering user:", { name, email, password });
  
      // Check if user already exists
      const existing = await prisma.User.findUnique({ where: { email } });
      console.log("Existing user:", existing);
  
      if (existing) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email is already in use',
        });
      }
  
      // Hash the password
      console.log("Hashing the password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed password:", hashedPassword);
  
      // Create the user
      const user = await prisma.User.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber: phoneNumber || "", // Add phone number, default to empty string if not provided
          // You can optionally set a default role here
          // role: 'user',
        },
      });
  
      // Generate token
      const token = createToken(user);
      res.status(201).json({ status: 'success', token });
  
    } catch (err) {
      console.error("Registration Error:", err); // This logs the actual error
      res.status(500).json({
        status: 'fail',
        message: 'Server error during registration',
        error: err.message, // Optional: include error message in response
      });
    }
  };
  

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ status: 'fail', message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ status: 'fail', message: 'Invalid credentials' });
  }

  const token = createToken(user);
  res.status(200).json({ status: 'success', token });
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with wishlist information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wishlist: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    console.error('Get User Profile Error:', err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
