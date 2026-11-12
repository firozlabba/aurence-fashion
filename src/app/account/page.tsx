
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type OrderItem = {
  id: number;
  order_id: number;
  product_id: string;
  product_name: string;
  category: string | null;
  price: number;
  image: string | null;
  size: string | null;
  colour: string | null;
  quantity: number;
};

type Order = {
  id: number;
  user_id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total: number;
  payment_method: string;
  payment_reference: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  items: OrderItem[];
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [tab, setTab] = useState<"profile" | "orders">("profile");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Check login session
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) setError(error.message);

      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load profile information
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || "");
      setPhone(user.user_metadata?.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Load customer's orders
  useEffect(() => {
    if (!user || tab !== "orders") return;

    let cancelled = false;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      setError("");

      try {
        const { data: orderData, error: orderError } =
          await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (orderError) throw orderError;

        const savedOrders = (orderData || []) as Omit<
          Order,
          "items"
        >[];

        if (savedOrders.length === 0) {
          if (!cancelled) setOrders([]);
          return;
        }

        const orderIds = savedOrders.map((order) => order.id);

        const { data: itemData, error: itemError } =
          await supabase
            .from("order_items")
            .select("*")
            .in("order_id", orderIds);

        if (itemError) throw itemError;

        const savedItems = (itemData || []) as OrderItem[];

        const completeOrders: Order[] = savedOrders.map(
          (order) => ({
            ...order,
            items: savedItems.filter(
              (item) => item.order_id === order.id
            ),
          })
        );

        if (!cancelled) setOrders(completeOrders);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your orders."
          );
        }
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [user, tab]);

  // Login and registration
  const handleAuth = async () => {
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setSaving(true);

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });

        if (error) throw error;

        if (data.session && data.user) {
          setUser(data.user);
          setMessage("Account created successfully. Redirecting...");

          // Redirect after successful registration
          router.replace("/shop");
        } else {
          setMessage(
            "Registration successful! Please check your email and confirm your account before signing in."
          );

          setMode("login");
          setPassword("");
        }
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) throw error;

        if (!data.user) {
          throw new Error("Unable to sign in. Please try again.");
        }

        setUser(data.user);
        setPassword("");

        // Redirect after successful login
        router.replace("/");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // Save customer profile
  const saveProfile = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          phone: phone.trim(),
        },
      });

      if (error) throw error;

      setUser(data.user);
      setMessage("Your profile has been updated successfully.");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const logout = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setUser(null);
    setOrders([]);
    setMode("login");
    setPassword("");
    setMessage("You have been logged out successfully.");
    setSaving(false);
  };

  const statusStyle = (status: string): React.CSSProperties => {
    const normalized = status.toLowerCase();

    let background = "#F3EBDD";
    let color = "#80643D";

    if (
      normalized.includes("verified") ||
      normalized.includes("delivered") ||
      normalized.includes("completed")
    ) {
      background = "#E7F2E8";
      color = "#376B42";
    } else if (
      normalized.includes("cancelled") ||
      normalized.includes("failed")
    ) {
      background = "#F9E8E6";
      color = "#A33D35";
    }

    return {
      display: "inline-block",
      padding: "7px 11px",
      borderRadius: "2px",
      background,
      color,
      fontSize: "11px",
      textTransform: "capitalize",
    };
  };

  if (loading) {
    return (
      <main className="loading-page">
        <div className="loading-logo">AURENCE</div>
        <div className="loading-line" />
        <p>Preparing your experience...</p>

        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            background: #f7f4ee;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #54232d;
          }

          .loading-logo {
            font-family: Georgia, serif;
            font-size: 30px;
            letter-spacing: 8px;
            animation: fadeIn 1s ease both;
          }

          .loading-line {
            width: 100px;
            height: 2px;
            background: #e4d9ca;
            margin-top: 25px;
            overflow: hidden;
            position: relative;
          }

          .loading-line::after {
            content: "";
            position: absolute;
            inset: 0;
            background: #54232d;
            transform: translateX(-100%);
            animation: loading 1.3s ease infinite;
          }

          p {
            font-size: 12px;
            letter-spacing: 1px;
            color: #8b7c70;
            margin-top: 18px;
          }

          @keyframes loading {
            to {
              transform: translateX(100%);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="account-page">
      <header className="account-header">
        <a href="/" className="brand-logo">
          AURENCE
        </a>

        {user ? (
          <a href="/shop" className="continue-link">
            CONTINUE SHOPPING <span>↗</span>
          </a>
        ) : (
          <button
            type="button"
            className="continue-link"
            onClick={() => {
              setError(
                "Please login or register first to continue shopping."
              );
              setMessage("");
            }}
          >
            CONTINUE SHOPPING <span>↗</span>
          </button>
        )}
      </header>

      {!user ? (
        <section className="auth-layout">
          {/* LEFT FASHION IMAGE */}
          <div className="auth-visual">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=90"
              alt="AURENCE luxury fashion collection"
              className="fashion-image"
            />

            <div className="image-overlay" />

            <div className="visual-top">
              <span>THE AURENCE EXPERIENCE</span>
              <span>EST. 2026</span>
            </div>

            <div className="visual-content">
              <p>THE ART OF DRESSING WELL</p>
              <h2>
                Elegance is
                <br />
                an attitude.
              </h2>
              <div className="visual-line" />
              <span>DISCOVER YOUR SIGNATURE STYLE</span>
            </div>

            <div className="visual-bottom">
              <span>CURATED FOR THE MODERN INDIVIDUAL</span>
              <span>01 / AURENCE</span>
            </div>
          </div>

          {/* RIGHT LOGIN / REGISTER */}
          <div className="auth-content">
            <div className="auth-inner">
              <div className="mobile-brand">AURENCE</div>

              <div className="auth-heading">
                <span className="eyebrow">AURENCE MEMBERSHIP</span>

                <h1 key={mode} className="heading-animation">
                  {mode === "login"
                    ? "Welcome Back."
                    : "Join the World of AURENCE."}
                </h1>

                <p>
                  {mode === "login"
                    ? "Your personal style journey continues here."
                    : "Create your account and discover a more personal shopping experience."}
                </p>
              </div>

              {/* LOGIN / REGISTER SWITCH */}
              <div className="auth-switch">
                <button
                  className={mode === "login" ? "active" : ""}
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setMessage("");
                  }}
                >
                  SIGN IN
                </button>

                <button
                  className={mode === "register" ? "active" : ""}
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setMessage("");
                  }}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              <div className="form-animation" key={`form-${mode}`}>
                {mode === "register" && (
                  <div className="form-group">
                    <label>FULL NAME</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label>PASSWORD</label>

                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete={
                        mode === "login"
                          ? "current-password"
                          : "new-password"
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAuth();
                      }}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>

                  {mode === "register" && (
                    <span className="password-hint">
                      Use at least 6 characters.
                    </span>
                  )}
                </div>

                {error && (
                  <div className="status-message error-message">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="status-message success-message">
                    {message}
                  </div>
                )}

                <button
                  className="submit-button"
                  onClick={handleAuth}
                  disabled={saving}
                >
                  <span>
                    {saving
                      ? "PLEASE WAIT..."
                      : mode === "login"
                        ? "SIGN IN TO YOUR ACCOUNT"
                        : "CREATE YOUR ACCOUNT"}
                  </span>
                  <span className="submit-arrow">↗</span>
                </button>
              </div>

              <div className="auth-footer">
                <span>
                  {mode === "login"
                    ? "NEW TO AURENCE?"
                    : "ALREADY A MEMBER?"}
                </span>

                <button
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError("");
                    setMessage("");
                  }}
                >
                  {mode === "login"
                    ? "CREATE AN ACCOUNT"
                    : "SIGN IN"}
                </button>
              </div>

              <div className="auth-note">
                <span>✦</span>
                A MORE PERSONAL WAY TO EXPERIENCE STYLE
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* CUSTOMER DASHBOARD */
        <section className="dashboard">
          <div className="dashboard-heading">
            <span className="eyebrow">MY AURENCE</span>

            <h1>
              Welcome, {user.user_metadata?.full_name || user.email}
            </h1>

            <p>Manage your personal information and orders.</p>
          </div>

          {error && <p className="dashboard-error">{error}</p>}
          {message && <p className="dashboard-success">{message}</p>}

          <div className="dashboard-tabs">
            <button
              className={tab === "profile" ? "selected" : ""}
              onClick={() => {
                setTab("profile");
                setError("");
              }}
            >
              MY PROFILE
            </button>

            <button
              className={tab === "orders" ? "selected" : ""}
              onClick={() => {
                setTab("orders");
                setError("");
              }}
            >
              MY ORDERS
            </button>
          </div>

          {tab === "profile" ? (
            <div className="profile-card">
              <h2>Personal Information</h2>

              <div className="form-group">
                <label>FULL NAME</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <input value={user.email || ""} disabled />
              </div>

              <div className="form-group">
                <label>PHONE NUMBER</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <button
                className="submit-button"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          ) : (
            <div className="orders-section">
              {loadingOrders ? (
                <div className="empty-orders">
                  Loading your orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <span className="empty-icon">◇</span>
                  <h2>Your Orders</h2>
                  <p>You have no orders to display yet.</p>
                  <a href="/shop">EXPLORE COLLECTION ↗</a>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div className="order-card" key={order.id}>
                      <div className="order-header">
                        <div>
                          <span className="eyebrow">ORDER NUMBER</span>
                          <h2>AUR-{order.id}</h2>
                          <p>
                            {new Date(order.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="order-statuses">
                          <span style={statusStyle(order.payment_status)}>
                            Payment: {order.payment_status.replaceAll("_", " ")}
                          </span>

                          <span style={statusStyle(order.order_status)}>
                            Order: {order.order_status.replaceAll("_", " ")}
                          </span>
                        </div>
                      </div>

                      <h3>Products Ordered</h3>

                      {order.items.map((item) => (
                        <div className="ordered-product" key={item.id}>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.product_name}
                            />
                          )}

                          <div className="ordered-product-info">
                            <h4>{item.product_name}</h4>

                            <p>
                              Quantity: {item.quantity}
                              {item.size && ` | Size: ${item.size}`}
                              {item.colour && ` | Colour: ${item.colour}`}
                            </p>

                            <span>
                              ₹{Number(item.price).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className="order-total">
                        <span>TOTAL AMOUNT</span>
                        <strong>
                          ₹{Number(order.total).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      <div className="delivery-address">
                        <span>DELIVERY ADDRESS</span>
                        <p>
                          {order.customer_name}
                          <br />
                          {order.address}, {order.city}
                          <br />
                          {order.state} - {order.pincode}
                          <br />
                          Phone: {order.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            className="logout-button"
            onClick={logout}
            disabled={saving}
          >
            {saving ? "PLEASE WAIT..." : "LOG OUT"}
          </button>
        </section>
      )}

      <style jsx>{`
        .account-page {
          min-height: 100vh;
          background: #f7f4ee;
          color: #30231f;
          font-family: Arial, Helvetica, sans-serif;
        }

        .account-header {
          height: 76px;
          padding: 0 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5ded3;
          background: #f7f4ee;
          position: relative;
          z-index: 2;
        }

        .brand-logo {
          font-family: Georgia, serif;
          font-size: 27px;
          letter-spacing: 7px;
          color: #54232d;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .brand-logo:hover {
          opacity: 0.65;
        }

        .continue-link {
          display: inline-flex;
          align-items: center;
          color: #54232d;
          text-decoration: none;
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 2px;
          background: transparent;
          border: none;
          padding: 10px 0;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .continue-link:hover {
          opacity: 0.6;
        }

        .continue-link span {
          margin-left: 8px;
        }

        /* AUTHENTICATION LAYOUT */

        .auth-layout {
          min-height: calc(100vh - 76px);
          display: grid;
          grid-template-columns: 1fr 0.92fr;
          animation: pageAppear 0.8s ease both;
        }

        .auth-visual {
          position: relative;
          min-height: 690px;
          overflow: hidden;
          background: #30231f;
          color: #fff;
        }

        .fashion-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
          animation: imageAppear 1.4s ease both;
          transition: transform 1.2s ease;
        }

        .auth-visual:hover .fashion-image {
          transform: scale(1.035);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(20, 15, 13, 0.28) 0%,
            rgba(20, 15, 13, 0.12) 35%,
            rgba(20, 15, 13, 0.72) 100%
          );
        }

        .visual-top,
        .visual-bottom {
          position: absolute;
          left: 42px;
          right: 42px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.8);
        }

        .visual-top {
          top: 35px;
        }

        .visual-bottom {
          bottom: 32px;
          font-size: 8px;
        }

        .visual-content {
          position: absolute;
          left: 11%;
          bottom: 16%;
          animation: contentAppear 1s 0.25s both;
        }

        .visual-content > p {
          font-size: 10px;
          letter-spacing: 3px;
          color: #d6c09d;
          margin-bottom: 20px;
        }

        .visual-content h2 {
          font-family: Georgia, serif;
          font-size: clamp(43px, 5vw, 68px);
          font-weight: 400;
          line-height: 1.08;
          margin: 0;
          letter-spacing: -1.5px;
        }

        .visual-line {
          height: 1px;
          width: 65px;
          background: #c1a477;
          margin: 28px 0 18px;
        }

        .visual-content > span {
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.85);
        }

        /* FORM SIDE */

        .auth-content {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 65px 9%;
          background: #f7f4ee;
        }

        .auth-inner {
          width: 100%;
          max-width: 440px;
        }

        .mobile-brand {
          display: none;
          font-family: Georgia, serif;
          color: #54232d;
          font-size: 24px;
          letter-spacing: 6px;
          margin-bottom: 45px;
        }

        .eyebrow {
          display: block;
          color: #a58a61;
          font-size: 10px;
          letter-spacing: 3px;
          margin-bottom: 18px;
        }

        .auth-heading h1 {
          font-family: Georgia, serif;
          font-size: clamp(35px, 3.4vw, 49px);
          line-height: 1.13;
          font-weight: 400;
          letter-spacing: -1px;
          color: #30231f;
          margin: 0 0 17px;
        }

        .auth-heading p {
          font-size: 13px;
          line-height: 1.8;
          color: #81766d;
          max-width: 360px;
          margin: 0;
        }

        .heading-animation {
          animation: headingAppear 0.5s ease both;
        }

        .auth-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin: 42px 0 32px;
          border-bottom: 1px solid #ded6ca;
        }

        .auth-switch button {
          position: relative;
          padding: 16px 5px;
          border: none;
          background: transparent;
          color: #95887d;
          font-size: 10px;
          letter-spacing: 1.8px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .auth-switch button:hover {
          color: #54232d;
        }

        .auth-switch button.active {
          color: #54232d;
        }

        .auth-switch button.active::after {
          content: "";
          position: absolute;
          height: 2px;
          background: #54232d;
          bottom: -1px;
          left: 0;
          right: 0;
          animation: underlineAppear 0.35s ease both;
        }

        .form-animation {
          animation: formAppear 0.45s ease both;
        }

        .form-group {
          margin-bottom: 23px;
        }

        .form-group label {
          display: block;
          color: #65564d;
          font-size: 9px;
          letter-spacing: 2px;
          margin-bottom: 11px;
        }

        .form-group input {
          width: 100%;
          height: 53px;
          box-sizing: border-box;
          padding: 0 16px;
          background: #fdfcf9;
          border: 1px solid #ded6ca;
          border-radius: 0;
          outline: none;
          font-size: 13px;
          color: #30231f;
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            background 0.3s ease;
        }

        .form-group input::placeholder {
          color: #b2a79c;
        }

        .form-group input:focus {
          border-color: #54232d;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(84, 35, 45, 0.07);
        }

        .form-group input:disabled {
          background: #eeeae3;
          color: #776b62;
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper input {
          padding-right: 65px;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #806a55;
          font-size: 9px;
          letter-spacing: 1px;
          cursor: pointer;
          padding: 8px 0 8px 8px;
        }

        .password-hint {
          display: block;
          margin-top: 9px;
          color: #9b8d81;
          font-size: 10px;
        }

        .status-message {
          padding: 13px 15px;
          margin: 15px 0;
          font-size: 12px;
          line-height: 1.7;
          animation: formAppear 0.3s ease both;
        }

        .error-message {
          background: #f9e8e6;
          color: #a33d35;
          border-left: 2px solid #a33d35;
        }

        .success-message {
          background: #eaf2e9;
          color: #376b42;
          border-left: 2px solid #54845c;
        }

        .submit-button {
          width: 100%;
          min-height: 55px;
          margin-top: 12px;
          padding: 15px 19px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #54232d;
          color: #fff;
          border: 1px solid #54232d;
          cursor: pointer;
          font-size: 10px;
          letter-spacing: 1.8px;
          transition:
            background 0.3s ease,
            color 0.3s ease,
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #3c1820;
          box-shadow: 0 8px 22px rgba(84, 35, 45, 0.15);
          transform: translateY(-2px);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .submit-arrow {
          font-size: 17px;
          transition: transform 0.3s ease;
        }

        .submit-button:hover .submit-arrow {
          transform: translate(3px, -3px);
        }

        .auth-footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-top: 30px;
          font-size: 9px;
          letter-spacing: 1px;
          color: #897d72;
        }

        .auth-footer button {
          border: none;
          background: transparent;
          padding: 0;
          color: #54232d;
          font-size: 9px;
          letter-spacing: 1px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .auth-footer button:hover {
          opacity: 0.6;
        }

        .auth-note {
          margin-top: 55px;
          text-align: center;
          font-size: 8px;
          letter-spacing: 1.7px;
          color: #a49788;
        }

        .auth-note span {
          color: #a58a61;
          margin-right: 7px;
        }

        /* DASHBOARD */

        .dashboard {
          max-width: 1050px;
          margin: 55px auto;
          padding: 0 25px 70px;
          animation: pageAppear 0.65s ease both;
        }

        .dashboard-heading h1 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 36px;
          margin: 0 0 10px;
          color: #30231f;
        }

        .dashboard-heading p {
          color: #857a70;
          font-size: 14px;
        }

        .dashboard-tabs {
          display: flex;
          gap: 15px;
          border-bottom: 1px solid #dcd4c8;
          margin-top: 35px;
        }

        .dashboard-tabs button {
          padding: 15px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: #54232d;
          cursor: pointer;
          font-size: 12px;
          letter-spacing: 0.5px;
        }

        .dashboard-tabs button.selected {
          border-bottom-color: #54232d;
        }

        .profile-card {
          background: #fff;
          border: 1px solid #eae4d9;
          padding: 35px;
          margin-top: 25px;
          max-width: 650px;
          animation: formAppear 0.5s ease both;
        }

        .profile-card h2,
        .order-card h3,
        .empty-orders h2 {
          font-family: Georgia, serif;
          font-weight: 400;
        }

        .profile-card .submit-button {
          justify-content: center;
        }

        .dashboard-error {
          color: #b42318;
          font-size: 13px;
          margin-top: 15px;
        }

        .dashboard-success {
          color: #47734d;
          font-size: 13px;
        }

        .orders-section {
          margin-top: 25px;
        }

        .empty-orders {
          background: #fff;
          border: 1px solid #eae4d9;
          padding: 55px 30px;
          text-align: center;
          color: #857a70;
        }

        .empty-icon {
          display: block;
          font-family: Georgia, serif;
          font-size: 35px;
          color: #a58a61;
          margin-bottom: 15px;
        }

        .empty-orders h2 {
          color: #30231f;
        }

        .empty-orders p {
          font-size: 13px;
          margin-bottom: 25px;
        }

        .empty-orders a {
          color: #54232d;
          text-decoration: none;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .orders-list {
          display: grid;
          gap: 22px;
        }

        .order-card {
          background: #fff;
          border: 1px solid #eae4d9;
          padding: 25px;
          animation: formAppear 0.5s ease both;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 15px;
          border-bottom: 1px solid #eae4d9;
          padding-bottom: 18px;
        }

        .order-header h2 {
          font-family: Georgia, serif;
          font-weight: 400;
          margin: 5px 0;
        }

        .order-header p {
          font-size: 12px;
          color: #857a70;
        }

        .order-statuses {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .order-card h3 {
          margin-top: 22px;
        }

        .ordered-product {
          display: flex;
          gap: 18px;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f0ece5;
        }

        .ordered-product img {
          width: 85px;
          height: 105px;
          object-fit: cover;
          background: #f7f4ee;
        }

        .ordered-product-info {
          flex: 1;
        }

        .ordered-product-info h4 {
          font-family: Georgia, serif;
          font-size: 16px;
          font-weight: 400;
          margin: 0 0 8px;
        }

        .ordered-product-info p {
          font-size: 12px;
          color: #857a70;
          line-height: 1.8;
        }

        .ordered-product-info span {
          color: #54232d;
          font-size: 13px;
        }

        .order-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .order-total > span {
          font-size: 11px;
          letter-spacing: 1px;
        }

        .order-total strong {
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 400;
          color: #54232d;
        }

        .delivery-address {
          margin-top: 22px;
          padding: 16px;
          background: #f7f4ee;
        }

        .delivery-address > span {
          font-size: 10px;
          letter-spacing: 1px;
          color: #a58a61;
        }

        .delivery-address p {
          font-size: 13px;
          line-height: 1.7;
        }

        .logout-button {
          margin-top: 35px;
          padding: 14px 30px;
          border: 1px solid #54232d;
          background: transparent;
          color: #54232d;
          cursor: pointer;
          letter-spacing: 2px;
          font-size: 10px;
          transition: all 0.3s ease;
        }

        .logout-button:hover {
          background: #54232d;
          color: #fff;
        }

        /* ANIMATIONS */

        @keyframes pageAppear {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageAppear {
          from {
            opacity: 0;
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes contentAppear {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes headingAppear {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes formAppear {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes underlineAppear {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        /* TABLET */

        @media (max-width: 900px) {
          .auth-layout {
            grid-template-columns: 0.9fr 1fr;
          }

          .auth-content {
            padding: 55px 7%;
          }

          .visual-top,
          .visual-bottom {
            left: 25px;
            right: 25px;
          }

          .visual-content {
            left: 9%;
          }

          .visual-content h2 {
            font-size: 48px;
          }
        }

        /* MOBILE */

        @media (max-width: 650px) {
          .account-header {
            height: 66px;
            padding: 0 20px;
          }

          .brand-logo {
            font-size: 21px;
            letter-spacing: 5px;
          }

          .continue-link {
            font-size: 8px;
            letter-spacing: 1px;
          }

          .auth-layout {
            display: flex;
            flex-direction: column;
            min-height: calc(100vh - 66px);
          }

          .auth-visual {
            min-height: 300px;
            height: 36vh;
            max-height: 400px;
          }

          .fashion-image {
            object-position: center 35%;
          }

          .visual-top {
            top: 20px;
            left: 20px;
            right: 20px;
            font-size: 7px;
            letter-spacing: 1.2px;
          }

          .visual-bottom {
            bottom: 18px;
            left: 20px;
            right: 20px;
            font-size: 7px;
          }

          .visual-content {
            left: 25px;
            bottom: 55px;
          }

          .visual-content > p {
            font-size: 8px;
            margin-bottom: 12px;
            letter-spacing: 2px;
          }

          .visual-content h2 {
            font-size: 39px;
          }

          .visual-line {
            margin: 16px 0 10px;
            width: 45px;
          }

          .visual-content > span {
            font-size: 7px;
          }

          .auth-content {
            padding: 45px 25px 55px;
          }

          .mobile-brand {
            display: block;
            font-size: 21px;
            letter-spacing: 5px;
            margin-bottom: 35px;
          }

          .auth-heading h1 {
            font-size: 37px;
          }

          .auth-heading p {
            font-size: 12px;
          }

          .auth-switch {
            margin: 32px 0 28px;
          }

          .auth-note {
            margin-top: 38px;
            font-size: 7px;
          }

          .dashboard {
            margin: 35px auto;
            padding: 0 18px 50px;
          }

          .dashboard-heading h1 {
            font-size: 29px;
          }

          .profile-card {
            padding: 22px;
          }

          .order-card {
            padding: 18px;
          }

          .ordered-product {
            gap: 12px;
          }

          .ordered-product img {
            width: 70px;
            height: 90px;
          }

          .order-statuses {
            align-items: flex-start;
          }
        }

        @media (max-width: 360px) {
          .account-header {
            padding: 0 13px;
          }

          .brand-logo {
            font-size: 18px;
            letter-spacing: 4px;
          }

          .continue-link {
            font-size: 7px;
          }

          .auth-content {
            padding-left: 19px;
            padding-right: 19px;
          }

          .auth-heading h1 {
            font-size: 32px;
          }

          .visual-content h2 {
            font-size: 34px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
