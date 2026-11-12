
"use client";

import { useEffect, useState } from "react";

const products = [
  {
    id: 1,
    name: "The Signature Blazer",
    category: "MENSWEAR",
    price: "₹3,499",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85",
  },
  {
    id: 2,
    name: "The Evening Edit",
    category: "WOMENSWEAR",
    price: "₹2,899",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85",
  },
  {
    id: 3,
    name: "The Modern Essential",
    category: "MENSWEAR",
    price: "₹1,999",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=85",
  },
];

type CartItem = {
  id: number;
  quantity: number;
};

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = localStorage.getItem("aurence-cart");
        const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

        const count = Array.isArray(cart)
          ? cart.reduce(
              (total, item) => total + (Number(item.quantity) || 0),
              0
            )
          : 0;

        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <div className="announcement">
        COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹1,999
      </div>

      {/* HEADER */}

      <header className="header">
        <nav className="header-nav">
          <a href="/shop">COLLECTIONS</a>
          <a href="/shop?category=Men">MEN</a>
          <a href="/shop?category=Women">WOMEN</a>
        </nav>

        <a href="/" className="logo">
          AURENCE
          <small>DEFINED BY ELEGANCE</small>
        </a>

        <div className="header-actions">
          <a href="/shop">SEARCH</a>
          <a href="/account">MY ACCOUNT</a>
          <a
            href="/cart"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            BAG ({cartCount})
          </a>
        </div>
      </header>

      {/* HERO */}

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">THE NEW COLLECTION · 2026</p>

          <h1>
            Elegance
            <br />
            in every
            <br />
            <em>detail.</em>
          </h1>

          <p className="hero-description">
            Discover a new expression of modern fashion.
            Thoughtfully selected pieces designed to make
            every moment feel distinctive.
          </p>

          <a href="/shop" className="primary-link">
            DISCOVER THE COLLECTION <span>↗</span>
          </a>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=90"
            alt="AURENCE fashion campaign"
          />
        </div>
      </section>

      {/* INTRODUCTION */}

      <section className="introduction scroll-reveal">
        <p className="eyebrow">A DIFFERENT PERSPECTIVE</p>

        <h2>
          Not defined by trends.
          <br />
          Defined by <em>character.</em>
        </h2>

        <p>
          AURENCE brings together considered design,
          timeless silhouettes and refined details.
          Fashion that speaks without saying too much.
        </p>
      </section>

      {/* COLLECTIONS */}

      <section className="collections scroll-reveal" id="collections">
        <div className="section-top">
          <h2>Our Collections</h2>
          <p>DESIGNED FOR INDIVIDUALITY</p>
        </div>

        <div className="collection-grid">
          <article className="collection" id="men">
  <img
    src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=90"
    alt="AURENCE menswear collection featuring a male fashion model"
  />

  <div className="collection-shade"></div>

  <div className="collection-copy">
    <p>THE ART OF MODERN DRESSING</p>
    <h3>Menswear</h3>
    <a href="/shop?category=Men">
      EXPLORE COLLECTION ↗
    </a>
  </div>
</article>

          <article className="collection" id="women">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=90"
              alt="AURENCE womenswear collection"
            />

            <div className="collection-shade"></div>

            <div className="collection-copy">
              <p>EFFORTLESS EXPRESSION</p>
              <h3>Womenswear</h3>
              <a href="/shop?category=Women">
                EXPLORE COLLECTION ↗
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* CAMPAIGN */}

      <section className="campaign scroll-reveal">
        <div className="campaign-image">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1300&q=90"
            alt="AURENCE editorial fashion"
          />
        </div>

        <div className="campaign-copy">
          <p className="eyebrow">THE AURENCE SIGNATURE</p>

          <h2>
            Less, but
            <br />
            better.
          </h2>

          <p>
            We believe true style lives in the details.
            Carefully considered designs, thoughtful
            choices and pieces worth keeping.
          </p>

          <a href="/shop">DISCOVER OUR STORY ↗</a>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}

      <section className="products scroll-reveal" id="featured">
        <div className="section-top">
          <h2>Selected Pieces</h2>
          <p>THE SIGNATURE EDIT</p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <article
              className="product-card scroll-reveal"
              key={product.id}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="product-image">
                <a href={`/shop/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </a>
              </div>

              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="product-price">{product.price}</p>

                <a href={`/shop/${product.id}`}>
                  VIEW PRODUCT →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "45px" }}>
          <a href="/shop" className="primary-link">
            VIEW ALL COLLECTIONS ↗
          </a>
        </div>
      </section>

      {/* BRAND SIGNATURE */}

      <section className="signature scroll-reveal">
        <p>THE AURENCE PHILOSOPHY</p>
        <h2>Wear your story.</h2>
      </section>

      {/* FOOTER */}

      <footer className="footer scroll-reveal">
        <div className="footer-main">
          <div>
            <div className="footer-logo">AURENCE</div>

            <p className="footer-description">
              A considered approach to modern fashion.
              Designed for individuality. Defined by elegance.
            </p>
          </div>

          <div className="footer-column">
            <h4>EXPLORE</h4>
            <a href="/">Home</a>
            <a href="/shop">Collections</a>
            <a href="/shop?category=Men">Menswear</a>
            <a href="/shop?category=Women">Womenswear</a>
            <a href="/account">My Account</a>
            <a href="/cart">Shopping Bag ({cartCount})</a>
          </div>

          <div className="footer-column">
            <h4>INFORMATION</h4>
            <a href="#home">About AURENCE</a>
            <a href="#home">Contact</a>
            <a href="#home">Privacy Policy</a>
            <a href="#home">Terms & Conditions</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 AURENCE. ALL RIGHTS RESERVED.</span>
          <span>DEFINED BY ELEGANCE.</span>
        </div>
      </footer>
    </main>
  );
}
