import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';
import './index.css';

function renderFatalError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : null;
  const isDebugMode = new URLSearchParams(window.location.search).has('debug');

  document.body.innerHTML = `
    <main style="
      min-height: 100vh;
      padding: 24px;
      display: grid;
      place-items: center;
      background: #f4f5ef;
      color: #111827;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <section style="
        width: min(100%, 520px);
        border-radius: 24px;
        padding: 24px;
        background: #ffffff;
        box-shadow: 0 18px 45px rgba(23, 27, 95, 0.14);
      ">
        <span style="
          display: inline-flex;
          margin-bottom: 12px;
          color: #d8242f;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        ">
          Erro ao carregar
        </span>

        <h1 style="
          margin: 0 0 12px;
          color: #171b5f;
          font-size: 28px;
          line-height: 1;
        ">
          Não foi possível abrir o app
        </h1>

        <p style="
          margin: 0 0 16px;
          color: #667085;
          line-height: 1.5;
        ">
          Ocorreu um erro de JavaScript durante o carregamento.
        </p>

        <pre style="
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
          border-radius: 16px;
          padding: 14px;
          background: #111827;
          color: #ffffff;
          font-size: 12px;
          line-height: 1.5;
        ">${escapeHtml(isDebugMode ? stack ?? message : message)}</pre>

        ${
          isDebugMode
            ? ''
            : `<p style="margin: 14px 0 0; color: #667085; font-size: 13px;">
                Para ver mais detalhes, abra o site com <strong>?debug=1</strong> no final da URL.
              </p>`
        }
      </section>
    </main>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function bootstrap() {
  try {
    const { default: App } = await import('./App.tsx');

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <BrowserRouter>
          <Toaster
            position="bottom-right"
            duration={4200}
            style={{
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(18px)',
              border: '1px solid rgba(20, 33, 61, 0.1)',
              borderLeft: '5px solid var(--color-blue)',
              borderRadius: '18px',
              padding: '14px 16px',
              boxShadow: '0 18px 48px rgba(20, 33, 61, 0.2)',
            }}
          />
          <App />
        </BrowserRouter>
      </StrictMode>
    );
  } catch (error) {
    renderFatalError(error);
  }
}

window.addEventListener('error', (event) => {
  renderFatalError(event.error ?? event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  renderFatalError(event.reason);
});

void bootstrap();