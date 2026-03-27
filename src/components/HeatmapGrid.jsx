import { useState } from "react";
import { HM } from "../data/index.js";
import { DAYS_LABEL, CL } from "../utils/index.js";

const getColor = (v, maxV) => {
  const t = v / maxV;
  if (t < 0.10) return '#e8faf3';
  if (t < 0.20) return '#b3edd9';
  if (t < 0.35) return '#6dd4af';
  if (t < 0.50) return '#34c79b';
  if (t < 0.70) return '#1a9e78';
  if (t < 0.85) return '#0d7358';
  return '#04503d';
};

export default function HeatmapGrid() {
  const maxV = Math.max(...HM.map(d => d.avg_kwh));
  const [tip, setTip] = useState(null);
  const cw = 28, ch = 28, ml = 44, mt = 30;

  return (
    <div style={{overflowX:'auto',position:'relative'}}>
      <svg width={ml + 24 * cw + 16} height={mt + 7 * ch + 44} style={{display:'block'}}>
        {Array.from({length:24}, (_, i) => (
          <text key={i} x={ml + i * cw + cw / 2} y={mt - 10} textAnchor="middle" fontSize={10} style={{fill:'var(--color-text-tertiary)'}}>
            {i === 0 ? '12a' : i === 6 ? '6a' : i === 12 ? '12p' : i === 18 ? '6p' : i === 21 ? '9p' : i % 3 === 0 ? i : ''}
          </text>
        ))}
        {DAYS_LABEL.map((d, i) => (
          <text key={d} x={ml - 8} y={mt + i * ch + ch / 2 + 4} textAnchor="end" fontSize={11} style={{fill:'var(--color-text-secondary)'}}>
            {d}
          </text>
        ))}
        {HM.map((d, i) => (
          <rect
            key={i}
            x={ml + d.hour * cw + 1}
            y={mt + d.dow * ch + 1}
            width={cw - 2}
            height={ch - 2}
            rx={5}
            fill={getColor(d.avg_kwh, maxV)}
            opacity={tip && tip !== d ? 0.4 : 1}
            style={{cursor:'default',transition:'opacity 0.12s'}}
            onMouseEnter={() => setTip(d)}
            onMouseLeave={() => setTip(null)}
          />
        ))}
        <text x={ml} y={mt + 7 * ch + 26} fontSize={10} style={{fill:'var(--color-text-tertiary)'}}>Low</text>
        {[0, 0.17, 0.34, 0.51, 0.68, 0.85, 1].map((t, i) => (
          <rect key={i} x={ml + 32 + i * 20} y={mt + 7 * ch + 14} width={18} height={12} rx={3} fill={getColor(t * maxV, maxV)}/>
        ))}
        <text x={ml + 178} y={mt + 7 * ch + 26} fontSize={10} style={{fill:'var(--color-text-tertiary)'}}>High</text>
      </svg>
      {tip && (
        <div style={{position:'absolute',top:10,right:10,background:'var(--color-background-primary)',border:'0.5px solid var(--color-border-secondary)',borderRadius:'var(--border-radius-lg)',padding:'10px 16px',fontSize:13,lineHeight:1.6,pointerEvents:'none'}}>
          <div style={{fontWeight:500,marginBottom:2}}>{DAYS_LABEL[tip.dow]} {tip.hour}:00–{tip.hour + 1}:00</div>
          <div><span style={{color:CL.offpeak,fontWeight:500}}>{(tip.avg_kwh * 2).toFixed(1)} kWh/h</span> avg draw</div>
          <div style={{fontSize:11,color:'var(--color-text-tertiary)'}}>{tip.dow >= 5 || tip.hour >= 21 || tip.hour < 6 ? 'Off-peak rate' : 'Peak rate'}</div>
        </div>
      )}
    </div>
  );
}
