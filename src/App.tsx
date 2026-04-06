import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Inicio } from './pages/Inicio';
import { Videos } from './pages/Videos';
import { Flyers } from './pages/Flyers';
import { Comunidad } from './pages/Comunidad';
import { Perfil } from './pages/Perfil';
import { PanelCreador } from './pages/PanelCreador';
import { Guardados } from './pages/Guardados';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="videos" element={<Videos />} />
          <Route path="flyers" element={<Flyers />} />
          <Route path="comunidad" element={<Comunidad />} />
          <Route path="creador" element={<PanelCreador />} />
          <Route path="guardados" element={<Guardados />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
