const submitButton = document.getElementById('button-newpost');

const getToken = JSON.parse(localStorage.getItem('Token'));

submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    const post = {
        message: document.getElementById('message-newpost').value
        // file: document.getElementById('file-newpost').value
    };

//     let selectedFile = document.getElementById('file-newpost');
//     let file = selectedFile.files[0];
// console.log(file);
    // const formData = new FormData();

	// formData.append('File', file);
    // formData.append('Body', 'test');

    fetch('http://localhost:3000/api/post/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + getToken['token'],
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(post)
    })
        .then((res) => res.json())
})
