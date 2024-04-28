console.log("yay");

document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners to the buttons
  var buttons = document.getElementsByClassName("next-button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", validateRegistrationForm);
  }
  var buttons = document.getElementsByClassName("prev-button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", bye);
  }
});

function validateRegistrationForm(event) {
  console.log("hi");
  // Add your validation logic here
}
function bye(event) {
  console.log("bye");
  // Add your validation logic here
}
//   const wardrobes = {{{wardrobes}}};
//   console.log(wardrobes);
//   let currentIndexes = {
//     head: 0,
//     body: 0,
//     legs: 0,
//     feet: 0
//   };

//   function updatePreview() {
//     const wardrobe = wardrobes[0];
//     const fitpost = wardrobe.fitposts[0];
//     console.log(fitpost);
//     document.getElementById('preview-head').textContent = fitpost.headUrl;
//     document.getElementById('preview-body').textContent = fitpost.bodyUrl;
//     document.getElementById('preview-legs').textContent = fitpost.legUrl;
//     document.getElementById('preview-feet').textContent = fitpost.footUrl;
//   }

//   function handleClick(event) {
//     const part = event.target.getAttribute('data-part');
//     const fitposts = wardrobes[0].fitposts;

//     if (event.target.classList.contains('prev-button')) {
//       currentIndexes[part] = (currentIndexes[part] - 1 + fitposts.length) % fitposts.length;
//     } else if (event.target.classList.contains('next-button')) {
//       currentIndexes[part] = (currentIndexes[part] + 1) % fitposts.length;
//     }

//     const fitpost = fitposts[currentIndexes[part]];
//     document.getElementById(`preview-${part}`).textContent = fitpost[`${part}Url`];
//   }

//   document.querySelectorAll('.prev-button, .next-button').forEach(button => {
//     button.addEventListener('click', handleClick);
//   });

//   updatePreview();
