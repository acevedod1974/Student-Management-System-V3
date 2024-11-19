import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Course } from '../types/course';

interface CourseOverviewChartProps {
  courses: Course[];
}

export const CourseOverviewChart: React.FC<CourseOverviewChartProps> = ({ courses }) => {
  const data = courses.map((course) => {
    const averageGrade = course.students.reduce(
      (acc, student) => acc + student.finalGrade,
      0
    ) / course.students.length;

    const passingStudents = course.students.filter(
      (student) => student.finalGrade >= 6
    ).length;

    return {
      name: course.name,
      promedio: Number(averageGrade.toFixed(1)),
      aprobados: (passingStudents / course.students.length) * 100,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="promedio"
          name="Promedio"
          fill="#3b82f6"
        />
        <Bar
          yAxisId="right"
          dataKey="aprobados"
          name="% Aprobados"
          fill="#10b981"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};