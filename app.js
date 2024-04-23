// taken from lab 9 lecture code, feel free to change anything

import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import session from "express-session";

import exphbs from 'express-handlebars';

const staticDir = express.static('public');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === 'number')
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        },

        partialsDir: ['views/partials/']
    }
});

app.use((req, res, next) => {
    console.log(`${new Date().toUTCString()}: ${req.method} ${req.originalUrl} (${req.session.user ? 'Authenticated User' : 'Non-Authenticated User'})`);
  
    if (req.path === "/") {
		if (req.session.user) {
			res.redirect("/user");
		} else {
			res.redirect("/login");
		}
	} else {
		next();
	}
});
app.use('/login', (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/user');
    }
    else{
        next();
    }
});
app.use('/register', (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/user');
    }else{
        next();
    }
});
app.use('/user', (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    else{
        next();
    }
});
app.use('/logout', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    else{
        next();
    }
});
app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});