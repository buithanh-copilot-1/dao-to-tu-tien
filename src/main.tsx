import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

import './styles/global.css';
import './styles/layout.css';
import './styles/header.css';
import './styles/navigation.css';
import './styles/panels.css';
import './styles/buttons.css';
import './styles/tabs.css';
import './styles/progress.css';
import './styles/items.css';
import './styles/equipment.css';
import './styles/components.css';
import './styles/icons.css';
import './styles/login.css';
import './styles/cultivation.css';
import './styles/battle.css';
import './styles/dungeon.css';
import './styles/tower.css';
import './styles/toast.css';
import './styles/settings.css';
import './styles/spiritRoot.css';
import './styles/alchemy.css';
import './styles/sect.css';
import './styles/technique.css';
import './styles/arena.css';

const SAVE_KEY = 'dao-to-tu-tien-save';
if (new URLSearchParams(window.location.search).get('clear-save') === '1') {
  localStorage.removeItem(SAVE_KEY);
  window.history.replaceState({}, '', window.location.pathname);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
