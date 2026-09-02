export const NCERT_SOURCES = {
  class9Science: { title: 'NCERT Science Textbook for Class IX (2025–26 reprint)', url: 'https://ncert.nic.in/textbook/pdf/iesc1ps.pdf' },
  class10Science: { title: 'NCERT Science Textbook for Class X', url: 'https://ncert.nic.in/textbook/pdf/jesc1ps.pdf' },
  class9Math: { title: 'NCERT textbook catalogue — Class IX Mathematics', url: 'https://ncert.nic.in/textbook.php' },
  class10Math: { title: 'NCERT textbook catalogue — Class X Mathematics', url: 'https://ncert.nic.in/textbook.php' },
  class11: { title: 'NCERT textbook catalogue — Class XI', url: 'https://ncert.nic.in/textbook.php?keph1=1-7' },
  class12: { title: 'NCERT textbook catalogue — Class XII', url: 'https://ncert.nic.in/textbook.php?lebo1=8-12' }
};

export const chapter = (id, name, topics, ncertRelevance = 'Core NCERT textbook content') => ({
  id,
  name,
  topics,
  ncertRelevance,
  active: true
});

export const category = (id, name, chapters) => ({ id, name, chapters, active: true });
export const subject = (id, name, categories) => ({ id, name, categories, active: true });

export function withMetadata(classId, source, subjects) {
  return {
    id: String(classId),
    label: `Class ${classId}`,
    source,
    lastReviewed: '2026-09-01',
    subjects
  };
}
