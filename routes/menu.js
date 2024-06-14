// routes/menu.js

import express from 'express';
import Datastore from 'nedb';
import Joi from 'joi';

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

// Middleware för admin-autentisering (förutsätter att du har implementerat din egen admin-authentication)
router.use(adminAuth);

// Lägg till en produkt
router.post('/add-product', (req, res) => {
    const { error } = menuSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Felaktig input', details: error.details });
    }

    const { id, title, price, description } = req.body;
    const newProduct = {
        id,
        title,
        price,
        description,
        createdAt: new Date(),
    };

    // Lägg till produkten i databasen
    dbMenu.insert(newProduct, (err, newDoc) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att lägga till produkten', error: err });
        }
        res.status(201).json({ message: 'Produkt tillagd', product: newDoc });
    });
});

// Uppdatera en produkt
router.put('/update-product/:id', (req, res) => {
    const productId = req.params.id;
    const { title, price, description } = req.body;

    const updatedProduct = {
        title,
        price,
        description,
        modifiedAt: new Date(),
    };

    // Uppdatera produkten i databasen baserat på id
    dbMenu.update({ id: productId }, { $set: updatedProduct }, { returnUpdatedDocs: true }, (err, numAffected, affectedDocuments, upsert) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att uppdatera produkten', error: err });
        }
        res.status(200).json({ message: 'Produkt uppdaterad', product: affectedDocuments });
    });
});

// Ta bort en produkt
router.delete('/delete-product/:id', (req, res) => {
    const productId = req.params.id;

    // Ta bort produkten från databasen baserat på id
    dbMenu.remove({ id: productId }, {}, (err, numRemoved) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att ta bort produkten', error: err });
        }
        res.status(200).json({ message: 'Produkt borttagen', numRemoved });
    });
});

// Lägg till en kampanj
router.post('/add-campaign', (req, res) => {
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

    // Lägg till kampanjen i databasen
    dbCampaigns.insert(newCampaign, (err, newDoc) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att lägga till kampanjen', error: err });
        }
        res.status(201).json({ message: 'Kampanj tillagd', campaign: newDoc });
    });
});

// Hämta hela menyn
router.get('/menu', (req, res) => {
    dbMenu.find({}, (err, docs) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att hämta menyn', error: err });
        }
        res.status(200).json({ menu: docs });
    });
});

// Middleware för admin-roll
function adminAuth(req, res, next) {
    // Simulering av admin-authentication
    const isAdmin = true; // Här bör du implementera riktig admin-authentication
    if (isAdmin) {
        return next();
    } else {
        return res.status(403).json({ message: 'Åtkomst nekad' });
    }
}

export default router;

