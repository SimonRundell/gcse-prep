/** @file questionBank.js — 102 original practice questions following the AQA Nov 2024 Paper 1F structure. */

export const QUESTION_BANK = [
  // Q1 style: powers & roots
  {slot:'Q1',topic:'powers and roots',    q:'Write down the value of √64',                    a:'8',    marks:1},
  {slot:'Q1',topic:'powers and roots',    q:'Work out the value of 2⁵',                       a:'32',   marks:1},
  {slot:'Q1',topic:'powers and roots',    q:'Write 100 000 as a power of 10',                 a:'10⁵',  marks:1},
  {slot:'Q1',topic:'powers and roots',    q:'Work out the value of 4³',                       a:'64',   marks:1},
  // Q2 style: unit conversion
  {slot:'Q2',topic:'unit conversion',     q:'1 kilogram = 1000 grams. Work out the number of grams in 7 kilograms.',    a:'7000 grams', marks:2},
  {slot:'Q2',topic:'unit conversion',     q:'1 gallon = 8 pints. Work out the number of pints in 5 gallons.',          a:'40 pints',   marks:2},
  {slot:'Q2',topic:'unit conversion',     q:'1 foot = 12 inches. Work out the number of inches in 6 feet.',            a:'72 inches',  marks:2},
  {slot:'Q2',topic:'unit conversion',     q:'1 litre = 1000 millilitres. Work out the number of millilitres in 4.5 litres.', a:'4500 ml', marks:2},
  // Q3 style: fractions basics
  {slot:'Q3',topic:'fractions',           q:'Write 7/4 as a mixed number.',                   a:'1¾',   marks:1},
  {slot:'Q3',topic:'fractions',           q:'Work out 2/7 + 3/7',                             a:'5/7',  marks:1},
  {slot:'Q3',topic:'fractions',           q:'Write 11/3 as a mixed number.',                  a:'3⅔',   marks:1},
  {slot:'Q3',topic:'fractions',           q:'Work out 4/9 + 2/9',                             a:'6/9 = 2/3', marks:1},
  // Q4 style: factors & counter-examples
  {slot:'Q4',topic:'factors and multiples', q:'Write down all the factors of 18',             a:'1, 2, 3, 6, 9, 18', marks:2},
  {slot:'Q4',topic:'factors and multiples', q:'Toni says, "When two even numbers are added, the answer is always a multiple of 4." Give one example to show she is wrong.', a:'e.g. 2 + 4 = 6, which is not a multiple of 4', marks:1},
  {slot:'Q4',topic:'factors and multiples', q:'Write down all the factors of 28',             a:'1, 2, 4, 7, 14, 28', marks:2},
  {slot:'Q4',topic:'factors and multiples', q:'Sam says, "All multiples of 3 are odd." Give one example to show he is wrong.', a:'e.g. 6 is a multiple of 3 and is even', marks:1},
  // Q5 style: FDP ordering
  {slot:'Q5',topic:'FDP ordering',        q:'Put these values in order of size, starting with the smallest: 60%, 0.55, 2/3',   a:'0.55, 60%, 2/3',  marks:2},
  {slot:'Q5',topic:'FDP ordering',        q:'Put these values in order of size, starting with the smallest: 0.4, 45%, 1/3',    a:'1/3, 0.4, 45%',   marks:2},
  {slot:'Q5',topic:'FDP ordering',        q:'Put these values in order of size, starting with the smallest: 7/10, 0.65, 72%',  a:'0.65, 7/10, 72%', marks:2},
  {slot:'Q5',topic:'FDP ordering',        q:'Put these values in order of size, starting with the smallest: 25%, 0.3, 1/5',    a:'1/5, 25%, 0.3',   marks:2},
  // Q6 style: money problems
  {slot:'Q6',topic:'money problem',       q:'Leah buys three mugs and two plates. The total cost is £21.40. Each mug costs £3.80. Work out the cost of each plate.', a:'3 × £3.80 = £11.40; £21.40 − £11.40 = £10; £10 ÷ 2 = £5', marks:4},
  {slot:'Q6',topic:'money problem',       q:'Omar buys two notebooks and four pens. The total cost is £9.60. Each notebook costs £2.40. Work out the cost of each pen.', a:'2 × £2.40 = £4.80; £9.60 − £4.80 = £4.80; £4.80 ÷ 4 = £1.20', marks:4},
  {slot:'Q6',topic:'money problem',       q:'Ava buys five apples and three oranges for £4.36. Each apple costs 50p. Work out the cost of each orange.', a:'5 × 50p = £2.50; £4.36 − £2.50 = £1.86; £1.86 ÷ 3 = 62p', marks:4},
  {slot:'Q6',topic:'money problem',       q:'A family buys two adult tickets and three child tickets for £33.50. Each adult ticket costs £8.50. Work out the cost of each child ticket.', a:'2 × £8.50 = £17; £33.50 − £17 = £16.50; £16.50 ÷ 3 = £5.50', marks:4},
  // Q7 style: frequency trees
  {slot:'Q7',topic:'frequency tree',      q:'150 people visit a cinema. 90 are adults, the rest are children. 60 adults watch the comedy. 85 people in total watch the comedy. How many children watch the comedy?', a:'85 − 60 = 25 children', marks:3},
  {slot:'Q7',topic:'frequency tree',      q:'200 students choose lunch. 120 choose hot food, the rest choose salad. 70 of the hot food students are in Year 11. 105 students in total are in Year 11. How many salad students are in Year 11?', a:'105 − 70 = 35', marks:3},
  {slot:'Q7',topic:'frequency tree',      q:'80 people take a driving test. 50 pass. Of those who pass, 30 passed first time. What fraction of the people who pass passed first time? Simplify your answer.', a:'30/50 = 3/5', marks:2},
  {slot:'Q7',topic:'frequency tree',      q:'In a survey of 60 children, 36 turn left in a maze. What fraction of the children turn left? Give your answer in its simplest form.', a:'36/60 = 3/5', marks:2},
  // Q8 style: chart critique
  {slot:'Q8',topic:'bar chart critique',  q:"A bar chart has no title, bars of different widths, and a vertical axis that starts at 5 instead of 0. Write down three mistakes.", a:'No title; unequal bar widths; axis not starting at 0', marks:3},
  {slot:'Q8',topic:'bar chart critique',  q:'Give two reasons a pie chart might be misleading if drawn by hand without calculating angles.', a:"Sector sizes won't match the data proportions; comparisons become inaccurate", marks:2},
  {slot:'Q8',topic:'bar chart critique',  q:'A pictogram uses a symbol = 4 people but one row shows half a symbol. How many people does the half symbol represent?', a:'2 people', marks:1},
  // Q9 style: sample space & probability
  {slot:'Q9',topic:'sample space and probability', q:'A number is picked at random from {1, 3, 5}. Another is picked from {2, 3, 5, 7}. The numbers are multiplied. What is the probability the product is greater than 20? Give your answer as a fraction.', a:'Products over 20: 5×5=25, 5×7=35, 3×7=21 → 3/12 = 1/4', marks:3},
  {slot:'Q9',topic:'sample space and probability', q:'Two fair coins are flipped. List all possible outcomes and write down the probability of getting two heads.', a:'HH, HT, TH, TT → P(HH) = 1/4', marks:2},
  {slot:'Q9',topic:'sample space and probability', q:'A spinner has equal sections numbered 1–4. It is spun twice and the scores are added. What is the probability the total is 5?', a:'4 ways out of 16 → 1/4', marks:3},
  {slot:'Q9',topic:'sample space and probability', q:'A number is picked from the first three odd numbers {1,3,5} and multiplied by a number from {2,3}. What is the probability the product is odd?', a:'Odd only when both odd: 1×3, 3×3, 5×3 → 3/6 = 1/2', marks:3},
  // Q10 style: simplifying algebra
  {slot:'Q10',topic:'simplifying algebra', q:'Simplify fully: 9k + 3 − 4k + 8',              a:'5k + 11', marks:2},
  {slot:'Q10',topic:'simplifying algebra', q:'Simplify fully: ⅓ f × 9g',                     a:'3fg',     marks:2},
  {slot:'Q10',topic:'simplifying algebra', q:'Simplify fully: 7a + 2b − 3a + 5b',            a:'4a + 7b', marks:2},
  {slot:'Q10',topic:'simplifying algebra', q:'Simplify fully: ½ m × 8n',                     a:'4mn',     marks:2},
  // Q11 style: percentage decrease shopping
  {slot:'Q11',topic:'percentage decrease', q:'One ticket costs £8. A group pass for 5 people costs 20% less than 5 single tickets. Work out the cost of the group pass.', a:'5 × £8 = £40; 20% of £40 = £8; £40 − £8 = £32', marks:4},
  {slot:'Q11',topic:'percentage decrease', q:'A single bag of sweets costs 65p. A multipack of 8 bags costs 10% less than 8 single bags. Work out the cost of the multipack.', a:'8 × 65p = £5.20; 10% = 52p; £5.20 − 52p = £4.68', marks:4},
  {slot:'Q11',topic:'percentage decrease', q:'A magazine costs £3.50. An annual bundle of 12 issues costs 25% less than buying 12 single issues. Work out the bundle price.', a:'12 × £3.50 = £42; 25% = £10.50; £42 − £10.50 = £31.50', marks:4},
  {slot:'Q11',topic:'percentage decrease', q:'A coffee costs £2.80. A loyalty card of 10 coffees costs 15% less than 10 singles. Work out the loyalty card price.', a:'10 × £2.80 = £28; 15% = £4.20; £28 − £4.20 = £23.80', marks:4},
  // Q12 style: ratio n:1
  {slot:'Q12',topic:'ratio in n:1 form',  q:'Write the ratio 15 : 3 in the form n : 1',      a:'5 : 1',   marks:1},
  {slot:'Q12',topic:'ratio in n:1 form',  q:'Write the ratio 9 : 2 in the form n : 1',       a:'4.5 : 1', marks:1},
  {slot:'Q12',topic:'ratio in n:1 form',  q:'Write the ratio 21 : 6 in the form n : 1',      a:'3.5 : 1', marks:1},
  {slot:'Q12',topic:'ratio in n:1 form',  q:'Write the ratio 40 : 8 in the form n : 1',      a:'5 : 1',   marks:1},
  // Q13 style: always/sometimes/never
  {slot:'Q13',topic:'number reasoning',   q:'x and y are two different positive numbers. Is "x × y is positive" always, sometimes or never true?', a:'Always true', marks:1},
  {slot:'Q13',topic:'number reasoning',   q:'x and y are two different positive numbers. Is "x − y is negative" always, sometimes or never true?', a:'Sometimes true (only when x < y)', marks:1},
  {slot:'Q13',topic:'number reasoning',   q:'x is a positive number. Is "x ÷ 2 is greater than x" always, sometimes or never true?', a:'Never true', marks:1},
  // Q14 style: congruence & enlargement
  {slot:'Q14',topic:'congruence and enlargement', q:'A shape is enlarged by scale factor ⅓. The original side was 12 cm. How long is the corresponding side of the image?', a:'12 × ⅓ = 4 cm', marks:2},
  {slot:'Q14',topic:'congruence and enlargement', q:'Two shapes are congruent. Shape A has an angle of 35°. What is the corresponding angle in shape B?', a:'35° (congruent shapes have equal angles)', marks:1},
  {slot:'Q14',topic:'congruence and enlargement', q:'A rectangle 6 cm by 9 cm is enlarged by scale factor ⅓. Write down the dimensions of the image.', a:'2 cm by 3 cm', marks:2},
  // Q15 style: ratio sharing difference
  {slot:'Q15',topic:'ratio sharing',      q:'42 sweets are shared between Jo and Kit in the ratio 5 : 1. How many more sweets does Jo get than Kit?', a:'42 ÷ 6 = 7; Jo 35, Kit 7; difference 28', marks:3},
  {slot:'Q15',topic:'ratio sharing',      q:'63 books are either fiction or non-fiction in the ratio 8 : 1. How many more are fiction than non-fiction?', a:'63 ÷ 9 = 7; fiction 56, non-fiction 7; difference 49', marks:3},
  {slot:'Q15',topic:'ratio sharing',      q:'£45 is shared between Amy and Ben in the ratio 7 : 2. How much more does Amy get than Ben?', a:'£45 ÷ 9 = £5; Amy £35, Ben £10; difference £25', marks:3},
  {slot:'Q15',topic:'ratio sharing',      q:'56 marbles are shared in the ratio 6 : 1. Work out the difference between the two shares.', a:'56 ÷ 7 = 8; shares 48 and 8; difference 40', marks:3},
  // Q16 style: compound shapes
  {slot:'Q16',topic:'compound shapes',    q:'A shape is made from a square of side 8 cm with a semicircle on one side. What is the radius of the semicircle?', a:'4 cm (half of 8 cm)', marks:1},
  {slot:'Q16',topic:'compound shapes',    q:'A shape is made from a square of side 10 cm and a semicircle on one side. Work out the perimeter, in terms of π.', a:'Three sides: 30 cm; semicircle arc: 5π; total 30 + 5π cm', marks:3},
  {slot:'Q16',topic:'compound shapes',    q:'A rectangle 12 cm by 6 cm has a semicircle attached to a 6 cm side. What is the total area in terms of π?', a:'72 + 4.5π cm²', marks:3},
  // Q17 style: speed
  {slot:'Q17',topic:'speed',              q:'A cyclist travels 6 miles in 20 minutes. Work out the average speed in miles per hour.', a:'20 min × 3 = 1 hour, so 6 × 3 = 18 mph', marks:3},
  {slot:'Q17',topic:'speed',              q:'A car travels 5 miles in 4 minutes. Work out the average speed in miles per hour.', a:'60 ÷ 4 = 15; 5 × 15 = 75 mph', marks:3},
  {slot:'Q17',topic:'speed',              q:'A runner covers 3 miles in 24 minutes. Work out the average speed in miles per hour.', a:'60 ÷ 24 = 2.5; 3 × 2.5 = 7.5 mph', marks:3},
  {slot:'Q17',topic:'speed',              q:'A train travels 30 miles in 15 minutes. Work out the average speed in miles per hour.', a:'15 min × 4 = 1 hour; 30 × 4 = 120 mph', marks:3},
  // Q18 style: coordinates on a line
  {slot:'Q18',topic:'coordinate geometry', q:'P (0, 8) and Q (3, 6) are points on the straight line PQRS, with PQ = QR = RS. Work out the coordinates of S.', a:'Each step: +3 in x, −2 in y. S = (9, 2)', marks:3},
  {slot:'Q18',topic:'coordinate geometry', q:'A (1, 2) and B (4, 8) are points with AB = BC on the straight line ABC. Work out the coordinates of C.', a:'Step +3, +6 → C = (7, 14)', marks:2},
  {slot:'Q18',topic:'coordinate geometry', q:'M (2, 10) and N (6, 7) lie on line MNOP with MN = NO = OP. Find P.', a:'Step +4, −3 → P = (14, 1)', marks:3},
  // Q19 style: decimal squares
  {slot:'Q19',topic:'decimals squared',   q:'Work out the value of 2.5²',                     a:'6.25',  marks:2},
  {slot:'Q19',topic:'decimals squared',   q:'Work out the value of 0.4²',                     a:'0.16',  marks:2},
  {slot:'Q19',topic:'decimals squared',   q:'Work out the value of 1.2²',                     a:'1.44',  marks:2},
  {slot:'Q19',topic:'decimals squared',   q:'Work out the value of 3.5²',                     a:'12.25', marks:2},
  // Q20 style: function machines
  {slot:'Q20',topic:'function machines',  q:'A number machine takes x, multiplies by 5, then adds 2. Write the output y in terms of x.',  a:'y = 5x + 2', marks:1},
  {slot:'Q20',topic:'function machines',  q:'A number machine must output y = 2x − 14. The second step is ×2. What is the first step?', a:'Subtract 7 (then ×2 gives 2x − 14)', marks:1},
  {slot:'Q20',topic:'function machines',  q:'A machine multiplies x by 8 in step one. Step two makes the final output y = x. What is step two?', a:'Divide by 8', marks:1},
  {slot:'Q20',topic:'function machines',  q:'A machine adds 3 then multiplies by 4. Write y in terms of x.', a:'y = 4(x + 3) = 4x + 12', marks:1},
  // Q21 style: averages reasoning
  {slot:'Q21',topic:'averages reasoning', q:'Every number in a list is increased by 5. What happens to the median?', a:'It increases by 5',  marks:1},
  {slot:'Q21',topic:'averages reasoning', q:'Every number in a list is increased by 5. What happens to the range?',  a:'It stays the same', marks:1},
  {slot:'Q21',topic:'averages reasoning', q:'Every number in a list is doubled. What happens to the mean?',          a:'It is doubled',     marks:1},
  // Q22 style: sequences
  {slot:'Q22',topic:'sequences',          q:'Write the missing term in the geometric progression: 2, 6, 18, ___, 162', a:'54',    marks:1},
  {slot:'Q22',topic:'sequences',          q:'A Fibonacci-type sequence begins 4, −7, … Each term is the sum of the previous two. Write the next two terms.', a:'−3 and −10', marks:2},
  {slot:'Q22',topic:'sequences',          q:'Write the missing term in the geometric progression: 3, 12, ___, 192',    a:'48',    marks:1},
  {slot:'Q22',topic:'sequences',          q:'A Fibonacci-type sequence begins 6, −10, … Write the next two terms.',    a:'−4 and −14', marks:2},
  // Q23 style: prisms
  {slot:'Q23',topic:'prisms',             q:'How many faces does a pentagonal prism have?',                            a:'7 (2 pentagons + 5 rectangles)', marks:1},
  {slot:'Q23',topic:'prisms',             q:'A prism has volume 2400 cm³ and length 16 cm. Work out the area of its cross-section.', a:'2400 ÷ 16 = 150 cm²', marks:2},
  {slot:'Q23',topic:'prisms',             q:'How many edges does a triangular prism have?',                            a:'9', marks:1},
  {slot:'Q23',topic:'prisms',             q:'A prism has cross-section area 45 cm² and length 12 cm. Work out its volume.', a:'45 × 12 = 540 cm³', marks:2},
  // Q24 style: fraction subtraction
  {slot:'Q24',topic:'fraction subtraction', q:'Work out 1⅖ − 7/10. Give your answer as a fraction.',   a:'7/5 − 7/10 = 14/10 − 7/10 = 7/10', marks:2},
  {slot:'Q24',topic:'fraction subtraction', q:'Work out 1⅓ − 5/6. Give your answer as a fraction.',    a:'4/3 − 5/6 = 8/6 − 5/6 = 3/6 = 1/2', marks:2},
  {slot:'Q24',topic:'fraction subtraction', q:'Work out 1¼ − 3/8. Give your answer as a fraction.',    a:'5/4 − 3/8 = 10/8 − 3/8 = 7/8', marks:2},
  {slot:'Q24',topic:'fraction subtraction', q:'Work out 2½ − 4/5. Give your answer as a fraction.',    a:'5/2 − 4/5 = 25/10 − 8/10 = 17/10 = 1 7/10', marks:2},
  // Q25 style: exact trig values
  {slot:'Q25',topic:'exact trig values',  q:'Write down the value of cos 0°',                          a:'1',   marks:1},
  {slot:'Q25',topic:'exact trig values',  q:'Write down the value of sin 30°',                         a:'1/2', marks:1},
  {slot:'Q25',topic:'exact trig values',  q:'Write down the value of tan 45°',                         a:'1',   marks:1},
  {slot:'Q25',topic:'exact trig values',  q:'Write down the value of cos 90°',                         a:'0',   marks:1},
  // Q26 style: circle areas with ratio
  {slot:'Q26',topic:'circle areas with ratio', q:'A large circle has radius 8 cm. The ratio of large radius : small radius is 4 : 1. Work out the shaded area between them, in terms of π.', a:'Small r = 2; 64π − 4π = 60π cm²', marks:4},
  {slot:'Q26',topic:'circle areas with ratio', q:'A large circle has radius 10 cm. Large : small radius = 5 : 1. Work out the area between the circles in terms of π.', a:'Small r = 2; 100π − 4π = 96π cm²', marks:4},
  {slot:'Q26',topic:'circle areas with ratio', q:'A large circle has radius 6 cm. Large : small radius = 3 : 1. Find the shaded area between the circles in terms of π.', a:'Small r = 2; 36π − 4π = 32π cm²', marks:4},
  {slot:'Q26',topic:'circle areas with ratio', q:'A large circle has radius 9 cm. Large : small = 3 : 1. Find the area between the circles in terms of π.', a:'Small r = 3; 81π − 9π = 72π cm²', marks:4},
  // Q27 style: inverse proportion
  {slot:'Q27',topic:'inverse proportion', q:'8 people can complete a job in 6 hours, all working at the same rate. How long would 12 people take?', a:'8 × 6 = 48 person-hours; 48 ÷ 12 = 4 hours', marks:2},
  {slot:'Q27',topic:'inverse proportion', q:'5 machines fill 5000 bottles in 4 hours. How long would 10 machines take to fill the same number?', a:'2 hours (double the machines, half the time)', marks:2},
  {slot:'Q27',topic:'inverse proportion', q:'12 workers build a wall in 10 days. How long would 8 workers take, at the same rate?', a:'12 × 10 = 120; 120 ÷ 8 = 15 days', marks:2},
  {slot:'Q27',topic:'inverse proportion', q:'6 painters take 9 hours to paint a hall. Some painters work faster than others. Can you say exactly how long 9 painters would take? Explain.', a:'No — without equal rates you cannot say exactly', marks:1},
];
