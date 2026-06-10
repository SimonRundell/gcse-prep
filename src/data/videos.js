/** @file videos.js — Curated YouTube channel data for the Video Lessons screen. */

export const VIDEO_CHANNELS = {
  maths: [
    {
      name: 'Corbettmaths', emoji: '📐', bg: 'rgba(245,200,66,.12)',
      url: 'https://www.youtube.com/@corbettmaths',
      desc: 'The legend of GCSE maths. Short, clear videos on every single topic, plus the famous "5-a-day" practice. Works for all boards.',
      topics: ['Fractions','Percentages','Ratio','Solving equations','Quadratics','Simultaneous equations','Pythagoras','Trigonometry','Circle theorems','Vectors','Probability','Histograms'],
    },
    {
      name: 'Maths Genie', emoji: '🧞', bg: 'rgba(0,201,167,.12)',
      url: 'https://www.youtube.com/@MathsGenie',
      desc: 'Grade-sorted revision videos with exam questions worked through step by step. Perfect for targeting your grade.',
      topics: ['Standard form','Indices','Surds','nth term','Inequalities','Sequences','Cumulative frequency','Box plots','Sine rule','Cosine rule'],
    },
    {
      name: 'Cognito', emoji: '🧠', bg: 'rgba(167,139,250,.12)',
      url: 'https://www.youtube.com/@Cognitoedu',
      desc: 'Beautifully animated explainer videos that make tricky concepts click. Great if you learn visually.',
      topics: ['Algebra basics','Expanding brackets','Factorising','Graphs','Area & perimeter','Volume','Transformations','Averages'],
    },
    {
      name: 'Hannah Kettle Maths', emoji: '🫖', bg: 'rgba(255,107,107,.12)',
      url: 'https://www.youtube.com/@HannahKettleMaths',
      desc: 'Head of Maths & GCSE examiner. Weekly free lessons, walkthroughs of past papers, and predicted papers — covers AQA and Edexcel, Foundation & Higher.',
      topics: ['Past paper walkthroughs','Predicted papers','Foundation revision','Higher revision','Exam technique'],
    },
    {
      name: 'Primrose Kitten Academy', emoji: '🐱', bg: 'rgba(0,150,199,.12)',
      url: 'https://www.youtube.com/@PrimroseKittenScience',
      desc: 'Whole-paper revision sessions led by experienced teachers — ideal for final revision in one sitting.',
      topics: ['Full paper revision','Maths in 2 hours','Last-minute revision','Exam skills'],
    },
  ],
  english: [
    {
      name: 'Mr Bruff', emoji: '✒️', bg: 'rgba(0,201,167,.12)',
      url: 'https://www.youtube.com/@mrbruff',
      desc: 'The most popular GCSE English teacher on YouTube — 750+ videos breaking down every question on Language and Literature papers into simple steps.',
      topics: ['Language Paper 1 Q2','Language Paper 1 Q4','Language Paper 2','Macbeth','Romeo and Juliet','A Christmas Carol','An Inspector Calls','Power & Conflict poetry','Unseen poetry','Creative writing'],
    },
    {
      name: 'Mr Salles Teaches English', emoji: '🎩', bg: 'rgba(245,200,66,.12)',
      url: 'https://www.youtube.com/@MrSallesTeachesEnglish',
      desc: 'Deep-dive analysis and grade 9 exemplar answers. Quote collections and analysis for all the key set texts.',
      topics: ['Grade 9 answers','Macbeth quotes','An Inspector Calls','Lord of the Flies','Jekyll and Hyde','Essay structure','Top-band writing'],
    },
    {
      name: 'Stacey Reay', emoji: '🌹', bg: 'rgba(255,107,107,.12)',
      url: 'https://www.youtube.com/@staceyreay',
      desc: 'Engaging, friendly English Literature revision — brilliant for poetry anthologies and character/theme breakdowns.',
      topics: ['Poetry anthology','Poem comparisons','Character analysis','Theme breakdowns','Context revision'],
    },
    {
      name: 'BBC Bitesize', emoji: '📺', bg: 'rgba(167,139,250,.12)',
      url: 'https://www.bbc.co.uk/bitesize/levels/z98jmp3',
      desc: 'The official BBC revision hub — videos, notes and quizzes for every GCSE subject, organised by exam board.',
      topics: ['English Language','English Literature','Maths Foundation','Maths Higher','All exam boards'],
    },
  ],
};
