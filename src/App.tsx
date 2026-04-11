import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Inicio } from './pages/Inicio';
import { Videos } from './pages/Videos';
import { Flyers } from './pages/Flyers';
import { Comunidad } from './pages/Comunidad';
import { Perfil } from './pages/Perfil';
import { Planes } from './pages/Planes';
import { PanelCreador } from './pages/PanelCreador';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { ViewVideo } from './pages/ViewVideo';
import { ViewFlyer } from './pages/ViewFlyer';
import { EditVideo } from './pages/EditVideo';
import { EditFlyer } from './pages/EditFlyer';
import { ScrollToTop } from './components/layout/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="videos" element={<Videos />} />
          <Route path="flyers" element={<Flyers />} />
          <Route path="comunidad" element={<Comunidad />} />
          <Route path="planes" element={<Planes />} />
          <Route path="creador" element={<PanelCreador />} />
          <Route path="admin" element={<Admin />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="view-video/:id" element={<ViewVideo />} />
          <Route path="view-flyer/:id" element={<ViewFlyer />} />
          <Route path="edit-video/:id" element={<EditVideo />} />
          <Route path="edit-flyer/:id" element={<EditFlyer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
