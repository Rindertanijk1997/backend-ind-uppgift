import db from '../routes/index.js';

const validateLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Både användarnamn och lösenord krävs.' });
    }

    db.findOne({ username }, (err, user) => {
        if (err) {
            console.error('Databas fel vid inloggning:', err);
            return res.status(500).json({ error: 'Serverfel vid hämtning av användardata.' });
        }

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Ogiltiga användaruppgifter har angetts.' });
        }

        // Kontrollera användarrollen
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Åtgärden kräver administratörsbehörighet' });
        }

        req.user = user;
        next();
    });
};

export default validateLogin;
