# IERG4210 E-Commerce Project - Quick Reference Card

## � OFFICIAL REQUIREMENTS (MARKING CHECKLIST)

### Phase Breakdown & Deadlines
| Phase | Topic | Deadline | Marks | Status |
|-------|-------|----------|-------|--------|
| Phase 1 | Layout & Design | Feb 8, 2026 | 14 | ✅ |
| Phase 2A | Secure Server | Feb 8, 2026 | 8 | ✅ |
| Phase 2 | Database & Admin | Feb 8, 2026 | TBD | ✅ |
| Phase 3 | AJAX Shopping Cart | Mar 1, 2026 | TBD | ✅ |

---

## 🚀 QUICK FACT SHEET

### Project Stats
- **Total Code**: ~2000+ lines
- **Phases Completed**: Phase 1, 2A, 2, & 3
- **Database**: SQLite (ecommerce.db)
- **API Endpoints**: 10 RESTful endpoints
- **Main Classes**: ShoppingCart, ShoppingCartUI
- **Supported Formats**: JPEG, PNG, WebP, GIF
- **Max Upload**: 10MB
- **Image Sizes**: 1024×1024 (full), 300×300 (thumb)
- **Cloud VM**: Linux (Azure/AWS/GCP/DigitalOcean)
- **Open Ports**: 22 (SSH), 80 (HTTP), 443 (HTTPS)

---

## ✅ PHASE 1: LAYOUT REQUIREMENTS CHECKLIST

**Semantic HTML (2'):** 
- [ ] `<header>`, `<nav>`, `<footer>`, `<main>`, `<section>` used
- [ ] No unnecessary `<div>` wrappers
- [ ] Show in DevTools Inspector

**CSS File Organization (2'):**
- [ ] CSS in `public/css/style.css` (separate file) ✅
- [ ] No inline `style="..."` attributes
- [ ] No HTML styling attributes (`align`, `width`, etc.)
- [ ] Run: `grep -r 'style=' public/` → Should be empty

**CSS Tableless Product List (2'):**
- [ ] Flexbox layout implemented ✅
- [ ] Product cards: image, name, price, button
- [ ] Responsive (3 cols desktop, 1 mobile)
- [ ] Links clickable to product page

**Hover Shopping List (3'):** ⭐
- [ ] Fixed cart drawer (right side) ✅
- [ ] Overlays content (z-index)
- [ ] Toggle on click (responsive)
- [ ] Shows: thumbnail, name, qty input, subtotal, delete
- [ ] Visible on ALL pages
- [ ] Checkout button present
- [ ] Demo: Click cart toggle, add item, see update

**Product Page Details (2'):**
- [ ] Full-size image ✅
- [ ] Name, description, price displayed
- [ ] Add to Cart button works
- [ ] Shopping list visible

**Hierarchical Navigation (3'):** ⭐
- [ ] Breadcrumb: Home > Category > Product
- [ ] Each level is clickable hyperlink
- [ ] Functional (returns to correct page)
- [ ] Demo: Navigate → Show breadcrumb updates

**Extension: Image Slider (?):**
- [ ] Swiper.js library ✅
- [ ] Multiple images with arrows
- [ ] Thumbnail selector
- [ ] Smooth transitions

---

## ✅ PHASE 2A: SECURITY SETUP REQUIREMENTS CHECKLIST

**Cloud VM Setup (1'):**
- [ ] Provisioned on free tier (Azure/AWS/GCP)
- [ ] Linux OS installed
- [ ] Only Node.js & SQLite installed
- [ ] MySQL NOT installed (too heavy)
- [ ] Show: `node --version`

**Security Configurations (5'):** ⭐
- [ ] **Firewall Rules:**
  - [ ] Show firewall config screenshot
  - [ ] Only ports 22, 80, 443 allowed
  - [ ] All others denied
  
- [ ] **Software Updates:**
  - [ ] OS patched
  - [ ] Node.js current
  - [ ] Dependencies updated
  
- [ ] **Version Hiding:**
  - [ ] Server header removed
  - [ ] No "X-Powered-By" header
  - [ ] Run: `curl -I [domain]` → No version shown
  
- [ ] **Error Handling:**
  - [ ] No stack traces to users
  - [ ] Custom error pages
  - [ ] Logged on server, not shown
  
- [ ] **Directory Indexing:**
  - [ ] `/uploads/` shows no file list
  - [ ] `/public/` directory protected

**Domain Configuration (2'):**
- [ ] Static public IP assigned ✅
- [ ] Domain: `sXX.ierg4210.iecuhk.cc` ✅
- [ ] DNS mapping configured
- [ ] Accessible at both IP and domain
- [ ] Show: `curl -I http://sXX.ierg4210.iecuhk.cc`

---

## 📚 FILE INVENTORY

| File | Size | Purpose |
|------|------|---------|
| server.js | 437 lines | Express backend |
| db.js | 100+ lines | Database init |
| public/js/cart.js | 295 lines | Shopping cart OOP |
| public/admin.html | 6.6K | Admin interface |
| public/js/admin.js | 10K | Admin functionality |
| public/css/style.css | 407 lines | Responsive design |
| public/index.html | Main page | Dynamic products |
| public/product.html | Product detail | Swiper carousel |

---

## 💾 DATABASE STRUCTURE

### Categories Table
```sql
CREATE TABLE categories (
  catid INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
```
**Sample:** Gaming, Food, Electronics, Sports

### Products Table
```sql
CREATE TABLE products (
  pid INTEGER PRIMARY KEY,
  catid INTEGER NOT NULL (FK),
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
**Sample:** Controller ($29.99), Beef ($10.00), etc.

---

## 🔗 API ENDPOINTS QUICK REFERENCE

### Categories
```
GET    /api/categories              → Get all
GET    /api/categories/:catid       → Get one
POST   /api/categories              → Create
PUT    /api/categories/:catid       → Update
DELETE /api/categories/:catid       → Delete
```

### Products
```
GET    /api/products                → Get all
GET    /api/products?catid=1        → Get by category
GET    /api/products/:pid           → Get one
POST   /api/products                → Create (with image)
PUT    /api/products/:pid           → Update
DELETE /api/products/:pid           → Delete
```

---

## 🛒 SHOPPING CART ARCHITECTURE

### ShoppingCart Class
```javascript
class ShoppingCart {
  items: Map<pid, {pid, qty, name, price, image_url}>
  storageKey: 'shoppingCart'
  
  Methods:
  - init()
  - addItem(pid, qty)
  - removeItem(pid)
  - updateQuantity(pid, qty)
  - getTotalPrice()
  - getItems()
  - clear()
  - save()
}
```

### ShoppingCartUI Class
```javascript
class ShoppingCartUI {
  cart: ShoppingCart
  
  Methods:
  - init()
  - render()
  - attachEventListeners()
  - updateTotal()
  - addItem(pid, qty)
}
```

---

## 📊 DATA FLOW DIAGRAMS

### Add to Cart Flow
```
User clicks "Add to Cart"
    ↓
JavaScript event fired
    ↓
Fetch /api/products/:pid (AJAX)
    ↓
ShoppingCart.addItem() called
    ↓
Item added to Map
    ↓
save() → localStorage.setItem()
    ↓
ShoppingCartUI.render()
    ↓
Visual update (no page reload)
```

### Page Load Flow
```
Page loads
    ↓
cart.js loads
    ↓
ShoppingCart instance created
    ↓
init() reads from localStorage
    ↓
ShoppingCartUI.render() displays cart
    ↓
Sync with server on checkout
```

---

## 🎯 COMPLETE PRESENTATION FLOW (15-20 MINUTES)

### **SECTION 1: Phase 1 - Frontend (3-4 minutes)**
1. **HTML Structure** (1 min)
   - Show semantic HTML use
   - DevTools Inspector: `<header>`, `<nav>`, `<footer>`
   - Explain proper structure

2. **CSS & Responsiveness** (1 min)
   - Show separated CSS file
   - No inline styles
   - Flexbox layout demo
   - Responsive test (resize window)

3. **Shopping List Demo** (1-1.5 min)
   - Click cart toggle button
   - Show it overlays content
   - Add product into cart
   - Verify quantity input works
   - Show checkout button

4. **Navigation Demo** (0.5 min)
   - Show breadcrumb navigation
   - Click links to verify it works

---

### **SECTION 2: Phase 2A - Server Security (2 minutes)**
1. **Cloud Setup** (0.5 min)
   - Explain VM provisioning
   - Show SSH access works
   - Verify Node.js installed

2. **Security Measures** (1 min)
   - Show firewall rules (22, 80, 443 only)
   - Demo: No version headers exposed
   - Explain security practices

3. **Domain Access** (0.5 min)
   - Show site works at domain
   - Verify IP connectivity

---

### **SECTION 3: Phase 2/3 - Backend & Cart (5-6 minutes)**
1. **Database Overview** (1 min)
   - Show table structure
   - Explain relationships

2. **Admin Panel Demo** (1.5 min)
   - Add new product
   - Upload image
   - Show edit/delete

3. **Main Page & Details** (1.5 min)
   - Dynamic loading
   - Category filtering
   - Product detail page
   - Image Swiper

4. **Shopping Cart AJAX** (1.5 min)
   - Add to cart (no reload)
   - Quantity controls
   - Refresh page → Cart persists
   - Show localStorage

---

### **SECTION 4: Code Highlights (2-3 minutes)**
1. OOP Design
2. AJAX implementation
3. Security features

---

## 🔴 DANGER ZONES (Know These!)

**Things that commonly break:**
1. Image paths incorrect
   - Check: /uploads/ vs /public/images/
   
2. localStorage full/disabled
   - Test: Can't persist cart
   
3. API calls failing silently
   - Check: Network tab in DevTools
   
4. Product IDs mismatch
   - Verify: Database matches image filenames
   
5. Express static path wrong
   - Should be: `path.join(__dirname, 'public')`

---

## ✅ PRE-DEMO CHECKLIST

- [ ] Run: `npm start`
- [ ] Test: `http://localhost:3000/admin.html`
- [ ] Verify: Images load on main page
- [ ] Try: Add to cart → check localStorage
- [ ] Check: No console errors
- [ ] Refresh page
- [ ] Cart still there?
- [ ] Open product detail
- [ ] Image displays?
- [ ] Add to cart works?
- [ ] Edit product in admin
- [ ] Changes reflect on site?

---

## 💬 KEY PHRASES TO USE

**When explaining database:**
- "Relational structure"
- "Foreign key constraints"
- "Data integrity"
- "CASCADE delete"

**When explaining API:**
- "RESTful endpoints"
- "Parameterized queries"
- "Input validation"
- "HTTP status codes"

**When explaining cart:**
- "OOP design patterns"
- "Separation of concerns"
- "localStorage persistence"
- "AJAX (no page reload)"

**When explaining security:**
- "SQL injection prevention"
- "XSS protection with .escape()"
- "Input sanitization"
- "Type validation"

---

## 🎓 ANSWERS TO EXPECT

**Q: Why Node.js?**
A: "Easy setup, JavaScript on both frontend and backend, great for learning."

**Q: Why SQLite?**
A: "Lightweight, file-based, easy to deploy, sufficient for learning project."

**Q: Why separate cart classes?**
A: "Separation of concerns - data logic separate from UI rendering."

**Q: How persists across refresh?**
A: "localStorage browser API stores JSON data on client side."

**Q: How handle deleted products?**
A: "Edge case not fully handled - would validate on checkout in production."

---

## 📱 RESPONSIVE DESIGN NOTES

- Mobile-first approach
- Flexbox for layouts
- Media queries for breakpoints
- Touch-friendly button sizes
- Image optimization with thumbnails

---

## 🔒 SECURITY FEATURES IMPLEMENTED

✅ Parameterized SQL queries (prevent SQL injection)
✅ Input validation (express-validator)
✅ HTML escaping .escape() (prevent XSS)
✅ File type validation (only images)
✅ File size limits (10MB max)
✅ Filename sanitization

---

## ⚠️ KNOWN LIMITATIONS (Be Honest!)

1. **No authentication** - Anyone can access admin
2. **No inventory management** - No stock tracking
3. **No checkout integration** - Cart only, no payment
4. **localStorage size limit** - Max ~5-10MB
5. **No session management** - Stateless API
6. **Single user approach** - No user accounts
7. **Limited image validation** - Trust user uploads

---

## 🚀 PRODUCTION IMPROVEMENTS

If deploying to production, would add:
- User authentication
- Password hashing (bcrypt)
- JWT tokens for API
- PostgreSQL instead of SQLite
- Environment variables for secrets
- Rate limiting
- CORS configuration
- SSL/HTTPS
- Payment gateway (Stripe, PayPal)
- Order management system
- User accounts

---

## 🧪 QUICK TESTING COMMANDS

```bash
# Check server
curl http://localhost:3000/

# Get all products
curl http://localhost:3000/api/products

# Get specific product
curl http://localhost:3000/api/products/1

# Get products by category
curl 'http://localhost:3000/api/products?catid=1'

# Check admin panel
curl -I http://localhost:3000/admin.html

# View images
curl -I http://localhost:3000/images/controller.jpg
```

---

## 📸 SCREENSHOT IDEAS (If Needed)

Show in presentation:
1. Admin panel with product form
2. Main page with product grid
3. Shopping cart with items
4. Product detail page with Swiper
5. Browser DevTools showing localStorage
6. Browser DevTools showing Network requests
7. File explorer showing uploads folder
8. Database file (ecommerce.db)

---

## 🎤 HANDLING DIFFICULT QUESTIONS

**If asked something you don't know:**
- "That's a great question I haven't explored yet..."
- "Let me think through that logic..."
- "In production, we'd handle that by..."
- "That's an interesting edge case..."

**If demo breaks:**
- Stay calm
- "Let me check the logs..."
- Show the code instead
- Explain what would happen
- Offer to debug it later
- Continue with next item

**If criticized:**
- "You make a good point..."
- "That's a valid concern..."
- "In production, we'd..."
- Don't be defensive
- Learn from feedback

---

## 📝 CONFIDENCE BOOSTERS

Remember:
✅ You built this from scratch
✅ You understand every line
✅ Your code follows best practices
✅ Your architecture is sound
✅ You've debugged and tested
✅ You can run a live demo
✅ You can explain any choice
✅ You've handled edge cases
✅ Your product is functional
✅ You're prepared for questions

**YOU GOT THIS!** 💪🚀

---

## 📚 REFERENCE MATERIAL

**Keep these open during Q&A:**
1. server.js (API implementation)
2. cart.js (OOP design)
3. db.js (Database schema)
4. Browser DevTools (localStorage, network)
5. Project structure (folder organization)
6. Admin panel (live demo)
7. Main page (live demo)

**Have ready:**
- GitHub repository URL
- Commit history (show progression)
- Package.json (show dependencies)
- Database backup

---

## ⏱️ TIME ALLOCATION

- **0:00-0:30** - Project overview & tech stack
- **0:30-1:30** - Architecture explanation  
- **1:30-3:00** - Live demo (admin, main, cart)
- **3:00-4:00** - Code walkthrough highlights
- **4:00-5:00** - Q&A
- **5:00-7:00** - Advanced questions & discussion

---

**Last note:** You've done excellent work. Be proud of what you've built, explain it clearly, answer honestly, and let your confidence show through. The examiners will be impressed! 🎓✨
