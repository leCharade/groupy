import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Timeline from './pages/Timeline';
import Post from './pages/Post';
import AddPost from './pages/AddPost';
import Settings from './pages/Settings';
import Menu from './components/Menu';
import Logo from './logo.png';
import './css/style.css';

import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [post, setPost] = useState();

  function handleSelectPost(post) {
    setPost(post);
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

const token = getCookie("token");

  if (token === "") {
    return (
      <>
      <header>
        <img className="logo" src={Logo} alt="Logo Groupomania" title="Logo Groupomania"/>
      </header>
      <div className="welcome">
        <section className="welcome__title">
            <h1>Connectez-vous au réseau Groupomania</h1>
        </section>
        <LogIn />
        <div className="welcome__verticalbar"></div>
        <SignUp />
      </div>
      </>
    );
  }
  else {
    return (
      <>
        <Menu />
        <Routes>
          <Route path="/timeline" element={<Timeline handleSelectPost={handleSelectPost}/>} />
          <Route path="/new" element={<AddPost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/post" element={<Post post={post}/>}/>
        </Routes>
      </>
    )
  }
}

export default App;
