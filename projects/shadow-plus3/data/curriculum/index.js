// Plus3 curriculum data is deliberately separate from the UI. The default profile is a
// general undergraduate template, not a claim about any one university's current syllabus.
export const FRAMEWORK_SOURCE = {
  title: 'UGC Curriculum and Credit Framework for Undergraduate Programmes (CCFUP)',
  url: 'https://www.ugc.gov.in/KeyInitiative?ID=yiPY1rgAlvz9%2F1chFf86gg%3D%3D',
  note: 'Use this general framework until an institution-approved syllabus is added.'
};

const topic = (id, name, subtopics) => ({ id, name, subtopics, active: true });
const chapter = (id, name, topics) => ({ id, name, topics: topics.map(([topicId, topicName, subtopics]) => topic(topicId, topicName, subtopics)), active: true });
const unit = (id, name, chapters) => ({ id, name, chapters: chapters.map(([chapterId, chapterName, topics]) => chapter(chapterId, chapterName, topics)), active: true });
const pathway = (categoryId, categoryName, subcategoryId, subcategoryName, unitId, unitName, chapters) => ({ categoryId, categoryName, subcategoryId, subcategoryName, unitId, unitName, chapters });

function nestPathways(pathways) {
  const categories = new Map();
  for (const path of pathways) {
    if (!categories.has(path.categoryId)) categories.set(path.categoryId, { id: path.categoryId, name: path.categoryName, subcategories: [], active: true });
    const categoryEntry = categories.get(path.categoryId);
    categoryEntry.subcategories.push({ id: path.subcategoryId, name: path.subcategoryName, units: [unit(path.unitId, path.unitName, path.chapters)], active: true });
  }
  return [...categories.values()];
}

const subjectTemplates = [
  {
    id: 'geology', name: 'Geology / Earth Sciences', code: 'GEOL', practical: ['Mineral and rock identification', 'Geological maps and sections', 'Field observations', 'Viva preparation'],
    paths: [
      pathway('physical-geology', 'Physical Geology', 'earth-processes', 'Earth Processes', 'earth-structure', 'Earth Structure & Dynamics', [['earth-structure', 'Earth Structure', [['layers', 'Layers of the Earth', ['Crust', 'Mantle', 'Core']], ['plate-tectonics', 'Plate Tectonics', ['Plate boundaries', 'Driving forces']]]]]),
      pathway('mineralogy', 'Mineralogy', 'crystallography', 'Crystallography', 'minerals', 'Minerals & Crystals', [['mineral-properties', 'Mineral Properties', [['physical-properties', 'Physical Properties', ['Hardness', 'Cleavage', 'Specific gravity']], ['crystal-systems', 'Crystal Systems', ['Symmetry', 'Axes and planes']]]]]),
      pathway('geomorphology', 'Geomorphology', 'surface-processes', 'Surface Processes', 'landforms', 'Landforms & Agents', [['weathering-erosion', 'Weathering and Erosion', [['weathering', 'Weathering', ['Mechanical weathering', 'Chemical weathering']], ['fluvial', 'Fluvial Processes', ['River erosion', 'Depositional landforms']]]]])
    ]
  },
  {
    id: 'physics', name: 'Physics', code: 'PHYS', practical: ['Experimental planning', 'Observations and errors', 'Graph analysis', 'Viva questions'],
    paths: [
      pathway('mechanics', 'Mechanics', 'classical-mechanics', 'Classical Mechanics', 'motion', 'Motion & Forces', [['newton-laws', 'Newtonian Mechanics', [['laws', 'Newton’s Laws', ['Free-body diagrams', 'Inertial frames']], ['work-energy', 'Work and Energy', ['Conservation laws', 'Potential energy']]]]]),
      pathway('thermal-physics', 'Thermal Physics', 'thermodynamics', 'Thermodynamics', 'heat-work', 'Heat, Work & Entropy', [['thermodynamic-laws', 'Laws of Thermodynamics', [['first-law', 'First Law', ['Internal energy', 'Work done']], ['second-law', 'Second Law', ['Entropy', 'Heat engines']]]]]),
      pathway('electromagnetism', 'Electromagnetism', 'electricity', 'Electricity & Magnetism', 'fields', 'Fields & Circuits', [['electrostatics', 'Electric Fields', [['electric-field', 'Electric Field', ['Field lines', 'Potential']], ['circuits', 'DC Circuits', ['Kirchhoff rules', 'Resistance networks']]]]])
    ]
  },
  {
    id: 'mathematics', name: 'Mathematics', code: 'MATH', practical: ['Problem-solving practice', 'Mathematical modelling', 'Viva questions', 'Computational methods'],
    paths: [
      pathway('calculus', 'Calculus', 'differential-calculus', 'Differential Calculus', 'limits-derivatives', 'Limits & Derivatives', [['differentiation', 'Differentiation', [['limits', 'Limits', ['Continuity', 'Standard limits']], ['derivatives', 'Derivatives', ['Product rule', 'Chain rule']]]]]),
      pathway('algebra', 'Algebra', 'linear-algebra', 'Linear Algebra', 'matrices', 'Matrices & Vectors', [['matrix-theory', 'Matrix Theory', [['matrices', 'Matrices', ['Operations', 'Inverse']], ['determinants', 'Determinants', ['Properties', 'Applications']]]]]),
      pathway('analysis', 'Analysis', 'real-analysis', 'Real Analysis', 'sequences', 'Sequences & Series', [['real-sequences', 'Real Sequences', [['convergence', 'Convergence', ['Bounded sequences', 'Monotone sequences']], ['series', 'Infinite Series', ['Tests of convergence', 'Power series']]]]])
    ]
  },
  {
    id: 'botany', name: 'Botany', code: 'BOT', practical: ['Specimen identification', 'Plant anatomy slides', 'Diagrams', 'Viva preparation'],
    paths: [
      pathway('plant-biology', 'Plant Biology', 'cell-biology', 'Cell Biology', 'plant-cells', 'Plant Cell Structure', [['cell-structure', 'Cell Structure', [['organelles', 'Cell Organelles', ['Chloroplast', 'Vacuole']], ['membranes', 'Cell Membranes', ['Transport', 'Cell signalling']]]]]),
      pathway('plant-diversity', 'Plant Diversity', 'taxonomy', 'Taxonomy', 'classification', 'Plant Classification', [['plant-groups', 'Plant Groups', [['cryptogams', 'Cryptogams', ['Algae', 'Bryophytes']], ['seed-plants', 'Seed Plants', ['Gymnosperms', 'Angiosperms']]]]]),
      pathway('plant-physiology', 'Plant Physiology', 'metabolism', 'Plant Metabolism', 'photosynthesis', 'Photosynthesis', [['photosynthesis', 'Photosynthesis in Plants', [['light-reaction', 'Light Reaction', ['Photosystems', 'Photophosphorylation']], ['carbon-fixation', 'Carbon Fixation', ['Calvin cycle', 'C3 and C4 pathways']]]]])
    ]
  },
  {
    id: 'zoology', name: 'Zoology', code: 'ZOO', practical: ['Specimen identification', 'Classification exercises', 'Diagrams', 'Viva preparation'],
    paths: [
      pathway('animal-diversity', 'Animal Diversity', 'classification', 'Classification', 'animal-groups', 'Animal Groups', [['animal-classification', 'Animal Classification', [['invertebrates', 'Invertebrates', ['Key phyla', 'Adaptations']], ['vertebrates', 'Vertebrates', ['Chordate features', 'Comparative anatomy']]]]]),
      pathway('animal-physiology', 'Animal Physiology', 'human-physiology', 'Human Physiology', 'homeostasis', 'Homeostasis', [['physiology', 'Body Systems', [['circulation', 'Circulation', ['Cardiac cycle', 'Blood pressure']], ['respiration', 'Respiration', ['Gas exchange', 'Transport of gases']]]]]),
      pathway('genetics', 'Genetics', 'inheritance', 'Inheritance', 'mendelian-genetics', 'Mendelian Genetics', [['inheritance-principles', 'Principles of Inheritance', [['mendel-laws', 'Mendel’s Laws', ['Segregation', 'Independent assortment']], ['pedigree', 'Pedigree Analysis', ['Symbols', 'Inheritance patterns']]]]])
    ]
  },
  {
    id: 'computer-science', name: 'Computer Science', code: 'CS', practical: ['Programming practicals', 'Debugging', 'Output prediction', 'Viva questions'],
    paths: [
      pathway('programming', 'Programming', 'python-programming', 'Programming Fundamentals', 'program-design', 'Program Design', [['algorithms', 'Algorithms and Logic', [['control-flow', 'Control Flow', ['Conditions', 'Loops']], ['functions', 'Functions', ['Parameters', 'Recursion']]]]]),
      pathway('data-structures', 'Data Structures', 'linear-structures', 'Linear Structures', 'arrays-lists', 'Arrays & Lists', [['linear-structures', 'Linear Data Structures', [['arrays', 'Arrays', ['Traversal', 'Complexity']], ['stacks-queues', 'Stacks and Queues', ['Operations', 'Applications']]]]]),
      pathway('systems', 'Computer Systems', 'databases', 'Database Systems', 'relational-model', 'Relational Model', [['dbms', 'Database Management', [['sql', 'SQL', ['Queries', 'Joins']], ['normalization', 'Normalization', ['Functional dependencies', 'Normal forms']]]]])
    ]
  },
  {
    id: 'chemistry', name: 'Chemistry', code: 'CHEM', practical: ['Laboratory safety', 'Titration calculations', 'Reactions and observations', 'Viva preparation'],
    paths: [
      pathway('physical-chemistry', 'Physical Chemistry', 'thermodynamics', 'Thermodynamics', 'chemical-energy', 'Chemical Energy', [['chemical-thermodynamics', 'Chemical Thermodynamics', [['enthalpy', 'Enthalpy', ['Hess’s law', 'Bond enthalpy']], ['entropy', 'Entropy and Free Energy', ['Spontaneity', 'Gibbs energy']]]]]),
      pathway('organic-chemistry', 'Organic Chemistry', 'reaction-mechanisms', 'Reaction Mechanisms', 'bonding-reactivity', 'Bonding & Reactivity', [['organic-fundamentals', 'Organic Fundamentals', [['functional-groups', 'Functional Groups', ['Nomenclature', 'Properties']], ['mechanisms', 'Reaction Mechanisms', ['Nucleophiles', 'Electrophiles']]]]]),
      pathway('inorganic-chemistry', 'Inorganic Chemistry', 'coordination', 'Coordination Chemistry', 'complexes', 'Coordination Compounds', [['coordination-compounds', 'Coordination Compounds', [['ligands', 'Ligands', ['Types', 'Nomenclature']], ['isomerism', 'Isomerism', ['Structural', 'Stereoisomerism']]]]])
    ]
  }
];

function makeCourses(template, semester) {
  return [{
    id: `${template.id}-general-sem-${semester}`,
    code: `${template.code}-GEN-${semester}`,
    title: `${template.name} — Semester ${semester} general study framework`,
    category: 'Discipline-specific / multidisciplinary template',
    active: true,
    categories: nestPathways(template.paths),
    practical: template.practical
  }];
}

const semesters = Array.from({ length: 8 }, (_, index) => ({ id: String(index + 1), name: `Semester ${index + 1}`, year: String(Math.ceil((index + 1) / 2)) }));

export const curriculumProfiles = [{
  id: 'general-ugc-nep', institution: 'General UGC/NEP-aligned mode', programme: 'B.Sc',
  name: 'General UGC/NEP-aligned B.Sc framework', source: FRAMEWORK_SOURCE,
  active: true, years: ['1', '2', '3', '4'], semesters,
  subjects: subjectTemplates.map((template) => ({ id: template.id, name: template.name, active: true, courses: semesters.map((semester) => makeCourses(template, semester.id)[0]) }))
}];

export const getProfile = (id) => curriculumProfiles.find((entry) => entry.id === id && entry.active);
export const getSemesters = (profileId, year) => getProfile(profileId)?.semesters.filter((entry) => entry.year === String(year)) || [];
export const getSubjects = (profileId, semester) => getProfile(profileId)?.subjects.filter((subject) => subject.active && subject.courses.some((course) => course.id.endsWith(`sem-${semester}`))) || [];
export const getCourse = (profileId, subjectId, semester, courseId) => getProfile(profileId)?.subjects.find((subject) => subject.id === subjectId)?.courses.find((course) => course.id === courseId && course.id.endsWith(`sem-${semester}`));
export const getCategory = (profileId, subjectId, semester, courseId, categoryId) => getCourse(profileId, subjectId, semester, courseId)?.categories.find((entry) => entry.id === categoryId && entry.active);
export const getSubcategory = (profileId, subjectId, semester, courseId, categoryId, subcategoryId) => getCategory(profileId, subjectId, semester, courseId, categoryId)?.subcategories.find((entry) => entry.id === subcategoryId && entry.active);
export const getUnit = (profileId, subjectId, semester, courseId, categoryId, subcategoryId, unitId) => getSubcategory(profileId, subjectId, semester, courseId, categoryId, subcategoryId)?.units.find((entry) => entry.id === unitId && entry.active);
export const getChapter = (profileId, subjectId, semester, courseId, categoryId, subcategoryId, unitId, chapterId) => getUnit(profileId, subjectId, semester, courseId, categoryId, subcategoryId, unitId)?.chapters.find((entry) => entry.id === chapterId && entry.active);
export const getTopic = (profileId, subjectId, semester, courseId, categoryId, subcategoryId, unitId, chapterId, topicId) => getChapter(profileId, subjectId, semester, courseId, categoryId, subcategoryId, unitId, chapterId)?.topics.find((entry) => entry.id === topicId && entry.active);

export function resolvePlus3Selection(config) {
  const { profileId, year, semester, subjectId, courseId, categoryId, subcategoryId, unitId, chapterId, topicId, subtopic } = config;
  const profile = getProfile(profileId);
  const yearIsActive = profile?.years.includes(String(year));
  const semesterMatchesYear = profile?.semesters.some((entry) => entry.id === String(semester) && entry.year === String(year));
  const subject = getSubjects(profileId, semester).find((entry) => entry.id === subjectId);
  const course = getCourse(profileId, subjectId, semester, courseId);
  const category = getCategory(profileId, subjectId, semester, courseId, categoryId);
  const subcategory = getSubcategory(profileId, subjectId, semester, courseId, categoryId, subcategoryId);
  const unitEntry = getUnit(profileId, subjectId, semester, courseId, categoryId, subcategoryId, unitId);
  const chapterEntry = getChapter(profileId, subjectId, semester, courseId, categoryId, subcategoryId, unitId, chapterId);
  const topicEntry = getTopic(profileId, subjectId, semester, courseId, categoryId, subcategoryId, unitId, chapterId, topicId);
  if (!profile || !yearIsActive || !semesterMatchesYear || !subject || !course || !category || !subcategory || !unitEntry || !chapterEntry || !topicEntry || !topicEntry.subtopics.includes(subtopic)) return null;
  return { profile, year: String(year), semester: String(semester), subject, course, category, subcategory, unit: unitEntry, chapter: chapterEntry, topic: topicEntry, subtopic };
}
