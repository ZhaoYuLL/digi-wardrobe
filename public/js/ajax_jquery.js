

// $(document).ready(function() {
//     // Get the modal and the close button
//     var modal = document.getElementById("editFitpostModal");
//     var closeBtn = document.getElementsByClassName("close")[0];
  
//     function populateDropdown(selectElement, outfitType, fitpostId) {
//         $.ajax({
//           url: "/index/closet",
//           method: "GET",
//           success: function (outfitPieces) {
//             console.log("Received outfitPieces:");
//             // Clear previous options
//             selectElement.empty();
      
//             // Add a default option
//             selectElement.append($("<option>", { value: "", text: "Select an option" }));
      
//             // Add options based on the retrieved outfitPieces
//             outfitPieces.forEach(piece => {
//               var optionText = `${piece.imageName} (${piece.caption})`;
//               var option = $("<option>", { value: JSON.stringify(piece), text: optionText });
//               selectElement.append(option);
//             });
//           },
//           error: function (xhr, status, error) {
//             console.error("Error fetching outfit pieces:", error);
//           },
//         });
//       }
    
//       // When the user clicks the "Edit" button, open the modal and populate the dropdowns
//   $(".edit-fitpost").click(function () {
//     var fitpostId = $(this).data("fitpost-id");
//     $("#editFitpostId").val(fitpostId);

//     // Show the modal
//     $("#editFitpostModal").css("display", "block");

//     // Populate dropdowns after the modal is shown
//     populateDropdown($("#editHeadwearSelect"), "head", fitpostId);
//     populateDropdown($("#editBodywearSelect"), "body", fitpostId);
//     populateDropdown($("#editLegwearSelect"), "leg", fitpostId);
//     populateDropdown($("#editFootwearSelect"), "foot", fitpostId);
//   });

  
//     // When the user clicks on the close button, close the modal
    // closeBtn.onclick = function() {
    //   modal.style.display = "none";
    // }
  
//   });



// Delete fitpost
const deleteButtons = document.querySelectorAll('.delete-fitpost');
deleteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const fitpostId = button.dataset.fitpostId;
    const fitpostElement = button.closest('.fitpost'); // Get the parent .fitpost element

    if (confirm('Are you sure you want to delete this fitpost?')) {
      fetch(`/fitposts/${fitpostId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          // Remove the deleted fitpost from the UI
          console.log(data.message);
          fitpostElement.remove(); // Remove the corresponding .fitpost element from the DOM
        })
        .catch((error) => {
          console.error('Error deleting fitpost:', error);
        });
    }
  });
});