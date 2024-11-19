import React from 'react';
import { Student } from '../types/student';
import { Edit2, Trash2, GraduationCap, Mail, Calendar } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={student.profileImage}
          alt={`${student.firstName} ${student.lastName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white text-xl font-semibold">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-white/80">{student.major}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <GraduationCap className="w-4 h-4" />
          <span className="text-sm">GPA: {student.gpa}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            student.status === 'active' ? 'bg-green-100 text-green-800' :
            student.status === 'graduated' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(student)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(student.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};