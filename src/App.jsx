import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  // Check if a user is already logged in when app loads
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    }
    checkSession();

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Load guestbook messages
  async function loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setData(data);
  }

  useEffect(() => {
    if (user) loadMessages();
  }, [user]);

  // Handle login (magic email link)
async function handleLogin(e) {
  e.preventDefault();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://guestbook-five-omega.vercel.app/', // Replace with your Vercel URL
    },
  });

  if (error) {
    alert('Error sending magic link: ' + error.message);
  } else {
    alert('Check your email for a login link!');
  }
} 

  // Handle logout
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // Handle adding a message
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ name, message }]);

    if (error) {
      console.error('Insert error:', error);
    } else {
      setName('');
      setMessage('');
      loadMessages(); // Refresh the list
    }
  }

  // Show login form if not logged in
  if (!user) {
    return (
      <div className="app-container">
        <h1>Guestbook Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Send Magic Link</button>
        </form>
      </div>
    );
  }

// Show login screen if not logged in
if (!user) {
  return (
    <div className="app-container">
      <h1>Guestbook Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Send Magic Link</button>
      </form>
    </div>
  );
}

// Show guestbook only when logged in
return (
  <div className="app-container">
    <h1>Guestbook</h1>
    <p>Welcome, {user.email}</p>
    <button onClick={handleLogout} style={{ marginBottom: '10px' }}>
      Logout
    </button>

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
