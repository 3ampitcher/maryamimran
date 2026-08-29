import type { WorkItem } from './types';

/* ============================================================
   WORK — THE SINGLE SOURCE OF TRUTH
   ------------------------------------------------------------
   Every project, role, competition and talk is authored exactly
   once here. The Work Hub, the three category pages, Speaking,
   Recognition and the Index all read from this array.

   To add something: append an object and give it an `order`.
   To hide something: set showInIndex to false.
   To publish a metric: set verified: true (unverified metrics
   stay in the data but are never rendered).

   Images: put files under /public/assets/<category>/ and point
   `src` at them. Until the file exists, a neutral placeholder
   with the project name renders in its place — no stock imagery.
   ============================================================ */

export const work: WorkItem[] = [
  /* ==========================================================
     BUSINESS
     ========================================================== */
  {
    id: 'tiin',
    title: 'Tiin',
    titleAlt: 'تِين',
    organization: 'Monsha’at Human Capital Program',
    year: '2025—NOW',
    yearSort: 2025,
    date: 'Sep 2025 — Present',
    role: 'Co-Founder & CEO',
    primaryCategory: 'business',
    secondaryTags: ['build', 'research', 'analyze', 'lead'],
    shortDescription:
      'A data-insights platform for Saudi SMEs — turning the numbers a business already has into answers it can act on.',
    fullDescription: [
      'Tiin started from a straightforward observation: a lot of small businesses in Saudi Arabia have their numbers, but not their answers. The data sits in a point-of-sale system or an accounting tool, and the owner still cannot say whether this month was actually good.',
      'The work has been mostly customer discovery and iteration — talking to owners, watching where the confusion actually lives, and rebuilding the product around what turned out to matter. That moved the idea from analytics dashboards toward financial interpretation: not more charts, but a clear read on business health, cash flow, margins, receivables and expenses, with recommendations an owner can act on this week.',
      'Tiin is being built through Monsha’at’s Human Capital Program, with guidance from Saudi founders, investors and ecosystem mentors.',
    ],
    contribution: [
      'Ran customer discovery with Saudi SME owners and rebuilt the product thesis around what they actually asked for',
      'Designed the business health model — cash flow, profitability and margins, receivables, expense structure',
      'Built and vibe-coded working prototypes to test the interpretation layer before committing to a stack',
      'Explored WhatsApp as the delivery channel and Zoho and accounting systems as data sources',
      'Developed the reporting concept: a readable financial report rather than a dashboard to be deciphered',
    ],
    phases: [
      { label: 'POS Analytics', note: 'Reading what the till already knows' },
      { label: 'Business Software', note: 'Where owners asked for help' },
      { label: 'Finance', note: 'The real question underneath' },
      { label: 'AI Financial Advisory', note: 'Current direction' },
    ],
    images: [
      { src: '/assets/business/tiin-product.jpg', alt: 'Tiin product interface', caption: 'Product interface', ratio: '16/9' },
      { src: '/assets/business/tiin-deck.jpg', alt: 'Tiin pitch deck slide', caption: 'Pitch deck', ratio: '16/9' },
      { src: '/assets/business/tiin-accelerator.jpg', alt: 'Tiin at the Monsha’at Human Capital Program', caption: 'Monsha’at', ratio: '3/2' },
      { src: '/assets/business/tiin-discovery.jpg', alt: 'Customer discovery notes and research', caption: 'Customer discovery', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/business/tiin-product.jpg', alt: 'Tiin product interface', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 1,
    scale: 'lead',
  },
  {
    id: 'tiin-demo-day',
    title: 'Tiin Demo Day',
    organization: 'Monsha’at Human Capital Program',
    year: '2026',
    yearSort: 2026,
    role: 'Pitch',
    primaryCategory: 'business',
    secondaryTags: ['speak', 'build'],
    shortDescription:
      'Pitching Tiin at the end of the programme — the product, the market and what comes next.',
    fullDescription: [
      'Demo Day is where the programme work gets compressed into a few minutes on stage: what the problem is, who has it, what has been built, and why this direction.',
    ],
    contribution: [
      'Built the pitch narrative around the SME finance problem rather than the feature list',
      'Presented Tiin to the cohort, mentors and invited guests',
    ],
    images: [
      { src: '/assets/speaking/demo-day-stage.jpg', alt: 'Maryam presenting Tiin at Demo Day', caption: 'Demo Day', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/speaking/demo-day-stage.jpg', alt: 'Maryam presenting Tiin at Demo Day', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: false,
    order: 2,
  },
  {
    id: 'food-gala',
    title: 'Food Gala',
    year: '2023–24',
    yearSort: 2023,
    date: 'Nov 2023 — Jan 2024',
    role: 'Venture Head',
    primaryCategory: 'business',
    secondaryTags: ['operate', 'lead', 'market', 'analyze'],
    shortDescription:
      'An eight-day student food operation — 75 people, SAR 30,000 in revenue, and a P&L that had to work.',
    fullDescription: [
      'Eight days of running an actual food operation: sourcing, pricing, rotas, service and the daily reconciliation at the end of it. The interesting part was not the event, it was the operating problem — demand that moves hour to hour, a volunteer workforce, and margins that only survive if the buying is right.',
    ],
    contribution: [
      'Managed 75 students operating the stall across the full eight days',
      'Owned the financial modelling, budgeting and operations behind SAR 30,000 of revenue',
      'Handled marketing, logistics and customer service through the run',
    ],
    metrics: [
      { value: 'SAR 30,000', label: 'Revenue', verified: true },
      { value: '75', label: 'Students managed', verified: true },
      { value: '8', label: 'Days', verified: true },
    ],
    images: [
      { src: '/assets/business/food-gala-1.jpg', alt: 'Food Gala event operations', ratio: '3/2' },
      { src: '/assets/business/food-gala-2.jpg', alt: 'Food Gala student team', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/business/food-gala-1.jpg', alt: 'Food Gala event operations', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 3,
    scale: 'lead',
  },
  {
    id: 'pakistan-humari-pehchaan',
    title: 'Pakistan Humari Pehchaan',
    year: '2023–24',
    yearSort: 2023,
    date: 'Oct 2023 — Jun 2024',
    role: 'Marketing Lead',
    primaryCategory: 'business',
    secondaryTags: ['market', 'analyze', 'lead'],
    shortDescription:
      'Digital marketing led from the data — doubling inbound inquiries and bringing in 50+ clients.',
    fullDescription: [
      'Marketing where the strategy followed the numbers rather than the other way round: reading how people actually arrived and behaved, then rebuilding the campaigns around it.',
    ],
    contribution: [
      'Analysed user data to optimise the digital marketing strategy, doubling inbound inquiries',
      'Grew engagement and inquiries from potential partners',
      'Attracted 50+ clients through digital elevator pitches and social media campaigns',
    ],
    metrics: [
      { value: '2×', label: 'Inbound inquiries', verified: true },
      { value: '50+', label: 'Clients attracted', verified: true },
    ],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 4,
  },
  {
    id: 'foni',
    title: 'Foni',
    organization: 'Global nonprofit',
    year: '2024',
    yearSort: 2024,
    date: 'Jul 2024 — Nov 2024',
    role: 'Social Media Intern',
    primaryCategory: 'business',
    secondaryTags: ['market', 'analyze', 'design'],
    shortDescription:
      'Content for an international nonprofit, with the week’s engagement data deciding what came next.',
    fullDescription: [
      'A content role run as a feedback loop: publish, read the engagement data at the end of the week, and let it change the following week rather than defending the original plan.',
    ],
    contribution: [
      'Created insight-driven content that increased reach and interaction on social media',
      'Collaborated with international teams to align communications with the nonprofit’s mission',
      'Analysed engagement data weekly and iterated the content strategy on it',
    ],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 5,
  },
  {
    id: 'moonshot-pirates',
    title: 'Moonshot Pirates',
    organization: 'Global Sustainability Challenge',
    year: '2024–25',
    yearSort: 2024,
    date: 'Nov 2024 — Jan 2025',
    role: 'Finalist',
    primaryCategory: 'business',
    secondaryTags: ['compete', 'build', 'research'],
    shortDescription:
      'A food sustainability concept built with Solar Foods’ Solein protein — top 7 of 78 teams.',
    fullDescription: [
      'A global challenge with a real constraint: build a food sustainability solution around Solein, the protein Solar Foods makes from air and electricity, and defend it to judges who build companies for a living.',
    ],
    contribution: [
      'Co-developed a futuristic food sustainability solution with Solar Foods using Solein protein',
      'Delivered pitches and prototypes to judges including global CEOs',
    ],
    result: 'TOP 7 OF 78',
    metrics: [{ value: 'Top 7 / 78', label: 'Teams', verified: true }],
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: true,
    order: 6,
  },
  {
    id: 'harvard-crimson-case',
    title: 'Harvard Crimson Global Case Competition',
    year: '2025',
    yearSort: 2025,
    role: 'Competition',
    primaryCategory: 'business',
    secondaryTags: ['compete', 'analyze', 'research'],
    shortDescription: 'A global case competition — business analysis against a live brief, under time.',
    /* TODO(maryam): add your placement and what the case was, if you want it public. */
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 7,
  },
  {
    id: 'nestle-nxl',
    title: 'Nestlé NxL',
    organization: 'Season 3',
    year: '2025',
    yearSort: 2025,
    role: 'Competition',
    primaryCategory: 'business',
    secondaryTags: ['compete', 'market', 'research'],
    shortDescription: 'Nestlé’s business challenge programme — strategy and go-to-market against a corporate brief.',
    /* TODO(maryam): add the brief you worked on and your result. */
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 8,
  },
  {
    id: 'loreal-brandstorm',
    title: 'L’Oréal Brandstorm',
    organization: 'L’Oréal',
    year: '2026',
    yearSort: 2026,
    role: 'Competition',
    primaryCategory: 'business',
    secondaryTags: ['compete', 'market', 'research'],
    shortDescription:
      'Brand and product strategy against a live brief, judged on insight as much as execution.',
    fullDescription: [
      'A competition brief run like a real one: find the consumer insight, build a product and go-to-market case around it, and defend the reasoning.',
    ],
    contribution: ['Worked the consumer research and positioning', 'Built and presented the case'],
    featuredMedia: { src: '/assets/business/brandstorm.jpg', alt: 'L’Oréal Brandstorm presentation', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 9,
  },
  {
    id: 'silent-kitchen-story',
    title: 'Silent Kitchen Story',
    year: '2023–24',
    yearSort: 2023,
    role: 'Marketing',
    primaryCategory: 'business',
    secondaryTags: ['market', 'design', 'build'],
    shortDescription: 'Brand and social work for a food business — voice, content and growth.',
    contribution: ['Ran the brand voice and content', 'Handled social media and audience growth'],
    featuredMedia: { src: '/assets/business/silent-kitchen.jpg', alt: 'Silent Kitchen Story brand work', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 10,
    scale: 'quiet',
  },

  /* ==========================================================
     TECHNOLOGY
     ========================================================== */
  {
    id: 'vita',
    title: 'VITA',
    organization: 'IE University Breakthrough Robotics Program, Madrid',
    year: '2025',
    yearSort: 2025,
    role: 'Robotics Project',
    primaryCategory: 'technology',
    secondaryTags: ['build', 'research', 'compete', 'design'],
    shortDescription:
      'Visual Infrared Transport Assistant — a hospital robot that follows nurses and carries routine items.',
    fullDescription: [
      'VITA came out of the Breakthrough Robotics Program at IE University in Madrid. The premise: nurses spend a meaningful part of a shift walking things from one place to another. A robot that quietly follows and carries the light, routine items gives some of that time back.',
      'The build was infrared following on Arduino and Raspberry Pi, driving motors with sensor input, plus the physical problem of a tray that stays level and a robot that stops before it hits anything. Most of the time went into hardware debugging — the gap between a circuit that works on the bench and one that works while moving.',
      'Alongside the build there was the research question: does this actually fit how a hospital ward runs? That meant reading nurse workflow and hospital logistics, and being honest about where a following robot helps and where it is simply in the way.',
    ],
    contribution: [
      'Worked on the infrared following behaviour — sensors, tracking and motor response',
      'Built and debugged the physical prototype on Arduino and Raspberry Pi',
      'Designed the safe-stop and obstacle behaviour so the robot yields rather than pushes',
      'Researched nurse workflow and hospital logistics to test whether the concept fit the ward',
      'Worked the product and business case, and pitched with the team',
    ],
    result: '1ST PLACE',
    images: [
      { src: '/assets/technology/vita-prototype.jpg', alt: 'VITA robot prototype', caption: 'Prototype', ratio: '3/2' },
      { src: '/assets/technology/vita-components.jpg', alt: 'Arduino, Raspberry Pi and sensor components', caption: 'Components', ratio: '1/1' },
      { src: '/assets/technology/vita-lab.jpg', alt: 'Robotics lab at IE University', caption: 'Lab, IE Madrid', ratio: '3/2' },
      { src: '/assets/technology/vita-team.jpg', alt: 'VITA team presenting', caption: 'Team pitch', ratio: '4/3' },
    ],
    featuredMedia: { src: '/assets/technology/vita-prototype.jpg', alt: 'VITA robot prototype', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: true,
    order: 1,
    scale: 'lead',
  },
  {
    id: 'tks',
    title: 'The Knowledge Society',
    organization: 'TKS',
    year: '2023–24',
    yearSort: 2023,
    date: 'Aug 2023 — Jun 2024',
    role: 'Innovator',
    primaryCategory: 'technology',
    secondaryTags: ['learn', 'research', 'build', 'speak', 'compete'],
    shortDescription:
      'Emerging technology, hackathons, and pitching to Meta’s Oversight Board and the World Economic Forum.',
    fullDescription: [
      'TKS is structured around going deep on emerging technologies and then having to explain them. The work was research, challenges and hackathons, and presenting the result to people who would ask the obvious hard question.',
      'The rooms were the point as much as the projects: pitching to Meta’s Oversight Board and at the World Economic Forum is a fast way to find out whether an idea survives contact with people who do this professionally.',
    ],
    contribution: [
      'Led winning hackathon projects',
      'Pitched to Meta’s Oversight Board and at the World Economic Forum',
      'Developed an air-to-water moonshot project addressing water scarcity in underserved regions',
      'Researched emerging technologies and presented findings',
    ],
    featuredMedia: { src: '/assets/technology/tks.jpg', alt: 'TKS presentation work', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: false,
    order: 2,
    scale: 'lead',
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    year: '2026',
    yearSort: 2026,
    role: 'Session & Workshop',
    primaryCategory: 'technology',
    secondaryTags: ['speak', 'build', 'research'],
    shortDescription:
      'A working session on agents — what reasoning and tool use actually buy you, and when they do not.',
    fullDescription: [
      'Most of the interest in agents is in what they can do. The more useful question is when they are worth it. An agent that reasons, picks tools and loops is genuinely better for open-ended work with an unknown number of steps. For a task with a fixed shape, it is a slower and less reliable script.',
      'The session works through both sides: how agent reasoning and tool use fit together, and the cases where the honest answer is that you did not need an agent.',
    ],
    contribution: [
      'Built and delivered the session on agent reasoning, tools and workflows',
      'Worked through concrete cases where agents help and where they add cost without value',
    ],
    images: [
      { src: '/assets/speaking/agentic-ai-session.jpg', alt: 'Agentic AI session', caption: 'Session', ratio: '3/2' },
      { src: '/assets/technology/agentic-ai-deck.jpg', alt: 'Agentic AI presentation slide', caption: 'Deck', ratio: '16/9' },
    ],
    featuredMedia: { src: '/assets/speaking/agentic-ai-session.jpg', alt: 'Agentic AI session', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: false,
    order: 3,
  },
  {
    id: 'air-to-water',
    title: 'Air-to-Water',
    organization: 'The Knowledge Society',
    year: '2024',
    yearSort: 2024,
    role: 'Moonshot Project',
    primaryCategory: 'technology',
    secondaryTags: ['research', 'build'],
    shortDescription:
      'Atmospheric water generation for underserved regions — the physics, the cost and the honest limits.',
    fullDescription: [
      'A moonshot project on water scarcity: pulling drinking water out of the air in places where the infrastructure to deliver it does not exist. The interesting work was the constraint side — humidity, energy cost per litre, and being clear about the conditions under which it stops making sense.',
    ],
    contribution: [
      'Researched atmospheric water generation and the conditions under which it works',
      'Developed the concept as a moonshot addressing water scarcity in underserved regions',
    ],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 4,
  },
  {
    id: 'engineering-day-ai',
    title: 'Engineering Day',
    organization: 'UBT',
    year: '2026',
    yearSort: 2026,
    role: 'AI Presentation',
    primaryCategory: 'technology',
    secondaryTags: ['speak', 'research'],
    shortDescription: 'Presenting AI work to an engineering audience.',
    contribution: ['Prepared and delivered the AI presentation'],
    featuredMedia: { src: '/assets/speaking/engineering-day.jpg', alt: 'Engineering Day presentation', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: false,
    order: 5,
  },
  {
    id: 'automation-lowcode',
    title: 'Automation & Low-Code',
    year: '2025—NOW',
    yearSort: 2025,
    role: 'Practice',
    primaryCategory: 'technology',
    secondaryTags: ['build', 'analyze', 'learn'],
    shortDescription:
      'Zoho Creator, n8n, Zapier and webhooks — the plumbing that gets SME data from where it is to where it is useful.',
    fullDescription: [
      'The unglamorous half of Tiin, and useful well beyond it: forms, workflows and portals in Zoho Creator, CRM and Flow, n8n and Zapier automations, and the API fundamentals — webhooks, JSON — that let one system tell another what just happened.',
      'Most of it is data ingestion. Getting a small business’s numbers out of the tools they already use, into a shape something can reason about, without asking them to change how they work.',
    ],
    contribution: [
      'Built SME data ingestion flows across Zoho Creator, CRM and Flow',
      'Wired automations with n8n and Zapier over webhook and JSON APIs',
      'Worked with Zia AI and no-code analytics in Zoho Analytics and Google Data Studio',
    ],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 6,
  },
  {
    id: 'hardware-prototyping',
    title: 'Hardware Prototyping',
    year: '2025',
    yearSort: 2025,
    role: 'Practice',
    primaryCategory: 'technology',
    secondaryTags: ['build', 'learn'],
    shortDescription:
      'Arduino, Raspberry Pi, sensors and motors — the ongoing habit of getting physical things to work.',
    fullDescription: [
      'The running thread underneath VITA and the rest: wiring sensors, driving motors, reading values that make no sense, and finding out why. Hardware is unusually good at telling you when your mental model is wrong.',
    ],
    contribution: [
      'Prototyped on Arduino and Raspberry Pi with sensors, motors and IR tracking',
      'Debugged circuits that behave differently on the bench and in motion',
    ],
    images: [
      { src: '/assets/technology/prototyping-1.jpg', alt: 'Arduino and sensor prototyping', ratio: '1/1' },
      { src: '/assets/technology/prototyping-2.jpg', alt: 'Raspberry Pi build in progress', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/technology/prototyping-1.jpg', alt: 'Arduino and sensor prototyping', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 7,
    scale: 'quiet',
  },

  /* ==========================================================
     IMPACT
     ========================================================== */
  {
    id: 'sustainability-club',
    title: 'UBT Sustainability Club',
    organization: 'University of Business & Technology',
    year: '2025—NOW',
    yearSort: 2025,
    date: 'Mar 2025 — Present',
    role: 'President',
    primaryCategory: 'impact',
    secondaryTags: ['lead', 'operate', 'market'],
    shortDescription:
      'Running the club — strategy, outreach, and a relaunched LinkedIn that hit 5,000+ impressions in a month.',
    fullDescription: [
      'Took over as President in March 2025, having come up through the PR side. The job is less about sustainability as a topic and more about getting a student organisation to actually run: a calendar that holds, teams that know what they are doing, and communications that make people show up.',
      'Most of the visible progress has been outreach. Relaunching the club’s LinkedIn and running it properly moved it from dormant to a real channel — the club now has somewhere to speak from.',
    ],
    contribution: [
      'Led strategic planning and outreach, boosting the club’s presence and engagement across campus',
      'Relaunched and managed the club’s LinkedIn, growing the following to 100+',
      'Generated 5,000+ impressions in one month from a standing start',
    ],
    metrics: [
      { value: '5,000+', label: 'LinkedIn impressions in one month', verified: true },
      { value: '100+', label: 'Followers grown', verified: true },
    ],
    images: [
      { src: '/assets/impact/club-team.jpg', alt: 'UBT Sustainability Club team', caption: 'The team', ratio: '3/2' },
      { src: '/assets/impact/club-event.jpg', alt: 'Sustainability Club event', caption: 'Programming', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/impact/club-team.jpg', alt: 'UBT Sustainability Club team', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 1,
    scale: 'lead',
  },
  {
    id: 'sustainability-club-pr',
    title: 'Sustainability Club — PR',
    organization: 'University of Business & Technology',
    year: '2025',
    yearSort: 2025,
    date: 'Jan 2025 — Mar 2025',
    role: 'PR Team Leader',
    primaryCategory: 'impact',
    secondaryTags: ['market', 'lead', 'operate'],
    shortDescription:
      'The outreach job before the presidency — membership, event footfall and the club’s first sponsors.',
    fullDescription: [
      'Two months of running the club’s outreach before taking it over entirely. The brief was simple and measurable: more members, more people at the booth, and money from somewhere other than the university.',
    ],
    contribution: [
      'Executed an outreach strategy that increased membership by 10+ members',
      'Attracted 50+ visitors to the club’s event booth',
      'Supported sponsorship acquisition, securing two sponsors through stakeholder communications and proposals',
    ],
    metrics: [
      { value: '50+', label: 'Booth visitors', verified: true },
      { value: '2', label: 'Sponsors secured', verified: true },
    ],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 2,
  },
  {
    id: 'ui-greenmetric',
    title: 'Sustainability Reporting',
    organization: 'University of Business & Technology',
    year: '2025—NOW',
    yearSort: 2025,
    date: 'Sep 2025 — Present',
    role: 'Admin Intern',
    primaryCategory: 'impact',
    secondaryTags: ['analyze', 'research', 'operate'],
    shortDescription:
      'UI GreenMetric, THE Impact Rankings and PRME SIP — collecting the evidence a university’s claims have to stand on.',
    fullDescription: [
      'Three separate frameworks, one underlying problem: none of them take your word for anything. UI GreenMetric, the Times Higher Education Impact Rankings and the PRME Sharing Information on Progress report each want documentation behind every claim — energy, carbon, waste, water, transport, and the education and research side.',
      'The work is unglamorous and genuinely analytical: finding where the institutional data lives, getting it into a consistent shape, and assembling submissions where every figure has evidence attached to it. It is the part of sustainability that looks like data work, because it is.',
    ],
    contribution: [
      'Support sustainability data collection for UI GreenMetric, THE Impact Rankings and PRME SIP documentation',
      'Work the infrastructure, energy, carbon, waste, water and transport data',
      'Document sustainability education and research activity',
      'Assist in administrative coordination for campus events, sustainability reporting and student engagement initiatives',
    ],
    images: [
      { src: '/assets/impact/greenmetric-data.jpg', alt: 'Sustainability reporting documentation', caption: 'Reporting', ratio: '4/3' },
      { src: '/assets/impact/campus.jpg', alt: 'UBT campus', caption: 'Campus', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/impact/greenmetric-data.jpg', alt: 'Sustainability reporting documentation', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 3,
    scale: 'lead',
  },
  {
    id: 'think-sustainability',
    title: 'Think Sustainability',
    organization: 'UBT',
    year: '2025',
    yearSort: 2025,
    role: 'Lead & Coordination',
    primaryCategory: 'impact',
    secondaryTags: ['lead', 'build', 'design', 'operate'],
    shortDescription:
      'An interactive campus event — multiple booths, a digital stamp trail, and sustainability made participatory.',
    fullDescription: [
      'A sustainability event that people walk through rather than sit in. Multiple booths, each a different experience and a different discipline’s angle on the same set of problems, tied together by a digital stamp trail that gave people a reason to do all of it rather than one.',
      'Most of the work was planning and coordination: floor plan, booth briefs, teams, university and external collaborators, and the run of the day itself.',
    ],
    contribution: [
      'Planned and coordinated the event end to end',
      'Designed the booth programme across interdisciplinary sustainability themes',
      'Built the digital stamp and participation mechanic to drive engagement across the full trail',
      'Coordinated student teams and university and external collaborators',
    ],
    images: [
      { src: '/assets/impact/think-sustainability-1.jpg', alt: 'Think Sustainability event', caption: 'The event', ratio: '3/2' },
      { src: '/assets/impact/think-sustainability-booths.jpg', alt: 'Think Sustainability booths', caption: 'Booths', ratio: '3/2' },
      { src: '/assets/impact/think-sustainability-plan.jpg', alt: 'Event floor plan and planning material', caption: 'Planning', ratio: '4/3' },
      { src: '/assets/impact/think-sustainability-team.jpg', alt: 'Think Sustainability team', caption: 'Team', ratio: '4/3' },
    ],
    featuredMedia: { src: '/assets/impact/think-sustainability-1.jpg', alt: 'Think Sustainability event', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 4,
    scale: 'lead',
  },
  {
    id: 'head-girl',
    title: 'Head Girl',
    organization: 'Pakistan International School Jeddah — English Section',
    year: '2023–24',
    yearSort: 2023,
    date: 'Sep 2023 — May 2024',
    role: 'Student Leadership',
    primaryCategory: 'impact',
    secondaryTags: ['lead', 'speak', 'operate'],
    shortDescription:
      'School-wide student representation — a team of 10+, workshops reaching 1,000+ students, engagement up 40%.',
    fullDescription: [
      'The first version of a lot of what came later: representing students, speaking in front of the whole school, coordinating teams and events, and learning that most leadership is logistics with a deadline.',
      'The part that mattered most was the workshop programme — building something that reached the whole school rather than the usual few, and having the engagement numbers to show whether it landed.',
    ],
    contribution: [
      'Led a team of 10+ student representatives, connecting students and administration',
      'Planned and operationalised personal development workshops benefiting 1,000+ students',
      'Improved student engagement metrics by 40%',
      'Served as the primary liaison for student concerns, working with faculty to improve student policies',
    ],
    metrics: [
      { value: '1,000+', label: 'Students reached', verified: true },
      { value: '40%', label: 'Engagement improvement', verified: true },
      { value: '10+', label: 'Representatives led', verified: true },
    ],
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: false,
    order: 5,
  },
  {
    id: 'sustainability-literacy',
    title: 'Sustainability Literacy',
    organization: 'UBT',
    year: '2025',
    yearSort: 2025,
    role: 'Assessment & Analysis',
    primaryCategory: 'impact',
    secondaryTags: ['analyze', 'research', 'build'],
    shortDescription:
      'Measuring what students actually understand about sustainability, rather than assuming.',
    fullDescription: [
      'A sustainability literacy assessment run across an event: SDGs, climate, ESG, circular economy, responsible consumption, biodiversity, ethical leadership and Vision 2030. The point was to get a baseline instead of guessing what people already know.',
    ],
    contribution: [
      'Built the assessment across the SDG, climate, ESG and circular economy themes',
      'Ran it at the event and analysed the responses',
    ],
    metrics: [{ value: '~70', label: 'Event responses', verified: false }],
    images: [
      { src: '/assets/impact/literacy-survey.jpg', alt: 'Sustainability literacy assessment material', caption: 'Assessment', ratio: '4/3' },
    ],
    featuredMedia: { src: '/assets/impact/literacy-survey.jpg', alt: 'Sustainability literacy assessment material', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 6,
  },
  {
    id: 'bais-advisory-board',
    title: 'BAIS Advisory Board',
    organization: 'UBT',
    year: '2025—NOW',
    yearSort: 2025,
    role: 'Student Representative',
    primaryCategory: 'impact',
    secondaryTags: ['lead', 'research'],
    shortDescription:
      'Sitting on the programme advisory board as the student voice on the BAIS curriculum.',
    contribution: ['Represent students in programme and curriculum discussions'],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 7,
  },
];

/* ============================================================
   DERIVED VIEWS — never re-declare work anywhere else.
   ============================================================ */

const byOrder = (a: WorkItem, b: WorkItem) => a.order - b.order;

export const workById = (id: string): WorkItem | undefined =>
  work.find((w) => w.id === id);

export const workByCategory = (category: WorkItem['primaryCategory']): WorkItem[] =>
  work.filter((w) => w.primaryCategory === category).sort(byOrder);

export const indexWork: WorkItem[] = work
  .filter((w) => w.showInIndex)
  .sort((a, b) => b.yearSort - a.yearSort || a.order - b.order);

export const speakingWork: WorkItem[] = work
  .filter((w) => w.showInSpeaking)
  .sort((a, b) => b.yearSort - a.yearSort || a.order - b.order);

export const categoryMeta = {
  business: {
    index: '01',
    title: 'Business',
    disciplines: ['Startups', 'Analytics', 'Entrepreneurship', 'Marketing', 'Strategy'],
    blurb:
      'Building things, selling things, and reading the numbers that tell you whether either worked.',
    path: '/business',
  },
  technology: {
    index: '02',
    title: 'Technology',
    disciplines: ['AI', 'Robotics', 'Emerging Technology', 'Prototyping'],
    blurb:
      'Hardware that has to physically work, and software that has to be worth the complexity.',
    path: '/technology',
  },
  impact: {
    index: '03',
    title: 'Impact',
    disciplines: ['Sustainability', 'Leadership', 'Community', 'Institutional Work'],
    blurb:
      'Sustainability treated as an evidence problem, and leadership treated as an operating one.',
    path: '/impact',
  },
} as const;
