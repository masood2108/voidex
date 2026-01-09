import Header from "../components/header"
import StatCard from "../components/StatCard"
import PaymentOverview from "../components/PaymentOverview"
import Tasks from "../components/Tasks"
import Meetings from "../components/Meetings"
import RevenueChart from "../components/RevenueChart"
import ProjectStatus from "../components/ProjectStatus"

function Dashboard() {
  return (
    <>
      {/* ✅ HEADER ONLY HERE */}
      <Header />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard type="revenue" />
        <StatCard type="clients" />
        <StatCard type="completed" />
        <StatCard type="pending" />
      </div>

      <PaymentOverview />
      <Tasks />
      <Meetings />
      <RevenueChart />
      <ProjectStatus />
    </>
  )
}

export default Dashboard
