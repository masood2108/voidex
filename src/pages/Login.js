import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"

function Login() {
  const navigate = useNavigate()

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)

    const ref = doc(db, "users", res.user.uid)
    const snap = await getDoc(ref)

    if (!snap.exists()) navigate("/onboarding")
    else navigate("/dashboard")
  }

  const emailLogin = async (e) => {
    e.preventDefault()
    await signInWithEmailAndPassword(
      auth,
      e.target.email.value,
      e.target.password.value
    )
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgDark px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] border border-border">
        <h1 className="text-3xl font-heading text-center mb-6">VOIDEX</h1>

        <button onClick={googleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-2 rounded-lg mb-6">
          <FcGoogle size={22} /> Continue with Google
        </button>

        <form onSubmit={emailLogin} className="space-y-4">
          <input name="email" placeholder="Email" className="input" />
          <input name="password" type="password" placeholder="Password" className="input" />
          <button className="w-full bg-green py-2 rounded-lg">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
