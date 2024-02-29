import logo from '../../assets/images/logo.svg';
import styles from './Header.module.css';

const Header = () => (
  <>
    <h1 className={styles.headerTitle}>Ювелирная мастерская</h1>
    <div className={styles.logo}>
      <a href="./">
        <img src={logo} alt="Valantis logo" />
      </a>
    </div>
  </>
);

export default Header;
