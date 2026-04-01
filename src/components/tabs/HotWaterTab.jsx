import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line, ComposedChart } from "recharts";
import Stat        from "../Stat.jsx";
import Legend      from "../Legend.jsx";
import SectionTitle from "../SectionTitle.jsx";
import { HW, M }  from "../../data/index.js";
import { CL, fmt$, monthLabel, ttStyle } from "../../utils/index.js";

const HW_COLOR  = '#E87B35';
const HW_COLOR2 = '#f0a96e';

const ANNUAL_KWH       = HW.reduce((s, d) => s + d.kwh, 0);
const ANNUAL_BLENDED   = HW.reduce((s, d) => s + d.blended_cost, 0);
const ANNUAL_OFFPEAK   = HW.reduce((s, d) => s + d.offpeak_cost, 0);
const ANNUAL_PEAK      = HW.reduce((s, d) => s + d.peak_cost, 0);
const AVG_DAILY        = Math.round(ANNUAL_KWH / HW.reduce((s, d) => s + d.days, 0) * 10) / 10;
const HOUSEHOLD_TOTAL  = M.reduce((s, d) => s + d.household, 0);
const HW_PCT           = Math.round(ANNUAL_KWH / HOUSEHOLD_TOTAL * 100);

// Heat pump water heater: ~3× more efficient
const HP_ANNUAL_KWH    = Math.round(ANNUAL_KWH / 3);
const HP_ANNUAL_COST   = Math.round(HP_ANNUAL_KWH * 0.152 * 1.15); // all off-peak
const HP_SAVING        = Math.round(ANNUAL_BLENDED - HP_ANNUAL_COST);

export default function HotWaterTab() {
  const chart = useMemo(() => HW.map(d => {
    const mo = M.find(m => m.month === d.month);
    const other = mo ? Math.round(mo.household - d.kwh) : 0;
    return {
      name:     monthLabel(d.month),
      hw:       d.kwh,
      other:    other,
      blended:  d.blended_cost,
      offpeak:  d.offpeak_cost,
      daily:    d.kwh_day,
    };
  }), []);

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(145px, 1fr))',gap:10,marginBottom:28}}>
        <Stat label="Est. annual HW"   value={ANNUAL_KWH.toLocaleString()+' kWh'} sub={'~'+AVG_DAILY+' kWh/day average'} color={HW_COLOR}/>
        <Stat label="Est. annual cost" value={fmt$(ANNUAL_BLENDED)}               sub="Blended tariff (60% off-peak)"/>
        <Stat label="Share of household" value={HW_PCT+'%'}                       sub="Of non-EV consumption"/>
        <Stat label="Heat pump saving"  value={fmt$(HP_SAVING)+'/yr'}             sub={'~$3k install · '+Math.round(3000/HP_SAVING)+' yr payback'} color={CL.offpeak}/>
      </div>

      <SectionTitle>Hot water vs rest of household — monthly kWh</SectionTitle>
      <Legend items={[[HW_COLOR,'Est. hot water'],[CL.house,'Other household']]}/>
      <div style={{width:'100%',height:300,marginBottom:20}}>
        <ResponsiveContainer>
          <BarChart data={chart} barCategoryGap="18%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
            <XAxis dataKey="name" tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?(v/1000).toFixed(1)+'k':v}/>
            <Tooltip contentStyle={ttStyle} formatter={(v,n)=>[v.toLocaleString()+' kWh', n==='hw'?'Hot water':'Other household']}/>
            <Bar dataKey="hw"    stackId="a" fill={HW_COLOR}/>
            <Bar dataKey="other" stackId="a" fill={CL.house} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <SectionTitle>Daily hot water kWh — seasonal curve</SectionTitle>
      <div style={{width:'100%',height:220,marginBottom:24}}>
        <ResponsiveContainer>
          <ComposedChart data={chart}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
            <XAxis dataKey="name" tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#888'}} axisLine={false} tickLine={false} domain={[0,16]} tickFormatter={v=>v+' kWh'}/>
            <Tooltip contentStyle={ttStyle} formatter={(v)=>[v+' kWh/day','Daily average']}/>
            <Bar dataKey="daily" fill={HW_COLOR} opacity={0.25} radius={[3,3,0,0]}/>
            <Line type="monotone" dataKey="daily" stroke={HW_COLOR} strokeWidth={2.5} dot={{r:3,fill:HW_COLOR}} activeDot={{r:5}}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <SectionTitle>Tariff scenario comparison</SectionTitle>
      <div style={{background:'var(--color-background-secondary)',borderRadius:'var(--border-radius-lg)',padding:'16px 20px',marginBottom:16}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:'10px 24px',fontSize:13,alignItems:'center'}}>
          <span style={{fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em',color:'var(--color-text-tertiary)',fontWeight:500}}>Scenario</span>
          <span style={{fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em',color:'var(--color-text-tertiary)',fontWeight:500,textAlign:'right'}}>Annual kWh</span>
          <span style={{fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em',color:'var(--color-text-tertiary)',fontWeight:500,textAlign:'right'}}>Annual cost</span>
          <span style={{fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em',color:'var(--color-text-tertiary)',fontWeight:500,textAlign:'right'}}>vs blended</span>

          <span>Resistive — all off-peak (ripple control)</span>
          <span style={{textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{ANNUAL_KWH.toLocaleString()}</span>
          <span style={{textAlign:'right',color:CL.offpeak,fontWeight:500,fontVariantNumeric:'tabular-nums'}}>{fmt$(ANNUAL_OFFPEAK)}</span>
          <span style={{textAlign:'right',color:CL.offpeak,fontVariantNumeric:'tabular-nums'}}>−{fmt$(ANNUAL_BLENDED-ANNUAL_OFFPEAK)}</span>

          <span style={{fontWeight:500}}>Resistive — blended (est. current)</span>
          <span style={{textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{ANNUAL_KWH.toLocaleString()}</span>
          <span style={{textAlign:'right',fontWeight:500,fontVariantNumeric:'tabular-nums'}}>{fmt$(ANNUAL_BLENDED)}</span>
          <span style={{textAlign:'right',color:'var(--color-text-tertiary)'}}>baseline</span>

          <span>Resistive — all peak</span>
          <span style={{textAlign:'right',fontVariantNumeric:'tabular-nums'}}>{ANNUAL_KWH.toLocaleString()}</span>
          <span style={{textAlign:'right',color:'#E05252',fontVariantNumeric:'tabular-nums'}}>{fmt$(ANNUAL_PEAK)}</span>
          <span style={{textAlign:'right',color:'#E05252',fontVariantNumeric:'tabular-nums'}}>+{fmt$(ANNUAL_PEAK-ANNUAL_BLENDED)}</span>

          <span>Heat pump water heater (3× COP, off-peak)</span>
          <span style={{textAlign:'right',color:CL.offpeak,fontVariantNumeric:'tabular-nums'}}>{HP_ANNUAL_KWH.toLocaleString()}</span>
          <span style={{textAlign:'right',color:CL.offpeak,fontWeight:500,fontVariantNumeric:'tabular-nums'}}>{fmt$(HP_ANNUAL_COST)}</span>
          <span style={{textAlign:'right',color:CL.offpeak,fontVariantNumeric:'tabular-nums'}}>−{fmt$(HP_SAVING)}</span>
        </div>
      </div>

      <div style={{background:'var(--color-background-secondary)',borderRadius:'var(--border-radius-lg)',padding:'14px 20px',fontSize:12,color:'var(--color-text-secondary)',lineHeight:1.7}}>
        <strong style={{color:'var(--color-text-primary)'}}>Methodology —</strong> estimates based on NZ avg 10 kWh/day for a 2-person household, scaled month-by-month for Auckland mains water temperature (colder in winter = more energy to heat). Blended tariff assumes 60% off-peak / 40% peak heating. Your actual usage may differ — a clamp meter on the cylinder circuit or a smart plug would give exact figures. Heat pump saving assumes a 3-star HPWH (COP ~3.0) running entirely on off-peak power.
      </div>
    </>
  );
}
