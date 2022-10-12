const start = () => {

    const getToken = JSON.parse(localStorage.getItem('Token'));

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
            console.log(posts);
            let container = document.getElementById("posts");

            for(post of posts) {

                const timePost = new Date(post.time);

                const year = timePost.getFullYear(); 
                const month = (timePost.getMonth()+1).toString().padStart(2, "0");
                const day = timePost.getDate().toString().padStart(2, "0");
                const hour = timePost.getHours().toString().padStart(2, "0");
                const minute = timePost.getMinutes().toString().padStart(2, "0");
            
                container.insertAdjacentHTML('beforeend', `
                    <a href="post.html?id=${post._id}" class="post">
                        <h2 class="post__author">Tom Tournillon</h2>
                        <p class="post__message">${post.message}</p>
                        <div class="post__actions">
                            <i class="fa-regular fa-comment"></i>
                            <p class="post__actions__number-replies">${post.replies}</p>
                            <i class="fa-regular fa-thumbs-up"></i>
                            <p class="post__actions__number-likes">${post.likes}</p>
                            <p>${day}/${month}/${year} ${hour}:${minute}</p>
                        </div>
                    </a>`
                )
            };
        })
}

window.addEventListener('load', start)

const logoutButton = document.getElementById('button-logout');
logoutButton.addEventListener('click', function (event) {
    event.preventDefault();

        localStorage.clear();
        window.location.href = 'welcome.html'
})