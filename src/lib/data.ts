/**
 * The Codex — every word of content in the tomb.
 * Sourced strictly from Ashraful Anam Alve's CV and GitHub. No invented credentials.
 */

export const identity = {
  name: "Ashraful Anam Alve",
  shortName: "Ashraful Alve",
  initials: "AA",
  role: "Full-Stack Developer",
  titles: [
    ".NET Developer",
    "Full-Stack Developer",
    "Angular Craftsman",
    "QA-Minded Engineer",
  ],
  tagline:
    "I excavate order from complexity — building secure, high-performance web systems from the foundation stone to the final glyph.",
  intro:
    "Every system is a structure waiting to be raised. I work in C#, ASP.NET Core and Angular, laying foundations that hold.",
  location: "Mirpur 2, Dhaka, Bangladesh",
  origin: "Sadar Road, Bakergonj, Barishal",
  email: "asrafulanamalve45@gmail.com",
  phone: "+880 1876 935462",
  phoneSecondary: "+880 1403 666384",
  availability: "Open to full-time, part-time & freelance expeditions",
  cv: "/documents/Ashraful_Anam_Alve_CV.pdf",
  portfolioLegacy: "https://ashrafulanamalve.github.io/My-Portfolio/",
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/AshrafulAnamAlve", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/asraful-anam-alve/", icon: "linkedin" },
  { label: "Email", href: `mailto:${identity.email}`, icon: "mail" },
] as const;

export const navLinks = [
  { label: "Threshold", href: "#hero", glyph: "𓉔" },
  { label: "The Tablet", href: "#about", glyph: "𓊪" },
  { label: "Relics", href: "#skills", glyph: "𓋹" },
  { label: "Treasures", href: "#projects", glyph: "𓂀" },
  { label: "The Route", href: "#journey", glyph: "𓈖" },
  { label: "Seals", href: "#certificates", glyph: "𓆓" },
  { label: "Summon", href: "#contact", glyph: "𓁹" },
] as const;

export const stats = [
  { value: "10+", label: "Structures Raised", sub: "Projects built" },
  { value: "6", label: "Moons of Training", sub: "ISDB-BISEW intensive" },
  { value: "2027", label: "Expedition Ends", sub: "BSc CSE, expected" },
  { value: "100%", label: "Completion Rate", sub: "Delivered, every one" },
] as const;

/* ── The Stone Tablet ─────────────────────────────────────── */
export const about = {
  heading: "The Tablet of the Builder",
  carved: [
    "I am a software developer with a foundation in Computer Science & Engineering, trained in the full-stack discipline of ASP.NET.",
    "My craft is the whole structure — the backend vault that guards the data, the API passages that carry it, and the interface where a person finally meets the work.",
    "I build with C#, ASP.NET Core, Web API and Angular, resting on SQL Server and MySQL. I care about clean interfaces, maintainable code, and systems that stay secure when they scale.",
    "I am still excavating. Every project buries a lesson I did not have before.",
  ],
  inscriptions: [
    { key: "Born", value: "23 November 2002" },
    { key: "Origin", value: "Bakergonj, Barishal" },
    { key: "Seat", value: "Mirpur 2, Dhaka" },
    { key: "Nationality", value: "Bangladeshi" },
    { key: "Discipline", value: "Computer Science & Engineering" },
    { key: "Status", value: "Available for work" },
  ],
} as const;

/* ── Relics (skills) ──────────────────────────────────────── */
export type Relic = {
  name: string;
  glyph: string;
  mastery: number;
  tier: "core" | "forged" | "tooled";
  note: string;
};

export const relics: Relic[] = [
  { name: "C#", glyph: "𓊹", mastery: 88, tier: "core", note: "Primary tongue. OOP, business logic, backend systems." },
  { name: "ASP.NET Core", glyph: "𓉐", mastery: 85, tier: "core", note: "Enterprise backends, middleware, dependency injection." },
  { name: "Web API", glyph: "𓈗", mastery: 84, tier: "core", note: "RESTful services, JWT auth, secure endpoints." },
  { name: "Angular", glyph: "𓂀", mastery: 82, tier: "core", note: "SPA architecture, reactive forms, routing, services." },
  { name: "SQL Server", glyph: "𓎛", mastery: 80, tier: "core", note: "Schema design, queries, data integrity." },
  { name: "ASP.NET MVC", glyph: "𓋴", mastery: 78, tier: "forged", note: "Razor views, controllers, classic server rendering." },
  { name: "TypeScript", glyph: "𓄤", mastery: 78, tier: "forged", note: "Typed frontend logic across Angular systems." },
  { name: "MySQL", glyph: "𓆑", mastery: 76, tier: "forged", note: "Relational modelling for desktop and web apps." },
  { name: "JavaScript", glyph: "𓃀", mastery: 76, tier: "forged", note: "DOM, async flows, browser behaviour." },
  { name: "Java", glyph: "𓊃", mastery: 70, tier: "forged", note: "OOP foundations, Swing desktop applications." },
  { name: "HTML & CSS", glyph: "𓅓", mastery: 84, tier: "forged", note: "Responsive layouts, modern standards, semantics." },
  { name: "Bootstrap", glyph: "𓏏", mastery: 78, tier: "tooled", note: "Rapid responsive scaffolding." },
  { name: "Git & GitHub", glyph: "𓎼", mastery: 76, tier: "tooled", note: "Version control, branching, collaboration." },
  { name: "JWT Auth", glyph: "𓋹", mastery: 78, tier: "tooled", note: "Token-based authentication and role guards." },
  { name: "SMTP Mail", glyph: "𓁷", mastery: 74, tier: "tooled", note: "Transactional email inside application flows." },
  { name: "Visual Studio", glyph: "𓊖", mastery: 82, tier: "tooled", note: "Primary forge for .NET work." },
];

export const relicTiers = {
  core: { label: "Sacred Relics", desc: "The instruments I reach for first" },
  forged: { label: "Forged Tools", desc: "Proven in the field" },
  tooled: { label: "Expedition Kit", desc: "Carried on every dig" },
} as const;

/* ── Treasures (projects) ─────────────────────────────────── */
export type Treasure = {
  slug: string;
  name: string;
  epithet: string;
  year: string;
  summary: string;
  chronicle: string[];
  stack: string[];
  image: string;
  github?: string;
  live?: string;
  featured: boolean;
};

export const treasures: Treasure[] = [
  {
    slug: "elibrary",
    name: "eLibrary",
    epithet: "The Great Archive",
    year: "2025",
    summary:
      "A full-stack library management platform with secure Admin and User realms — approvals, ordering, fines and automated correspondence.",
    chronicle: [
      "Readers register and are admitted only after email approval, then search the collection, order volumes and track their own history.",
      "Keepers govern books, categories and members — processing returns, calculating fines, and blocking or restoring accounts based on what is owed.",
      "The system dispatches its own email notifications through an integrated SMTP service, so no message leaves the vault by hand.",
      "Built on ASP.NET Core Web API with an Angular front end over SQL Server, secured end to end with JWT-based roles.",
    ],
    stack: ["C#", "ASP.NET Core", "Web API", "Angular", "SQL Server", "JWT", "SMTP"],
    image: "/images/projects/elibrary.png",
    github: "https://github.com/AshrafulAnamAlve/eLibrary",
    featured: true,
  },
  {
    slug: "employee-portal",
    name: "Employee Portal",
    epithet: "The Census Hall",
    year: "2025",
    summary:
      "A full-stack CRUD system for employee records, built on RESTful ASP.NET Core services with a responsive Angular interface.",
    chronicle: [
      "RESTful APIs handle the full lifecycle of records — create, read, update and destroy — with clean separation between service and presentation.",
      "The Angular front end is fully responsive, binding directly to typed models delivered by the API.",
      "Written against clean-code principles with careful, secure data handling throughout.",
    ],
    stack: ["C#", "ASP.NET Core", "Web API", "Angular", "TypeScript", "SQL"],
    image: "/images/projects/employee-portal.avif",
    github: "https://github.com/AshrafulAnamAlve/EmployeePortal",
    featured: true,
  },
  {
    slug: "lost-and-found",
    name: "Lost & Found",
    epithet: "The Chamber of Recovered Things",
    year: "2024",
    summary:
      "A Java desktop application for tracking lost and recovered items, with role-based access and exportable PDF records.",
    chronicle: [
      "Administrators and users hold separate keys — each realm sees only what it should.",
      "Item and owner details are recorded, joined and viewed together, so a found object can be traced back to whoever lost it.",
      "Full reports export to PDF through iText, turning the database into a document that outlives the session.",
      "Built with Java Swing over MySQL in NetBeans.",
    ],
    stack: ["Java", "Swing", "MySQL", "iText", "NetBeans"],
    image: "/images/projects/lost-and-found.jpg",
    github: "https://github.com/AshrafulAnamAlve/Lost-And-Found",
    featured: true,
  },
];

/* ── The Route (experience) ───────────────────────────────── */
/**
 * TODO (Ashraful): confirm the dates and duties for the two roles below —
 * they came from you directly and are not in the CV, so the `era` values are
 * placeholders and the `detail` text is deliberately general. Replace with the
 * real dates and two or three specific things you actually shipped in each.
 */
export const expedition = [
  {
    era: "Current",
    title: ".NET Developer",
    place: "Touch and Solve",
    detail:
      "Building and maintaining .NET applications — backend services, API endpoints and database work, carried from requirement through to release.",
    focus: ["C#", "ASP.NET Core", "Web API", "SQL Server"],
    kind: "role",
  },
  {
    era: "Previous",
    title: "QA Engineer",
    place: "Avian BPO & IT",
    detail:
      "Tested software against requirements — writing and executing test cases, reporting defects, and verifying fixes before release.",
    focus: ["Manual Testing", "Test Cases", "Defect Reporting", "QA"],
    kind: "role",
  },
  {
    era: "6 Months",
    title: "ASP.NET Full Stack Development Training",
    place: "ISDB-BISEW IT Scholarship Programme",
    detail:
      "Professional intensive in building dynamic web applications on ASP.NET. Hands-on work across backend and frontend integration, API development and database connectivity.",
    focus: ["C#", "ASP.NET MVC", "ASP.NET Core", "Web API", "SQL Server", "Angular"],
    kind: "training",
  },
  {
    era: "Ongoing",
    title: "Independent Development",
    place: "Self-directed",
    detail:
      "Designing and shipping full-stack applications end to end — architecture, API design, database modelling and interface craft — refining the practice with each build.",
    focus: ["Full-Stack", "System Design", "REST APIs"],
    kind: "practice",
  },
] as const;

/* ── The Atlas (education) ────────────────────────────────── */
export const atlas = [
  {
    degree: "BSc in Computer Science & Engineering",
    institute: "Bangladesh University of Business and Technology (BUBT)",
    period: "Enrolled · Expected 2027",
    result: "In progress",
    coords: "23.8103° N, 90.4125° E",
    status: "current" as const,
  },
  {
    degree: "Diploma in Engineering — Computer Technology",
    institute: "Barguna Polytechnic Institute",
    period: "Passed 2022",
    result: "CGPA 3.54 / 4.00",
    coords: "22.1553° N, 90.1266° E",
    status: "complete" as const,
  },
  {
    degree: "Secondary School Certificate — Science",
    institute: "Bakergonj JSC Model High School",
    period: "Passed 2018",
    result: "GPA 4.39 / 5.00",
    coords: "22.5500° N, 90.3333° E",
    status: "complete" as const,
  },
] as const;

/* ── Sealed Scrolls (certificates) ────────────────────────── */
export const scrolls = [
  {
    title: "ASP.NET Full Stack Development",
    issuer: "ISDB-BISEW IT Scholarship Programme",
    period: "6-Month Professional Training",
    seal: "𓋹",
    detail:
      "Completed the full professional curriculum in C#, ASP.NET MVC, ASP.NET Core, Web API, SQL Server and Angular — covering backend and frontend integration, API development and database connectivity.",
  },
  {
    title: "Diploma in Engineering — Computer Technology",
    issuer: "Barguna Polytechnic Institute",
    period: "2022 · CGPA 3.54 / 4.00",
    seal: "𓊹",
    detail:
      "Four-year engineering diploma in computer technology, covering programming fundamentals, systems and applied computing.",
  },
] as const;

/* ── Achievements ─────────────────────────────────────────── */
export const achievements = [
  {
    glyph: "𓆃",
    title: "IsDB-BISEW Scholarship",
    detail: "Selected for the competitive IT Scholarship Programme and completed the full ASP.NET track.",
  },
  {
    glyph: "𓉔",
    title: "Three Systems Shipped",
    detail: "eLibrary, Employee Portal and Lost & Found — each carried from empty repository to working application.",
  },
  {
    glyph: "𓂀",
    title: "Diploma with Distinction",
    detail: "CGPA 3.54 / 4.00 in Computer Technology at Barguna Polytechnic Institute.",
  },
  {
    glyph: "𓋴",
    title: "Full-Stack Command",
    detail: "Comfortable alone across the entire structure — database, API, and interface.",
  },
] as const;

/**
 * NOTE: The two referees named in the CV (and their phone numbers and emails) are
 * deliberately NOT included here. Publishing another person's contact details on a
 * public site without their consent exposes them to spam and worse. Share references
 * privately, on request, as is standard.
 */

export const footerQuote = "The journey of knowledge never truly ends.";
