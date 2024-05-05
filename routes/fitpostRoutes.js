import { Router } from 'express';
import * as fp from '../data/fitposts.js';
import { validString, addSignedUrlsToFitPosts_in_fitposts, convertDate } from '../helper.js';
// import { addSignedUrlsToFitPosts_in_wardrobe } from "../helper.js";


const router = Router();

router.route('/').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    try {
        let fpList = await fp.getAll();
        const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
            fpList
        );
        for (const fit of postsWithSignedUrls) {
            fit.postedDate = convertDate(fit);
        }
        return res.render('explore_page', { title: 'Explore', fitposts: fpList });
    }
    catch (e) {
        return res.status(500).send(e);
    }
});

router.route('/create')
    .get(async (req, res) => {
        try {
            const postsUrls = await addSignedUrlsToPosts();
            //console.log(postsUrls);

            let headwear = postsUrls.filter((element) => {
                return element.outfitType === "head"
            });

            let bodywear = postsUrls.filter((element) => {
                return element.outfitType === "body"
            })
            let legwear = postsUrls.filter((element) => {
                return element.outfitType === "leg"
            });
            let footwear = postsUrls.filter((element) => {
                return element.outfitType === "foot"
            })

            res.render('your_page', { title: "Create Fitpost", head: headwear, body: bodywear, leg: legwear, foot: footwear });
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })

router.route('/trending').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    try {
        let fpList = await fp.trending();
        const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
            fpList
        );
        for (const fit of postsWithSignedUrls) {
            fit.postedDate = convertDate(fit);
        }
        return res.render('explore_page', { title: 'Trending', fitposts: postsWithSignedUrls });
    }
    catch (e) {
        return res.status(500).send(e);
    }
});

router.route('/latest').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    try {
        let fpList = await fp.latest();
        const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
            fpList
        );
        for (const fit of postsWithSignedUrls) {
            fit.postedDate = convertDate(fit);
        }
        return res.render('explore_page', { title: 'Latest', fitposts: postsWithSignedUrls });
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
        userId = validString(userId);
    } catch (e) {
        return res.status(500).send(e);
    }
    try {
        let fpList = await fp.searchByUID(userId);
        // will need to change later to show user name and not user id
        const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
            fpList
        );
        for (const fit of postsWithSignedUrls) {
            fit.postedDate = convertDate(fit);
        }
        return res.render('explore_page', { title: `${userId}'s FitPosts`, fitposts: postsWithSignedUrls });
    } catch (e) {
        return res.status(500).send(e);
    }
});

router.route('/:id').get(async (req, res) => {
    //code here for GET a single movie
    console.log(req.params.id);
    let fpid = req.params.id;
    try {
        fpid = validString(fpid);
    } catch (e) {
        return res.status(500).send(e);
    }
    try {
        let fitpost = await fp.searchByFPID(fpid);
        const postsWithSignedUrls = await addSignedUrlsToFitPosts_in_fitposts(
            fpList
        );
        for (const fit of postsWithSignedUrls) {
            fit.postedDate = convertDate(fit);
        }
        return res.render('fitpost_page', { post: postsWithSignedUrls });
        //return res.render('explore_page', {title: `${userId}'s FitPosts`, fitposts:  fpList});

    } catch (e) {
        return res.status(500).send(e);
    }
});




export default router;