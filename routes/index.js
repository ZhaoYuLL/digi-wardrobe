import userRoutes from "./userRoutes.js";
import fitpostRoutes from "./fitpostRoutes.js";
import outfitPieceRoutes from "./outfitPieceRoutes.js";
import wardrobeRoutes from "./wardrobeRoutes.js";


const constructorMethod = (app) => {
    // just basic setup, feel free to change routes
    app.use('/fitposts', fitpostRoutes);
    app.use('/users', userRoutes);

    app.use('/public', staticDir('public'));
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;