import { toggelTheme, loader, getProducts } from "./modules.js";

// Call the function to set up theme toggling
toggelTheme();

// Get spinner controller
const spinner = loader();

//-------------------------------------------------------
// get products and render them
let products = [];
async function init() {
  try {
    spinner.on();
    const productsRes = await getProducts();
     products = productsRes.products;
    console.log(products);
    console.log("Products fetched successfully ");
    // console.log('⭐'.repeat(5));
    // Render products 
   
    displayProducts(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    setTimeout(() => { spinner.off();}, 1000);
  }
}
init()
// ⭐ Generate Star Rating
function generateStarRating(rate) {
  let stars = "";
  const fullStars = Math.floor(rate);
  const halfStar = rate % 1 !== 0;  //3% 1 = 3

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  return stars;
}

const container = document.getElementById("products-container")

// Retreive Data
function displayProducts(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='font-size:18px'>No products found.</p>";
    return;
  }

  list.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.thumbnail}" alt="${product.title}">
      </div>

      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>

        <div class="product-rating">
          <div class="stars">
            ${generateStarRating(product.rating)}
          </div>
          
        </div>

        <div class="product-price">$${product.price}</div>

        <div class="product-actions">
          <button class="add-to-cart">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="wishlist-btn">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    `;

    container.appendChild(productCard);
  });
}
//-------------------------------------------------------




