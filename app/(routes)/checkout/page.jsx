"use client";
import { Textarea } from "@/components/UI/textarea";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useContext, useState } from "react";
import Title from "@/app/components/Title";
import { Input } from "@/components/UI/input";
import { CartContext } from "@/app/(context)/CartContext";
import {
  getUserCart,
  updateOrderDetails,
  placeOrder,
} from "@/app/(utils)/GlobalApi";
import { useUser } from "@clerk/nextjs";

import { toast } from "sonner";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { ArrowLeft } from "lucide-react";

const Checkout = () => {
  const params = useSearchParams();
  const { updateCart, setUpdateCart } = useContext(CartContext);
  const { user } = useUser();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(5);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getUserCarts = () => {
    getUserCart(user?.primaryEmailAddress.emailAddress).then((res) => {
      setCart(res?.userCarts);
      CalculateCartAmount(res?.userCarts);
    });
  };

  const CalculateCartAmount = (_cart) => {
    let total = _cart.reduce((acc, item) => acc + item.price, 0);
    setSubTotal(total);
    setTaxAmount(total * 0.05);
    setTotalAmount(total + total * 0.05 + deliveryCharges);
  };

  const placeOrders = () => {
    setLoading(true);
    const data = {
      email: user?.primaryEmailAddress.emailAddress,
      orderAmount: totalAmount,
      storeName: params.get("store"),
      userName: user.fullName,
      phone: phone,
      address: address,
      zipCode: zipCode,
    };
    placeOrder(data).then(
      (res) => {
        const resId = res?.createOrder?.id;
        if (resId) {
          cart.forEach((item) => {
            updateOrderDetails(
              item.productName,
              item.price,
              resId,
              user?.primaryEmailAddress.emailAddress
            ).then(
              () => {
                setLoading(false);
                toast("Order Placed Successfully");
                setUpdateCart((prev) => !prev);
                sendEmail();
                router.replace("/");
              },
              () => setLoading(false)
            );
          });
        }
      },
      () => setLoading(false)
    );
  };

  const sendEmail = async () => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.primaryEmailAddress.emailAddress }),
      });
      response.ok
        ? toast("Confirmation email sent")
        : toast("Error while sending email");
    } catch {
      toast("Error while sending email");
    }
  };

  useEffect(() => {
    user && getUserCarts();
  }, [user, updateCart]);

  return (
    <div>
      <div className="mb-16">
        <div className="max-padd-container py-10">
          <div className="flex flex-col xl:flex-row gap-20 xl:gap-28">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <Title title1={"Delivery"} title2={"Information"} />
              </div>
              <Input
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="text"
                placeholder="User Name"
                required
              />
              <Input
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="text"
                placeholder="Email Address"
                required
              />
              <Input
                onChange={(e) => setPhone(e.target.value)}
                name="phone"
                type="text"
                placeholder="Phone Number"
                required
              />
              <Input
                onChange={(e) => setZipCode(e.target.value)}
                name="zipcode"
                type="text"
                placeholder="Zip Code"
                required
              />
              <Textarea
                onChange={(e) => setAddress(e.target.value)}
                name="address"
                placeholder="Address"
                required
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="my-6">
                <Title title1={"Cart"} title2={"Total"} titleStyles={"h3"} />
                <h3 className="bold-20 relative md:top-1">{cart?.length}</h3>
                <div className="flexBetween pt-3">
                  <h5 className="h5">SubTotal:</h5>
                  <p className="h5">${subTotal.toFixed(2)}</p>
                </div>
                <div className="flexBetween pt-3">
                  <h5 className="h5">Delivery Charges:</h5>
                  <p className="h5">${deliveryCharges}</p>
                </div>
                <div className="flexBetween pt-3">
                  <h5 className="h5">Tax Amount (5%):</h5>
                  <p className="h5">${taxAmount.toFixed(2)}</p>
                </div>
                <div className="flexBetween pt-3">
                  <h5 className="h5">Total:</h5>
                  <p className="h5">${totalAmount.toFixed(2)}</p>
                </div>
                {totalAmount > 5 && (
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    onApprove={placeOrders}
                    createOrder={(data, action) =>
                      action.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: totalAmount.toFixed(2),
                              currency_code: "USD",
                            },
                          },
                        ],
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
