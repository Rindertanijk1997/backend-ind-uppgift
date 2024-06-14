// server.js

import express from 'express';
import menuRoutes from './routes/menu.js';
import bodyParser from 'body-parser';

const app = express();
const port = 5050;

app.use(bodyParser.json());
app.use('/menu', menuRoutes);

// Middleware för admin-roll
export function admin(req, res, next) {
    // Simulering av admin-authentication
    const isAdmin = true; // Här bör du implementera riktig admin-authentication
    if (isAdmin) {
        return next();
    } else {
        return res.status(403).json({ message: 'Åtkomst nekad' });
    }
}

// Middleware för 404-felhantering
app.use((req, res, next) => {
    return res.status(404).json({ message: 'Route not found' });
});

// Middleware för global felhantering
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
