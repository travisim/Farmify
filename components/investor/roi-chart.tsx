"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

// Mock data for ROI by category
const roiData = [
  { name: "Rice", value: 35, amount: 5250 },
  { name: "Vegetables", value: 25, amount: 3750 },
  { name: "Herbs", value: 20, amount: 3000 },
  { name: "Fruits", value: 15, amount: 2250 },
  { name: "Specialty", value: 5, amount: 750 },
]

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"]

export function InvestorROIChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={roiData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {roiData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value}%`, name]} />
      </PieChart>
    </ResponsiveContainer>
  )
}
