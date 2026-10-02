const solarHeroImg = 'https://ik.imagekit.io/qvztwdsij/solar%20hero%20-%20Copy.png?updatedAt=1790432262362';
import {
  saveOrderToDB,
  updateOrderStatusInDB,
  deleteOrderFromDB,
  saveBookingToDB,
  updateBookingStatusInDB,
  deleteBookingFromDB,
  saveProductToDB,
  deleteProductFromDB,
  saveGalleryItemToDB,
  deleteGalleryItemFromDB,
  saveStaffToDB,
  deleteStaffFromDB,
  saveSiteToDB,
  deleteSiteFromDB,
  saveExpenseToDB,
  deleteExpenseFromDB,
  savePaymentToDB,
  deletePaymentFromDB,
  saveBudgetToDB,
  deleteBudgetFromDB,
  saveUserToDB,
  subscribeProducts,
  subscribeOrders,
  subscribeBookings,
  subscribeGallery,
  subscribeStaffUsers,
  subscribeSites,
  subscribeExpenses,
  subscribePayments,
  subscribeBudgets,
  seedInitialProducts,
  seedInitialOrders,
  seedInitialBookings,
  seedInitialGallery,
  seedInitialStaff,
  seedInitialSites,
  seedInitialExpenses,
  seedInitialPayments,
  seedInitialBudgets
} from '../firebase/firestoreService';

// ==========================================
// INITIAL STATIC DATASETS (Seed templates)
// ==========================================

export const initialProducts = [
  // 1. TATA SOLAR COMPLETE KIT
  {
    id: 'kit-tata',
    name: 'Tata Power Solar Complete Rooftop Kit',
    category: 'kits',
    isKit: true,
    efficiency: 'Tier-1 High Yield',
    warranty: '25-Year Tata Linear Warranty',
    description: 'Complete all-in-one solar rooftop combo with Tata high-efficiency Mono PERC/TOPCon panels, smart inverter, ACDB/DCDB protection, structure & net metering approval support.',
    features: [
      'Tata Tier-1 High Efficiency Solar Modules',
      'Smart Grid-Tie Inverter with WiFi App Monitoring',
      'PM Surya Ghar Govt Subsidy (Up to ₹1,08,000) Eligible',
      'Full Earthing, AC/DC Distribution Box & Cabling Included'
    ],
    tag: 'Tata Solar Kit',
    image: 'https://ik.imagekit.io/qvztwdsij/tata%20kit.png?updatedAt=1790432918231',
    manualPrice: 35000,
    manualGross: 65000,
    manualSubsidy: 30000,
    priceLabel: 'Effective 1kW Price (After Subsidy)',
    capacityPricing: {
      '1kW': 65000,
      '2kW': 125000,
      '3kW': 185000,
      '4kW': 240000,
      '5kW': 295000,
      '6kW': 350000,
      '8kW': 450000,
      '10kW': 550000,
    },
  },
  // 2. WAAREE SOLAR COMPLETE KIT
  {
    id: 'kit-waaree',
    name: 'Waaree Energies High-Output Solar Combo',
    category: 'kits',
    isKit: true,
    efficiency: '22.8% Cell Efficiency',
    warranty: '25-Year Waaree Power Output Warranty',
    description: 'India’s largest solar manufacturer Waaree TOPCon Bi-facial solar kits with high efficiency, robust anodized frame, lightning surge arrestors & complete installation kit.',
    features: [
      'Waaree Bi-Facial Dual Glass Solar Modules',
      'High-Efficiency MPPT Transformerless Inverter',
      'Pre-galvanized Wind-Resistant Mounting Structure',
      'Eligible for PM Surya Ghar DBT Bank Subsidy'
    ],
    tag: 'Waaree Solar Kit',
    image: 'https://ik.imagekit.io/qvztwdsij/waaree%20kit.png?updatedAt=1790432917789',
    manualPrice: 35000,
    manualGross: 65000,
    manualSubsidy: 30000,
    priceLabel: 'Effective 1kW Price (After Subsidy)',
    capacityPricing: {
      '1kW': 65000,
      '2kW': 125000,
      '3kW': 185000,
      '4kW': 240000,
      '5kW': 295000,
      '6kW': 350000,
      '8kW': 450000,
      '10kW': 550000,
    },
  },
  // 3. ADANI SOLAR COMPLETE KIT
  {
    id: 'kit-adani',
    name: 'Adani Solar Eternal Advanced Rooftop Kit',
    category: 'kits',
    isKit: true,
    efficiency: '22.5% High Performance',
    warranty: '25-Year Linear Performance Warranty',
    description: 'High-durability Adani Mono PERC solar combo tailored for high heat climates with low temperature coefficient and heavy duty rust-proof structure.',
    features: [
      'Adani Tier-1 High Output Solar Panels',
      'Smart On-Grid Hybrid-Ready PCU/Inverter',
      'Govt Certified Net Metering Kit & Accessories',
      'Full Site Installation with PM Surya Ghar Subsidy'
    ],
    tag: 'Adani Solar Kit',
    image: 'https://ik.imagekit.io/qvztwdsij/adani%20kit.png?updatedAt=1790432917897',
    manualPrice: 35000,
    manualGross: 65000,
    manualSubsidy: 30000,
    priceLabel: 'Effective 1kW Price (After Subsidy)',
    capacityPricing: {
      '1kW': 65000,
      '2kW': 125000,
      '3kW': 185000,
      '4kW': 240000,
      '5kW': 295000,
      '6kW': 350000,
      '8kW': 450000,
      '10kW': 550000,
    },
  },
  // 4. LOOM SOLAR COMPLETE KIT
  {
    id: 'kit-loom',
    name: 'Loom Solar Shark Bi-Facial Complete Kit',
    category: 'kits',
    isKit: true,
    efficiency: 'Shark Super High Efficiency',
    warranty: '25-Year Comprehensive Warranty',
    description: 'Loom Solar shark bi-facial solar system producing power from both front and rear sides, ideal for compact rooftops and cloudy conditions.',
    features: [
      'Shark Bi-Facial Dual Generation Modules',
      'Smart Grid-Connected Solar Inverter',
      'Heavy Duty GI Solar Mounting Hardware',
      'PM Surya Ghar DBT Subsidy Enabled'
    ],
    tag: 'Loom Solar Kit',
    image: 'https://ik.imagekit.io/qvztwdsij/loom%20kit.png?updatedAt=1790432917961',
    manualPrice: 35000,
    manualGross: 65000,
    manualSubsidy: 30000,
    priceLabel: 'Effective 1kW Price (After Subsidy)',
    capacityPricing: {
      '1kW': 65000,
      '2kW': 125000,
      '3kW': 185000,
      '4kW': 240000,
      '5kW': 295000,
      '6kW': 350000,
      '8kW': 450000,
      '10kW': 550000,
    },
  },
  // 5. LIVGUARD SOLAR COMPLETE KIT
  {
    id: 'kit-livguard',
    name: 'Livguard Energy Smart Complete Rooftop Kit',
    category: 'kits',
    isKit: true,
    efficiency: 'Smart Energy Optimization',
    warranty: '25-Year Performance Warranty',
    description: 'Livguard complete rooftop solar system with smart interactive inverter, heavy duty protection devices and seamless net meter connection support.',
    features: [
      'High-Output Solar PV Modules',
      'Livguard Smart Inverter with Dynamic Load Sharing',
      'PM Surya Ghar Bank Subsidy Approved',
      'Complete Installation Hardware & AC/DC Protection'
    ],
    tag: 'Livguard Solar Kit',
    image: 'https://ik.imagekit.io/qvztwdsij/livguard%20kit.png?updatedAt=1790432918116',
    manualPrice: 35000,
    manualGross: 65000,
    manualSubsidy: 30000,
    priceLabel: 'Effective 1kW Price (After Subsidy)',
    capacityPricing: {
      '1kW': 65000,
      '2kW': 125000,
      '3kW': 185000,
      '4kW': 240000,
      '5kW': 295000,
      '6kW': 350000,
      '8kW': 450000,
      '10kW': 550000,
    },
  },
  // 6. UTL SOLAR COMPLETE KIT
  {
    id: 'kit-utl',
    name: 'UTL Solar Gamma+ / On-Grid Complete Kit',
    category: 'kits',
    isKit: true,
    efficiency: 'rMPPT Smart Solar Kit',
    warranty: '25-Year Panel Warranty',
    description: 'UTL Solar complete rooftop package equipped with rMPPT technology for maximum solar harvest in all Indian weather conditions.',
    features: [
      'High Yield Mono PERC Solar Panels',
      'UTL Smart Solar Inverter with rMPPT Technology',
      'Government DBT Subsidy Claim Support',
      'Turnkey Delivery with Mounting & Cabling Kit'
    ],
    tag: 'UTL Solar Kit',
    image: 'https://ik.imagekit.io/qvztwdsij/utl%20kit.png?updatedAt=1790432918197',
    manualPrice: 35000,
    manualGross: 65000,
    manualSubsidy: 30000,
    priceLabel: 'Effective 1kW Price (After Subsidy)',
    capacityPricing: {
      '1kW': 65000,
      '2kW': 125000,
      '3kW': 185000,
      '4kW': 240000,
      '5kW': 295000,
      '6kW': 350000,
      '8kW': 450000,
      '10kW': 550000,
    },
  },
  // 7. STANDALONE SOLAR PANELS
  {
    id: 'prod-panels-tata',
    name: 'Tata Power 550W Mono PERC Half-Cut Module',
    category: 'panels',
    isKit: false,
    efficiency: '21.8% Efficiency',
    warranty: '25-Year Linear Warranty',
    description: 'Tier-1 Tata 550 Watt Half-Cut Mono PERC module with high shade tolerance, IP68 junction box and robust 35mm aluminium frame.',
    features: ['550W Output', 'Mono PERC 144 Half-Cells', 'IP68 Weatherproof', 'Certified for PM Surya Ghar'],
    tag: 'Tata Solar Panel',
    image: 'https://ik.imagekit.io/qvztwdsij/Tata-Solar-Panel.png?updatedAt=1790433291583',
    price: '₹27 / Watt',
    manualPrice: '₹27 / Watt',
    manualGross: '₹34 / Watt',
    manualSubsidy: '21% OFF',
    priceLabel: 'Rate / Watt',
  },
  {
    id: 'prod-panels-waaree',
    name: 'Waaree 540W Dual-Glass Bi-Facial Panel',
    category: 'panels',
    isKit: false,
    efficiency: '22.4% Cell Efficiency',
    warranty: '30-Year Performance Warranty',
    description: 'Waaree 540W TOPCon Bi-facial solar module with rear-side gain up to 25% for maximum rooftop solar generation.',
    features: ['540W+ Front Output', 'Up to 25% Extra Rear Gain', 'Anti-PID Technology', 'Tier-1 Certified'],
    tag: 'Waaree Bi-Facial',
    image: 'https://ik.imagekit.io/qvztwdsij/Waaree-Solar-Panel.png?updatedAt=1790433291572',
    price: '₹25 / Watt',
    manualPrice: '₹25 / Watt',
    manualGross: '₹32 / Watt',
    manualSubsidy: '22% OFF',
    priceLabel: 'Rate / Watt',
  },
  {
    id: 'prod-panels-adani',
    name: 'Adani Solar 545W Mono PERC Module',
    category: 'panels',
    isKit: false,
    efficiency: '21.5% High Yield',
    warranty: '25-Year Warranty',
    description: 'Adani high performance 545W Mono PERC panel with low degradation and superior weak light performance.',
    features: ['545W Maximum Power', 'Half-Cut Multi-Busbar', 'High Wind & Snow Load Certified', 'BIS Approved'],
    tag: 'Adani Solar Panel',
    image: 'https://ik.imagekit.io/qvztwdsij/adani-panel.png?updatedAt=1790433291560',
    price: '₹26 / Watt',
    manualPrice: '₹26 / Watt',
    manualGross: '₹33 / Watt',
    manualSubsidy: '21% OFF',
    priceLabel: 'Rate / Watt',
  },
  // 8. SMART INVERTERS
  {
    id: 'prod-inv-growatt',
    name: 'Growatt 3.3kW–10kW Smart On-Grid Inverter',
    category: 'inverters',
    isKit: false,
    efficiency: '98.4% Peak Efficiency',
    warranty: '10-Year Replacement Warranty',
    description: 'Growatt smart transformerless string inverter with dual MPPT, OLED display, and WiFi mobile app live monitoring.',
    features: ['Dual MPPT Trackers', 'WiFi / Mobile App Cloud Monitoring', 'IP65 Outdoor Rated', 'Zero Export Capable'],
    tag: 'Growatt Inverter',
    image: 'https://ik.imagekit.io/qvztwdsij/growatt-inverter.png?updatedAt=1790433555239',
    price: '₹14,500',
    manualPrice: 14500,
    manualGross: 19500,
    manualSubsidy: '25% OFF',
    priceLabel: 'Starting Hardware Price',
  },
  {
    id: 'prod-inv-solis',
    name: 'Solis 5kW 3-Phase Grid-Tie Inverter',
    category: 'inverters',
    isKit: false,
    efficiency: '98.7% Ultra Efficiency',
    warranty: '10-Year Warranty',
    description: 'Solis 5kW Three Phase solar inverter with ultra-wide voltage range, AFCI arc-fault protection and remote firmware upgrade.',
    features: ['Three Phase 415V Output', 'Integrated AFCI Protection', 'Dual MPPT with 98.7% Yield', 'IP66 Rated'],
    tag: 'Solis Inverter',
    image: 'https://ik.imagekit.io/qvztwdsij/solis-inverter.png?updatedAt=1790433555289',
    price: '₹12,800',
    manualPrice: 12800,
    manualGross: 17500,
    manualSubsidy: '27% OFF',
    priceLabel: 'Starting Hardware Price',
  }
];

export const initialGallery = [
  {
    id: 'gal-1',
    title: '5 kW Tata Rooftop Solar at Medical Road',
    category: 'Residential Rooftop',
    location: 'Medical Road, Gorakhpur',
    capacity: '5 kW On-Grid',
    image: 'https://ik.imagekit.io/qvztwdsij/medical-road-project.png?updatedAt=1790433767291',
    description: '5 kW PM Surya Ghar certified on-grid rooftop installation with Tata Mono PERC panels cutting monthly bill by ₹4,800.',
    date: 'March 2026'
  },
  {
    id: 'gal-2',
    title: '3 kW Waaree Solar Installation at Singhorwa',
    category: 'Residential Rooftop',
    location: 'Singhorwa Bajar, Gorakhpur',
    capacity: '3 kW On-Grid',
    image: 'https://ik.imagekit.io/qvztwdsij/singhorwa-site.png?updatedAt=1790433767352',
    description: '3 kW residential turnkey project with ₹78,000 direct DBT government subsidy credited.',
    date: 'March 2026'
  },
  {
    id: 'gal-3',
    title: '10 kW Hybrid Solar & LiFePO4 Storage',
    category: 'Commercial',
    location: 'Taramandal, Gorakhpur',
    capacity: '10 kW Hybrid',
    image: 'https://ik.imagekit.io/qvztwdsij/taramandal-commercial.png?updatedAt=1790433767412',
    description: '10 kW heavy commercial installation powering a 3-storey office building with zero grid power interruption.',
    date: 'February 2026'
  }
];

export const initialBookings = [
  {
    id: 'lead-101',
    name: 'Prem Chand',
    phone: '+91 7398198475',
    email: 'premchand.gkp@gmail.com',
    city: 'Gorakhpur',
    pincode: '273001',
    address: 'Singhorwa Bajar, Near Power Substation, Gorakhpur',
    billAmount: '₹3,500 / month',
    connectionType: 'Residential (Single Phase)',
    category: 'Residential',
    capacity: '3 kW',
    systemType: 'On-Grid Rooftop',
    status: 'Installation Done',
    createdAt: '2026-03-24T10:30:00.000Z',
    notes: 'Site survey done. Net meter approved and 3kW Waaree system fully active.'
  },
  {
    id: 'lead-102',
    name: 'Dr. Alok Verma',
    phone: '+91 9839012345',
    email: 'dr.alokverma@hospital.in',
    city: 'Gorakhpur',
    pincode: '273004',
    address: 'Medical College Road, Basharatpur, Gorakhpur',
    billAmount: '₹8,500 / month',
    connectionType: 'Commercial / Clinic (3-Phase)',
    category: 'Commercial',
    capacity: '5 kW',
    systemType: 'Hybrid Solar',
    status: 'Site Survey Completed',
    createdAt: '2026-03-26T14:15:00.000Z',
    notes: 'Structure foundation verified. Awaiting Discom load sanction.'
  },
  {
    id: 'lead-103',
    name: 'Rajesh Kumar Gupta',
    phone: '+91 9450098765',
    email: 'rajesh.gupta.gkp@yahoo.com',
    city: 'Deoria',
    pincode: '274001',
    address: 'Station Road, Near Civil Lines, Deoria',
    billAmount: '₹2,800 / month',
    connectionType: 'Residential (1-Phase)',
    category: 'Residential',
    capacity: '2 kW',
    systemType: 'On-Grid Rooftop',
    status: 'Request Received',
    createdAt: '2026-03-28T11:00:00.000Z',
    notes: 'Customer inquired about PM Surya Ghar ₹60,000 subsidy.'
  }
];

export const initialOrders = [
  {
    id: 'ORD-89421',
    customerName: 'Suresh Chandra Mishra',
    phone: '+91 9125436789',
    email: 'suresh.mishra@gmail.com',
    address: 'House 42, Rapti Nagar Phase 2, Gorakhpur',
    city: 'Gorakhpur',
    pincode: '273013',
    productId: 'kit-tata',
    productName: 'Tata Power Solar Complete Rooftop Kit',
    productImage: 'https://ik.imagekit.io/qvztwdsij/tata%20kit.png?updatedAt=1790432918231',
    capacity: '3kW',
    quantity: 1,
    grossPrice: 185000,
    subsidy: 78000,
    netPayable: 107000,
    paymentMode: 'Cash on Delivery (COD)',
    status: 'Order Confirmed',
    notes: 'Call before dispatch. Saturday delivery preferred.',
    createdAt: '2026-09-29T14:20:00.000Z',
  },
  {
    id: 'ORD-76120',
    customerName: 'Anil Kumar Jaiswal',
    phone: '+91 8874123987',
    email: 'anil.jaiswal@outlook.com',
    address: 'Shop 14, Singhorwa Market, Gorakhpur',
    city: 'Gorakhpur',
    pincode: '273001',
    productId: 'kit-tata',
    productName: 'Tata Power Solar Complete Rooftop Kit',
    productImage: 'https://ik.imagekit.io/qvztwdsij/tata%20kit.png?updatedAt=1790432918231',
    capacity: '2kW',
    quantity: 1,
    grossPrice: 54000,
    subsidy: 0,
    netPayable: 54000,
    paymentMode: 'Cash on Delivery (COD)',
    status: 'Order Received',
    notes: 'Deliver directly to commercial shop premises.',
    createdAt: '2026-09-28T09:10:00.000Z',
  }
];

export const initialStaffMembers = [
  {
    id: 'staff-1',
    name: 'Rohan Sharma',
    email: 'staff@power24.com',
    phone: '+91 7398198475',
    role: 'Senior Project Incharge & Site Engineer',
    department: 'Solar Project Operations',
    password: 'staff123',
    badgeId: 'P24-STAFF-01',
    status: 'Active',
    createdAt: '2026-03-20T10:00:00.000Z'
  },
  {
    id: 'staff-2',
    name: 'Pooja Singh',
    email: 'pooja@power24.com',
    phone: '+91 9839012345',
    role: 'Site Accounts & Billing Incharge',
    department: 'Financial Operations & Billing',
    password: 'power24staff',
    badgeId: 'P24-STAFF-02',
    status: 'Active',
    createdAt: '2026-03-22T11:30:00.000Z'
  }
];

export const initialUsers = [
  {
    id: 'user-001',
    name: 'Prem Chand',
    email: 'premchand.gkp@gmail.com',
    phone: '+91 7398198475',
    password: 'password123',
    city: 'Gorakhpur',
    address: 'Singhorwa Bajar, Gorakhpur',
    registeredAt: '2026-03-20T10:00:00.000Z',
    role: 'customer'
  },
  {
    id: 'user-002',
    name: 'Amitabh Verma',
    email: 'amitabh.verma@example.com',
    phone: '+91 9839012345',
    password: 'password123',
    city: 'Gorakhpur',
    address: 'Medical College Road, Basharatpur, Gorakhpur',
    registeredAt: '2026-03-22T10:00:00.000Z',
    role: 'customer'
  }
];

export const initialManagementSites = [
  {
    id: 'P24-001',
    name: 'Prem Chand 3kW Rooftop Solar',
    customerName: 'Prem Chand',
    clientName: 'Prem Chand',
    siteAddress: 'Gorakhpur Singhorwa Bajar, Up, Ind',
    location: 'Gorakhpur Singhorwa Bajar, Up, Ind',
    district: 'Gorakhpur',
    capacity: '3kw',
    projectValue: 230000,
    loanAmount: 200000,
    customerMargin: 0,
    projectIncome: 200000,
    startDate: '26.03.2026',
    completionDate: '',
    siteStatus: 'Running',
    status: 'Running',
    remarks: 'Turnkey on-grid rooftop solar under PM Surya Ghar',
    notes: 'Turnkey on-grid rooftop solar under PM Surya Ghar',
    engineer: 'Rohan Sharma (Lead Eng.)',
    phone: '+91 7398198475'
  }
];

export const initialManagementExpenses = [
  {
    id: 'EXP-001',
    siteId: 'P24-001',
    siteName: 'Prem Chand 3kW Rooftop Solar',
    date: '26.09.2026',
    vendor: 'AMIT',
    description: '',
    category: 'Misc',
    amount: 500,
    paymentMode: 'UPI',
    billNo: '',
    remarks: ''
  },
  {
    id: 'EXP-002',
    siteId: 'P24-001',
    siteName: 'Prem Chand 3kW Rooftop Solar',
    date: '26.09.2026',
    vendor: 'AMIT',
    description: '',
    category: 'Material',
    amount: 150000,
    paymentMode: 'NEFT/RTGS',
    billNo: '',
    remarks: ''
  },
  {
    id: 'EXP-003',
    siteId: 'P24-001',
    siteName: 'Prem Chand 3kW Rooftop Solar',
    date: '26.09.2026',
    vendor: 'AMIT',
    description: '',
    category: 'Material',
    amount: 36000,
    paymentMode: 'UPI',
    billNo: '',
    remarks: ''
  }
];

export const initialManagementPayments = [
  {
    id: 'PAY-001',
    siteId: 'P24-001',
    siteName: 'Prem Chand 3kW Rooftop Solar',
    date: '25.09.2026',
    paymentType: 'Loan',
    amount: 200000,
    paymentMode: 'NEFT/RTGS',
    refNo: '',
    remarks: ''
  },
  {
    id: 'PAY-002',
    siteId: 'P24-001',
    siteName: 'Prem Chand 3kW Rooftop Solar',
    date: '25.09.2026',
    paymentType: 'Customer Margin',
    amount: 5000,
    paymentMode: 'Cash',
    refNo: '',
    remarks: ''
  }
];

export const initialMaterialBudgets = [
  {
    id: 'MAT-001',
    siteId: 'P24-001',
    material: 'SOLAR SYSTEM',
    brand: 'WAREE',
    qty: 1,
    unit: 'NO',
    budgetRate: 150000,
    budgetAmount: 150000,
    actualAmount: 150000,
    variance: 0,
    remarks: ''
  }
];

export const BOOKING_STATUS_STEPS = [
  { id: 1, label: 'Request Received', desc: 'Customer booked survey inquiry' },
  { id: 2, label: 'Survey Scheduled', desc: 'Engineer assigned & site visit date booked' },
  { id: 3, label: 'Site Survey Completed', desc: 'Shadow analysis & structure design finalized' },
  { id: 4, label: 'Installation Done', desc: 'Panels & Inverter mounted, net metering approved' },
  { id: 5, label: 'Completed', desc: 'DBT subsidy credited to customer bank account' },
  { id: 6, label: 'Cancelled', desc: 'Survey or project canceled by customer' }
];

// ==========================================
// PURE IN-MEMORY REALTIME STATE STORE (NO LOCALSTORAGE)
// ==========================================

let memoryProducts = [...initialProducts];
let memoryOrders = [...initialOrders];
let memoryBookings = [...initialBookings];
let memoryGallery = [...initialGallery];
let memoryStaff = [...initialStaffMembers];
let memoryUsers = [...initialUsers];
let memorySites = [...initialManagementSites];
let memoryExpenses = [...initialManagementExpenses];
let memoryPayments = [...initialManagementPayments];
let memoryBudgets = [...initialMaterialBudgets];

// Automatic Firestore Initial Synchronization and Subscriptions
if (typeof window !== 'undefined') {
  // 1. Seed initial datasets directly in Firestore if collections are empty
  seedInitialProducts(initialProducts);
  seedInitialOrders(initialOrders);
  seedInitialBookings(initialBookings);
  seedInitialGallery(initialGallery);
  seedInitialStaff(initialStaffMembers);
  seedInitialSites(initialManagementSites);
  seedInitialExpenses(initialManagementExpenses);
  seedInitialPayments(initialManagementPayments);
  seedInitialBudgets(initialMaterialBudgets);

  // 2. Realtime Subscriptions directly updating in-memory stores
  subscribeProducts((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memoryProducts = items;
      window.dispatchEvent(new Event('power24_products_updated'));
    }
  });

  subscribeOrders((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memoryOrders = items;
      window.dispatchEvent(new Event('power24_orders_updated'));
    }
  });

  subscribeBookings((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memoryBookings = items;
      window.dispatchEvent(new Event('power24_bookings_updated'));
    }
  });

  subscribeGallery((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memoryGallery = items;
      window.dispatchEvent(new Event('power24_gallery_updated'));
    }
  });

  subscribeStaffUsers((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memoryStaff = items;
      window.dispatchEvent(new Event('power24_staff_updated'));
    }
  });

  subscribeSites((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memorySites = items;
      window.dispatchEvent(new Event('power24_sites_updated'));
    }
  });

  subscribeExpenses((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memoryExpenses = items;
      window.dispatchEvent(new Event('power24_expenses_updated'));
    }
  });

  subscribePayments((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memoryPayments = items;
      window.dispatchEvent(new Event('power24_payments_updated'));
    }
  });

  subscribeBudgets((items) => {
    if (Array.isArray(items) && items.length > 0) {
      memoryBudgets = items;
      window.dispatchEvent(new Event('power24_budgets_updated'));
    }
  });
}

// ==========================================
// 1. PRODUCTS & KITS SERVICES (Direct Memory & Firestore)
// ==========================================

export const getProducts = () => {
  return memoryProducts;
};

export const addProduct = (prod) => {
  const isKit = prod.isKit || prod.category === 'kits';
  const autoId = isKit ? `kit-${Date.now()}` : `prod-${Date.now()}`;
  const newProd = {
    id: prod.id && prod.id.trim() ? prod.id.trim() : autoId,
    name: prod.name || 'New Solar Product',
    category: prod.category || 'kits',
    isKit: Boolean(isKit),
    efficiency: prod.efficiency || 'Tier-1 Certified',
    warranty: prod.warranty || '25-Year Linear Warranty',
    description: prod.description || '',
    features: Array.isArray(prod.features) ? prod.features : ['Tier-1 Certified'],
    tag: prod.tag || (isKit ? 'Solar Kit' : 'Hardware'),
    image: prod.image || solarHeroImg,
    images: Array.isArray(prod.images) ? prod.images : [prod.image || solarHeroImg],
    manualPrice: prod.manualPrice !== undefined ? prod.manualPrice : (isKit ? 35000 : 14500),
    manualGross: prod.manualGross !== undefined ? prod.manualGross : (isKit ? 65000 : 19500),
    manualSubsidy: prod.manualSubsidy !== undefined ? prod.manualSubsidy : (isKit ? 30000 : '25% OFF'),
    priceLabel: prod.priceLabel || (isKit ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price'),
    price: prod.price || (isKit ? '₹24 / Watt' : '₹14,500'),
    capacityPricing: prod.capacityPricing || {
      '1kW': 65000,
      '2kW': 125000,
      '3kW': 185000,
      '4kW': 240000,
      '5kW': 295000,
      '6kW': 350000,
      '8kW': 450000,
      '10kW': 550000,
    },
    createdAt: new Date().toISOString()
  };
  memoryProducts = [newProd, ...memoryProducts];
  saveProductToDB(newProd).catch((err) => console.warn('[Power24] Product Cloud Save Note:', err));
  return memoryProducts;
};

export const updateProduct = (id, updatedFields) => {
  memoryProducts = memoryProducts.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
  const updatedItem = memoryProducts.find((p) => p.id === id);
  if (updatedItem) {
    saveProductToDB(updatedItem).catch((err) => console.warn('[Power24] Product Update Cloud Note:', err));
  }
  return memoryProducts;
};

export const deleteProduct = (id) => {
  memoryProducts = memoryProducts.filter((p) => p.id !== id);
  deleteProductFromDB(id).catch((err) => console.warn('[Power24] Product Delete Cloud Note:', err));
  return memoryProducts;
};

export const saveProduct = (product) => {
  const existing = memoryProducts.find((p) => p.id === product.id);
  if (existing) {
    return updateProduct(product.id, product);
  }
  return addProduct(product);
};

// ==========================================
// 2. ORDERS (Direct Memory & Firestore)
// ==========================================

export const getOrders = () => {
  return memoryOrders;
};

export const addOrder = (orderData) => {
  const currentUser = getCurrentUser();
  const orderId = orderData.id || 'ORD-' + Math.floor(10000 + Math.random() * 90000);
  const entry = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: 'Order Received',
    paymentMode: 'Cash on Delivery (COD)',
    userId: currentUser?.id || undefined,
    ...orderData,
  };
  memoryOrders = [entry, ...memoryOrders];
  saveOrderToDB(entry).catch((err) => console.warn('[Power24] Order Cloud Sync Note:', err));
  return entry;
};

export const updateOrderStatus = (id, status) => {
  memoryOrders = memoryOrders.map((o) => (o.id === id ? { ...o, status } : o));
  updateOrderStatusInDB(id, status).catch((err) => console.warn('[Power24] Order Status Cloud Sync Note:', err));
  return memoryOrders;
};

export const deleteOrder = (id) => {
  memoryOrders = memoryOrders.filter((o) => o.id !== id);
  deleteOrderFromDB(id).catch((err) => console.warn('[Power24] Order Delete Cloud Sync Note:', err));
  return memoryOrders;
};

// ==========================================
// 3. BOOKINGS & SITE SURVEY (Direct Memory & Firestore)
// ==========================================

export const getBookings = () => {
  return memoryBookings;
};

export const saveBooking = (newBooking) => {
  const currentUser = getCurrentUser();
  const entry = {
    id: newBooking.id || 'lead-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'Request Received',
    type: 'Site Survey',
    userId: currentUser?.id || undefined,
    ...newBooking,
  };
  memoryBookings = [entry, ...memoryBookings];
  saveBookingToDB(entry).catch((err) => console.warn('[Power24] Booking Cloud Sync Note:', err));
  return entry;
};

export const updateBookingStatus = (id, status) => {
  memoryBookings = memoryBookings.map((b) => (b.id === id ? { ...b, status } : b));
  updateBookingStatusInDB(id, status).catch((err) => console.warn('[Power24] Booking Status Cloud Sync Note:', err));
  return memoryBookings;
};

export const deleteBooking = (id) => {
  memoryBookings = memoryBookings.filter((b) => b.id !== id);
  deleteBookingFromDB(id).catch((err) => console.warn('[Power24] Booking Delete Cloud Note:', err));
  return memoryBookings;
};

// ==========================================
// 4. GALLERY SERVICES (Direct Memory & Firestore)
// ==========================================

export const getGalleryItems = () => {
  return memoryGallery;
};

export const addGalleryItem = (item) => {
  const newItem = {
    id: item.id && item.id.trim() ? item.id.trim() : `gal-${Date.now()}`,
    title: item.title || 'Gorakhpur Solar Installation',
    category: item.category || 'Residential Rooftop',
    location: item.location || 'Gorakhpur, UP',
    capacity: item.capacity || '3 kW',
    image: item.image || solarHeroImg,
    description: item.description || '',
    date: item.date || 'March 2026',
    createdAt: new Date().toISOString()
  };
  memoryGallery = [newItem, ...memoryGallery];
  saveGalleryItemToDB(newItem).catch((err) => console.warn('[Power24] Gallery Cloud Save Note:', err));
  return memoryGallery;
};

export const updateGalleryItem = (id, updatedFields) => {
  memoryGallery = memoryGallery.map((g) => (g.id === id ? { ...g, ...updatedFields } : g));
  const updated = memoryGallery.find((g) => g.id === id);
  if (updated) {
    saveGalleryItemToDB(updated).catch((err) => console.warn('[Power24] Gallery Cloud Update Note:', err));
  }
  return memoryGallery;
};

export const deleteGalleryItem = (id) => {
  memoryGallery = memoryGallery.filter((g) => g.id !== id);
  deleteGalleryItemFromDB(id).catch((err) => console.warn('[Power24] Gallery Cloud Delete Note:', err));
  return memoryGallery;
};

// ==========================================
// 5. STAFF PORTAL SERVICES (Direct Memory & Firestore)
// ==========================================

export const getStaffList = () => {
  return memoryStaff;
};

export const getStaffMembers = getStaffList;

export const addStaffMember = (staffData) => {
  const newStaff = {
    id: staffData.id && staffData.id.trim() ? staffData.id.trim() : `staff-${Date.now()}`,
    name: (staffData.name || '').trim() || 'Staff Officer',
    email: (staffData.email || '').trim().toLowerCase(),
    password: (staffData.password || '').trim() || 'staff123',
    phone: (staffData.phone || '').trim() || '+91 9876543210',
    role: (staffData.role || '').trim() || 'Solar Project Incharge',
    department: (staffData.department || '').trim() || 'Solar Project Operations',
    badgeId: (staffData.badgeId || '').trim() || `P24-STAFF-${String(memoryStaff.length + 1).padStart(2, '0')}`,
    status: staffData.status || 'Active',
    createdAt: new Date().toISOString()
  };
  memoryStaff = [newStaff, ...memoryStaff];
  saveStaffToDB(newStaff).catch((err) => console.warn('[Power24] Staff Cloud Save Note:', err));
  return memoryStaff;
};

export const updateStaffMember = (id, updatedFields) => {
  memoryStaff = memoryStaff.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
  const updated = memoryStaff.find((s) => s.id === id);
  if (updated) {
    saveStaffToDB(updated).catch((err) => console.warn('[Power24] Staff Cloud Update Note:', err));
  }
  return memoryStaff;
};

export const deleteStaffMember = (id) => {
  memoryStaff = memoryStaff.filter((s) => s.id !== id);
  deleteStaffFromDB(id).catch((err) => console.warn('[Power24] Staff Cloud Delete Note:', err));
  return memoryStaff;
};

export const toggleStaffStatus = (id) => {
  const staff = memoryStaff.find((s) => s.id === id);
  if (!staff) return memoryStaff;
  const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
  return updateStaffMember(id, { status: newStatus });
};

// ==========================================
// 6. SOLAR PROJECT MANAGEMENT SITES (Direct Memory & Firestore)
// ==========================================

export const getManagementSites = () => {
  return memorySites.map((s, idx) => ({
    ...s,
    id: s.id || `P24-${String(idx + 1).padStart(3, '0')}`,
    customerName: s.customerName || s.clientName || s.name || 'Customer',
    siteAddress: s.siteAddress || s.location || 'Gorakhpur, UP',
    district: s.district || 'Gorakhpur',
    capacity: s.capacity || '3kw',
    projectValue: Number(s.projectValue) || Number(s.projectIncome) || 230000,
    loanAmount: s.loanAmount !== undefined ? Number(s.loanAmount) : Number(s.projectIncome) || 200000,
    customerMargin: s.customerMargin !== undefined ? Number(s.customerMargin) : 0,
    projectIncome: Number(s.projectIncome) || (Number(s.loanAmount || 0) + Number(s.customerMargin || 0)) || 200000,
    materialCost: Number(s.materialCost) || 0,
    labourCost: Number(s.labourCost) || 0,
    transportCost: Number(s.transportCost) || 0,
    miscCost: Number(s.miscCost) || 0,
    totalExpense: Number(s.totalExpense) || ((Number(s.materialCost) || 0) + (Number(s.labourCost) || 0) + (Number(s.transportCost) || 0) + (Number(s.miscCost) || 0)),
    amountReceived: Number(s.amountReceived) || 0,
    amountPending: s.amountPending !== undefined ? Number(s.amountPending) : (Number(s.projectIncome || 200000) - Number(s.amountReceived || 0)),
    profitLoss: s.profitLoss !== undefined ? Number(s.profitLoss) : 0,
    profitMargin: s.profitMargin !== undefined ? Number(s.profitMargin) : 0,
    siteStatus: s.siteStatus || s.status || 'Running',
    startDate: s.startDate || '26.03.2026',
    completionDate: s.completionDate || '',
    remarks: s.remarks || s.notes || ''
  }));
};

export const addManagementSite = (site) => {
  const nextNum = memorySites.length + 1;
  const autoId = `P24-${String(nextNum).padStart(3, '0')}`;
  const loan = Number(site.loanAmount) || 0;
  const margin = Number(site.customerMargin) || 0;
  const income = (loan + margin) > 0 ? (loan + margin) : (Number(site.projectIncome) || Number(site.projectValue) || 230000);
  const mat = Number(site.materialCost) || 0;
  const lab = Number(site.labourCost) || 0;
  const tra = Number(site.transportCost) || 0;
  const misc = Number(site.miscCost) || 0;
  const totExp = Number(site.totalExpense) || (mat + lab + tra + misc);
  const rec = Number(site.amountReceived) || 0;
  const pend = income - rec;
  const profit = income - totExp;
  const profitPercent = income > 0 ? ((profit / income) * 100) : 0;

  const newSite = {
    ...site,
    id: site.id && site.id.trim() ? site.id.trim() : autoId,
    customerName: site.customerName || site.clientName || 'Customer',
    siteAddress: site.siteAddress || site.location || 'Gorakhpur, UP',
    projectValue: Number(site.projectValue) || 230000,
    loanAmount: loan,
    customerMargin: margin,
    projectIncome: income,
    materialCost: mat,
    labourCost: lab,
    transportCost: tra,
    miscCost: misc,
    totalExpense: totExp,
    amountReceived: rec,
    amountPending: pend,
    profitLoss: profit,
    profitMargin: profitPercent,
    siteStatus: site.siteStatus || 'Running',
    createdAt: new Date().toISOString()
  };
  memorySites = [newSite, ...memorySites];
  saveSiteToDB(newSite).catch((err) => console.warn('[Power24] Site Cloud Save Note:', err));
  return memorySites;
};

export const updateManagementSite = (id, updatedFields) => {
  memorySites = memorySites.map((s) => {
    if (s.id === id) {
      const merged = { ...s, ...updatedFields };
      const loan = Number(merged.loanAmount) || 0;
      const margin = Number(merged.customerMargin) || 0;
      const income = (loan + margin) > 0 ? (loan + margin) : (Number(merged.projectIncome) || Number(merged.projectValue) || 0);
      const mat = Number(merged.materialCost) || 0;
      const lab = Number(merged.labourCost) || 0;
      const tra = Number(merged.transportCost) || 0;
      const misc = Number(merged.miscCost) || 0;
      const totExp = Number(merged.totalExpense) || (mat + lab + tra + misc);
      const rec = Number(merged.amountReceived) || 0;
      const pend = income - rec;
      const profit = income - totExp;
      const profitPercent = income > 0 ? ((profit / income) * 100) : 0;

      return {
        ...merged,
        loanAmount: loan,
        customerMargin: margin,
        projectIncome: income,
        materialCost: mat,
        labourCost: lab,
        transportCost: tra,
        miscCost: misc,
        totalExpense: totExp,
        amountReceived: rec,
        amountPending: pend,
        profitLoss: profit,
        profitMargin: profitPercent
      };
    }
    return s;
  });
  const updated = memorySites.find((s) => s.id === id);
  if (updated) {
    saveSiteToDB(updated).catch((err) => console.warn('[Power24] Site Cloud Update Note:', err));
  }
  return memorySites;
};

export const deleteManagementSite = (id) => {
  memorySites = memorySites.filter((s) => s.id !== id);
  deleteSiteFromDB(id).catch((err) => console.warn('[Power24] Site Cloud Delete Note:', err));
  return memorySites;
};

// ==========================================
// 7. PROJECT EXPENSES (Direct Memory & Firestore)
// ==========================================

export const getManagementExpenses = () => {
  return memoryExpenses.map((e, idx) => ({
    ...e,
    id: e.id || `EXP-${String(idx + 1).padStart(3, '0')}`,
    amount: Number(e.amount) || 0,
    category: e.category || 'Misc',
    vendor: e.vendor || 'Vendor',
    date: e.date || '26.09.2026'
  }));
};

export const addManagementExpense = (expense) => {
  const nextNum = memoryExpenses.length + 1;
  const autoId = `EXP-${String(nextNum).padStart(3, '0')}`;
  const newExp = {
    ...expense,
    id: expense.id && expense.id.trim() ? expense.id.trim() : autoId,
    amount: Number(expense.amount) || 0,
    createdAt: new Date().toISOString()
  };
  memoryExpenses = [newExp, ...memoryExpenses];
  saveExpenseToDB(newExp).catch((err) => console.warn('[Power24] Expense Cloud Save Note:', err));
  return memoryExpenses;
};

export const updateManagementExpense = (id, updatedFields) => {
  memoryExpenses = memoryExpenses.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
  const updated = memoryExpenses.find((e) => e.id === id);
  if (updated) {
    saveExpenseToDB(updated).catch((err) => console.warn('[Power24] Expense Cloud Update Note:', err));
  }
  return memoryExpenses;
};

export const deleteManagementExpense = (id) => {
  memoryExpenses = memoryExpenses.filter((e) => e.id !== id);
  deleteExpenseFromDB(id).catch((err) => console.warn('[Power24] Expense Cloud Delete Note:', err));
  return memoryExpenses;
};

// ==========================================
// 8. PROJECT PAYMENTS (Direct Memory & Firestore)
// ==========================================

export const getManagementPayments = () => {
  return memoryPayments.map((p, idx) => ({
    ...p,
    id: p.id || `PAY-${String(idx + 1).padStart(3, '0')}`,
    amount: Number(p.amount) || 0,
    paymentType: p.paymentType || 'Customer Margin',
    date: p.date || '25.09.2026'
  }));
};

export const addManagementPayment = (payment) => {
  const nextNum = memoryPayments.length + 1;
  const autoId = `PAY-${String(nextNum).padStart(3, '0')}`;
  const newPay = {
    ...payment,
    id: payment.id && payment.id.trim() ? payment.id.trim() : autoId,
    amount: Number(payment.amount) || 0,
    createdAt: new Date().toISOString()
  };
  memoryPayments = [newPay, ...memoryPayments];
  savePaymentToDB(newPay).catch((err) => console.warn('[Power24] Payment Cloud Save Note:', err));
  return memoryPayments;
};

export const updateManagementPayment = (id, updatedFields) => {
  memoryPayments = memoryPayments.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
  const updated = memoryPayments.find((p) => p.id === id);
  if (updated) {
    savePaymentToDB(updated).catch((err) => console.warn('[Power24] Payment Cloud Update Note:', err));
  }
  return memoryPayments;
};

export const deleteManagementPayment = (id) => {
  memoryPayments = memoryPayments.filter((p) => p.id !== id);
  deletePaymentFromDB(id).catch((err) => console.warn('[Power24] Payment Cloud Delete Note:', err));
  return memoryPayments;
};

// ==========================================
// 9. MATERIAL BUDGETS (Direct Memory & Firestore)
// ==========================================

export const getManagementMaterialBudgets = () => {
  return memoryBudgets.map((b, idx) => ({
    ...b,
    id: b.id || `MAT-${String(idx + 1).padStart(3, '0')}`,
    qty: Number(b.qty) || 1,
    budgetRate: Number(b.budgetRate) || 0,
    budgetAmount: Number(b.budgetAmount) || 0,
    actualAmount: Number(b.actualAmount) || 0,
    variance: (Number(b.budgetAmount) || 0) - (Number(b.actualAmount) || 0)
  }));
};

export const addManagementBudgetItem = (item) => {
  const nextNum = memoryBudgets.length + 1;
  const autoId = `MAT-${String(nextNum).padStart(3, '0')}`;
  const qty = Number(item.qty) || 1;
  const budgetRate = Number(item.budgetRate) || 0;
  const budgetAmount = Number(item.budgetAmount) || qty * budgetRate;
  const actualAmount = Number(item.actualAmount) || 0;

  const newMat = {
    ...item,
    id: item.id && item.id.trim() ? item.id.trim() : autoId,
    qty,
    budgetRate,
    budgetAmount,
    actualAmount,
    variance: budgetAmount - actualAmount,
    createdAt: new Date().toISOString()
  };
  memoryBudgets = [newMat, ...memoryBudgets];
  saveBudgetToDB(newMat).catch((err) => console.warn('[Power24] Budget Cloud Save Note:', err));
  return memoryBudgets;
};

export const updateManagementBudgetItem = (id, updatedFields) => {
  memoryBudgets = memoryBudgets.map((b) => {
    if (b.id === id) {
      const merged = { ...b, ...updatedFields };
      const qty = Number(merged.qty) || 1;
      const budgetRate = Number(merged.budgetRate) || 0;
      const budgetAmount = Number(merged.budgetAmount) || qty * budgetRate;
      const actualAmount = Number(merged.actualAmount) || 0;
      return {
        ...merged,
        qty,
        budgetRate,
        budgetAmount,
        actualAmount,
        variance: budgetAmount - actualAmount
      };
    }
    return b;
  });
  const updated = memoryBudgets.find((b) => b.id === id);
  if (updated) {
    saveBudgetToDB(updated).catch((err) => console.warn('[Power24] Budget Cloud Update Note:', err));
  }
  return memoryBudgets;
};

export const deleteManagementBudgetItem = (id) => {
  memoryBudgets = memoryBudgets.filter((b) => b.id !== id);
  deleteBudgetFromDB(id).catch((err) => console.warn('[Power24] Budget Cloud Delete Note:', err));
  return memoryBudgets;
};

export const saveManagementMaterialBudget = (items) => {
  memoryBudgets = Array.isArray(items) ? items : [];
  for (const it of memoryBudgets) {
    saveBudgetToDB(it).catch((err) => console.warn('[Power24] Budget Batch Save Note:', err));
  }
  return memoryBudgets;
};

// ==========================================
// 10. AUTHENTICATION (Session-based, isolated)
// ==========================================

export const getAdminAuth = () => {
  try {
    return sessionStorage.getItem('power24_admin_auth') === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuth = (isAuth) => {
  try {
    if (isAuth) {
      sessionStorage.setItem('power24_admin_auth', 'true');
    } else {
      sessionStorage.removeItem('power24_admin_auth');
    }
  } catch (err) {
    console.warn('[Power24] Session auth note:', err);
  }
};

export const getStaffAuth = () => {
  try {
    return sessionStorage.getItem('power24_staff_auth') === 'true';
  } catch {
    return false;
  }
};

export const getCurrentStaff = () => {
  try {
    const data = sessionStorage.getItem('power24_current_staff');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setStaffAuth = (isAuth, staffObj = null) => {
  try {
    if (isAuth) {
      sessionStorage.setItem('power24_staff_auth', 'true');
      if (staffObj) {
        sessionStorage.setItem('power24_current_staff', JSON.stringify(staffObj));
      }
    } else {
      sessionStorage.removeItem('power24_staff_auth');
      sessionStorage.removeItem('power24_current_staff');
    }
  } catch (err) {
    console.warn('[Power24] Staff session note:', err);
  }
};

export const logoutStaff = () => {
  setStaffAuth(false);
};

export const loginStaff = (email, password) => {
  const normEmail = (email || '').trim().toLowerCase();
  const list = getStaffList();
  const found = list.find((s) => (s.email || '').toLowerCase() === normEmail);
  if (!found) {
    return { success: false, error: 'Staff account not found with this email.' };
  }
  if (found.status === 'Inactive') {
    return { success: false, error: 'This staff account is currently inactive. Contact Admin.' };
  }
  if (found.password !== password) {
    return { success: false, error: 'Incorrect staff password.' };
  }
  setStaffAuth(true, found);
  return { success: true, staff: found };
};

export const getUsers = () => {
  return memoryUsers;
};

export const saveUser = (user) => {
  const existingIndex = memoryUsers.findIndex((u) => u.id === user.id || u.email === user.email);
  if (existingIndex >= 0) {
    memoryUsers[existingIndex] = { ...memoryUsers[existingIndex], ...user };
  } else {
    memoryUsers.push(user);
  }
  saveUserToDB(user).catch((err) => console.warn('[Power24] User Cloud Save Note:', err));
  return memoryUsers;
};

export const getUserByEmailOrPhone = (identifier) => {
  if (!identifier) return null;
  const norm = identifier.trim().toLowerCase();
  const digits = norm.replace(/\D/g, '');
  return memoryUsers.find((u) => {
    const uEmail = (u.email || '').toLowerCase().trim();
    const uPhone = (u.phone || '').replace(/\D/g, '');
    if (uEmail && uEmail === norm) return true;
    if (digits.length >= 7 && uPhone && (uPhone.endsWith(digits) || digits.endsWith(uPhone))) return true;
    return false;
  });
};

export const getUserByEmail = (email) => {
  return memoryUsers.find((u) => (u.email || '').toLowerCase() === (email || '').toLowerCase().trim());
};

export const getCurrentUser = () => {
  try {
    const data = sessionStorage.getItem('power24_current_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  try {
    if (user) {
      sessionStorage.setItem('power24_current_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('power24_current_user');
    }
  } catch (err) {
    console.warn('[Power24] User session note:', err);
  }
};

export const logoutUser = () => {
  setCurrentUser(null);
};

export const registerUser = (userData) => {
  const emailNorm = (userData.email || '').trim().toLowerCase();
  const existing = getUserByEmail(emailNorm);
  if (existing) {
    return { success: false, message: 'इस ईमेल से पहले से अकाउंट बना हुआ है।' };
  }
  const newUser = {
    id: `user-${Date.now()}`,
    name: (userData.name || '').trim(),
    email: emailNorm,
    phone: (userData.phone || '').trim(),
    password: userData.password,
    city: (userData.city || 'Gorakhpur').trim(),
    address: (userData.address || '').trim(),
    registeredAt: new Date().toISOString(),
    role: 'customer'
  };
  saveUser(newUser);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
};

export const loginUser = (emailOrPhone, password) => {
  const user = getUserByEmailOrPhone(emailOrPhone) || getUserByEmail(emailOrPhone);
  if (!user) {
    return { success: false, message: 'यह ईमेल या मोबाइल नंबर रजिस्टर्ड नहीं है।' };
  }
  if (user.password !== password) {
    return { success: false, message: 'पासवर्ड गलत है।' };
  }
  setCurrentUser(user);
  return { success: true, user };
};

export const getUserBookings = (user) => {
  if (!user) return [];
  const uId = typeof user === 'string' ? user : user.id;
  const uEmail = (typeof user === 'object' && user.email ? user.email : '').toLowerCase().trim();
  const uPhone = (typeof user === 'object' && user.phone ? user.phone : '').replace(/\D/g, '');

  return memoryBookings.filter((b) => {
    if (uId && b.userId && b.userId === uId) return true;
    if (uEmail && b.email && b.email.toLowerCase().trim() === uEmail) return true;
    if (uPhone.length >= 7 && b.phone && b.phone.replace(/\D/g, '').endsWith(uPhone.slice(-10))) return true;
    if (typeof user === 'object' && user.name && b.name && b.name.toLowerCase().trim() === user.name.toLowerCase().trim()) return true;
    return false;
  });
};

export const getUserOrders = (user) => {
  if (!user) return [];
  const uId = typeof user === 'string' ? user : user.id;
  const uEmail = (typeof user === 'object' && user.email ? user.email : '').toLowerCase().trim();
  const uPhone = (typeof user === 'object' && user.phone ? user.phone : '').replace(/\D/g, '');

  return memoryOrders.filter((o) => {
    if (uId && o.userId && o.userId === uId) return true;
    if (uEmail && o.email && o.email.toLowerCase().trim() === uEmail) return true;
    if (uPhone.length >= 7 && o.phone && o.phone.replace(/\D/g, '').endsWith(uPhone.slice(-10))) return true;
    if (typeof user === 'object' && user.name && (o.customerName || o.name) && (o.customerName || o.name).toLowerCase().trim() === user.name.toLowerCase().trim()) return true;
    return false;
  });
};

export const initFirebaseAutoSync = () => {
  return true;
};

// ==========================================
// UTILITIES
// ==========================================

export const safeSetItem = () => {
  // No-op compatibility placeholder
  return true;
};

export const compressImageFile = (fileOrDataUrl, maxWidth = 900, maxHeight = 900, quality = 0.72) => {
  return new Promise((resolve) => {
    if (!fileOrDataUrl) {
      resolve(null);
      return;
    }

    if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://') || fileOrDataUrl.startsWith('/'))) {
      resolve(fileOrDataUrl);
      return;
    }

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(fileOrDataUrl);
      img.src = fileOrDataUrl;
      return;
    }

    if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        compressImageFile(e.target.result, maxWidth, maxHeight, quality).then(resolve);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(fileOrDataUrl);
      return;
    }

    resolve(fileOrDataUrl);
  });
};
