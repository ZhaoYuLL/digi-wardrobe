import { Router } from 'express';
import * as fp from '../data/fitposts.js';
import { getOutfitPiecesByUserId } from '../data/outfitPieces.js';
import { validString, addSignedUrlsToFitPosts_in_fitposts, convertDate, addSignedUrlsToPosts } from '../helper.js';
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
        // need to change so that it only gets outfit pieces that the user has in their closet
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

            res.render('your_page', {
                title: "Create Fitpost",
                head: headwear,
                body: bodywear,
                leg: legwear,
                foot: footwear
            });
        } catch (e) {
            return res.status(500).send(e.message);
        }
    })
    .post(async (req, res) => {
        // TODO: input validation
        console.log("found the post route!");
        if (req.session && req.session.user) {
            const data = req.body;
            const user = req.session.user;
            //console.log(user);

            try {
                if (!data.headwear) throw new Error('Headwear not provided in route');
                if (!data.bodywear) throw new Error('Bodywear not provided in route');
                if (!data.legwear) throw new Error('Legwear not provided in route');
                if (!data.footwear) throw new Error('Footwear not provided in route');
                if (!data.head_id) throw new Error('Head_id not provided in route');
                if (!data.body_id) throw new Error('Body_id not provided in route');
                if (!data.leg_id) throw new Error('Leg_id not provided in route');
                if (!data.foot_id) throw new Error('Foot_id not provided in route');
            } catch (e) {
                res.status(400).json({ error: e });
            }

            try {
                data.headwear = validString(data.headwear);
            } catch (e) {
                res.status(400).json({ error: e });
            }
            try {
                data.head_id = validString(data.head_id);
            } catch (e) {
                res.status(400).json({ error: e });
            }
            try {
                data.bodywear = validString(data.bodywear);
            } catch (e) {
                res.status(400).json({ error: e });
            }
            try {
                data.body_id = validString(data.body_id);
            } catch (e) {
                res.status(400).json({ error: e });
            }
            try {
                data.legwear = validString(data.legwear);
            } catch (e) {
                res.status(400).json({ error: e });
            }
            try {
                data.leg_id = validString(data.leg_id);
            } catch (e) {
                res.status(400).json({ error: e });
            }
            try {
                data.footwear = validString(data.footwear);
            } catch (e) {
                res.status(400).json({ error: e });
            }
            try {
                data.foot_id = validString(data.foot_id);
            } catch (e) {
                res.status(400).json({ error: e });
            }

            try {
                const newFitpost = await fp.createFP(
                    user.userId,
                    user.username,
                    data.headwear,
                    data.bodywear,
                    data.legwear,
                    data.footwear,
                    data.head_id,
                    data.body_id,
                    data.leg_id,
                    data.foot_id);
                res.status(200).redirect('/');
            } catch (e) {
                res.status(500).json({ error: e });
            }
        }
        else {
            res.status(500).send("Not logged in");
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