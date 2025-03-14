"use client";
import React, { useEffect, useState } from "react";
import { getUserOrders } from "../(utils)/GlobalApi";
import { useUser } from "@clerk/nextjs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/accordion";

const MyOrders = () => {
  const { user } = useUser();
  const [orderList, setOrderList] = useState([]);
  const GetUserOrders = () => {
    getUserOrders(user?.primaryEmailAddress?.emailAddress).then((res) => {
      setOrderList(res?.orders);
      console.log(res);
    });
  };

  useEffect(() => {
    user && GetUserOrders();
  }, [user]);
  return (
    <div>
      <h4 className="h4">My Orders</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orderList.map((order, i) => (
          <div key={i}>
            <div className="p-3 ring-1 ring-slate-900/5">
              <div className="text-[14px] font-bold">
                <div>{new Date(order?.createdAt).toLocaleDateString()}</div>
              </div>
              <h5 className="h5 !font-normal">
                Total Amount : ${order.orderAmount.toFixed(2)}
              </h5>
              <h5 className="h5 !font-normal">
                Address : {order.address},{order.zipCode}
              </h5>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <p className="!text-red-500 underline">
                      View order Details
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {order?.orderDetails?.map((item, i) => (
                        <h5 key={i}>
                          <h5 className="h5">{item.name}</h5>
                          <p>${item.price}</p>
                        </h5>
                      ))}
                      <h5 className="h5 text-xs flexBetween">
                        Total (Including T&D):{" "}
                        <p className="pl-2">${order.orderAmount.toFixed(2)}</p>
                      </h5>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
