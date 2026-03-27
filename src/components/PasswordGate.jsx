import { useState } from "react";

const HASH = "21be664d838904b142da27b213bc91cf92b9c176b54cde2881dc1be1e8aa44ad";

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function PasswordGate({ children }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [authed, setAuthed] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const hash = await sha256(input);
    if (hash === HASH) {
      setAuthed(true);
    } else {
      setError(true);
      setInput("");
    }
  }

  if (authed) return children;

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:340,padding:"0 24px"}}>
        <div style={{fontSize:13,letterSpacing:"0.06em",textTransform:"uppercase",color:"#8DC63F",fontWeight:500,marginBottom:6}}>3 Verdeco Boulevard</div>
        <div style={{fontSize:22,fontWeight:500,letterSpacing:"-0.02em",marginBottom:4}}>Power Dashboard</div>
        <div style={{fontSize:13,color:"var(--color-text-tertiary)",marginBottom:28}}>Enter password to continue</div>
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:12}}>
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            style={{
              background:"var(--color-background-secondary)",
              border: error ? "0.5px solid #e05c5c" : "0.5px solid var(--color-border-secondary)",
              borderRadius:"var(--border-radius-md)",
              padding:"12px 14px",
              fontSize:14,
              color:"var(--color-text-primary)",
              outline:"none",
              width:"100%",
              fontFamily:"inherit",
              transition:"border-color 0.15s",
            }}
          />
          {error && <div style={{fontSize:12,color:"#e05c5c"}}>Incorrect password</div>}
          <button
            type="submit"
            style={{
              background:"#8DC63F",
              color:"#0f1117",
              border:"none",
              borderRadius:"var(--border-radius-md)",
              padding:"12px",
              fontSize:14,
              fontWeight:500,
              cursor:"pointer",
              fontFamily:"inherit",
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
