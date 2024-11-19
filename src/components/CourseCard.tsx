import React from 'react';
import { Course } from '../types/course';
import { Users, GraduationCap } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onClick: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isSelected, onClick }) => {
  const averageGrade = course.students.reduce(
    (acc, student) => acc + student.finalGrade,
    0
  ) / course.students.length;

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'bg-white border border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <GraduationCap className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">{course.name}</h3>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        <Users className="w-4 h-4" />
        <span>{course.students.length} estudiantes</span>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">Promedio del curso:</p>
        <p className="text-2xl font-bold text-blue-600">
          {averageGrade.toFixed(1)}
        </p>
      </div>
    </div>
  );
};