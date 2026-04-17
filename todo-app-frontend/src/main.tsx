import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { store } from './store';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
        position="top-center"
        closeOnClick
        pauseOnFocusLoss
        draggable={false}
        newestOnTop
        role="status"
        aria-live="polite"
      />
    </Provider>
  </StrictMode>,
);
