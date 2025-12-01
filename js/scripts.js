import { toggelTheme, loader, getProducts,getCategories } from "./modules.js";

// Call the function to set up theme toggling
toggelTheme();

// Get spinner controller
const spinner = loader();

//-------------------------------------------------------
// get products and render them

let products = [];
let categories = [];
async function init() {
  try {
    spinner.on();
    const productsRes = await getProducts();
    products = productsRes.products;
    console.log(products);
    console.log("Products fetched successfully ");
    // Render products
    displayProducts(products);

    // fill category filter (resets options and populates)
    categories = getCategories(products);
    console.log('categories:', categories);
    fillCategoryFilter(categories)
    
   ;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    setTimeout(() => { spinner.off(); }, 1000);
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


//----------------fill category filter---------------------------------------
function fillCategoryFilter(list) {
  const select = document.getElementById("categoryFilter");
 

  // reset the select to default and avoid duplicates
  select.innerHTML = '<option value="all">All Categories</option>';

  
  
  list.forEach((cat) => {
    const option = document.createElement("option");
    
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
     
  });
 const savedCategory = localStorage.getItem("preferedcategory");
  if (savedCategory) {
    select.value = savedCategory;
  }
}

//------------------filter and Sort And search products -----------------------------

const categoryFilter = document.getElementById("categoryFilter");

const sortFilter = document.getElementById("sortFilter");
const searchInput = document.getElementById("searchInput");

const savedSort = localStorage.getItem("preferedsort");



if (savedSort) {
  sortFilter.value = savedSort;
}

// فلترة + بحث + ترتيب
function filterAndSortProducts() {
  let filtered = products;

  // 1) البحث
  const searchValue = searchInput.value.toLowerCase().trim();
  filtered = filtered.filter((p) =>
    p.title.toLowerCase().includes(searchValue)
  );

  // 2) الفئة (Category)
  //const selectedCategory = categoryFilter.value;

 

  if (categoryFilter.value !== "all") {
    filtered = filtered.filter((p) => p.category === categoryFilter.value);
    localStorage.setItem("preferedcategory", categoryFilter.value);
  }
   
  // 3) الترتيب
  const sortValue = sortFilter.value;
  localStorage.setItem("preferedsort", sortValue);

  if (sortValue === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  displayProducts(filtered);
}

// Events
searchInput.addEventListener("input", filterAndSortProducts);
categoryFilter.addEventListener("change", filterAndSortProducts);
sortFilter.addEventListener("change", filterAndSortProducts);

// أول تحميل
filterAndSortProducts();

