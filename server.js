const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const { body, validationResult, query } = require('express-validator');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public folder

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const thumbsDir = path.join(uploadsDir, 'thumbnails');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // File will be renamed after we get the product ID
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

//API Routes

//CATEGORIES

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get single category
app.get('/api/categories/:catid', (req, res) => {
  const { catid } = req.params;
  db.get('SELECT * FROM categories WHERE catid = ?', [catid], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(row);
  });
});

// Create category
app.post('/api/categories',
  body('name').trim().isLength({ min: 1 }).escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    db.run('INSERT INTO categories (name) VALUES (?)', [name], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Category name already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ catid: this.lastID, name });
    });
  }
);

// Update category
app.put('/api/categories/:catid',
  body('name').trim().isLength({ min: 1 }).escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { catid } = req.params;
    const { name } = req.body;
    
    db.run('UPDATE categories SET name = ? WHERE catid = ?', [name, catid], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ catid, name });
    });
  }
);

// Delete category
app.delete('/api/categories/:catid', (req, res) => {
  const { catid } = req.params;
  
  db.run('DELETE FROM categories WHERE catid = ?', [catid], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

//PRODUCTS

// Get all products (with optional category filter)
app.get('/api/products',
  query('catid').optional().isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { catid } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];

    if (catid) {
      query += ' WHERE catid = ?';
      params.push(catid);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  }
);

// Get single product
app.get('/api/products/:pid', (req, res) => {
  const { pid } = req.params;
  db.get('SELECT * FROM products WHERE pid = ?', [pid], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// Create product with image upload
app.post('/api/products',
  upload.single('image'),
  body('catid').isInt(),
  body('name').trim().isLength({ min: 1 }).escape(),
  body('price').isFloat({ min: 0 }),
  body('description').trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up uploaded file if validation failed
      if (req.file) {
        fs.unlink(req.file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { catid, name, price, description } = req.body;
    let imageUrl = null;
    let thumbnailUrl = null;

    // Verify category exists
    db.get('SELECT catid FROM categories WHERE catid = ?', [catid], async (err, cat) => {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: err.message });
      }
      if (!cat) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      // Insert product first to get the ID
      db.run(
        'INSERT INTO products (catid, name, price, description) VALUES (?, ?, ?, ?)',
        [catid, name, price, description],
        async function(err) {
          if (err) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(500).json({ error: err.message });
          }

          const pid = this.lastID;

          // Process image if uploaded
          if (req.file) {
            try {
              const ext = path.extname(req.file.originalname).toLowerCase();
              const fullImageName = `product_${pid}${ext}`;
              const thumbImageName = `product_${pid}_thumb${ext}`;
              
              const fullImagePath = path.join(uploadsDir, fullImageName);
              const thumbImagePath = path.join(thumbsDir, thumbImageName);

              // Resize and save full image (max 1024x1024)
              await sharp(req.file.path)
                .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
                .toFile(fullImagePath);

              // Create thumbnail (max 300x300)
              await sharp(req.file.path)
                .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
                .toFile(thumbImagePath);

              // Delete temporary file
              fs.unlinkSync(req.file.path);

              imageUrl = `/uploads/${fullImageName}`;
              thumbnailUrl = `/uploads/thumbnails/${thumbImageName}`;

              // Update product with image URLs
              db.run(
                'UPDATE products SET image_url = ?, thumbnail_url = ? WHERE pid = ?',
                [imageUrl, thumbnailUrl, pid],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }
                  res.json({ pid, catid, name, price, description, image_url: imageUrl, thumbnail_url: thumbnailUrl });
                }
              );
            } catch (imageErr) {
              // Clean up files on image processing error
              if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
              }
              return res.status(500).json({ error: 'Error processing image: ' + imageErr.message });
            }
          } else {
            res.json({ pid, catid, name, price, description, image_url: null, thumbnail_url: null });
          }
        }
      );
    });
  }
);

// Update product with optional image upload
app.put('/api/products/:pid',
  upload.single('image'),
  body('catid').isInt(),
  body('name').trim().isLength({ min: 1 }).escape(),
  body('price').isFloat({ min: 0 }),
  body('description').trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ errors: errors.array() });
    }

    const { pid } = req.params;
    const { catid, name, price, description } = req.body;

    // Verify product exists
    db.get('SELECT * FROM products WHERE pid = ?', [pid], async (err, product) => {
      if (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: err.message });
      }
      if (!product) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Product not found' });
      }

      // Verify category exists
      db.get('SELECT catid FROM categories WHERE catid = ?', [catid], async (err, cat) => {
        if (err) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(500).json({ error: err.message });
        }
        if (!cat) {
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(400).json({ error: 'Invalid category ID' });
        }

        let imageUrl = product.image_url;
        let thumbnailUrl = product.thumbnail_url;

        // Process new image if uploaded
        if (req.file) {
          try {
            // Delete old images if they exist
            if (product.image_url) {
              const oldImagePath = path.join(__dirname, product.image_url);
              if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            if (product.thumbnail_url) {
              const oldThumbPath = path.join(__dirname, product.thumbnail_url);
              if (fs.existsSync(oldThumbPath)) fs.unlinkSync(oldThumbPath);
            }

            const ext = path.extname(req.file.originalname).toLowerCase();
            const fullImageName = `product_${pid}${ext}`;
            const thumbImageName = `product_${pid}_thumb${ext}`;
            
            const fullImagePath = path.join(uploadsDir, fullImageName);
            const thumbImagePath = path.join(thumbsDir, thumbImageName);

            // Resize and save full image
            await sharp(req.file.path)
              .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
              .toFile(fullImagePath);

            // Create thumbnail
            await sharp(req.file.path)
              .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
              .toFile(thumbImagePath);

            fs.unlinkSync(req.file.path);

            imageUrl = `/uploads/${fullImageName}`;
            thumbnailUrl = `/uploads/thumbnails/${thumbImageName}`;
          } catch (imageErr) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(500).json({ error: 'Error processing image: ' + imageErr.message });
          }
        }

        // Update product
        db.run(
          'UPDATE products SET catid = ?, name = ?, price = ?, description = ?, image_url = ?, thumbnail_url = ? WHERE pid = ?',
          [catid, name, price, description, imageUrl, thumbnailUrl, pid],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ pid, catid, name, price, description, image_url: imageUrl, thumbnail_url: thumbnailUrl });
          }
        );
      });
    });
  }
);

// Delete product
app.delete('/api/products/:pid', (req, res) => {
  const { pid } = req.params;

  db.get('SELECT * FROM products WHERE pid = ?', [pid], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete images
    if (product.image_url) {
      const imagePath = path.join(__dirname, product.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    if (product.thumbnail_url) {
      const thumbPath = path.join(__dirname, product.thumbnail_url);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    // Delete from database
    db.run('DELETE FROM products WHERE pid = ?', [pid], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Product deleted successfully' });
    });
  });
});

//  Error Handler 
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: err.message || 'An error occurred' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
