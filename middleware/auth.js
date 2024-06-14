import Datastore from 'nedb';

const dbUsers = new Datastore({ filename: './db/users.db', autoload: true });

// Middleware för Basic Authentication
export function basicAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).send('Authentication required.');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    dbUsers.findOne({ username, password }, (err, user) => {
        if (err || !user) {
            res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
            return res.status(401).send('Authentication required.');
        }
        req.user = user; // Lägg till användaruppgifter till request-objektet
        next();
    });
}

// Middleware för att verifiera admin-roll
export function adminOnly(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied.');
    }
    next();
}
