import React, { useState } from "react";
import { Trash2, Save, Edit2, X, PlusCircle, MinusCircle } from "lucide-react";
import { Course } from "../types/course";
import { useCourseStore } from "../store/useCourseStore";
import toast from "react-hot-toast";
import { confirmAction } from "../utils/confirmAction";

interface GradesTableProps {
  course: Course;
  onDeleteStudent: (studentId: string) => void;
}

export const GradesTable: React.FC<GradesTableProps> = ({
  course,
  onDeleteStudent,
}) => {
  const {
    updateGrade,
    updateStudent,
    updateExamDescription,
    addExam,
    deleteExam,
    updateExamMaxScore,
  } = useCourseStore();
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    gradeId: string;
    currentValue: number;
  } | null>(null);

  const [editingStudent, setEditingStudent] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  const [editingExam, setEditingExam] = useState<number | null>(null);
  const [newExamDescription, setNewExamDescription] = useState<string>("");
  const [newExamName, setNewExamName] = useState<string>("");
  const [editingMaxScore, setEditingMaxScore] = useState<number | null>(null);
  const [newMaxScore, setNewMaxScore] = useState<number>(100);

  const handleEditStart = (
    studentId: string,
    gradeId: string,
    currentValue: number
  ) => {
    setEditingCell({ studentId, gradeId, currentValue });
  };

  const handleEditSave = () => {
    if (editingCell) {
      if (confirmAction("¿Está seguro de modificar esta calificación?")) {
        const newScore = Number(editingCell.currentValue);
        if (isNaN(newScore) || newScore < 0 || newScore > 100) {
          toast.error("La calificación debe ser un número entre 0 y 100");
          return;
        }
        updateGrade(
          course.id,
          editingCell.studentId,
          editingCell.gradeId,
          newScore
        );
        setEditingCell(null);
        toast.success("Calificación actualizada");
      }
    }
  };

  const handleExamEditStart = (index: number, currentDescription: string) => {
    setEditingExam(index);
    setNewExamDescription(currentDescription);
  };

  const handleExamEditSave = (index: number) => {
    updateExamDescription(course.id, index, newExamDescription);
    setEditingExam(null);
    toast.success("Descripción del examen actualizada");
  };

  const handleMaxScoreEditStart = (index: number, currentMaxScore: number) => {
    setEditingMaxScore(index);
    setNewMaxScore(currentMaxScore);
  };

  const handleMaxScoreEditSave = (index: number) => {
    updateExamMaxScore(course.id, index, newMaxScore);
    setEditingMaxScore(null);
    toast.success("Calificación máxima del examen actualizada");
  };

  const handleStudentEditStart = (student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    setEditingStudent(student);
  };

  const handleStudentEditSave = () => {
    if (editingStudent) {
      if (
        !editingStudent.firstName ||
        !editingStudent.lastName ||
        !editingStudent.email
      ) {
        toast.error("Todos los campos son requeridos");
        return;
      }
      if (!editingStudent.email.includes("@")) {
        toast.error("Email inválido");
        return;
      }
      updateStudent(course.id, editingStudent.id, {
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
        email: editingStudent.email,
      });
      setEditingStudent(null);
      toast.success("Datos del estudiante actualizados");
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    type: "grade" | "student" | "exam" | "maxScore",
    index?: number
  ) => {
    if (e.key === "Enter") {
      if (type === "grade") {
        handleEditSave();
      } else if (type === "student") {
        handleStudentEditSave();
      } else if (type === "exam" && index !== undefined) {
        handleExamEditSave(index);
      } else if (type === "maxScore" && index !== undefined) {
        handleMaxScoreEditSave(index);
      }
    } else if (e.key === "Escape") {
      if (type === "grade") {
        setEditingCell(null);
      } else if (type === "student") {
        setEditingStudent(null);
      } else if (type === "exam") {
        setEditingExam(null);
      } else if (type === "maxScore") {
        setEditingMaxScore(null);
      }
    }
  };

  const handleAddExam = () => {
    if (!newExamName.trim()) {
      toast.error("El nombre del examen no puede estar vacío");
      return;
    }
    addExam(course.id, newExamName);
    setNewExamName("");
    toast.success("Examen agregado exitosamente");
  };

  const handleDeleteExam = (index: number) => {
    if (confirmAction("¿Está seguro de eliminar este examen?")) {
      deleteExam(course.id, index);
      toast.success("Examen eliminado exitosamente");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estudiante
            </th>
            {course.exams.map((exam, index) => (
              <th
                key={exam.name}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {editingExam === index ? (
                  <input
                    type="text"
                    value={newExamDescription}
                    onChange={(e) => setNewExamDescription(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, "exam", index)}
                    className="block w-full px-2 py-1 text-sm border rounded"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => handleExamEditStart(index, exam.name)}
                    className="cursor-pointer"
                  >
                    {exam.name}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteExam(index)}
                  className="ml-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <MinusCircle className="w-4 h-4" />
                </button>
                {editingMaxScore === index ? (
                  <input
                    type="number"
                    min="0"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    onKeyDown={(e) => handleKeyPress(e, "maxScore", index)}
                    className="block w-full px-2 py-1 text-sm border rounded"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() =>
                      handleMaxScoreEditStart(index, exam.maxScore)
                    }
                    className="cursor-pointer"
                  >
                    Max: {exam.maxScore}
                  </span>
                )}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nota Final
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {course.students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {editingStudent?.id === student.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingStudent.firstName}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          firstName: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyPress(e, "student")}
                      placeholder="Nombre"
                      className="block w-full px-2 py-1 text-sm border rounded"
                    />
                    <input
                      type="text"
                      value={editingStudent.lastName}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          lastName: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyPress(e, "student")}
                      placeholder="Apellido"
                      className="block w-full px-2 py-1 text-sm border rounded"
                    />
                    <input
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          email: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyPress(e, "student")}
                      placeholder="Email"
                      className="block w-full px-2 py-1 text-sm border rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleStudentEditSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                    <button
                      onClick={() => handleStudentEditStart(student)}
                      className="mt-1 p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
              {student.grades.map((grade) => {
                const exam = course.exams.find(
                  (exam) => exam.name === grade.examName
                );
                const maxScore = exam ? exam.maxScore : 100;
                const isPassing = grade.score > maxScore / 2;
                return (
                  <td
                    key={grade.id}
                    className="px-6 py-4 whitespace-nowrap text-gray-900"
                  >
                    {editingCell?.studentId === student.id &&
                    editingCell?.gradeId === grade.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={maxScore}
                          step="1"
                          value={editingCell.currentValue}
                          onChange={(e) =>
                            setEditingCell({
                              ...editingCell,
                              currentValue: Number(e.target.value),
                            })
                          }
                          onKeyDown={(e) => handleKeyPress(e, "grade")}
                          className="w-20 px-2 py-1 border rounded"
                          autoFocus
                        />
                        <button
                          onClick={handleEditSave}
                          className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-100 ${
                          isPassing
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        onClick={() =>
                          handleEditStart(student.id, grade.id, grade.score)
                        }
                      >
                        {grade.score.toFixed(1)}
                      </span>
                    )}
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`font-semibold ${
                    student.finalGrade >
                    course.exams.reduce((acc, exam) => acc + exam.maxScore, 0) /
                      2
                      ? "text-green-800 bg-green-100"
                      : "text-red-800 bg-red-100"
                  } px-2 py-1 rounded`}
                >
                  {student.finalGrade.toFixed(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => {
                    if (
                      confirmAction("¿Está seguro de eliminar este estudiante?")
                    ) {
                      onDeleteStudent(student.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          value={newExamName}
          onChange={(e) => setNewExamName(e.target.value)}
          placeholder="Nombre del nuevo examen"
          className="block w-full px-2 py-1 text-sm border rounded"
        />
        <button
          onClick={handleAddExam}
          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
