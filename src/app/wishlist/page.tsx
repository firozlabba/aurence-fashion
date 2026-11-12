
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type WishlistItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aurence-wishlist");

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch {
      setWishlist([]);
    }

    setLoaded(true);
  }, []);

  function removeItem(id: number) {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("aurence-wishlist", JSON.stringify(updated));
  }

  function clearWishlist() {
    setWishlist([]);
    localStorage.removeItem("aurence-wishlist");
  }

  if (!loaded) {
    return (
      <main className="wishlist-page">
        <p className="wishlist-loading">Loading your wishlist...</p>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <header className="wishlist-header">
        <Link href="/" className="wishlist-brand">
          AURENCE
        </Link>

        <nav className="wishlist-nav">
          <Link href="/">HOME</Link>
          <Link href="/shop">SHOP</Link>
          <Link href="/cart">BAG</Link>
        </nav>
      </header>

      <section className="wishlist-heading">
        <p className="wishlist-eyebrow">YOUR PERSONAL COLLECTION</p>
        <h1>My Wishlist</h1>
        <p>
          Pieces you love, saved for when the moment feels right.
        </p>
        <span>{wishlist.length} SAVED ITEMS</span>
      </section>

      {wishlist.length === 0 ? (
        <section className="wishlist-empty">
          <div className="wishlist-heart">♡</div>
          <h2>Your wishlist is waiting.</h2>
          <p>
            Discover pieces that reflect your style and save your favourites
            here.
          </p>
          <Link href="/shop" className="wishlist-shop-button">
            EXPLORE COLLECTION
          </Link>
        </section>
      ) : (
        <section className="wishlist-content">
          <div className="wishlist-toolbar">
            <p>YOUR SELECTED PIECES</p>
            <button onClick={clearWishlist}>CLEAR WISHLIST</button>
          </div>

          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <article className="wishlist-card" key={item.id}>
                <Link
                  href={`/shop/${item.id}`}
                  className="wishlist-image-link"
                >
                  <img src={item.image} alt={item.name} />
                </Link>

                <button
                  className="wishlist-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  title="Remove from wishlist"
                >
                  ×
                </button>

                <div className="wishlist-product-info">
                  <div>
                    <p className="wishlist-category">{item.category}</p>
                    <h3>{item.name}</h3>
                  </div>

                  <p className="wishlist-price">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </p>
                </div>

                <Link
                  href={`/shop/${item.id}`}
                  className="wishlist-view-button"
                >
                  VIEW PRODUCT
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="wishlist-footer">
        <p>AURENCE</p>
        <span>AN EXPRESSION OF MODERN ELEGANCE</span>
        <small>© 2026 AURENCE. ALL RIGHTS RESERVED.</small>
      </footer>

      <style jsx>{`
        .wishlist-page {
          min-height: 100vh;
          background: #f7f4ee;
          color: #30231f;
          font-family: Arial, sans-serif;
        }

        .wishlist-header {
          min-height: 90px;
          padding: 20px 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5ded3;
        }

        .wishlist-brand {
          color: #552832;
          font-family: Georgia, serif;
          font-size: 30px;
          letter-spacing: 7px;
          text-decoration: none;
        }

        .wishlist-nav {
          display: flex;
          gap: 32px;
        }

        .wishlist-nav a {
          color: #30231f;
          font-size: 11px;
          letter-spacing: 2px;
          text-decoration: none;
        }

        .wishlist-heading {
          text-align: center;
          padding: 85px 20px 65px;
        }

        .wishlist-eyebrow,
        .wishlist-heading span {
          color: #a58a61;
          font-size: 10px;
          letter-spacing: 3px;
        }

        .wishlist-heading h1 {
          margin: 18px 0;
          color: #552832;
          font-family: Georgia, serif;
          font-size: clamp(42px, 6vw, 68px);
          font-weight: 400;
        }

        .wishlist-heading > p:not(.wishlist-eyebrow) {
          color: #81766c;
          font-size: 14px;
          margin-bottom: 25px;
        }

        .wishlist-heading span {
          display: inline-block;
          margin-top: 10px;
        }

        .wishlist-empty {
          min-height: 360px;
          padding: 50px 20px 100px;
          text-align: center;
        }

        .wishlist-heart {
          color: #a58a61;
          font-size: 55px;
          margin-bottom: 15px;
        }

        .wishlist-empty h2 {
          color: #552832;
          font-family: Georgia, serif;
          font-size: 30px;
          font-weight: 400;
        }

        .wishlist-empty p {
          color: #81766c;
          font-size: 14px;
          margin: 15px 0 30px;
        }

        .wishlist-shop-button,
        .wishlist-view-button {
          display: inline-block;
          background: #552832;
          color: #fff;
          text-decoration: none;
          text-align: center;
          font-size: 10px;
          letter-spacing: 2px;
          padding: 16px 27px;
        }

        .wishlist-content {
          padding: 0 7% 100px;
        }

        .wishlist-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          border-bottom: 1px solid #e5ded3;
          padding-bottom: 18px;
        }

        .wishlist-toolbar p,
        .wishlist-toolbar button {
          color: #81766c;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .wishlist-toolbar button {
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 30px 20px;
        }

        .wishlist-card {
          position: relative;
          min-width: 0;
        }

        .wishlist-image-link {
          display: block;
          background: #eee8df;
          overflow: hidden;
          aspect-ratio: 3 / 4;
        }

        .wishlist-image-link img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .wishlist-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: #f7f4ee;
          color: #552832;
          font-size: 23px;
          cursor: pointer;
        }

        .wishlist-product-info {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          padding: 17px 0 14px;
        }

        .wishlist-category {
          color: #a58a61;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .wishlist-product-info h3 {
          color: #30231f;
          font-family: Georgia, serif;
          font-size: 17px;
          font-weight: 400;
        }

        .wishlist-price {
          white-space: nowrap;
          font-size: 13px;
        }

        .wishlist-view-button {
          width: 100%;
          padding: 14px 10px;
          box-sizing: border-box;
        }

        .wishlist-footer {
          background: #30231f;
          color: #f7f4ee;
          padding: 45px 20px;
          text-align: center;
        }

        .wishlist-footer p {
          font-family: Georgia, serif;
          font-size: 25px;
          letter-spacing: 6px;
        }

        .wishlist-footer span,
        .wishlist-footer small {
          display: block;
          color: #b49a68;
          font-size: 9px;
          letter-spacing: 2px;
          margin-top: 15px;
        }

        .wishlist-footer small {
          color: #c8beb2;
          margin-top: 30px;
        }

        .wishlist-loading {
          padding: 100px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .wishlist-header {
            padding: 18px 5%;
            min-height: 75px;
          }

          .wishlist-brand {
            font-size: 23px;
            letter-spacing: 4px;
          }

          .wishlist-nav {
            gap: 14px;
          }

          .wishlist-nav a {
            font-size: 9px;
            letter-spacing: 1px;
          }

          .wishlist-heading {
            padding: 65px 15px 45px;
          }

          .wishlist-content {
            padding: 0 5% 70px;
          }

          .wishlist-grid {
            gap: 25px 12px;
          }

          .wishlist-product-info {
            flex-direction: column;
          }

          .wishlist-product-info h3 {
            font-size: 15px;
          }
        }
      `}</style>
    </main>
  );
}
