import { useContext } from "react"
import { DataContext } from "../context/DataContext"
import { db } from "../firebase"
import { doc, updateDoc } from "firebase/firestore"
import { CheckSquare, Square, Clock } from "lucide-react"
import { AuthContext } from "../context/AuthContext"

function Tasks() {
  const data = useContext(DataContext)
  const { user } = useContext(AuthContext)

  if (!data) return null

  const tasks = data.tasks || []

  const pending = tasks.filter(t => t.category !== "completed")
  const completed = tasks.filter(t => t.category === "completed")

  const toggleTask = async (id, isCompleted) => {
    await updateDoc(
      doc(db, "users", user.uid, "events", id),
      { category: isCompleted ? "work" : "completed" }
    )
  }

  return (
    <div className="card p-5 mt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Today’s Tasks</h2>
        <span className="text-sm bg-brandGreen/10 text-brandGreen px-3 py-1 rounded-full">
          {completed.length}/{tasks.length || 1}
        </span>
      </div>

      {/* PENDING */}
      <div className="space-y-3">
        {pending.map(task => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id, false)}
            className="bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition"
          >
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-md border-2 border-brandYellow flex items-center justify-center mt-1">
                <Square className="text-brandYellow" size={14} />
              </div>

              <div className="flex-1">
                <p className="font-medium">{task.title}</p>

                <div className="flex items-center gap-3 text-sm mt-1">
                  <span className="text-muted">{task.client}</span>
                  <span className="flex items-center gap-1 text-brandYellow">
                    <Clock size={14} /> Due today
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COMPLETED */}
      {completed.length > 0 && (
        <>
          <div className="border-t border-border my-4"></div>
          <p className="text-muted text-sm mb-2">Completed</p>

          {completed.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id, true)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="h-6 w-6 rounded-md bg-brandGreen/10 flex items-center justify-center">
                <CheckSquare className="text-brandGreen" size={16} />
              </div>

              <span className="line-through text-muted">
                {task.title}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default Tasks
