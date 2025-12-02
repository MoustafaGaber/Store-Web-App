// immediately restore theme from localStorage to keep visual consistency across pages
  (function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  })();



// ==================================== Cart Logic =============================================================

// جلب الـ cart من localStorage بشكل آمن
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// تحديث عداد السلة
const updateCartCount = () => {
  const countElement = document.getElementById("cart-count");
  if (!countElement) return; // guard: may not exist on all pages
  countElement.textContent = cart.length;
};

// عناصر DOM
const cartContainer = document.getElementById("cart-items");
const totalEl = document.getElementById("summaryy-total");

// عرض عناصر السلة
function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p style="font-size:18px; padding:20px;">Cart is empty.</p>`;
    totalEl.textContent = "$0.00";
    updateCartCount();
    return;
  }

  cart.forEach((item , index) => {
    const div = document.createElement("div");
    div.className = "cart-itemss";

    div.innerHTML = `
      <div class="product-infoo">
        <img src="${item.thumbnail}" alt="${item.title}" class="product-imagee" />
        <div class="product-detailss">
          <h3>${item.title}</h3>
          <p>${item.category}</p>
        </div>
      </div>

      <div class="pricee">$${item.price}</div>

      <div class="quantity-controlss">
        <button class="quantity-btns" onclick="decrease(${index})">
          <i class="fas fa-minus"></i>
        </button>

        <input type="text" class="quantity-inputs" value="${
          item.quantity || 1
        }" disabled />

        <button class="quantity-btns" onclick="increase(${index})">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <div class="price">
        <button class="remove-btns" onclick="removeItem(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    cartContainer.appendChild(div);
  });

  updateSummary();
  updateCartCount();
}

// تحديث الملخص
function updateSummary() {
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity ;
  }
  totalEl.textContent = `Total $${total.toFixed(2)}`;
}



// التحكم في الكمية
function decrease(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart[index].quantity = 1;
  }
  saveCart();
}

function increase(index) {
  cart[index].quantity = cart[index].quantity  + 1;
  saveCart();
}

// حذف عنصر من السلة
function removeItem(index) {
  const product = cart[index];
  Swal.fire({
    title: "هل تريد حذف المنتج؟",
    text: `${product.title} سيتم حذفه من السلة!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم",
    cancelButtonText: "لا",
  }).then((result) => {
    if (result.isConfirmed) {
      cart.splice(index, 1);
      saveCart();
      Swal.fire({
        title: "تم الحذف!",
        text: `${product.title} تم حذفه من السلة`,
        icon: "success",
        confirmButtonText: "تمام",
      });
    }
  });
}

// حفظ cart في localStorage وعرضها
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// تنفيذ أول مرة عند تحميل الصفحة
renderCart();
