import { useContext } from "react"
import { DataContext } from "../context/DataContext"
import {
  Calendar,
  Video,
  Phone,
  Users
} from "lucide-react"

const MODES = {
  video: {
    icon: Video,
    bg: "bg-brandBlue/10",
    iconBg: "bg-brandBlue/20",
    label: "Video"
  },
  call: {
    icon: Phone,
    bg: "bg-brandGreen/10",
    iconBg: "bg-brandGreen/20",
    label: "Call"
  },
  "in-person": {
    icon: Users,
    bg: "bg-brandPurple/10",
    iconBg: "bg-brandPurple/20",
    label: "In-Person"
  }
}

function Meetings() {
  const data = useContext(DataContext)
  if (!data) return null

  const meetings = data.meetings || []

  return (
    <div className="card p-5 mt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brandPurple/10 flex items-center justify-center">
            <Calendar className="text-brandPurple" size={18} />
          </div>
          <h2 className="font-semibold">Today’s Meetings</h2>
        </div>

        <span className="text-sm bg-brandPurple/10 text-brandPurple px-3 py-1 rounded-full">
          {meetings.length}
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {meetings.length === 0 && (
          <p className="text-muted text-sm">No meetings today</p>
        )}

        {meetings.map(meeting => {
          const mode = MODES[meeting.mode] || MODES.video
          const Icon = mode.icon

          return (
            <div
              key={meeting.id}
              className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${mode.iconBg}`}>
                  <Icon size={18} />
                </div>

                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-muted">{meeting.client}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-sm font-medium">{meeting.time}</p>
                <span className="text-xs text-muted">{mode.label}</span>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Meetings
