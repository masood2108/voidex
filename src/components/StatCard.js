import { useContext } from "react"
import { DataContext } from "../context/DataContext"
import { DollarSign, Users, CheckCircle, Clock } from "lucide-react"

function StatCard({ type }) {
  const data = useContext(DataContext)

  if (!data || !data.stats) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 w-28 bg-gray-700 rounded mb-3"></div>
        <div className="h-8 w-20 bg-gray-700 rounded"></div>
      </div>
    )
  }

  const config = {
    revenue: {
      label: "Monthly Revenue",
      value: `$${data.stats.revenue}`,
      icon: DollarSign,
      color: "text-brandGreen"
    },
    clients: {
      label: "Total Clients",
      value: data.stats.clients,
      icon: Users,
      color: "text-brandBlue"
    },
    completed: {
      label: "Projects Completed",
      value: data.stats.completed,
      icon: CheckCircle,
      color: "text-brandGreen"
    },
    pending: {
      label: "Pending Invoices",
      value: data.stats.pending,
      icon: Clock,
      color: "text-brandYellow"
    }
  }

  const Icon = config[type].icon

  return (
    <div className="card p-5 flex justify-between items-start">
      <div>
        <p className="text-sm text-muted mb-1">
          {config[type].label}
        </p>
        <p className="text-2xl font-semibold">
          {config[type].value}
        </p>
      </div>

      <div className={`h-9 w-9 rounded-full bg-white/5 
                       flex items-center justify-center ${config[type].color}`}>
        <Icon size={18} />
      </div>
    </div>
  )
}

export default StatCard
