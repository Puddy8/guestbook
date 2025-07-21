import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Load all messages when the app first loads
  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
      } else {
        setData(data);
      }
    }
    loadData();
  }, []);

  // Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  console.log('Form submitted:', { name, message });

  if (!name || !message) {
    alert('Please enter both a name and a message.');
    return;
  }

  console.log('Inserting into Supabase...');
  const { error } = await supabase
    .from('messages')
    .insert([{ name, message }]);

  if (error) {
    console.error('Supabase insert error:', error);
    return;
  }

  console.log('Insert successful, refreshing list...');
  setName('');
  setMessage('');

  const { data, error: fetchError } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('Fetch error:', fetchError);
  } else {
    setData(data);
    console.log('Updated list:', data);
  }
}

  return (
    <div className="app-container">
      <h1>Guestbook</h1>

      {/* Form to add a new message */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Add Message</button>
      </form>

      {/* Display the messages */}
      {data.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul>
          {data.map((msg) => (
            <li key={msg.id}>
              <strong>{msg.name}</strong>: {msg.message}{' '}
              <em>({new Date(msg.created_at).toLocaleString()})</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
