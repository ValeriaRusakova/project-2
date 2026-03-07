// קומפוננטת Header - כותרת עם אפקט Parallax
import headerBg from './assets/generated-image.png';

function Header() {
  return (
    <header className="header" style={{ backgroundImage: `url(${headerBg})` }}>
      <div className="header-content">
        <h1 className="header-title">Cryptonite</h1>
      </div>
    </header>
  );
}

export default Header;
