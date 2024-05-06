/*import { fitposts } from "../../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import * as fp from '../../data/fitposts.js';*/



(function ($) {
    const routing = '/fitposts';
    let likeButtons = $('.like'),
        saveButtons = $('.save');

  

    likeButtons.on('click', function(event) {
        event.preventDefault();
        console.log('like button clicked');
        let currentId = $(this).attr('id').substring(5);
        console.log(currentId);
        let requestConfig = {
            method: 'POST',
            url: `${routing}/like`,
            contentType: 'application/json',
            data: JSON.stringify({ fitpostId: currentId })
            };

        $.ajax(requestConfig).then(function (response) { 
            //let likenum = $(`.like_num#like-${currentId}`);
            let likenum = document.querySelector(`.like_num#likenum-${currentId}`);
            likenum.innerHTML = `likes: ${response.likes}`;
            //console.log('likenum', likenum);

        });
    });



    saveButtons.on('click', function(event) {
        event.preventDefault();
        let currentId = $(this).attr('id').substring(5);
        console.log(currentId);
        let requestConfig = {
            method: 'POST',
            url: `${routing}/save`,
            contentType: 'application/json',
            data: JSON.stringify({ fitpostId: currentId })
            };

        $.ajax(requestConfig).then(function (response) { 
            //let savenum = $(`.like_num#like-${currentId}`);
            let savenum = document.querySelector(`.save_num#savenum-${currentId}`);
            savenum.innerHTML = `saves: ${response.saves}`;

        });
    });

})(window.jQuery);



/*
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
            const likenum = document.getElementById('like_num');
            let num = parseInt(likenum.innerHTML.slice(7));
            likenum.innerHTML = `likes: ${num+1}`;
            console.log('num changed');
            
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
            const savenum = document.getElementById('save_num');
            let num = parseInt(savenum.innerHTML.slice(7));
            savenum.innerHTML = `saves: ${num+1}`;
            console.log('num changed');
    
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
*/