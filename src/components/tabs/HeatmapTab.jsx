import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Stat from "../Stat.jsx";
import Legend from "../Legend.jsx";
import SectionTitle from "../SectionTitle.jsx";
import HeatmapGrid from "../HeatmapGrid.jsx";
import { PR } from "../../data/index.js";
import { CL, ttStyle } from "../../utils/index.js";

export default function HeatmapTab({ profileChart }) {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:28}}>
        <Stat label="Weekday 9pm spike" value={PR[21].weekday_avg.toFixed(1) + ' kWh/h'} sub="Both Teslas charging at off-peak boundary" color={CL.haruki}/>
        <Stat label="Weekend evening"   value={PR[17].weekend_avg.toFixed(1) + ' kWh/h'} sub="5–7pm cooking + household peak" color="#D85A30"/>
      </div>

      <SectionTitle>Average usage by hour and day</SectionTitle>
      <div style={{fontSize:12,color:'var(--color-text-tertiary)',marginBottom:14}}>Full year of half-hourly smart meter data · hover for detail</div>
      <HeatmapGrid/>

      <div style={{marginTop:32}}>
        <SectionTitle>Weekday vs weekend load profile</SectionTitle>
        <Legend items={[[CL.peak, 'Weekday avg'], ['#D85A30', 'Weekend avg']]}/>
        <div style={{width:'100%',height:260}}>
          <ResponsiveContainer>
            <AreaChart data={profileChart}>
              <defs>
                <linearGradient id="gWd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={CL.peak}  stopOpacity={0.18}/>
                  <stop offset="100%" stopColor={CL.peak}  stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gWe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#D85A30" stopOpacity={0.12}/>
                  <stop offset="100%" stopColor="#D85A30" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
              <XAxis dataKey="name" tick={{fontSize:10,fill:'#888'}} axisLine={false} tickLine={false} interval={2}/>
              <YAxis tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle} formatter={(v, n) => [v + ' kWh/h', n === 'weekday' ? 'Weekday' : 'Weekend']}/>
              <Area type="monotone" dataKey="weekday" stroke={CL.peak}    strokeWidth={2.5} fill="url(#gWd)"/>
              <Area type="monotone" dataKey="weekend" stroke="#D85A30"    strokeWidth={2}   strokeDasharray="6 3" fill="url(#gWe)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{fontSize:12,color:'var(--color-text-tertiary)',marginTop:6,lineHeight:1.5}}>
          The weekday 9pm spike is Haruki and Haku both starting their charge cycle right at the off-peak boundary. Weekends show a flatter, more even household profile with an evening peak around 5–7pm.
        </div>
      </div>
    </>
  );
}
