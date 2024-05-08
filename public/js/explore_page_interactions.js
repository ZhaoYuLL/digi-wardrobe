/*import { fitposts } from "../../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import * as fp from '../../data/fitposts.js';*/

(function ($) {
  const routing = "/fitposts";
  let likeButtons = $(".like"),
    saveButtons = $(".save");
  (dropdown = $(".wardrobe-select")), (closetButtons = $(".closet"));

  //dropdown.hide();

  likeButtons.on("click", function (event) {
    event.preventDefault();
    console.log("like button clicked");
    let currentId = $(this).attr("id").substring(5);
    console.log(currentId);
    let requestConfig = {
      method: "POST",
      url: `${routing}/like`,
      contentType: "application/json",
      data: JSON.stringify({ fitpostId: currentId }),
    };

    $.ajax(requestConfig).then(function (response) {
      //let likenum = $(`.like_num#like-${currentId}`);
      let likenum = document.querySelector(`.like_num#likenum-${currentId}`);
      likenum.innerHTML = `likes: ${response.likes}`;
      //console.log('likenum', likenum);
    });
  });

  saveButtons.on("click", function (event) {
    event.preventDefault();
    let currentId = $(this).attr("id").substring(5);
    //console.log(currentId);
    let dropdown = $(`.wardrobe-select#dropdown-${currentId}`);
    let drobeId = dropdown.val();
    console.log(dropdown.val());
    let newWardrobeName = "";

    if (drobeId === "new") {
      let input = $(`.new-wardrobe-input#input-${currentId}`);
      input.val("");
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
    } else {
      // adding fp to existing wardrobe
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
      $.ajax(requestConfig).then(function (response) {});
    }
    $(".wardrobe-select").val("new");
  });

  closetButtons.on("click", function (event) {
    event.preventDefault();
    let pieceId = $(this).attr("id").substring(7);
    console.log(pieceId);
    let requestConfig = {
      method: "POST",
      url: `${routing}/closet`,
      contentType: "application/json",
      data: JSON.stringify({ pid: pieceId }),
    };
    $.ajax(requestConfig).then(function (response) {
      console.log("updated closet");
    });
  });
})(window.jQuery);
