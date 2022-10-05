const submitButton = document.getElementById('button-newpost');
console.log(submitButton);
submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    const submitMessage = document.getElementById('newpost-message').value
    console.log(submitMessage)
    fetch('http://localhost:3000/api/post/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    message: submitMessage
                })
    })
        .then((res) => res.json())
})
