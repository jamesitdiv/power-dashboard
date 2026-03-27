export default function Stat({ label, value, sub, color }) {
  return (
    <div style={{background:'var(--color-background-secondary)',borderRadius:'var(--border-radius-lg)',padding:'18px 20px',minWidth:0}}>
      <div style={{fontSize:11,color:'var(--color-text-tertiary)',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:8}}>{label}</div>
      <div style={{fontSize:28,fontWeight:500,color:color||'var(--color-text-primary)',letterSpacing:'-0.025em',lineHeight:1}}>{value}</div>
      {sub && <div style={{fontSize:12,color:'var(--color-text-tertiary)',marginTop:8,lineHeight:1.4}}>{sub}</div>}
    </div>
  );
}
