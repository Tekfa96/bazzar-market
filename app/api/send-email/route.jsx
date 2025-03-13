import { NextResponse } from "next/server";
import Email from "@/emails/index";
import { Resend } from "resend";
import { getUserOrders } from "@/app/(utils)/GlobalApi";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour supprimer les doublons d'adresse et de code postal
const removeDuplicateAddresses = (orders) => {
  const uniqueOrders = new Set();
  return orders.filter((order) => {
    const key = JSON.stringify({
      address: order.address,
      zipCode: order.zipCode,
    });
    if (!uniqueOrders.has(key)) {
      uniqueOrders.add(key);
      return true;
    }
    return false;
  });
};

export async function POST(req) {
  try {
    const response = await req.json();
    const email = response?.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Récupération des commandes et du panier
    const ordersData = await getUserOrders(email);

    let orders = ordersData?.orders || [];

    // Supprimer les adresses dupliquées
    orders = removeDuplicateAddresses(orders);

    // Fusionner commandes et panier
    const fullOrderList = [...orders];

    // Vérification que la liste n'est pas vide avant d'envoyer l'email
    if (fullOrderList.length === 0) {
      return NextResponse.json({ message: "No orders or cart items found" });
    }

    // Création du contenu de l'email
    const emailContent = <Email orderList={fullOrderList} />;

    // Envoi de l'email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Your Order & Cart Summary from Bazzar",
      react: emailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in sending email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
