-- GCSEPrep database schema
-- Copyright (c) 2026 Becky Hingston & Simon Rundell, Exeter College Faculty of ITDD
-- Creative Commons NC-BY-SA 4.0

CREATE DATABASE IF NOT EXISTS gcse_prep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gcse_prep;

-- ----------------------------------------------------------------
-- Leaderboard
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gcse_scores (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  player_id   VARCHAR(36)  NOT NULL,
  game        VARCHAR(50)  NOT NULL,
  score       INT          NOT NULL,
  game_type   VARCHAR(20)  NOT NULL,
  date_played DATE         NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_player (player_id),
  INDEX idx_game   (game_type)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Admin users
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Question bank (maps to AQA Nov 2024 Paper 1F slot structure)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_bank (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slot       VARCHAR(10)  NOT NULL,
  topic      VARCHAR(100) NOT NULL,
  question   TEXT         NOT NULL,
  answer     TEXT         NOT NULL,
  marks      TINYINT UNSIGNED NOT NULL DEFAULT 1,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slot  (slot),
  INDEX idx_topic (topic)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Vocabulary words (Word Scramble game)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS words (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  word       VARCHAR(100) NOT NULL,
  clue       TEXT         NOT NULL,
  subject    VARCHAR(50)  NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Video channels
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS video_channels (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject     VARCHAR(20)  NOT NULL COMMENT 'maths | english',
  name        VARCHAR(100) NOT NULL,
  emoji       VARCHAR(50),
  bg          VARCHAR(50),
  url         VARCHAR(500) NOT NULL,
  description TEXT,
  topics      JSON,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_subject (subject)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- AQA Nov 2024 Foundation Paper 1 blueprint
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blueprint (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  q_ref      VARCHAR(10)  NOT NULL,
  topic      VARCHAR(100) NOT NULL,
  style      TEXT         NOT NULL,
  marks      TINYINT UNSIGNED NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_q_ref (q_ref)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Exam board data (one row per board; JSON stores spec + subjects)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS boards (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  board_code VARCHAR(20)  NOT NULL UNIQUE,
  color      VARCHAR(40)  NOT NULL,
  data       JSON         NOT NULL COMMENT 'keys: spec, subjects',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- Global board configuration (subject_labels, ao_desc, topic_bank_map)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS board_config (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  config_key   VARCHAR(50) NOT NULL UNIQUE,
  config_value JSON        NOT NULL,
  updated_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ================================================================
-- Seed data
-- Default admin password: gc5ERe51oN!
-- ================================================================

INSERT INTO admin_users (email, password_hash) VALUES
('admin@yourdomain.ac.uk','$2b$12$a8QwC7gq4wdFkh7dxaI0h.Uatfi4Xx/RSxY2g53PjU.IiKrMxklie');

INSERT INTO blueprint (id,q_ref,topic,style,marks,sort_order) VALUES
(1,'Q1','powers and roots','three short parts: a square root value, a cube value, writing a number as a power of 10',3,10),
(2,'Q2','unit conversion','convert between imperial units using a given conversion fact (e.g. pounds to ounces)',2,20),
(3,'Q3','fractions','write an improper fraction as a mixed number, then add two simple fractions with the same denominator',2,30),
(4,'Q4','factors and multiples','list all factors of a number, then give a counter-example to disprove a claim about multiples',3,40),
(5,'Q5','FDP ordering','put a percentage, a decimal and a fraction in order of size',2,50),
(6,'Q6','money problem','two-step worded problem: total cost given, price of one item given, work out price of the other',4,60),
(7,'Q7','frequency tree','complete a frequency tree from worded information, then give a fraction in simplest form',6,70),
(8,'Q8','bar chart critique','spot three mistakes in a wrongly-drawn bar chart given a data table',3,80),
(9,'Q9','sample space & probability','complete a multiplication sample-space table, then find probability of a square number as a fraction',6,90),
(10,'Q10','simplifying algebra','collect like terms, then simplify a product of fraction coefficient terms',4,100),
(11,'Q11','percentage decrease','multipack costs 10% less than buying singles — multi-step money calculation',4,110),
(12,'Q12','ratio in n:1 form','write a ratio in the form n : 1',1,120),
(13,'Q13','reasoning about numbers','always/sometimes/never true statements about positive numbers x and y',2,130),
(14,'Q14','congruence & enlargement','draw a congruent shape, then enlarge by a fractional scale factor',3,140),
(15,'Q15','ratio sharing','share a total in a given ratio then find the difference between the shares',3,150),
(16,'Q16','accurate drawing','accurately draw a compound shape made from a semicircle and a square',2,160),
(17,'Q17','speed calculation','distance in miles over minutes — convert to miles per hour',3,170),
(18,'Q18','coordinate geometry','find a coordinate given equal line segments on a straight line',3,180),
(19,'Q19','decimals squared','work out the square of a decimal without a calculator',2,190),
(20,'Q20','function machines','complete three number machines to match given equations like y = 4x + 5',3,200),
(21,'Q21','averages reasoning','true/false/cannot tell: effect of adding 10 to every value on mode, median, range',3,210),
(22,'Q22','sequences','fill in a missing geometric progression term, then continue a Fibonacci-type sequence with negatives',3,220),
(23,'Q23','prisms','count faces of a prism, then find cross-section area from volume and length',3,230),
(24,'Q24','fraction subtraction','subtract fractions with different denominators including a mixed number',2,240),
(25,'Q25','exact trig values','recall the value of sin 90°',1,250),
(26,'Q26','circle areas with ratio','shaded area between two circles where radii are in a given ratio, answer in terms of π',4,260),
(27,'Q27','inverse proportion','workers and hours problem, then reasoning about mixed work rates',3,270);

INSERT INTO board_config (id,config_key,config_value) VALUES
(1,'subject_labels','{"maths":{"label":"Mathematics","color":"tag-maths"},"language":{"label":"English Language","color":"tag-lang"},"literature":{"label":"English Literature","color":"tag-lit"}}'),
(2,'ao_desc','{"AO1":"identify and interpret evidence","AO2":"analyse language, form and structure","AO3":"understand text and context","AO4":"evaluate critically","AO5":"communicate clearly (content)","AO6":"technical accuracy (SPaG)"}'),
(3,'topic_bank_map','{"Number":["powers and roots","unit conversion","fractions","factors and multiples","FDP ordering","fraction subtraction","ratio in n:1 form","ratio sharing","percentage decrease","money problem","decimals squared","speed","inverse proportion"],"Algebra":["simplifying algebra","function machines","sequences","number reasoning"],"Geometry":["congruence and enlargement","compound shapes","prisms","circle areas with ratio","exact trig values","coordinate geometry"],"Statistics":["sample space and probability","averages reasoning","bar chart critique","frequency tree"]}');

INSERT INTO boards (id,board_code,color,data) VALUES
(1,'AQA','#e63946','{"spec":{"maths":"AQA 8300","language":"AQA 8700","literature":"AQA 8702"},"subjects":{"maths":{"Number":[{"name":"Fractions, decimals & percentages","paper":"Paper 1/2/3","qRef":"F:Q3–8·H:Q2–6","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Non-calc & Calc","aos":["AO1","AO2"],"key":"AQA GCSE Maths fractions decimals percentages — FDP conversion, percentage change, reverse percentages"},{"name":"Ratio & proportion","paper":"Paper 2/3","qRef":"F:Q10–15·H:Q8–14","marks":[3,4,5,6],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"AQA ratio and proportion — sharing, best value, direct/inverse proportion"},{"name":"Indices & surds","paper":"Paper 1/2","qRef":"H:Q5–12","marks":[2,3,4],"tiers":["Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"AQA indices laws, negative/fractional; surds simplify and rationalise"},{"name":"Standard form","paper":"Paper 1","qRef":"F:Q14·H:Q7","marks":[2,3],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1"],"key":"AQA standard form converting and calculating"}],"Algebra":[{"name":"Solving linear equations","paper":"Paper 1/2","qRef":"F:Q8–12·H:Q5–10","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"AQA solving linear equations including unknowns on both sides"},{"name":"Quadratic equations","paper":"Paper 1/2","qRef":"H:Q14–20","marks":[3,4,5],"tiers":["Higher"],"calc":"Non-calc","aos":["AO1","AO2","AO3"],"key":"AQA quadratic equations — factorising, completing square, quadratic formula"},{"name":"Simultaneous equations","paper":"Paper 2/3","qRef":"F:Q18–22·H:Q15–20","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2"],"key":"AQA simultaneous linear equations; linear/quadratic for Higher"},{"name":"Sequences & nth term","paper":"Paper 1","qRef":"F:Q10–14·H:Q8–12","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"AQA sequences — arithmetic, geometric, linear and quadratic nth term"}],"Geometry":[{"name":"Pythagoras\' theorem","paper":"Paper 2/3","qRef":"F:Q15–20·H:Q10–16","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"AQA Pythagoras theorem — 2D and 3D problems"},{"name":"Trigonometry","paper":"Paper 2/3","qRef":"F:Q20–25·H:Q14–20","marks":[3,4,5,6],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"AQA trigonometry SOHCAHTOA; sine rule cosine rule for Higher"},{"name":"Circle theorems","paper":"Paper 2","qRef":"H:Q18–24","marks":[3,4,5],"tiers":["Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"AQA circle theorems — all 8 theorems, proof and application"},{"name":"Vectors","paper":"Paper 1","qRef":"H:Q22–28","marks":[3,4,5],"tiers":["Higher"],"calc":"Non-calc","aos":["AO2","AO3"],"key":"AQA vectors — addition, scalar multiples, vector proof"}],"Statistics":[{"name":"Mean, median, mode & range","paper":"Paper 2/3","qRef":"F:Q6–12·H:Q4–8","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2"],"key":"AQA averages from lists and frequency tables; estimated mean from grouped data"},{"name":"Probability","paper":"Paper 2/3","qRef":"F:Q14–20·H:Q10–16","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"AQA probability — single, combined, tree diagrams, Venn diagrams"},{"name":"Cumulative frequency & box plots","paper":"Paper 2/3","qRef":"H:Q16–22","marks":[4,5,6],"tiers":["Higher"],"calc":"Calculator","aos":["AO2","AO3"],"key":"AQA cumulative frequency curves, box plots, IQR, comparing distributions"}]},"language":{"Reading":[{"name":"Q1 · List / identify (4 marks)","paper":"Paper 1 or 2","qRef":"Q1—4 marks","marks":[4],"tiers":["F","H"],"calc":"N/A","aos":["AO1"],"key":"AQA English Language Paper 1 Q1: list four things from the source — AO1. Provide a 4–6 sentence fiction extract."},{"name":"Q2 · Language analysis (8 marks)","paper":"Paper 1","qRef":"Q2—8 marks","marks":[8],"tiers":["F","H"],"calc":"N/A","aos":["AO2"],"key":"AQA English Language Paper 1 Q2: how does the writer use language — AO2. Provide a 4–6 sentence extract."},{"name":"Q3 · Structure (8 marks)","paper":"Paper 1","qRef":"Q3—8 marks","marks":[8],"tiers":["F","H"],"calc":"N/A","aos":["AO2"],"key":"AQA English Language Paper 1 Q3: how does the writer structure the text — AO2. Provide a 5–7 sentence extract."},{"name":"Q4 · Evaluate (20 marks)","paper":"Paper 1","qRef":"Q4—20 marks","marks":[20],"tiers":["F","H"],"calc":"N/A","aos":["AO4"],"key":"AQA English Language Paper 1 Q4: critical evaluation — to what extent do you agree — AO4. Provide extract and a statement."},{"name":"P2 Q2 · Summarise (8 marks)","paper":"Paper 2","qRef":"Q2—8 marks","marks":[8],"tiers":["F","H"],"calc":"N/A","aos":["AO1"],"key":"AQA English Language Paper 2 Q2: summarise differences between two sources — AO1. Provide two short contrasting non-fiction extracts."},{"name":"P2 Q4 · Compare viewpoints (16 marks)","paper":"Paper 2","qRef":"Q4—16 marks","marks":[16],"tiers":["F","H"],"calc":"N/A","aos":["AO3"],"key":"AQA English Language Paper 2 Q4: compare writers perspectives — AO3. Provide two contrasting non-fiction extracts."}],"Writing":[{"name":"Descriptive / narrative writing (40 marks)","paper":"Paper 1","qRef":"Q5—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO5","AO6"],"key":"AQA Paper 1 Q5: descriptive or narrative writing — AO5 AO6. Give a specific prompt."},{"name":"Viewpoint writing (40 marks)","paper":"Paper 2","qRef":"Q5—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO5","AO6"],"key":"AQA Paper 2 Q5: writing to present a viewpoint — AO5 AO6. Give a real-world topic, audience and purpose."}]},"literature":{"Shakespeare":[{"name":"Macbeth — extract + essay","paper":"Paper 1, Section A","qRef":"Q1—34 marks","marks":[34],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"AQA Macbeth: provide a 14–18 line extract with stage directions; analyse extract then explore theme/character in whole play. AO1 AO2 AO3."},{"name":"Romeo and Juliet — extract + essay","paper":"Paper 1, Section A","qRef":"Q1—34 marks","marks":[34],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"AQA Romeo and Juliet: extract + whole-play essay. AO1 AO2 AO3."}],"19th Century Prose":[{"name":"A Christmas Carol — extract + essay","paper":"Paper 1, Section B","qRef":"Q2—34 marks","marks":[34],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"AQA A Christmas Carol: prose extract then whole-novel essay including Victorian context. AO1 AO2 AO3."},{"name":"Jekyll and Hyde — extract + essay","paper":"Paper 1, Section B","qRef":"Q2—34 marks","marks":[34],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"AQA Jekyll and Hyde: extract + whole-novel essay with context. AO1 AO2 AO3."}],"Modern Text":[{"name":"An Inspector Calls — essay","paper":"Paper 2, Section A","qRef":"Q1—34 marks","marks":[34],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"AQA An Inspector Calls: whole-play essay (no extract) with context. AO1 AO2 AO3."},{"name":"Lord of the Flies — essay","paper":"Paper 2, Section A","qRef":"Q1—34 marks","marks":[34],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"AQA Lord of the Flies: whole-novel essay with context. AO1 AO2 AO3."}],"Poetry":[{"name":"Power & Conflict — single poem","paper":"Paper 2, Section B","qRef":"Q1a—24 marks","marks":[24],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2"],"key":"AQA Power and Conflict anthology: provide a complete poem (e.g. Ozymandias, Remains, Kamikaze). Ask how poet presents a theme. AO1 AO2."},{"name":"Unseen poetry — single poem","paper":"Paper 2, Section C","qRef":"Q2—24 marks","marks":[24],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2"],"key":"AQA Unseen poetry: provide a complete unseen poem (12–20 lines). Ask how poet presents feelings. AO1 AO2."}]}}}'),
(2,'Edexcel','#0096c7','{"spec":{"maths":"Edexcel 1MA1","language":"Edexcel 1EN0","literature":"Edexcel 1ET0"},"subjects":{"maths":{"Number":[{"name":"Fractions, decimals & percentages","paper":"Paper 1/2/3","qRef":"F:Q3–8·H:Q2–7","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Non-calc & Calc","aos":["AO1","AO2"],"key":"Edexcel GCSE Maths fractions decimals percentages — conversions, percentage increase/decrease, reverse percentages"},{"name":"Ratio & proportion","paper":"Paper 2/3","qRef":"F:Q10–16·H:Q8–14","marks":[3,4,5,6],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"Edexcel ratio proportion — dividing in ratio, unitary, direct/inverse proportion graphs"},{"name":"Indices & surds","paper":"Paper 1","qRef":"H:Q5–12","marks":[2,3,4],"tiers":["Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"Edexcel indices laws, negative/fractional; surds — simplify, expand, rationalise"},{"name":"Standard form","paper":"Paper 1","qRef":"F:Q13·H:Q6","marks":[2,3],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1"],"key":"Edexcel standard form converting, four operations"}],"Algebra":[{"name":"Solving linear equations","paper":"Paper 1","qRef":"F:Q7–11·H:Q5–9","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"Edexcel linear equations including brackets, fractions, unknowns both sides"},{"name":"Quadratic equations","paper":"Paper 1","qRef":"H:Q13–20","marks":[3,4,5],"tiers":["Higher"],"calc":"Non-calc","aos":["AO1","AO2","AO3"],"key":"Edexcel quadratic equations — factorising, formula, completing square, quadratic inequalities"},{"name":"Simultaneous equations","paper":"Paper 2/3","qRef":"F:Q17–22·H:Q14–19","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2"],"key":"Edexcel simultaneous equations; linear/quadratic for Higher"},{"name":"Sequences & nth term","paper":"Paper 1","qRef":"F:Q9–13·H:Q7–11","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"Edexcel sequences — arithmetic, geometric, linear/quadratic nth term"}],"Geometry":[{"name":"Pythagoras\' theorem","paper":"Paper 2/3","qRef":"F:Q14–19·H:Q9–15","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"Edexcel Pythagoras 2D and 3D, exact values"},{"name":"Trigonometry","paper":"Paper 2/3","qRef":"F:Q19–24·H:Q13–19","marks":[3,4,5,6],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"Edexcel trigonometry SOHCAHTOA, exact values; sine rule, cosine rule, area formula for Higher"},{"name":"Circle theorems","paper":"Paper 2","qRef":"H:Q17–23","marks":[3,4,5],"tiers":["Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"Edexcel circle theorems — all theorems, multi-step proof and application"},{"name":"Vectors","paper":"Paper 1","qRef":"H:Q21–27","marks":[3,4,5],"tiers":["Higher"],"calc":"Non-calc","aos":["AO2","AO3"],"key":"Edexcel vectors — column vectors, magnitude, geometric proof"}],"Statistics":[{"name":"Averages & range","paper":"Paper 2/3","qRef":"F:Q5–11·H:Q4–8","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2"],"key":"Edexcel averages mean median mode range from lists and frequency tables; estimated mean from grouped data"},{"name":"Probability","paper":"Paper 2/3","qRef":"F:Q13–19·H:Q9–15","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"Edexcel probability — single, combined, tree diagrams, Venn diagrams, conditional probability"},{"name":"Cumulative frequency & box plots","paper":"Paper 2/3","qRef":"H:Q15–21","marks":[4,5,6],"tiers":["Higher"],"calc":"Calculator","aos":["AO2","AO3"],"key":"Edexcel cumulative frequency, box plots, IQR, comparing distributions"}]},"language":{"Reading":[{"name":"Q1 · Identify true statements (4 marks)","paper":"Paper 1","qRef":"Q1—4 marks","marks":[4],"tiers":["F","H"],"calc":"N/A","aos":["AO1"],"key":"Edexcel English Language Paper 1 Q1: identify four true statements — AO1. Provide a short fiction extract and 8 statements."},{"name":"Q2 · Language analysis (8 marks)","paper":"Paper 1","qRef":"Q2—8 marks","marks":[8],"tiers":["F","H"],"calc":"N/A","aos":["AO2"],"key":"Edexcel English Language Paper 1 Q2: analyse language choices — AO2. Provide a 4–6 sentence extract."},{"name":"Q4 · Evaluate (20 marks)","paper":"Paper 1","qRef":"Q4—20 marks","marks":[20],"tiers":["F","H"],"calc":"N/A","aos":["AO4"],"key":"Edexcel English Language Paper 1 Q4: evaluate a statement — AO4. Provide extract and statement."},{"name":"P2 Q1 · Compare & contrast (10 marks)","paper":"Paper 2","qRef":"Q1—10 marks","marks":[10],"tiers":["F","H"],"calc":"N/A","aos":["AO1"],"key":"Edexcel English Language Paper 2 Q1: compare information from two sources — AO1. Provide two contrasting extracts."},{"name":"P2 Q3 · Writer\'s methods (6 marks)","paper":"Paper 2","qRef":"Q3—6 marks","marks":[6],"tiers":["F","H"],"calc":"N/A","aos":["AO2"],"key":"Edexcel English Language Paper 2 Q3: analyse language to convey viewpoint — AO2. Provide a non-fiction extract."}],"Writing":[{"name":"Descriptive / narrative writing (40 marks)","paper":"Paper 1","qRef":"Section B—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO5","AO6"],"key":"Edexcel Paper 1 Section B: write a description or narrative — AO5 AO6."},{"name":"Transactional writing (40 marks)","paper":"Paper 2","qRef":"Section B—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO5","AO6"],"key":"Edexcel Paper 2 Section B: write to communicate a viewpoint — AO5 AO6."}]},"literature":{"Shakespeare":[{"name":"Macbeth — extract + essay","paper":"Paper 1, Section A","qRef":"Q1—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"Edexcel Macbeth: provide 16–20 line extract; ask how Shakespeare presents character/theme in extract and whole play. AO1 AO2 AO3."},{"name":"Romeo and Juliet — extract + essay","paper":"Paper 1, Section A","qRef":"Q1—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"Edexcel Romeo and Juliet: extract + whole-play essay. AO1 AO2 AO3."}],"19th Century Prose":[{"name":"A Christmas Carol — essay","paper":"Paper 1, Section B","qRef":"Q2—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"Edexcel A Christmas Carol: whole-novel essay (no extract) with context. AO1 AO2 AO3."},{"name":"Jekyll and Hyde — essay","paper":"Paper 1, Section B","qRef":"Q2—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"Edexcel Jekyll and Hyde: whole-novel essay with context. AO1 AO2 AO3."}],"Modern Text":[{"name":"An Inspector Calls — essay","paper":"Paper 2, Section A","qRef":"Q1—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"Edexcel An Inspector Calls: whole-play essay with context. AO1 AO2 AO3."},{"name":"Lord of the Flies — essay","paper":"Paper 2, Section A","qRef":"Q1—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"Edexcel Lord of the Flies: whole-novel essay. AO1 AO2 AO3."}],"Poetry":[{"name":"Anthology poem analysis (20 marks)","paper":"Paper 2, Section B","qRef":"Q1—20 marks","marks":[20],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2"],"key":"Edexcel Poetry anthology: provide a poem from the set anthology. Ask how poet presents a theme. AO1 AO2."},{"name":"Unseen poem (20 marks)","paper":"Paper 2, Section C","qRef":"Q3—20 marks","marks":[20],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2"],"key":"Edexcel Unseen poem: provide a complete unseen poem (12–20 lines). AO1 AO2."}]}}}'),
(3,'OCR','#7b2d8b','{"spec":{"maths":"OCR J560","language":"OCR J351","literature":"OCR J352"},"subjects":{"maths":{"Number":[{"name":"Fractions, decimals & percentages","paper":"Component 01/02/03","qRef":"F:Q3–8·H:Q2–7","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Non-calc & Calc","aos":["AO1","AO2"],"key":"OCR GCSE Maths fractions decimals percentages — FDP conversion, percentage change, reverse percentages"},{"name":"Ratio & proportion","paper":"Component 02/03","qRef":"F:Q10–15·H:Q8–13","marks":[3,4,5,6],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"OCR ratio proportion — dividing, unitary, direct/inverse proportion"},{"name":"Indices & surds","paper":"Component 01","qRef":"H:Q5–11","marks":[2,3,4],"tiers":["Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"OCR indices and surds — laws, fractional, negative; simplify and rationalise"},{"name":"Standard form","paper":"Component 01","qRef":"F:Q12·H:Q5","marks":[2,3],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1"],"key":"OCR standard form — converting, four operations"}],"Algebra":[{"name":"Solving equations","paper":"Component 01/02","qRef":"F:Q7–12·H:Q5–10","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"OCR solving linear and simple quadratic equations"},{"name":"Quadratic equations","paper":"Component 01/02","qRef":"H:Q12–18","marks":[3,4,5],"tiers":["Higher"],"calc":"Non-calc","aos":["AO1","AO2","AO3"],"key":"OCR quadratic equations — factorising, formula, completing square"},{"name":"Simultaneous equations","paper":"Component 02/03","qRef":"F:Q16–21·H:Q13–18","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2"],"key":"OCR simultaneous equations; linear/quadratic for Higher"},{"name":"Sequences & nth term","paper":"Component 01","qRef":"F:Q9–13·H:Q7–11","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Non-calc","aos":["AO1","AO2"],"key":"OCR sequences — linear, quadratic and geometric nth term"}],"Geometry":[{"name":"Pythagoras\' theorem","paper":"Component 02/03","qRef":"F:Q14–19·H:Q9–15","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"OCR Pythagoras — 2D and 3D"},{"name":"Trigonometry","paper":"Component 02/03","qRef":"F:Q18–24·H:Q12–18","marks":[3,4,5,6],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"OCR trigonometry — SOHCAHTOA; sine rule, cosine rule (Higher)"},{"name":"Circle theorems","paper":"Component 02","qRef":"H:Q16–22","marks":[3,4,5],"tiers":["Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"OCR circle theorems — 8 theorems, application and proof"},{"name":"Vectors","paper":"Component 01","qRef":"H:Q20–26","marks":[3,4,5],"tiers":["Higher"],"calc":"Non-calc","aos":["AO2","AO3"],"key":"OCR vectors — arithmetic and geometric proof"}],"Statistics":[{"name":"Averages & range","paper":"Component 02/03","qRef":"F:Q5–10·H:Q3–7","marks":[2,3,4],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2"],"key":"OCR averages — mean, median, mode, range, estimated mean from grouped data"},{"name":"Probability","paper":"Component 02/03","qRef":"F:Q12–18·H:Q8–14","marks":[3,4,5],"tiers":["Foundation","Higher"],"calc":"Calculator","aos":["AO1","AO2","AO3"],"key":"OCR probability — experimental, theoretical, tree diagrams, Venn diagrams"},{"name":"Cumulative frequency & box plots","paper":"Component 02/03","qRef":"H:Q14–20","marks":[4,5,6],"tiers":["Higher"],"calc":"Calculator","aos":["AO2","AO3"],"key":"OCR cumulative frequency curves, box plots, IQR, comparing distributions"}]},"language":{"Reading":[{"name":"Comp 01 Q1 · Find & copy (5 marks)","paper":"Component 01","qRef":"Q1—5 marks","marks":[5],"tiers":["F","H"],"calc":"N/A","aos":["AO1"],"key":"OCR English Language Component 01 Q1: find and copy words/phrases — AO1. Provide a 4–6 sentence fiction extract."},{"name":"Comp 01 Q2 · Language analysis (10 marks)","paper":"Component 01","qRef":"Q2—10 marks","marks":[10],"tiers":["F","H"],"calc":"N/A","aos":["AO2"],"key":"OCR English Language Component 01 Q2: how is language used to create effect — AO2. Provide a 5–7 sentence extract."},{"name":"Comp 01 Q3 · Evaluate (15 marks)","paper":"Component 01","qRef":"Q3—15 marks","marks":[15],"tiers":["F","H"],"calc":"N/A","aos":["AO4"],"key":"OCR English Language Component 01 Q3: evaluate a perspective — AO4. Provide extract and statement."},{"name":"Comp 02 Q1 · Synthesis (10 marks)","paper":"Component 02","qRef":"Q1—10 marks","marks":[10],"tiers":["F","H"],"calc":"N/A","aos":["AO1"],"key":"OCR English Language Component 02 Q1: synthesise from two non-fiction texts — AO1. Provide two short extracts."},{"name":"Comp 02 Q2 · Language & viewpoint (10 marks)","paper":"Component 02","qRef":"Q2—10 marks","marks":[10],"tiers":["F","H"],"calc":"N/A","aos":["AO2","AO3"],"key":"OCR English Language Component 02 Q2: how does writer use language to convey viewpoint — AO2 AO3. Provide non-fiction extract."}],"Writing":[{"name":"Imaginative writing (40 marks)","paper":"Component 01","qRef":"Section B—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO5","AO6"],"key":"OCR Component 01 Section B: imaginative writing — narrative or description — AO5 AO6."},{"name":"Transactional writing (40 marks)","paper":"Component 02","qRef":"Section B—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO5","AO6"],"key":"OCR Component 02 Section B: transactional writing — article, letter, speech, leaflet — AO5 AO6."}]},"literature":{"Shakespeare":[{"name":"Macbeth — extract + essay","paper":"Component 01, Section A","qRef":"Q1—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"OCR Macbeth: provide 15–20 line extract; ask how Shakespeare presents character/theme in extract then whole play. AO1 AO2 AO3."},{"name":"Romeo and Juliet — extract + essay","paper":"Component 01, Section A","qRef":"Q1—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"OCR Romeo and Juliet: extract + whole-play essay. AO1 AO2 AO3."}],"19th Century Prose":[{"name":"A Christmas Carol — extract + essay","paper":"Component 01, Section B","qRef":"Q2—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"OCR A Christmas Carol: prose extract then whole-novel essay including context. AO1 AO2 AO3."},{"name":"Jekyll and Hyde — extract + essay","paper":"Component 01, Section B","qRef":"Q2—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"OCR Jekyll and Hyde: extract + whole-novel essay. AO1 AO2 AO3."}],"Modern Text":[{"name":"An Inspector Calls — essay","paper":"Component 02, Section A","qRef":"Q1—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"OCR An Inspector Calls: whole-play essay (no extract) with context. AO1 AO2 AO3."},{"name":"Lord of the Flies — essay","paper":"Component 02, Section A","qRef":"Q1—40 marks","marks":[40],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2","AO3"],"key":"OCR Lord of the Flies: whole-novel essay. AO1 AO2 AO3."}],"Poetry":[{"name":"Anthology poem analysis (25 marks)","paper":"Component 02, Section B","qRef":"Q1—25 marks","marks":[25],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2"],"key":"OCR Poetry anthology: provide a named poem. Ask how poet presents a theme. AO1 AO2."},{"name":"Unseen poem (25 marks)","paper":"Component 02, Section C","qRef":"Q2—25 marks","marks":[25],"tiers":["F","H"],"calc":"N/A","aos":["AO1","AO2"],"key":"OCR Unseen poem: provide a complete unseen poem. AO1 AO2."}]}}}');

INSERT INTO question_bank (id,slot,topic,question,answer,marks,sort_order) VALUES
(1,'Q1','powers and roots','Write down the value of √64','8',1,10),
(2,'Q1','powers and roots','Work out the value of 2⁵','32',1,20),
(3,'Q1','powers and roots','Write 100 000 as a power of 10','10⁵',1,30),
(4,'Q1','powers and roots','Work out the value of 4³','64',1,40),
(5,'Q2','unit conversion','1 kilogram = 1000 grams. Work out the number of grams in 7 kilograms.','7000 grams',2,10),
(6,'Q2','unit conversion','1 gallon = 8 pints. Work out the number of pints in 5 gallons.','40 pints',2,20),
(7,'Q2','unit conversion','1 foot = 12 inches. Work out the number of inches in 6 feet.','72 inches',2,30),
(8,'Q2','unit conversion','1 litre = 1000 millilitres. Work out the number of millilitres in 4.5 litres.','4500 ml',2,40),
(9,'Q3','fractions','Write 7/4 as a mixed number.','1¾',1,10),
(10,'Q3','fractions','Work out 2/7 + 3/7','5/7',1,20),
(11,'Q3','fractions','Write 11/3 as a mixed number.','3⅔',1,30),
(12,'Q3','fractions','Work out 4/9 + 2/9','6/9 = 2/3',1,40),
(13,'Q4','factors and multiples','Write down all the factors of 18','1, 2, 3, 6, 9, 18',2,10),
(14,'Q4','factors and multiples','Toni says, "When two even numbers are added, the answer is always a multiple of 4." Give one example to show she is wrong.','e.g. 2 + 4 = 6, which is not a multiple of 4',1,20),
(15,'Q4','factors and multiples','Write down all the factors of 28','1, 2, 4, 7, 14, 28',2,30),
(16,'Q4','factors and multiples','Sam says, "All multiples of 3 are odd." Give one example to show he is wrong.','e.g. 6 is a multiple of 3 and is even',1,40),
(17,'Q5','FDP ordering','Put these values in order of size, starting with the smallest: 60%, 0.55, 2/3','0.55, 60%, 2/3',2,10),
(18,'Q5','FDP ordering','Put these values in order of size, starting with the smallest: 0.4, 45%, 1/3','1/3, 0.4, 45%',2,20),
(19,'Q5','FDP ordering','Put these values in order of size, starting with the smallest: 7/10, 0.65, 72%','0.65, 7/10, 72%',2,30),
(20,'Q5','FDP ordering','Put these values in order of size, starting with the smallest: 25%, 0.3, 1/5','1/5, 25%, 0.3',2,40),
(21,'Q6','money problem','Leah buys three mugs and two plates. The total cost is £21.40. Each mug costs £3.80. Work out the cost of each plate.','3 × £3.80 = £11.40; £21.40 − £11.40 = £10; £10 ÷ 2 = £5',4,10),
(22,'Q6','money problem','Omar buys two notebooks and four pens. The total cost is £9.60. Each notebook costs £2.40. Work out the cost of each pen.','2 × £2.40 = £4.80; £9.60 − £4.80 = £4.80; £4.80 ÷ 4 = £1.20',4,20),
(23,'Q6','money problem','Ava buys five apples and three oranges for £4.36. Each apple costs 50p. Work out the cost of each orange.','5 × 50p = £2.50; £4.36 − £2.50 = £1.86; £1.86 ÷ 3 = 62p',4,30),
(24,'Q6','money problem','A family buys two adult tickets and three child tickets for £33.50. Each adult ticket costs £8.50. Work out the cost of each child ticket.','2 × £8.50 = £17; £33.50 − £17 = £16.50; £16.50 ÷ 3 = £5.50',4,40),
(25,'Q7','frequency tree','150 people visit a cinema. 90 are adults, the rest are children. 60 adults watch the comedy. 85 people in total watch the comedy. How many children watch the comedy?','85 − 60 = 25 children',3,10),
(26,'Q7','frequency tree','200 students choose lunch. 120 choose hot food, the rest choose salad. 70 of the hot food students are in Year 11. 105 students in total are in Year 11. How many salad students are in Year 11?','105 − 70 = 35',3,20),
(27,'Q7','frequency tree','80 people take a driving test. 50 pass. Of those who pass, 30 passed first time. What fraction of the people who pass passed first time? Simplify your answer.','30/50 = 3/5',2,30),
(28,'Q7','frequency tree','In a survey of 60 children, 36 turn left in a maze. What fraction of the children turn left? Give your answer in its simplest form.','36/60 = 3/5',2,40),
(29,'Q8','bar chart critique','A bar chart has no title, bars of different widths, and a vertical axis that starts at 5 instead of 0. Write down three mistakes.','No title; unequal bar widths; axis not starting at 0',3,10),
(30,'Q8','bar chart critique','Give two reasons a pie chart might be misleading if drawn by hand without calculating angles.','Sector sizes will not match the data proportions; comparisons become inaccurate',2,20),
(31,'Q8','bar chart critique','A pictogram uses a symbol = 4 people but one row shows half a symbol. How many people does the half symbol represent?','2 people',1,30),
(32,'Q9','sample space and probability','A number is picked at random from {1, 3, 5}. Another is picked from {2, 3, 5, 7}. The numbers are multiplied. What is the probability the product is greater than 20? Give your answer as a fraction.','Products over 20: 5×5=25, 5×7=35, 3×7=21 → 3/12 = 1/4',3,10),
(33,'Q9','sample space and probability','Two fair coins are flipped. List all possible outcomes and write down the probability of getting two heads.','HH, HT, TH, TT → P(HH) = 1/4',2,20),
(34,'Q9','sample space and probability','A spinner has equal sections numbered 1–4. It is spun twice and the scores are added. What is the probability the total is 5?','4 ways out of 16 → 1/4',3,30),
(35,'Q9','sample space and probability','A number is picked from the first three odd numbers {1,3,5} and multiplied by a number from {2,3}. What is the probability the product is odd?','Odd only when both odd: 1×3, 3×3, 5×3 → 3/6 = 1/2',3,40),
(36,'Q10','simplifying algebra','Simplify fully: 9k + 3 − 4k + 8','5k + 11',2,10),
(37,'Q10','simplifying algebra','Simplify fully: ⅓ f × 9g','3fg',2,20),
(38,'Q10','simplifying algebra','Simplify fully: 7a + 2b − 3a + 5b','4a + 7b',2,30),
(39,'Q10','simplifying algebra','Simplify fully: ½ m × 8n','4mn',2,40),
(40,'Q11','percentage decrease','One ticket costs £8. A group pass for 5 people costs 20% less than 5 single tickets. Work out the cost of the group pass.','5 × £8 = £40; 20% of £40 = £8; £40 − £8 = £32',4,10),
(41,'Q11','percentage decrease','A single bag of sweets costs 65p. A multipack of 8 bags costs 10% less than 8 single bags. Work out the cost of the multipack.','8 × 65p = £5.20; 10% = 52p; £5.20 − 52p = £4.68',4,20),
(42,'Q11','percentage decrease','A magazine costs £3.50. An annual bundle of 12 issues costs 25% less than buying 12 single issues. Work out the bundle price.','12 × £3.50 = £42; 25% = £10.50; £42 − £10.50 = £31.50',4,30),
(43,'Q11','percentage decrease','A coffee costs £2.80. A loyalty card of 10 coffees costs 15% less than 10 singles. Work out the loyalty card price.','10 × £2.80 = £28; 15% = £4.20; £28 − £4.20 = £23.80',4,40),
(44,'Q12','ratio in n:1 form','Write the ratio 15 : 3 in the form n : 1','5 : 1',1,10),
(45,'Q12','ratio in n:1 form','Write the ratio 9 : 2 in the form n : 1','4.5 : 1',1,20),
(46,'Q12','ratio in n:1 form','Write the ratio 21 : 6 in the form n : 1','3.5 : 1',1,30),
(47,'Q12','ratio in n:1 form','Write the ratio 40 : 8 in the form n : 1','5 : 1',1,40),
(48,'Q13','number reasoning','x and y are two different positive numbers. Is "x × y is positive" always, sometimes or never true?','Always true',1,10),
(49,'Q13','number reasoning','x and y are two different positive numbers. Is "x − y is negative" always, sometimes or never true?','Sometimes true (only when x < y)',1,20),
(50,'Q13','number reasoning','x is a positive number. Is "x ÷ 2 is greater than x" always, sometimes or never true?','Never true',1,30),
(51,'Q14','congruence and enlargement','A shape is enlarged by scale factor ⅓. The original side was 12 cm. How long is the corresponding side of the image?','12 × ⅓ = 4 cm',2,10),
(52,'Q14','congruence and enlargement','Two shapes are congruent. Shape A has an angle of 35°. What is the corresponding angle in shape B?','35° (congruent shapes have equal angles)',1,20),
(53,'Q14','congruence and enlargement','A rectangle 6 cm by 9 cm is enlarged by scale factor ⅓. Write down the dimensions of the image.','2 cm by 3 cm',2,30),
(54,'Q15','ratio sharing','42 sweets are shared between Jo and Kit in the ratio 5 : 1. How many more sweets does Jo get than Kit?','42 ÷ 6 = 7; Jo 35, Kit 7; difference 28',3,10),
(55,'Q15','ratio sharing','63 books are either fiction or non-fiction in the ratio 8 : 1. How many more are fiction than non-fiction?','63 ÷ 9 = 7; fiction 56, non-fiction 7; difference 49',3,20),
(56,'Q15','ratio sharing','£45 is shared between Amy and Ben in the ratio 7 : 2. How much more does Amy get than Ben?','£45 ÷ 9 = £5; Amy £35, Ben £10; difference £25',3,30),
(57,'Q15','ratio sharing','56 marbles are shared in the ratio 6 : 1. Work out the difference between the two shares.','56 ÷ 7 = 8; shares 48 and 8; difference 40',3,40),
(58,'Q16','compound shapes','A shape is made from a square of side 8 cm with a semicircle on one side. What is the radius of the semicircle?','4 cm (half of 8 cm)',1,10),
(59,'Q16','compound shapes','A shape is made from a square of side 10 cm and a semicircle on one side. Work out the perimeter, in terms of π.','Three sides: 30 cm; semicircle arc: 5π; total 30 + 5π cm',3,20),
(60,'Q16','compound shapes','A rectangle 12 cm by 6 cm has a semicircle attached to a 6 cm side. What is the total area in terms of π?','72 + 4.5π cm²',3,30),
(61,'Q17','speed','A cyclist travels 6 miles in 20 minutes. Work out the average speed in miles per hour.','20 min × 3 = 1 hour, so 6 × 3 = 18 mph',3,10),
(62,'Q17','speed','A car travels 5 miles in 4 minutes. Work out the average speed in miles per hour.','60 ÷ 4 = 15; 5 × 15 = 75 mph',3,20),
(63,'Q17','speed','A runner covers 3 miles in 24 minutes. Work out the average speed in miles per hour.','60 ÷ 24 = 2.5; 3 × 2.5 = 7.5 mph',3,30),
(64,'Q17','speed','A train travels 30 miles in 15 minutes. Work out the average speed in miles per hour.','15 min × 4 = 1 hour; 30 × 4 = 120 mph',3,40),
(65,'Q18','coordinate geometry','P (0, 8) and Q (3, 6) are points on the straight line PQRS, with PQ = QR = RS. Work out the coordinates of S.','Each step: +3 in x, −2 in y. S = (9, 2)',3,10),
(66,'Q18','coordinate geometry','A (1, 2) and B (4, 8) are points with AB = BC on the straight line ABC. Work out the coordinates of C.','Step +3, +6 → C = (7, 14)',2,20),
(67,'Q18','coordinate geometry','M (2, 10) and N (6, 7) lie on line MNOP with MN = NO = OP. Find P.','Step +4, −3 → P = (14, 1)',3,30),
(68,'Q19','decimals squared','Work out the value of 2.5²','6.25',2,10),
(69,'Q19','decimals squared','Work out the value of 0.4²','0.16',2,20),
(70,'Q19','decimals squared','Work out the value of 1.2²','1.44',2,30),
(71,'Q19','decimals squared','Work out the value of 3.5²','12.25',2,40),
(72,'Q20','function machines','A number machine takes x, multiplies by 5, then adds 2. Write the output y in terms of x.','y = 5x + 2',1,10),
(73,'Q20','function machines','A number machine must output y = 2x − 14. The second step is ×2. What is the first step?','Subtract 7 (then ×2 gives 2x − 14)',1,20),
(74,'Q20','function machines','A machine multiplies x by 8 in step one. Step two makes the final output y = x. What is step two?','Divide by 8',1,30),
(75,'Q20','function machines','A machine adds 3 then multiplies by 4. Write y in terms of x.','y = 4(x + 3) = 4x + 12',1,40),
(76,'Q21','averages reasoning','Every number in a list is increased by 5. What happens to the median?','It increases by 5',1,10),
(77,'Q21','averages reasoning','Every number in a list is increased by 5. What happens to the range?','It stays the same',1,20),
(78,'Q21','averages reasoning','Every number in a list is doubled. What happens to the mean?','It is doubled',1,30),
(79,'Q22','sequences','Write the missing term in the geometric progression: 2, 6, 18, ___, 162','54',1,10),
(80,'Q22','sequences','A Fibonacci-type sequence begins 4, −7, … Each term is the sum of the previous two. Write the next two terms.','-3 and -10',2,20),
(81,'Q22','sequences','Write the missing term in the geometric progression: 3, 12, ___, 192','48',1,30),
(82,'Q22','sequences','A Fibonacci-type sequence begins 6, −10, … Write the next two terms.','-4 and -14',2,40),
(83,'Q23','prisms','How many faces does a pentagonal prism have?','7 (2 pentagons + 5 rectangles)',1,10),
(84,'Q23','prisms','A prism has volume 2400 cm³ and length 16 cm. Work out the area of its cross-section.','2400 ÷ 16 = 150 cm²',2,20),
(85,'Q23','prisms','How many edges does a triangular prism have?','9',1,30),
(86,'Q23','prisms','A prism has cross-section area 45 cm² and length 12 cm. Work out its volume.','45 × 12 = 540 cm³',2,40),
(87,'Q24','fraction subtraction','Work out 1⅖ − 7/10. Give your answer as a fraction.','7/5 − 7/10 = 14/10 − 7/10 = 7/10',2,10),
(88,'Q24','fraction subtraction','Work out 1⅓ − 5/6. Give your answer as a fraction.','4/3 − 5/6 = 8/6 − 5/6 = 3/6 = 1/2',2,20),
(89,'Q24','fraction subtraction','Work out 1¼ − 3/8. Give your answer as a fraction.','5/4 − 3/8 = 10/8 − 3/8 = 7/8',2,30),
(90,'Q24','fraction subtraction','Work out 2½ − 4/5. Give your answer as a fraction.','5/2 − 4/5 = 25/10 − 8/10 = 17/10 = 1 7/10',2,40),
(91,'Q25','exact trig values','Write down the value of cos 0°','1',1,10),
(92,'Q25','exact trig values','Write down the value of sin 30°','1/2',1,20),
(93,'Q25','exact trig values','Write down the value of tan 45°','1',1,30),
(94,'Q25','exact trig values','Write down the value of cos 90°','0',1,40),
(95,'Q26','circle areas with ratio','A large circle has radius 8 cm. The ratio of large radius : small radius is 4 : 1. Work out the shaded area between them, in terms of π.','Small r = 2; 64π − 4π = 60π cm²',4,10),
(96,'Q26','circle areas with ratio','A large circle has radius 10 cm. Large : small radius = 5 : 1. Work out the area between the circles in terms of π.','Small r = 2; 100π − 4π = 96π cm²',4,20),
(97,'Q26','circle areas with ratio','A large circle has radius 6 cm. Large : small radius = 3 : 1. Find the shaded area between the circles in terms of π.','Small r = 2; 36π − 4π = 32π cm²',4,30),
(98,'Q26','circle areas with ratio','A large circle has radius 9 cm. Large : small = 3 : 1. Find the area between the circles in terms of π.','Small r = 3; 81π − 9π = 72π cm²',4,40),
(99,'Q27','inverse proportion','8 people can complete a job in 6 hours, all working at the same rate. How long would 12 people take?','8 × 6 = 48 person-hours; 48 ÷ 12 = 4 hours',2,10),
(100,'Q27','inverse proportion','5 machines fill 5000 bottles in 4 hours. How long would 10 machines take to fill the same number?','2 hours (double the machines, half the time)',2,20),
(101,'Q27','inverse proportion','12 workers build a wall in 10 days. How long would 8 workers take, at the same rate?','12 × 10 = 120; 120 ÷ 8 = 15 days',2,30),
(102,'Q27','inverse proportion','6 painters take 9 hours to paint a hall. Some painters work faster than others. Can you say exactly how long 9 painters would take? Explain.','No — without equal rates you cannot say exactly',1,40);

INSERT INTO video_channels (id,subject,name,emoji,bg,url,description,topics,sort_order) VALUES
(1,'maths','Corbettmaths','📐','rgba(245,200,66,.12)','https://www.youtube.com/@corbettmaths','The legend of GCSE maths. Short, clear videos on every single topic, plus the famous "5-a-day" practice. Works for all boards.','["Fractions","Percentages","Ratio","Solving equations","Quadratics","Simultaneous equations","Pythagoras","Trigonometry","Circle theorems","Vectors","Probability","Histograms"]',10),
(2,'maths','Maths Genie','🧞','rgba(0,201,167,.12)','https://www.youtube.com/@MathsGenie','Grade-sorted revision videos with exam questions worked through step by step. Perfect for targeting your grade.','["Standard form","Indices","Surds","nth term","Inequalities","Sequences","Cumulative frequency","Box plots","Sine rule","Cosine rule"]',20),
(3,'maths','Cognito','🧠','rgba(167,139,250,.12)','https://www.youtube.com/@Cognitoedu','Beautifully animated explainer videos that make tricky concepts click. Great if you learn visually.','["Algebra basics","Expanding brackets","Factorising","Graphs","Area & perimeter","Volume","Transformations","Averages"]',30),
(4,'maths','Hannah Kettle Maths','🫖','rgba(255,107,107,.12)','https://www.youtube.com/@HannahKettleMaths','Head of Maths & GCSE examiner. Weekly free lessons, walkthroughs of past papers, and predicted papers — covers AQA and Edexcel, Foundation & Higher.','["Past paper walkthroughs","Predicted papers","Foundation revision","Higher revision","Exam technique"]',40),
(5,'maths','Primrose Kitten Academy','🐱','rgba(0,150,199,.12)','https://www.youtube.com/@PrimroseKittenScience','Whole-paper revision sessions led by experienced teachers — ideal for final revision in one sitting.','["Full paper revision","Maths in 2 hours","Last-minute revision","Exam skills"]',50),
(6,'english','Mr Bruff','✒️','rgba(0,201,167,.12)','https://www.youtube.com/@mrbruff','The most popular GCSE English teacher on YouTube — 750+ videos breaking down every question on Language and Literature papers into simple steps.','["Language Paper 1 Q2","Language Paper 1 Q4","Language Paper 2","Macbeth","Romeo and Juliet","A Christmas Carol","An Inspector Calls","Power & Conflict poetry","Unseen poetry","Creative writing"]',10),
(7,'english','Mr Salles Teaches English','🎩','rgba(245,200,66,.12)','https://www.youtube.com/@MrSallesTeachesEnglish','Deep-dive analysis and grade 9 exemplar answers. Quote collections and analysis for all the key set texts.','["Grade 9 answers","Macbeth quotes","An Inspector Calls","Lord of the Flies","Jekyll and Hyde","Essay structure","Top-band writing"]',20),
(8,'english','Stacey Reay','🌹','rgba(255,107,107,.12)','https://www.youtube.com/@staceyreay','Engaging, friendly English Literature revision — brilliant for poetry anthologies and character/theme breakdowns.','["Poetry anthology","Poem comparisons","Character analysis","Theme breakdowns","Context revision"]',30),
(9,'english','BBC Bitesize','📺','rgba(167,139,250,.12)','https://www.bbc.co.uk/bitesize/levels/z98jmp3','The official BBC revision hub — videos, notes and quizzes for every GCSE subject, organised by exam board.','["English Language","English Literature","Maths Foundation","Maths Higher","All exam boards"]',40);

INSERT INTO words (id,word,clue,subject,sort_order) VALUES
(1,'METAPHOR','A figure of speech that says one thing IS another','English',10),
(2,'SIMILE','A comparison using "like" or "as"','English',20),
(3,'SOLILOQUY','A speech where a character speaks thoughts aloud alone','Literature',30),
(4,'ALLITERATION','Repetition of the same consonant sound at the start of words','English',40),
(5,'PROTAGONIST','The main character in a story','English',50),
(6,'HYPOTHESIS','A proposed explanation to be tested','Maths',60),
(7,'QUADRATIC','A type of equation with a squared term','Maths',70),
(8,'FREQUENCY','How often something occurs','Maths',80),
(9,'PROBABILITY','The likelihood of an event occurring','Maths',90),
(10,'PERPENDICULAR','Meeting at a right angle','Maths',100),
(11,'AMBIGUITY','When something has more than one possible meaning','English',110),
(12,'JUXTAPOSITION','Placing two contrasting things side by side','English',120),
(13,'PATHETIC FALLACY','Using weather/nature to reflect emotion','English',130),
(14,'FORESHADOWING','Hints at what is to come later in the text','Literature',140),
(15,'CIRCUMFERENCE','The perimeter of a circle','Maths',150),
(16,'DENOMINATOR','The bottom number in a fraction','Maths',160),
(17,'ONOMATOPOEIA','A word that sounds like the thing it describes','English',170),
(18,'IAMBIC PENTAMETER','A poetic metre with 10 syllables per line','Literature',180);
