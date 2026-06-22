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
import './styles/components.css';
import './styles/battle.css';
import './styles/tower.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
