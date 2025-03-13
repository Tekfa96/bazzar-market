import { Html } from "@react-email/components";
import * as React from "react";

export default function Email({ orderList }) {
  if (!orderList || orderList.length === 0) {
    return (
      <Html>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            margin: "20px",
            color: "#333",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#ffc107",
            }}
          >
            Order Confirmation
          </h2>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            No orders found.
          </p>
        </div>
      </Html>
    );
  }

  const uniqueAddress = orderList[0].address || "No address available";
  const uniqueZipCode = orderList[0].zipCode || "No zip code available";
  const productTotalPrice = orderList[0].orderAmount;
  const orderDetails = orderList[0].orderDetail || [];

  // Regrouper les produits par nom
  const groupedProducts = orderDetails.reduce((acc, item) => {
    if (acc[item.name]) {
      acc[item.name].quantity += 1;
      acc[item.name].totalPrice += item.price;
    } else {
      acc[item.name] = { ...item, quantity: 1, totalPrice: item.price };
    }
    return acc;
  }, {});

  return (
    <Html>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          margin: "20px",
          color: "#333",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#ffc107",
          }}
        >
          Order Confirmation
        </h2>
        <h3>
          Hello{" "}
          <span
            style={{
              textAlign: "center",
              color: "#ffc107",
            }}
          >
            {orderList[0].userName}
          </span>
        </h3>

        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Thank you for your order. Your order is confirmed and will be
          delivered shortly.
        </p>

        <p style={{ margin: "20px 0", fontWeight: "bold" }}>
          Delivery Information:
        </p>
        <p style={{ marginBottom: "20px" }}>
          Address: {uniqueAddress}, {uniqueZipCode}
        </p>
        <p style={{ color: "#ffc107" }}>Delivery Charges: $5</p>

        {/* Tableau des articles */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Item Name
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Quantity
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Price
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Tax Amount (5%)
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedProducts).map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  ${item.totalPrice.toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  ${parseFloat(((item.totalPrice * 5) / 100).toFixed(2))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <p style={{ fontWeight: "bold" }}>
          Total: ${productTotalPrice.toFixed(2)}
        </p>
      </div>
    </Html>
  );
}
