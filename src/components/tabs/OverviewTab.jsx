import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Stat from "../Stat.jsx";
import Legend from "../Legend.jsx";
import SectionTitle from "../SectionTitle.jsx";
import { S, EV, M } from "../../data/index.js";
import { CL, fmt$, monthLabel, ttStyle } from "../../utils/index.js";

export default function OverviewTab({ mChart }) {
  const fullMonths = M.filter(x => x.days >= 27);
  const peakMo = fullMonths.reduce((a, b) => a.total_kwh > b.total_kwh ? a : b);
  const lowMo  = fullMonths.reduce((a, b) => a.total_kwh < b.total_kwh ? a : b);

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(145px, 1fr))',gap:10,marginBottom:28}}>
        <Stat label="Total usage"     value={(S.total_kwh / 1000).toFixed(1) + 'k'}  sub="kWh over 12 months"/>
        <Stat label="Total cost"      value={fmt$(S.total_cost)}                       sub={fmt$(S.avg_daily_cost) + '/day average'}/>
        <Stat label="Daily average"   value={Math.round(S.avg_daily_kwh) + ' kWh'}    sub={(S.avg_daily_kwh / 24).toFixed(1) + ' kW avg load'}/>
        <Stat label="EV share (actual)" value={Math.round(EV.ev_pct) + '%'}           sub={(EV.ev_kwh / 1000).toFixed(1) + 'k kWh via TeslaFi'} color={CL.haruki}/>
      </div>

      <SectionTitle>Monthly usage</SectionTitle>
      <Legend items={[[CL.peak, 'Peak (6am–9pm wkdays)'], [CL.offpeak, 'Off-peak']]}/>
      <div style={{width:'100%',height:300,marginBottom:16}}>
        <ResponsiveContainer>
          <BarChart data={mChart} barCategoryGap="18%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
            <XAxis dataKey="name" tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}/>
            <Tooltip contentStyle={ttStyle} formatter={(v, n) => [v.toLocaleString() + ' kWh', n === 'peak' ? 'Peak' : 'Off-peak']}/>
            <Bar dataKey="peak"    stackId="a" fill={CL.peak}/>
            <Bar dataKey="offpeak" stackId="a" fill={CL.offpeak} radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Stat label="Peak month"         value={monthLabel(peakMo.month)} sub={Math.round(peakMo.total_kwh).toLocaleString() + ' kWh · ' + fmt$(peakMo.total_incl)}/>
        <Stat label="Lowest full month"  value={monthLabel(lowMo.month)}  sub={Math.round(lowMo.total_kwh).toLocaleString()  + ' kWh · ' + fmt$(lowMo.total_incl)}/>
      </div>
    </>
  );
}
