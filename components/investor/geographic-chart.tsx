"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

// Mock data for geographic distribution
const geoData = [
  { region: "North", percentage: 40, amount: 6000 },
  { region: "Central", percentage: 35, amount: 5250 },
  { region: "Northeast", percentage: 15, amount: 2250 },
  { region: "South", percentage: 10, amount: 1500 },
]

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"]

export function InvestorGeographicChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={geoData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="percentage">
          {geoData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value}%`, name]} />
      </PieChart>
    </ResponsiveContainer>
  )
}
