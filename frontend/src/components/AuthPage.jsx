import { FiUser } from "react-icons/fi"
import iconApp from "../assets/icon/icon_app.png"
import { Field, SelectField } from "./ui"

export function AuthPage({ authMode, authForm, setAuthForm, onSubmit, onToggleMode, loading, message }) {
  return (
    <main className="min-h-screen bg-cyber-black text-cyber-white">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex items-center overflow-hidden border-b border-cyber-line px-6 py-10 lg:border-b-0 lg:border-r lg:px-14">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(37,242,155,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(37,242,155,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(37,242,155,0.18),transparent_34%),linear-gradient(135deg,rgba(5,8,7,0.15),#050807_70%)]" />
          <div className="relative max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-cyber-line bg-cyber-panel px-3 py-2 text-sm text-cyber-green">
              <img src={iconApp} alt="Cyber Inventory icon" className="h-5 w-5 object-contain" /> Cyber Inventory Control
            </div>
            <h1 className="text-4xl font-semibold tracking-normal text-cyber-white sm:text-6xl">
              Secure inventory operations.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-cyber-dim">
              Track assets, loan requests, approvals, and returns from one focused control dashboard.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <form onSubmit={onSubmit} className="w-full max-w-md border border-cyber-line bg-cyber-panel p-6 shadow-glow">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase text-cyber-green">Secure Access</p>
                <h2 className="mt-2 text-2xl font-semibold">{authMode === "login" ? "Login" : "Register"}</h2>
              </div>
              <FiUser className="text-2xl text-cyber-green" />
            </div>

            {authMode === "register" && (
              <>
                <Field label="Name" value={authForm.name} onChange={(value) => setAuthForm({ ...authForm, name: value })} />
                <div className="mb-4">
                  <SelectField
                    label="Role"
                    value={authForm.role}
                    onChange={(value) => setAuthForm({ ...authForm, role: value })}
                    options={[
                      { value: "staff", label: "Staff" },
                      { value: "admin", label: "Admin" },
                    ]}
                  />
                </div>
              </>
            )}

            <Field label="Email" type="email" value={authForm.email} onChange={(value) => setAuthForm({ ...authForm, email: value })} />
            <Field
              label="Password"
              type="password"
              value={authForm.password}
              minLength={6}
              maxLength={128}
              autoComplete={authMode === "login" ? "current-password" : "new-password"}
              onChange={(value) => setAuthForm({ ...authForm, password: value })}
            />

            {message && <p className="mb-4 border border-cyber-line bg-cyber-panel2 px-3 py-2 text-sm text-cyber-green">{message}</p>}

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Processing..." : authMode === "login" ? "Sign in" : "Create account"}
            </button>

            <button type="button" className="mt-4 w-full text-sm text-cyber-dim hover:text-cyber-green" onClick={onToggleMode}>
              {authMode === "login" ? "Need an account? Register" : "Already have an account? Login"}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
