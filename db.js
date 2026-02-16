const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'ecommerce.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
  }
});

// Initialize database with tables
db.serialize(() => {
  // Create categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    catid INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`, (err) => {
    if (err) console.error('Error creating categories table:', err);
    else console.log('Categories table ready');
  });

  // Create products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    pid INTEGER PRIMARY KEY AUTOINCREMENT,
    catid INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT,
    thumbnail_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(catid) REFERENCES categories(catid) ON DELETE CASCADE
  )`, (err) => {
    if (err) console.error('Error creating products table:', err);
    else console.log('Products table ready');
  });

  // Insert sample data
  db.get(`SELECT COUNT(*) as count FROM categories`, (err, row) => {
    if (err) {
      console.error('Error checking categories:', err);
      return;
    }
    
    if (!row || row.count === 0) {
      // Insert categories
      db.run(`INSERT INTO categories (name) VALUES ('Gaming')`, (err) => {
        if (err) console.error('Error inserting Gaming category:', err);
        else console.log('Gaming category inserted');
      });

      db.run(`INSERT INTO categories (name) VALUES ('Food')`, (err) => {
        if (err) console.error('Error inserting Food category:', err);
        else console.log('Food category inserted');
      });

      // Insert products for Gaming category (catid = 1)
      db.run(`INSERT INTO products (catid, name, price, description, image_url, thumbnail_url) 
              VALUES (1, 'Gaming Controller', 29.99, 'Professional gaming controller with responsive controls and ergonomic design.', '/images/controller.jpg', '/images/controller.jpg')`, (err) => {
        if (err) console.error('Error inserting controller:', err);
        else console.log('Gaming Controller inserted');
      });

      db.run(`INSERT INTO products (catid, name, price, description, image_url, thumbnail_url) 
              VALUES (1, 'Gaming Keyboard', 79.99, 'Mechanical gaming keyboard with RGB lighting and programmable keys.', '/images/keyboard.jpg', '/images/keyboard.jpg')`, (err) => {
        if (err) console.error('Error inserting keyboard:', err);
        else console.log('Gaming Keyboard inserted');
      });

      db.run(`INSERT INTO products (catid, name, price, description, image_url, thumbnail_url) 
              VALUES (1, 'Gaming Glasses', 49.99, 'Blue light blocking gaming glasses to reduce eye strain during long gaming sessions.', '/images/glasses.jpg', '/images/glasses.jpg')`, (err) => {
        if (err) console.error('Error inserting glasses:', err);
        else console.log('Gaming Glasses inserted');
      });

      // Insert products for Food category (catid = 2)
      db.run(`INSERT INTO products (catid, name, price, description, image_url, thumbnail_url) 
              VALUES (2, 'Basic White Bread', 3.30, 'Simply delicious, just buy it!', '/images/bread.jpg', '/images/bread.jpg')`, (err) => {
        if (err) console.error('Error inserting bread:', err);
        else console.log('Basic White Bread inserted');
      });

      db.run(`INSERT INTO products (catid, name, price, description, image_url, thumbnail_url) 
              VALUES (2, 'Fresh Beef', 10.00, 'Expensive beef, buy or it is your loss!', '/images/Beef.jpg.webp', '/images/Beef.jpg.webp')`, (err) => {
        if (err) console.error('Error inserting beef:', err);
        else console.log('Fresh Beef inserted');
      });
    }
  });
});

module.exports = db;
