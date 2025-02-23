import React, { useState, useEffect } from 'react';
import casinoPricing from '../casino-pricing.json';
import sportsbookPricing from '../sportsbook-pricing.json';
import './PricingTable.scss';

type ProductType = 'casino' | 'sportsbook';
type ViewState = 'input' | 'selection' | 'pricing';
type Theme = 'light' | 'dark';
type GGRRange = '0-1M' | '1-3M' | '3M+';

interface SportsbookProduct {
  Product: string;
  tier1_0_1M: number;
  tier2_1_2M: number;
  tier3_2_3M: number;
}

const PricingTable: React.FC = () => {
  const [ggrRange, setGGRRange] = useState<GGRRange>('0-1M');
  const [activeProduct, setActiveProduct] = useState<ProductType | null>(null);
  const [viewState, setViewState] = useState<ViewState>('selection');
  const [theme, setTheme] = useState<Theme>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getGGRValue = (range: GGRRange): number => {
    switch (range) {
      case '0-1M':
        return 999999;
      case '1-3M':
        return 2000000;
      case '3M+':
        return 3000001;
    }
  };

  const handleProductSelect = (product: ProductType) => {
    setActiveProduct(product);
    setViewState('input');
  };

  const handleGGRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewState('pricing');
  };

  const handleBackToProducts = () => {
    setActiveProduct(null);
    setViewState('selection');
  };

  const formatGGRDisplay = (range: GGRRange): string => {
    switch (range) {
      case '0-1M':
        return '$0 - $1,000,000';
      case '1-3M':
        return '$1,000,000 - $3,000,000';
      case '3M+':
        return '$3,000,000+';
    }
  };

  const GGRDisplay = () => (
    <div className="ggr-display-container">
      <div className="ggr-display">
        <span>Monthly GGR: {formatGGRDisplay(ggrRange)}</span>
        <button 
          className="edit-button"
          onClick={() => setViewState('input')}
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );

  const calculateSportsbookRate = (product: SportsbookProduct, range: GGRRange) => {
    const ggr = getGGRValue(range);
    const bonusRate = ggr >= 3000000 ? 2 : 
                     ggr >= 1000000 ? 3 : 
                     ggr > 0 ? 4 : 0;

    if (ggr <= 1000000) {
      return product.tier1_0_1M + bonusRate;
    } else if (ggr <= 2000000) {
      return product.tier2_1_2M + 3; // Always add 3% for 1M-3M
    } else if (ggr <= 3000000) {
      return product.tier3_2_3M + 3; // Always add 3% for 1M-3M
    } else {
      return product.tier3_2_3M + 2; // Add 2% for >3M
    }
  };

  const bonus = getGGRValue(ggrRange) >= 3000000 ? 2 : 
                getGGRValue(ggrRange) >= 1000000 ? 3 : 
                getGGRValue(ggrRange) > 0 ? 4 : 0;

  const columns = [
    'Product',
    'ROW',
    'Asia',
    'Asia - Philippines',
    'Asia - Korea',
    'Asia - India',
    'Asia - Japan',
    'Asia - China',
    'Asia - Malaysia',
    'Branded/Premium Games Additional Fee'
  ];

  const formatValue = (value: string | number | undefined, columnName?: string) => {
    if (typeof value === 'number') {
      if (columnName === 'Branded/Premium Games Additional Fee') {
        return `${value}%`;
      }
      return `${value + bonus}%`;
    }
    return value;
  };

  const formatColumnHeader = (header: string) => {
    if (header.startsWith('Asia - ')) {
      return header.replace('Asia - ', '');
    }
    if (header === 'Branded/Premium Games Additional Fee') {
      return 'Premium Games Fee';
    }
    return header;
  };

  return (
    <div className="pricing-container">
      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <button 
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <div className="theme-toggle">
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-button"
              data-theme={theme}
              aria-label="Toggle theme"
            >
              <div className="toggle-icons">
                <span className="sun-icon">☀️</span>
                <span className="moon-icon">🌙</span>
              </div>
            </button>
          </div>
          <nav>
            <ul>
              <li>
                <button onClick={() => { setViewState('input'); setIsMenuOpen(false); }}>
                  Home
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop Theme Toggle */}
      <div className="theme-toggle desktop">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-button"
          data-theme={theme}
          aria-label="Toggle theme"
        >
          <div className="toggle-icons">
            <span className="sun-icon">☀️</span>
            <span className="moon-icon">🌙</span>
          </div>
        </button>
      </div>

      <div className="header">
        <h1>IQ Play Platform Pricing</h1>
      </div>

      {viewState === 'selection' && (
        <div className="product-selection">
          <div className="product-cards">
            <div 
              className="product-card" 
              onClick={() => handleProductSelect('casino')}
            >
              <div className="card-icon">🎰</div>
              <h3>Casino</h3>
              <p>Explore our competitive casino game pricing</p>
            </div>
            <div 
              className="product-card" 
              onClick={() => handleProductSelect('sportsbook')}
            >
              <div className="card-icon">⚽</div>
              <h3>Sportsbook</h3>
              <p>View our sportsbook platform pricing</p>
            </div>
          </div>
        </div>
      )}

      {viewState === 'input' && (
        <div className="ggr-input-section">
          <div className="back-button-container">
            <button 
              className="back-button"
              onClick={handleBackToProducts}
            >
              ← Back to Products
            </button>
          </div>
          <form onSubmit={handleGGRSubmit}>
            <div className="ggr-input-container">
              <label htmlFor="ggr-select">Expected Monthly GGR (Gross Gaming Revenue)</label>
              <div className="ggr-options">
                {(['0-1M', '1-3M', '3M+'] as GGRRange[]).map((range) => (
                  <button
                    key={range}
                    type="button"
                    className={`ggr-option ${ggrRange === range ? 'active' : ''}`}
                    onClick={() => setGGRRange(range)}
                  >
                    {formatGGRDisplay(range)}
                  </button>
                ))}
              </div>
              <button type="submit" className="submit-button">
                View Pricing
              </button>
            </div>
          </form>
        </div>
      )}

      {viewState === 'pricing' && (
        <div className="pricing-section">
          <div className="pricing-header">
            <div className="product-tabs">
              <button 
                className={`tab ${activeProduct === 'casino' ? 'active' : ''}`}
                onClick={() => setActiveProduct('casino')}
              >
                Casino
              </button>
              <button 
                className={`tab ${activeProduct === 'sportsbook' ? 'active' : ''}`}
                onClick={() => setActiveProduct('sportsbook')}
              >
                Sportsbook
              </button>
            </div>
            <GGRDisplay />
          </div>

          {activeProduct === 'casino' && (
            <>
              {/* Table View for Desktop */}
              <div className="table-view">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        {columns.map(col => (
                          <th key={col} title={col} className="table-header">
                            {formatColumnHeader(col)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {casinoPricing.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'stripe' : ''}>
                          {columns.map(col => {
                            const cell = item[col as keyof typeof item];
                            const displayValue = formatValue(cell, col);
                            return (
                              <td 
                                key={col} 
                                className={`table-cell ${typeof cell === 'number' ? 'numeric-value' : ''}`}
                                data-full-text={displayValue}
                                title={displayValue}
                              >
                                {displayValue}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card View for Mobile */}
              <div className="card-view">
                {casinoPricing.map((item, index) => (
                  <div className="card" key={index}>
                    <div className="product-name">{item.Product}</div>
                    <div className="card-grid">
                      {columns.slice(1).map(col => {
                        const cell = item[col as keyof typeof item];
                        if (col === 'Branded/Premium Games Additional Fee' && !cell) {
                          return null;
                        }
                        return (
                          <div className="card-item" key={col}>
                            <div className="label">{formatColumnHeader(col)}</div>
                            <div className={`value ${typeof cell === 'number' ? 'numeric-value' : ''}`}>
                              {formatValue(cell, col)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeProduct === 'sportsbook' && (
            <>
              {/* Table View for Desktop */}
              <div className="table-view">
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th className="table-header">Product</th>
                        <th className="table-header">Rev Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sportsbookPricing.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'stripe' : ''}>
                          <td className="table-cell">{item.Product}</td>
                          <td className="table-cell numeric-value">
                            {`${calculateSportsbookRate(item, ggrRange)}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card View for Mobile */}
              <div className="card-view">
                {sportsbookPricing.map((item, index) => (
                  <div className="card" key={index}>
                    <div className="product-name">{item.Product}</div>
                    <div className="card-grid">
                      <div className="card-item">
                        <div className="label">Rev Share</div>
                        <div className="value numeric-value">
                          {`${calculateSportsbookRate(item, ggrRange)}%`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingTable; 