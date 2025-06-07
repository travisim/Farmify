"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for portfolio value over time
const portfolioData = [
  { month: "Jan", value: 10000 },
  { month: "Feb", value: 11200 },
  { month: "Mar", value: 12500 },
  { month: "Apr", value: 12800 },
  { month: "May", value: 13500 },
  { month: "Jun", value: 14200 },
  { month: "Jul", value: 15000 },
]

export function InvestorPortfolioChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={portfolioData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`$${value} RLUSD`, "Portfolio Value"]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          activeDot={{ r: 8 }}
          strokeWidth={2}
          name="Portfolio Value"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
