import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';
import { NotFound } from './pages/NotFound';

import { AuthContextProvider } from './contexts/AuthContext';



function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" caseSensitive element={<Home />} />
          <Route path="rooms/new" caseSensitive element={<NewRoom/>} />
          <Route path="rooms/:id" element={<Room/>} />
          <Route path="/admin/rooms/:id" element={<AdminRoom/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
