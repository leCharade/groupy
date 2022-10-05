const start = () => {

    const getToken = JSON.parse(localStorage.getItem('Token'));
    console.log(getToken);
    console.log(getToken['token']);

    fetch('http://localhost:3000/api/post/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getToken['token'],
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((posts) => {

            let container = document.getElementById("posts");

            for(post of posts) {
                container.insertAdjacentHTML('beforeend', `
                    <a href="post.html?id=${post._id}" class="post">
                        <h2 class="post__author">Tom Tournillon</h2>
                        <p class="post__message">${post.message}</p>
                        <div class="post__actions">
                            <i class="fa-regular fa-comment"></i>
                            <p class="post__actions__number-replies">${post.replies}</p>
                            <i class="fa-regular fa-thumbs-up"></i>
                            <p class="post__actions__number-likes">${post.likes}</p>
                            <p>${Date()}</p>
                        </div>
                    </a>`
                )
                console.log(post.replies)
            };
        })
}

window.addEventListener('load', start)