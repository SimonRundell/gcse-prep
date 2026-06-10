/** @file boards.js — Exam board specifications, topics and assessment objective metadata. */

export const BOARD_COLORS = { AQA: '#e63946', Edexcel: '#0096c7', OCR: '#7b2d8b' };

export const SPEC = {
  AQA:     { maths: 'AQA 8300',        language: 'AQA 8700',        literature: 'AQA 8702' },
  Edexcel: { maths: 'Edexcel 1MA1',    language: 'Edexcel 1EN0',    literature: 'Edexcel 1ET0' },
  OCR:     { maths: 'OCR J560',        language: 'OCR J351',        literature: 'OCR J352' },
};

export const SUBJECT_LABELS = {
  maths:      { label: 'Mathematics',       color: 'tag-maths' },
  language:   { label: 'English Language',  color: 'tag-lang'  },
  literature: { label: 'English Literature',color: 'tag-lit'   },
};

export const AO_DESC = {
  AO1: 'identify and interpret evidence',
  AO2: 'analyse language, form and structure',
  AO3: 'understand text and context',
  AO4: 'evaluate critically',
  AO5: 'communicate clearly (content)',
  AO6: 'technical accuracy (SPaG)',
};

export const TOPIC_BANK_MAP = {
  Number:     ['powers and roots','unit conversion','fractions','factors and multiples','FDP ordering','fraction subtraction','ratio in n:1 form','ratio sharing','percentage decrease','money problem','decimals squared','speed','inverse proportion'],
  Algebra:    ['simplifying algebra','function machines','sequences','number reasoning'],
  Geometry:   ['congruence and enlargement','compound shapes','prisms','circle areas with ratio','exact trig values','coordinate geometry'],
  Statistics: ['sample space and probability','averages reasoning','bar chart critique','frequency tree'],
};

export const BOARDS = {
  AQA: {
    maths: {
      Number: [
        {name:'Fractions, decimals & percentages',paper:'Paper 1/2/3',qRef:'F:Q3–8·H:Q2–6',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Non-calc & Calc',aos:['AO1','AO2'],key:'AQA GCSE Maths fractions decimals percentages — FDP conversion, percentage change, reverse percentages'},
        {name:'Ratio & proportion',paper:'Paper 2/3',qRef:'F:Q10–15·H:Q8–14',marks:[3,4,5,6],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'AQA ratio and proportion — sharing, best value, direct/inverse proportion'},
        {name:'Indices & surds',paper:'Paper 1/2',qRef:'H:Q5–12',marks:[2,3,4],tiers:['Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'AQA indices laws, negative/fractional; surds simplify and rationalise'},
        {name:'Standard form',paper:'Paper 1',qRef:'F:Q14·H:Q7',marks:[2,3],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1'],key:'AQA standard form converting and calculating'},
      ],
      Algebra: [
        {name:'Solving linear equations',paper:'Paper 1/2',qRef:'F:Q8–12·H:Q5–10',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'AQA solving linear equations including unknowns on both sides'},
        {name:'Quadratic equations',paper:'Paper 1/2',qRef:'H:Q14–20',marks:[3,4,5],tiers:['Higher'],calc:'Non-calc',aos:['AO1','AO2','AO3'],key:'AQA quadratic equations — factorising, completing square, quadratic formula'},
        {name:'Simultaneous equations',paper:'Paper 2/3',qRef:'F:Q18–22·H:Q15–20',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2'],key:'AQA simultaneous linear equations; linear/quadratic for Higher'},
        {name:'Sequences & nth term',paper:'Paper 1',qRef:'F:Q10–14·H:Q8–12',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'AQA sequences — arithmetic, geometric, linear and quadratic nth term'},
      ],
      Geometry: [
        {name:"Pythagoras' theorem",paper:'Paper 2/3',qRef:'F:Q15–20·H:Q10–16',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:"AQA Pythagoras theorem — 2D and 3D problems"},
        {name:'Trigonometry',paper:'Paper 2/3',qRef:'F:Q20–25·H:Q14–20',marks:[3,4,5,6],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'AQA trigonometry SOHCAHTOA; sine rule cosine rule for Higher'},
        {name:'Circle theorems',paper:'Paper 2',qRef:'H:Q18–24',marks:[3,4,5],tiers:['Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'AQA circle theorems — all 8 theorems, proof and application'},
        {name:'Vectors',paper:'Paper 1',qRef:'H:Q22–28',marks:[3,4,5],tiers:['Higher'],calc:'Non-calc',aos:['AO2','AO3'],key:'AQA vectors — addition, scalar multiples, vector proof'},
      ],
      Statistics: [
        {name:'Mean, median, mode & range',paper:'Paper 2/3',qRef:'F:Q6–12·H:Q4–8',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2'],key:'AQA averages from lists and frequency tables; estimated mean from grouped data'},
        {name:'Probability',paper:'Paper 2/3',qRef:'F:Q14–20·H:Q10–16',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'AQA probability — single, combined, tree diagrams, Venn diagrams'},
        {name:'Cumulative frequency & box plots',paper:'Paper 2/3',qRef:'H:Q16–22',marks:[4,5,6],tiers:['Higher'],calc:'Calculator',aos:['AO2','AO3'],key:'AQA cumulative frequency curves, box plots, IQR, comparing distributions'},
      ],
    },
    language: {
      Reading: [
        {name:'Q1 · List / identify (4 marks)',paper:'Paper 1 or 2',qRef:'Q1—4 marks',marks:[4],tiers:['F','H'],calc:'N/A',aos:['AO1'],key:'AQA English Language Paper 1 Q1: list four things from the source — AO1. Provide a 4–6 sentence fiction extract.'},
        {name:'Q2 · Language analysis (8 marks)',paper:'Paper 1',qRef:'Q2—8 marks',marks:[8],tiers:['F','H'],calc:'N/A',aos:['AO2'],key:'AQA English Language Paper 1 Q2: how does the writer use language — AO2. Provide a 4–6 sentence extract.'},
        {name:'Q3 · Structure (8 marks)',paper:'Paper 1',qRef:'Q3—8 marks',marks:[8],tiers:['F','H'],calc:'N/A',aos:['AO2'],key:'AQA English Language Paper 1 Q3: how does the writer structure the text — AO2. Provide a 5–7 sentence extract.'},
        {name:'Q4 · Evaluate (20 marks)',paper:'Paper 1',qRef:'Q4—20 marks',marks:[20],tiers:['F','H'],calc:'N/A',aos:['AO4'],key:'AQA English Language Paper 1 Q4: critical evaluation — to what extent do you agree — AO4. Provide extract and a statement.'},
        {name:'P2 Q2 · Summarise (8 marks)',paper:'Paper 2',qRef:'Q2—8 marks',marks:[8],tiers:['F','H'],calc:'N/A',aos:['AO1'],key:'AQA English Language Paper 2 Q2: summarise differences between two sources — AO1. Provide two short contrasting non-fiction extracts.'},
        {name:'P2 Q4 · Compare viewpoints (16 marks)',paper:'Paper 2',qRef:'Q4—16 marks',marks:[16],tiers:['F','H'],calc:'N/A',aos:['AO3'],key:'AQA English Language Paper 2 Q4: compare writers perspectives — AO3. Provide two contrasting non-fiction extracts.'},
      ],
      Writing: [
        {name:'Descriptive / narrative writing (40 marks)',paper:'Paper 1',qRef:'Q5—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO5','AO6'],key:'AQA Paper 1 Q5: descriptive or narrative writing — AO5 AO6. Give a specific prompt.'},
        {name:'Viewpoint writing (40 marks)',paper:'Paper 2',qRef:'Q5—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO5','AO6'],key:'AQA Paper 2 Q5: writing to present a viewpoint — AO5 AO6. Give a real-world topic, audience and purpose.'},
      ],
    },
    literature: {
      Shakespeare: [
        {name:'Macbeth — extract + essay',paper:'Paper 1, Section A',qRef:'Q1—34 marks',marks:[34],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'AQA Macbeth: provide a 14–18 line extract with stage directions; analyse extract then explore theme/character in whole play. AO1 AO2 AO3.'},
        {name:'Romeo and Juliet — extract + essay',paper:'Paper 1, Section A',qRef:'Q1—34 marks',marks:[34],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'AQA Romeo and Juliet: extract + whole-play essay. AO1 AO2 AO3.'},
      ],
      '19th Century Prose': [
        {name:'A Christmas Carol — extract + essay',paper:'Paper 1, Section B',qRef:'Q2—34 marks',marks:[34],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'AQA A Christmas Carol: prose extract then whole-novel essay including Victorian context. AO1 AO2 AO3.'},
        {name:'Jekyll and Hyde — extract + essay',paper:'Paper 1, Section B',qRef:'Q2—34 marks',marks:[34],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'AQA Jekyll and Hyde: extract + whole-novel essay with context. AO1 AO2 AO3.'},
      ],
      'Modern Text': [
        {name:'An Inspector Calls — essay',paper:'Paper 2, Section A',qRef:'Q1—34 marks',marks:[34],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'AQA An Inspector Calls: whole-play essay (no extract) with context. AO1 AO2 AO3.'},
        {name:'Lord of the Flies — essay',paper:'Paper 2, Section A',qRef:'Q1—34 marks',marks:[34],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'AQA Lord of the Flies: whole-novel essay with context. AO1 AO2 AO3.'},
      ],
      Poetry: [
        {name:'Power & Conflict — single poem',paper:'Paper 2, Section B',qRef:'Q1a—24 marks',marks:[24],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2'],key:'AQA Power and Conflict anthology: provide a complete poem (e.g. Ozymandias, Remains, Kamikaze). Ask how poet presents a theme. AO1 AO2.'},
        {name:'Unseen poetry — single poem',paper:'Paper 2, Section C',qRef:'Q2—24 marks',marks:[24],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2'],key:'AQA Unseen poetry: provide a complete unseen poem (12–20 lines). Ask how poet presents feelings. AO1 AO2.'},
      ],
    },
  },
  Edexcel: {
    maths: {
      Number: [
        {name:'Fractions, decimals & percentages',paper:'Paper 1/2/3',qRef:'F:Q3–8·H:Q2–7',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Non-calc & Calc',aos:['AO1','AO2'],key:'Edexcel GCSE Maths fractions decimals percentages — conversions, percentage increase/decrease, reverse percentages'},
        {name:'Ratio & proportion',paper:'Paper 2/3',qRef:'F:Q10–16·H:Q8–14',marks:[3,4,5,6],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'Edexcel ratio proportion — dividing in ratio, unitary, direct/inverse proportion graphs'},
        {name:'Indices & surds',paper:'Paper 1',qRef:'H:Q5–12',marks:[2,3,4],tiers:['Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'Edexcel indices laws, negative/fractional; surds — simplify, expand, rationalise'},
        {name:'Standard form',paper:'Paper 1',qRef:'F:Q13·H:Q6',marks:[2,3],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1'],key:'Edexcel standard form converting, four operations'},
      ],
      Algebra: [
        {name:'Solving linear equations',paper:'Paper 1',qRef:'F:Q7–11·H:Q5–9',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'Edexcel linear equations including brackets, fractions, unknowns both sides'},
        {name:'Quadratic equations',paper:'Paper 1',qRef:'H:Q13–20',marks:[3,4,5],tiers:['Higher'],calc:'Non-calc',aos:['AO1','AO2','AO3'],key:'Edexcel quadratic equations — factorising, formula, completing square, quadratic inequalities'},
        {name:'Simultaneous equations',paper:'Paper 2/3',qRef:'F:Q17–22·H:Q14–19',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2'],key:'Edexcel simultaneous equations; linear/quadratic for Higher'},
        {name:'Sequences & nth term',paper:'Paper 1',qRef:'F:Q9–13·H:Q7–11',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'Edexcel sequences — arithmetic, geometric, linear/quadratic nth term'},
      ],
      Geometry: [
        {name:"Pythagoras' theorem",paper:'Paper 2/3',qRef:'F:Q14–19·H:Q9–15',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:"Edexcel Pythagoras 2D and 3D, exact values"},
        {name:'Trigonometry',paper:'Paper 2/3',qRef:'F:Q19–24·H:Q13–19',marks:[3,4,5,6],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'Edexcel trigonometry SOHCAHTOA, exact values; sine rule, cosine rule, area formula for Higher'},
        {name:'Circle theorems',paper:'Paper 2',qRef:'H:Q17–23',marks:[3,4,5],tiers:['Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'Edexcel circle theorems — all theorems, multi-step proof and application'},
        {name:'Vectors',paper:'Paper 1',qRef:'H:Q21–27',marks:[3,4,5],tiers:['Higher'],calc:'Non-calc',aos:['AO2','AO3'],key:'Edexcel vectors — column vectors, magnitude, geometric proof'},
      ],
      Statistics: [
        {name:'Averages & range',paper:'Paper 2/3',qRef:'F:Q5–11·H:Q4–8',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2'],key:'Edexcel averages mean median mode range from lists and frequency tables; estimated mean from grouped data'},
        {name:'Probability',paper:'Paper 2/3',qRef:'F:Q13–19·H:Q9–15',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'Edexcel probability — single, combined, tree diagrams, Venn diagrams, conditional probability'},
        {name:'Cumulative frequency & box plots',paper:'Paper 2/3',qRef:'H:Q15–21',marks:[4,5,6],tiers:['Higher'],calc:'Calculator',aos:['AO2','AO3'],key:'Edexcel cumulative frequency, box plots, IQR, comparing distributions'},
      ],
    },
    language: {
      Reading: [
        {name:'Q1 · Identify true statements (4 marks)',paper:'Paper 1',qRef:'Q1—4 marks',marks:[4],tiers:['F','H'],calc:'N/A',aos:['AO1'],key:'Edexcel English Language Paper 1 Q1: identify four true statements — AO1. Provide a short fiction extract and 8 statements.'},
        {name:'Q2 · Language analysis (8 marks)',paper:'Paper 1',qRef:'Q2—8 marks',marks:[8],tiers:['F','H'],calc:'N/A',aos:['AO2'],key:'Edexcel English Language Paper 1 Q2: analyse language choices — AO2. Provide a 4–6 sentence extract.'},
        {name:'Q4 · Evaluate (20 marks)',paper:'Paper 1',qRef:'Q4—20 marks',marks:[20],tiers:['F','H'],calc:'N/A',aos:['AO4'],key:'Edexcel English Language Paper 1 Q4: evaluate a statement — AO4. Provide extract and statement.'},
        {name:'P2 Q1 · Compare & contrast (10 marks)',paper:'Paper 2',qRef:'Q1—10 marks',marks:[10],tiers:['F','H'],calc:'N/A',aos:['AO1'],key:'Edexcel English Language Paper 2 Q1: compare information from two sources — AO1. Provide two contrasting extracts.'},
        {name:"P2 Q3 · Writer's methods (6 marks)",paper:'Paper 2',qRef:'Q3—6 marks',marks:[6],tiers:['F','H'],calc:'N/A',aos:['AO2'],key:"Edexcel English Language Paper 2 Q3: analyse language to convey viewpoint — AO2. Provide a non-fiction extract."},
      ],
      Writing: [
        {name:'Descriptive / narrative writing (40 marks)',paper:'Paper 1',qRef:'Section B—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO5','AO6'],key:'Edexcel Paper 1 Section B: write a description or narrative — AO5 AO6.'},
        {name:'Transactional writing (40 marks)',paper:'Paper 2',qRef:'Section B—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO5','AO6'],key:'Edexcel Paper 2 Section B: write to communicate a viewpoint — AO5 AO6.'},
      ],
    },
    literature: {
      Shakespeare: [
        {name:'Macbeth — extract + essay',paper:'Paper 1, Section A',qRef:'Q1—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'Edexcel Macbeth: provide 16–20 line extract; ask how Shakespeare presents character/theme in extract and whole play. AO1 AO2 AO3.'},
        {name:'Romeo and Juliet — extract + essay',paper:'Paper 1, Section A',qRef:'Q1—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'Edexcel Romeo and Juliet: extract + whole-play essay. AO1 AO2 AO3.'},
      ],
      '19th Century Prose': [
        {name:'A Christmas Carol — essay',paper:'Paper 1, Section B',qRef:'Q2—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'Edexcel A Christmas Carol: whole-novel essay (no extract) with context. AO1 AO2 AO3.'},
        {name:'Jekyll and Hyde — essay',paper:'Paper 1, Section B',qRef:'Q2—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'Edexcel Jekyll and Hyde: whole-novel essay with context. AO1 AO2 AO3.'},
      ],
      'Modern Text': [
        {name:'An Inspector Calls — essay',paper:'Paper 2, Section A',qRef:'Q1—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'Edexcel An Inspector Calls: whole-play essay with context. AO1 AO2 AO3.'},
        {name:'Lord of the Flies — essay',paper:'Paper 2, Section A',qRef:'Q1—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'Edexcel Lord of the Flies: whole-novel essay. AO1 AO2 AO3.'},
      ],
      Poetry: [
        {name:'Anthology poem analysis (20 marks)',paper:'Paper 2, Section B',qRef:'Q1—20 marks',marks:[20],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2'],key:'Edexcel Poetry anthology: provide a poem from the set anthology. Ask how poet presents a theme. AO1 AO2.'},
        {name:'Unseen poem (20 marks)',paper:'Paper 2, Section C',qRef:'Q3—20 marks',marks:[20],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2'],key:'Edexcel Unseen poem: provide a complete unseen poem (12–20 lines). AO1 AO2.'},
      ],
    },
  },
  OCR: {
    maths: {
      Number: [
        {name:'Fractions, decimals & percentages',paper:'Component 01/02/03',qRef:'F:Q3–8·H:Q2–7',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Non-calc & Calc',aos:['AO1','AO2'],key:'OCR GCSE Maths fractions decimals percentages — FDP conversion, percentage change, reverse percentages'},
        {name:'Ratio & proportion',paper:'Component 02/03',qRef:'F:Q10–15·H:Q8–13',marks:[3,4,5,6],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'OCR ratio proportion — dividing, unitary, direct/inverse proportion'},
        {name:'Indices & surds',paper:'Component 01',qRef:'H:Q5–11',marks:[2,3,4],tiers:['Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'OCR indices and surds — laws, fractional, negative; simplify and rationalise'},
        {name:'Standard form',paper:'Component 01',qRef:'F:Q12·H:Q5',marks:[2,3],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1'],key:'OCR standard form — converting, four operations'},
      ],
      Algebra: [
        {name:'Solving equations',paper:'Component 01/02',qRef:'F:Q7–12·H:Q5–10',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'OCR solving linear and simple quadratic equations'},
        {name:'Quadratic equations',paper:'Component 01/02',qRef:'H:Q12–18',marks:[3,4,5],tiers:['Higher'],calc:'Non-calc',aos:['AO1','AO2','AO3'],key:'OCR quadratic equations — factorising, formula, completing square'},
        {name:'Simultaneous equations',paper:'Component 02/03',qRef:'F:Q16–21·H:Q13–18',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2'],key:'OCR simultaneous equations; linear/quadratic for Higher'},
        {name:'Sequences & nth term',paper:'Component 01',qRef:'F:Q9–13·H:Q7–11',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Non-calc',aos:['AO1','AO2'],key:'OCR sequences — linear, quadratic and geometric nth term'},
      ],
      Geometry: [
        {name:"Pythagoras' theorem",paper:'Component 02/03',qRef:'F:Q14–19·H:Q9–15',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:"OCR Pythagoras — 2D and 3D"},
        {name:'Trigonometry',paper:'Component 02/03',qRef:'F:Q18–24·H:Q12–18',marks:[3,4,5,6],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'OCR trigonometry — SOHCAHTOA; sine rule, cosine rule (Higher)'},
        {name:'Circle theorems',paper:'Component 02',qRef:'H:Q16–22',marks:[3,4,5],tiers:['Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'OCR circle theorems — 8 theorems, application and proof'},
        {name:'Vectors',paper:'Component 01',qRef:'H:Q20–26',marks:[3,4,5],tiers:['Higher'],calc:'Non-calc',aos:['AO2','AO3'],key:'OCR vectors — arithmetic and geometric proof'},
      ],
      Statistics: [
        {name:'Averages & range',paper:'Component 02/03',qRef:'F:Q5–10·H:Q3–7',marks:[2,3,4],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2'],key:'OCR averages — mean, median, mode, range, estimated mean from grouped data'},
        {name:'Probability',paper:'Component 02/03',qRef:'F:Q12–18·H:Q8–14',marks:[3,4,5],tiers:['Foundation','Higher'],calc:'Calculator',aos:['AO1','AO2','AO3'],key:'OCR probability — experimental, theoretical, tree diagrams, Venn diagrams'},
        {name:'Cumulative frequency & box plots',paper:'Component 02/03',qRef:'H:Q14–20',marks:[4,5,6],tiers:['Higher'],calc:'Calculator',aos:['AO2','AO3'],key:'OCR cumulative frequency curves, box plots, IQR, comparing distributions'},
      ],
    },
    language: {
      Reading: [
        {name:'Comp 01 Q1 · Find & copy (5 marks)',paper:'Component 01',qRef:'Q1—5 marks',marks:[5],tiers:['F','H'],calc:'N/A',aos:['AO1'],key:'OCR English Language Component 01 Q1: find and copy words/phrases — AO1. Provide a 4–6 sentence fiction extract.'},
        {name:'Comp 01 Q2 · Language analysis (10 marks)',paper:'Component 01',qRef:'Q2—10 marks',marks:[10],tiers:['F','H'],calc:'N/A',aos:['AO2'],key:'OCR English Language Component 01 Q2: how is language used to create effect — AO2. Provide a 5–7 sentence extract.'},
        {name:'Comp 01 Q3 · Evaluate (15 marks)',paper:'Component 01',qRef:'Q3—15 marks',marks:[15],tiers:['F','H'],calc:'N/A',aos:['AO4'],key:'OCR English Language Component 01 Q3: evaluate a perspective — AO4. Provide extract and statement.'},
        {name:'Comp 02 Q1 · Synthesis (10 marks)',paper:'Component 02',qRef:'Q1—10 marks',marks:[10],tiers:['F','H'],calc:'N/A',aos:['AO1'],key:'OCR English Language Component 02 Q1: synthesise from two non-fiction texts — AO1. Provide two short extracts.'},
        {name:'Comp 02 Q2 · Language & viewpoint (10 marks)',paper:'Component 02',qRef:'Q2—10 marks',marks:[10],tiers:['F','H'],calc:'N/A',aos:['AO2','AO3'],key:'OCR English Language Component 02 Q2: how does writer use language to convey viewpoint — AO2 AO3. Provide non-fiction extract.'},
      ],
      Writing: [
        {name:'Imaginative writing (40 marks)',paper:'Component 01',qRef:'Section B—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO5','AO6'],key:'OCR Component 01 Section B: imaginative writing — narrative or description — AO5 AO6.'},
        {name:'Transactional writing (40 marks)',paper:'Component 02',qRef:'Section B—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO5','AO6'],key:'OCR Component 02 Section B: transactional writing — article, letter, speech, leaflet — AO5 AO6.'},
      ],
    },
    literature: {
      Shakespeare: [
        {name:'Macbeth — extract + essay',paper:'Component 01, Section A',qRef:'Q1—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'OCR Macbeth: provide 15–20 line extract; ask how Shakespeare presents character/theme in extract then whole play. AO1 AO2 AO3.'},
        {name:'Romeo and Juliet — extract + essay',paper:'Component 01, Section A',qRef:'Q1—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'OCR Romeo and Juliet: extract + whole-play essay. AO1 AO2 AO3.'},
      ],
      '19th Century Prose': [
        {name:'A Christmas Carol — extract + essay',paper:'Component 01, Section B',qRef:'Q2—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'OCR A Christmas Carol: prose extract then whole-novel essay including context. AO1 AO2 AO3.'},
        {name:'Jekyll and Hyde — extract + essay',paper:'Component 01, Section B',qRef:'Q2—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'OCR Jekyll and Hyde: extract + whole-novel essay. AO1 AO2 AO3.'},
      ],
      'Modern Text': [
        {name:'An Inspector Calls — essay',paper:'Component 02, Section A',qRef:'Q1—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'OCR An Inspector Calls: whole-play essay (no extract) with context. AO1 AO2 AO3.'},
        {name:'Lord of the Flies — essay',paper:'Component 02, Section A',qRef:'Q1—40 marks',marks:[40],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2','AO3'],key:'OCR Lord of the Flies: whole-novel essay. AO1 AO2 AO3.'},
      ],
      Poetry: [
        {name:'Anthology poem analysis (25 marks)',paper:'Component 02, Section B',qRef:'Q1—25 marks',marks:[25],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2'],key:'OCR Poetry anthology: provide a named poem. Ask how poet presents a theme. AO1 AO2.'},
        {name:'Unseen poem (25 marks)',paper:'Component 02, Section C',qRef:'Q2—25 marks',marks:[25],tiers:['F','H'],calc:'N/A',aos:['AO1','AO2'],key:'OCR Unseen poem: provide a complete unseen poem. AO1 AO2.'},
      ],
    },
  },
};
