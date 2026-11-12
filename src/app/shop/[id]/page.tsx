
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const products = [
  { id: 1, name: "The Signature Blazer", category: "Men", price: 3499, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&q=85" },
  { id: 2, name: "The Evening Edit", category: "Women", price: 2899, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=85" },
  { id: 3, name: "The Modern Essential", category: "Men", price: 1999, image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&q=85" },
  { id: 4, name: "The Timeless Dress", category: "Women", price: 2599, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&q=85" },
  { id: 5, name: "The Classic Shirt", category: "Men", price: 1499, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=85" },
  { id: 6, name: "The Minimalist Look", category: "Women", price: 2299, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=85" },
  { id: 7, name: "The Tailored Look", category: "Men", price: 3999, image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1000&q=85" },
  { id: 8, name: "The Soft Silhouette", category: "Women", price: 2799, image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1000&q=85" },
  { id: 9, name: "The Everyday Polo", category: "Men", price: 1299, image: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=1000&q=85" },
  { id: 10, name: "The Contemporary Set", category: "Women", price: 3199, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85" },
  { id: 11, name: "The Heritage Jacket", category: "Men", price: 4299, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&q=85" },
  { id: 12, name: "The Signature Ensemble", category: "Women", price: 3599, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&q=85" },
  { id: 13, name: "The Oxford Shirt", category: "Men", price: 1799, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=85" },
  { id: 14, name: "The Satin Statement", category: "Women", price: 2499, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=85" },
  { id: 15, name: "The Urban Classic", category: "Men", price: 2199, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85" },
  { id: 16, name: "The Elegant Blouse", category: "Women", price: 1899, image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=1000&q=85" },
  { id: 17, name: "The Essential Knit", category: "Men", price: 1999, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=85" },
  { id: 18, name: "The Modern Muse", category: "Women", price: 3299, image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1000&q=85" },
  { id: 19, name: "The Weekend Polo", category: "Men", price: 1399, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85" },
  { id: 20, name: "The Classic Coat", category: "Women", price: 4599, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1000&q=85" },
  { id: 21, name: "The Linen Essential", category: "Men", price: 1899, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=85" },
  { id: 22, name: "The City Edit", category: "Women", price: 2699, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=85" },
  { id: 23, name: "The Refined Trouser", category: "Men", price: 2299, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1000&q=85" },
  { id: 24, name: "The Evening Silhouette", category: "Women", price: 3799, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=85" },
  { id: 25, name: "The Signature Casual", category: "Men", price: 1599, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85" },
  { id: 26, name: "The Heritage Dress", category: "Women", price: 2999, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=85" },
  { id: 27, name: "The Modern Jacket", category: "Men", price: 3999, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=85" },
  { id: 28, name: "The Minimal Co-ord", category: "Women", price: 2899, image: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?w=1000&q=85" },
  { id: 29, name: "The Signature Denim", category: "Men", price: 2499, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85" },
  { id: 30, name: "The Luxe Collection", category: "Women", price: 4199, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=85" },
];

type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  size: string;
  colour: string;
  quantity: number;
};

type WishlistItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Number(params.id);
  const product = products.find((item) => item.id === productId);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);

  useEffect(() => {
    function loadWishlist() {
      try {
        const saved = localStorage.getItem("aurence-wishlist");
        const parsed = saved ? JSON.parse(saved) : [];
        setWishlist(Array.isArray(parsed) ? parsed : []);
      } catch {
        setWishlist([]);
      }
      setWishlistLoaded(true);
    }

    loadWishlist();

    window.addEventListener("storage", loadWishlist);
    window.addEventListener("aurence-wishlist-updated", loadWishlist);

    return () => {
      window.removeEventListener("storage", loadWishlist);
      window.removeEventListener("aurence-wishlist-updated", loadWishlist);
    };
  }, []);

  const isSaved = wishlist.some((item) => item.id === productId);

  const toggleWishlist = () => {
    if (!product) return;

    const exists = wishlist.some((item) => item.id === product.id);

    const updated = exists
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updated);
    localStorage.setItem("aurence-wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("aurence-wishlist-updated"));
  };

  const colors = [
    { name: "Black", value: "#222222" },
    { name: "White", value: "#FFFFFF" },
    { name: "Navy", value: "#26364A" },
    { name: "Beige", value: "#D8C5A5" },
  ];

  const sizeStock: Record<string, number> = {
    S: 6,
    M: 12,
    L: 9,
    XL: 4,
    XXL: 2,
  };

  const availableStock = sizeStock[selectedSize] ?? 0;

  const addToCart = () => {
    if (!product || availableStock === 0) return;

    let cart: CartItem[] = [];

    try {
      const savedCart = localStorage.getItem("aurence-cart");
      cart = savedCart ? JSON.parse(savedCart) : [];

      if (!Array.isArray(cart)) {
        cart = [];
      }
    } catch {
      cart = [];
    }

    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        item.size === selectedSize &&
        item.colour === selectedColor
    );

    if (existingItem) {
      if (existingItem.quantity + quantity > availableStock) {
        alert("Sorry! Not enough stock available.");
        return;
      }

      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        size: selectedSize,
        colour: selectedColor,
        quantity,
      });
    }

    localStorage.setItem("aurence-cart", JSON.stringify(cart));
    router.push("/cart");
  };

  if (!product) {
    return (
      <main style={{
        padding: "100px 7%",
        textAlign: "center",
        background: "#F7F4EE",
        minHeight: "100vh"
      }}>
        <h1 style={{
          fontFamily: "Italiana, serif",
          fontSize: "42px"
        }}>
          Product Not Found
        </h1>
        <Link href="/shop" style={{ color: "#552832" }}>
          Return to Shop
        </Link>
      </main>
    );
  }

  return (
    <main style={{
      background: "#F7F4EE",
      minHeight: "100vh",
      padding: "35px 7%",
      color: "#30231F"
    }}>

      {/* HEADER */}

      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
        borderBottom: "1px solid #E5DED3",
        paddingBottom: "22px",
        marginBottom: "35px",
      }}>
        <Link href="/" style={{
          color: "#552832",
          fontFamily: "Italiana, serif",
          fontSize: "30px",
          letterSpacing: "6px",
          textDecoration: "none",
        }}>
          AURENCE
        </Link>

        <nav style={{
          display: "flex",
          gap: "22px",
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <Link href="/" style={navStyle}>HOME</Link>
          <Link href="/shop" style={navStyle}>SHOP</Link>
          <Link href="/wishlist" style={navStyle}>
            ♡ WISHLIST ({wishlistLoaded ? wishlist.length : 0})
          </Link>
          <Link href="/cart" style={navStyle}>BAG</Link>
        </nav>
      </header>

      <Link href="/shop" style={{
        color: "#552832",
        fontSize: "11px",
        letterSpacing: "2px",
        textDecoration: "none"
      }}>
        ← BACK TO COLLECTION
      </Link>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        gap: "55px",
        marginTop: "35px",
        alignItems: "center",
      }}>

        {/* PRODUCT IMAGE AND HEART */}

        <div style={{ position: "relative" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: "650px",
              objectFit: "cover",
              display: "block",
            }}
          />

          <button
            onClick={toggleWishlist}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "none",
              background: "#F7F4EE",
              color: isSaved ? "#8B2635" : "#552832",
              fontSize: "30px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            {isSaved ? "♥" : "♡"}
          </button>
        </div>

        {/* PRODUCT DETAILS */}

        <section>
          <p style={{
            color: "#552832",
            letterSpacing: "3px",
            fontSize: "11px"
          }}>
            {product.category.toUpperCase()} COLLECTION
          </p>

          <h1 style={{
            fontFamily: "Italiana, serif",
            fontSize: "clamp(36px, 5vw, 58px)",
            fontWeight: "400",
            marginTop: "15px",
          }}>
            {product.name}
          </h1>

          <p style={{
            fontSize: "20px",
            marginTop: "20px"
          }}>
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p style={{
            color: "#827970",
            lineHeight: "1.9",
            marginTop: "25px",
            fontSize: "14px"
          }}>
            Discover refined style with this AURENCE essential.
            Thoughtfully selected for a modern wardrobe, combining
            timeless character with effortless elegance.
          </p>

          {/* WISHLIST ACTION */}

          <button
            onClick={toggleWishlist}
            style={{
              marginTop: "22px",
              padding: "12px 18px",
              background: "transparent",
              color: "#552832",
              border: "1px solid #552832",
              fontSize: "11px",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            {isSaved ? "♥  REMOVE FROM WISHLIST" : "♡  ADD TO WISHLIST"}
          </button>

          {/* SIZE SELECTION */}

          <div style={{ marginTop: "35px" }}>
            <p style={{
              fontSize: "11px",
              letterSpacing: "2px",
              marginBottom: "15px"
            }}>
              SELECT SIZE
            </p>

            <div style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}>
              {["S", "M", "L", "XL", "XXL"].map((size) => {
                const stock = sizeStock[size];
                const isOutOfStock = stock === 0;

                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }}
                    style={{
                      width: "48px",
                      height: "45px",
                      border: "1px solid #552832",
                      background: selectedSize === size ? "#552832" : "transparent",
                      color: selectedSize === size ? "#fff" : "#552832",
                      cursor: isOutOfStock ? "not-allowed" : "pointer",
                      opacity: isOutOfStock ? 0.35 : 1,
                      textDecoration: isOutOfStock ? "line-through" : "none",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <p style={{
              fontSize: "12px",
              marginTop: "14px",
              color: availableStock === 0 ? "#A33A35" : "#827970",
            }}>
              {availableStock === 0
                ? "This size is currently out of stock."
                : availableStock <= 2
                ? `Only ${availableStock} left in stock.`
                : `${availableStock} pieces available.`}
            </p>
          </div>

          {/* COLOUR SELECTION */}

          <div style={{ marginTop: "30px" }}>
            <p style={{
              fontSize: "11px",
              letterSpacing: "2px",
              marginBottom: "15px"
            }}>
              SELECT COLOUR: {selectedColor.toUpperCase()}
            </p>

            <div style={{
              display: "flex",
              gap: "14px",
              alignItems: "center"
            }}>
              {colors.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  aria-label={`Select ${color.name}`}
                  onClick={() => setSelectedColor(color.name)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: color.value,
                    border: selectedColor === color.name
                      ? "3px solid #A58A61"
                      : "1px solid #C9C0B4",
                    outline: selectedColor === color.name
                      ? "1px solid #552832"
                      : "none",
                    outlineOffset: "3px",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {/* QUANTITY */}

          <div style={{ marginTop: "30px" }}>
            <p style={{
              fontSize: "11px",
              letterSpacing: "2px",
              marginBottom: "12px"
            }}>
              QUANTITY
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px"
            }}>
              <button
                disabled={quantity <= 1 || availableStock === 0}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  border: "1px solid #552832",
                  padding: "8px 15px",
                  cursor: quantity <= 1 ? "not-allowed" : "pointer",
                  opacity: quantity <= 1 ? 0.4 : 1,
                }}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                disabled={quantity >= availableStock}
                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                style={{
                  border: "1px solid #552832",
                  padding: "8px 15px",
                  cursor: quantity >= availableStock ? "not-allowed" : "pointer",
                  opacity: quantity >= availableStock ? 0.4 : 1,
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART */}

          <button
            disabled={availableStock === 0}
            onClick={addToCart}
            style={{
              width: "100%",
              padding: "18px",
              marginTop: "35px",
              background: availableStock === 0 ? "#999999" : "#552832",
              color: "#fff",
              border: "none",
              letterSpacing: "2px",
              cursor: availableStock === 0 ? "not-allowed" : "pointer",
              fontSize: "11px",
            }}
          >
            {availableStock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
          </button>

          <p style={{
            color: "#827970",
            fontSize: "11px",
            marginTop: "20px"
          }}>
            AURENCE — REFINED PIECES. TIMELESS CHARACTER.
          </p>
        </section>
      </div>
    </main>
  );
}

const navStyle: React.CSSProperties = {
  color: "#552832",
  fontSize: "10px",
  letterSpacing: "2px",
  textDecoration: "none",
};
