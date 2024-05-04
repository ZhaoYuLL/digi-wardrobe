document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('log-form');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const userName = formData.get('userName');
        const password = formData.get('password');

        const requestData = JSON.stringify({ userName, password });

        $.ajax({
            method: 'POST',
            url: '/login',
            contentType: 'application/json',
            data: requestData,
            success: function(responseMessage) {
                // Redirect to user profile on successful login
                window.location.href = '/userProfile';
            },
            error: function(xhr, textStatus, errorThrown) {
                errorMessage.textContent = xhr.responseJSON.error || 'Something went wrong!';
            }
        });
    });
});
