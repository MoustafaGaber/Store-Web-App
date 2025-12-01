// Dark Mode and Light Mode
export const toggelTheme = () => {
 const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle ? themeToggle.querySelector("i") : null;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  // ensure correct classes are set
  body.classList.add("dark");
  body.classList.remove("light");
  if (icon) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
} else {
  // default to light
  body.classList.add("light");
  body.classList.remove("dark");
  if (icon) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light")) {
      body.classList.replace("light", "dark");
      if (icon) {
        // show sun icon when dark (clicking will go to light)
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.replace("dark", "light");
      if (icon) {
        // show moon icon when light (clicking will go to dark)
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
      localStorage.setItem("theme", "light");
    }
  });
}

}
 //loder
export const loader = () => {
  const spinner = document.getElementById("loader");
  return {
    //methods object
    on: function() {
      spinner?.classList.add("active");
    },
    //shorthand of off: function()
    off() {
      spinner?.classList.remove("active");
    },
  };
}




// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });


export async function getProducts() {
  const res = await fetch("https://dummyjson.com/products?limit=2000");
  const data = await res.json();
   
   return data;
}

    //show messag alert 
//     Swal.fire({
//   title: "Sweet!",
//   text: "Modal with a custom image.",
//   icon: "success",
//   confirmButtonText: "OK"
// });