const search = document.getElementById("searchInput");
const container = document.getElementById("products-container");
const openCart=document.querySelector(".cart");
const closeCart=document.querySelector(".close");
const body=document.querySelector("body");
const list=document.querySelector(".list");
let totalPrice = 0; 
const cartCountElement = document.getElementById("cart-count"); 
const totalPriceElement = document.getElementById("totalPrice");
const listCard = document.querySelector(".list-card"); 
let products = [];
const fetchProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    // to display products
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
const createProduct = (product) => {
  return `
  <div class="card" style="width: 20rem;">
     <img src="${product.image}" class="card-img-top" alt="...">
     <div class="card-body">
     <h5 class="card-title">${product.title}</h5>
     <p class="card-text">>${product.description}</p>
     <p class=" m-3 fs-3 text fw-semibold">Price: $${product.price}</p>
     <br>
     <a href="#" class="btn btn-primary w-100 p-3"  onclick="addToCart(${product.id})">Add To Cart</a>
     </div>
  </div>
       `;
};
const displayProducts = (products) => {
  elements = "";
  products.forEach((item) => {
    const product = createProduct(item);
    elements += product;
  });
  container.innerHTML = elements;
};
const searching = () => {
  const searchTerm = search.value.toLowerCase();
  var filtered = "";
  console.log(products);
  products.forEach((item) => {
    if (item.title.toLowerCase().includes(searchTerm)) {
      const product = createProduct(item);
      filtered += product;
    }
  });
  container.innerHTML = filtered;
};
// Call the fetch function on page load
fetchProducts();
//cart
//open the cart
openCart.addEventListener("click", () => {
  body.classList.add("active");
});
//close the cart 
closeCart.addEventListener("click", () => {
  body.classList.remove("active");
});
//add to cart 

let cart = [];

const addToCart = (productId) => {
  const item = products.find((product) => product.id === productId);
  
  if (item) {
    // Check if item already exists in cart
    const existingItem = cart.find((cartItem) => cartItem.id === productId);
    
    if (existingItem) {
      existingItem.quantity++; // Increase quantity if already in cart
    } else {
      cart.push({ ...item, quantity: 1 }); // Add new item with quantity This creates a copy of the item object. //Without this, modifying cart might also modify products, which is bad practice.
                                          
    }
    updateCart();
  }
};

const updateCart = () => {
  listCard.innerHTML = ""; // Clear previous cart items
  let total = 0;

  cart.forEach((product) => {
    total += product.price * product.quantity; // Calculate total price

    const card = `
      <div class="list-group-item d-flex align-items-center justify-content-between">
        <img src="${product.image}" alt="${product.title}" width="50">
        <h5 class="my-0">${product.title} (${product.quantity})</h5>
        <p class="my-0">$${(product.price * product.quantity).toFixed(2)}</p>
        <button class="btn btn-outline-danger" onclick="removeFromCart(${product.id})">Remove</button>
      </div>
    `;

    listCard.innerHTML += card;
  });

  cartCountElement.innerText = cart.reduce((sum, item) => sum + item.quantity, 0); 
  totalPriceElement.innerText = "$" + total.toFixed(2); 
};
//remove from cart

const removeFromCart = (productId) => {
  const index = cart.findIndex((product) => product.id === productId);

  if (index!== -1) {
    cart.splice(index, 1);
    totalPrice -= products[index].price;
    updateCart();
  }
};
//clear cart
const clearCart = () => {
  cart = [];
  totalPrice = 0;
  updateCart();
};

