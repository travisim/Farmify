"use client"

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, ComposedChart } from "recharts"

// Mock weather data
const weatherData = [
  { day: "Today", temp: 28, humidity: 75, rainfall: 2.5 },
  { day: "Tomorrow", temp: 30, humidity: 70, rainfall: 0 },
  { day: "Day 3", temp: 26, humidity: 85, rainfall: 15 },
  { day: "Day 4", temp: 25, humidity: 90, rainfall: 20 },
  { day: "Day 5", temp: 27, humidity: 80, rainfall: 5 },
]

export function FarmerWeatherChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={weatherData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          formatter={(value, name) => [
            name === "temp" ? `${value}°C` : name === "humidity" ? `${value}%` : `${value}mm`,
            name === "temp" ? "Temperature" : name === "humidity" ? "Humidity" : "Rainfall",
          ]}
        />
        <Bar yAxisId="right" dataKey="rainfall" fill="#3b82f6" name="Rainfall" />
        <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} name="Temperature" />
        <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} name="Humidity" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
