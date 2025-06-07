"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for project performance
const projectData = [
  { project: "Rice 2023", projected: 45, actual: 48, roi: 22 },
  { project: "Vegetables 2023", projected: 30, actual: 32, roi: 19 },
  { project: "Herbs 2023", projected: 12, actual: 14, roi: 42 },
  { project: "Rice 2024", projected: 45, actual: 0, roi: 0 }, // In progress
]

export function FarmerProjectChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={projectData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="project" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [
            name === "roi" ? `${value}%` : `${value} tons`,
            name === "projected" ? "Projected Yield" : name === "actual" ? "Actual Yield" : "ROI",
          ]}
        />
        <Legend />
        <Bar dataKey="projected" fill="#94a3b8" name="Projected Yield" />
        <Bar dataKey="actual" fill="#10b981" name="Actual Yield" />
      </BarChart>
    </ResponsiveContainer>
  )
}
