export interface Student {
  id: string; // ID numérica de 8 dígitos
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  profileImage: string;
  major: string;
  gpa: number;
  enrollmentDate: string;
  status: "active" | "inactive" | "graduated";
}
