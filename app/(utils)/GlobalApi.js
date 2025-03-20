import request, { gql } from "graphql-request";
const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_HYGRAPH_MUTATION_TOKEN;

// GET CATEGORY API REQUEST
const getCategories = async () => {
  const query = gql`
    query getCategories {
      categoryies(first: 40) {
        id
        name
        slug
        icon {
          url
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};
// GET STORE API REQUEST
const getStores = async (_category) => {
  const query = gql`
    query GetStores {
      stores(where: { categoryies_some: { slug: "${_category}" } }) {
        aboutUs
        address
        banner {
          url
        }
        categoryies {
          name
        }
           id
           name
          slug
        workingHours
        storeType
        review {
      star
    }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};
// GET STORE DETAILS API REQUEST
const getStoresDetails = async (storeSlug) => {
  const query = gql`
    query GetStoreDetails {
  store(where: {slug: "${storeSlug}"}) {
    aboutUs
    address
    banner {
      url
    }
    categoryies {
      name
    }
    id
    name
    slug
    workingHours
    storeType
    collection {
      ... on Collectione {
        id
        category
        collectionItem {
          ... on CollectionItem {
            id
            name
            description
            price
            productImage {
              url
            }
            productColor
            productSize
          }
        }
      }
    }
    review {
      star
    }
  }
}
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

// GET ADD TO CART API REQUEST
const addToCartClothes = async (data) => {
  const query = gql`
    mutation AddToCart {
  createUserCart(
    data: {email: "${data?.email}", price: ${data.price}, productDescription: "${data.description}", productImage: "${data.productImage}", productName: "${data.name}", store: {connect: {slug: "${data.storeSlug}"}}, productSize: ${data.size}, productColor: ${data.color}}
  ) {
    id
  }
  publishManyUserCarts {
    count
  }
}
  `;
  const result = await request(MASTER_URL, query);
  return result;
};
// GET ADD TO CART API REQUEST
const addToCartOtherProducts = async (data) => {
  const query = gql`
    mutation AddToCart {
  createUserCart(
    data: {email: "${data?.email}", price: ${data.price}, productDescription: "${data.description}", productImage: "${data.productImage}", productName: "${data.name}", store: {connect: {slug: "${data.storeSlug}"}}}
  ) {
    id
  }
  publishManyUserCarts {
    count
  }
}
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

// GET USER CART API REQUEST
const getUserCart = async (userEmail) => {
  const query = gql`
query GetUserCart {
  userCarts(where: {email: "${userEmail}"}) {
    id
    price
    productDescription
    productImage
    productName
    store {
      name
      banner {
        url
      }
      slug
    }
    productSize
    productColor
  }
}
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

// CONNECT STORE TO CART ITEM API
const connectStoreToCartItem = async () => {
  const query = gql`
    mutation ConnectStoreToCartItem {
      publishManyUserCarts(to: PUBLISHED) {
        count
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("GraphQL Error:", error.response || error.message);
  }
};
// DISCONNECT STORE FROM CARTITEM API REQUEST
const disconnectStoreFromCartItem = async (id) => {
  const query = gql`
    mutation DeconnectStoreFromCartItem {
      updateUserCart(data: { store: { disconnect: true } }, where: { id: "${id}" }) {
        id
      }
      publishManyUserCarts(to: PUBLISHED) {
        count
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

// DISCONNECT STORE FROM CARTITEM API REQUEST
const deleteCartItem = async (id) => {
  const query = gql`
    mutation DeleteCartItem {
      deleteUserCart(where: { id: "${id}" }) {
        id
      }
    }
  `;
  const headers = { Authorization: `Bearer ${AUTH_TOKEN}` };
  try {
    headers;
  } catch (error) {
    console.error("Error deleting Cart Item", error);
    throw error;
  }
  const result = await request(MASTER_URL, query, {}, headers);
  return result;
};

// DELETE MANY CARTIEMS
const deleteManyCartItems = async () => {
  const query = gql`
    mutation DeleteManyCartItems {
      deleteManyUserCarts {
        count
      }
    }
  `;
  const headers = { Authorization: `Bearer ${AUTH_TOKEN}` };
  try {
    headers;
  } catch (error) {
    console.error("Error deleting Cart Items", error);
    throw error;
  }
  const result = await request(MASTER_URL, query, {}, headers);
  return result;
};

// GET ADD NEW REVIEW  API REQUEST
const addNewReview = async (data) => {
  const query = gql`
    mutation AddNewReview {
      createReview(
        data: {
          email: "${data.email}"
          profileImage: "${data.profileImage}"
          reviewText: "${data.reviewText}"
          star: ${data.star}
          store: { connect: { slug: "${data.storeSlug}" } }
          userName: "${data.userName}"
        }
      ) {
        id
      }
      publishManyReviews(to: PUBLISHED){
        count
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};
// GET STORE REVIEWS  API REQUEST
const getStoreReviews = async (slug) => {
  const query = gql`
    query GetStoreReviews {
      reviews(where: { store: { slug: "${slug}" } }, orderBy: createdAt_DESC) {
        email
        id
        profileImage
        createdAt
        star
        userName
        reviewText
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

// GET STORE REVIEWS  API REQUEST
const placeOrder = async (data) => {
  const query = gql`
    mutation PlaceOrder {
      createOrder(
        data: {
          email: "${data.email}"
          orderAmount: ${data.orderAmount}
          storeName: "${data.storeName}"
          address: "${data.address}"
          phone: "${data.phone}"
          userName: "${data.userName}"
          zipCode: "${data.zipCode}"
        }
      ) {
        id
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

// UPDATE ORDER WITH ORDER ITEMS  API REQUEST
const updateOrderDetails = async (name, price, id, email) => {
  const query = gql`
    mutation UpdateOrderDetails {
      updateOrder(
        data: {
          orderDetail: {
            create: { OrderIteme: { data: { name: "${name}", price: ${price} } } }
          }
        }
        where: { id: "${id}" }
      ) {
        id
      }
      publishManyOrders(to: PUBLISHED){
    count
  }
     deleteManyUserCarts(where: {email: "${email}"}) {
    count
  }
    }
  `;
  const headers = { Authorization: `Bearer ${AUTH_TOKEN}` };
  try {
    headers;
  } catch (error) {
    console.error("Error in updating order", error);
    throw error;
  }
  const result = await request(MASTER_URL, query, {}, headers);
  return result;
};

// GET USER ORDERS  API REQUEST
const getUserOrders = async (email) => {
  const query = gql`
    query GetUserOrders {
      orders(where: { email: "${email}" }, orderBy: publishedAt_DESC) {
        address
        createdAt
        email
        id
        orderAmount
        orderDetail {
          ... on OrderIteme {
            id
            name
            price
          }
        }
        phone
        storeName
        userName
        zipCode
      }
   userCarts(where: {productImage: ""}) {
    productImage
  }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export {
  getCategories,
  getStores,
  getStoresDetails,
  addToCartClothes,
  addToCartOtherProducts,
  getUserCart,
  connectStoreToCartItem,
  disconnectStoreFromCartItem,
  deleteCartItem,
  deleteManyCartItems,
  addNewReview,
  getStoreReviews,
  placeOrder,
  updateOrderDetails,
  getUserOrders,
};
