import { Router } from 'express';
import * as fp from '../data/fitposts.js';
import * as helper from '../helper.js';

const router = Router();

router.route('/')
    .get(async (req, res) => {
        //code here for GET will render the home handlebars file
        try {
            let fpList = await fp.getAll();
            return res.render('explore_page', { title: 'Explore', fitposts: fpList });
        }
        catch (e) {
            return res.status(500).send(e);
        }
    })
    .post(async (req, res) => {
        let user_id = "";
        if (req.session && req.session.user) {
            user_id = req.session.user._id;
        }

        let data = req.body;
        let headwear = data.headwear;
        let bodywear = data.bodywear;
        let legwear = data.legwear;
        let footwear = data.footwear;

        try {
            await fp.createFP(user_id, headwear, bodywear, legwear, footwear);
        } catch (e) {
            return res.status(400).send(e.message);
        }

    });


router.route('/trending').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    try {
        let fpList = await fp.trending();
        return res.render('explore_page', { title: 'Trending', fitposts: fpList });
    }
    catch (e) {
        return res.status(500).send(e);
    }
});

router.route('/latest').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    try {
        let fpList = await fp.latest();
        return res.render('explore_page', { title: 'Latest', fitposts: fpList });
    }
    catch (e) {
        return res.status(500).send(e);
    }
});


router.route('/user/:uid').get(async (req, res) => {
    //code here for GET a single movie
    console.log(req.params.uid);
    let userId = req.params.uid;
    try {
        userId = helper.validString(userId);
    } catch (e) {
        return res.status(500).send(e);
    }
    try {
        let fpList = await fp.searchByUID(userId);
        // will need to change later to show user name and not user id
        return res.render('explore_page', { title: `${userId}'s FitPosts`, fitposts: fpList });
    } catch (e) {
        return res.status(500).send(e);
    }
});

router.route('/:id').get(async (req, res) => {
    //code here for GET a single movie
    console.log(req.params.id);
    let fpid = req.params.id;
    try {
        fpid = helper.validString(fpid);
    } catch (e) {
        return res.status(500).send(e);
    }
    try {
        let fitpost = await fp.searchByFPID(fpid);
        return res.render('fitpost_page', { post: fitpost });
        //return res.render('explore_page', {title: `${userId}'s FitPosts`, fitposts:  fpList});

    } catch (e) {
        return res.status(500).send(e);
    }
});




export default router;