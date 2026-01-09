import { useContext } from "react"
import { DataContext } from "../context/DataContext"
import { DollarSign, TrendingUp, Clock } from "lucide-react"

function PaymentOverview() {
  const data = useContext(DataContext)
  if (!data || !Array.isArray(data.clients)) return null

  const allProjects = data.clients.flatMap(c => c.projects || [])

  const received = allProjects
    .filter(p => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + Number(p.value || 0), 0)

  const pending = allProjects
    .filter(p => p.paymentStatus !== "paid")
    .reduce((sum, p) => sum + Number(p.value || 0), 0)

  const pendingByClient = data.clients
    .map(c => ({
      name: c.name || c.clientName || "Unnamed Client",
      amount: (c.projects || [])
        .filter(p => p.paymentStatus !== "paid")
        .reduce((sum, p) => sum + Number(p.value || 0), 0)
    }))
    .filter(c => c.amount > 0)

  return (
    <div className="card p-5 mt-6">

      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-brandGreen/10 flex items-center justify-center">
          <DollarSign className="text-brandGreen" size={16} />
        </div>
        <h2 className="font-semibold">Payment Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

        <div className="received-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-brandGreen text-sm mb-1">
            <TrendingUp size={14} />
            Received
          </div>
          <p className="text-2xl font-semibold text-brandGreen">
            ${received}
          </p>
        </div>

        <div className="pending-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-brandYellow text-sm mb-1">
            <Clock size={14} />
            Pending
          </div>
          <p className="text-2xl font-semibold text-brandYellow">
            ${pending}
          </p>
        </div>

      </div>

      <p className="text-sm text-muted mb-2">Pending by Client</p>

      {pendingByClient.map((c, i) => (
        <div key={i} className="flex justify-between text-sm py-1">
          <span className="text-muted">{c.name}</span>
          <span className="text-brandYellow font-medium">${c.amount}</span>
        </div>
      ))}
    </div>
  )
}

export default PaymentOverview
