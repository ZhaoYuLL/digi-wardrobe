import { fitposts } from "../../config/mongoCollections.js";
import {ObjectId} from 'mongodb';



document.addEventListener('DOMContentLoaded', function() {
    const fitpostElements = document.querySelectorAll('.fitpost');
    let likeButtons = [];
    let saveButtons = [];
    fitpostElements.forEach(fitpostElement => {
        // make buttons for each post and append it to a list
        const fitpostId = fitpostElement.id;
        let newLike = document.querySelector(`.like#like-${fitpostId}`);
        let newSave = document.querySelector(`.save#save-${fitpostId}`);
        likeButtons.push(newLike);
        saveButtons.push(newSave);

    });

    function likeClick() {
        console.log("like clicked!");
    }

    function saveClick() {
        console.log("save clicked!");
    }

    for (let i=0; i < likeButtons.length; i++) {
        let like = likeButtons[0];
        let save = saveButtons[0];

        like.addEventListener('click', likeClick);
        save.addEventListener('click', saveClick)
    }
});
