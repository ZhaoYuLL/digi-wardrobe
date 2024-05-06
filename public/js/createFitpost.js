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
            $('#head_id').val(id);
            $('#headwear').val(image);
        }
        else if (type === 'bodywear') {
            $('#body_id').val(id);
            $('#bodywear').val(image);
        }
        else if (type === 'legwear') {
            $('#leg_id').val(id);
            $('#legwear').val(image);
        }
        else if (type === 'footwear') {
            $('#foot_id').val(id);
            $('#footwear').val(image);
        }
    }

    // initialize which outfit pieces are displayed and input values
    let initialHead = $("#head").children().first().attr('data-active', 'true');
    let head_id = initialHead[0].children[0].getAttribute('data-id');
    let head_url = initialHead[0].children[0].getAttribute('data-name');
    changeInputValue('headwear', head_id, head_url);

    let initialBody = $("#body").children().first().attr('data-active', 'true');
    let body_id = initialBody[0].children[0].getAttribute('data-id');
    let body_url = initialBody[0].children[0].getAttribute('data-name');
    changeInputValue('bodywear', body_id, body_url);

    let initialLeg = $("#leg").children().first().attr('data-active', 'true');
    let leg_id = initialLeg[0].children[0].getAttribute('data-id');
    let leg_url = initialLeg[0].children[0].getAttribute('data-name');
    changeInputValue('legwear', leg_id, leg_url);

    let initialFoot = $("#foot").children().first().attr('data-active', 'true');
    let foot_id = initialFoot[0].children[0].getAttribute('data-id');
    let foot_url = initialFoot[0].children[0].getAttribute('data-name');
    changeInputValue('footwear', foot_id, foot_url);


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
        const button = $(this);
        const buttonType = button.data('id');
        const offset = buttonType === "prev" ? -1 : 1;
        //console.log(offset);

        const slides = button.closest('div').find('li');
        if (slides.length > 1) {
            const activeSlide = findElementWithAttribute(slides, 'data-active');
            // loop through all outfit pieces
            let newIndex = button.closest('div').find('li').index(activeSlide) + offset;
            if (newIndex < 0) newIndex = slides.length - 1;
            if (newIndex >= slides.length) newIndex = 0;
            //console.log("from " + button.closest('div').find('li').index(activeSlide) + " to " + newIndex);
            // reassign the data-active attribute to the new selected outfit piece
            let newActive = slides[newIndex];
            newActive.setAttribute('data-active', 'true');
            console.log(activeSlide);
            activeSlide.removeAttribute('data-active');

            const currentId = newActive.children[0].getAttribute('data-id');
            const currentUrl = newActive.children[0].getAttribute('data-name');
            const outfitType = button.data('part');

            changeInputValue(outfitType, currentId, currentUrl);
        }

    })

    $("#createFitpost").on("submit", (event) => {
        $('.error').remove();

        let errorCount = 0;

        const headwear = $('#headwear').val().trim();
        headwear = validString(headwear);
        const head_id = $('#head_id').val().trim();
        head_id = validString(head_id);
        if (!headwear || !head_id) {
            let error = "<div class='error'>Can't create fitpost with no headwear</div>";
            $('#headwear-slider').after(error);
            errorCount++;
        }
        const bodywear = $('#bodywear').val().trim();
        bodywear = validString(bodywear);
        const body_id = $('#body_id').val().trim();
        body_id = validString(body_id);
        if (!bodywear || !body_id) {
            let error = "<div class='error'>Can't create fitpost with no top</div>";
            $('#bodywear-slider').after(error);
            errorCount++;
        }
        const legwear = $('#legwear').val().trim();
        legwear = validString(legwear);
        const leg_id = $('#leg_id').val().trim();
        leg_id = validString(leg_id);
        if (!legwear || !leg_id) {
            let error = "<div class='error'>Can't create fitpost with no bottoms</div>";
            $('#legwear-slider').after(error);
            errorCount++;
        }
        const footwear = $('#footwear').val().trim();
        footwear = validString(footwear);
        const foot_id = $('#foot_id').val().trim();
        foot_id = validString(foot_id);
        if (!footwear || !foot_id) {
            let error = "<div class='error'>Can't create fitpost with no footwear</div>";
            $('#footwear-slider').after(error);
            errorCount++;
        }

        if (errorCount) {
            event.preventDefault();
        }

        console.log("reached the end of the form handler");
    })


})(window.jQuery);