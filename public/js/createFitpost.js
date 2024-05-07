(function ($) {

    const validString = (input) => {
        if (typeof input !== "string" || !input) {
            throw `${input || "Provided variable"} is not a string`;
        } else {
            let inputTrim = input.trim();
            if (inputTrim.length === 0) {
                throw "Provided variable is not a string";
            }
            return inputTrim;
        }
    };

    const changeInputValue = (type, id, image) => {
        // function to change the values of the hidden inputs
        if (type === 'headwear') {
            $('#headid').val(id);
            $('#headwear').val(image);
        }
        else if (type === 'bodywear') {
            $('#bodyid').val(id);
            $('#bodywear').val(image);
        }
        else if (type === 'legwear') {
            $('#legid').val(id);
            $('#legwear').val(image);
        }
        else if (type === 'footwear') {
            $('#footid').val(id);
            $('#footwear').val(image);
        }
    }

    // initialize which outfit pieces are displayed and input values
    if ($("#head").children().length === 0) {
        let placeholder = "<li>No headwear! Try uploading one <a href='/outfitpieces'>here</a>!</li>"
        $("#head").after(placeholder);
    }
    else {
        let initialHead = $("#head").children().first().attr('data-active', 'true');
        let head_id = initialHead[0].children[0].getAttribute('data-id');
        let head_url = initialHead[0].children[0].getAttribute('data-name');
        changeInputValue('headwear', head_id, head_url);
    }

    if ($("#body").children().length === 0) {
        let placeholder = "<li>No bodywear! Try uploading one <a href='/outfitpieces'>here</a>!</li>"
        $("#body").after(placeholder);
    }
    else {
        let initialBody = $("#body").children().first().attr('data-active', 'true');
        let body_id = initialBody[0].children[0].getAttribute('data-id');
        let body_url = initialBody[0].children[0].getAttribute('data-name');
        changeInputValue('bodywear', body_id, body_url);
    }

    if ($("#leg").children().length === 0) {
        let placeholder = "<li>No legwear! Try uploading one <a href='/outfitpieces'>here</a>!</li>"
        $("#leg").after(placeholder);
    }
    else {
        let initialLeg = $("#leg").children().first().attr('data-active', 'true');
        let leg_id = initialLeg[0].children[0].getAttribute('data-id');
        let leg_url = initialLeg[0].children[0].getAttribute('data-name');
        changeInputValue('legwear', leg_id, leg_url);
    }

    if ($("#foot").children().length === 0) {
        let placeholder = "<li>No footwear! Try uploading one <a href='/outfitpieces'>here</a>!</li>"
        $("#foot").after(placeholder);
    }
    else {
        let initialFoot = $("#foot").children().first().attr('data-active', 'true');
        let foot_id = initialFoot[0].children[0].getAttribute('data-id');
        let foot_url = initialFoot[0].children[0].getAttribute('data-name');
        changeInputValue('footwear', foot_id, foot_url);
    }

    const findElementWithAttribute = (item, attribute) => {
        // get the child with the target attribute
        for (let i = 0; i < item.length; i++) {
            let element = item[i];
            let hasAttribute = element.getAttribute(attribute);
            if (hasAttribute) return element;
        }
        return undefined;
    }

    $(".slide-button").on("click", function () {
        // prev and next button click handler
        let button = $(this);
        let buttonType = button.data('id');
        let offset = buttonType === "prev" ? -1 : 1;
        //console.log(offset);

        let slides = button.closest('div').find('li');
        if (slides.length > 1) {
            let activeSlide = findElementWithAttribute(slides, 'data-active');
            // loop through all outfit pieces
            let newIndex = button.closest('div').find('li').index(activeSlide) + offset;
            if (newIndex < 0) newIndex = slides.length - 1;
            if (newIndex >= slides.length) newIndex = 0;
            //console.log("from " + button.closest('div').find('li').index(activeSlide) + " to " + newIndex);
            // reassign the data-active attribute to the new selected outfit piece
            let newActive = slides[newIndex];
            newActive.setAttribute('data-active', 'true');
            //console.log(activeSlide);
            activeSlide.removeAttribute('data-active');

            let currentId = newActive.children[0].getAttribute('data-id');
            let currentUrl = newActive.children[0].getAttribute('data-name');
            let outfitType = button.data('part');

            changeInputValue(outfitType, currentId, currentUrl);
        }

    })

    $("#createFitpost").on("submit", (event) => {
        $('.error').remove();

        let errorCount = 0;

        let headwear = $('#headwear').val().trim();
        let head_id = $('#headid').val().trim();
        if (!headwear || !head_id) {
            let error = "<div class='error'>Can't create fitpost with no headwear</div>";
            $('#headwear-slider').after(error);
            errorCount++;
        }
        else {
            try {
                headwear = validString(headwear);
                head_id = validString(head_id);
            } catch (e) {
                let error = "<div class='error'>Can't create fitpost with no headwear</div>";
                $('#headwear-slider').after(error);
                errorCount++;
            }
        }


        let bodywear = $('#bodywear').val().trim();
        let body_id = $('#bodyid').val().trim();
        if (!bodywear || !body_id) {
            let error = "<div class='error'>Can't create fitpost with no top</div>";
            $('#bodywear-slider').after(error);
            errorCount++;
        }
        else {
            try {
                bodywear = validString(bodywear);
                body_id = validString(body_id);
            } catch (e) {
                let error = "<div class='error'>Can't create fitpost with no top</div>";
                $('#bodywear-slider').after(error);
                errorCount++;
            }
        }

        let legwear = $('#legwear').val().trim();
        let leg_id = $('#legid').val().trim();
        if (!legwear || !leg_id) {
            let error = "<div class='error'>Can't create fitpost with no bottoms</div>";
            $('#legwear-slider').after(error);
            errorCount++;
        }
        else {
            try {
                legwear = validString(legwear);
                leg_id = validString(leg_id);
            } catch (e) {
                let error = "<div class='error'>Can't create fitpost with no bottoms</div>";
                $('#legwear-slider').after(error);
                errorCount++;
            }
        }

        let footwear = $('#footwear').val().trim();
        let foot_id = $('#footid').val().trim();
        if (!footwear || !foot_id) {
            let error = "<div class='error'>Can't create fitpost with no footwear</div>";
            $('#footwear-slider').after(error);
            errorCount++;
        }
        else {
            try {
                footwear = validString(footwear);
                foot_id = validString(foot_id);
            } catch (e) {
                let error = "<div class='error'>Can't create fitpost with no footwear</div>";
                $('#footwear-slider').after(error);
                errorCount++;
            }
        }
        if (errorCount) {
            event.preventDefault();
        }
        console.log("reached the end of the form handler");
    })


})(window.jQuery);