// Dynamic loading of product details from database
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  
  if (productId) {
    loadProductDetails(productId);
  } else {
    document.querySelector('.product-info h2').textContent = 'Product not found';
  }
});

function loadProductDetails(productId) {
  // Try to parse as integer (from database)
  const numericId = parseInt(productId);
  
  fetch(`/api/products/${numericId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return response.json();
    })
    .then(product => {
      displayProduct(product);
    })
    .catch(err => {
      console.error('Error loading product:', err);
      document.querySelector('.product-info h2').textContent = 'Product not found';
      document.querySelector('.product-info p').textContent = 'The requested product could not be found.';
    });
}

function displayProduct(product) {
  // Update product title
  document.title = product.name;
  document.querySelector('.product-info h2').textContent = product.name;
  
  // Update price
  document.querySelector('.product-info .price').textContent = `$${parseFloat(product.price).toFixed(2)}`;
  
  // Update description
  document.querySelector('.product-info .description').textContent = product.description;
  
  // Update swiper with product images
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  swiperWrapper.innerHTML = '';
  
  // Add main image if available
  if (product.image_url) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${product.image_url}" alt="${product.name}" />`;
    swiperWrapper.appendChild(slide);
  }
  
  // Add thumbnail as fallback
  if (product.thumbnail_url && product.thumbnail_url !== product.image_url) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${product.thumbnail_url}" alt="${product.name}" />`;
    swiperWrapper.appendChild(slide);
  }
  
  // If no images, add placeholder
  if (!product.image_url && !product.thumbnail_url) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="/images/placeholder.jpg" alt="${product.name}" style="background: #f0f0f0; height: 400px; object-fit: contain;" />`;
    swiperWrapper.appendChild(slide);
  }
  
  // Initialize Swiper
  const swiper = new Swiper('.product-swiper', {
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
  
  // Update Add to Cart button
  document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    console.log('Added to cart:', product.pid);
    // This integrates with the existing cart functionality
  });
}
