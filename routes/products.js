import express from 'express';
import loadMenu from '../middlewares/loadMenu.js';
import validateNewProduct from '../middlewares/validateNewProduct.js';  // Se till att du har importerat din valideringsmiddleware

const router = express.Router();

// hämta alla produkter
router.get('/', loadMenu, (req, res) => {
    res.json(req.menu);
});

// lägga till en ny produkt
router.post('/', loadMenu, validateNewProduct, (req, res) => {
    const { id, title, desc, price } = req.body;
    const newProduct = {
        id,
        title,
        desc,
        price,
        createdAt: new Date().toISOString()
    };
    req.menu.push(newProduct);  
    res.status(201).json(newProduct);
});

export default router;
