import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [rsvpData, setRsvpData] = useState({
    name: '',
    email: '',
    attendance: 'yes',
  });

  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/gifts');
        setGifts(response.data.gifts);
      } catch (error) {
        console.error('Error fetching gifts', error);
      }
    };

    fetchGifts();
  }, []);

  const handleRsvpChange = (e) => {
    const { name, value } = e.target;
    setRsvpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/rsvp', rsvpData);
      setResponseMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setResponseMessage('Error submitting RSVP');
    }
  };

  const handleGiftSelect = async (gift) => {
    try {
      const response = await axios.post('http://localhost:5000/api/gift', { gift });
      setSelectedGift(gift);
      setResponseMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setResponseMessage('Error selecting gift');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Welcome to Our Wedding Website</h1>
      </header>
      <main>
        <img src={require('./home.jpg')} alt="Wedding" style={{ width: '60%', height: 'auto', marginBottom: '20px' }} />
        
        <section>
          <h2>Wedding Details</h2>
          <p>Join us for our wedding celebration on [Date] at [Venue Name].</p>
          <p>We would be delighted to have you with us on this special day!</p>
        </section>

        <section>
          <h2>RSVP</h2>
          <form onSubmit={handleRsvpSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={rsvpData.name}
                onChange={handleRsvpChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={rsvpData.email}
                onChange={handleRsvpChange}
                required
              />
            </div>
            <div>
              <label>Will you attend?</label>
              <select
                name="attendance"
                value={rsvpData.attendance}
                onChange={handleRsvpChange}
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </section>

        <section>
          <h2>Gift Selection</h2>
          <ul>
            {gifts.map((gift, index) => (
              <li key={index}>
                <span>{gift.gift} {gift.selected ? '(Selected)' : ''}</span>
                {!gift.selected && (
                  <button onClick={() => handleGiftSelect(gift.gift)}>Select</button>
                )}
              </li>
            ))}
          </ul>
          {selectedGift && <p>You selected: {selectedGift}</p>}
        </section>

        {responseMessage && <p>{responseMessage}</p>}
      </main>
    </div>
  );
}

export default App;
