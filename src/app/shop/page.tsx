
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
};

const products: Product[] = [
  { id: 1, name: "The Signature Blazer", category: "Men", price: 3499, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85" },
  { id: 2, name: "The Evening Edit", category: "Women", price: 2899, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85" },
  { id: 3, name: "The Modern Essential", category: "Men", price: 1999, image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=85" },
  { id: 4, name: "The Timeless Dress", category: "Women", price: 2599, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85" },
  { id: 5, name: "The Classic Shirt", category: "Men", price: 1499, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=900&q=85" },
  { id: 6, name: "The Minimalist Look", category: "Women", price: 2299, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85" },
  { id: 7, name: "The Tailored Look", category: "Men", price: 3999, image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=900&q=85" },
  { id: 8, name: "The Soft Silhouette", category: "Women", price: 2799, image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900&q=85" },
  { id: 9, name: "The Everyday Polo", category: "Men", price: 1299, image: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=900&q=85" },
  { id: 10, name: "The Contemporary Set", category: "Women", price: 3199, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85" },
  { id: 11, name: "The Heritage Jacket", category: "Men", price: 4299, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85" },
  { id: 12, name: "The Signature Ensemble", category: "Women", price: 3599, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85" },
  { id: 13, name: "The Oxford Shirt", category: "Men", price: 1799, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=85" },
  { id: 14, name: "The Satin Statement", category: "Women", price: 2499, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85" },
  { id: 15, name: "The Urban Classic", category: "Men", price: 2199, image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=900&q=85" },
  { id: 16, name: "The Elegant Blouse", category: "Women", price: 1899, image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900&q=85" },
  { id: 17, name: "The Essential Knit", category: "Men", price: 1999, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=85" },
  { id: 18, name: "The Modern Muse", category: "Women", price: 3299, image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=900&q=85" },
  { id: 19, name: "The Weekend Polo", category: "Men", price: 1399, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85" },
  { id: 20, name: "The Classic Coat", category: "Women", price: 4599, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&q=85" },
  { id: 21, name: "The Linen Essential", category: "Men", price: 1899, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=85" },
  { id: 22, name: "The City Edit", category: "Women", price: 2699, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85" },
  { id: 23, name: "The Refined Trouser", category: "Men", price: 2299, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85" },
  { id: 24, name: "The Evening Silhouette", category: "Women", price: 3799, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85" },
  { id: 25, name: "The Signature Casual", category: "Men", price: 1599, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85" },
  { id: 26, name: "The Heritage Dress", category: "Women", price: 2999, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85" },
  { id: 27, name: "The Modern Jacket", category: "Men", price: 3999, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=85" },
  { id: 28, name: "The Minimal Co-ord", category: "Women", price: 2899, image: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?w=900&q=85" },
  { id: 29, name: "The Signature Denim", category: "Men", price: 2499, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85" },
  { id: 30, name: "The Luxe Collection", category: "Women", price: 4199, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85" },
];

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const gridRef = useRef<HTMLElement>(null);

  // Load wishlist
  useEffect(() => {
    function loadWishlist() {
      try {
        const saved = localStorage.getItem("aurence-wishlist");
        const parsed = saved ? JSON.parse(saved) : [];
        setWishlist(Array.isArray(parsed) ? parsed : []);
      } catch {
        setWishlist([]);
      }
      setLoaded(true);
    }

    loadWishlist();

    window.addEventListener("storage", loadWishlist);
    window.addEventListener("aurence-wishlist-updated", loadWishlist);

    return () => {
      window.removeEventListener("storage", loadWishlist);
      window.removeEventListener("aurence-wishlist-updated", loadWishlist);
    };
  }, []);

  // Wishlist toggle
  function toggleWishlist(product: Product) {
    const exists = wishlist.some((item) => item.id === product.id);

    const updated = exists
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updated);
    localStorage.setItem("aurence-wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("aurence-wishlist-updated"));
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          activeCategory === "All" ||
          product.category === activeCategory;

        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === "low") return a.price - b.price;
        if (sortOrder === "high") return b.price - a.price;
        return a.id - b.id;
      });
  }, [activeCategory, searchTerm, sortOrder]);

  // Reveal products when they enter the screen
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll(".shop-product-card");

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 40px 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredProducts]);

  return (
    <main className="shop-page">
      {/* HEADER */}
      <header className="shop-header">
        <Link href="/" className="shop-logo">
          AURENCE
          <span>MODERN LUXURY</span>
        </Link>

        <nav className="shop-nav" aria-label="Main navigation">
          <Link href="/">HOME</Link>
          <Link href="/shop" className="active">SHOP</Link>
          <Link href="/wishlist">
            ♡ WISHLIST
            {loaded && wishlist.length > 0 && (
              <span className="nav-count">{wishlist.length}</span>
            )}
          </Link>
          <Link href="/cart">BAG</Link>
        </nav>
      </header>

      {/* INTRODUCTION */}
      <section className="shop-intro">
        <p className="shop-eyebrow">THE AURENCE COLLECTION</p>
        <h1>Discover Your <em>Style.</em></h1>
        <p className="shop-subtitle">
          Refined pieces. Timeless character.
        </p>
        <span className="intro-line" />
      </section>

      {/* FILTERS */}
      <section className="shop-controls">
        <div className="category-filters" aria-label="Product categories">
          {["All", "Men", "Women"].map((category) => {
            const count =
              category === "All"
                ? products.length
                : products.filter((p) => p.category === category).length;

            return (
              <button
                key={category}
                className={`filter-button ${
                  activeCategory === category ? "selected" : ""
                }`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category === "All" ? "ALL PRODUCTS" : category.toUpperCase()}
                <span>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="search-sort">
          <div className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search your favourite pieces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* PRODUCT COUNT */}
      <div className="results-heading">
        <p>
          SHOWING <strong>{filteredProducts.length}</strong> OF{" "}
          {products.length} PRODUCTS
        </p>
        <span>CURATED FOR YOU</span>
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length > 0 ? (
        <section
          className="shop-grid"
          aria-label="Products"
          ref={gridRef}
        >
          {filteredProducts.map((product, index) => {
            const isSaved = wishlist.some(
              (item) => item.id === product.id
            );

            return (
              <article
                className="shop-product-card"
                key={product.id}
                style={{ animationDelay: `${(index % 4) * 100}ms` }}
              >
                <div className="shop-product-image">
                  <Link
                    href={`/shop/${product.id}`}
                    aria-label={`View ${product.name}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading={index > 5 ? "lazy" : "eager"}
                    />
                  </Link>

                  <button
                    className={`wishlist-heart ${isSaved ? "saved" : ""}`}
                    onClick={() => toggleWishlist(product)}
                    aria-label={
                      isSaved
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                    aria-pressed={isSaved}
                  >
                    {isSaved ? "♥" : "♡"}
                  </button>

                  <Link
                    href={`/shop/${product.id}`}
                    className="quick-view"
                  >
                    VIEW PRODUCT <span>↗</span>
                  </Link>
                </div>

                <div className="shop-product-info">
                  <p className="shop-product-category">
                    {product.category.toUpperCase()}
                  </p>

                  <Link
                    href={`/shop/${product.id}`}
                    className="shop-product-name"
                  >
                    {product.name}
                  </Link>

                  <p className="shop-product-price">
                    {formatPrice(product.price)}
                  </p>

                  <Link
                    href={`/shop/${product.id}`}
                    className="view-product"
                  >
                    DISCOVER PIECE <span>↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="no-products">
          <span>✳</span>
          <h2>No Pieces Found</h2>
          <p>
            We couldn't find anything matching your search.
            Try another name or category.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setActiveCategory("All");
            }}
          >
            EXPLORE ALL PRODUCTS
          </button>
        </section>
      )}

      {/* FOOTER */}
      <div className="shop-end">
        <span>✦</span>
        <p>STYLE THAT SPEAKS. QUALITY THAT LASTS.</p>
        <span>✦</span>
      </div>

      <style jsx>{`
        /* PAGE */
        .shop-page {
          min-height: 100vh;
          padding: 0 7% 55px;
          background: #f7f4ee;
          color: #28221f;
          animation: pageFade 0.9s ease both;
        }

        @keyframes pageFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* HEADER */
        .shop-header {
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-bottom: 1px solid #ded8cf;
          animation: headerDrop 0.9s ease both;
        }

        @keyframes headerDrop {
          from {
            opacity: 0;
            transform: translateY(-25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .shop-logo {
          display: flex;
          flex-direction: column;
          color: #28221f;
          font-family: "Italiana", serif;
          font-size: 34px;
          letter-spacing: 6px;
          text-decoration: none;
        }

        .shop-logo span {
          margin-top: -2px;
          color: #a58a61;
          font-family: "DM Sans", sans-serif;
          font-size: 7px;
          letter-spacing: 4px;
          text-align: center;
        }

        .shop-nav {
          display: flex;
          align-items: center;
          gap: clamp(15px, 3vw, 38px);
        }

        .shop-nav a {
          position: relative;
          color: #552832;
          font-size: 10px;
          letter-spacing: 1.5px;
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .shop-nav a::after {
          content: "";
          position: absolute;
          bottom: -7px;
          left: 0;
          width: 0;
          height: 1px;
          background: #a58a61;
          transition: width 0.35s ease;
        }

        .shop-nav a:hover::after,
        .shop-nav a.active::after {
          width: 100%;
        }

        .shop-nav a:hover,
        .shop-nav a.active {
          color: #a58a61;
        }

        .nav-count {
          margin-left: 5px;
          font-size: 9px;
        }

        /* INTRO */
        .shop-intro {
          padding: 85px 0 65px;
          text-align: center;
          animation: introReveal 1s 0.15s ease both;
        }

        @keyframes introReveal {
          from {
            opacity: 0;
            transform: translateY(35px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .shop-eyebrow {
          color: #552832;
          font-size: 10px;
          letter-spacing: 4px;
        }

        .shop-intro h1 {
          margin-top: 18px;
          font-family: "Italiana", serif;
          font-size: clamp(46px, 6.5vw, 76px);
          font-weight: 400;
          line-height: 1.08;
          animation: titleReveal 1.1s 0.25s ease both;
        }

        @keyframes titleReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
            letter-spacing: 5px;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: normal;
          }
        }

        .shop-intro h1 em {
          color: #552832;
          font-weight: 400;
        }

        .shop-subtitle {
          margin-top: 15px;
          color: #827970;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .intro-line {
          display: block;
          width: 55px;
          height: 1px;
          margin: 27px auto 0;
          background: #a58a61;
          animation: lineExpand 1s 0.6s ease both;
        }

        @keyframes lineExpand {
          from { width: 0; opacity: 0; }
          to { width: 55px; opacity: 1; }
        }

        /* FILTERS */
        .shop-controls {
          display: flex;
          flex-direction: column;
          gap: 30px;
          align-items: center;
          animation: controlsReveal 0.9s 0.35s ease both;
        }

        @keyframes controlsReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-filters {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .filter-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 43px;
          padding: 0 22px;
          border: 1px solid #552832;
          background: transparent;
          color: #552832;
          font-size: 10px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition:
            background 0.35s ease,
            color 0.35s ease,
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .filter-button span {
          font-size: 9px;
          opacity: 0.7;
        }

        .filter-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(85, 40, 50, 0.1);
        }

        .filter-button:active {
          transform: scale(0.96);
        }

        .filter-button:hover,
        .filter-button.selected {
          background: #552832;
          color: white;
        }

        .search-sort {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          width: 100%;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          max-width: 430px;
          min-height: 48px;
          padding: 0 15px;
          border: 1px solid #d8cfc2;
          background: rgba(255,255,255,0.22);
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            background 0.3s ease;
        }

        .search-box:focus-within {
          border-color: #a58a61;
          background: #fffdf9;
          box-shadow: 0 5px 20px rgba(85, 40, 50, 0.07);
        }

        .search-box > span {
          color: #a58a61;
          font-size: 23px;
        }

        .search-box input {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #28221f;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
        }

        .search-box input::placeholder {
          color: #978c80;
        }

        .clear-search {
          border: none;
          background: transparent;
          color: #552832;
          font-size: 22px;
          cursor: pointer;
        }

        .search-sort select {
          min-height: 48px;
          min-width: 175px;
          padding: 0 14px;
          border: 1px solid #d8cfc2;
          background: #f7f4ee;
          color: #552832;
          font-family: "DM Sans", sans-serif;
          font-size: 11px;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .search-sort select:focus {
          border-color: #a58a61;
          box-shadow: 0 4px 15px rgba(85, 40, 50, 0.07);
        }

        /* PRODUCT COUNT */
        .results-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin: 45px 0 22px;
          padding-bottom: 14px;
          border-bottom: 1px solid #e5ded3;
          color: #827970;
          font-size: 9px;
          letter-spacing: 1.5px;
          animation: resultsReveal 0.8s 0.4s ease both;
        }

        @keyframes resultsReveal {
          from {
            opacity: 0;
            transform: translateX(-15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .results-heading strong {
          color: #552832;
        }

        .results-heading span {
          color: #a58a61;
        }

        /* PRODUCT GRID */
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 48px 25px;
        }

        .shop-product-card {
          min-width: 0;
          opacity: 0;
          transform: translateY(35px);
          transition:
            opacity 0.8s ease,
            transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .shop-product-card.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .shop-product-card:hover {
          transform: translateY(-8px);
        }

        .shop-product-image {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          background: linear-gradient(145deg, #eee9e0, #e3dbcf);
          isolation: isolate;
        }

        .shop-product-image > a:first-child {
          display: block;
          width: 100%;
          height: 100%;
        }

        .shop-product-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          transition:
            transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1),
            filter 0.8s ease;
        }

        .shop-product-card:hover .shop-product-image img {
          transform: scale(1.09);
          filter: brightness(0.92);
        }

        /* WISHLIST */
        .wishlist-heart {
          position: absolute;
          z-index: 2;
          top: 13px;
          right: 13px;
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(85,40,50,0.12);
          border-radius: 50%;
          background: #f7f4ee;
          color: #552832;
          font-size: 24px;
          cursor: pointer;
          transition:
            background 0.25s,
            color 0.25s,
            transform 0.25s;
        }

        .wishlist-heart:hover {
          transform: scale(1.1);
        }

        .wishlist-heart:active {
          transform: scale(0.82);
        }

        .wishlist-heart.saved {
          background: #552832;
          color: white;
          animation: heartPop 0.4s ease;
        }

        @keyframes heartPop {
          0% { transform: scale(1); }
          35% { transform: scale(1.3); }
          65% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }

        /* QUICK VIEW */
        .quick-view {
          position: absolute;
          bottom: 15px;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: calc(100% - 30px);
          padding: 15px 10px;
          background: rgba(247, 244, 238, 0.94);
          color: #552832;
          font-size: 9px;
          letter-spacing: 2px;
          text-align: center;
          opacity: 0;
          transform: translate(-50%, 15px);
          transition:
            opacity 0.4s ease,
            transform 0.4s ease;
        }

        .shop-product-card:hover .quick-view {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        .quick-view span {
          font-size: 15px;
        }

        /* PRODUCT INFORMATION */
        .shop-product-info {
          padding: 19px 2px 0;
        }

        .shop-product-category {
          color: #827970;
          font-size: 9px;
          letter-spacing: 2.2px;
          margin-bottom: 8px;
        }

        .shop-product-name {
          display: block;
          margin-top: 9px;
          color: #28221f;
          font-family: "Italiana", serif;
          font-size: clamp(20px, 2vw, 25px);
          line-height: 1.3;
          transition:
            color 0.35s ease,
            letter-spacing 0.35s ease;
        }

        .shop-product-name:hover {
          color: #a58a61;
          letter-spacing: 0.4px;
        }

        .shop-product-price {
          margin-top: 10px;
          color: #552832;
          font-size: 13px;
          letter-spacing: 0.3px;
        }

        .view-product {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 17px;
          padding-bottom: 6px;
          border-bottom: 1px solid #a58a61;
          color: #552832;
          font-size: 9px;
          letter-spacing: 1.7px;
          transition:
            gap 0.3s,
            color 0.3s;
        }

        .view-product:hover {
          gap: 19px;
          color: #a58a61;
        }

        .view-product span {
          font-size: 15px;
        }

        /* EMPTY SEARCH */
        .no-products {
          padding: 100px 20px;
          text-align: center;
          animation: introReveal 0.6s ease both;
        }

        .no-products > span {
          color: #a58a61;
          font-size: 35px;
        }

        .no-products h2 {
          margin-top: 15px;
          font-family: "Italiana", serif;
          font-size: 38px;
          font-weight: 400;
        }

        .no-products p {
          margin: 15px auto 25px;
          color: #827970;
          font-size: 12px;
          line-height: 1.8;
        }

        .no-products button {
          padding: 15px 25px;
          border: 1px solid #552832;
          background: #552832;
          color: white;
          font-size: 10px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition:
            background 0.3s,
            transform 0.3s;
        }

        .no-products button:hover {
          background: #a58a61;
          transform: translateY(-3px);
        }

        /* FOOTER */
        .shop-end {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 17px;
          margin-top: 100px;
          padding-top: 30px;
          border-top: 1px solid #e5ded3;
          color: #a58a61;
          animation: footerReveal 1s ease both;
        }

        @keyframes footerReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .shop-end p {
          color: #827970;
          font-size: 9px;
          letter-spacing: 2.5px;
          text-align: center;
        }

        /* LARGE DESKTOP */
        @media (min-width: 1400px) {
          .shop-page {
            padding-left: max(7%, calc((100% - 1350px) / 2));
            padding-right: max(7%, calc((100% - 1350px) / 2));
          }

          .shop-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        /* TABLET */
        @media (max-width: 900px) {
          .shop-page {
            padding-left: 5%;
            padding-right: 5%;
          }

          .shop-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 38px 18px;
          }

          .shop-intro {
            padding: 65px 0 50px;
          }
        }

        /* MOBILE */
        @media (max-width: 600px) {
          .shop-header {
            min-height: 85px;
            flex-direction: column;
            justify-content: center;
            gap: 14px;
            padding: 14px 0;
          }

          .shop-logo {
            font-size: 29px;
            letter-spacing: 5px;
          }

          .shop-nav {
            width: 100%;
            justify-content: center;
            gap: clamp(15px, 5vw, 27px);
          }

          .shop-nav a {
            font-size: 9px;
            letter-spacing: 1px;
          }

          .shop-intro {
            padding: 60px 0 45px;
          }

          .shop-eyebrow {
            font-size: 9px;
            letter-spacing: 3px;
          }

          .shop-intro h1 {
            font-size: clamp(43px, 10vw, 58px);
          }

          .shop-subtitle {
            font-size: 12px;
          }

          .shop-controls {
            gap: 23px;
          }

          .category-filters {
            width: 100%;
            gap: 8px;
          }

          .filter-button {
            flex: 1;
            justify-content: center;
            min-height: 42px;
            padding: 0 9px;
            gap: 5px;
            font-size: 9px;
            letter-spacing: 0.8px;
          }

          .search-sort {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .search-box {
            width: 100%;
            max-width: none;
          }

          .search-sort select {
            width: 100%;
          }

          .results-heading {
            margin-top: 35px;
            font-size: 8px;
            letter-spacing: 1px;
          }

          .shop-grid {
            gap: 32px 12px;
          }

          .shop-product-info {
            padding-top: 12px;
          }

          .shop-product-category {
            font-size: 8px;
            letter-spacing: 1.5px;
          }

          .shop-product-name {
            font-size: clamp(17px, 4.5vw, 21px);
          }

          .shop-product-price {
            font-size: 12px;
          }

          .view-product {
            margin-top: 13px;
            font-size: 8px;
            letter-spacing: 1px;
          }

          .wishlist-heart {
            top: 9px;
            right: 9px;
            width: 36px;
            height: 36px;
            font-size: 21px;
          }

          .quick-view {
            display: none;
          }

          .shop-end {
            margin-top: 70px;
          }

          .shop-end p {
            font-size: 8px;
            letter-spacing: 1.5px;
          }
        }

        /* SMALL PHONES */
        @media (max-width: 360px) {
          .shop-nav {
            gap: 12px;
          }

          .shop-nav a {
            font-size: 8px;
          }

          .filter-button {
            font-size: 8px;
            padding: 0 5px;
          }

          .shop-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .shop-product-name {
            font-size: 23px;
          }
        }

        /* TOUCH DEVICES */
        @media (hover: none) {
          .shop-product-card:hover .shop-product-image img {
            transform: none;
          }

          .shop-product-card:hover .quick-view {
            opacity: 0;
          }

          .wishlist-heart:hover {
            transform: none;
          }
        }

        /* ACCESSIBILITY */
        @media (prefers-reduced-motion: reduce) {
          .shop-page *,
          .shop-page *::before,
          .shop-page *::after {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }

          .shop-product-card {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}
