function Footer() {
  const date = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__author">&copy; {date} Alex</p>
    </footer>
  );
}

export default Footer;
