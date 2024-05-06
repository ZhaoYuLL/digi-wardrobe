(function () {

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
        $('#error').remove();

        let errorCount = 0;
        const image = $('#image').val();
        if (!image) {
            let error = "<div id='error'>Please upload an image</div>";
            $('#image').after(error);
            errorCount++;
        }
        const outfitType = $('#outfitType').val();
        outfitType = validString(outfitType);
        if (!outfitType) {
            let error = "<div id='error'>Must select a clothing type</div>";
            $('#outfitType').after(error);
            errorCount++;
        }
        else {
            if (outfitType !== 'headwear' && outfitType !== "bodywear" && outfitType !== "legwear" && outfitType !== "footwear") {
                let error = "<div id='error'>Not a valid clothing type! How did that happen???</div>";
                $('#outfitType').after(error);
                errorCount++;
            }
        }
        const caption = $('#caption').val();
        caption = validString(caption);
        if (!caption) {
            let error = "<div id='error'>Please include a caption or description</div>";
            $('#outfitType').after(error);
            errorCount++;
        }
        const link = $('#link').val();
        link = validString(link);
        if (!link) {
            let error = "<div id='error'>Please include a link for your clothing source</div>";
            $('#outfitType').after(error);
            errorCount++;
        }

        if (errorCount > 0) {
            event.preventDefault();
        }
    })
})();