/*import { fitposts } from "../../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import * as fp from '../../data/fitposts.js';*/



(function ($) {
    const routing = '/fitposts';
    let likeButtons = $('.like'),
        saveButtons = $('.save')
        dropdown = $('.wardrobe-select'),
        closetButtons = $('.closet'),
        followButtons = $('.follow'),
        unfollowButtons = $('.unfollow'),
        doc = $('.fitposts');
    
    followButtons.hide();
    unfollowButtons.hide();

    let loggedUser = doc.attr('id');

    let requestConfig = {
        method: 'GET',
        url: `${routing}/profile`
        };


    $.ajax(requestConfig).then(function (response) {
        console.log('this is user', response);
        let following = response.following;
        loggedUser = response._id;
        console.log(loggedUser);

        for (let button of followButtons) {
            let $button = $(button); // Wrap the button with jQuery
            if ($button.attr('data-part') !== loggedUser){
                if (following.includes($button.attr('data-part'))) {
                    continue;
                } else {
                    console.log('display button');
                    $button.show();
                }
            }
        }
    
        for (let button of unfollowButtons) {
            let $button = $(button); // Wrap the button with jQuery
            if ($button.attr('data-part') !== loggedUser){
                if (following.includes($button.attr('data-part'))) {
                    $button.show();
                } else {
                    continue;
                }
            }
        }
    });



    

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
        //console.log(currentId);
        let dropdown = $(`.wardrobe-select#dropdown-${currentId}`);
        let drobeId = dropdown.val();
        console.log(dropdown.val());
        let newWardrobeName = '';

        if (drobeId === 'new') {
            let input = $(`.new-wardrobe-input#input-${currentId}`);
            input.val('');
            input.show();
            newWardrobeName = input.val();
            input.focus(); 
            // wait for user input
      let ajaxInProgress = false; // Flag variable to track AJAX request status

      input.on("keypress", function (event) {
        if (event.which === 13 && !ajaxInProgress) {
          event.preventDefault();
          let newWardrobeName = input.val();
          console.log(newWardrobeName);
          if (typeof newWardrobeName !== "string" || !newWardrobeName) {
            alert("invalid naming");
          } else {
            let inputTrim = newWardrobeName.trim();
            if (inputTrim.length === 0) {
              alert("no name was entered");
            }
            newWardrobeName = inputTrim;
          }

          let requestData = {
            fitpostId: currentId,
            wardrobeId: drobeId,
            newName: newWardrobeName,
          };

          let requestConfig = {
            method: "POST",
            url: `${routing}/save`,
            contentType: "application/json",
            data: JSON.stringify(requestData),
          };

          ajaxInProgress = true; // Set the flag to indicate AJAX request in progress

          $.ajax(requestConfig)
            .then(function (response) {
              console.log("response");
              if (response === "Duplicate") {
                alert("Cannot have duplicate wardrobenames");
                ajaxInProgress = false;
              } else {
                let newOption = `<option value="${response._id}">${response.wardrobeName}</option>`;
                $(".wardrobe-select").append(newOption);
                input.hide(); // Hide the input field
              }
            })
            .catch(function (error) {
              console.error("Error:", error);
            })
            .finally(function () {
              ajaxInProgress = false; // Reset the flag
            });
        }
      });
        }
        else { // adding fp to existing wardrobe
            let requestData = {
                fitpostId: currentId,
                wardrobeId: drobeId,
                newName: newWardrobeName
            };
        
            let requestConfig = {
                method: 'POST',
                url: `${routing}/save`,
                contentType: 'application/json',
                data: JSON.stringify(requestData)
            };
            $.ajax(requestConfig).then(function (response) { 
      
                console.log('updated wardrobe');
                
                
            });
            
        }
        $(".wardrobe-select").val("new");
    });



    closetButtons.on('click', function(event) {
        event.preventDefault();
        let pieceId = $(this).attr('id').substring(7);
        console.log(pieceId);
        let requestConfig = {
            method: 'POST',
            url: `${routing}/closet`,
            contentType: 'application/json',
            data: JSON.stringify({ pid: pieceId })
            };
        $.ajax(requestConfig).then(function (response) { 
            console.log('updated closet');
        });
        
    });


    followButtons.on('click', function(event) {
        let fid = $(this).attr('data-part');
        let requestConfig = {
            method: 'POST',
            url:   `${routing}/follow`,
            contentType: 'application/json',
            data: JSON.stringify({
                userId: loggedUser,
                followId: fid
            })
        };

        $.ajax(requestConfig).then(function (response) {
            console.log(response);
            let fbs = $(`.follow[data-part=${fid}]`);
            fbs.hide();
            let ubs = $(`.unfollow[data-part=${fid}]`)
            ubs.show();
        });
    });

    unfollowButtons.on('click', function(event) {
        let fid = $(this).attr('data-part');
        let requestConfig = {
            method: 'POST',
            url:   `${routing}/unfollow`,
            contentType: 'application/json',
            data: JSON.stringify({
                userId: loggedUser,
                followId: fid
            })
        };

        $.ajax(requestConfig).then(function (response) {
            console.log(response);
            let fbs = $(`.follow[data-part=${fid}]`);
            fbs.show();
            let ubs = $(`.unfollow[data-part=${fid}]`)
            ubs.hide();
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