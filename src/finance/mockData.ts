export const mockBharatEn = [
  { id:'in-1', title:'RBI policy hints at extended pause; liquidity tweaks aid banks', summary:'Bond yields eased after guidance signalled a longer pause while liquidity steps aim to compress term premia.', url:'#', source:'Mint', publishedAt:'2025-08-10T09:10:00Z' },
  { id:'in-2', title:'Centre eyes infra push via NIIF; logistics costs seen easing', summary:'Pipeline targets freight corridors and warehousing efficiency to lower logistics costs by 2–3ppt over 3 years.', url:'#', source:'Business Standard', publishedAt:'2025-08-10T07:20:00Z' },
  { id:'in-3', title:'Rupee steady as DXY cools; RBI presence keeps range intact', summary:'FX traders flagged two-way flows with RBI smoothing; importers covered near day’s lows.', url:'#', source:'ET Markets', publishedAt:'2025-08-10T06:10:00Z' },
  { id:'in-4', title:'Record GST collections buoy states; input-credit audits tighten', summary:'Revenue buoyancy offsets capex rollover; compliance drives widen base across MSMEs.', url:'#', source:'Mint', publishedAt:'2025-08-10T05:30:00Z' },
  { id:'in-5', title:'Bank credit expands 13.8% YoY; NBFC funding costs edge lower', summary:'Spreads narrowed as system liquidity improved; securitisation volumes up QoQ.', url:'#', source:'Financial Express', publishedAt:'2025-08-10T04:10:00Z' },
] as const

export const mockBharatHi = [
  { id:'in-1', title:'आरबीआई ने नीतिगत विराम के संकेत दिए; तरलता उपायों से बैंकों को सहारा', summary:'बॉन्ड यील्ड्स नरम रहीं; तरलता कदमों से टर्म प्रीमिया दबाने का संकेत।', url:'#', source:'Mint', publishedAt:'2025-08-10T09:10:00Z' },
  { id:'in-2', title:'एनआईआईएफ के जरिए इंफ्रा पुश; लॉजिस्टिक लागत 2–3% घटाने का लक्ष्य', summary:'फ्रेट कॉरिडोर और वेयरहाउसिंग दक्षता से अगले 3 वर्षों में लागत घटाने की योजना।', url:'#', source:'Business Standard', publishedAt:'2025-08-10T07:20:00Z' },
  { id:'in-3', title:'डीएक्सवाई शांत; आरबीआई उपस्थिति से रुपये की रेंज स्थिर', summary:'एफएक्स कारोबारियों ने दो-तरफ़ा फ्लो का संकेत दिया; आयातकों ने लो पर कवर किया।', url:'#', source:'ET Markets', publishedAt:'2025-08-10T06:10:00Z' },
  { id:'in-4', title:'जीएसटी कलेक्शन मजबूत; इनपुट-क्रेडिट ऑडिट सख़्त', summary:'राजस्व मजबूती से कैपेक्स सपोर्ट; कंप्लायंस ड्राइव से एमएसएमई बेस चौड़ा।', url:'#', source:'Mint', publishedAt:'2025-08-10T05:30:00Z' },
  { id:'in-5', title:'बैंक क्रेडिट 13.8% YoY; एनबीएफसी फंडिंग लागत थोड़ी कम', summary:'लिक्विडिटी बेहतर; स्प्रेड संकुचित; सेक्युरिटाइजेशन वॉल्यूम ऊपर।', url:'#', source:'Financial Express', publishedAt:'2025-08-10T04:10:00Z' },
] as const

export const mockChhattisgarh = [
  { id:'cg-1', title:'Raipur clears ₹1,200 cr steel investments under revised policy', summary:'State cabinet approved proposals with MSME employment targets and downstream incentives.', url:'#', source:'Business Standard', publishedAt:'2025-08-10T06:45:00Z' },
  { id:'cg-2', title:'Dhamtari industrial cluster gets logistics park nod', summary:'Greenfield park to anchor metal downstream; single-window clearances promised.', url:'#', source:'ET Bureau', publishedAt:'2025-08-10T05:10:00Z' },
] as const

export const mockStatesEn: Record<string, typeof mockChhattisgarh> = {
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

export const mockChhattisgarhHi = [
  { id:'cg-1', title:'धमतरी इंडस्ट्रियल क्लस्टर को लॉजिस्टिक्स पार्क की मंजूरी', summary:'ग्रीनफ़ील्ड पार्क मेटल डाउनस्ट्रीम को एंकर करेगा; सिंगल-विंडो क्लीयरेंस।', url:'#', source:'ET Bureau', publishedAt:'2025-08-10T05:10:00Z' },
  { id:'cg-2', title:'रायपुर में ₹1,200 करोड़ के स्टील निवेश को स्वीकृति', summary:'एमएसएमई रोजगार लक्ष्य और डाउनस्ट्रीम इंसेंटिव के साथ प्रस्ताव मंज़ूर।', url:'#', source:'Business Standard', publishedAt:'2025-08-10T06:45:00Z' },
] as const

export const mockStatesHi: Record<string, typeof mockChhattisgarhHi> = {
  chhattisgarh: mockChhattisgarhHi,
  maharashtra: [
    { id:'mh-1', title:'पुणे ईवी सप्लायर का विस्तार; 1,600 नौकरियां', summary:'गिगाकास्टिंग लाइन के साथ निर्यात पर फोकस।', url:'#', source:'Mint', publishedAt:'2025-08-10T04:20:00Z' },
    { id:'mh-2', title:'मुंबई आईएफएससी को गति; फंड रजिस्ट्रेशन में वृद्धि', summary:'रेगुलेटरी सैंडबॉक्स से अल्ट मैनेजर आकर्षित; इंफ्रा डेस्क अनुमोदन बढ़े।', url:'#', source:'BS', publishedAt:'2025-08-10T03:40:00Z' },
  ],
  'uttar-pradesh': [
    { id:'up-1', title:'नोएडा डेटा सेंटर कैपेक्स तेज; नई नीति से बढ़त', summary:'डीएफए ने स्टाम्प ड्यूटी कम की; कैप्टिव रिन्यूएबल्स की अनुमति।', url:'#', source:'ET', publishedAt:'2025-08-10T02:50:00Z' },
    { id:'up-2', title:'आगरा लेदर क्लस्टर में ZLD रेट्रोफ़िट की तैयारी', summary:'क्रेडिट विंडो खुली; एक्सपोर्ट सर्टिफिकेशन सपोर्ट।', url:'#', source:'FE', publishedAt:'2025-08-10T02:10:00Z' },
  ],
}

