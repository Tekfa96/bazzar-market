"use client";
import React, { Suspense } from "react";
import Header from "./(components)/header";
import { useState } from "react";
import { Toaster } from "sonner";
import { CartContext } from "./(context)/CartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Provider = ({ children }) => {
  const [updateCart, setUpdateCart] = useState(false);
  return (
    <>
      <PayPalScriptProvider
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
      >
        <CartContext.Provider value={{ updateCart, setUpdateCart }}>
          <Suspense fallback={<div>Loading ...</div>}>
            <Header />
            <Toaster />
            {children}
          </Suspense>
        </CartContext.Provider>
      </PayPalScriptProvider>
    </>
  );
};

export default Provider;
