// Admin Panel JavaScript

// ==================== Tab Switching ====================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    
    // Remove active class from all buttons and contents
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked button and corresponding content
    btn.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load data for the tab
    if (tabName === 'products') {
      loadProducts();
      loadCategories();
    } else if (tabName === 'categories') {
      loadCategories();
    }
  });
});

// ==================== Message Display ====================
function showMessage(elementId, message, type = 'success') {
  const msgElement = document.getElementById(elementId);
  msgElement.textContent = message;
  msgElement.className = `message ${type}`;
  msgElement.style.display = 'block';
  
  setTimeout(() => {
    msgElement.style.display = 'none';
  }, 5000);
}

// ==================== PRODUCTS ====================

// Load and display all products
function loadProducts() {
  fetch('/api/products')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('products-container');
      
      if (!data || data.length === 0) {
        container.innerHTML = '<p>No products yet.</p>';
        return;
      }
      
      container.innerHTML = data.map(product => `
        <div class="product-item">
          <div style="display: flex; align-items: center; width: 100%;">
            ${product.thumbnail_url ? `<img src="${product.thumbnail_url}" alt="${product.name}" />` : ''}
            <div class="product-info">
              <strong>${product.name}</strong><br />
              <small>ID: ${product.pid} | Price: $${parseFloat(product.price).toFixed(2)} | Category ID: ${product.catid}</small><br />
              <small>${product.description}</small>
            </div>
          </div>
          <div class="item-actions">
            <button onclick="editProduct(${product.pid})">Edit</button>
            <button class="delete" onclick="deleteProduct(${product.pid})">Delete</button>
          </div>
        </div>
      `).join('');
    })
    .catch(err => console.error('Error loading products:', err));
}

// Edit product
function editProduct(pid) {
  fetch(`/api/products/${pid}`)
    .then(response => response.json())
    .then(product => {
      document.getElementById('product-id').value = product.pid;
      document.getElementById('product-category').value = product.catid;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-price').value = product.price;
      document.getElementById('product-description').value = product.description;
      
      // Scroll to form
      document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => console.error('Error loading product:', err));
}

// Delete product
function deleteProduct(pid) {
  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`/api/products/${pid}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        showMessage('product-message', data.message || 'Product deleted successfully', 'success');
        loadProducts();
      })
      .catch(err => {
        showMessage('product-message', 'Error deleting product', 'error');
        console.error('Error:', err);
      });
  }
}

// Handle product form submission
document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const pid = document.getElementById('product-id').value;
  const catid = document.getElementById('product-category').value;
  const name = document.getElementById('product-name').value;
  const price = document.getElementById('product-price').value;
  const description = document.getElementById('product-description').value;
  const imageFile = document.getElementById('product-image').files[0];
  
  // Validation
  if (!catid) {
    showMessage('product-message', 'Please select a category', 'error');
    return;
  }
  if (!name.trim()) {
    showMessage('product-message', 'Please enter a product name', 'error');
    return;
  }
  if (!price || parseFloat(price) < 0) {
    showMessage('product-message', 'Please enter a valid price', 'error');
    return;
  }
  if (!description.trim()) {
    showMessage('product-message', 'Please enter a description', 'error');
    return;
  }
  
  const formData = new FormData();
  formData.append('catid', catid);
  formData.append('name', name);
  formData.append('price', price);
  formData.append('description', description);
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  const url = pid ? `/api/products/${pid}` : '/api/products';
  const method = pid ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(url, { method, body: formData });
    const data = await response.json();
    
    if (!response.ok) {
      showMessage('product-message', data.error || 'Error saving product', 'error');
      return;
    }
    
    showMessage('product-message', pid ? 'Product updated successfully' : 'Product created successfully', 'success');
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    loadProducts();
  } catch (err) {
    showMessage('product-message', 'Error saving product', 'error');
    console.error('Error:', err);
  }
});

// ==================== CATEGORIES ====================

// Load and display all categories
function loadCategories() {
  fetch('/api/categories')
    .then(response => response.json())
    .then(data => {
      // Update category dropdown in products form
      const select = document.getElementById('product-category');
      const currentValue = select.value;
      const defaultOption = select.querySelector('option[value=""]');
      select.innerHTML = '';
      if (defaultOption) {
        select.appendChild(defaultOption);
      }
      
      data.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.catid;
        option.textContent = cat.name;
        select.appendChild(option);
      });
      
      if (currentValue) select.value = currentValue;
      
      // Display categories list in categories tab
      const container = document.getElementById('categories-container');
      
      if (!data || data.length === 0) {
        container.innerHTML = '<p>No categories yet.</p>';
        return;
      }
      
      container.innerHTML = data.map(cat => `
        <div class="category-item">
          <div class="category-info">
            <strong>${cat.name}</strong><br />
            <small>ID: ${cat.catid}</small>
          </div>
          <div class="item-actions">
            <button onclick="editCategory(${cat.catid})">Edit</button>
            <button class="delete" onclick="deleteCategory(${cat.catid})">Delete</button>
          </div>
        </div>
      `).join('');
    })
    .catch(err => console.error('Error loading categories:', err));
}

// Edit category
function editCategory(catid) {
  fetch(`/api/categories/${catid}`)
    .then(response => response.json())
    .then(category => {
      document.getElementById('category-id').value = category.catid;
      document.getElementById('category-name').value = category.name;
      
      // Scroll to form
      document.getElementById('category-form').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => console.error('Error loading category:', err));
}

// Delete category
function deleteCategory(catid) {
  if (confirm('Are you sure you want to delete this category? Associated products may also be deleted.')) {
    fetch(`/api/categories/${catid}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        showMessage('category-message', data.message || 'Category deleted successfully', 'success');
        loadCategories();
      })
      .catch(err => {
        showMessage('category-message', 'Error deleting category', 'error');
        console.error('Error:', err);
      });
  }
}

// Handle category form submission
document.getElementById('category-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const catid = document.getElementById('category-id').value;
  const name = document.getElementById('category-name').value;
  
  // Validation
  if (!name.trim()) {
    showMessage('category-message', 'Please enter a category name', 'error');
    return;
  }
  
  const data = { name };
  
  const url = catid ? `/api/categories/${catid}` : '/api/categories';
  const method = catid ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    
    if (!response.ok) {
      showMessage('category-message', result.error || 'Error saving category', 'error');
      return;
    }
    
    showMessage('category-message', catid ? 'Category updated successfully' : 'Category created successfully', 'success');
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    loadCategories();
  } catch (err) {
    showMessage('category-message', 'Error saving category', 'error');
    console.error('Error:', err);
  }
});

// Load initial data
window.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();
});
