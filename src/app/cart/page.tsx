
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("aurence-cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("aurence-cart", JSON.stringify(cart));
    }
  }, [cart, loaded]);

  const updateQuantity = (
    id: number,
    size: string,
    colour: string,
    change: number
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id === id &&
          item.size === size &&
          item.colour === colour
        ) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + change),
          };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number, size: string, colour: string) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.colour === colour
          )
      )
    );
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  if (!loaded) {
    return <main className="cart-page">Loading your cart...</main>;
  }

  return (
    <main className="cart-page">
      <header className="cart-header">
        <Link href="/" className="cart-logo">
          AURENCE
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/shop">Continue Shopping</Link>
        </nav>
      </header>

      <section className="cart-container">
        <div className="cart-title">
          <p>YOUR SELECTION</p>
          <h1>Shopping Bag</h1>
          <span>{cart.length} item(s)</span>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>Your bag is currently empty.</h2>
            <p>
              Discover pieces that define your personal style.
            </p>
            <Link href="/shop" className="cart-shop-button">
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item) => (
                <article
                  className="cart-item"
                  key={`${item.id}-${item.size}-${item.colour}`}
                >
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-details">
                    <p className="cart-category">{item.category}</p>
                    <h3>{item.name}</h3>
                    <p>Size: {item.size}</p>
                    <p>Colour: {item.colour}</p>
                    <strong>{formatPrice(item.price)}</strong>

                    <div className="cart-actions">
                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.colour,
                              -1
                            )
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.colour,
                              1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() =>
                          removeItem(
                            item.id,
                            item.size,
                            item.colour
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </article>
              ))}
            </div>

            <aside className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <Link
                href="/checkout"
                className="checkout-button"
              >
                PROCEED TO CHECKOUT
              </Link>

              <Link href="/shop" className="continue-shopping">
                Continue Shopping →
              </Link>
            </aside>
          </div>
        )}
      </section>

      <footer className="cart-footer">
        AURENCE — A CONSIDERED APPROACH TO MODERN FASHION.
      </footer>
    </main>
  );
}
