"use client";
import { UserProfile } from "@clerk/nextjs";
import { ShoppingBasket } from "lucide-react";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import MyOrders from "@/app/Components/MyOrders";
const User = () => {
  return (
    <div className="flexCenter">
      <UserProfile routing="hash">
        <UserButton.UserProfilePage
          label="My orders"
          labelIcon={<ShoppingBasket size={17} />}
          url="my-orders"
        >
          <MyOrders />
        </UserButton.UserProfilePage>
      </UserProfile>
    </div>
  );
};

export default User;
