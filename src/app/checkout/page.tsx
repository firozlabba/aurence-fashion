
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type CartItem = {
  id: string | number;
  name: string;
  category?: string;
  price: number;
  image?: string;
  size?: string;
  colour?: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    utr: "",
  });

  useEffect(() => {
    async function loadCheckout() {
      const savedCart = localStorage.getItem("aurence-cart");

      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        } catch {
          setCart([]);
        }
      }

      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setForm((previous) => ({
          ...previous,
          name: data.user.user_metadata?.full_name || "",
          email: data.user.email || "",
          phone: data.user.user_metadata?.phone || "",
        }));
      }

      setLoading(false);
    }

    loadCheckout();
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const upiLink =
    `upi://pay?pa=firozlabba-2@okicici` +
    `&pn=Firoz%20Labba` +
    `&am=${total.toFixed(2)}&cu=INR&tn=AURENCE%20Order`;

  const qrImage =
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=` +
    encodeURIComponent(upiLink);

  function updateField(field: string, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function submitOrder(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    if (!form.utr.trim()) {
      setError("Please enter your UPI transaction reference.");
      return;
    }

    if (
      !Number.isFinite(total) ||
      total <= 0 ||
      cart.some(
        (item) =>
          !Number.isFinite(Number(item.price)) ||
          Number(item.price) < 0 ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) < 1
      )
    ) {
      setError("Your cart contains invalid product information.");
      return;
    }

    setSubmitting(true);

    try {
      // Check the logged-in customer
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(
          "Please log in to your AURENCE account before placing an order."
        );
        setSubmitting(false);
        return;
      }

      // Save the main order
      const { data: savedOrder, error: orderError } =
        await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            customer_name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
            total: total,
            payment_method: "UPI",
            payment_reference: form.utr.trim(),
            payment_status: "pending_verification",
            order_status: "pending",
          })
          .select("id")
          .single();

      if (orderError || !savedOrder) {
        throw new Error(
          orderError?.message || "Unable to save your order."
        );
      }

      // Save all products belonging to this order
      const orderItems = cart.map((item) => ({
        order_id: savedOrder.id,
        product_id: String(item.id),
        product_name: item.name,
        category: item.category || null,
        price: Number(item.price),
        image: item.image || null,
        size: item.size || null,
        colour: item.colour || null,
        quantity: Number(item.quantity),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw new Error(
          `Order #${savedOrder.id} was created, but saving its products failed: ${itemsError.message}. Please contact the store administrator before retrying.`
        );
      }

      // Only clear cart after both database operations succeed
      localStorage.removeItem("aurence-cart");

      setOrderNumber(String(savedOrder.id));
      setCart([]);
      setSubmitted(true);
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    border: "1px solid #ded8ce",
    background: "#fff",
    color: "#30231f",
    fontSize: "14px",
    outline: "none",
    marginTop: "7px",
    boxSizing: "border-box",
  };

  if (loading) {
    return (
      <main style={{ padding: 60, textAlign: "center" }}>
        Loading checkout...
      </main>
    );
  }

  if (submitted) {
    return (
      <main
        style={{
          minHeight: "80vh",
          background: "#F7F4EE",
          padding: "80px 20px",
          textAlign: "center",
          color: "#30231F",
        }}
      >
        <div style={{ maxWidth: 550, margin: "auto" }}>
          <div style={{ fontSize: 48, color: "#A58A61" }}>
            ✓
          </div>

          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 38,
            }}
          >
            Thank You
          </h1>

          <p>Your order has been saved successfully!</p>

          <p style={{ fontSize: 14, color: "#8a6c46" }}>
            Order Number: AUR-{orderNumber}
          </p>

          <p style={{ color: "#8a6c46", fontSize: 14 }}>
            Your UPI payment is awaiting manual verification.
            No automatic payment confirmation has taken place.
          </p>

          <Link
            href="/account"
            style={{
              display: "inline-block",
              marginTop: 25,
              background: "#54232D",
              color: "white",
              padding: "15px 28px",
              textDecoration: "none",
            }}
          >
            GO TO MY ACCOUNT
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main
        style={{
          minHeight: "70vh",
          background: "#F7F4EE",
          padding: 70,
          textAlign: "center",
          color: "#30231F",
        }}
      >
        <h1 style={{ fontFamily: "Georgia, serif" }}>
          Your bag is empty
        </h1>

        <Link href="/shop" style={{ color: "#54232D" }}>
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main
      style={{
        background: "#F7F4EE",
        minHeight: "100vh",
        padding: "55px 20px 90px",
        color: "#30231F",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 45 }}>
          <Link
            href="/"
            style={{
              color: "#30231F",
              textDecoration: "none",
              fontFamily: "Georgia, serif",
              fontSize: 30,
              letterSpacing: 7,
            }}
          >
            AURENCE
          </Link>

          <p
            style={{
              letterSpacing: 3,
              fontSize: 11,
              color: "#927d65",
            }}
          >
            CHECKOUT
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(290px, 1fr))",
            gap: 35,
          }}
        >
          <section>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: 400,
              }}
            >
              Delivery Details
            </h2>

            <form onSubmit={submitOrder}>
              {[
                ["name", "Full Name", "text"],
                ["email", "Email Address", "email"],
                ["phone", "Phone Number", "tel"],
                ["address", "House / Street Address", "text"],
                ["city", "City", "text"],
                ["state", "State", "text"],
                ["pincode", "PIN Code", "text"],
              ].map(([field, label, type]) => (
                <label
                  key={field}
                  style={{
                    display: "block",
                    marginBottom: 17,
                    fontSize: 13,
                  }}
                >
                  {label}

                  <input
                    required
                    type={type}
                    value={form[field as keyof typeof form]}
                    onChange={(e) =>
                      updateField(field, e.target.value)
                    }
                    style={inputStyle}
                    placeholder={label}
                  />
                </label>
              ))}

              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: 400,
                  marginTop: 35,
                }}
              >
                Payment Details
              </h2>

              <div
                style={{
                  background: "white",
                  padding: 20,
                  textAlign: "center",
                  border: "1px solid #e5ded3",
                }}
              >
                <p style={{ fontSize: 13, letterSpacing: 1 }}>
                  SCAN & PAY USING ANY UPI APP
                </p>

                <img
                  src={qrImage}
                  alt="AURENCE UPI payment QR code"
                  style={{
                    width: 230,
                    maxWidth: "100%",
                    display: "block",
                    margin: "20px auto",
                  }}
                />

                <strong style={{ fontSize: 22 }}>
                  ₹{total.toLocaleString("en-IN")}
                </strong>

                <p style={{ fontSize: 13, color: "#77685a" }}>
                  UPI ID: firozlabba-2@okicici
                </p>

                <a
                  href={upiLink}
                  style={{
                    display: "inline-block",
                    background: "#54232D",
                    color: "white",
                    padding: "12px 20px",
                    textDecoration: "none",
                    marginTop: 10,
                  }}
                >
                  Pay with UPI App
                </a>
              </div>

              <label
                style={{
                  display: "block",
                  marginTop: 22,
                  fontSize: 13,
                }}
              >
                UPI Transaction Reference / UTR

                <input
                  required
                  value={form.utr}
                  onChange={(e) =>
                    updateField("utr", e.target.value)
                  }
                  style={inputStyle}
                  placeholder="Enter your payment reference number"
                />
              </label>

              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "#766b60",
                  marginTop: 15,
                }}
              >
                After paying, enter your UPI transaction reference
                and submit. Your order will remain pending until
                payment is manually verified.
              </p>

              {error && (
                <div
                  role="alert"
                  style={{
                    background: "#f8e9e7",
                    color: "#8a2929",
                    padding: 14,
                    marginTop: 18,
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  marginTop: 20,
                  padding: 17,
                  background: submitting ? "#927d65" : "#54232D",
                  color: "white",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  letterSpacing: 2,
                  fontSize: 12,
                }}
              >
                {submitting
                  ? "SAVING YOUR ORDER..."
                  : "SUBMIT ORDER DETAILS"}
              </button>
            </form>
          </section>

          <aside
            style={{
              background: "#EAE4D9",
              padding: 25,
              height: "fit-content",
            }}
          >
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: 400,
              }}
            >
              Order Summary
            </h2>

            {cart.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                style={{
                  display: "flex",
                  gap: 15,
                  padding: "16px 0",
                  borderBottom: "1px solid #d4cabc",
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 65,
                      height: 80,
                      objectFit: "cover",
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 13 }}>
                    {item.name}
                  </strong>

                  <p style={{ fontSize: 12, color: "#77685a" }}>
                    Size: {item.size || "-"} | Colour:{" "}
                    {item.colour || "-"}
                  </p>

                  <p style={{ fontSize: 13 }}>
                    Qty: {item.quantity}
                  </p>
                </div>

                <strong style={{ fontSize: 13 }}>
                  ₹
                  {(
                    Number(item.price) * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 25,
                fontSize: 17,
              }}
            >
              <strong>Total</strong>
              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>

            <p
              style={{
                fontSize: 11,
                color: "#766b60",
                marginTop: 12,
              }}
            >
              Shipping charges, if applicable, are not included.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
