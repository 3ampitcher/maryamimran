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
    year: '2025—NOW',
    yearSort: 2025,
    role: 'Founder',
    primaryCategory: 'business',
    secondaryTags: ['build', 'research', 'analyze', 'lead'],
    shortDescription:
      'Financial clarity for Saudi SMEs — from point-of-sale analytics to an AI financial advisor.',
    fullDescription: [
      'Tiin started from a straightforward observation: a lot of small businesses in Saudi Arabia have their numbers, but not their answers. The data sits in a point-of-sale system or an accounting tool, and the owner still cannot say whether this month was actually good.',
      'The work has been mostly customer discovery and iteration — talking to owners, watching where the confusion actually lives, and rebuilding the product around what turned out to matter. That moved the idea from analytics dashboards toward financial interpretation: not more charts, but a clear read on business health, cash flow, margins, receivables and expenses, with recommendations an owner can act on this week.',
      'The current direction is an AI financial advisor that reads a business the way a good accountant would, and explains it in plain language over the channels owners already use.',
    ],
    contribution: [
      'Ran customer discovery with Saudi SME owners and rebuilt the product thesis around what they actually asked for',
      'Designed the business health model — cash flow, profitability and margins, receivables, expense structure',
      'Built and vibe-coded working prototypes to test the interpretation layer before committing to a stack',
      'Explored WATI / WhatsApp as the delivery channel and Zoho and accounting systems as data sources',
      'Developed the reporting concept: a readable financial report rather than a dashboard to be deciphered',
      'Took Tiin through the Monsha’at accelerator and pitched at Demo Day',
    ],
    phases: [
      { label: 'POS Analytics', note: 'Reading what the till already knows' },
      { label: 'Business Software', note: 'Where owners asked for help' },
      { label: 'Finance', note: 'The real question underneath' },
      { label: 'AI Financial Advisory', note: 'Current direction' },
    ],
    metrics: [],
    images: [
      { src: '/assets/business/tiin-product.jpg', alt: 'Tiin product interface', caption: 'Product interface', ratio: '16/9' },
      { src: '/assets/business/tiin-deck.jpg', alt: 'Tiin pitch deck slide', caption: 'Pitch deck', ratio: '16/9' },
      { src: '/assets/business/tiin-accelerator.jpg', alt: 'Tiin at the Monsha’at accelerator', caption: 'Accelerator', ratio: '3/2' },
      { src: '/assets/business/tiin-discovery.jpg', alt: 'Customer discovery notes and research', caption: 'Customer discovery', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/business/tiin-product.jpg', alt: 'Tiin product interface', ratio: '4/3' },
    externalLinks: [],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 1,
    scale: 'lead',
  },
  {
    id: 'tiin-demo-day',
    title: 'Tiin Demo Day',
    organization: 'Monsha’at Accelerator',
    year: '2026',
    yearSort: 2026,
    role: 'Pitch',
    primaryCategory: 'business',
    secondaryTags: ['speak', 'build'],
    shortDescription:
      'Pitching Tiin at the end of the accelerator — the product, the market and what comes next.',
    fullDescription: [
      'Demo Day is where the accelerator work gets compressed into a few minutes on stage: what the problem is, who has it, what has been built, and why this direction.',
    ],
    contribution: [
      'Built the pitch narrative around the SME finance problem rather than the feature list',
      'Presented Tiin to the accelerator cohort, mentors and invited guests',
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
    year: '2024',
    yearSort: 2024,
    role: 'Operations',
    primaryCategory: 'business',
    secondaryTags: ['operate', 'lead', 'market'],
    shortDescription:
      'An eight-day student food operation — supply, staffing, pricing and daily numbers.',
    fullDescription: [
      'Eight days of running an actual food operation: sourcing, pricing, rotas, service and the daily reconciliation at the end of it. The interesting part was not the event, it was the operating problem — demand that moves hour to hour, a volunteer workforce, and margins that only survive if the buying is right.',
    ],
    contribution: [
      'Coordinated the student team across the run of the event',
      'Handled the operating side: supply, pricing, service flow and daily takings',
    ],
    metrics: [
      { value: 'SAR 30,000', label: 'Approximate revenue', verified: false },
      { value: '~75', label: 'Students involved', verified: false },
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
    contribution: [
      'Worked the consumer research and positioning',
      'Built and presented the case',
    ],
    featuredMedia: { src: '/assets/business/brandstorm.jpg', alt: 'L’Oréal Brandstorm presentation', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 4,
  },
  {
    id: 'moonshot-pirates',
    title: 'Moonshot Pirates',
    year: '2024',
    yearSort: 2024,
    role: 'Competition',
    primaryCategory: 'business',
    secondaryTags: ['compete', 'build', 'research'],
    shortDescription:
      'A moonshot brief — taking a large problem and building a case for one specific answer to it.',
    contribution: [
      'Developed and pitched the concept as part of a team',
    ],
    /* TODO(maryam): confirm the exact wording of the Top 7 / 78 result before publishing it. */
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 5,
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
    contribution: [
      'Ran the brand voice and content',
      'Handled social media and audience growth',
    ],
    featuredMedia: { src: '/assets/business/silent-kitchen.jpg', alt: 'Silent Kitchen Story brand work', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 6,
    scale: 'quiet',
  },
  {
    id: 'foni',
    title: 'Foni',
    year: '2024',
    yearSort: 2024,
    role: 'Marketing',
    primaryCategory: 'business',
    secondaryTags: ['market', 'design'],
    shortDescription: 'Marketing and communications work.',
    /* TODO(maryam): add the detail you want public here — what Foni is and what you ran. */
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 7,
    scale: 'quiet',
  },
  {
    id: 'pakistan-humari-pehchaan',
    title: 'Pakistan Humari Pehchaan',
    year: '2023',
    yearSort: 2023,
    role: 'PR & Communications',
    primaryCategory: 'business',
    secondaryTags: ['market', 'lead'],
    shortDescription: 'Communications and PR for a cultural programme.',
    contribution: ['Handled PR and communications'],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 8,
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
    order: 2,
    scale: 'lead',
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
    order: 3,
  },
  {
    id: 'tks',
    title: 'The Knowledge Society',
    organization: 'TKS',
    year: '2023–24',
    yearSort: 2023,
    role: 'Emerging Technology',
    primaryCategory: 'technology',
    secondaryTags: ['learn', 'research', 'build', 'speak'],
    shortDescription:
      'A programme built around emerging technology — research, challenges and presenting what you found.',
    fullDescription: [
      'TKS is structured around going deep on emerging technologies and then having to explain them. The work was research, challenges and hackathons, and presenting the result to people who would ask the obvious hard question.',
    ],
    contribution: [
      'Researched emerging technologies and presented findings',
      'Worked through challenges and hackathon briefs',
      'Explored reinforcement learning, including Q-learning, as part of the technical work',
    ],
    featuredMedia: { src: '/assets/technology/tks.jpg', alt: 'TKS presentation work', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: false,
    order: 4,
  },
  {
    id: 'air-to-water',
    title: 'Air-to-Water',
    organization: 'TKS',
    year: '2024',
    yearSort: 2024,
    role: 'Research Project',
    primaryCategory: 'technology',
    secondaryTags: ['research', 'build'],
    shortDescription:
      'Atmospheric water generation as a water-scarcity approach — the physics, the cost and the honest limits.',
    contribution: [
      'Researched atmospheric water generation and the conditions under which it makes sense',
      'Built and presented the case',
    ],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 5,
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
    images: [
      { src: '/assets/technology/prototyping-1.jpg', alt: 'Arduino and sensor prototyping', ratio: '1/1' },
      { src: '/assets/technology/prototyping-2.jpg', alt: 'Raspberry Pi build in progress', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/technology/prototyping-1.jpg', alt: 'Arduino and sensor prototyping', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 6,
    scale: 'quiet',
  },

  /* ==========================================================
     IMPACT
     ========================================================== */
  {
    id: 'sustainability-club',
    title: 'UBT Sustainability Club',
    organization: 'University of Business & Technology',
    year: '2024—NOW',
    yearSort: 2024,
    role: 'President',
    primaryCategory: 'impact',
    secondaryTags: ['lead', 'operate', 'market'],
    shortDescription:
      'PR lead, then President — running the club’s programming, communications and teams.',
    fullDescription: [
      'Started on PR and communications, then took over as President. The job is less about sustainability as a topic and more about getting a student organisation to actually run: a calendar that holds, teams that know what they are doing, and communications that make people show up.',
      'The club also sits between students and the university’s own sustainability work, which is where the more interesting collaborations come from.',
    ],
    contribution: [
      'Led PR and communications before moving into the presidency',
      'Ran student sustainability initiatives and the events calendar',
      'Built and coordinated the club’s teams',
      'Worked with the university on collaborations and institutional programming',
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
    order: 2,
    scale: 'lead',
  },
  {
    id: 'ui-greenmetric',
    title: 'UI GreenMetric',
    organization: 'UBT',
    year: '2025',
    yearSort: 2025,
    role: 'Evidence & Reporting',
    primaryCategory: 'impact',
    secondaryTags: ['analyze', 'research', 'operate'],
    shortDescription:
      'Institutional sustainability reporting — collecting the evidence a university ranking actually asks for.',
    fullDescription: [
      'UI GreenMetric ranks universities on sustainability, and it does not take your word for anything. Every claim needs documentation behind it: energy, carbon, waste, water, transport, and the education and research side.',
      'The work is unglamorous and genuinely analytical — finding where the institutional data lives, getting it into a consistent shape, and assembling a submission where every figure has evidence attached to it. It is the part of sustainability that looks like data work, because it is.',
    ],
    contribution: [
      'Collected and organised institutional evidence across the ranking categories',
      'Worked the infrastructure, energy, carbon, waste, water and transport data',
      'Documented sustainability education and research activity',
      'Supported the submission and the wider Race to Zero-related reporting',
    ],
    images: [
      { src: '/assets/impact/greenmetric-data.jpg', alt: 'GreenMetric reporting documentation', caption: 'Reporting', ratio: '4/3' },
      { src: '/assets/impact/campus.jpg', alt: 'UBT campus', caption: 'Campus', ratio: '3/2' },
    ],
    featuredMedia: { src: '/assets/impact/greenmetric-data.jpg', alt: 'GreenMetric reporting documentation', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 3,
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
    metrics: [
      { value: '~70', label: 'Event responses', verified: false },
    ],
    images: [
      { src: '/assets/impact/literacy-survey.jpg', alt: 'Sustainability literacy assessment material', caption: 'Assessment', ratio: '4/3' },
    ],
    featuredMedia: { src: '/assets/impact/literacy-survey.jpg', alt: 'Sustainability literacy assessment material', ratio: '4/3' },
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 4,
  },
  {
    id: 'institutional-sustainability',
    title: 'Institutional Sustainability',
    organization: 'UBT',
    year: '2025—NOW',
    yearSort: 2025,
    role: 'Strategy Support',
    primaryCategory: 'impact',
    secondaryTags: ['analyze', 'research', 'operate'],
    shortDescription:
      'Supporting the university’s sustainability strategy, documentation and commitments.',
    contribution: [
      'Supported institutional sustainability documentation and strategy work',
      'Contributed to Race to Zero-related reporting',
    ],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 5,
  },
  {
    id: 'head-girl',
    title: 'Head Girl',
    year: '2022–23',
    yearSort: 2022,
    role: 'Student Leadership',
    primaryCategory: 'impact',
    secondaryTags: ['lead', 'speak', 'operate'],
    shortDescription:
      'School-wide student representation — speaking, coordination and running things that had to happen.',
    fullDescription: [
      'The first version of a lot of what came later: representing students, speaking in front of the whole school, coordinating teams and events, and learning that most leadership is logistics with a deadline.',
    ],
    contribution: [
      'Represented the student body',
      'Spoke at school-wide events',
      'Coordinated student teams, volunteers and events',
    ],
    showInIndex: true,
    showInSpeaking: true,
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
    contribution: [
      'Represent students in programme and curriculum discussions',
    ],
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 7,
  },
  {
    id: 'student-workshops',
    title: 'Student Workshops',
    year: '2024–25',
    yearSort: 2024,
    role: 'Facilitator',
    primaryCategory: 'impact',
    secondaryTags: ['speak', 'lead'],
    shortDescription: 'Running workshops for students on the things I had just figured out myself.',
    /* TODO(maryam): add the reach figure here once you have the exact verified wording. */
    contribution: ['Designed and facilitated student workshops'],
    showInIndex: true,
    showInSpeaking: true,
    showInRecognition: false,
    order: 8,
  },
  {
    id: 'youth-summit',
    title: 'Youth Summit',
    year: '2024',
    yearSort: 2024,
    role: 'Participant & Contributor',
    primaryCategory: 'impact',
    secondaryTags: ['lead', 'speak'],
    shortDescription: 'Youth leadership and community programming.',
    /* TODO(maryam): add the summit name and your exact role. */
    showInIndex: true,
    showInSpeaking: false,
    showInRecognition: false,
    order: 9,
    scale: 'quiet',
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
