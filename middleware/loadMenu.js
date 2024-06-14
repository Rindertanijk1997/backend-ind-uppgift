import { menu } from '../data/menu.js';

const loadMenu = (req, res, next) => {
    console.log(menu);  // Detta bör logga din menu array
    req.menu = menu;
    next();
};

export default loadMenu;

