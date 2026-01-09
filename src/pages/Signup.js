import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

const professions = [
  "Software Engineer", "Designer", "Doctor", "Teacher",
  "Student", "Entrepreneur", "Manager", "Freelancer"
]

function Signup() {
  const navigate = useNavigate()

  const signup = async (e) => {
    e.preventDefault()

    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value
    const profession = e.target.profession.value

    const res = await createUserWithEmailAndPassword(auth, email, password)

    await setDoc(doc(db, "users", res.user.uid), {
      name,
      email,
      profession,
      role: "user"
    })

    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgDark px-4">
      <div className="w-full max-w-md p-8 rounded-2xl 
                      bg-gradient-to-b from-[#0f172a] to-[#020617]
                      border border-border shadow-2xl">

        <h1 className="font-heading text-2xl mb-6 text-center">
          Create your VOIDEX account
        </h1>

        <form onSubmit={signup} className="space-y-4">
          <input name="name" placeholder="Full Name" className="input" />
          <input name="email" placeholder="Email" className="input" />
          <input name="password" type="password" placeholder="Password" className="input" />

          <select name="profession" className="input">
            <option>Select profession</option>
            {professions.map(p => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <button className="w-full bg-green py-2 rounded-lg font-semibold">
            Create Account
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Signup
