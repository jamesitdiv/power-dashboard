import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Stat from "../Stat.jsx";
import Legend from "../Legend.jsx";
import SectionTitle from "../SectionTitle.jsx";
import { M } from "../../data/index.js";
import { CL, fmt$, monthLabel, ttStyle } from "../../utils/index.js";

export default function SeasonalTab({ mChart }) {
  const winterAvg = Math.round(
    M.filter(d => ['06','07','08'].includes(d.month.split('-')[1]))
     .reduce((s, d) => s + d.total_kwh, 0) / 3
  );
  const summerAvg = Math.round(
    M.filter(d => ['12','01','02'].includes(d.month.split('-')[1]))
     .reduce((s, d) => s + d.total_kwh, 0) / 3
  );

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:28}}>
        <Stat label="Winter avg (Jun–Aug)" value={winterAvg.toLocaleString() + ' kWh/mo'} sub="Heating + darker days"/>
        <Stat label="Summer avg (Dec–Feb)" value={summerAvg.toLocaleString() + ' kWh/mo'} sub="Lower baseline"/>
      </div>

      <SectionTitle>Seasonal trend with EV overlay</SectionTitle>
      <Legend items={[[CL.house, 'Household'], [CL.haruki, 'Haruki'], [CL.haku, 'Haku']]}/>
      <div style={{width:'100%',height:320,marginBottom:16}}>
        <ResponsiveContainer>
          <BarChart data={mChart} barCategoryGap="18%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
            <XAxis dataKey="name" tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}/>
            <Tooltip contentStyle={ttStyle} formatter={(v, n) => [v.toLocaleString() + ' kWh', n === 'house' ? 'Household' : n === 'haruki' ? 'Haruki' : 'Haku']}/>
            <Bar dataKey="house"  stackId="a" fill={CL.house}/>
            <Bar dataKey="haruki" stackId="a" fill={CL.haruki}/>
            <Bar dataKey="haku"   stackId="a" fill={CL.haku} radius={[4, 4, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <SectionTitle>Month by month</SectionTitle>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',fontSize:12,borderCollapse:'collapse',minWidth:520}}>
          <thead>
            <tr style={{borderBottom:'0.5px solid var(--color-border-secondary)'}}>
              {['Month','Total kWh','Cost','kWh/day','EV kWh','House kWh','EV %'].map(h => (
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
                  <td style={{padding:'10px 10px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{Math.round(d.total_kwh).toLocaleString()}</td>
                  <td style={{padding:'10px 10px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{fmt$(d.total_incl)}</td>
                  <td style={{padding:'10px 10px',textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{Math.round(d.total_kwh / d.days)}</td>
                  <td style={{padding:'10px 10px',textAlign:'right',color:CL.haruki,fontVariantNumeric:'tabular-nums'}}>{Math.round(d.ev)}</td>
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
    </>
  );
}
