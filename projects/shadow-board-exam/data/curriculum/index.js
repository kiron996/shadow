import class9 from './class9.js';
import class10 from './class10.js';
import class11 from './class11.js';
import class12 from './class12.js';

export const curriculum = [class9, class10, class11, class12];

export const getClassCurriculum = (classId) => curriculum.find((entry) => entry.id === String(classId));
export const getSubject = (classId, subjectId) => getClassCurriculum(classId)?.subjects.find((entry) => entry.id === subjectId && entry.active);
export const getCategory = (classId, subjectId, categoryId) => getSubject(classId, subjectId)?.categories.find((entry) => entry.id === categoryId && entry.active);
export const getChapter = (classId, subjectId, categoryId, chapterId) => getCategory(classId, subjectId, categoryId)?.chapters.find((entry) => entry.id === chapterId && entry.active);

export function resolveSelection({ classId, subjectId, categoryId, chapterId, topic }) {
  const classEntry = getClassCurriculum(classId);
  const subjectEntry = getSubject(classId, subjectId);
  const categoryEntry = getCategory(classId, subjectId, categoryId);
  const chapterEntry = getChapter(classId, subjectId, categoryId, chapterId);
  if (!classEntry || !subjectEntry || !categoryEntry || !chapterEntry) return null;
  const selectedTopic = topic === 'random' ? 'Random active topic' : chapterEntry.topics.find((entry) => entry === topic);
  if (!selectedTopic) return null;
  return { classEntry, subjectEntry, categoryEntry, chapterEntry, topic: selectedTopic };
}
