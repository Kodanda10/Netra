export const mockBharat = [
  { id:'in-1', title:'RBI policy hints at extended pause; liquidity tweaks aid banks', summary:'Bond yields eased after guidance signalled a longer pause while liquidity steps aim to compress term premia.', url:'#', source:'Mint', publishedAt:'2025-08-10T09:10:00Z' },
  { id:'in-2', title:'Centre eyes infra push via NIIF; logistics costs seen easing', summary:'Pipeline targets freight corridors and warehousing efficiency to lower logistics costs by 2–3ppt over 3 years.', url:'#', source:'Business Standard', publishedAt:'2025-08-10T07:20:00Z' },
  { id:'in-3', title:'Rupee steady as DXY cools; RBI presence keeps range intact', summary:'FX traders flagged two-way flows with RBI smoothing; importers covered near day’s lows.', url:'#', source:'ET Markets', publishedAt:'2025-08-10T06:10:00Z' },
  { id:'in-4', title:'Record GST collections buoy states; input-credit audits tighten', summary:'Revenue buoyancy offsets capex rollover; compliance drives widen base across MSMEs.', url:'#', source:'Mint', publishedAt:'2025-08-10T05:30:00Z' },
  { id:'in-5', title:'Bank credit expands 13.8% YoY; NBFC funding costs edge lower', summary:'Spreads narrowed as system liquidity improved; securitisation volumes up QoQ.', url:'#', source:'Financial Express', publishedAt:'2025-08-10T04:10:00Z' },
] as const

export const mockChhattisgarh = [
  { id:'cg-1', title:'Raipur clears ₹1,200 cr steel investments under revised policy', summary:'State cabinet approved proposals with MSME employment targets and downstream incentives.', url:'#', source:'Business Standard', publishedAt:'2025-08-10T06:45:00Z' },
  { id:'cg-2', title:'Dhamtari industrial cluster gets logistics park nod', summary:'Greenfield park to anchor metal downstream; single-window clearances promised.', url:'#', source:'ET Bureau', publishedAt:'2025-08-10T05:10:00Z' },
] as const

export const mockStates: Record<string, typeof mockChhattisgarh> = {
  chhattisgarh: mockChhattisgarh,
  maharashtra: [
    { id:'mh-1', title:'Pune EV supplier expands; 1,600 jobs planned', summary:'Tier-2 vendor to commission gigacasting line with export focus.', url:'#', source:'Mint', publishedAt:'2025-08-10T04:20:00Z' },
    { id:'mh-2', title:'Mumbai IFSC push gains pace; fund registrations rise', summary:'Regulatory sandbox draws alt managers; infra desk approvals climb.', url:'#', source:'BS', publishedAt:'2025-08-10T03:40:00Z' },
  ],
  'uttar-pradesh': [
    { id:'up-1', title:'Noida data centre capex accelerates with new policy', summary:'DfA reduces stamp duty; captive renewables in scope.', url:'#', source:'ET', publishedAt:'2025-08-10T02:50:00Z' },
    { id:'up-2', title:'Agra leather cluster readies ZLD retrofit', summary:'Credit window opened; export certification support extended.', url:'#', source:'FE', publishedAt:'2025-08-10T02:10:00Z' },
  ],
}

