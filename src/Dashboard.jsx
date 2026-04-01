import { useState, useMemo } from "react";
import OverviewTab  from "./components/tabs/OverviewTab.jsx";
import CostsTab     from "./components/tabs/CostsTab.jsx";
import HeatmapTab   from "./components/tabs/HeatmapTab.jsx";
import EVTab        from "./components/tabs/EVTab.jsx";
import SeasonalTab  from "./components/tabs/SeasonalTab.jsx";
import HotWaterTab  from "./components/tabs/HotWaterTab.jsx";
import { M, PR }    from "./data/index.js";
import { CL, monthLabel } from "./utils/index.js";

const TABS = [
  ['overview', 'Overview'],
  ['costs',    'Costs'],
  ['heatmap',  'Heatmap'],
  ['ev',       'EV charging'],
  ['seasonal', 'Seasonal'],
  ['hotwater', 'Hot water'],
];

export default function Dashboard() {
  const [tab, setTab] = useState('overview');

  const mChart = useMemo(() => M.map(d => ({
    name:        monthLabel(d.month),
    peak:        Math.round(d.peak_kwh),
    offpeak:     Math.round(d.offpeak_kwh),
    total:       Math.round(d.total_kwh),
    cost:        Math.round(d.total_incl),
    haruki:      Math.round(d.haruki),
    haku:        Math.round(d.haku),
    ev:          Math.round(d.ev),
    house:       Math.round(d.household),
    peakCost:    Math.round(d.peak_cost    * 1.15),
    offpeakCost: Math.round(d.offpeak_cost * 1.15),
    fixedCost:   Math.round((d.daily_cost + d.total_kwh * 0.0019) * 1.15),
  })), []);

  const profileChart = useMemo(() => PR.map(d => ({
    name:    `${d.hour}:00`,
    weekday: Math.round(d.weekday_avg * 10) / 10,
    weekend: Math.round(d.weekend_avg * 10) / 10,
  })), []);

  return (
    <div style={{padding:'0.5rem 0'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:10,flexWrap:'wrap',marginBottom:2}}>
        <span style={{fontSize:11,letterSpacing:'0.06em',textTransform:'uppercase',color:CL.accent,fontWeight:500}}>3 Verdeco Boulevard</span>
        <span style={{fontSize:11,color:'var(--color-text-tertiary)'}}>ICP 0007193552RN51D</span>
      </div>
      <div style={{fontSize:22,fontWeight:500,letterSpacing:'-0.02em',marginBottom:2}}>Power consumption</div>
      <div style={{fontSize:13,color:'var(--color-text-tertiary)',marginBottom:22}}>23 Mar 2025 – 21 Mar 2026 · TeslaFi verified</div>

      <div style={{display:'flex',gap:4,marginBottom:28,flexWrap:'wrap',borderBottom:'0.5px solid var(--color-border-tertiary)',paddingBottom:2}}>
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding:'8px 16px',
              fontSize:13,
              fontWeight: tab === id ? 500 : 400,
              cursor:'pointer',
              borderRadius:'var(--border-radius-md) var(--border-radius-md) 0 0',
              border:       tab === id ? '0.5px solid var(--color-border-tertiary)' : '0.5px solid transparent',
              borderBottom: tab === id ? '0.5px solid var(--color-background-primary)' : 'none',
              background:   tab === id ? 'var(--color-background-primary)' : 'transparent',
              color:        tab === id ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              marginBottom: -3,
              position:'relative',
              zIndex: tab === id ? 1 : 0,
              transition:'color 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview'  && <OverviewTab  mChart={mChart}/>}
      {tab === 'costs'     && <CostsTab     mChart={mChart}/>}
      {tab === 'heatmap'   && <HeatmapTab   profileChart={profileChart}/>}
      {tab === 'ev'        && <EVTab        mChart={mChart}/>}
      {tab === 'seasonal'  && <SeasonalTab  mChart={mChart}/>}
      {tab === 'hotwater'  && <HotWaterTab/>}
    </div>
  );
}
