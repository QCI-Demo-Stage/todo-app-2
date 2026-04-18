import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
        position="top-center"
        closeOnClick
        pauseOnHover
        role="status"
        aria-live="polite"
        theme="light"
      />
    </Provider>
  </StrictMode>,
);
