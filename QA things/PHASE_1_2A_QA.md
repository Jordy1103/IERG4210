# Phase 1 & 2A - Detailed Q&A Preparation

## 📋 PHASE 1: LAYOUT DESIGN (14 MARKS)

### Understanding Each Requirement

#### **1. Semantic HTML (2 marks)**

**What Examiners Are Looking For:**
- Proper use of HTML5 semantic elements
- Code structure shows understanding of page hierarchy
- Accessibility considerations
- No unnecessary `<div>` nesting ("divitis")

**Common Q&A:**

**Q: Why did you choose `<section>` over `<div>`?**

A: "`<section>` indicates a thematic grouping of content. When I wrap my product grid, I use:
```html
<section class=\"products\">
  <h2>Our Products</h2>
  <div class=\"product-grid\">...</div>
</section>
```

`<section>` tells screen readers this is a meaningful section of the page. `<div>` is just a generic container. Search engines also recognize `<section>` as important content."

---

**Q: What's an example of semantic HTML in your project?**

A: "Throughout the site:
```html
<!-- Page header -->
<header>
  <h1>E-Shop</h1>
  <nav>...</nav>
</header>

<!-- Main content -->
<main>
  <article>
    <h1>Product Name</h1>
    <p>Description</p>
  </article>
</main>

<!-- Footer -->
<footer>
  <p>&copy; 2026 E-Shop</p>
</footer>
```

Each tag has semantic meaning. The page structure is clear without looking at CSS."

---

**Q: Does semantic HTML affect performance?**

A: "No, it doesn't. HTML semantic tags don't change performance - they're purely structural. The performance comes from:
- CSS efficiency (which I have in external file)
- Image optimization (thumbnails for grids)
- JavaScript optimization (async loading)

Semantic HTML just means:
- Better accessibility
- Better SEO
- Easier maintenance
- Zero performance cost"

---

#### **2. CSS File Organization (2 marks)**

**What Examiners Are Looking For:**
- CSS in separate file (not inline)
- Proper class naming conventions
- No HTML styling attributes
- Code organization and structure

**Common Q&A:**

**Q: Show me how you're separating CSS from HTML.**

A: "I have:
- HTML files in `/public/` (index.html, product.html, etc.)
- CSS in `/public/css/style.css` (single organized file)
- No inline styles anywhere

In HTML:
```html
<link rel=\"stylesheet\" href=\"css/style.css\">
```

In CSS:
```css
.product-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

Never this:
```html
<!-- WRONG - inline CSS -->
<div style=\"background: white; padding: 16px;\">
```

Separation means:
- Easy to modify styles globally
- Reusable classes
- Professional structure
- Better caching (CSS file cached by browser)"

---

**Q: What CSS naming convention are you using?**

A: "I'm using BEM (Block Element Modifier) pattern:

```css
/* Block: Standalone component */
.product-card { }

/* Element: Part of the block */
.product-card__image { }
.product-card__title { }
.product-card__price { }

/* Modifier: Variation */
.product-card--featured { }
.product-card--sale { }
```

Benefits:
- Clear hierarchy
- No naming conflicts
- Easy to understand relationships
- Industry standard

Alternatively, simple class naming:
```css
.product-grid { }
.product-item { }
.product-image { }
.product-title { }
```

Either way, the important thing is consistency and organization."

---

#### **3. CSS Tableless Product List (2 marks)**

**What Examiners Are Looking For:**
- Flexbox or CSS Grid implementation
- Responsive grid layout
- Each product shows: image, name, price, button
- Clickable navigation to product page

**Common Q&A:**

**Q: How does your product grid respond to different screen sizes?**

A: "Using CSS media queries with flexbox:

```css
/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .product-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .product-card {
    flex: 1 1 calc(33.33% - 16px);
  }
}

/* Tablet: 2 columns */
@media (min-width: 768px) and (max-width: 1023px) {
  .product-card {
    flex: 1 1 calc(50% - 8px);
  }
}

/* Mobile: 1 column */
@media (max-width: 767px) {
  .product-card {
    flex: 1 1 100%;
  }
}
```

Demo: Resize browser window → See grid change from 3→2→1 columns."

---

**Q: What's the difference between your thumbnail and full-size image?**

A: "Smart image sizing:

**Thumbnail (300×300):**
- Used on product grid
- Small file size (~50KB)
- Multiple images on one page → loads quickly
- Users see previews fast

**Full-size (1024×1024):**
- Used on product detail page
- Higher quality
- Only one per page → justified file size
- User expects good quality on detail page

In HTML:
```html
<!-- Grid: Thumbnail -->
<img src=\"/thumbnails/product_1_thumb.jpg\" 
     alt=\"Product name\" 
     loading=\"lazy\">

<!-- Detail page: Full size -->
<img src=\"/uploads/product_1.jpg\" 
     alt=\"Product name\">
```

This optimization means:
- Main page loads in 1 second
- Detail page loads in 2 seconds
- Mobile users happy (less bandwidth)
- Professional user experience"

---

**Q: Why do you use `loading=\"lazy\"`?**

A: "Lazy loading delays image loading until visible:

```html
<img src=\"...\" loading=\"lazy\">
```

Benefits:
- Initially only visible images load
- User scrolls down → more images load
- Initial page load super fast
- Saves bandwidth for images user never sees
- Mobile users especially benefit

Modern browsers (Chrome, Firefox, Safari, Edge) support it natively.

For older browsers, could use JavaScript library, but modern approach is native `loading=\"lazy\"`."

---

#### **4. Hover Shopping List (3 marks)** ⭐ **MOST IMPORTANT**

**What Examiners Are Looking For:**
- Visual shopping list (drawer/popup)
- Proper overlay implementation
- Quantity input functionality
- Works on both main and product pages
- Responsive design

**Common Q&A:**

**Q: Describe your shopping cart UI implementation.**

A: "The shopping cart has three parts:

**1. Toggle Button:**
```html
<button id=\"cart-toggle\" class=\"cart-button\">
  🛒 Cart (0)
</button>
```

**2. Dark Overlay:**
```css
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 999;
  display: none;
}
.cart-overlay.active {
  display: block;
}
```

**3. Cart Drawer:**
```html
<div class=\"cart-drawer\">
  <div class=\"cart-header\">
    <h2>Your Cart</h2>
    <button class=\"close-btn\">×</button>
  </div>
  
  <div class=\"cart-items\">
    <!-- Items added dynamically -->
  </div>
  
  <div class=\"cart-footer\">
    <div class=\"cart-total\">Total: $0.00</div>
    <button class=\"checkout-btn\">Checkout</button>
  </div>
</div>
```

**Event Flow:**
1. User clicks cart button
2. JavaScript adds 'active' class
3. CSS shows overlay + drawer
4. Click X or outside → removes 'active' class
5. CSS hides overlay + drawer

**Key Features:**
- ✅ Overlays existing content
- ✅ Quantity input: Remove/Edit/Delete
- ✅ Shows on both main and product pages
- ✅ Responsive (drawer on mobile, overlay on desktop)"

---

**Q: How do you handle quantity input in the cart?**

A: "Each cart item has controls:

```html
<div class=\"cart-item\">
  <img src=\"thumbnail.jpg\" alt=\"Product\">
  <div class=\"item-details\">
    <h4>Product Name</h4>
    <p class=\"item-price\">$29.99</p>
  </div>
  
  <div class=\"item-controls\">
    <button class=\"qty-minus\">−</button>
    <input type=\"number\" class=\"qty-input\" value=\"1\" min=\"1\">
    <button class=\"qty-plus\">+</button>
  </div>
  
  <div class=\"item-total\">$29.99</div>
  
  <button class=\"delete-btn\">🗑️</button>
</div>
```

JavaScript handles:
```javascript
// Increment button
plusBtn.addEventListener('click', () => {
  qtyInput.value = parseInt(qtyInput.value) + 1;
  updateTotal();
});

// Decrement button
minusBtn.addEventListener('click', () => {
  if (qtyInput.value > 1) {
    qtyInput.value = parseInt(qtyInput.value) - 1;
  }
  updateTotal();
});

// Direct input
qtyInput.addEventListener('change', () => {
  if (qtyInput.value < 1) qtyInput.value = 1;
  updateTotal();
});

// Delete
deleteBtn.addEventListener('click', () => {
  cartItem.remove();
  updateTotal();
});
```

This gives users multiple ways to adjust quantity:
- Increment button (+)
- Decrement button (−)
- Type directly in input box
- Delete entirely"

---

**Q: How is your cart visible on both main and product pages?**

A: "The cart is included in all pages:

```html
<!-- In both index.html and product.html -->
<body>
  <!-- Cart drawer in HTML -->
  <div id=\"cart-overlay\" class=\"cart-overlay\"></div>
  <div id=\"cart-drawer\" class=\"cart-drawer\">
    <!-- Cart content -->
  </div>
  
  <!-- Page-specific content comes after -->
  <header>...</header>
  <main>...</main>
  
  <!-- Scripts -->
  <script src=\"js/cart.js\"></script>
</body>
```

Same cart drawer on every page. JavaScript manages the state across pages.

When moving between pages:
- Cart state persists (we'll use localStorage in Phase 3)
- User can add from main page, go to product page, add more
- Checkout button ready when needed"

---

**Q: Why use z-index for the overlay instead of just hiding elements?**

A: "Good question! Different approaches:

**Hiding Elements:**
```css
.body-content {
  display: none;
}
```
Problem: Removes elements from DOM, flickering, harder to interact

**z-index/Overlay Approach:**
```css
.cart-overlay {
  position: fixed;
  z-index: 999;
  background: rgba(0,0,0,0.3);
}
.cart-drawer {
  position: fixed;
  z-index: 1000;
}
```

Benefits:
- Content still exists below (no flickering)
- Overlay provides visual indication (\"page is locked\")
- User can see content behind (nice UX)
- Smooth animations possible
- Accessible (user knows page is still there)
- Professional feel (like modals in apps)"

---

#### **5. Product Page Details (2 marks)**

**Common Q&A:**

**Q: What product information do you display on the product page?**

A: "Complete product information:

```html
<div class=\"product-detail\">
  <!-- Full-size image -->
  <div class=\"product-image\">
    <img src=\"/uploads/product_1.jpg\" 
         alt=\"Gaming Controller\">
  </div>
  
  <!-- Product info -->
  <div class=\"product-info\">
    <h1>Gaming Controller Pro</h1>
    
    <p class=\"price\">$29.99</p>
    
    <p class=\"description\">
      High-quality wireless controller with 
      60-hour battery life, precision analog 
      sticks, and responsive buttons.
    </p>
    
    <div class=\"product-specs\">
      <p><strong>Category:</strong> Gaming</p>
      <p><strong>Brand:</strong> TechBrand</p>
      <p><strong>In Stock:</strong> Yes</p>
    </div>
    
    <button class=\"add-to-cart-btn\">
      Add to Cart
    </button>
  </div>
</div>
```

Information shown:
- ✅ High-quality/full-size image
- ✅ Product name (prominent)
- ✅ Price (clearly visible)
- ✅ Detailed description
- ✅ Additional specs
- ✅ Add to Cart button
- ✅ Shopping cart visible (same as main page)"

---

#### **6. Hierarchical Navigation (3 marks)** ⭐ **IMPORTANT**

**Common Q&A:**

**Q: Show me your breadcrumb navigation implementation.**

A: "Breadcrumb shows current location:

```html
<!-- On main page (home) -->
<nav class=\"breadcrumb\">
  <a href=\"/\">Home</a>
</nav>

<!-- On category page -->
<nav class=\"breadcrumb\">
  <a href=\"/\">Home</a>
  <span> / </span>
  <a href=\"/?catid=1\">Gaming</a>
</nav>

<!-- On product page -->
<nav class=\"breadcrumb\">
  <a href=\"/\">Home</a>
  <span> / </span>
  <a href=\"/?catid=1\">Gaming</a>
  <span> / </span>
  <span>Gaming Controller</span>  <!-- Current page, not link -->
</nav>
```

CSS styling:
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #0077cc;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  color: #999;
}
```

**Functionality:**
- Each link is clickable
- Clicking \"Gaming\" → back to category page
- Clicking \"Home\" → back to main page
- Current page is not a link (shows we're here)
- Works with URL parameters (?catid=1)

**UX Benefits:**
- Users always know where they are
- One click to go back to any level
- Better than browser back button
- Mobile users love it"

---

**Q: How does your breadcrumb work with URL parameters?**

A: "Using query parameters:

**URL Structure:**
```
/              → Home
/?catid=1      → Category Gaming
/product.html?id=5  → Product detail
```

**JavaScript generates breadcrumb:**
```javascript
function updateBreadcrumb() {
  const params = new URLSearchParams(window.location.search);
  const catid = params.get('catid');
  const pid = params.get('id');
  
  if (!catid && !pid) {
    // Home page
    breadcrumb.innerHTML = '<a href=\"/\">Home</a>';
  } else if (catid && !pid) {
    // Category page
    const catName = getCategoryName(catid);
    breadcrumb.innerHTML = `
      <a href=\"/\">Home</a>
      <span> / </span>
      <a href=\"/?catid=${catid}\">${catName}</a>
    `;
  } else if (pid) {
    // Product page
    const product = getProduct(pid);
    breadcrumb.innerHTML = `
      <a href=\"/\">Home</a>
      <span> / </span>
      <a href=\"/?catid=${product.catid}\">${product.category}</a>
      <span> / </span>
      <span>${product.name}</span>
    `;
  }
}

// Update on page load
updateBreadcrumb();
```

This way, breadcrumb automatically reflects current location!"

---

#### **7. Extension: Image Slider (? marks)**

**Common Q&A:**

**Q: Which image slider library did you use and why?**

A: "I'm using Swiper.js - a popular, modern carousel library.

```html
<div class=\"swiper\">
  <div class=\"swiper-wrapper\">
    <div class=\"swiper-slide\">
      <img src=\"product_image_1.jpg\" alt=\"Product\">
    </div>
    <div class=\"swiper-slide\">
      <img src=\"product_image_2.jpg\" alt=\"Product\">
    </div>
    <div class=\"swiper-slide\">
      <img src=\"product_image_3.jpg\" alt=\"Product\">
    </div>
  </div>
  
  <!-- Navigation -->
  <div class=\"swiper-button-next\"></div>
  <div class=\"swiper-button-prev\"></div>
  
  <!-- Dots/pagination -->
  <div class=\"swiper-pagination\"></div>
</div>

<script>
const swiper = new Swiper('.swiper', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
  loop: true,
});
</script>
```

**Why Swiper?**
- Industry standard (used by Apple, Google, Amazon)
- Touch-friendly (swipe on mobile)
- Lightweight
- Great documentation
- Accessibility features built-in
- Desktop arrows + mobile swipe both work
- Smooth animations

**Functionality:**
- Click arrows to navigate
- Click dots to jump to image
- Mobile: swipe to change image
- Thumbnail selector optional (added for UX)"

---

## 🔒 PHASE 2A: SECURE SERVER SETUP (8 MARKS)

### Understanding Each Requirement

#### **1. Cloud VM Instantiation (1 mark)**

**Common Q&A:**

**Q: Which cloud provider did you choose and why?**

A: "I chose [Azure/AWS/GCP/DigitalOcean] because:

**If Azure:**
- Free student account (no credit card)
- Generous free tier
- Easy setup
- Microsoft support

**If AWS:**
- Widely used in industry
- Free tier: 12 months
- Learning EC2 valuable for career

**If DigitalOcean:**
- Straightforward documentation
- Cheap if needed ($5/month)
- Popular for startups

**What I installed:**
```bash
# Minimal installation
apt update && apt upgrade
apt install nodejs npm sqlite3

# Verify
node --version     # v18.x.x
npm --version      # 9.x.x
sqlite3 --version  # 3.x.x

# NOT MySQL
# MySQL uses too much RAM on free tier
```

**Why minimal?**
- Reduces attack surface
- Lower resource usage
- Faster to manage
- Easier to maintain"

---

**Q: What specs are your VM's resources?**

A: "Free tier typical configuration:

```
Operating System: Ubuntu 20.04 LTS
CPU: 1 vCPU (shared)
Memory: 512 MB - 1 GB
Storage: 20-30 GB
Bandwidth: Metered/Limited
```

For learning project, this is sufficient:
- Node.js runs fine on 512MB
- SQLite minimal footprint
- Can handle modest traffic
- Perfect for demo/testing

If production, would upgrade to:
- 2+ vCPU
- 2+ GB RAM
- 50+ GB storage
- Dedicated bandwidth"

---

#### **2. Security Configurations (5 marks)** ⭐ **CRITICAL**

**Common Q&A:**

**Q: Show me your firewall rules.**

A: "Cloud firewall configuration:

```
INBOUND RULES:
┌─────────────┬──────────────────┬─────────────┐
│   Port      │   Protocol       │   Source    │
├─────────────┼──────────────────┼─────────────┤
│ 22 (SSH)    │ TCP              │ My IP Only  │
│ 80 (HTTP)   │ TCP              │ 0.0.0.0/0   │
│ 443 (HTTPS) │ TCP              │ 0.0.0.0/0   │
│ *           │ *                │ DENY        │
└─────────────┴──────────────────┴─────────────┘

OUTBOUND RULES:
All ports → ALLOW (needed for updates, downloads)
```

**Why these ports?**

**22 (SSH):**
- For me to admin the server remotely
- Only from my specific IP (restricted for security)
- If I need to open it, could use VPN instead

**80 (HTTP):**
- Public access for web traffic
- Could be restricted to 443 only
- Typically redirects to 443

**443 (HTTPS):**
- Public access with encryption
- For user traffic
- Recommended by browsers

**All Others:**
- BLOCKED by default
- If needed, explicitly add rule
- \"Default deny\" principle

**Demo:**
Show cloud provider dashboard with these rules visible."

---

**Q: How do you keep software updated?**

A: "Regular patching strategy:

```bash
# Check updates available
apt update
apt list --upgradable

# Install security updates (automated)
apt upgrade

# Or manually upgrade specific packages
apt upgrade nodejs

# Check Node.js version periodically
node --version
npm list -g

# Update npm packages
npm audit
npm audit fix
```

**Automated approach (recommended):**
```bash
# Install unattended-upgrades
apt install unattended-upgrades

# Configure automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Check status
sudo systemctl status unattended-upgrades
```

**Schedule:**
- Security updates: Immediate
- Minor updates: Weekly
- Major updates: Planned maintenance window

**Version checking:**
I keep track of current versions:
- Node.js LTS: Currently v18/20
- npm: Latest stable
- SQLite: Latest patch"

---

**Q: Show me how you hide version headers.**

A: "Implementation examples:

**In Node.js/Express:**
```javascript
const express = require('express');
const app = express();

// Disable X-Powered-By header
app.disable('x-powered-by');

// Middleware to remove other headers
app.use((req, res, next) => {
  res.removeHeader('Server');
  res.removeHeader('X-Powered-By');
  res.set('X-Frame-Options', 'DENY');
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});

app.listen(3000);
```

**Testing before/after:**

Before:
```bash
curl -I http://localhost:3000
HTTP/1.1 200 OK
Server: Express
X-Powered-By: Express
```

After:
```bash
curl -I http://localhost:3000
HTTP/1.1 200 OK
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
(No Server or X-Powered-By headers!)
```

**In Nginx (if used):**
```nginx
server {
  server_tokens off;
  
  add_header X-Frame-Options \"DENY\";
  add_header X-Content-Type-Options \"nosniff\";
}
```

**Why it matters:**
- Attackers can't identify specific versions
- Can't target version-specific exploits
- Still need actual patches (headers hiding is layer 1)
- Defense in depth"

---

**Q: How do you handle errors securely?**

A: "Never expose internal errors to users:

**Bad (Vulnerable):**
```javascript
app.get('/api/product/1', (req, res) => {
  try {
    // code
  } catch(err) {
    res.json({
      error: err.message,
      stack: err.stack,
      code: err.code
    });
  }
});

// Response to user:
{
  \"error\": \"ENOENT: no such file or directory\",
  \"stack\": \"/home/user/code/db.js:45...\",
  \"code\": \"ENOENT\"
}
```

Attacker learns: File system structure, code location, etc.

**Good (Secure):**
```javascript
app.get('/api/product/1', (req, res) => {
  try {
    // code
  } catch(err) {
    // Log internally
    console.error('Product fetch error:', err);
    
    // Return generic response
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Response to user:
{
  \"error\": \"Internal server error\"
}
```

**Error Logging:**
```bash
# Logs on server (only admin sees)
tail -f /var/log/nodejs/error.log

[2026-02-16] Error fetching product:
  File not found at db.js:45
  Product ID: 1
  User: 192.168.1.100
```

**Production setup:**
```javascript
const logger = require('./logger');

app.use((err, req, res, next) => {
  // Log with full details
  logger.error({
    message: err.message,
    stack: err.stack,
    userId: req.user?.id,
    endpoint: req.path,
    timestamp: new Date()
  });
  
  // Send generic response
  res.status(500).json({
    error: 'An error occurred'
  });
});
```

**Benefits:**
- Attackers see nothing
- Admins can debug with detailed logs
- Professional user experience"

---

**Q: How do you disable directory indexing?**

A: "Prevent users from seeing file listings:

**In Express:**
```javascript
app.use(express.static('public', {
  index: false  // Disable directory listing
}));
```

**Test before/after:**

Before:
```bash
curl http://localhost:3000/uploads/

Result:
Index of /uploads/
[Name]               [Size]       [Date]
controller.jpg       45 KB        2026-01-15
keyboard.jpg         32 KB        2026-01-14
laptop.jpg           89 KB        2026-01-13
```

After:
```bash
curl http://localhost:3000/uploads/

Result:
403 Forbidden
```

**In Nginx:**
```nginx
location ~ ^/uploads/ {
  autoindex off;
}
```

**In Apache:**
```apache
<Directory /var/www/uploads>
  Options -Indexes
</Directory>
```

**Why important:**
- Prevents file enumeration
- Attackers can't map uploaded files
- Users can't browse upload directory
- Accidental data exposure prevented

**Still accessible:**
```bash
# Direct URL still works
curl http://localhost:3000/uploads/controller.jpg
# Returns the image

# But listing doesn't work
curl http://localhost:3000/uploads/
# Returns 403
```"

---

#### **3. Domain Configuration (2 marks)**

**Common Q&A:**

**Q: How did you get your domain working?**

A: "Domain setup process:

**Step 1: Get Static IP**
```
From cloud provider console:
→ Networking → Public IPs
→ Reserve static IP
→ Associate with VM instance
→ Note down: 203.0.113.42 (example)
```

**Step 2: Request Domain**
```
Submit static IP via Microsoft Forms:
- IP: 203.0.113.42
- Email: student@iecuhk.edu.hk
```

**Step 3: TA Configures DNS**
```
TA maps: sXX.ierg4210.iecuhk.cc → 203.0.113.42

DNS record created:
A record: sXX.ierg4210.iecuhk.cc → 203.0.113.42
```

**Step 4: Verify Accessibility**
```bash
# Both should work:
curl http://203.0.113.42/
curl http://sXX.ierg4210.iecuhk.cc/

# Check DNS resolution
nslookup sXX.ierg4210.iecuhk.cc
Server:  8.8.8.8
Name:    sXX.ierg4210.iecuhk.cc
Address: 203.0.113.42
```"

---

**Q: Why is a static IP necessary?**

A: "Without static IP:

**Problem:**
- Cloud provider might reassign IP
- Your IP: 203.0.113.42 today
- Restart VM → IP: 203.0.113.99 tomorrow
- Domain still points to 203.0.113.42
- Website goes down!

**Solution: Static IP**
- Cloud provider guarantees IP stays same
- Even after restart/upgrade
- Stable, predictable availability
- Essential for production

**Cost:**
- Most cloud providers: Free
- Some (AWS): $3.65/month
- For learning: Usually free tier"

---

**Q: How do you ensure your site is accessible?**

A: "Verification checklist:

```bash
# 1. SSH into server
ssh user@203.0.113.42

# 2. Check process running
ps aux | grep node
# Should see: node server.js

# 3. Check port listening
netstat -tuln | grep 3000
# Should show: 0.0.0.0:3000 LISTEN

# 4. Check from local machine
curl http://203.0.113.42
# Should return HTML

# 5. Check domain
curl http://sXX.ierg4210.iecuhk.cc
# Should return HTML

# 6. Browser test
# Open in browser: http://sXX.ierg4210.iecuhk.cc
# Should load perfectly
```

**Common issues:**

**Issue: Connection refused**
- Check: firewall allows port 80
- Check: Node.js process running

**Issue: Domain doesn't resolve**
- Check: DNS propagation (wait 24 hours)
- Check: IP address correct in DNS

**Issue: HTTPS not working (404)**
- Need SSL certificate (Let's Encrypt, free)
- Redirect HTTP → HTTPS
- Set up later in Phase 3"

---

## 🎯 TALKING POINTS FOR Q&A

### Phase 1 Emphasis:
1. **\"Semantic markup represents proper structure\"**
2. **\"Responsive design means works on all devices\"**
3. **\"Shopping cart is core UX feature\"**
4. **\"Breadcrumb helps users navigate\"**
5. **\"Image optimization improves performance\"**

### Phase 2A Emphasis:
1. **\"Firewall is first line of defense\"**
2. **\"Version hiding adds security layer\"**
3. **\"Never expose errors to users\"**
4. **\"Static IP ensures stability\"**
5. **\"Security is ongoing process\"**

---

## ✅ DEMO CHECKLIST FOR EXAMINERS

### Phase 1 Demo:
- [ ] **HTML/CSS**: Open DevTools → show semantic structure
- [ ] **Hover**: Click cart toggle → drawer slides in smoothly
- [ ] **Breadcrumb**: Click Home → Gaming → Product → verify links work
- [ ] **Responsive**: Resize window from 1920px to 375px → layout adapts
- [ ] **Product page**: Click product → full image shows, can add to cart
- [ ] **Shopping list**: Add multiple products → quantities update → total recalculates

### Phase 2A Demo:
- [ ] **Cloud console**: Show VM properties, specs
- [ ] **Firewall rules**: Show port 22/80/443, deny all others
- [ ] **Version headers**: `curl -I` shows no version info
- [ ] **Domain access**: Show both IP and domain work: 
  - `curl http://203.0.113.42` → Works
  - `curl http://sXX.ierg4210.iecuhk.cc` → Works
- [ ] **SSH access**: Show terminal connected to remote server
- [ ] **Error handling**: Deliberately cause error → see generic message, not stack trace

---

**Remember: Examiners want to see:**
- Core functionality works smoothly
- You understand WHY each requirement matters
- Security is taken seriously
- Everything is production-ready (within scope)
- You can explain technical decisions confidently

**You've built solid foundations! Show them with pride!** 🚀
