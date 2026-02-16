document.addEventListener("DOMContentLoaded", async () => {
  // Get product ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    console.error("No product ID provided");
    return;
  }

  // Fetch products data
  try {
    const response = await fetch("products.json");
    const data = await response.json();
    const product = data.products[productId];

    if (!product) {
      console.error("Product not found");
      return;
    }

    // Update page title
    document.title = `Product - ${product.name}`;

    // Update breadcrumb with category
    const breadcrumb = document.querySelector(".breadcrumb");
    breadcrumb.innerHTML = `
      <li><a href="index.html">Home</a></li>
      <li><a href="category1.html">${product.category}</a></li>
      <li>${product.name}</li>
    `;

    // Update category bar
    const categoryBar = document.querySelector(".category-bar");
    categoryBar.innerHTML = `
      <ul>
        <li><a href="category1.html" class="active">${product.category}</a></li>
      </ul>
    `;

    // Update Swiper slides
    const swiperWrapper = document.querySelector(".swiper-wrapper");
    swiperWrapper.innerHTML = product.images
      .map(
        (img, index) =>
          `<div class="swiper-slide"><img src="images/${img}" alt="${product.name} - View ${index + 1}" /></div>`
      )
      .join("");

    // Update product info
    const productName = document.querySelector(".product-info h2");
    const productPrice = document.querySelector(".product-info .price");
    const productDesc = document.querySelector(".product-info .description");

    productName.textContent = product.name;
    productPrice.textContent = `$${product.price.toFixed(2)}`;
    productDesc.textContent = product.description;

    // Update shopping list
    const shoppingList = document.querySelector(".shopping-list ul");
    shoppingList.innerHTML = `
      <li>
        <img src="images/${product.images[0]}" alt="${product.name}" class="cart-item-img" />
        <div class="cart-item-details">
          <span>${product.name}</span>
          <input type="number" value="1" min="1" />
          <span class="item-price">@ $${product.price.toFixed(2)}</span>
        </div>
      </li>
    `;

    // Initialize Swiper after content is loaded
    setTimeout(() => {
      const swiper = new Swiper(".product-swiper", {
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
      });
    }, 100);
  } catch (error) {
    console.error("Error loading product data:", error);
  }
});
