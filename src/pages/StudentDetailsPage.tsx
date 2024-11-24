import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useCourseStore } from "../store/useCourseStore";
import { GradeDistributionChart } from "../components/GradeDistributionChart";
import { ExamPerformanceChart } from "../components/ExamPerformanceChart";

const StudentDetailsPage: React.FC = () => {
  const { courseId, studentId } = useParams<{
    courseId: string;
    studentId: string;
  }>();
  const courses = useCourseStore((state) => state.courses);
  const course = courses.find((c) => c.id === courseId);
  const student = course?.students.find((s) => s.id === studentId);

  if (!course || !student) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {student.firstName} {student.lastName}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Distribución de Notas</h2>
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
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Examen
                </th>
                {course.exams.map((exam) => (
                  <th
                    key={exam.name}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {exam.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {student.firstName} {student.lastName}
                </td>
                {student.grades.map((grade) => (
                  <td key={grade.id} className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        grade.score >= 6
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {grade.score}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
