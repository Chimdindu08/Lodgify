export const PRICE_BANDS = [
  { label:'Budget',   desc:'<=₦300k/yr', color:'#ECFDF5', text:'#065F46', border:'#BBF7D0', max:100000  },
  { label:'Moderate', desc:'<= ₦400k/yr', color:'#EFF6FF', text:'#1D4ED8', border:'#BFDBFE', max:200000  },
  { label:'Premium',  desc:'<= ₦500k/yr', color:'#FFFBEB', text:'#92400E', border:'#FDE68A', max:300000  },
  { label:'Luxury',   desc:'<= 700k+/yr',    color:'#FDF4FF', text:'#7E22CE', border:'#E9D5FF', max:Infinity},
]

export const getBand = (i) => PRICE_BANDS[i] ?? PRICE_BANDS[0]

export const AREAS = ['All Areas','Ifite Road','Behind Main Gate','Amawbia Road','Amansea']
export const TYPES = ['All Types','Self-Contained','Single Room','Flat Share']
export const SORTS = ['Highest Rated','Most Reviewed','A–Z']

export const LODGES = [
  {
    id:1, name:'Vinwell Lodge',
    area:'Ifite Road', address:'14 Ifite Road, Awka',
    distance:'5 min', type:'Self-Contained', priceBand:0,
    rating:4.9, reviews:47, verified:true,
    water:'Borehole', power:'NEPA + Generator', security:'Gateman + Fence',
    tags:['🔒 Secure','💧 Borehole','⚡ Gen Backup'], bg:'linear-gradient(135deg,#1B3A6B,#2563EB)',
    photos:[
      'Student Lodge Verification System/public/lodges/vinwell lodge main.jpg'
    ],
    breakdown:{ Security:4.8, Water:5.0, Electricity:4.5, Cleanliness:4.7, Landlord:4.9, Value:4.3 },
    reviewList:[
      { id:1, name:'Chukwuemeka U.', initials:'CU', level:'200L, Computer Science',
        date:'March 2025', rating:5, helpful:23, unhelpful:1,
        text:'I have lived here for two sessions and cannot complain. Water runs every morning, the gen comes on whenever NEPA takes light, and Mama Emma is always reachable. Gate locks at 11pm. Best decision I made coming to Awka.' },
      { id:2, name:'Adaeze N.', initials:'AN', level:'300L, Law',
        date:'Nov 2024', rating:4, helpful:15, unhelpful:0,
        text:'Very good hostel. Rooms get hot in dry season so bring a standing fan. Security is top-notch and borehole water is always available.' },
    ],
  },
  {
    id:2, name:'Grace Court Lodge',
    area:'Behind Main Gate', address:'Behind UNIZIK Gate, Ifite-Awka',
    distance:'3 min', type:'Self-Contained', priceBand:0,
    rating:4.3, reviews:29, verified:true,
    water:'Tap + Borehole', power:'NEPA', security:'Locked Gate',
    tags:['💧 Water Reliable','🚶 3min to Gate','✅ Verified'], bg:'linear-gradient(135deg,#065F46,#059669)',
    photos:['/Student Lodge Verification System/public/lodges/lodge 2 jpg.jpg'],
    breakdown:{ Security:4.0, Water:4.5, Electricity:3.8, Cleanliness:4.4, Landlord:4.2, Value:4.6 },
    reviewList:[
      { id:1, name:'Ngozi A.', initials:'NA', level:'200L, Pharmacy',
        date:'Jan 2025', rating:4, helpful:11, unhelpful:0,
        text:'Location is unbeatable — 3 minutes from the gate. Water is constant. No gen so keep an inverter. Quiet and safe at night.' },
    ],
  },
  {
    id:3, name:'Royal Peace Apartments',
    area:'Amawbia Road', address:'Amawbia Junction, Awka',
    distance:'40 min', type:'Flat Share', priceBand:0,
    rating:4.1, reviews:18, verified:false,
    water:'Buy Water', power:'NEPA + Generator', security:'Open Compound',
    tags:['🏠 Flat Share','⚡ Gen Backup','💰 Budget'], bg:'linear-gradient(135deg,#6D28D9,#8B5CF6)',
    photos:[ 'Student Lodge Verification System/public/lodges/lodge 4.jpg'],
    breakdown:{ Security:3.2, Water:3.5, Electricity:4.2, Cleanliness:3.9, Landlord:3.8, Value:5.0 },
    reviewList:[
      { id:1, name:'Chiamaka O.', initials:'CO', level:'100L, Arts',
        date:'Feb 2025', rating:4, helpful:7, unhelpful:0,
        text:'Gen is consistent. The 12-minute walk is the main downside. Good if you need to save on accommodation.' },
    ],
  },
  {
    id:4, name:'Divine Mercy Hostel',
    area:'Behind Main Gate', address:'Okafor Lane, Behind UNIZIK Gate',
    distance:'20 min', type:'Self-Contained', priceBand:1,
    rating:2.5, reviews:33, verified:true,
    water:'Borehole', power:'NEPA + Generator', security:'Gateman ',
    tags:['📷 CCTV','💧 Borehole','⚡ Gen Backup'], bg:'linear-gradient(135deg,#1E3A5F,#2E5F9E)',
    photos:['/Student Lodge Verification System/public/lodges/lodge 3faulty.jpg'],
    breakdown:{ Security:3.0, Water:4.8, Electricity:3.5, Cleanliness:4.3, Landlord:1.4, Value:1.0 },
    reviewList:[
      { id:1, name:'Blessing E.', initials:'BE', level:'300L, Nursing',
        date:'Jan 2025', rating:5, helpful:21, unhelpful:0,
        text:'The lodge is not well maintained.it is faulty and the building structure is very bad' },
    ],
  },
  {
    id:5, name:'Favour Lodge Complex',
    area:'Ifite Road', address:'No. 7 Favour Street, off Ifite Road',
    distance:'8 min', type:'Single Room', priceBand:0,
    rating:3.9, reviews:22, verified:true,
    water:'Borehole', power:'NEPA', security:'Locked Gate',
    tags:['💧 Borehole','🏠 Single Rooms','🔑 Locked Gate'],bg:'linear-gradient(135deg,#134E4A,#0F766E)',
    photos:['Student Lodge Verification System/public/lodges/PA Fabin lodge.jpg'],
    breakdown:{ Security:3.8, Water:4.5, Electricity:3.2, Cleanliness:3.9, Landlord:4.0, Value:4.8 },
    reviewList:[
      { id:1, name:'Sandra I.', initials:'SI', level:'200L, Education',
        date:'March 2025', rating:4, helpful:13, unhelpful:0,
        text:'Decent single room with borehole water. NEPA is not great and there is no gen, but the landlord is very calm and does not stress tenants.' },
    ],
  },
  {
    id:6, name:'Prince and princess Lodge',
    area:'Express gate', address:'12B front gate',
    distance:'10 min', type:'Self-Contained', priceBand:1,
    rating:3.6, reviews:11, verified:false,
    water:'Borehole', power:'Prepaid Meter', security:'Gateman',
    tags:['🛁 Self-Con','💧 Borehole','📊 Prepaid'], bg:'linear-gradient(135deg,#92400E,#D97706)',
    photos:['Student Lodge Verification System/public/lodges/prince and princess lodge.jpg'],
    breakdown:{ Security:4.0, Water:4.2, Electricity:3.5, Cleanliness:3.2, Landlord:3.0, Value:3.5 },
    reviewList:[
      { id:1, name:'Tochukwu M.', initials:'TM', level:'400L, Accountancy',
        date:'Dec 2024', rating:3, helpful:4, unhelpful:2,
        text:'Average lodge. Borehole works and there is a gateman but landlord has attitude issues. Manageable if nothing else is available.' },
    ],
  },
] 