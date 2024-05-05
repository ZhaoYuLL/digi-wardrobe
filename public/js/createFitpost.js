(function ($) {

    const changeInputValue = (type, id) => {
        // function to change the values of the hidden inputs
        if (type === 'headwear') {
            $('#headwear').val(id);
        }
        else if (type === 'bodywear') {
            $('#bodywear').val(id);
        }
        else if (type === 'legwear') {
            $('#legwear').val(id);
        }
        else if (type === 'footwear') {
            $('#footwear').val(id);
        }
    }

    // initialize which outfit pieces are displayed and input values
    let initialHead = $("#head").children().first().attr('data-active', 'true');
    let head_id = initialHead[0].children[0].getAttribute('data-id');
    changeInputValue('headwear', head_id);

    let initialBody = $("#body").children().first().attr('data-active', 'true');
    let body_id = initialBody[0].children[0].getAttribute('data-id');
    changeInputValue('bodywear', body_id);

    let initialLeg = $("#leg").children().first().attr('data-active', 'true');
    let leg_id = initialLeg[0].children[0].getAttribute('data-id');
    changeInputValue('legwear', leg_id);

    let initialFoot = $("#foot").children().first().attr('data-active', 'true');
    let foot_id = initialFoot[0].children[0].getAttribute('data-id');
    changeInputValue('footwear', foot_id);


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

        const slides = button.closest('div').find('li');
        if (slides.length > 1) {
            const activeSlide = findElementWithAttribute(slides, 'data-active');
            // loop through all outfit pieces
            let newIndex = $('li').index(activeSlide) + offset;
            if (newIndex < 0) newIndex = slides.length - 1;
            if (newIndex >= slides.length) newIndex = 0;

            // reassign the data-active attribute to the new selected outfit piece
            let newActive = slides[newIndex];
            newActive.setAttribute('data-active', 'true');
            activeSlide.removeAttribute('data-active');

            const currentId = newActive.children[0].getAttribute('data-id');
            //console.log(currentId);
            const outfitType = button.data('part');

            changeInputValue(outfitType, currentId);
        }

    })

    $("#createFitpost").on("submit", (event) => {
        // TODO: add user id and url fields?
        let errorCount = 0;

        const headwear = $('#headwear').val().trim();
        if (!headwear) {
            let error = "<div id='error'>Can't create fitpost with no headwear</div>";
            $('#headwear').after(error);
            errorCount++;
        }
        if (!bodywear) {
            let error = "<div id='error'>Can't create fitpost with no top</div>";
            $('#bodywear').after(error);
            errorCount++;
        }
        if (!legwear) {
            let error = "<div id='error'>Can't create fitpost with no bottoms</div>";
            $('#legwear').after(error);
            errorCount++;
        }
        if (!footwear) {
            let error = "<div id='error'>Can't create fitpost with no footwear</div>";
            $('#footwear').after(error);
            errorCount++;
        }

        if (errorCount) {
            event.preventDefault();
        }

    })


})(window.jQuery);