export default function Legend({ items }) {
  return (
    <div style={{display:'flex',gap:18,marginBottom:12,fontSize:12,color:'var(--color-text-secondary)',flexWrap:'wrap'}}>
      {items.map(([c, l]) => (
        <span key={l} style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:10,height:10,borderRadius:3,background:c,flexShrink:0}}/>
          {l}
        </span>
      ))}
    </div>
  );
}
