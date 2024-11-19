export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  grade: string;
  profileImage: string;
  major: string;
  gpa: number;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
}