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

    $('#createOutfitPiece').on("submit", function (event) {
        $('.error').remove();

        let errorCount = 0;
        const image = $('#image').val();
        if (!image) {
            let error = "<div class='error'>Please upload an image</div>";
            $('#image').after(error);
            errorCount++;
        }
        let outfitType = $('#outfitType').val();
        if (!outfitType) {
            let error = "<div class='error'>Must select a clothing type</div>";
            $('#outfitType').after(error);
            errorCount++;
        }
        else {
            try {
                outfitType = validString(outfitType);
            } catch (e) {
                let error = "<div class='error'>Please input a valid string</div>";
                $('#outfitType').after(error);
                errorCount++;
            }
            if (outfitType !== 'head' && outfitType !== "body" && outfitType !== "leg" && outfitType !== "foot") {
                let error = "<div class='error'>Not a valid clothing type! How did that happen???</div>";
                $('#outfitType').after(error);
                errorCount++;
            }
        }
        let caption = $('#caption').val();
        if (!caption) {
            let error = "<div class='error'>Please include a caption or description</div>";
            $('#caption').after(error);
            errorCount++;
        }
        else {
            try {
                caption = validString(caption);
            } catch (e) {
                let error = "<div class='error'>Please input a valid string</div>";
                $('#caption').after(error);
                errorCount++;
            }
        }
        let link = $('#link').val();
        if (!link) {
            let error = "<div class='error'>Please include a link for your clothing source</div>";
            $('#link').after(error);
            errorCount++;
        }
        else {
            try {
                link = validString(link);
            } catch (e) {
                let error = "<div class='error'>Please input a valid link</div>";
                $('#link').after(error);
                errorCount++;
            }
        }

        if (errorCount > 0) {
            event.preventDefault();
        }
    })
})(window.jQuery);