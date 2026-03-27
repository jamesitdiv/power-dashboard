import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Stat from "../Stat.jsx";
import Legend from "../Legend.jsx";
import SectionTitle from "../SectionTitle.jsx";
import { EV, M } from "../../data/index.js";
import { CL, fmt$, monthLabel, ttStyle } from "../../utils/index.js";

export default function EVTab({ mChart }) {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(145px, 1fr))',gap:10,marginBottom:28}}>
        <Stat label="Haruki"   value={(EV.haruki_kwh / 1000).toFixed(1) + 'k kWh'} sub="Your Tesla · from Jun '25"  color={CL.haruki}/>
        <Stat label="Haku"     value={(EV.haku_kwh   / 1000).toFixed(1) + 'k kWh'} sub="Danni's Tesla · full year"  color={CL.haku}/>
        <Stat label="Total EV" value={(EV.ev_kwh      / 1000).toFixed(1) + 'k kWh'} sub={Math.round(EV.ev_pct) + '% of consumption'}/>
        <Stat label="EV cost"  value={fmt$(EV.ev_cost)}                              sub="All off-peak @ 15.2c"      color={CL.haruki}/>
      </div>

      <SectionTitle>Monthly charging — Haruki vs Haku</SectionTitle>
      <Legend items={[[CL.haruki, 'Haruki (yours)'], [CL.haku, "Haku (Danni's)"], [CL.house, 'Household']]}/>
      <div style={{width:'100%',height:320,marginBottom:16}}>
        <ResponsiveContainer>
          <BarChart data={mChart} barCategoryGap="18%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
            <XAxis dataKey="name" tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}/>
            <Tooltip contentStyle={ttStyle} formatter={(v, n) => [v.toLocaleString() + ' kWh', n === 'haruki' ? 'Haruki' : n === 'haku' ? 'Haku' : 'Household']}/>
            <Bar dataKey="haruki" stackId="a" fill={CL.haruki}/>
            <Bar dataKey="haku"   stackId="a" fill={CL.haku}/>
            <Bar dataKey="house"  stackId="a" fill={CL.house} radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <SectionTitle>Per-car breakdown</SectionTitle>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',fontSize:12,borderCollapse:'collapse',minWidth:520}}>
          <thead>
            <tr style={{borderBottom:'0.5px solid var(--color-border-secondary)'}}>
              {['Month','Haruki','Haku','EV total','Household','EV %'].map(h => (
                <td key={h} style={{padding:'10px 10px',color:'var(--color-text-tertiary)',fontWeight:500,textAlign:h==='Month'?'left':'right',fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em'}}>{h}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {M.map(d => {
              const pct = Math.round(d.ev / d.total_kwh * 100);
              return (
                <tr key={d.month} style={{borderBottom:'0.5px solid var(--color-border-tertiary)'}}>
                  <td style={{padding:'10px 10px',fontWeight:500}}>{monthLabel(d.month)}</td>
                  <td style={{padding:'10px 10px',textAlign:'right',color:CL.haruki,fontVariantNumeric:'tabular-nums'}}>{Math.round(d.haruki) || '–'}</td>
                  <td style={{padding:'10px 10px',textAlign:'right',color:CL.haku,fontVariantNumeric:'tabular-nums'}}>{Math.round(d.haku)}</td>
                  <td style={{padding:'10px 10px',textAlign:'right',fontWeight:500,fontVariantNumeric:'tabular-nums'}}>{Math.round(d.ev)}</td>
                  <td style={{padding:'10px 10px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{Math.round(d.household)}</td>
                  <td style={{padding:'10px 10px',textAlign:'right'}}>
                    <span style={{display:'inline-block',width:48,height:6,borderRadius:3,background:'var(--color-border-tertiary)',position:'relative',verticalAlign:'middle',marginRight:6}}>
                      <span style={{position:'absolute',left:0,top:0,height:6,borderRadius:3,background:CL.haruki,width:`${Math.min(pct, 100)}%`}}/>
                    </span>
                    <span style={{fontSize:11,color:'var(--color-text-tertiary)',fontVariantNumeric:'tabular-nums'}}>{pct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{background:'var(--color-background-secondary)',borderRadius:'var(--border-radius-lg)',padding:'14px 20px',marginTop:16,fontSize:12,color:'var(--color-text-secondary)',lineHeight:1.7}}>
        Data sourced from TeslaFi charge logs — these are actual kWh drawn from the wall, not battery-side. Haruki's data starts Jun 2025 (when TeslaFi was set up). Before Jul, only Haku appears. All home charging occurs during off-peak hours at 15.2c/kWh + GST.
      </div>
    </>
  );
}
