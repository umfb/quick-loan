export default function NavBar() {
  return (
    <header>
      <nav className="flex justify-center px-3 lg:px-0">
        <picture>
          <source srcSet="/logo.avif" type="image/avif" />
          <source srcSet="/logo.webp" type="image/webp" />
          <img
            src="/logo.png"
            style={{ width: "100%", maxWidth: "450px" }}
            alt="unilagmfb-logo"
          />
        </picture>
      </nav>
    </header>
  );
}
