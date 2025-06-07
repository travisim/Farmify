"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for risk distribution
const riskData = [
  { risk: "Low", percentage: 30, amount: 4500 },
  { risk: "Medium", percentage: 50, amount: 7500 },
  { risk: "High", percentage: 20, amount: 3000 },
]

export function InvestorRiskChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={riskData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="risk" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`${value}%`, "Allocation"]}
          labelFormatter={(label) => `Risk Level: ${label}`}
        />
        <Bar dataKey="percentage" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
