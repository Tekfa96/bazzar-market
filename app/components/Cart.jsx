import { Button } from "@/components/UI/button";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  disconnectStoreFromCartItem,
  deleteCartItem,
  addToCartClothes,
  deleteManyCartItems,
  connectStoreToCartItem,
} from "../(utils)/GlobalApi";
import { toast } from "sonner";
import { CartContext } from "../(context)/CartContext";

const Cart = ({ cart }) => {
  const { updateCart, setUpdateCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});
  let updateCartTimeout;

  const { user } = useUser();
  const groupedCart = cart.reduce((acc, item) => {
    if (acc[item.productName]) {
      acc[item.productName].quantity += 1;
    } else {
      acc[item.productName] = { ...item, quantity: 1 };
    }
    return acc;
  }, {});
  const cartItems = Object.values(groupedCart);

  const calculateCartAmount = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const increaseQuantity = async (item) => {
    try {
      // Mise à jour immédiate pour une meilleure UX
      setQuantities((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] || 1) + 1,
      }));

      const { productName, productDescription, productImage, price, store } =
        item;

      const data = {
        email: user?.primaryEmailAddress?.emailAddress,
        name: productName,
        description: productDescription,
        productImage,
        price,
        storeSlug: store.slug,
        color: cart?.productColor?.[0] || null,
        size: cart?.productSize?.[0] || null,
      };

      // Vérifier si le store est connecté avant d'envoyer la requête
      const storeConnected =
        store.isConnected ?? (await connectStoreToCartItem());
      if (!storeConnected) {
        toast.error("Failed to connect store to cart item.");
        return;
      }

      // Ajout au panier
      const res = await addToCartClothes(data);
      if (!res) {
        toast.error("Failed to increase quantity.");
        return;
      }

      // Définir un délai pour éviter trop de mises à jour successives
      clearTimeout(updateCartTimeout);
      updateCartTimeout = setTimeout(() => {
        setUpdateCart((prev) => !prev);
      }, 500); // Délai de 500ms avant mise à jour
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error("An error occurred while increasing the quantity.");
    }
  };

  const decreaseQuantity = async (item) => {
    try {
      // Mise à jour immédiate pour une meilleure UX
      setQuantities((prev) => {
        const updatedQuantities = { ...prev };
        if (updatedQuantities[item.productName]) {
          updatedQuantities[item.productName] = Math.max(
            updatedQuantities[item.productName] - 1,
            0
          );
        }
        return updatedQuantities;
      });

      // Exécuter la déconnexion et suppression en parallèle
      const [isDisconnected, isDeleted] = await Promise.all([
        item.quantity === 1 ? disconnectStoreFromCartItem(item.id) : true,
        deleteCartItem(item.id),
      ]);

      if (!isDisconnected) {
        toast.error("Failed to disconnect store.");
        return;
      }

      if (!isDeleted) {
        toast.error("Failed to remove item from cart.");
        return;
      }

      // Définir un délai pour éviter trop de mises à jour successives
      clearTimeout(updateCartTimeout);
      updateCartTimeout = setTimeout(() => {
        setUpdateCart((prev) => !prev);
      }, 500); // Délai de 500ms avant mise à jour
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("An error occurred while removing the item.");
    }
  };

  const clearCart = async () => {
    try {
      await deleteManyCartItems();
      setTimeout(() => {
        setUpdateCart((prev) => !prev);
        toast.success("All items removed from cart!");
      }, 500);
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart.");
    }
  };

  return (
    <div>
      <h4 className="h4">My Order</h4>
      <div className="mt-5 flex flex-col gap-3">
        {cartItems.length > 0 ? (
          cartItems.map((item, i) => (
            <div key={i} className="flexBetween gap-2">
              <div className="flexBetween gap-2">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  width={44}
                  height={44}
                  className="h-[44px] w-[44px] rounded-lg object-cover"
                />
                <h5 className="h5">
                  {item.productName}{" "}
                  <span className="text-gray-500">x{item.quantity}</span>
                </h5>
                <div className="inline-flex gap-1.5 bg-primary/30 rounded-full ring-1 p-1 cursor-pointer">
                  <Minus
                    className="bg-white rounded-full p-1 ring-1 ring-primary/30 cursor-pointer"
                    onClick={() => decreaseQuantity(item)}
                  />
                  {item.quantity}
                  <Plus
                    className="bg-primary rounded-full p-1 ring-1 ring-primary cursor-pointer"
                    onClick={() => increaseQuantity(item)}
                  />
                </div>
              </div>
              <p className="h6 text-primary">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No product !</p>
        )}
        {cartItems.length > 0 && (
          <>
            <Link href={"/checkout?store=" + cart[0]?.store?.name}>
              <Button className="rounded-md w-full">
                Checkout ${calculateCartAmount()}
              </Button>
            </Link>
            <Button
              className="rounded-md w-full bg-red-500 hover:bg-red-600"
              onClick={clearCart}
            >
              Cancel All
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
