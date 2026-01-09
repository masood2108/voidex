import { useContext } from "react"
import { DataContext } from "../context/DataContext"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

function ProjectStatus() {
  const data = useContext(DataContext)

  const projectData = data?.projectStatus || [
    { month: "Jul", completed: 4, progress: 2 },
    { month: "Aug", completed: 5, progress: 3 },
    { month: "Sep", completed: 3, progress: 4 },
    { month: "Oct", completed: 6, progress: 2 },
    { month: "Nov", completed: 5, progress: 3 },
    { month: "Dec", completed: 4, progress: 5 }
  ]

  return (
    <div className="card p-5 mt-6 h-[320px]">

      <h2 className="font-semibold mb-4">Project Status</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={projectData}>
          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0b0f14",
              border: "1px solid #1f2937",
              borderRadius: "8px"
            }}
            labelStyle={{ color: "#9ca3af" }}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) =>
              value === "completed" ? "Completed" : "In Progress"
            }
          />

          <Bar
            dataKey="completed"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="progress"
            fill="#b3b3b3"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  )
}

export default ProjectStatus
