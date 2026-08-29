/* ============================================================
   THE EIGHT FOUNDER STYLES
   ------------------------------------------------------------
   A style is the intersection of three preference axes:

     HORIZON   Vision (V)   ..  Ground (G)
     ARENA     Outward (O)  ..  Inward (I)
     MODE      Momentum (M) ..  Rigour (R)

   Three binary axes give eight combinations, and the three-letter
   marker (VIM, GOR, and so on) is the same marker the Founder
   Intelligence Profile prints.

   A style describes how a founder prefers to operate. It is not an
   ability score, and it contributes no points to the FQ score.

   This file is the single source of style copy. The styles page,
   the axis picker and the Style Finder all read from it.
   ============================================================ */

window.FC_STYLES = {
  VOM: {
    code: 'VOM',
    name: 'Pioneer',
    axes: ['Vision', 'Outward', 'Momentum'],
    line: 'Opens ground nobody has walked on yet, and pulls other people onto it.',
    reading:
      'Vision plus an outward arena plus momentum produces a founder who moves toward possibility in public. Pioneers create belief before there is evidence — which is exactly what a category-creating venture needs, and exactly what makes disciplined evidence the thing to insist on.',
    strengths: [
      'Frames an opportunity before the market has language for it',
      'Recruits, raises and sells on conviction',
      'Comfortable acting while the picture is still incomplete',
      'Creates energy and forward motion in a founding team'
    ],
    watch: [
      'Narrative may run ahead of what the evidence supports',
      'Enthusiasm can read as a closed door to challenge',
      'Early commitments made faster than they can be honoured'
    ],
    edges: ['Commercial', 'Strategic'],
    stages: ['Discover', 'Validate'],
    roles: ['CEO', 'CCO/CRO'],
    complements: ['GIR', 'GIM'],
    complementNote:
      'Pair with a founder who is grounded, inward and rigorous. The Pioneer opens the market; the Operator makes the promises true.'
  },

  VOR: {
    code: 'VOR',
    name: 'Navigator',
    axes: ['Vision', 'Outward', 'Rigour'],
    line: 'Reads the terrain, sets a course others can follow, and holds it.',
    reading:
      'Vision with rigour, expressed outwardly. Navigators are the founders investors describe as "unusually clear". They hold a long view but sequence it into a route, and they bring stakeholders with them because the reasoning is visible.',
    strengths: [
      'Turns an ambitious thesis into a sequenced plan',
      'Strong stakeholder, board and investor communication',
      'Makes trade-offs explicit rather than implicit',
      'Keeps a founding team pointed at the same horizon'
    ],
    watch: [
      'Can over-plan a market that has not answered yet',
      'Route-holding may shade into slow reversal of a wrong route',
      'Time in stakeholder management taken from time with customers'
    ],
    edges: ['Strategic', 'Capital and governance'],
    stages: ['Validate', 'Build', 'Scale'],
    roles: ['CEO', 'Venture Builder'],
    complements: ['GIM', 'VIM'],
    complementNote:
      'Pair with builders who compress cycle time. The Navigator sets the route; a Scaler or Inventor shortens the distance between decisions.'
  },

  VIM: {
    code: 'VIM',
    name: 'Inventor',
    axes: ['Vision', 'Inward', 'Momentum'],
    line: 'Builds the thing that should exist, fast, and learns from what it does.',
    reading:
      'Vision turned inward, at speed. Inventors create value through the product, the model or the mechanism itself. They compress the distance between an idea and something real — and their principal risk is that the loop closes inside the building rather than with a customer.',
    strengths: [
      'Very short idea-to-artefact cycle',
      'Original problem framing and product insight',
      'Learns by building rather than by discussing',
      'Independent — needs little external validation to start'
    ],
    watch: [
      'Reality Contact: conviction can outrun external evidence',
      'Commercial proof arrives later than the product does',
      'Speed may outrun challenge and verification'
    ],
    edges: ['Product', 'Technical', 'Strategic'],
    stages: ['Discover', 'Validate', 'Build'],
    roles: ['CPO', 'CTO', 'Venture Builder'],
    complements: ['GOR', 'GOM'],
    complementNote:
      'Pair with an outward, grounded co-founder who tests the invention against a paying market and asks the hard second question.'
  },

  VIR: {
    code: 'VIR',
    name: 'Strategist',
    axes: ['Vision', 'Inward', 'Rigour'],
    line: 'Works out where the value actually sits before committing the venture to it.',
    reading:
      'Vision, inward, resolved before moving. Strategists build the model — of the market, the unit economics, the system — and are usually right about structure. The cost is time: analysis can substitute for the one experiment that would settle the question.',
    strengths: [
      'Sees second- and third-order consequences early',
      'Strong at unit economics, structure and sequencing',
      'Resistant to hype and to their own first answer',
      'Decisions, once made, are well-founded and defensible'
    ],
    watch: [
      'Deliberation can delay contact with the market',
      'Under-weights information that only action produces',
      'May under-communicate reasoning that lives in their head'
    ],
    edges: ['Strategic', 'Financial', 'Capital and governance'],
    stages: ['Validate', 'Build', 'Steward'],
    roles: ['CEO', 'CFO', 'COO'],
    complements: ['GOM', 'VOM'],
    complementNote:
      'Pair with an outward, momentum-led co-founder who converts the model into customer conversations this week rather than next quarter.'
  },

  GOM: {
    code: 'GOM',
    name: 'Rainmaker',
    axes: ['Ground', 'Outward', 'Momentum'],
    line: 'Turns relationships into revenue now, and revenue into proof.',
    reading:
      'Grounded, outward, fast. Rainmakers generate the commercial evidence every other lens depends on. They are the founders who reach the buyer while others are still refining the deck — and the founders most likely to sell something the venture cannot yet deliver.',
    strengths: [
      'Fast route to customers, partners and cash',
      'Reads buyers, incentives and objections accurately',
      'Creates early commercial evidence under real conditions',
      'Resilient in the face of rejection'
    ],
    watch: [
      'Commitments made ahead of delivery capability',
      'Attention pulled to the next deal rather than the current one',
      'Pipeline optimism reported as pipeline fact'
    ],
    edges: ['Commercial', 'People'],
    stages: ['Validate', 'Sell', 'Scale'],
    roles: ['CCO/CRO', 'CEO'],
    complements: ['VIR', 'GIR'],
    complementNote:
      'Pair with an inward, rigorous co-founder who can build and deliver what has been sold, and who holds the line on what can be promised.'
  },

  GOR: {
    code: 'GOR',
    name: 'Diplomat',
    axes: ['Ground', 'Outward', 'Rigour'],
    line: 'Builds the coalition, the licence and the trust the venture needs to exist.',
    reading:
      'Grounded, outward, deliberate. Diplomats create value through institutions, regulators, partners and long relationships. In markets where access is the constraint — and much of MENAP is such a market — this is frequently the decisive founder capability.',
    strengths: [
      'Access to institutions, regulators and incumbent partners',
      'Negotiates durable rather than merely favourable terms',
      'Repairs conflict inside a founding team',
      'Very high stakeholder trust'
    ],
    watch: [
      'Consensus-seeking can defer a necessary decision',
      'Relationship preservation over commercial candour',
      'Slow to remove a person the venture has outgrown'
    ],
    edges: ['People', 'Commercial', 'Capital and governance'],
    stages: ['Build', 'Sell', 'Steward'],
    roles: ['CEO', 'COO', 'CCO/CRO'],
    complements: ['VIM', 'VOM'],
    complementNote:
      'Pair with a vision-led founder who supplies the product or the category conviction the coalition is being built around.'
  },

  GIM: {
    code: 'GIM',
    name: 'Scaler',
    axes: ['Ground', 'Inward', 'Momentum'],
    line: 'Takes something that works and makes it work at ten times the volume.',
    reading:
      'Grounded, inward, fast. Scalers create value inside the machine — throughput, systems, hiring, unit-level improvement — and they do it at pace. They are strongest once a venture has something proven to multiply, and least useful when there is nothing yet to multiply.',
    strengths: [
      'Rapid operational improvement against real numbers',
      'Builds systems, process and hiring engines quickly',
      'Comfortable with metrics, instrumentation and throughput',
      'Removes friction other founders do not notice'
    ],
    watch: [
      'May scale a model before it has been validated',
      'Optimises the current answer rather than questioning it',
      'Momentum can compress the time available for judgement'
    ],
    edges: ['Operational', 'Product', 'Financial'],
    stages: ['Build', 'Sell', 'Scale'],
    roles: ['COO', 'Venture Builder', 'CPO'],
    complements: ['VOR', 'VOM'],
    complementNote:
      'Pair with a vision-led, outward co-founder who confirms the machine is pointed at a market worth multiplying.'
  },

  GIR: {
    code: 'GIR',
    name: 'Operator',
    axes: ['Ground', 'Inward', 'Rigour'],
    line: 'Makes the venture reliable — and makes its numbers mean what they say.',
    reading:
      'Grounded, inward, resolved before acting. Operators are the founders whose forecasts hold. They create value through reliability, control and honest measurement, and they are frequently the reason an ambitious venture survives contact with its own growth.',
    strengths: [
      'Delivery against commitments, on time and on cost',
      'Independent reality testing of the venture’s own claims',
      'Strong financial, operational and governance discipline',
      'Calm in operational crisis'
    ],
    watch: [
      'Can under-invest in the upside case',
      'Caution read by others as resistance to ambition',
      'Slower to abandon a working system that has stopped fitting'
    ],
    edges: ['Operational', 'Financial', 'Capital and governance'],
    stages: ['Build', 'Scale', 'Steward'],
    roles: ['COO', 'CFO', 'CEO'],
    complements: ['VOM', 'VIM'],
    complementNote:
      'Pair with a vision-led founder who supplies ambition and market pull, and who benefits from being asked for the evidence.'
  }
};

/* Axis definitions, shared by the picker and the Style Finder. */
window.FC_AXES = [
  {
    key: 'horizon',
    name: 'Horizon',
    hint: 'What pulls attention',
    poles: [
      { code: 'V', name: 'Vision', blurb: 'Pulled by what could exist' },
      { code: 'G', name: 'Ground', blurb: 'Pulled by what is in front of them' }
    ]
  },
  {
    key: 'arena',
    name: 'Arena',
    hint: 'Where value gets created',
    poles: [
      { code: 'O', name: 'Outward', blurb: 'Through markets, people, relationships' },
      { code: 'I', name: 'Inward', blurb: 'Through the product, model or system' }
    ]
  },
  {
    key: 'mode',
    name: 'Mode',
    hint: 'How decisions get made',
    poles: [
      { code: 'M', name: 'Momentum', blurb: 'Moves in order to learn' },
      { code: 'R', name: 'Rigour', blurb: 'Resolves in order to move' }
    ]
  }
];
