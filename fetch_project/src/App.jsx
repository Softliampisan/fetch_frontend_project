import './App.css'
import Login from './components/auth/Login'
import Home from './components/Home'
import AvailableDogsPage from './components/pages/AvailableDogsPage'
import MyFavorites from './components/pages/MyFavorites'
import { BrowserRouter, Route, Routes } from 'react-router';
import Navbar from './components/structural/NavBar'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/available_dogs' element={<AvailableDogsPage />} />
          <Route path='/favorites' element={<MyFavorites />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
