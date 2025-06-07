"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for farmer revenue over time
const revenueData = [
  { month: "Jan", revenue: 8000, expenses: 5000, profit: 3000 },
  { month: "Feb", revenue: 12000, expenses: 7000, profit: 5000 },
  { month: "Mar", revenue: 15000, expenses: 8000, profit: 7000 },
  { month: "Apr", revenue: 18000, expenses: 9000, profit: 9000 },
  { month: "May", revenue: 22000, expenses: 11000, profit: 11000 },
  { month: "Jun", revenue: 25000, expenses: 12000, profit: 13000 },
  { month: "Jul", revenue: 28000, expenses: 13000, profit: 15000 },
]

export function FarmerRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={revenueData}
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
        <Tooltip formatter={(value, name) => [`$${value}`, name]} labelFormatter={(label) => `Month: ${label}`} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#10b981" activeDot={{ r: 8 }} strokeWidth={2} name="Revenue" />
        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
        <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" />
      </LineChart>
    </ResponsiveContainer>
  )
}
