import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const ModernNav = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav style={{ position: 'fixed', width: '100%', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: 50 }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#1D4ED8', transition: 'color 0.3s' }}>
              YourLogo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div style={{ display: 'none',  gap: '32px' }}>
            <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
              {['Home', 'Products', 'Services', 'About', 'Contact'].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    style={{ color: '#6B7280', transition: 'color 0.3s' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ padding: '8px 24px', color: 'white', backgroundColor: '#1D4ED8', borderRadius: '8px', transition: 'background-color 0.3s' }}>
              Get Started
            </button>
            <button style={{ padding: '8px 24px', border: '1px solid #D1D5DB', color: '#6B7280', borderRadius: '8px', transition: 'background-color 0.3s' }}>
              Learn More
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ padding: '8px', borderRadius: '8px', color: '#6B7280', transition: 'color 0.3s' }}
            >
              {isMenuOpen ? (
                <FiX size={24} />
              ) : (
                <FiMenu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '64px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px 8px 0 0' }}>
            <ul style={{ padding: '16px', margin: 0, listStyle: 'none', gap: '16px' }}>
              {['Home', 'Products', 'Services', 'About', 'Contact'].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    style={{ display: 'block', color: '#6B7280', transition: 'color 0.3s' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNav;
