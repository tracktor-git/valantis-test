import logo from '../assets/images/logo.svg';

const Header = () => (
  <>
    <h1 className="header-title">Ювелирная мастерская</h1>
    <div className="logo">
      <a href="./">
        <img src={logo} alt="Valantis logo" />
      </a>
    </div>
  </>
);

export default Header;
