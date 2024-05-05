/*import { fitposts } from "../../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import * as fp from '../../data/fitposts.js';*/



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

    async function likeClick() {
        let currentId = this.id.substring(5);
        console.log("Like clicked!", currentId);
        
        try {
            await fetch('/fitposts/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fitpostId: currentId })
            });
            
        } catch (error) {
            throw(error);
        }
    }

    async function saveClick() {
        let currentId = this.id.substring(5);
        console.log("save clicked!", currentId);

        try {
            const response = await fetch('/fitposts/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fitpostId: currentId })
            });
    
        } catch (error) {
            throw(error);
        }
    }

    for (let i=0; i < likeButtons.length; i++) {
        let like = likeButtons[i];
        let save = saveButtons[i];

        like.addEventListener('click', likeClick);
        save.addEventListener('click', saveClick);
    }
});
