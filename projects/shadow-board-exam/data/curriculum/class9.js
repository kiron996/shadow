import { NCERT_SOURCES, category, chapter, subject, withMetadata } from './schema.js';

export default withMetadata(9, { ...NCERT_SOURCES.class9Science, mathematics: NCERT_SOURCES.class9Math }, [
  subject('science', 'Science', [
    category('physics-related', 'Physics-related Science', [
      chapter('motion', 'Motion', ['Distance and displacement', 'Speed and velocity', 'Acceleration', 'Equations of motion', 'Distance-time and velocity-time graphs']),
      chapter('force-laws', 'Force and Laws of Motion', ['Balanced and unbalanced forces', 'Inertia', 'Newton’s laws of motion', 'Momentum']),
      chapter('gravitation', 'Gravitation', ['Universal law of gravitation', 'Free fall', 'Mass and weight', 'Thrust and pressure', 'Buoyancy']),
      chapter('work-energy', 'Work and Energy', ['Work', 'Kinetic energy', 'Potential energy', 'Conservation of energy', 'Power']),
      chapter('sound', 'Sound', ['Production and propagation', 'Amplitude and frequency', 'Reflection of sound', 'Human ear'])
    ]),
    category('chemistry-related', 'Chemistry-related Science', [
      chapter('matter-surroundings', 'Matter in Our Surroundings', ['States of matter', 'Change of state', 'Evaporation', 'Latent heat']),
      chapter('matter-pure', 'Is Matter Around Us Pure?', ['Mixtures and solutions', 'Concentration', 'Separation techniques', 'Colloids and suspensions']),
      chapter('atoms-molecules', 'Atoms and Molecules', ['Laws of chemical combination', 'Atomic and molecular mass', 'Mole concept', 'Chemical formulae']),
      chapter('structure-atom', 'Structure of the Atom', ['Electrons, protons and neutrons', 'Atomic models', 'Valency', 'Isotopes and isobars'])
    ]),
    category('biology-related', 'Biology-related Science', [
      chapter('cell', 'The Fundamental Unit of Life', ['Cell theory', 'Cell organelles', 'Plant and animal cells', 'Cell division']),
      chapter('tissues', 'Tissues', ['Plant tissues', 'Animal tissues', 'Meristematic and permanent tissues']),
      chapter('diversity', 'Diversity in Living Organisms', ['Classification', 'Five kingdoms', 'Plant groups', 'Animal groups']),
      chapter('health', 'Why Do We Fall Ill', ['Health and disease', 'Infectious diseases', 'Means of spread', 'Prevention']),
      chapter('resources', 'Natural Resources', ['Air, water and soil', 'Biogeochemical cycles', 'Ozone layer', 'Sustainable use'])
    ])
  ]),
  subject('mathematics', 'Mathematics', [
    category('number-algebra', 'Number Systems & Algebra', [
      chapter('number-systems', 'Number Systems', ['Real numbers', 'Irrational numbers', 'Decimal expansions', 'Laws of exponents']),
      chapter('polynomials', 'Polynomials', ['Degree of polynomial', 'Zeroes', 'Remainder theorem basics', 'Algebraic identities']),
      chapter('linear-equations', 'Linear Equations in Two Variables', ['Solutions', 'Graphical representation', 'Applications'])
    ]),
    category('geometry', 'Geometry', [
      chapter('lines-angles', 'Lines and Angles', ['Complementary and supplementary angles', 'Parallel lines', 'Transversal']),
      chapter('triangles', 'Triangles', ['Congruence', 'Inequalities', 'Properties of triangles']),
      chapter('quadrilaterals', 'Quadrilaterals', ['Properties of parallelograms', 'Mid-point theorem']),
      chapter('circles', 'Circles', ['Chords', 'Angles subtended by chords', 'Cyclic properties'])
    ]),
    category('mensuration-data', 'Mensuration & Data', [
      chapter('areas', 'Areas of Parallelograms and Triangles', ['Equal areas', 'Parallelogram properties', 'Triangle area']),
      chapter('surface-volumes', 'Surface Areas and Volumes', ['Cube and cuboid', 'Cylinder', 'Cone', 'Sphere']),
      chapter('statistics', 'Statistics', ['Data collection', 'Bar graphs', 'Histogram', 'Frequency polygon']),
      chapter('probability', 'Probability', ['Experimental probability', 'Events', 'Simple outcomes'])
    ])
  ])
]);
