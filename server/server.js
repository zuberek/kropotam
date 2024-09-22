const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Replace with your actual connection string from MongoDB Atlas
const mongoURI = "mongodb+srv://jandobrow:urjw8Ie2kylwTGtb@cluster0.ykrgb.mongodb.net/kropotam?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('MongoDB connection error:', error));

// Define RSVP schema and model
const rsvpSchema = new mongoose.Schema({
  name: String,
  email: String,
  attendance: String,
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

// Define Gift schema and model
const giftSchema = new mongoose.Schema({
  gift: String,
  selected: { type: Boolean, default: false },
});

const Gift = mongoose.model('Gift', giftSchema);

// Route to handle RSVP submissions
app.post('/api/rsvp', async (req, res) => {
  const { name, email, attendance } = req.body;

  try {
    const newRsvp = new Rsvp({ name, email, attendance });
    await newRsvp.save();
    res.status(200).json({ message: 'RSVP saved', rsvp: newRsvp });
  } catch (error) {
    res.status(500).json({ message: 'Error saving RSVP', error });
  }
});

// Route to handle gift selection
app.post('/api/gift', async (req, res) => {
  const { gift } = req.body;

  try {
    // Check if gift is already selected
    const selectedGift = await Gift.findOne({ gift, selected: true });

    if (selectedGift) {
      return res.status(400).json({ message: 'Gift already selected' });
    }

    // Save selected gift
    const newGift = new Gift({ gift, selected: true });
    await newGift.save();
    res.status(200).json({ message: 'Gift selected', gift: newGift });
  } catch (error) {
    res.status(500).json({ message: 'Error selecting gift', error });
  }
});

// Route to get all gifts
app.get('/api/gifts', async (req, res) => {
  try {
    const gifts = await Gift.find(); // Fetch all gifts
    res.status(200).json({ gifts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gifts', error });
  }
});


// Route to get available gifts
app.get('/api/available', async (req, res) => {
  try {
    const gifts = await Gift.find({ selected: false }); // Fetch gifts that are not selected
    res.status(200).json({ gifts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gifts', error });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

