import express from 'express';
import Datastore from 'nedb';
import Joi from 'joi';
import { adminOnly } from '../middleware/auth.js';

const dbMenu = new Datastore({ filename: './db/menu.db', autoload: true });
const dbCampaigns = new Datastore({ filename: './db/campaigns.db', autoload: true });

const menuSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
});

const campaignSchema = Joi.object({
    products: Joi.array().items(Joi.string()).min(1).required(),
    campaignPrice: Joi.number().required(),
});

const router = express.Router();

// Hämta hela menyn (tillåtet för alla användare)
router.get('/menu', (req, res) => {
    dbMenu.find({}, (err, docs) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att hämta menyn', error: err });
        }
        res.status(200).json({ menu: docs });
    });
});

// Lägg till en produkt (endast admin)
router.post('/add-product', adminOnly, (req, res) => {
    const { error } = menuSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Felaktig input', details: error.details });
    }

    const { id, title, price, description } = req.body;

    // Kontrollera om produkten redan finns med det angivna ID:t
    dbMenu.findOne({ id }, (err, existingProduct) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (existingProduct) {
            return res.status(400).json({ message: `Produkt med ID ${id} finns redan` });
        }

        // Om produkten inte finns, lägg till den
        const newProduct = {
            id,
            title,
            price,
            description,
            createdAt: new Date(),
        };

        dbMenu.insert(newProduct, (err, newDoc) => {
            if (err) {
                return res.status(500).json({ message: 'Det gick inte att lägga till produkten', error: err });
            }
            res.status(201).json({ message: 'Produkt tillagd', product: newDoc });
        });
    });
});

// Uppdatera en produkt (endast admin)
router.put('/update-product/:id', adminOnly, (req, res) => {
    const productId = req.params.id;
    const { title, price, description } = req.body;

    const updatedProduct = {
        title,
        price,
        description,
        modifiedAt: new Date(),
    };

    dbMenu.update({ id: productId }, { $set: updatedProduct }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments, upsert) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att uppdatera produkten', error: err });
        }
        res.status(200).json({ message: 'Produkt uppdaterad', product: affectedDocuments });
    });
});

// Ta bort en produkt (endast admin)
router.delete('/delete-product/:id', adminOnly, (req, res) => {
    const productId = req.params.id;

    dbMenu.remove({ id: productId }, {}, (err, numRemoved) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att ta bort produkten', error: err });
        }
        res.status(200).json({ message: 'Produkt borttagen', numRemoved });
    });
});

// Lägg till en kampanj (endast admin)
router.post('/add-campaign', adminOnly, (req, res) => {
    const { error } = campaignSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Felaktig input', details: error.details });
    }

    const { products, campaignPrice } = req.body;
    const newCampaign = {
        products,
        campaignPrice,
        createdAt: new Date(),
    };

    dbCampaigns.insert(newCampaign, (err, newDoc) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att lägga till kampanjen', error: err });
        }
        res.status(201).json({ message: 'Kampanj tillagd', campaign: newDoc });
    });
});

export default router;
