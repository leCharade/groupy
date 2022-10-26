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

  if (localStorage.getItem('Token') === null) {
    return (
      <>
      <header>
        <img className="logo" src={Logo} alt="Logo Groupy" title="Logo Groupy"/>
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
          <Route path="/post.html" element={<Post post={post}/>}/>
        </Routes>
      </>
    )
  }
}

export default App;
