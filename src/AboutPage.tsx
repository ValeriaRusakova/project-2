// דף אודות
import profilePhoto from './assets/תמונה ולריה.jpg';

function AboutPage() {
  return (
    <div className="about-page">
      <h2>About</h2>
      
      {/* תיאור הפרויקט */}
      <section className="about-section">
        <h3>About This Project</h3>
        <p>
          Cryptonite is a cryptocurrency tracking application that allows users to:
        </p>
        <ul>
          <li>View the top 100 cryptocurrencies by market cap</li>
          <li>Search for specific coins by name or symbol</li>
          <li>View real-time price data in USD, EUR, and ILS</li>
          <li>Select up to 5 coins for real-time monitoring</li>
          <li>View live price charts for selected coins</li>
          <li>Get AI-powered recommendations for investments</li>
        </ul>
      </section>
      
      {/* פרטים אישיים */}
      <section className="about-section">
        <h3>Developer Information</h3>
        <div className="developer-info">
          <div className="developer-photo">
            <img src={profilePhoto} alt="Valeria Rusakova" className="profile-image" />
          </div>
          <div className="developer-details">
            <p><strong>Name:</strong> Valeria Rusakova</p>
            <p><strong>Course:</strong> Full Stack Web Developer</p>
          </div>
        </div>
      </section>
      
      {/* טכנולוגיות */}
      <section className="about-section">
        <h3>Technologies Used</h3>
        <ul>
          <li>React 19 with TypeScript</li>
          <li>Redux Toolkit for state management</li>
          <li>React Router for navigation</li>
          <li>Recharts for data visualization</li>
          <li>CoinGecko API for cryptocurrency data</li>
          <li>CryptoCompare API for real-time prices</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;
