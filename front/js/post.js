const url = new URL(window.location.href);
const postId = url.searchParams.get("id");

const getToken = JSON.parse(localStorage.getItem('Token'));

fetch(`http://localhost:3000/api/post/${postId}`, {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + getToken['token'],
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    })

    .then((res) => res.json())
    .then((post) => {
        console.log(post);
        document.getElementById("author--main")
        .innerText = post.authorName;
        document.getElementById("message--main")
        .innerText = post.post.message;
        document.getElementById("replies--main")
        .innerText = post.post.replies;
        document.getElementById("likes--main")
        .innerText = post.post.likes;
    })