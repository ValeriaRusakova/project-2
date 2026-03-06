// קומפוננטת Header - כותרת עם אפקט Parallax
import headerBg from './assets/generated-image.png';

function Header() {
  return (
    <header className="header" style={{ backgroundImage: `linear-gradient(rgba(33, 150, 243, 0.7), rgba(21, 101, 192, 0.75)), url(${headerBg})` }}>
      <div className="header-content">
        <h1 className="header-title">Cryptonite</h1>
      </div>
    </header>
  );
}

export default Header;
