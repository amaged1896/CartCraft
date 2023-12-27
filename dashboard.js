import { productsData } from "./productsData.js";

//----------- prepaire the UI
let usersSectionBtn = document.querySelector(".users");
let productsSectionBtn = document.querySelector(".products");
let usersBox = document.querySelector(".usersBox");
let productsBox = document.querySelector(".prodBox");
let UsersTbTitle = document.querySelector(".UsersTbTitle");
let productesTbTitle = document.querySelector(".productesTbTitle");
let productsTable = document.querySelector(".productsTable");
let usersTable = document.querySelector(".usersTable");

usersSectionBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  productsBox.style.display = "none";
  productesTbTitle.style.display = "none";
  productsTable.style.display = "none";
  usersBox.style.display = "flex";
  UsersTbTitle.style.display = "flex";
  usersTable.style.display = "inline-table";
});

productsSectionBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  productsBox.style.display = "flex";
  productesTbTitle.style.display = "flex";
  productsTable.style.display = "inline-table";
  usersBox.style.display = "none";
  UsersTbTitle.style.display = "none";
  usersTable.style.display = "none";
});

productsSectionBtn?.click();

// ---- users fields selection
let fName = document.getElementById("fnameBox");
let lName = document.getElementById("lNamebox");
let email = document.getElementById("email");
let phoneNumber = document.getElementById("phone");
let adminStatus = document.getElementById("adminBox");

let insUserBtn = document.getElementById("InsUserbtn");
let selUserBtn = document.getElementById("SelUserbtn");
let updUserBtn = document.getElementById("UpdUserbtn");
let delUserBtn = document.getElementById("DelUserbtn");

let usersTableBody = document.getElementById("usertbody");

let ShowUsersBtn = document.getElementById("showAllUsersbtn");

// Update Any Data
function updateData(collection, objTitle, Obj) {
  update(ref(realdb, `${collection}/${objTitle}`), Obj)
    .then(() => {
      alert("data Updated successfully");
    })
    .catch((error) => {
      alert(`Saving User unsucceeded, error ${error}`);
    });
}

// delete any Data
function deleteData(collection, objTitle) {
  remove(ref(realdb, `${collection}/${objTitle}`))
    .then(() => {
      alert("data Deleted successfully");
    })
    .catch((error) => {
      alert(`Deleting User unsucceeded, error ${error}`);
    });
}

// reset fields
function ResetProductAllFields() {
  Id.value = "";
  category.value = "";
  title.value = "";
  price.value = "";
  quantity.value = "";
  itemDesc.value = "";
  imgURL.value = "";
  myImg.src = "";
}
function RestUserAllFields() {
  fName.value = "";
  lName.value = "";
  email.value = "";
  phoneNumber.value = "";
}

//-------- Select or find user Data -------------//
function selectUserData() {
  let users = JSON.parse(localStorage.getItem("users"));
  let userEmailToFind = email.value;
  let isExist = users.findIndex((user) => user.email === userEmailToFind);
  if (isExist !== -1) {
    fName.value = users[isExist].firstName;
    lName.value = users[isExist].lastName;
    email.value = users[isExist].email;
    adminStatus.value = users[isExist].isAdmin;
    phoneNumber.value = users[isExist].phoneNumber;
  } else {
    alert("No data found");
  }
}

selUserBtn?.addEventListener("click", selectUserData);

//------ Update  user Data ----------//
function updateUserData() {
  // first select user
  if (email.value === "") {
    alert("Please Select User First");
    return;
  }
  let users = JSON.parse(localStorage.getItem("users"));
  let originalUserIndex = users.findIndex((user) => user.email === email.value);
  let originaluser = users.find((user) => user.email === email.value);
  let updatedUser;
  if (adminStatus.value == true || originaluser.isAdmin == false) {
    updatedUser = {
      firstName: fName.value,
      lastName: lName.value,
      password: originaluser.password,
      phoneNumber: phoneNumber.value,
      email: email.value,
      isAdmin: true,
      pendingOrders: [],
      approvedOrders: [],
    };
    console.log(adminStatus.value, updatedUser);
  } else {
    updatedUser = {
      firstName: fName.value,
      lastName: lName.value,
      email: email.value,
      password: originaluser.password,
      isAdmin: false,
      phoneNumber: phoneNumber.value,
      wishList: [],
      pendingOrders: [],
      previousOrders: [],
    };
    console.log(adminStatus.value, updatedUser);
  }

  users[originalUserIndex] = updatedUser;
  saveData("users", users);

  console.log(updatedUser);
  RestUserAllFields();
}

updUserBtn?.addEventListener("click", updateUserData);

//----- Delete User Data-------//

function DeleteUser() {
  let collection = "users";
  let Email = email.value;
  if (email.value === "") {
    alert("Please Select User First");
    return;
  }
  let users = JSON.parse(localStorage.getItem("users"));
  let originalUserIndex = users.findIndex((user) => user.email === email.value);

  users.splice(originalUserIndex, 1);
  saveData("users", users);
  // deleteData(collection, Email);
  RestUserAllFields();
}

delUserBtn?.addEventListener("click", DeleteUser);

///////////////////////////////////////////////////

function getAllUsersData(categoryName) {
  let users = JSON.parse(localStorage.getItem("users"));
  usersTableBody.innerHTML = "";
  users.forEach((user) => {
    let subRow = `
          <tr>
          <td>${user.firstName}</td>
            <td>${user.lastName}</d>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>${user.isAdmin}</td>

          </tr>
          `;
    usersTableBody.insertAdjacentHTML("beforeend", subRow);
  });
}

//////////////////////////////////////////////////
//------ show All Users items-----/
ShowUsersBtn?.addEventListener("click", function () {
  getAllUsersData("users");
});

////////////////////////////////////////////////////////////////

// Products CRUD
// Categories Products
// Products Form Selection
let Id = document.getElementById("itemId");
let title = document.getElementById("itemTitle");
let price = document.getElementById("itemPrice");
let itemDesc = document.getElementById("decriptionArea");
let category = document.getElementById("categories");
let imgURL = document.getElementById("itemImg");
let quantity = document.getElementById("itemQty");

let insItemBtn = document.getElementById("InsItembtn");
let selItemBtn = document.getElementById("SelItmbtn");
let updItemBtn = document.getElementById("UpdItmbtn");
let delItemBtn = document.getElementById("DelItmbtn");
//--show Categ Items--
let productsTableBody = document.getElementById("prodtbody");
let ShowCategItems = document.getElementById("showSelectedCategory");
let ShowAllItems = document.getElementById("ShowAllItems");
let selectedCateg = document.getElementById("showCategorie");
///////////////////////////////////////////////

// save data
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function generateNumericUniqueId() {
  const timestamp = Date.now().toString();
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;

  return timestamp + randomNumber;
}
insItemBtn?.addEventListener("click", async function () {
  let numericUniqueId = generateNumericUniqueId();
  let product = {
    id: Number(numericUniqueId),
    title: title.value,
    price: price.value,
    description: itemDesc.value,
    category: category.value,
    image: imgURL.value,
    quantity: quantity.value,
    rating: {
      rate: 3.9,
      count: 120,
    },
  };
  addProduct(product);
});

//////////////////////////////////////////////////////////

let imageNameBox = document.querySelector(".imageName");
let extLab = document.querySelector(".extLab");
let myImg = document.querySelector(".myImg");
let upProgress = document.querySelector(".upProgress");
let selImageBtn = document.querySelector(".selbtn");

let input = document.createElement("input");
input.type = "file";

selImageBtn?.addEventListener("click", function () {
  input.click();
});

// 2- select element from Category by id

function selectProductById(ItemId) {
  let allProducts = getAllProducts();
  let selectedProduct = allProducts.find(
    (product) => Number(product.id) === Number(ItemId)
  );

  if (selectedProduct !== -1) {
    Id.value = selectedProduct?.id || "Product not found";
    title.value = selectedProduct?.title || "";
    price.value = selectedProduct?.price || "";
    itemDesc.value = selectedProduct?.description || "";
    category.value = selectedProduct?.category || "";
    imgURL.value = selectedProduct?.image || "";
    quantity.value = selectedProduct?.quantity || 0;
    myImg.src = selectedProduct?.image || "";
  } else {
    console.log("Product is not exist");
  }
}

function selectProduct() {
  let id = Number(prompt("please Enter Product Id"));
  selectProductById(id);
}

selItemBtn?.addEventListener("click", selectProduct);
///////////////////////////////////////////
// 3- Update Product After Selecting by id
function updateProductData() {
  let id = Id.value;
  if (id === "") {
    alert("Please Select Item First");
    return;
  }
  let itemObj = {
    id: Number(Id.value),
    category: category.value,
    title: title.value,
    price: price.value,
    quantity: quantity.value,
    description: itemDesc.value,
    image: imgURL.value,
  };
  updateProduct(itemObj);
  ResetProductAllFields();
}

updItemBtn?.addEventListener("click", updateProductData);

//////////////////////////////////////////////
// Delete item by id
function DeleteProduct() {
  let id = Id.value;
  if (id === "") {
    alert("Please Select Item First");
    return;
  }
  let productCat = category.value;
  deleteProduct(id, productCat);
  ResetProductAllFields();
}

delItemBtn?.addEventListener("click", DeleteProduct);

//////////////////////////////////////////////////
//------ show Categogry items-----/
//--------- Print All cateogry Products-----------/
let printKey = true; ///to escape erase the table innerHTML or not
function displayCategoryItems(category) {
  printKey ? (productsTableBody.innerHTML = "") : "";
  category.forEach((item) => {
    let subRow = `
          <tr>
            <td>${item.id}</d>
            <td>${item.category}</td>
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td><a href=${item.image}><img src="${item.image}" style="width: 100px;height: 80px;"></a></td>
            <td>
            <button class='SelTableItemBtn${item.id}' value="${item.id}" >select</button>
          </td>
          </tr>
          `;
    productsTableBody.insertAdjacentHTML("beforeend", subRow);
    document
      .querySelector(`.SelTableItemBtn${item.id}`)
      ?.addEventListener("click", showSelectedProduct);
  });
}

function showSelectedProduct(e) {
  e.preventDefault();
  let id = e.target.value;
  ResetProductAllFields();
  selectProductById(id);
}
//---------------------
function getAllCategoryData(category) {
  let products = getProducts(category);
  let categoryItems = displayCategoryItems(products);
  return categoryItems;
}

//------ show selected category items-----/
ShowCategItems?.addEventListener("click", function () {
  printKey = true;
  productsTableBody.innerHTML = "";
  getAllCategoryData(selectedCateg.value);
});

//------ show All categories Items -------//

ShowAllItems?.addEventListener("click", showAllItems);

export function showAllItems() {
  let products = getAllProducts();
  productsTableBody.innerHTML = "";
  // let sortedProducts = products.sort((a, b) => a.category - b.category);
  displayCategoryItems(products);
}

// insert products to database
export function insertProductsIntoDB(products) {
  products.forEach((product) => {
    addProduct(product);
  });
}
// get all products
export function getAllProducts() {
  const categories = [
    "men's clothing",
    "jewelry",
    "electronics",
    "women's clothing",
  ];
  const allProducts = categories.flatMap((category) => {
    const items = JSON.parse(localStorage.getItem(category)) || [];
    return items.map((item) => ({ ...item, category }));
  });
  return allProducts;
}
getAllProducts();

export function updateProduct(updatedProduct) {
  let products = JSON.parse(localStorage.getItem(updatedProduct.category));

  // index
  let index = products.findIndex((element) => element.id === updatedProduct.id);

  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updatedProduct,
    };
    saveData(updatedProduct.category, products);
  } else {
    console.log("Product not found");
  }
  getAllCategoryData(updatedProduct.category);
}

export function deleteProduct(productId, category) {
  // get all products
  let products = JSON.parse(localStorage.getItem(category));

  // find the product
  let index = products.findIndex(
    (product) => Number(product.id) === Number(productId)
  );

  if (index !== -1) {
    products.splice(index, 1);

    // save the data
    saveData(category, products);
  } else {
    console.log("Product not found");
  }
  // attention here please !!!!
  getAllCategoryData(category);
}

export function getSingleProduct(productId, category) {
  // get all products
  let products = JSON.parse(localStorage.getItem(category));
  // find the product
  let product = products.find((product) => product.id === Number(productId));
  return product;
}

// get all products
export function getProducts(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
// add product
export function addProduct(product) {
  // get all products
  let products = getProducts(product.category) || [];
  // push new product
  products.push(product);
  productsData.push(product);
  // save data
  saveData(product.category, products);
}

export function addAllProducts(productsArray) {
  for (let product of productsArray) {
    // get all products
    let products = getProducts(product.category) || [];
    // push new product
    products.push(product);
    // save data
    saveData(product.category, products);
  }
}
