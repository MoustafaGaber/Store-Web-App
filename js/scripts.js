import { toggelTheme, loader, getProducts,getCategories } from "./modules.js";


// Call the function to set up theme toggling
toggelTheme();

// Get spinner controller
const spinner = loader();

// --- Query DOM once and reuse (may be null on cart page) ---
const container = document.getElementById("products-container");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const searchInput = document.getElementById("searchInput");

//-------------------------------------------------------
// get products and render them

let products = [];
let categories = [];
async function init() {
  try {
    spinner.on();
    const productsRes = await getProducts();
    products = productsRes.products;
    // console.log(products);
    // console.log("Products fetched successfully ");

    // fill category filter (resets options and populates) only if filter exists
    categories = getCategories(products);
    if (categoryFilter) {
      fillCategoryFilter(categories);
    }

    // if we have filters / search on page, apply saved state & listeners (see below)
    // Render products only if container present
    if (container) {
      // Use filterAndSortProducts to apply saved sort/filter/search before rendering
      //applySavedState();
      filterAndSortProducts();
    } 
  } catch (error) {
    console.error("Failed to fetch products:", error);
    Swal.fire({
    icon: "error",
    title: "Error...",
    text: "حدثت مشلكة اثناء جلب البيانات!",
    footer: '<a href="#">Contact Us?</a>'
});
  } finally {
    setTimeout(() => { spinner.off(); }, 1000);
  }
}
init();

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

// ----------------- Cart utilities -------------------
// initialize cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// safely update cart count in the navbar (may not exist on all pages)
function updateCartCount() {
  //guard operator
  const countElement = document.getElementById("cart-count");
  if (!countElement) return;
  countElement.textContent = String(cart.length);
 }

//======================== Add to Cart Logic ==========================

// use a function declaration so it is available when attaching listeners

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    Swal.fire({
      title: "المنتج موجود بالفعل",
      text: `${product.title} موجود بالفعل داخل السلة`,
      icon: "info",
      confirmButtonText: "تمام",
    });
    return;
  }

  cart.push({...product, quantity: 1});
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  Swal.fire({
    title: "تم إضافة المنتج!",
    text: `${product.title} تمت إضافته إلى السلة بنجاح`,
    icon: "success",
    confirmButtonText: "تمام",
  });
}

// make sure to show current count on page load
updateCartCount();

// Retreive Data
function displayProducts(list) {
  // guard: skip if no container exists
  if (!container) {
    console.warn("displayProducts: no container present on this page");
    return;
  }

  container.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
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
          <!-- removed inline onclick and added data attribute instead -->
          <button class="add-to-cart" >
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="wishlist-btn">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    `;

    container.appendChild(productCard);

    // attach event listener to the button (if present)
    const addBtn = productCard.querySelector(".add-to-cart");
    if (addBtn) {
      addBtn.addEventListener("click", () => addToCart(product.id));
    }
  });
}


//----------------fill category filter---------------------------------------
function fillCategoryFilter(list) {
  const select = categoryFilter; // use the globally queried variable
  if (!select) return;

  // 1. قراءة القيمة المحفوظة أولاً
  const savedCategory = localStorage.getItem("preferedcategory");

  // 2. مسح القائمة بالكامل
  select.innerHTML = "";

  // 3. إضافة خيار "All Categories" أولاً
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  select.appendChild(allOption);

  // 4. إضافة خيارات الفئات الأخرى
  list.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // 5. تعيين القيمة المحفوظة مباشرة (سيتم تجاهلها إذا لم تكن موجودة)
  if (savedCategory && Array.from(select.options).some(o => o.value === savedCategory)) {
    select.value = savedCategory;
  } else {
    // 6. ضمان تعيين "all" إذا لم يكن هناك أي شيء محفوظ
    select.value = "all";
  }
}

//------------------filter and Sort And search products -----------------------------

const savedSort = localStorage.getItem("preferedsort");

if (sortFilter && savedSort) {
  sortFilter.value = savedSort;
}
/*
// Helper: apply saved category/sort values (safe)
// to be called on page load and fix localStorage values

function applySavedState() {
  const savedCat = localStorage.getItem("preferedcategory");
  const savedSortVal = localStorage.getItem("preferedsort");
  
  if (categoryFilter && savedCat && Array.from(categoryFilter.options).some(o => o.value === savedCat)) {
    categoryFilter.value = savedCat;
  }
  if (sortFilter && savedSortVal && Array.from(sortFilter.options).some(o => o.value === savedSortVal)) {
    sortFilter.value = savedSortVal;
  }
}
*/
// فلترة + بحث + ترتيب
function filterAndSortProducts() {
  // if (!Array.isArray(products)) return;
  if(!products) return;

  let filtered = products;

  // 1) البحث
  const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";
  // const searchValue=searchInput?.value?.toLowerCase()?.trim() ?? "";
  filtered = filtered.filter((p) =>
    p.title.toLowerCase().includes(searchValue)
  );

  // 2) فلتر حسب الفئة اذا كان موجود
  const selectedCategoryVal = categoryFilter ? categoryFilter.value : "all";
  if (selectedCategoryVal !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategoryVal);
  }

  // 3) الترتيب
  const sortValue = sortFilter ? sortFilter.value : "featured";
  if (sortFilter) localStorage.setItem("preferedsort", sortValue);

  if (sortValue === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // save category if user changed it
  if (categoryFilter) {
    localStorage.setItem("preferedcategory", categoryFilter.value);
  }

  // display only if container exists
  if (container) {
    displayProducts(filtered);
  }
}

// Events (attach only if elements exist)
if (searchInput) searchInput.addEventListener("input", filterAndSortProducts);
if (categoryFilter) categoryFilter.addEventListener("change", () => {
  localStorage.setItem("preferedcategory", categoryFilter.value);
  filterAndSortProducts();
});
if (sortFilter) sortFilter.addEventListener("change", filterAndSortProducts);


