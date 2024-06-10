import express from 'express';
import loadMenu from '../middlewares/loadMenu.js';
import validateNewProduct from '../middlewares/validateNewProduct.js'; 
import validateLogin from '../middlewares/validateLogin.js';

const router = express.Router();

// hämta alla produkter
router.get('/', loadMenu, (req, res) => {
    res.json(req.menu);
});

// lägga till en ny produkt
router.post('/', validateLogin, loadMenu, validateNewProduct, (req, res) => {
    const { id, title, desc, price } = req.body;
    const existingProduct = req.menu.find(product => product.id === id);
    if (existingProduct) {
        return res.status(400).json({ error: "En produkt med detta ID finns redan." });
    }
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


router.put('/:id', validateLogin, loadMenu, (req, res) => {
    const { id } = req.params;
    const numId = Number(id);
    const product = req.menu.find(p => p.id === numId);
    if (!product) {
        return res.status(404).json({ message: "Produkten hittades inte" });
    }
    const { title, desc, price } = req.body;
    let isModified = false;
    if (title && title !== product.title) {
        product.title = title;
        isModified = true;
    }
    if (desc && desc !== product.desc) {
        product.desc = desc;
        isModified = true;
    }
    if (price && price !== product.price) {
        product.price = price;
        isModified = true;
    }
    if (isModified) {
        product.modifiedAt = new Date().toISOString();
    }
    res.json(product);
});

router.delete('/:id', validateLogin, loadMenu, (req, res) => {
    const numId = Number(req.params.id);
    const index = req.menu.findIndex(p => p.id === numId);
    if (index === -1) {
        return res.status(404).json({ message: "Produkten hittades inte" });
    }
    req.menu.splice(index, 1);
    res.status(200).json({ message: "Produkten har tagits bort" });
});


export default router;
