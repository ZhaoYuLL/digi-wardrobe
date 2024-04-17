import { Router } from 'express';
import * as fp from '../data/fitposts.js';

const router = Router();

router.route('/').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    try {
        let fpList = fp.getAll();
        res.render('explore_page', { fitposts:  fpList});
    }
    catch (e) {
        return res.status(500).send(e);
    }
});

router.route('/trending').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    try {
        let fpList = fp.trending();
        res.render('explore_page', { fitposts:  fpList});
    }
    catch (e) {
        return res.status(500).send(e);
    }
});

router.route('/latest').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    try {
        let fpList = fp.latest();
        res.render('explore_page', { fitposts:  fpList});
    }
    catch (e) {
        return res.status(500).send(e);
    }
});




export default router;