import { menu } from '../data/menu.js';
import Joi from 'joi';

const validateNewProduct = (req, res, next) => {
    const { id, title, desc, price } = req.body;

    const productSchema = Joi.object({
        id: Joi.number().required(),
        title: Joi.string().required(),
        desc: Joi.string().required(),
        price: Joi.number().required()
    });

    const { error } = productSchema.validate({ id, title, desc, price });
    if (error) {
        return res.status(400).json({ error: 'Alla fält måste fyllas i: id, title, desc, price' });
    }

    // Kontrollera att det inte redan finns en produkt med samma ID
    const existingProduct = menu.find(item => item.id === id);
    if (existingProduct) {
        return res.status(409).json({ error: 'En produkt med detta ID finns redan' });
    }

    next;
