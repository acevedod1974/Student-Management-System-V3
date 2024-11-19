import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Course } from '../types/course';

interface GradeDistributionChartProps {
  course: Course;
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({ course }) => {
  const gradeRanges = [
    { name: '0-2', range: [0, 2], color: '#ef4444' },
    { name: '2-4', range: [2, 4], color: '#f97316' },
    { name: '4-6', range: [4, 6], color: '#eab308' },
    { name: '6-8', range: [6, 8], color: '#22c55e' },
    { name: '8-10', range: [8, 10], color: '#3b82f6' },
  ];

  const data = gradeRanges.map((range) => ({
    name: range.name,
    value: course.students.filter(
      (student) =>
        student.finalGrade >= range.range[0] &&
        student.finalGrade < range.range[1]
    ).length,
    color: range.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};