import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage';
import PrivateRoutes from './utils/PrivateRoutes';
import { PostProvider } from './context/PostContext';
import ThreadPage from './pages/ThreadPage';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <PostProvider>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route element={<PrivateRoutes />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/thread/:username' element={<ThreadPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </PostProvider>
    </BrowserRouter>
  );
}

export default App;
