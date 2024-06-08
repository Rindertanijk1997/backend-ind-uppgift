const validateNewProduct = (req, res, next) => {
    const { id, title, desc, price } = req.body;

    if (!id || !title || !desc || !price) {
        return res.status(400).json({ error: 'Alla fält måste fyllas i: id, title, desc, price' });
    }

    // Kontrollera att det inte redan finns en produkt med samma ID
    const existingProduct = req.menu.find(item => item.id === id);
    if (existingProduct) {
        return res.status(409).json({ error: 'En produkt med detta ID finns redan' });
    }

    next();
};

export default validateNewProduct;