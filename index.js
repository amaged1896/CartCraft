import {
  generateNumericUniqueId,
  getAllProducts,
  addAllProducts,
  showAllItems,
} from "./dashboard.js";
import { productsData } from "./productsData.js";

let cartItems;
document.addEventListener("DOMContentLoaded", function () {
  let currentURL = window.location.href;
  let pageName = getPageName(currentURL);

  switch (pageName) {
    case "orders":
      displayOrdersTable();
      break;
    case "cart":
      displayCartItems();
      break;
    case "prevorders":
      displayPrevOrdersTable();
      break;
    case "dashboard":
      showAllItems();
      break;
    case "wishlist":
      displayWishListItems();
      break;
    case "index":
      displayAllCategItems();
      break;
    default:
      break;
  }
});

function getPageName(url) {
  let regexResult = /\/pages\/(\w+)\.html/.exec(url);
  return regexResult ? regexResult[1] : null;
}
let mensBtn = document.querySelector(".mensBtn");
let jewelryBtn = document.querySelector(".jewelryBtn");
let electronicsBtn = document.querySelector(".electronicsBtn");
let womensBtn = document.querySelector(".womensBtn");
let addOrderBtn = document.querySelector(".addOrderBtn");

// containers
let productBox = document.querySelector(".best-seller");
let productsTitle = document.querySelector(".productsTitle");
let ordersTable = document.querySelector(".ordersTable");
let previousTable = document.querySelector(".previousTable");

let dataContainer = document.getElementById("dataContainer");
cartItems = document.querySelector(".cartItems");
let price = document.querySelector(".price");
let wishitems = document.querySelector(".wishitems");
let addToCartFromWishList = document.querySelector(".addToCartFromWishList");

function fetchData() {
  let data = getAllProducts();
  return data;
}
let printAllCategProductsKey = false;
function getCategoriesData(category) {
  // to not clear the container when printing all categories products
  if (!printAllCategProductsKey) productBox.innerHTML = "";
  let data = JSON.parse(localStorage.getItem(category));

  productsTitle.innerHTML = `${category.toUpperCase()}`;
  data.forEach((product) => {
    let container = ` <div class="best-p1">
    <img src="${product.image}" alt="img">
    <div class="product-item best-p1-txt">
    <div class="name-of-p">
    <p>${product.title.split(" ").slice(0, 3).join(" ")}</p>
    </div>
    <div class="rating">
    <i class='bx bxs-star'></i>
    <i class='bx bxs-star'></i>
    <i class='bx bxs-star'></i>
    <i class='bx bx-star'></i>
    <i class='bx bx-star'></i>
    </div>
    <div class="price">
    &dollar;${product.price}
    <div class="colors">
    <i class='bx bxs-circle red'></i>
    <i class='bx bxs-circle blue'></i>
    <i class='bx bxs-circle white'></i>
    </div>
    </div>
    <div class="buy-now">
    <button value="${product.id}" class="btn${product.id}" >Add To Cart</button>
    <button value="${product.id}" class="wish wish${product.id
      }" >Add To Wishlist</button>
    </div>
    </div>
    </div>`;
    productBox.insertAdjacentHTML("beforeend", container);
    document
      .querySelector(`.btn${product.id}`)
      .addEventListener("click", addToCart);
    document
      .querySelector(`.wish${product.id}`)
      .addEventListener("click", addToWishList);
  });
}

function addToCart(e) {
  let products = fetchData();
  let id = Number(e.target.value);
  let product = products.find((element) => element.id == id);
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "https://amaged1896.github.io/CartCraft/signin";
  }

  user.shoppingCart = user.shoppingCart || [];
  user.shoppingCart.push(product);
  localStorage.setItem("user", JSON.stringify(user));
}

function addToWishList(e) {
  let products = fetchData();
  let id = Number(e.target.value);
  let product = products.find((element) => element.id == id);
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "https://amaged1896.github.io/CartCraft/signin";
  }
  user.wishList = user.wishList || [];
  user.wishList.push(product);
  localStorage.setItem("user", JSON.stringify(user));
}

addOrderBtn?.addEventListener("click", () => {
  let user = JSON.parse(localStorage.getItem("user"));
  placeOrder(user.shoppingCart);
});

jewelryBtn?.addEventListener("click", function (e) {
  getCategoriesData(e.target.value);
});
mensBtn?.addEventListener("click", function (e) {
  getCategoriesData(e.target.value);
});
womensBtn?.addEventListener("click", function (e) {
  getCategoriesData(e.target.value);
});
electronicsBtn?.addEventListener("click", function (e) {
  getCategoriesData(e.target.value);
});

// display all products all begining
function displayAllCategItems() {
  printAllCategProductsKey = true;
  mensBtn.click();
  jewelryBtn.click();
  electronicsBtn.click();
  womensBtn.click();
  printAllCategProductsKey = false;
  productsTitle.innerHTML = "All Categories Products";
}

let products;
async function displayData() {
  products = fetchData();
  let container = ``;

  for (let i = 0; i < products.length; i++) {
    container += `
      <div class="col-4">
        <img src="${products[i]?.image}" alt="" />
        <h4>${products[i]?.title}</h4>
        <p>${products[i]?.price}</p>
        <button onclick='addToWishList(${i})'>Wishlist</button>
        <button onclick='addToCart(${i})'>Add To Cart</button>
      </div>
      `;
  }
  dataContainer.innerHTML = container;
}

async function displayCartItems() {
  cartItems.innerHTML = ``;
  let user = JSON.parse(localStorage.getItem("user"));
  let cartProducts = user.shoppingCart;
  let total = 0;
  for (let i = 0; i < cartProducts?.length; i++) {
    total += cartProducts[i]?.price;
    let cartContainer = `
    <div class="col-4">
    <div class="view">
    <div class = "image">
    <img src="${cartProducts[i]?.image}" alt="" />
    </div>
    <div class="info">
    <p>Name : ${cartProducts[i]?.title}</p>
    <p>Category : ${cartProducts[i]?.category}</p>
    <p>Rating : ${cartProducts[i]?.rating.rate}</p>
    <p>Rating Count : ${cartProducts[i]?.rating.count}</p>
    </div>
    </div>
    <div class="price">
    <p>Price : $${cartProducts[i]?.price}</p>
    <button  class='removeBtn${i}' value="${i}">Remove</button>
    </div>
    </div>
    `;
    cartItems.insertAdjacentHTML("beforeend", cartContainer);
    document
      .querySelector(`.removeBtn${i}`)
      .addEventListener("click", removeProduct);
  }
  let totalElment = `<div class="total">Total<span>$${Math.round(
    total
  )}</span> </div>`;
  price.innerHTML = totalElment;
}

// display users products for admin
function displayOrdersTable() {
  ordersTable.innerHTML = ``;
  let user = JSON.parse(localStorage.getItem("user"));
  if (user.isAdmin !== true) {
    window.location.href = "https://amaged1896.github.io/CartCraft/index";
  }
  let orders = user.pendingOrders;

  for (let i = 0; i < orders?.length; i++) {
    let ordersContainer = `
    <tr class="items">
        <td>${orders[i].user.firstName}</td>
        <td>${orders[i].user.lastName}</td>
        <td>${orders[i].user.email}</td>
        <td>${orders[i].user.phone}</td>
        <td>
            <ul>
            ${orders[i].products
        .map((product) => {
          return `
      <li>${product.title.split(" ").splice(0, 3).join(" ")}</li>
      <br/>
      <li><img style="width: 50px;" src="${product.image}"></li>
      `;
        })
        .join("")}
            </ul>
        </td>
        <td>${orders[i].status}</td>
        <td>${orders[i].date}</td>
        <td>$${Math.round(orders[i].totalPrice)}</td>
        <td>
            <button value="${orders[i].id
      }" style="background-color:green"class="approveBtn${orders[i].id
      } btn">Approve</button>
            <button value="${orders[i].id
      }" style="background-color:red" class="declineBtn${orders[i].id
      } btn">Decline</button>
        </td>
    </tr>`;
    ordersTable.insertAdjacentHTML("beforeend", ordersContainer);
    document
      .querySelector(`.approveBtn${orders[i].id}`)
      .addEventListener("click", approveOrder);
    document
      .querySelector(`.declineBtn${orders[i].id}`)
      .addEventListener("click", declineOrder);
  }
}

function placeOrder(cart) {
  if (!localStorage.getItem("user") || !localStorage.getItem("users")) {
    console.error("User or Users data not found in localStorage.");
    return null; 
  }

  let user = JSON.parse(localStorage.getItem("user"));

  
  if (!user) {
    console.error("User not found in localStorage.");
    return null; 
  }

  let order = {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phoneNumber,
    },
    id: generateNumericUniqueId(),
    products: [...cart],
    status: "Pending",
    date: new Date().toLocaleDateString(),
    totalPrice: cart?.reduce((sum, product) => sum + (product.price || 0), 0),
  };

  let allUsers = JSON.parse(localStorage.getItem("users"));

  if (!allUsers) {
    console.error("Users data not found in localStorage.");
    return null;
  }

  let admin = allUsers.find((ele) => ele.isAdmin === true);

  if (!admin) {
    console.error("Admin not found in users data.");
    return null; 
  }

  // send the order to the admin
  admin.pendingOrders = admin.pendingOrders || [];
  admin.pendingOrders.push(order);

  // Update the admin's data in the allUsers array
  const adminIndex = allUsers.findIndex((ele) => ele.isAdmin === true);
  if (adminIndex !== -1) {
    allUsers[adminIndex] = admin;
  } else {
    console.error("Admin not found in users data.");
    return null; 
  }

  // Save the updated allUsers array back to local storage
  localStorage.setItem("users", JSON.stringify(allUsers));

  // Add the order to the user's order history
  user.previousOrders = user.previousOrders || [];
  user.previousOrders.push(order);

  // Clear the shopping cart
  user.shoppingCart = [];

  // Update user data in localStorage
  localStorage.setItem("user", JSON.stringify(user));
  displayCartItems();
  return order;
}

function approveOrder(e) {
  let id = Number(e.target.value);

  let allUsers = JSON.parse(localStorage.getItem("users"));
  let adminData = JSON.parse(localStorage.getItem("user"));

  let adminInAllUsers = allUsers.find((user) => user.isAdmin === true);

  // Find the index of the order in the adminData's pendingOrders array
  let orderIndex = adminData.pendingOrders.findIndex(
    (order) => Number(order.id) === Number(id)
  );
  let orderIndexInAdminInAllUsers = adminInAllUsers.pendingOrders.findIndex(
    (order) => Number(order.id) === Number(id)
  );

  if (orderIndex !== -1) {
    // Find the user with the matching email in allUsers
    let userEmail = adminData.pendingOrders[orderIndex].user.email; // normal user
    let userIndex = allUsers.findIndex((user) => user.email === userEmail);

    if (userIndex !== -1) {
      allUsers[userIndex].previousOrders.push(
        adminData.pendingOrders[orderIndex]
      ); // push in normal user

      // Move the order from pendingOrders to approvedOrders in admin data
      adminInAllUsers.approvedOrders.push(adminData.pendingOrders[orderIndex]);

      // Remove the order from pendingOrders in admin data
      adminData.pendingOrders.splice(orderIndex, 1);
      adminInAllUsers.pendingOrders.splice(orderIndexInAdminInAllUsers, 1);

      // Save the updated allUsers array and adminData back to local storage
      localStorage.setItem("users", JSON.stringify(allUsers));
      localStorage.setItem("user", JSON.stringify(adminData));

      // Display the updated orders table
      displayOrdersTable();
    } else {
      console.error("User not found.");
    }
  } else {
    console.error("Order not found in pendingOrders.");
  }
}

function declineOrder(e) {
  let id = Number(e.target.value);

  let allUsers = JSON.parse(localStorage.getItem("users"));
  let adminData = JSON.parse(localStorage.getItem("user"));
  let admin = allUsers.find((user) => user.isAdmin === true);

  let adminIndex = admin.pendingOrders.findIndex((order) => order.id === id);
  let orderIndex = adminData.pendingOrders.findIndex(
    (order) => order.id === id
  );
  admin.pendingOrders.splice(adminIndex, 1);
  adminData.pendingOrders.splice(orderIndex, 1);

  // Update the admin's data in the allUsers array
  allUsers[adminIndex] = admin;
  adminData.pendingOrders[orderIndex] = admin;

  // Save the updated allUsers array back to local storage
  localStorage.setItem("users", JSON.stringify(allUsers));
  localStorage.setItem("user", JSON.stringify(adminData));

  displayOrdersTable();
}

function displayOrderHistory() {
  let user = JSON.parse(localStorage.getItem("user"));
  return user.orderHistory || [];
}

function removeProduct(e) {
  let index = Number(e.target.value);
  console.log(e.target.value);
  let data = JSON.parse(localStorage.getItem("user"));
  let cartProducts = data.shoppingCart;
  console.log(cartProducts);
  cartProducts.splice(index, 1);
  data.shoppingCart = [...data.shoppingCart] || [];
  localStorage.setItem("user", JSON.stringify(data));
  displayCartItems();
}

function logout() {
  localStorage.removeItem("user");
  document.querySelector(".log-out").style.display = "none";
  document.querySelector(".signedIn").style.display = "block";
  window.location.href = "https://amaged1896.github.io/CartCraft/index";
}

function displayPrevOrdersTable() {
  previousTable.innerHTML = ``;
  let user = JSON.parse(localStorage.getItem("user"));
  let orders = user.previousOrders;

  for (let i = 0; i < orders?.length; i++) {
    let previousContainer = `
    <tr>
    <td>
    <ul>
    ${orders[i].products
        .map((product) => {
          return `
      <li>${product.title.split(" ").splice(0, 3).join(" ")}</li>
      <br/>
      <li><img style="width: 50px;" src="${product.image}"></li>
      `;
        })
        .join("")}
    </ul>
    </td>
    <td>${orders[i].date}</td>
    <td>${orders[i].totalPrice}</td>
    </tr>`;
    previousTable.insertAdjacentHTML("beforeend", previousContainer);
  }
}

if (localStorage.getItem("user")) {
  document.querySelector(".log-out").style.display = "block";
  document.querySelector(".signedIn").style.display = "none";
}
document.querySelector(".log-out")?.addEventListener("click", logout);

(function () {
  let allProducts = fetchData();
  console.log(allProducts);
  if (!allProducts.length) {
    addAllProducts(productsData);
  }
})();

(function () {
  // retrieve the users data
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  // check user existence
  const isExist = existingUsers.findIndex((user) => user.isAdmin === true);
  if (isExist === -1) {
    const admin = {
      firstName: "Mohamed",
      lastName: "Ahmed",
      password: "admin123456",
      phoneNumber: "01221433211",
      email: "admin@gmail.com",
      isAdmin: true,
      pendingOrders: [],
      approvedOrders: [],
    };
    existingUsers.push(admin);
    localStorage.setItem("users", JSON.stringify(existingUsers));
  }
})();

async function displayWishListItems() {
  wishitems.innerHTML = ``;
  let user = JSON.parse(localStorage.getItem("user"));
  let wishProducts = user.wishList;
  let total = 0;
  for (let i = 0; i < wishProducts?.length; i++) {
    total += wishProducts[i]?.price;
    let wishContainer = `
    <div class="col-4">
    <div class="view">
    <div class = "image">
    <img src="${wishProducts[i]?.image}" alt="" />
    </div>
    <div class="info">
    <p>Name : ${wishProducts[i]?.title}</p>
    <p>Category : ${wishProducts[i]?.category}</p>
    <p>Rating : ${wishProducts[i]?.rating.rate}</p>
    <p>Rating Count : ${wishProducts[i]?.rating.count}</p>
    </div>
    </div>
    <div class="price">
    <p>Price : $${wishProducts[i]?.price}</p>
    <button  class='removewishbtn${i}' value="${i}">Remove</button>
    </div>
    </div>
    `;
    wishitems.insertAdjacentHTML("beforeend", wishContainer);
    document
      .querySelector(`.removewishbtn${i}`)
      .addEventListener("click", removeWishList);
  }
}

function removeWishList(e) {
  let index = Number(e.target.value);
  console.log(e.target.value);
  let data = JSON.parse(localStorage.getItem("user"));
  let wishProducts = data.wishList;
  wishProducts.splice(index, 1);
  data.wishList = [...data.wishList] || [];
  localStorage.setItem("user", JSON.stringify(data));
  displayWishListItems();
}

function wishListToCart(e) {
  let index = Number(e.target.value);
  let user = JSON.parse(localStorage.getItem("user"));
  let addToCart = user.shoppingCart.push(user.wishList[index]);
  addToCart.splice(index, 1);
  user.shoppingCart = [...user.shoppingCart] || [];
  localStorage.setItem("user", JSON.stringify(user));
  displayWishListItems();
}

addToCartFromWishList.addEventListener("click", function () {
  let user = JSON.parse(localStorage.getItem("user"));
  let wishlistitems = user.wishList;
  wishlistitems.forEach((item) => user.shoppingCart.push(item));
  wishlistitems.splice(0, wishlistitems.length);
  localStorage.setItem("user", JSON.stringify(user));
  displayWishListItems();
});
