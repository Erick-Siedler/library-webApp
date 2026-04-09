import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="app-shell">
      <section className="panel not-found-card">
        <p className="error-code">404</p>
        <h1 className="panel-title">Pagina nao encontrada</h1>
        <p className="panel-subtitle">Essa rota nao existe neste projeto.</p>
        <Link className="link-btn" to="/">
          Voltar para login
        </Link>
      </section>
    </main>
  )
}
