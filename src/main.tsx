import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// Catch & hiển thị lỗi runtime trong dev (giúp debug Gold Flow)
window.addEventListener('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('[window.error]', e.error ?? e.message);
});
window.addEventListener('unhandledrejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('[unhandledrejection]', e.reason);
});

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('[createRoot error]', err);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<pre style="color:red;padding:20px;font-family:monospace;white-space:pre-wrap;">${
      (err instanceof Error ? err.stack : String(err)) ?? 'Unknown error'
    }</pre>`;
  }
}
