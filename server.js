import express from 'express';
import menuRoutes from './routes/menu.js';
import { basicAuth } from './middleware/auth.js';

const app = express();
const PORT = 5050;

app.use(express.json());

// Tillåt åtkomst till menyn utan autentisering
app.use('/menu/menu', menuRoutes);

// Använd autentiseringsmiddleware för övriga menyrutter
app.use('/menu', basicAuth, menuRoutes);

// Fånga ogiltiga rutter
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

