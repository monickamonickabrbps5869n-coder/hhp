import React from 'react';
import flavor1 from './assets/flavor1.png';
import flavor2 from './assets/flavor2.png';
import flavor3 from './assets/flavor3.png';
import './App.css';

const flavors = [
  {
    name: "Nebula Vanilla",
    desc: "A swirling cosmic dance of Madagascan vanilla and stardust sparkles.",
    price: "$5.50",
    img: flavor1
  },
  {
    name: "Cosmic Caramel",
    desc: "Deep celestial caramel with dark matter chocolate chunks.",
    price: "$6.00",
    img: flavor2
  },
  {
    name: "Stardust Strawberry",
    desc: "Ethereal seasonal berries kissed by the soft glow of moonlight.",
    price: "$5.75",
    img: flavor3
  },
  {
    name: "Galactic Grape",
    desc: "Vibrant violet swirls with electric fruit energy.",
    price: "$5.50",
    img: flavor1 // Placeholder fallback
  },
  {
    name: "Moonlight Mint",
    desc: "Refreshing botanical mint with glowing silver chocolate pieces.",
    price: "$5.75",
    img: flavor2 // Placeholder fallback
  },
  {
    name: "Supernova Sorbet",
    desc: "An explosion of tropical suns and zesty citrus flares.",
    price: "$6.25",
    img: flavor3 // Placeholder fallback
  }
];

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Antigravity.</div>
        <button className="cta-button" style={{padding: '0.6rem 1.5rem', fontSize: '1rem'}}>Order Now</button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Taste the <br/>Cosmos.</h1>
          <p>Experience ice cream that defies physics. Hand-crafted, ethereal flavors that float through your imagination and melt with divine sweetness.</p>
          <button className="cta-button">Explore Flavors</button>
        </div>
        <div className="hero-image">
          <img src={flavor1} alt="Antigravity Hero" />
        </div>
      </section>

      <section className="flavors">
        <h2>Celestial Collection</h2>
        <div className="flavor-grid">
          {flavors.map((f, i) => (
            <div key={i} className="flavor-card">
              <img src={f.img} alt={f.name} />
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
              <span className="price">{f.price}</span>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span className="footer-logo">Antigravity Ice Cream</span>
        <p>&copy; 2026 Cosmic Confections Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
