import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import flavor1 from './assets/flavor1.png';
import flavor2 from './assets/flavor2.png';
import flavor3 from './assets/flavor3.png';
import './index.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const flavors = [
  { id: 1, name: "Nebula Vanilla",      desc: "A swirling cosmic dance of Madagascan vanilla and stardust sparkles.", price: 5.50, img: flavor1 },
  { id: 2, name: "Cosmic Caramel",      desc: "Deep celestial caramel with dark matter chocolate chunks.",           price: 6.00, img: flavor2 },
  { id: 3, name: "Stardust Strawberry", desc: "Ethereal seasonal berries kissed by the soft glow of moonlight.",   price: 5.75, img: flavor3 },
  { id: 4, name: "Galactic Grape",      desc: "Vibrant violet swirls with electric fruit energy.",                 price: 5.50, img: flavor1 },
  { id: 5, name: "Moonlight Mint",      desc: "Refreshing botanical mint with glowing silver chocolate pieces.",   price: 5.75, img: flavor2 },
  { id: 6, name: "Supernova Sorbet",    desc: "An explosion of tropical suns and zesty citrus flares.",            price: 6.25, img: flavor3 },
];

function CartIcon({ count, onClick }) {
  return (
    <button className="cart-btn" onClick={onClick} aria-label="Open cart">
      🛒 <span className="cart-count">{count}</span>
    </button>
  );
}

function CartModal({ cart, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>Your Cosmic Cart 🌌</h2>
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty. Explore the flavors!</p>
        ) : <>
          {cart.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.img} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>x{item.qty} — ${(item.price * item.qty).toFixed(2)}</span>
              </div>
              <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
            </div>
          ))}
          <div className="cart-total">Total: <strong>${total}</strong></div>
          <button className="cta-button full-width" onClick={onCheckout}>Proceed to Checkout →</button>
        </>}
      </div>
    </div>
  );
}

function CheckoutModal({ cart, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        items: cart.map(({ name, price, qty }) => ({ name, price, qty })),
      };
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');
      onSuccess(data.order_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box checkout" onClick={e => e.stopPropagation()}>
        <h2>Checkout 🚀</h2>
        <p className="checkout-total">Order Total: <strong>${total}</strong></p>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name"    placeholder="Full Name"       value={form.name}    onChange={handleChange} required />
          <input name="email"   placeholder="Email Address"   value={form.email}   onChange={handleChange} type="email" required />
          <input name="phone"   placeholder="Phone Number"    value={form.phone}   onChange={handleChange} required />
          <textarea name="address" placeholder="Delivery Address" value={form.address} onChange={handleChange} required rows={3} />
          <button type="submit" className="cta-button full-width" disabled={loading}>
            {loading ? 'Placing Order…' : 'Place Order ✨'}
          </button>
        </form>
      </div>
    </div>
  );
}

function SuccessModal({ orderId, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box text-center" onClick={e => e.stopPropagation()}>
        <div style={{fontSize:'4rem'}}>🎉</div>
        <h2>Order Placed!</h2>
        <p>Your cosmic ice cream is on the way!<br/>Order ID: <strong>#{orderId}</strong></p>
        <button className="cta-button" style={{marginTop:'1.5rem'}} onClick={onClose}>Keep Exploring</button>
      </div>
    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [modal, setModal] = useState(null); // 'cart' | 'checkout' | 'success'
  const [orderId, setOrderId] = useState(null);

  const addToCart = (flavor) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === flavor.id);
      if (existing) return prev.map(i => i.id === flavor.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...flavor, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const handleSuccess = (id) => {
    setOrderId(id);
    setCart([]);
    setModal('success');
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Antigravity.</div>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <CartIcon count={cartCount} onClick={() => setModal('cart')} />
          <Link to="/login" className="nav-login-link">Sign In</Link>
          <button className="cta-button" style={{padding:'0.6rem 1.5rem',fontSize:'1rem'}} onClick={() => setModal('cart')}>Order Now</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Taste the <br/>Cosmos.</h1>
          <p>Experience ice cream that defies physics. Hand-crafted, ethereal flavors that float through your imagination and melt with divine sweetness.</p>
          <button className="cta-button" onClick={() => document.querySelector('.flavors').scrollIntoView({behavior:'smooth'})}>Explore Flavors</button>
        </div>
        <div className="hero-image">
          <img src={flavor1} alt="Antigravity Hero" />
        </div>
      </section>

      <section className="flavors">
        <h2>Celestial Collection</h2>
        <div className="flavor-grid">
          {flavors.map(f => (
            <div key={f.id} className="flavor-card">
              <img src={f.img} alt={f.name} />
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
              <div className="card-bottom">
                <span className="price">${f.price.toFixed(2)}</span>
                <button className="add-to-cart-btn" onClick={() => addToCart(f)}>Add to Cart +</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span className="footer-logo">Antigravity Ice Cream</span>
        <p>© 2026 Cosmic Confections Inc. All rights reserved.</p>
      </footer>

      {modal === 'cart' && (
        <CartModal
          cart={cart}
          onClose={() => setModal(null)}
          onRemove={removeFromCart}
          onCheckout={() => setModal('checkout')}
        />
      )}
      {modal === 'checkout' && (
        <CheckoutModal
          cart={cart}
          onClose={() => setModal('cart')}
          onSuccess={handleSuccess}
        />
      )}
      {modal === 'success' && (
        <SuccessModal orderId={orderId} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

export default App;
