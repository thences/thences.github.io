import { lazy, Suspense } from "react";
import { capabilities, profile, projects, stats } from "./content";

const DarkScene = lazy(() => import("./components/DarkScene"));

const backdropImages = [
  {
    src: "/images/dark/dark-03.jpg",
    className: "dark-backdrop__image dark-backdrop__image--beam",
  },
  {
    src: "/images/dark/dark-06.jpg",
    className: "dark-backdrop__image dark-backdrop__image--impact",
  },
  {
    src: "/images/dark/dark-10.jpg",
    className: "dark-backdrop__image dark-backdrop__image--portal",
  },
];

const projectImages = [
  "/images/projects/gestao-hospitalar.jpg",
  "/images/projects/controle-gastos.jpg",
  "/images/projects/foco-estudantes.jpg",
];

function App() {
  return (
    <div className="app-shell">
      <div className="dark-backdrop" aria-hidden="true">
        {backdropImages.map((image) => (
          <img key={image.src} className={image.className} src={image.src} alt="" />
        ))}
      </div>

      <Suspense fallback={null}>
        <DarkScene />
      </Suspense>
      <div className="atmosphere" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Ir para o início">
          <span className="brand-mark">MV</span>
          <span>{profile.name}</span>
        </a>
        <nav className="nav-links" aria-label="Navegação principal">
          <a href="#work">Projetos</a>
          <a href="#stack">Stack</a>
          <a
            className="resume-nav-link"
            href={profile.resumePath}
            download="Curriculo-Marcos-Vinicius-Longarai.pdf"
          >
            Currículo
          </a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero section-frame">
          <div className="hero-copy">
            <p className="eyebrow">Dark Portfolio / {profile.location}</p>
            <p className="recruiter-greeting">{profile.greeting}</p>
            <h1>{profile.name}</h1>
            <p className="hero-role">{profile.role}</p>
            <p className="hero-intro">{profile.headline}</p>
            <p className="hero-support">{profile.intro}</p>

            <div className="hero-actions" aria-label="Ações principais">
              <a className="primary-link" href="#work">
                Ver projetos
                <span aria-hidden="true">↘</span>
              </a>
              <a
                className="secondary-link resume-cta"
                href={profile.resumePath}
                download="Curriculo-Marcos-Vinicius-Longarai.pdf"
              >
                Baixar currículo
              </a>
            </div>
          </div>

          <aside className="manifest" aria-label="Resumo profissional">
            <div className="manifest-visual" aria-hidden="true">
              <img src="/images/dark/dark-02.jpg" alt="" />
            </div>
            <p className="eyebrow">Resumo</p>
            <p>
              Portfólio preparado para recrutadores: currículo disponível,
              projetos com demo e uma visão direta do que eu consigo construir.
            </p>
            <div className="status-line">
              <span>Status</span>
              <strong>{profile.availability}</strong>
            </div>
          </aside>
        </section>

        <section className="quick-stats section-frame" aria-label="Resumo rápido">
          {stats.map((item) => (
            <div key={item.label} className="stat-item">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>

        <section id="work" className="section-frame work-section">
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>Projetos reais para pré-visualizar e testar.</h2>
          </div>

          <div className="project-list">
            {projects.map((project, index) => (
              <article className="project-card" key={project.id}>
                <div className="project-media" aria-hidden="true">
                  <img src={projectImages[index % projectImages.length]} alt="" />
                  <span>0{index + 1}</span>
                </div>
                <div className="project-main">
                  <p className="project-code">
                    Portfolio_{project.id.toUpperCase()} / {project.period}
                  </p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>
                <div className="project-side">
                  <ul className="metric-list" aria-label={`Destaques de ${project.title}`}>
                    {project.metrics.map((metric) => (
                      <li key={metric}>{metric}</li>
                    ))}
                  </ul>
                  <a
                    className="demo-link"
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir demo de ${project.title}`}
                  >
                    Demo
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <div className="stack-row" aria-label={`Stack de ${project.title}`}>
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="section-frame capability-section">
          <div className="section-heading">
            <p className="eyebrow">Capabilities</p>
            <h2>Construção completa, do comportamento à percepção.</h2>
          </div>

          <div className="capability-grid">
            {capabilities.map((capability) => (
              <article className="capability-card" key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-frame process-section" aria-labelledby="process-title">
          <div>
            <p className="eyebrow">Process</p>
            <h2 id="process-title">Ritmo técnico sem perder acabamento.</h2>
          </div>
          <ol className="process-list">
            <li>
              <span>01</span>
              <strong>Entender o problema real</strong>
              <p>Mapeio objetivos, restrições, usuários e riscos antes de mexer na solução.</p>
            </li>
            <li>
              <span>02</span>
              <strong>Construir com contratos claros</strong>
              <p>Componentes, tipos, estados e integrações ficam explícitos e fáceis de revisar.</p>
            </li>
            <li>
              <span>03</span>
              <strong>Validar como produto</strong>
              <p>Testo build, responsividade, falhas previsíveis e detalhes visuais antes de fechar.</p>
            </li>
          </ol>
        </section>
      </main>

      <footer id="contact" className="section-frame footer-section">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Currículo e demos prontos para avaliação técnica.</h2>
        </div>
        <div className="footer-actions">
          <a className="primary-link" href="#work">
            Ver demos
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className="resume-footer-link"
            href={profile.resumePath}
            download="Curriculo-Marcos-Vinicius-Longarai.pdf"
          >
            Baixar currículo
          </a>
          <a
            className="social-link"
            href={profile.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir Instagram de Marcos Vinicius Longarai"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.2" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
