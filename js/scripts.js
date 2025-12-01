import { toggelTheme } from "./modules.js";
import { loader } from "./modules.js";
import {getProducts} from "./modules.js";


// Call the function to set up theme toggling
toggelTheme();

//get products
 const active=loader();
try {
 
  active.on;
  const products = await getProducts();
  console.log(products);
} catch (error) {
  
}finally{
    active.of;
}

const products = await getProducts();
console.log(products);
l



