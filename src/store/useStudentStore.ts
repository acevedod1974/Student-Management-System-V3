import { create } from 'zustand';
import { Student } from '../types/student';

interface StudentStore {
  students: Student[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  students: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '1999-05-15',
      grade: 'Senior',
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
      major: 'Computer Science',
      gpa: 3.8,
      enrollmentDate: '2020-09-01',
      status: 'active'
    },
    // Add more sample students here
  ],
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, { ...student, id: crypto.randomUUID() }]
    })),
  updateStudent: (id, updatedStudent) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id ? { ...student, ...updatedStudent } : student
      )
    })),
  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((student) => student.id !== id)
    }))
}));