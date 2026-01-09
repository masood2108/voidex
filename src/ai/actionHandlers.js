import { addDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export const handleAction = async ({ intent, params }, user, navigate) => {
  if (!user) return "Please login first."

  switch (intent) {

    case "ADD_CLIENT":
      await addDoc(
        collection(db, "users", user.uid, "clients"),
        {
          name: params.name,
          createdAt: new Date()
        }
      )
      return `Client ${params.name} added successfully ✅`

    case "ADD_EVENT":
      await addDoc(
        collection(db, "users", user.uid, "events"),
        {
          title: params.title,
          date: params.date,
          time: params.time,
          type: "meeting",
          category: "scheduled",
          createdAt: new Date()
        }
      )
      return `Meeting scheduled on ${params.date} at ${params.time} 📅`

    case "SHOW_CLIENTS":
      const snap = await getDocs(
        collection(db, "users", user.uid, "clients")
      )
      return `You have ${snap.size} clients 👥`

    case "OPEN_CALENDAR":
      navigate("/calendar")
      return "Opening calendar 📅"

    default:
      return "I’m still learning this command 🤖"
  }
}
