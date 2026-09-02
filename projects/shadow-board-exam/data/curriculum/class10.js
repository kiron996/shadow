import { NCERT_SOURCES, category, chapter, subject, withMetadata } from './schema.js';

export default withMetadata(10, { ...NCERT_SOURCES.class10Science, mathematics: NCERT_SOURCES.class10Math }, [
  subject('science', 'Science', [
    category('physics-related', 'Physics-related Science', [
      chapter('light', 'Light — Reflection and Refraction', ['Reflection by spherical mirrors', 'Refraction', 'Lenses', 'Lens formula', 'Magnification']),
      chapter('human-eye', 'The Human Eye and the Colourful World', ['Human eye', 'Defects of vision', 'Dispersion', 'Atmospheric refraction']),
      chapter('electricity', 'Electricity', ['Current and potential difference', 'Ohm’s law', 'Resistance', 'Electric power', 'Heating effect']),
      chapter('magnetism', 'Magnetic Effects of Electric Current', ['Magnetic field', 'Electromagnetic induction', 'Electric motor', 'Generator']),
      chapter('energy', 'Sources of Energy', ['Conventional sources', 'Renewable sources', 'Environmental consequences'])
    ]),
    category('chemistry-related', 'Chemistry-related Science', [
      chapter('reactions', 'Chemical Reactions and Equations', ['Chemical equations', 'Balancing equations', 'Types of reactions', 'Oxidation and reduction']),
      chapter('acids-bases-salts', 'Acids, Bases and Salts', ['Indicators', 'pH scale', 'Neutralisation', 'Common salts']),
      chapter('metals-nonmetals', 'Metals and Non-metals', ['Physical properties', 'Chemical properties', 'Reactivity series', 'Corrosion']),
      chapter('carbon', 'Carbon and its Compounds', ['Covalent bonding', 'Homologous series', 'Functional groups', 'Soaps and detergents']),
      chapter('periodic', 'Periodic Classification of Elements', ['Dobereiner and Newlands', 'Modern periodic table', 'Periodic trends'])
    ]),
    category('biology-related', 'Biology-related Science', [
      chapter('life-processes', 'Life Processes', ['Nutrition', 'Respiration', 'Transportation', 'Excretion']),
      chapter('control-coordination', 'Control and Coordination', ['Nervous system', 'Reflex action', 'Hormones', 'Plant movements']),
      chapter('reproduction', 'How do Organisms Reproduce?', ['Asexual reproduction', 'Sexual reproduction', 'Reproductive health']),
      chapter('heredity', 'Heredity and Evolution', ['Heredity', 'Mendel’s experiments', 'Evolution', 'Speciation']),
      chapter('environment', 'Our Environment', ['Ecosystem', 'Food chains', 'Biodegradable waste', 'Ozone depletion'])
    ])
  ]),
  subject('mathematics', 'Mathematics', [
    category('algebra', 'Algebra', [
      chapter('real-numbers', 'Real Numbers', ['Euclid’s division lemma', 'Fundamental theorem of arithmetic', 'Irrational numbers']),
      chapter('polynomials', 'Polynomials', ['Zeroes and coefficients', 'Division algorithm']),
      chapter('linear-pairs', 'Pair of Linear Equations in Two Variables', ['Graphical method', 'Substitution', 'Elimination', 'Applications']),
      chapter('quadratic', 'Quadratic Equations', ['Factorisation', 'Quadratic formula', 'Nature of roots']),
      chapter('progressions', 'Arithmetic Progressions', ['Nth term', 'Sum of terms', 'Applications'])
    ]),
    category('geometry-trigonometry', 'Geometry & Trigonometry', [
      chapter('triangles', 'Triangles', ['Similarity', 'Basic proportionality theorem', 'Pythagoras theorem']),
      chapter('coordinate', 'Coordinate Geometry', ['Distance formula', 'Section formula', 'Area of triangle']),
      chapter('trigonometry', 'Introduction to Trigonometry', ['Trigonometric ratios', 'Identities', 'Heights and distances']),
      chapter('circles', 'Circles', ['Tangent to circle', 'Theorems on tangents'])
    ]),
    category('mensuration-data', 'Mensuration & Data', [
      chapter('areas-circles', 'Areas Related to Circles', ['Circumference', 'Area', 'Sectors and segments']),
      chapter('surface-volumes', 'Surface Areas and Volumes', ['Combination of solids', 'Frustum', 'Volume conversion']),
      chapter('statistics', 'Statistics', ['Mean', 'Median', 'Mode', 'Cumulative frequency']),
      chapter('probability', 'Probability', ['Classical probability', 'Events', 'Complementary events'])
    ])
  ])
]);
