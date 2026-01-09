import { useContext, useMemo } from "react"
import { DataContext } from "../context/DataContext"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function RevenueChart() {
  const data = useContext(DataContext)

  const revenueData = useMemo(() => {
    if (!data || !Array.isArray(data.clients)) return []

    const allProjects = data.clients.flatMap(c => c.projects || [])

    const paidTotal = allProjects
      .filter(p => p.paymentStatus === "paid")
      .reduce((sum, p) => sum + Number(p.value || 0), 0)

    // Simple monthly distribution (can be enhanced later)
    return [
      { month: "Jul", value: paidTotal },
      { month: "Aug", value: paidTotal },
      { month: "Sep", value: paidTotal },
      { month: "Oct", value: paidTotal },
      { month: "Nov", value: paidTotal },
      { month: "Dec", value: paidTotal }
    ]
  }, [data])

  if (!revenueData.length) return null

  return (
    <div className="card p-5 mt-6 h-[300px]">
      <h2 className="font-semibold mb-4">Revenue Trend</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenueData}>
          <XAxis dataKey="month" stroke="#9ca3af" tickLine={false} axisLine={false} />
          <YAxis
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#0b0f14",
              border: "1px solid #1f2937",
              borderRadius: "8px"
            }}
            formatter={(v) => `$${v}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart
