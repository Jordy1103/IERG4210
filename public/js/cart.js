/**
 * Shopping Cart Management System
 * Uses localStorage for persistence
 * Fetches product details from backend via AJAX
 */

class ShoppingCart {
  constructor() {
    this.items = new Map(); // pid -> { pid, qty, name, price, image_url }
    this.storageKey = 'shoppingCart';
    this.init();
  }

  /**
   * Initialize cart from localStorage
   */
  init() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.items = new Map(data);
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        this.items = new Map();
      }
    }
  }

  /**
   * Add product to cart
   * Fetches product details from backend if not already in cart
   */
  async addItem(pid, quantity = 1) {
    pid = parseInt(pid);
    quantity = parseInt(quantity);

    if (quantity <= 0) return false;

    if (this.items.has(pid)) {
      // Update quantity if product already exists
      const item = this.items.get(pid);
      item.qty += quantity;
      this.items.set(pid, item);
    } else {
      // Fetch product details from backend
      try {
        const response = await fetch(`/api/products/${pid}`);
        if (!response.ok) {
          console.error('Product not found:', pid);
          return false;
        }
        const product = await response.json();
        
        this.items.set(pid, {
          pid: pid,
          qty: quantity,
          name: product.name,
          price: product.price,
          image_url: product.image_url || product.thumbnail_url || '/images/placeholder.jpg'
        });
      } catch (e) {
        console.error('Error fetching product:', e);
        return false;
      }
    }

    this.save();
    return true;
  }

  /**
   * Remove item from cart
   */
  removeItem(pid) {
    pid = parseInt(pid);
    this.items.delete(pid);
    this.save();
  }

  /**
   * Update item quantity
   */
  updateQuantity(pid, quantity) {
    pid = parseInt(pid);
    quantity = parseInt(quantity);

    if (quantity <= 0) {
      this.removeItem(pid);
    } else if (this.items.has(pid)) {
      const item = this.items.get(pid);
      item.qty = quantity;
      this.items.set(pid, item);
      this.save();
    }
  }

  /**
   * Get total price of all items
   */
  getTotalPrice() {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.price * item.qty;
    }
    return total;
  }

  /**
   * Get total quantity of all items
   */
  getTotalQuantity() {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.qty;
    }
    return total;
  }

  /**
   * Get all items
   */
  getItems() {
    return Array.from(this.items.values());
  }

  /**
   * Get item by pid
   */
  getItem(pid) {
    pid = parseInt(pid);
    return this.items.get(pid);
  }

  /**
   * Clear entire cart
   */
  clear() {
    this.items.clear();
    this.save();
  }

  /**
   * Save cart to localStorage
   */
  save() {
    try {
      const data = Array.from(this.items);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }

  /**
   * Check if cart is empty
   */
  isEmpty() {
    return this.items.size === 0;
  }
}

/**
 * Shopping Cart UI Manager
 * Handles rendering and user interactions
 */
class ShoppingCartUI {
  constructor(cart) {
    this.cart = cart;
    this.cartContainer = document.querySelector('.shopping-list');
    this.cartToggleBtn = document.getElementById('cart-toggle-btn');
    this.cartList = this.cartContainer?.querySelector('ul');
    this.checkoutBtn = this.cartContainer?.querySelector('button');
    
    this.init();
  }

  init() {
    // Show toggle button if cart exists
    if (this.cartToggleBtn && this.cartContainer) {
      this.cartToggleBtn.style.display = 'block';
      this.setupToggle();
      this.render();
    }
  }

  /**
   * Setup toggle functionality
   */
  setupToggle() {
    this.cartToggleBtn.addEventListener('click', () => {
      const isVisible = this.cartContainer.style.display === 'block';
      this.cartContainer.style.display = isVisible ? 'none' : 'block';
      this.cartToggleBtn.textContent = isVisible ? 'Show Cart' : 'Hide Cart';
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      const clickedInsideCart = this.cartContainer?.contains(e.target);
      const clickedToggle = this.cartToggleBtn?.contains(e.target);
      
      if (!clickedInsideCart && !clickedToggle && this.cartContainer) {
        this.cartContainer.style.display = 'none';
        this.cartToggleBtn.textContent = 'Show Cart';
      }
    });
  }

  /**
   * Render cart UI
   */
  render() {
    if (!this.cartList) return;

    this.cartList.innerHTML = '';
    const items = this.cart.getItems();

    if (items.length === 0) {
      this.cartList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">Your cart is empty</li>';
    } else {
      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.dataset.pid = item.pid;
        
        const imageUrl = item.image_url || '/images/placeholder.jpg';
        const itemPrice = (item.price * item.qty).toFixed(2);
        
        li.innerHTML = `
          <img src="${imageUrl}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-controls">
              <button class="qty-btn decrement" data-pid="${item.pid}" title="Decrease quantity">−</button>
              <input type="number" class="qty-input" data-pid="${item.pid}" value="${item.qty}" min="1" />
              <button class="qty-btn increment" data-pid="${item.pid}" title="Increase quantity">+</button>
            </div>
            <div class="item-price">$${item.price.toFixed(2)} × ${item.qty} = $${itemPrice}</div>
          </div>
          <button class="delete-btn" data-pid="${item.pid}" title="Remove from cart">✕</button>
        `;
        
        this.cartList.appendChild(li);
      });
    }

    this.attachEventListeners();
    this.updateTotal();
  }

  /**
   * Attach event listeners to cart items
   */
  attachEventListeners() {
    // Quantity increment buttons
    this.cartList?.querySelectorAll('.qty-btn.increment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = e.target.dataset.pid;
        const item = this.cart.getItem(pid);
        if (item) {
          this.cart.updateQuantity(pid, item.qty + 1);
          this.render();
        }
      });
    });

    // Quantity decrement buttons
    this.cartList?.querySelectorAll('.qty-btn.decrement').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = e.target.dataset.pid;
        const item = this.cart.getItem(pid);
        if (item && item.qty > 1) {
          this.cart.updateQuantity(pid, item.qty - 1);
          this.render();
        }
      });
    });

    // Quantity input fields
    this.cartList?.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const pid = e.target.dataset.pid;
        const qty = parseInt(e.target.value) || 0;
        this.cart.updateQuantity(pid, qty);
        this.render();
      });
    });

    // Delete buttons
    this.cartList?.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = e.target.dataset.pid;
        this.cart.removeItem(pid);
        this.render();
      });
    });
  }

  /**
   * Update total price display
   */
  updateTotal() {
    const total = this.cart.getTotalPrice().toFixed(2);
    const totalDisplay = this.cartContainer?.querySelector('.cart-total');
    
    if (totalDisplay) {
      totalDisplay.textContent = `Total: $${total}`;
    }
  }

  /**
   * Add item to cart via UI
   */
  async addItem(pid, quantity = 1) {
    const success = await this.cart.addItem(pid, quantity);
    if (success) {
      this.render();
      // Show cart briefly
      if (this.cartContainer) {
        this.cartContainer.style.display = 'block';
      }
    }
    return success;
  }
}

// Global cart instance
let shoppingCart = null;
let shoppingCartUI = null;

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  shoppingCart = new ShoppingCart();
  shoppingCartUI = new ShoppingCartUI(shoppingCart);
});
