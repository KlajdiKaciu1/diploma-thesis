const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtSecret = 'jabdkcqwdsvhjbqwklq';
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const User = require('./models/User'); 
const adminRoutes = require('./admin/adminRoutes');
const professorRoutes = require('./professor/professorRoutes');
const studentRoutes = require('./student/studentRoutes');
const bcryptSalt=bcrypt.genSaltSync(10);
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use('/admin', adminRoutes);
app.use('/professor',professorRoutes);
app.use('/student', studentRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
console.log('MongoDB connected'); 
})
.catch(err => {
console.error('MongoDB connection error:', err);
process.exit(1); 
});

app.get('/test',(req,res)=>{
    res.json('test ok')
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDoc = await User.findOne({ email });
        if (!userDoc) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, userDoc.password);
        if (isMatch) {
          jwt.sign({   
            email:userDoc.email,
            id:userDoc._id,
            role: userDoc.role
          }, jwtSecret, {}, (err,token) => {
            if (err) throw err;
            res.cookie('token', token).json(userDoc);
          });
        } else {
          res.status(401).json('Invalid password');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
 });
 app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      role
    });
    res.status(201).json(userDoc); 
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});
app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const userData = jwt.verify(token, jwtSecret);
      const user = await User.findById(userData.id);
      if (user) {
        const { name, email, _id } = user;
        res.json({ name, email, _id });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath);
  }
  res.json(uploadedFiles);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
   });