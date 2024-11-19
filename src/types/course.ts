// src/types/course.ts
export interface Exam {
  name: string;
  maxScore: number;
}

export interface Grade {
  id: string;
  examName: string;
  score: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string; // ID numérica de 8 dígitos
  grades: Grade[];
  finalGrade: number;
}

export interface Course {
  id: string;
  name: string;
  students: Student[];
  exams: Exam[];
}
