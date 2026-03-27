import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Stat from "../Stat.jsx";
import Legend from "../Legend.jsx";
import SectionTitle from "../SectionTitle.jsx";
import { S, M } from "../../data/index.js";
import { CL, fmt$, ttStyle } from "../../utils/index.js";

export default function CostsTab({ mChart }) {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(145px, 1fr))',gap:10,marginBottom:28}}>
        <Stat label="Annual total"      value={fmt$(S.total_cost)}                                             sub="Including 15% GST"/>
        <Stat label="Peak charges"      value={fmt$(M.reduce((s, d) => s + d.peak_cost,    0) * 1.15)}        sub={(S.peak_rate    * 100).toFixed(1) + 'c/kWh'} color={CL.peak}/>
        <Stat label="Off-peak charges"  value={fmt$(M.reduce((s, d) => s + d.offpeak_cost, 0) * 1.15)}        sub={(S.offpeak_rate * 100).toFixed(1) + 'c/kWh'} color={CL.offpeak}/>
        <Stat label="Fixed charges"     value={fmt$(M.reduce((s, d) => s + d.daily_cost,   0) * 1.15)}        sub={'$' + S.daily_charge.toFixed(2) + '/day + levy'}/>
      </div>

      <SectionTitle>Monthly cost breakdown</SectionTitle>
      <Legend items={[[CL.peak, 'Peak'], [CL.offpeak, 'Off-peak'], [CL.fixed, 'Fixed + levy']]}/>
      <div style={{width:'100%',height:300,marginBottom:16}}>
        <ResponsiveContainer>
          <BarChart data={mChart} barCategoryGap="18%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
            <XAxis dataKey="name" tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false} tickFormatter={v => '$' + v}/>
            <Tooltip contentStyle={ttStyle} formatter={(v, n) => ['$' + v, n === 'peakCost' ? 'Peak' : n === 'offpeakCost' ? 'Off-peak' : 'Fixed']}/>
            <Bar dataKey="peakCost"    stackId="a" fill={CL.peak}/>
            <Bar dataKey="offpeakCost" stackId="a" fill={CL.offpeak}/>
            <Bar dataKey="fixedCost"   stackId="a" fill={CL.fixed} radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{background:'var(--color-background-secondary)',borderRadius:'var(--border-radius-lg)',padding:'16px 20px'}}>
        <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em',color:'var(--color-text-tertiary)',marginBottom:12,fontWeight:500}}>Rate structure — Contact Energy</div>
        <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto 1fr',gap:'8px 24px',fontSize:13}}>
          <span style={{color:'var(--color-text-tertiary)'}}>Peak</span>     <span style={{fontWeight:500}}>34.6c/kWh</span>
          <span style={{color:'var(--color-text-tertiary)'}}>Hours</span>    <span>6am–9pm weekdays</span>
          <span style={{color:'var(--color-text-tertiary)'}}>Off-peak</span> <span style={{fontWeight:500}}>15.2c/kWh</span>
          <span style={{color:'var(--color-text-tertiary)'}}>Hours</span>    <span>9pm–6am + weekends</span>
          <span style={{color:'var(--color-text-tertiary)'}}>Daily</span>    <span style={{fontWeight:500}}>$1.80</span>
          <span style={{color:'var(--color-text-tertiary)'}}>Levy</span>     <span>0.19c/kWh</span>
        </div>
      </div>
    </>
  );
}
