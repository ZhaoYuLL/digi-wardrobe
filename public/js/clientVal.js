
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

    $('#log-form').on('submit', function (event) {
      $('.error').remove();
      let errorCount = 0;

      let userName = $('#userName').val();
      if (!userName) {
        let error = "<div class='error'>Please enter a username</div>";
        $('#userName').after(error);
        errorCount++;
      } else {
        try {
          userName = validString(userName);
        } catch (e) {
          let error = "<div class='error'>Please input a valid username</div>";
          $('#userName').after(error);
          errorCount++;
        }
      }

      let password = $('#password').val();
      if (!password) {
        let error = "<div class='error'>Please enter a password</div>";
        $('#password').after(error);
        errorCount++;
      } else {
        try {
          password = validString(password);
        } catch (e) {
          let error = "<div class='error'>Please input a valid password</div>";
          $('#password').after(error);
          errorCount++;
        }
      }

      if (errorCount > 0) {
        event.preventDefault();
      }
    });
    console.log("hello");

  // Registration form validation
  $('#signup-form').on('submit', function (event) {
    $('.error').remove();
    let errorCount = 0;

    let userName = $('#userName').val();
    if (!userName) {
      let error = "<div class='error'>Please enter a username</div>";
      $('#userName').after(error);
      errorCount++;
    } else {
      try {
        userName = validString(userName);
      } catch (e) {
        let error = "<div class='error'>Please input a valid username</div>";
        $('#userName').after(error);
        errorCount++;
      }
    }

    let firstName = $('#firstName').val();
    if (!firstName) {
      let error = "<div class='error'>Please enter your first name</div>";
      $('#firstName').after(error);
      errorCount++;
    } else {
      try {
        firstName = validString(firstName);
      } catch (e) {
        let error = "<div class='error'>Please input a valid first name</div>";
        $('#firstName').after(error);
        errorCount++;
      }
    }

    let lastName = $('#lastName').val();
    if (!lastName) {
      let error = "<div class='error'>Please enter your last name</div>";
      $('#lastName').after(error);
      errorCount++;
    } else {
      try {
        lastName = validString(lastName);
      } catch (e) {
        let error = "<div class='error'>Please input a valid last name</div>";
        $('#lastName').after(error);
        errorCount++;
      }
    }

    let age = $('#age').val();
    if (!age) {
      let error = "<div class='error'>Please enter your age</div>";
      $('#age').after(error);
      errorCount++;
    } else {
      try {
        age = validString(age);
      } catch (e) {
        let error = "<div class='error'>Please input a valid age</div>";
        $('#age').after(error);
        errorCount++;
      }
    }

    let email = $('#email').val();
    if (!email) {
      let error = "<div class='error'>Please enter your email</div>";
      $('#email').after(error);
      errorCount++;
    } else {
      try {
        email = validString(email);
      } catch (e) {
        let error = "<div class='error'>Please input a valid email</div>";
        $('#email').after(error);
        errorCount++;
      }
    }

    let password = $('#password').val();
    if (!password) {
      let error = "<div class='error'>Please enter a password</div>";
      $('#password').after(error);
      errorCount++;
    } else {
      try {
        password = validString(password);
      } catch (e) {
        let error = "<div class='error'>Please input a valid password</div>";
        $('#password').after(error);
        errorCount++;
      }
    }

    let confirmPassword = $('#confirmPassword').val();
    if (!confirmPassword) {
      let error = "<div class='error'>Please confirm your password</div>";
      $('#confirmPassword').after(error);
      errorCount++;
    } else {
      try {
        confirmPassword = validString(confirmPassword);
      } catch (e) {
        let error = "<div class='error'>Please input a valid confirmation password</div>";
        $('#confirmPassword').after(error);
        errorCount++;
      }
    }

    if (password !== confirmPassword) {
      let error = "<div class='error'>Passwords do not match</div>";
      $('#confirmPassword').after(error);
      errorCount++;
    }

    let bio = $('#bio').val();
    if (!bio) {
      let error = "<div class='error'>Please enter a bio</div>";
      $('#bio').after(error);
      errorCount++;
    } else {
      try {
        bio = validString(bio);
      } catch (e) {
        let error = "<div class='error'>Please input a valid bio</div>";
        $('#bio').after(error);
        errorCount++;
      }
    }

    if (errorCount > 0) {
      event.preventDefault();
    }
  })
  })(window.jQuery);
