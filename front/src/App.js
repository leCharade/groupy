import Welcome from './pages/Welcome';
import Timeline from './pages/Timeline';
import AddPost from './pages/AddPost';
import Settings from './pages/Settings';
import Menu from './components/Menu';
import './css/style.css';

import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [posts, setPosts] = useState([]);

  const connected = true;

  function handleAddPost(post) {
    setPosts([...posts, post]);
  }
  
  if (connected === true) {
    return (
      <Welcome />
    );
  }
  else {
    return (
      <>
        <Menu />
        <Routes>
          <Route path="/timeline" element={<Timeline posts={posts}/>} />
          <Route path="/new" element={<AddPost handleAddPost={handleAddPost}/>} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </>
    )
  }
}

export default App;
