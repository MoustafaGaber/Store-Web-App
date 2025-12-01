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
    filterAndSortProducts();
    
   ;
  } catch (error) {
    console.error("Failed to fetch products:", error);
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


//----------------fill category filter-
// --------------------------------------
//----------------fill category filter---------------------------------------
function fillCategoryFilter(list) {
  const select = document.getElementById("categoryFilter");
 
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
  if (savedCategory) {
    select.value = savedCategory;
  } else {
    // 6. ضمان تعيين "all" إذا لم يكن هناك أي شيء محفوظ
    select.value = "all";
  }
}


//------------------filter and Sort And search products -----------------------------

const categoryFilter = document.getElementById("categoryFilter");

const sortFilter = document.getElementById("sortFilter");
const searchInput = document.getElementById("searchInput");

const savedSort = localStorage.getItem("preferedsort");

// const savedCategory = localStorage.getItem("preferedCategory");


// if (savedCategory) {
//   categoryFilter.value = savedCategory;
// }

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

  if (categoryFilter.value !== "all") {
    filtered = filtered.filter((p) => p.category === categoryFilter.value);
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
categoryFilter.addEventListener("change", () => {
  //fixed saving category preference
  localStorage.setItem("preferedcategory", categoryFilter.value);
  filterAndSortProducts();
});
sortFilter.addEventListener("change", filterAndSortProducts);

// أول تحميل


