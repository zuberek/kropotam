import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

axios.defaults.baseURL = 'https://kropotam.onrender.com';

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
        const response = await axios.get('/api/gifts');
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
      const response = await axios.post('/api/rsvp', rsvpData);
      setResponseMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setResponseMessage('Error submitting RSVP');
    }
  };

  const handleGiftSelect = async (gift) => {
    try {
      const response = await axios.post('/api/gift', { gift });
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
        <h1>Witaj na naszej weselnej stronie!</h1>
      </header>
      <main>
        <img src={require('./home.jpg')} alt="Wedding" style={{ width: '50%', height: 'auto', marginBottom: '20px' }} />
        
        <section>
          <h2>Weselne info</h2>
          <p>Wesele odbędzie się 28 czerwca w pałacu w Biedrusku.</p>
          <p>Mamy nadzieję że do nas dołączysz!</p>
        </section>

        <section>
          <h2>RSVP</h2>
          <form onSubmit={handleRsvpSubmit}>
            <div>
              <label>Imię:</label>
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
              <label>Czy będziesz?</label>
              <select
                name="attendance"
                value={rsvpData.attendance}
                onChange={handleRsvpChange}
                required
              >
                <option value="yes">Tak</option>
                <option value="no">Nie</option>
              </select>
            </div>
            <button type="submit">Wyślij</button>
          </form>
        </section>

        <section>
          <h2>Wybierz prezent</h2>
          <ul>
            {gifts.map((gift, index) => (
              <li key={index}>
                <span>{gift.gift} {gift.selected ? '(Już wybrany)' : ''}</span>
                {!gift.selected && (
                  <button onClick={() => handleGiftSelect(gift.gift)}>Select</button>
                )}
              </li>
            ))}
          </ul>
          {selectedGift && <p>Wybrałeś: {selectedGift}</p>}
        </section>

        {responseMessage && <p>{responseMessage}</p>}
      </main>
    </div>
  );
}

export default App;
