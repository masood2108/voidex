import { addDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export const executeAction = async (intentObj, user, navigate) => {
  const { intent } = intentObj

  switch (intent) {
    case "ADD_CLIENT":
      await addDoc(collection(db, "users", user.uid, "clients"), {
        name: intentObj.name,
        createdAt: new Date()
      })
      return `Client ${intentObj.name} added successfully ✅`

    case "SHOW_PAYMENTS":
      return "Opening your pending payments 💰"

    case "OPEN_CALENDAR":
      navigate("/calendar")
      return "Opening calendar 📅"

    case "WEEK_PROGRESS":
      return "Fetching your progress for this week 📊"

    default:
      return "Sorry, I didn't understand that yet 🤖"
  }
}
