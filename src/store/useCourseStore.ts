import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course, Student } from "../types/course";

interface CourseStore {
  courses: Course[];
  selectedCourse: string | null;
  setSelectedCourse: (courseId: string | null) => void;
  addStudent: (
    courseId: string,
    student: Omit<Student, "id" | "grades">
  ) => void;
  deleteStudent: (courseId: string, studentId: string) => void;
  updateGrade: (
    courseId: string,
    studentId: string,
    gradeId: string,
    newScore: number
  ) => void;
  updateStudent: (
    courseId: string,
    studentId: string,
    updates: Partial<Omit<Student, "id" | "grades" | "finalGrade">>
  ) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  updateExamDescription: (
    courseId: string,
    examIndex: number,
    newDescription: string
  ) => void;
  addExam: (courseId: string, examName: string) => void;
  deleteExam: (courseId: string, examIndex: number) => void;
  updateExamMaxScore: (
    courseId: string,
    examIndex: number,
    newMaxScore: number
  ) => void;
  addCourse: (course: Omit<Course, "id">) => void;
  deleteCourse: (courseId: string) => void;
}

const calculateFinalGrade = (grades: { score: number }[]): number => {
  if (grades.length === 0) return 0;
  const totalScore = grades.reduce((acc, grade) => acc + grade.score, 0);
  return Number(totalScore.toFixed(1));
};

const generateStudentId = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: [],
      selectedCourse: null,
      setSelectedCourse: (courseId) => set({ selectedCourse: courseId }),
      addStudent: (courseId, studentData) =>
        set((state) => {
          const course = state.courses.find((c) => c.id === courseId);
          if (!course) return state;

          const grades = course.exams.map((exam) => ({
            id: `grade-${crypto.randomUUID()}`,
            examName: exam.name,
            score: 0,
            maxScore: exam.maxScore,
          }));

          const newStudent: Student = {
            id: crypto.randomUUID(),
            ...studentData,
            studentId: generateStudentId(),
            grades,
            finalGrade: calculateFinalGrade(grades),
          };

          return {
            courses: state.courses.map((c) =>
              c.id === courseId
                ? { ...c, students: [...c.students, newStudent] }
                : c
            ),
          };
        }),
      deleteStudent: (courseId, studentId) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  students: course.students.filter((s) => s.id !== studentId),
                }
              : course
          ),
        })),
      updateGrade: (courseId, studentId, gradeId, newScore) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  students: course.students.map((student) =>
                    student.id === studentId
                      ? {
                          ...student,
                          grades: student.grades.map((grade) =>
                            grade.id === gradeId
                              ? { ...grade, score: newScore }
                              : grade
                          ),
                          finalGrade: calculateFinalGrade(
                            student.grades.map((grade) =>
                              grade.id === gradeId
                                ? { ...grade, score: newScore }
                                : grade
                            )
                          ),
                        }
                      : student
                  ),
                }
              : course
          ),
        })),
      updateStudent: (courseId, studentId, updates) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  students: course.students.map((student) =>
                    student.id === studentId
                      ? { ...student, ...updates }
                      : student
                  ),
                }
              : course
          ),
        })),
      exportData: () => JSON.stringify(get().courses, null, 2),
      importData: (jsonData) => {
        try {
          const courses = JSON.parse(jsonData);
          if (Array.isArray(courses)) {
            set({ courses });
          }
        } catch (error) {
          console.error("Error importing data:", error);
        }
      },
      updateCourse: (courseId, updates) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId ? { ...course, ...updates } : course
          ),
        })),
      updateExamDescription: (courseId, examIndex, newDescription) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  exams: course.exams.map((exam, index) =>
                    index === examIndex
                      ? { ...exam, name: newDescription }
                      : exam
                  ),
                }
              : course
          ),
        })),
      addExam: (courseId, examName) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  exams: [...course.exams, { name: examName, maxScore: 100 }],
                  students: course.students.map((student) => ({
                    ...student,
                    grades: [
                      ...student.grades,
                      {
                        id: `grade-${crypto.randomUUID()}`,
                        examName,
                        score: 0,
                        maxScore: 100,
                      },
                    ],
                  })),
                }
              : course
          ),
        })),
      deleteExam: (courseId, examIndex) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  exams: course.exams.filter((_, index) => index !== examIndex),
                  students: course.students.map((student) => ({
                    ...student,
                    grades: student.grades.filter(
                      (_, index) => index !== examIndex
                    ),
                  })),
                }
              : course
          ),
        })),
      updateExamMaxScore: (courseId, examIndex, newMaxScore) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  exams: course.exams.map((exam, index) =>
                    index === examIndex
                      ? { ...exam, maxScore: newMaxScore }
                      : exam
                  ),
                }
              : course
          ),
        })),
      addCourse: (courseData) =>
        set((state) => ({
          courses: [
            ...state.courses,
            {
              id: crypto.randomUUID(),
              ...courseData,
            },
          ],
        })),
      deleteCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((course) => course.id !== courseId),
        })),
    }),
    {
      name: "course-storage",
    }
  )
);
