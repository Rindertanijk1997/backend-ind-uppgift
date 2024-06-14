import express from 'express';
import Datastore from 'nedb';
import Joi from 'joi';
import admin from '../middleware/admin.js';
import menu from './menu.js';

const dbCampaign = new Datastore({ filename: './db/campaigns.db', autoload: true });

const campaignSchema = Joi.object({
    products: Joi.array().items(Joi.string()).required(),
    price: Joi.number().required()
});

const router = express.Router();

router.use(admin); // Skydda alla endpoints med admin middleware

router.post('/add-campaign', (req, res) => {
    const { error } = campaignSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Felaktig input', details: error.details });
    }

    const { products, price } = req.body;

    dbMenu.find({ title: { $in: products } }, (err, foundProducts) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att hämta produkter', error: err });
        }

        const foundProductTitles = foundProducts.map(product => product.title);
        const missingProducts = products.filter(product => !foundProductTitles.includes(product));

        if (missingProducts.length > 0) {
            const newProducts = missingProducts.map(title => ({ title }));
            dbMenu.insert(newProducts, (err, newDocs) => {
                if (err) {
                    return res.status(500).json({ message: 'Det gick inte att lägga till nya produkter', error: err });
                }

                const allProducts = foundProducts.concat(newDocs);
                createCampaign(allProducts, price, res);
            });
        } else {
            createCampaign(foundProducts, price, res);
        }
    });
});

const createCampaign = (products, price, res) => {
    const campaignProducts = products.map(product => ({
        id: product.id,
        title: product.title,
    }));

    const newCampaign = { products: campaignProducts, price, createdAt: new Date() };

    dbCampaign.insert(newCampaign, (err, newDoc) => {
        if (err) {
            return res.status(500).json({ message: 'Det gick inte att lägga till kampanj', error: err });
        }
        res.status(201).json({ message: 'Kampanj tillagd', campaign: newDoc });
    });
};

export { router as default };
