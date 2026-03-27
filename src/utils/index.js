export const MSH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAYS_LABEL = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export const CL = {
  peak: '#5b8dd9',
  offpeak: '#34c79b',
  haruki: '#34c79b',
  haku: '#7c5dd6',
  house: '#5b8dd9',
  fixed: '#94928b',
  accent: '#8DC63F',
};

export const fmt$ = n => '$' + Math.round(n).toLocaleString();

export const monthLabel = m =>
  MSH[parseInt(m.split('-')[1]) - 1] + " '" + m.split('-')[0].slice(2);

export const ttStyle = {
  backgroundColor: 'var(--color-background-primary)',
  border: '0.5px solid var(--color-border-secondary)',
  borderRadius: 10,
  fontSize: 12,
  padding: '10px 14px',
  lineHeight: 1.7,
};
