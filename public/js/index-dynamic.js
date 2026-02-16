// Dynamic loading of categories and products from database
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();
});

// Load categories and populate navigation
function loadCategories() {
  fetch('/api/categories')
    .then(response => response.json())
    .then(categories => {
      const categoryList = document.getElementById('category-list');
      
      categories.forEach(category => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="index.html?catid=${category.catid}">${category.name}</a>`;
        categoryList.appendChild(li);
      });
    })
    .catch(err => console.error('Error loading categories:', err));
}

// Load products and populate grid
function loadProducts() {
  // Get category filter from URL query string
  const params = new URLSearchParams(window.location.search);
  const catid = params.get('catid');
  
  let url = '/api/products';
  if (catid) {
    url += `?catid=${catid}`;
  }
  
  fetch(url)
    .then(response => response.json())
    .then(products => {
      const grid = document.getElementById('product-grid');
      grid.innerHTML = '';
      
      if (!products || products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1;">No products available.</p>';
        return;
      }
      
      products.forEach(product => {
        const article = document.createElement('article');
        article.className = 'product';
        
        // Use thumbnail image if available, otherwise use original image URL
        const imageUrl = product.thumbnail_url || '/images/placeholder.jpg';
        
        article.innerHTML = `
          <a href="product.html?id=${product.pid}" class="product-link">
            <img src="${imageUrl}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p class="price">$${parseFloat(product.price).toFixed(2)}</p>
          </a>
          <button class="add-to-cart" data-product-id="${product.pid}">Add to Cart</button>
        `;
        
        grid.appendChild(article);
      });
      
      // Attach event listeners to "Add to Cart" buttons
      handleCartButtons();
    })
    .catch(err => console.error('Error loading products:', err));
}

// Handle "Add to Cart" button clicks
function handleCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      // This integrates with the existing cart functionality from script.js
      console.log('Add to cart:', productId);
    });
  });
}
