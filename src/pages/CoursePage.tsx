import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserPlus, Edit2 } from "lucide-react";
import { GradesTable } from "../components/GradesTable";
import { CourseStats } from "../components/CourseStats";
import { GradeDistributionChart } from "../components/GradeDistributionChart";
import { ExamPerformanceChart } from "../components/ExamPerformanceChart";
import { StudentForm } from "../components/StudentForm";
import { DataManagement } from "../components/DataManagement";
import { useCourseStore } from "../store/useCourseStore";
import toast from "react-hot-toast";

export const CoursePage: React.FC = () => {
  const { courseId } = useParams();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingCourse, setEditingCourse] = useState(false);
  const { courses, addStudent, deleteStudent, updateCourse } = useCourseStore();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return <Navigate to="/" replace />;
  }

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm("¿Está seguro de eliminar este estudiante?")) {
      deleteStudent(course.id, studentId);
      toast.success("Estudiante eliminado exitosamente");
    }
  };

  const handleCourseEditSave = (name: string) => {
    updateCourse(course.id, { name });
    setEditingCourse(false);
    toast.success("Curso actualizado exitosamente");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        {editingCourse ? (
          <input
            type="text"
            defaultValue={course.name}
            onBlur={(e) => handleCourseEditSave(e.target.value)}
            className="text-2xl font-bold text-gray-900"
          />
        ) : (
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
        )}
        <div className="flex gap-4">
          <DataManagement />
          <button
            onClick={() => setShowAddStudent(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <UserPlus className="w-4 h-4" />
            Agregar Estudiante
          </button>
          <button
            onClick={() => setEditingCourse(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Edit2 className="w-4 h-4" />
            Editar Curso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CourseStats course={course} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Distribución de Notas Finales
          </h2>
          <GradeDistributionChart course={course} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Rendimiento por Examen</h2>
          <ExamPerformanceChart course={course} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Calificaciones Detalladas</h2>
        </div>
        <div className="p-6">
          <GradesTable course={course} onDeleteStudent={handleDeleteStudent} />
        </div>
      </div>

      {showAddStudent && (
        <StudentForm
          courseId={course.id}
          onSubmit={(courseId, student) =>
            addStudent(courseId, { ...student, finalGrade: 0 })
          }
          onClose={() => setShowAddStudent(false)}
        />
      )}
    </div>
  );
};
