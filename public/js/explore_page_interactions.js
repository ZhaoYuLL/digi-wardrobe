



document.addEventListener('DOMContentLoaded', function() {
    const fitpostElements = document.querySelectorAll('.fitpost');
    let likeButtons = [];
    let saveButtons = [];
    fitpostElements.forEaattributech(fitpostElement => {
        // make buttons for each post and append it to a list
        const fitpostId = fitpostElement.id;
        let newLike = document.querySelector(`.like#${fitpostId}`);
        let newSave = document.querySelector(`.save#${fitpostId}`);
        likeButtons.append(newLike);
        saveButtons.append(newSave);

        
        //console.log(fitpostId);
    });
});
