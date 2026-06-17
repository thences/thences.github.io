export type Project = {
  id: string;
  title: string;
  period: string;
  summary: string;
  metrics: string[];
  stack: string[];
  demoUrl: string;
};

export type Capability = {
  title: string;
  description: string;
};

export const profile = {
  greeting: "Olá recrutador(a)",
  name: "Marcos Vinicius Longarai",
  role: "Desenvolvedor full-stack",
  location: "Brasil",
  resumePath: "/curriculo-marcos-vinicius-longarai.pdf",
  instagramUrl: "https://www.instagram.com/littlebobbyz/",
  headline: "Crio sistemas web úteis, organizados e com experiência visual bem acabada.",
  intro:
    "Aqui você encontra três projetos práticos que mostram minha evolução em front-end, lógica de produto, organização de dados e cuidado com interface.",
  availability: "Aberto a oportunidades",
};

export const stats = [
  { label: "Projetos", value: "3 demos" },
  { label: "Stack", value: "React / TS" },
  { label: "Perfil", value: "Full-stack" },
];

export const projects: Project[] = [
  {
    id: "co-01",
    title: "Gestão hospitalar",
    period: "2026",
    summary:
      "Sistema para visualizar operações de um ambiente hospitalar, com telas administrativas, indicadores e fluxos pensados para leitura rápida.",
    metrics: ["Dashboard operacional", "Interface administrativa", "Experiência responsiva"],
    stack: ["React", "TypeScript", "Vite"],
    demoUrl: "https://thences.github.io/nexocare-gestao-hospitalar/",
  },
  {
    id: "co-02",
    title: "Controle de gastos",
    period: "2026",
    summary:
      "Aplicação para registrar despesas, acompanhar categorias e transformar o controle financeiro pessoal em uma rotina mais clara.",
    metrics: ["Estado global", "Filtros e resumo", "Dados organizados"],
    stack: ["React", "TypeScript", "Zustand"],
    demoUrl: "https://thences.github.io/controle-de-gastos/",
  },
  {
    id: "co-03",
    title: "Foco para estudantes",
    period: "2026",
    summary:
      "App de produtividade para estudantes acompanharem sessões de foco, tarefas e rotina de estudos com persistência local.",
    metrics: ["Rotina de estudos", "Persistência local", "Fluxo orientado a foco"],
    stack: ["React", "TypeScript", "IndexedDB"],
    demoUrl: "https://thences.github.io/foco/",
  },
];

export const capabilities: Capability[] = [
  {
    title: "Front-end de produto",
    description:
      "Interfaces responsivas, componentizadas e pensadas para uso real, com atenção a estados, acessibilidade e performance.",
  },
  {
    title: "Lógica de aplicação",
    description:
      "Estados, filtros, persistência local e fluxos de usuário organizados para deixar o produto previsível e fácil de evoluir.",
  },
  {
    title: "Design funcional",
    description:
      "Cuidado com composição, hierarquia visual, microinterações e acabamento para passar confiança logo no primeiro contato.",
  },
  {
    title: "Entrega validada",
    description:
      "Projetos com build, lint, responsividade e navegação testados antes de serem apresentados como demo.",
  },
];
