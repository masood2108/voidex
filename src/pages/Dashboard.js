import Sidebar from "../components/Sidebar"
import Header from "../components/header"
import StatCard from "../components/StatCard"
import PaymentOverview from "../components/PaymentOverview"
import Tasks from "../components/Tasks"
import Meetings from "../components/Meetings"
import RevenueChart from "../components/RevenueChart"
import ProjectStatus from "../components/ProjectStatus"
import BottomNav from "../components/BottomNav"

function Dashboard() {
  return (
    <div className="bg-bg min-h-screen text-white">

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
<main className="lg:ml-64 px-4 pt-6 pb-24 max-w-6xl">

        {/* Header with Bell */}
        <Header />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard type="revenue" />
          <StatCard type="clients" />
          <StatCard type="completed" />
          <StatCard type="pending" />
        </div>

        {/* Sections */}
        <PaymentOverview />
        <Tasks />
        <Meetings />
        <RevenueChart />
        <ProjectStatus />

      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

export default Dashboard
