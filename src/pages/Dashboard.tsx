import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { CourseOverviewChart } from "../components/CourseOverviewChart";
import { useCourseStore } from "../store/useCourseStore";
import { PlusCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { confirmAction } from "../utils/confirmAction";

export const Dashboard: React.FC = () => {
  const courses = useCourseStore((state) => state.courses);
  const addCourse = useCourseStore((state) => state.addCourse);
  const deleteCourse = useCourseStore((state) => state.deleteCourse);
  const [newCourseName, setNewCourseName] = useState("");

  const handleAddCourse = () => {
    if (!newCourseName.trim()) {
      toast.error("El nombre del curso no puede estar vacío");
      return;
    }
    addCourse({ name: newCourseName, students: [], exams: [] });
    setNewCourseName("");
    toast.success("Curso agregado exitosamente");
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirmAction("¿Está seguro de eliminar este curso?")) {
      deleteCourse(courseId);
      toast.success("Curso eliminado exitosamente");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Vista General</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="relative">
            <Link to={`/course/${course.id}`}>
              <CourseCard
                course={course}
                isSelected={false}
                onClick={() => {}}
              />
            </Link>
            <button
              onClick={() => handleDeleteCourse(course.id)}
              className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Curso</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Nombre del nuevo curso"
            className="block w-full px-2 py-1 text-sm border rounded"
          />
          <button
            onClick={handleAddCourse}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Comparación de Cursos</h2>
        <CourseOverviewChart courses={courses} />
      </div>
    </div>
  );
};
