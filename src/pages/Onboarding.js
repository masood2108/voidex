import { auth, db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { ADMIN_EMAILS } from "../config/admins"

const professions = ["Software Engineer", "Designer", "Doctor", "Teacher", "Student"]

function Onboarding() {
  const navigate = useNavigate()
  const user = auth.currentUser

  const submit = async (e) => {
    e.preventDefault()

    const role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user"

    await setDoc(doc(db, "users", user.uid), {
      name: e.target.name.value,
      email: user.email,
      profession: e.target.profession.value,
      role
    })

    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgDark px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] border border-border">
        <h1 className="text-2xl mb-6">Complete Profile</h1>

        <form onSubmit={submit} className="space-y-4">
          <input name="name" placeholder="Full Name" className="input" />
          <input value={user.email} disabled className="input opacity-60" />
          <select name="profession" className="input">
            {professions.map(p => <option key={p}>{p}</option>)}
          </select>
          <button className="w-full bg-green py-2 rounded-lg">Continue</button>
        </form>
      </div>
    </div>
  )
}

export default Onboarding
