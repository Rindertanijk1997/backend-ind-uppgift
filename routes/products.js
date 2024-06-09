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
    console.log(req.menu);  // Lägg till detta för att se vad som loggas ut
    const { id } = req.params;
    const { title, desc, price } = req.body;
    const product = req.menu.find(p => p.id === id);


    if (!product) {
        return res.status(404).json({ message: "Produkten hittades inte" });
    }

    let isModified = false;

    // Kontrollera och uppdatera titeln
    if (title && title !== product.title) {
        product.title = title;
        isModified = true;
    }

    // Kontrollera och uppdatera beskrivningen
    if (desc && desc !== product.desc) {
        product.desc = desc;
        isModified = true;
    }

    // Kontrollera och uppdatera priset
    if (price && price !== product.price) {
        product.price = price;
        isModified = true;
    }

    // Lägg till modifiedAt om någon egenskap har ändrats
    if (isModified) {
        product.modifiedAt = new Date().toISOString();
    }

    // Skicka tillbaka den uppdaterade produkten som respons
    res.json(product);
});

export default router;
