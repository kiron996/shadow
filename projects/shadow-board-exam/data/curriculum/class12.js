import { NCERT_SOURCES, category, chapter, subject, withMetadata } from './schema.js';

export default withMetadata(12, NCERT_SOURCES.class12, [
  subject('physics', 'Physics', [
    category('electrodynamics', 'Electrodynamics', [
      chapter('charges-fields', 'Electric Charges and Fields', ['Electric charge', 'Electric field', 'Gauss’s law', 'Electric flux']),
      chapter('potential-capacitance', 'Electrostatic Potential and Capacitance', ['Potential', 'Capacitors', 'Energy stored']),
      chapter('current-electricity', 'Current Electricity', ['Drift velocity', 'Ohm’s law', 'Kirchhoff’s rules', 'Wheatstone bridge']),
      chapter('moving-charges', 'Moving Charges and Magnetism', ['Lorentz force', 'Biot–Savart law', 'Ampere’s law', 'Galvanometer']),
      chapter('magnetism-matter', 'Magnetism and Matter', ['Bar magnet', 'Magnetic properties of materials']),
      chapter('emi', 'Electromagnetic Induction', ['Faraday’s laws', 'Lenz’s law', 'Inductance']),
      chapter('ac', 'Alternating Current', ['AC circuits', 'Resonance', 'Transformers']),
      chapter('em-waves', 'Electromagnetic Waves', ['Spectrum', 'Properties', 'Applications'])
    ]),
    category('optics-modern', 'Optics & Modern Physics', [
      chapter('ray-optics', 'Ray Optics and Optical Instruments', ['Mirrors', 'Lenses', 'Optical instruments']),
      chapter('wave-optics', 'Wave Optics', ['Interference', 'Diffraction', 'Polarisation']),
      chapter('dual-nature', 'Dual Nature of Radiation and Matter', ['Photoelectric effect', 'de Broglie wavelength']),
      chapter('atoms', 'Atoms', ['Bohr model', 'Hydrogen spectrum']),
      chapter('nuclei', 'Nuclei', ['Nuclear force', 'Radioactivity', 'Binding energy']),
      chapter('semiconductors', 'Semiconductor Electronics', ['Semiconductors', 'Diodes', 'Transistors', 'Logic gates'])
    ])
  ]),
  subject('chemistry', 'Chemistry', [
    category('physical-chemistry', 'Physical Chemistry', [
      chapter('solutions', 'Solutions', ['Concentration terms', 'Raoult’s law', 'Colligative properties']),
      chapter('electrochemistry', 'Electrochemistry', ['Conductance', 'Electrochemical cells', 'Nernst equation', 'Electrolysis']),
      chapter('kinetics', 'Chemical Kinetics', ['Rate law', 'Order of reaction', 'Half-life', 'Arrhenius equation'])
    ]),
    category('inorganic-chemistry', 'Inorganic Chemistry', [
      chapter('d-f-block', 'The d- and f-Block Elements', ['Transition elements', 'Lanthanides', 'Oxidation states']),
      chapter('coordination', 'Coordination Compounds', ['Ligands', 'Nomenclature', 'Isomerism', 'Bonding'])
    ]),
    category('organic-chemistry', 'Organic Chemistry', [
      chapter('haloalkanes', 'Haloalkanes and Haloarenes', ['Nomenclature', 'Nucleophilic substitution', 'Properties']),
      chapter('alcohols', 'Alcohols, Phenols and Ethers', ['Preparation', 'Reactions', 'Acidity']),
      chapter('carbonyl', 'Aldehydes, Ketones and Carboxylic Acids', ['Nucleophilic addition', 'Oxidation', 'Acidity']),
      chapter('amines', 'Amines', ['Classification', 'Basicity', 'Diazonium salts']),
      chapter('biomolecules', 'Biomolecules', ['Carbohydrates', 'Proteins', 'Nucleic acids', 'Vitamins'])
    ])
  ]),
  subject('biology', 'Biology', [
    category('botany', 'Botany', [
      chapter('plant-reproduction', 'Sexual Reproduction in Flowering Plants', ['Flower structure', 'Microsporogenesis', 'Megasporogenesis', 'Double fertilisation']),
      chapter('biotech-principles', 'Biotechnology: Principles and Processes', ['Genetic engineering', 'Restriction enzymes', 'PCR', 'Bioreactors']),
      chapter('biotech-applications', 'Biotechnology and its Applications', ['GM crops', 'Gene therapy', 'Ethics']),
      chapter('organisms-populations', 'Organisms and Populations', ['Adaptations', 'Population attributes', 'Interactions']),
      chapter('ecosystem', 'Ecosystem', ['Energy flow', 'Productivity', 'Ecological pyramids', 'Decomposition']),
      chapter('biodiversity', 'Biodiversity and Conservation', ['Levels of biodiversity', 'Hotspots', 'Conservation']),
      chapter('environment', 'Environmental Issues', ['Pollution', 'Climate change', 'Waste management'])
    ]),
    category('zoology', 'Zoology', [
      chapter('organism-reproduction', 'Reproduction in Organisms', ['Asexual reproduction', 'Sexual reproduction', 'Life span']),
      chapter('human-reproduction', 'Human Reproduction', ['Male system', 'Female system', 'Gametogenesis', 'Fertilisation']),
      chapter('reproductive-health', 'Reproductive Health', ['Contraception', 'STIs', 'Infertility']),
      chapter('inheritance', 'Principles of Inheritance and Variation', ['Mendelian genetics', 'Chromosomal disorders', 'Pedigree']),
      chapter('molecular-inheritance', 'Molecular Basis of Inheritance', ['DNA structure', 'Replication', 'Transcription', 'Translation']),
      chapter('evolution', 'Evolution', ['Evidence', 'Natural selection', 'Hardy–Weinberg principle']),
      chapter('health-disease', 'Human Health and Disease', ['Immunity', 'Pathogens', 'Cancer', 'Drug abuse']),
      chapter('food-production', 'Strategies for Enhancement in Food Production', ['Animal husbandry', 'Plant breeding', 'Tissue culture']),
      chapter('microbes', 'Microbes in Human Welfare', ['Food production', 'Sewage treatment', 'Biogas', 'Antibiotics'])
    ])
  ]),
  subject('mathematics', 'Mathematics', [
    category('algebra', 'Algebra', [
      chapter('relations-functions', 'Relations and Functions', ['Types of relations', 'Types of functions', 'Composition']),
      chapter('inverse-trig', 'Inverse Trigonometric Functions', ['Principal values', 'Properties', 'Identities']),
      chapter('matrices', 'Matrices', ['Types of matrices', 'Operations', 'Transpose']),
      chapter('determinants', 'Determinants', ['Properties', 'Area of triangle', 'Applications'])
    ]),
    category('calculus', 'Calculus', [
      chapter('continuity', 'Continuity and Differentiability', ['Continuity', 'Differentiability', 'Derivatives']),
      chapter('applications-derivatives', 'Application of Derivatives', ['Rate of change', 'Increasing/decreasing functions', 'Maxima and minima']),
      chapter('integrals', 'Integrals', ['Indefinite integrals', 'Definite integrals', 'Properties']),
      chapter('applications-integrals', 'Application of Integrals', ['Area under curves', 'Area between curves']),
      chapter('differential', 'Differential Equations', ['Formation', 'General solution', 'Applications'])
    ]),
    category('vectors-probability', 'Vectors, Geometry & Probability', [
      chapter('vectors', 'Vector Algebra', ['Vector operations', 'Dot product', 'Cross product']),
      chapter('three-d', 'Three Dimensional Geometry', ['Direction cosines', 'Lines', 'Planes']),
      chapter('linear-programming', 'Linear Programming', ['Constraints', 'Feasible region', 'Optimisation']),
      chapter('probability', 'Probability', ['Conditional probability', 'Bayes theorem', 'Random variables'])
    ])
  ])
]);
