import { NCERT_SOURCES, category, chapter, subject, withMetadata } from './schema.js';

export default withMetadata(11, NCERT_SOURCES.class11, [
  subject('physics', 'Physics', [
    category('mechanics', 'Mechanics', [
      chapter('units', 'Units and Measurements', ['Physical quantities', 'SI units', 'Significant figures', 'Dimensions', 'Errors in measurement']),
      chapter('motion-line', 'Motion in a Straight Line', ['Position and displacement', 'Velocity', 'Acceleration', 'Kinematic equations', 'Graphs']),
      chapter('motion-plane', 'Motion in a Plane', ['Vectors', 'Projectile motion', 'Uniform circular motion']),
      chapter('laws-motion', 'Laws of Motion', ['Newton’s laws', 'Friction', 'Circular motion', 'Free body diagrams']),
      chapter('work-power', 'Work, Energy and Power', ['Work-energy theorem', 'Conservative forces', 'Potential energy', 'Collisions']),
      chapter('rotation', 'System of Particles and Rotational Motion', ['Centre of mass', 'Torque', 'Angular momentum', 'Moment of inertia']),
      chapter('gravitation', 'Gravitation', ['Universal gravitation', 'Satellites', 'Escape velocity', 'Orbital velocity'])
    ]),
    category('properties-thermodynamics', 'Properties of Matter & Thermodynamics', [
      chapter('solids', 'Mechanical Properties of Solids', ['Stress and strain', 'Elastic moduli', 'Hooke’s law']),
      chapter('fluids', 'Mechanical Properties of Fluids', ['Pressure', 'Buoyancy', 'Viscosity', 'Surface tension', 'Bernoulli principle']),
      chapter('thermal', 'Thermal Properties of Matter', ['Temperature', 'Thermal expansion', 'Calorimetry', 'Heat transfer']),
      chapter('thermodynamics', 'Thermodynamics', ['Thermal equilibrium', 'First law', 'Heat engines', 'Second law']),
      chapter('kinetic-theory', 'Kinetic Theory', ['Ideal gas', 'Kinetic interpretation of temperature']),
      chapter('oscillations', 'Oscillations', ['Simple harmonic motion', 'Energy in SHM', 'Pendulum']),
      chapter('waves', 'Waves', ['Wave motion', 'Superposition', 'Standing waves', 'Doppler effect'])
    ])
  ]),
  subject('chemistry', 'Chemistry', [
    category('physical-chemistry', 'Physical Chemistry', [
      chapter('basic-concepts', 'Some Basic Concepts of Chemistry', ['Mole concept', 'Stoichiometry', 'Concentration terms', 'Limiting reagent']),
      chapter('atom-structure', 'Structure of Atom', ['Bohr model', 'Quantum numbers', 'Electronic configuration']),
      chapter('states-matter', 'States of Matter', ['Gas laws', 'Kinetic theory', 'Intermolecular forces']),
      chapter('thermodynamics', 'Thermodynamics', ['System and surroundings', 'Enthalpy', 'Hess’s law', 'Entropy']),
      chapter('equilibrium', 'Equilibrium', ['Chemical equilibrium', 'Ionic equilibrium', 'Le Chatelier principle', 'pH']),
      chapter('redox', 'Redox Reactions', ['Oxidation number', 'Balancing redox reactions'])
    ]),
    category('inorganic-chemistry', 'Inorganic Chemistry', [
      chapter('periodicity', 'Classification of Elements and Periodicity in Properties', ['Periodic trends', 'Atomic radius', 'Ionisation enthalpy', 'Electronegativity']),
      chapter('bonding', 'Chemical Bonding and Molecular Structure', ['Ionic and covalent bonding', 'VSEPR theory', 'Hybridisation', 'Molecular orbital theory']),
      chapter('hydrogen', 'Hydrogen', ['Isotopes', 'Hydrides', 'Water', 'Hydrogen peroxide']),
      chapter('s-block', 'The s-Block Elements', ['Alkali metals', 'Alkaline earth metals', 'Important compounds']),
      chapter('p-block', 'The p-Block Elements', ['Group 13 and 14 trends', 'Important compounds'])
    ]),
    category('organic-chemistry', 'Organic Chemistry', [
      chapter('organic-basics', 'Organic Chemistry — Some Basic Principles and Techniques', ['IUPAC nomenclature', 'Electronic effects', 'Reaction intermediates', 'Purification']),
      chapter('hydrocarbons', 'Hydrocarbons', ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic hydrocarbons'])
    ])
  ]),
  subject('biology', 'Biology', [
    category('biology-foundations', 'Biology Foundations', [
      chapter('living-world', 'The Living World', ['Taxonomy', 'Nomenclature', 'Taxonomic categories']),
      chapter('cell', 'Cell: The Unit of Life', ['Cell organelles', 'Prokaryotic and eukaryotic cells', 'Cell membrane']),
      chapter('biomolecules', 'Biomolecules', ['Carbohydrates', 'Proteins', 'Enzymes', 'Nucleic acids']),
      chapter('cell-cycle', 'Cell Cycle and Cell Division', ['Mitosis', 'Meiosis', 'Cell cycle phases'])
    ]),
    category('botany', 'Botany', [
      chapter('classification', 'Biological Classification', ['Kingdom systems', 'Monera', 'Protista', 'Fungi', 'Viruses']),
      chapter('plant-kingdom', 'Plant Kingdom', ['Algae', 'Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms']),
      chapter('morphology', 'Morphology of Flowering Plants', ['Root', 'Stem', 'Leaf', 'Inflorescence', 'Flower']),
      chapter('anatomy', 'Anatomy of Flowering Plants', ['Tissues', 'Dicot and monocot structure', 'Secondary growth']),
      chapter('transport', 'Transport in Plants', ['Water potential', 'Transpiration', 'Ascent of sap', 'Phloem transport']),
      chapter('nutrition', 'Mineral Nutrition', ['Essential elements', 'Nitrogen cycle', 'Deficiency symptoms']),
      chapter('photosynthesis', 'Photosynthesis in Higher Plants', ['Light reaction', 'Calvin cycle', 'C3 and C4 pathways']),
      chapter('respiration', 'Respiration in Plants', ['Glycolysis', 'Krebs cycle', 'Electron transport']),
      chapter('growth', 'Plant Growth and Development', ['Plant hormones', 'Growth phases', 'Photoperiodism'])
    ]),
    category('zoology', 'Zoology', [
      chapter('animal-kingdom', 'Animal Kingdom', ['Basis of classification', 'Non-chordates', 'Chordates']),
      chapter('animal-organisation', 'Structural Organisation in Animals', ['Animal tissues', 'Earthworm', 'Cockroach', 'Frog']),
      chapter('digestion', 'Digestion and Absorption', ['Digestive system', 'Enzymes', 'Absorption']),
      chapter('breathing', 'Breathing and Exchange of Gases', ['Respiratory organs', 'Gas transport', 'Regulation of respiration']),
      chapter('circulation', 'Body Fluids and Circulation', ['Blood', 'Lymph', 'Heart', 'Cardiac cycle']),
      chapter('excretion', 'Excretory Products and their Elimination', ['Nephron', 'Urine formation', 'Osmoregulation']),
      chapter('locomotion', 'Locomotion and Movement', ['Muscle contraction', 'Skeletal system', 'Joints']),
      chapter('neural', 'Neural Control and Coordination', ['Neuron', 'Reflex action', 'Brain', 'Sense organs']),
      chapter('chemical-control', 'Chemical Coordination and Integration', ['Endocrine glands', 'Hormones', 'Feedback mechanisms'])
    ])
  ]),
  subject('mathematics', 'Mathematics', [
    category('algebra', 'Algebra', [
      chapter('sets', 'Sets', ['Representation of sets', 'Operations on sets', 'Venn diagrams']),
      chapter('relations-functions', 'Relations and Functions', ['Types of relations', 'Functions', 'Domain and range']),
      chapter('complex', 'Complex Numbers and Quadratic Equations', ['Complex plane', 'Algebra of complex numbers', 'Quadratic roots']),
      chapter('inequalities', 'Linear Inequalities', ['Graphical solution', 'System of inequalities']),
      chapter('permutations', 'Permutations and Combinations', ['Fundamental principle', 'Permutations', 'Combinations']),
      chapter('binomial', 'Binomial Theorem', ['Expansion', 'General term', 'Middle term']),
      chapter('sequences', 'Sequences and Series', ['AP', 'GP', 'Sum of series'])
    ]),
    category('calculus-geometry', 'Calculus & Geometry', [
      chapter('trigonometry', 'Trigonometric Functions', ['Angles', 'Identities', 'Graphs', 'Equations']),
      chapter('straight-lines', 'Straight Lines', ['Slope', 'Equation forms', 'Distance from a point']),
      chapter('conic', 'Conic Sections', ['Parabola', 'Ellipse', 'Hyperbola']),
      chapter('3d', 'Introduction to Three-dimensional Geometry', ['Coordinates', 'Distance formula']),
      chapter('limits', 'Limits and Derivatives', ['Limits', 'Derivatives', 'Rate of change'])
    ]),
    category('statistics-probability', 'Statistics & Probability', [
      chapter('statistics', 'Statistics', ['Measures of dispersion', 'Mean deviation', 'Variance']),
      chapter('probability', 'Probability', ['Random experiments', 'Events', 'Probability axioms'])
    ])
  ])
]);
