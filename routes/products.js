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

router.put('/:id', loadMenu, (req, res) => {
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

export default router;
