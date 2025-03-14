import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import {
  disconnectStoreFromCartItem,
  deleteCartItem,
} from "../(utils)/GlobalApi";
import { toast } from "sonner";
import { CartContext } from "../(context)/CartContext";

const Cart = ({ cart }) => {
  const { updateCart, setUpdateCart } = useContext(CartContext);
  console.log(cart);

  const CaluclateCartAmount = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });
    return total.toFixed(2);
  };

  const removeItemFromCart = (id) => {
    disconnectStoreFromCartItem(id).then((res) => {
      //console.log(res);
      if (res) {
        deleteCartItem(id).then((res) => {
          console.log(res);
          toast("Item Removed");
          setUpdateCart((prev) => !prev);
        });
      }
    });
  };
  return (
    <div className="">
      <h4 className="h4">{cart[1]?.store?.name}</h4>
      <div className="mt-5 flex flex-col gap-3">
        <h5 className="h5">My Order</h5>
        {cart?.map((item, i) => (
          <div key={i} className="flexBetween gap-2">
            <div className="flexBetween gap-2">
              <Image
                src={item.productImage}
                alt={item.productName}
                width={33}
                height={40}
                className="h-[44px] w-[44px] rounded-lg object-cover"
              />
              <h5 className="h5">{item.productName}</h5>
            </div>
            <p className="h6">${item.price}</p>
            <X
              size={17}
              color="red"
              className="cursor-pointer"
              onClick={() => removeItemFromCart(item.id)}
            />
          </div>
        ))}
        <Link href={"/checkout?store=" + cart[0]?.store?.name}>
          <Button className="rounded-md w-full">
            Checkout{" "}
            <span className="text-[13px] font-bold">
              ${CaluclateCartAmount()}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
