import { Search, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/UI/button";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/popover";

import { CartContext } from "../(context)/CartContext";
import { getUserCart } from "../(utils)/GlobalApi";
import Cart from "./Cart";
const Header = () => {
  const { isSignedIn, user } = useUser();
  const { updateCart, setUpdateCart } = useContext(CartContext);
  const [cart, setCart] = useState([]);
  const getUserCarts = () => {
    getUserCart(user?.primaryEmailAddress.emailAddress).then((res) => {
      setCart(res?.userCarts);
      //console.log(res);
    });
  };
  useEffect(() => {
    //console.log("Executed..");
    user && getUserCarts();
  }, [updateCart, user]);
  return (
    <div className="max-padd-container flexBetween py-2">
      {/* LOGO */}
      <Link href={"/"} className="bold-24 uppercase flex flex-col">
        <span className="relative top-2">Bazzar</span>
        <span className="text-primary text-[11px] tracking-[3.5px]">
          Marketplace
        </span>
      </Link>
      {/* SEARCHBAR */}
      <div className="hidden md:flex rounded-full bg-white w-[444px] pl-6 ">
        <input
          type="text"
          placeholder="Type here..."
          className="bg-transparent w-full outline-none text-[14px]"
        />
        <Search className="cursor-pointer bg-primary rounded-full h-10 w-11 p-2.5 m-1" />
      </div>
      {/* USER PROFILE & BUTTON */}
      {isSignedIn ? (
        <div className="flex gap-8 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex gap-2 items-center cursor-pointer bg-white p-2 rounded-full relative ">
                <ShoppingBasket size={27} />
                <label className="absolute top-0 -right-2 px-1 rounded-full bg-primary text-xs font-semibold ">
                  {cart?.length}
                </label>
              </div>
            </PopoverTrigger>
            <PopoverContent className="mr-24 w-96">
              <Cart cart={cart} />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
                src={user?.imageUrl}
                alt="userImg"
                height={41}
                width={41}
                className="rounded-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"/user"}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href={"/user#/my-orders "}>
                <DropdownMenuItem>My Orders</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <SignOutButton>Logout</SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-5">
          <SignInButton mode="redirect">
            <Button variant="outline" className="border-none">
              Login
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button className="shadow-none">Sign Up</Button>
          </SignUpButton>
        </div>
      )}
    </div>
  );
};

export default Header;
