const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const UserModel = require('./Model/User');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

mongoose.connect('mongodb://localhost:27017/CRUD', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });


app.post('/CreateUsers', upload.single('profile'), (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || !age) {
    return res.status(400).json({ error: 'Please provide name, email and age' });
  }
  const profile = req.file ? req.file.filename : '';

  UserModel.create({ name, email, age, profile })
    .then(user => res.json(user))
    .catch(err => {
      console.error('Create user error:', err);
      res.status(500).json({ error: 'Failed to create user', details: err.message });
    });
});


app.get('/users', (req, res) => {
  UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: 'Failed to fetch users' }));
});


app.get('/getUsers/:id', (req, res) => {
  UserModel.findById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    })
    .catch(err => res.status(500).json({ error: 'Error fetching user' }));
});


app.put('/UpdateUsers/:id', upload.single('profile'), async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
      return res.status(400).json({ error: 'Please provide name, email and age' });
    }
    const updateData = { name, email, age };
    if (req.file) updateData.profile = req.file.filename;

    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});


app.delete('/deleteUsers/:id', (req, res) => {
  UserModel.findByIdAndDelete(req.params.id)
    .then(user => {
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ success: true });
    })
    .catch(err => res.status(500).json({ error: 'Failed to delete user' }));
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});