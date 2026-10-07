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

export const initialProducts = [];
export const initialGallery = [];
export const initialBookings = [];
export const initialOrders = [];
export const initialStaffMembers = [];
export const initialUsers = [];
export const initialManagementSites = [];
export const initialManagementExpenses = [];
export const initialManagementPayments = [];
export const initialMaterialBudgets = [];

export const BOOKING_STATUS_STEPS = [
  { id: 1, label: 'Request Received', desc: 'Customer booked survey inquiry' },
  { id: 2, label: 'Survey Scheduled', desc: 'Engineer assigned & site visit date booked' },
  { id: 3, label: 'Site Survey Completed', desc: 'Shadow analysis & structure design finalized' },
  { id: 4, label: 'Installation Done', desc: 'Panels & Inverter mounted, net metering approved' },
  { id: 5, label: 'Completed', desc: 'DBT subsidy credited to customer bank account' },
  { id: 6, label: 'Cancelled', desc: 'Survey or project canceled by customer' }
];

// ==========================================
// PERSISTENT REALTIME LOCAL & CLOUD STORE
// ==========================================

export const STORAGE_KEYS = {
  PRODUCTS: 'power24_products',
  ORDERS: 'power24_orders',
  BOOKINGS: 'power24_bookings',
  GALLERY: 'power24_gallery',
  STAFF: 'power24_staff',
  USERS: 'power24_users',
  SITES: 'power24_mgmt_sites',
  EXPENSES: 'power24_mgmt_expenses',
  PAYMENTS: 'power24_mgmt_payments',
  BUDGETS: 'power24_mgmt_budgets',
};

export const loadFromStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === 'object') return parsed;
    }
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  } catch (err) {
    console.warn(`[Power24 Storage] Error reading ${key}:`, err);
    return fallback;
  }
};

export const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[Power24 Storage] Error saving ${key}:`, err);
  }
};

let memoryProducts = loadFromStorage(STORAGE_KEYS.PRODUCTS, []);
let memoryOrders = loadFromStorage(STORAGE_KEYS.ORDERS, []);
let memoryBookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, []);
let memoryGallery = loadFromStorage(STORAGE_KEYS.GALLERY, []);
let memoryStaff = loadFromStorage(STORAGE_KEYS.STAFF, []);
let memoryUsers = loadFromStorage(STORAGE_KEYS.USERS, []);
let memorySites = loadFromStorage(STORAGE_KEYS.SITES, []);
let memoryExpenses = loadFromStorage(STORAGE_KEYS.EXPENSES, []);
let memoryPayments = loadFromStorage(STORAGE_KEYS.PAYMENTS, []);
let memoryBudgets = loadFromStorage(STORAGE_KEYS.BUDGETS, []);

// Automatic Firestore Initial Synchronization and Subscriptions
if (typeof window !== 'undefined') {
  // Purge any stale legacy dummy records from browser localStorage
  const DUMMY_CLEANUP_KEY = 'power24_dummy_cleanup_v4';
  if (!localStorage.getItem(DUMMY_CLEANUP_KEY)) {
    const keysToClean = [
      STORAGE_KEYS.PRODUCTS,
      STORAGE_KEYS.ORDERS,
      STORAGE_KEYS.BOOKINGS,
      STORAGE_KEYS.GALLERY,
      STORAGE_KEYS.STAFF,
      STORAGE_KEYS.USERS,
      STORAGE_KEYS.SITES,
      STORAGE_KEYS.EXPENSES,
      STORAGE_KEYS.PAYMENTS,
      STORAGE_KEYS.BUDGETS,
      'power24_firestore_seeded_staff'
    ];
    keysToClean.forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(DUMMY_CLEANUP_KEY, 'true');
    memoryProducts = [];
    memoryOrders = [];
    memoryBookings = [];
    memoryGallery = [];
    memoryStaff = [];
    memoryUsers = [];
    memorySites = [];
    memoryExpenses = [];
    memoryPayments = [];
    memoryBudgets = [];
  }

  // 2. Realtime Subscriptions directly updating in-memory & local storage stores
  subscribeProducts((items) => {
    if (Array.isArray(items)) {
      memoryProducts = items;
      saveToStorage(STORAGE_KEYS.PRODUCTS, items);
      window.dispatchEvent(new Event('power24_products_updated'));
    }
  });

  subscribeOrders((items) => {
    if (Array.isArray(items)) {
      memoryOrders = items;
      saveToStorage(STORAGE_KEYS.ORDERS, items);
      window.dispatchEvent(new Event('power24_orders_updated'));
    }
  });

  subscribeBookings((items) => {
    if (Array.isArray(items)) {
      memoryBookings = items;
      saveToStorage(STORAGE_KEYS.BOOKINGS, items);
      window.dispatchEvent(new Event('power24_bookings_updated'));
    }
  });

  subscribeGallery((items) => {
    if (Array.isArray(items)) {
      memoryGallery = items;
      saveToStorage(STORAGE_KEYS.GALLERY, items);
      window.dispatchEvent(new Event('power24_gallery_updated'));
    }
  });

  subscribeStaffUsers((items) => {
    if (Array.isArray(items)) {
      memoryStaff = items;
      saveToStorage(STORAGE_KEYS.STAFF, items);
      window.dispatchEvent(new Event('power24_staff_updated'));
    }
  });

  subscribeSites((items) => {
    if (Array.isArray(items)) {
      memorySites = items;
      saveToStorage(STORAGE_KEYS.SITES, items);
      window.dispatchEvent(new Event('power24_sites_updated'));
    }
  });

  subscribeExpenses((items) => {
    if (Array.isArray(items)) {
      memoryExpenses = items;
      saveToStorage(STORAGE_KEYS.EXPENSES, items);
      window.dispatchEvent(new Event('power24_expenses_updated'));
    }
  });

  subscribePayments((items) => {
    if (Array.isArray(items)) {
      memoryPayments = items;
      saveToStorage(STORAGE_KEYS.PAYMENTS, items);
      window.dispatchEvent(new Event('power24_payments_updated'));
    }
  });

  subscribeBudgets((items) => {
    if (Array.isArray(items)) {
      memoryBudgets = items;
      saveToStorage(STORAGE_KEYS.BUDGETS, items);
      window.dispatchEvent(new Event('power24_budgets_updated'));
    }
  });
}

// ==========================================
// 1. PRODUCTS & KITS SERVICES (Direct Memory, LocalStorage & Firestore)
// ==========================================

export const getProducts = () => {
  return memoryProducts;
};

export const addProduct = (prod) => {
  const isKit = prod.isKit || prod.category === 'kits';
  const autoId = isKit ? `kit-${Date.now()}` : `prod-${Date.now()}`;
  const rate = Number(prod.ratePerWatt) || 0;
  const newProd = {
    id: prod.id && prod.id.trim() ? prod.id.trim() : autoId,
    name: prod.name || (isKit ? 'New Solar Kit' : 'New Solar Product'),
    category: prod.category || (isKit ? 'kits' : 'panels'),
    isKit: Boolean(isKit),
    ratePerWatt: rate || prod.ratePerWatt || '',
    efficiency: prod.efficiency || '',
    warranty: prod.warranty || '',
    description: prod.description || '',
    features: Array.isArray(prod.features) ? prod.features : (prod.features ? [prod.features] : []),
    tag: prod.tag || (isKit ? 'Solar Kit' : 'Hardware'),
    image: prod.image || solarHeroImg,
    images: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : [prod.image || solarHeroImg],
    manualPrice: prod.manualPrice !== undefined && prod.manualPrice !== '' ? prod.manualPrice : '',
    manualGross: prod.manualGross !== undefined && prod.manualGross !== '' ? prod.manualGross : '',
    manualSubsidy: prod.manualSubsidy !== undefined && prod.manualSubsidy !== '' ? prod.manualSubsidy : (isKit ? 30000 : ''),
    priceLabel: prod.priceLabel || (isKit ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price'),
    price: prod.price || (rate ? `₹${rate} / Watt` : ''),
    capacityPricing: prod.capacityPricing || {},
    createdAt: new Date().toISOString()
  };
  memoryProducts = [newProd, ...memoryProducts];
  saveToStorage(STORAGE_KEYS.PRODUCTS, memoryProducts);
  window.dispatchEvent(new Event('power24_products_updated'));
  saveProductToDB(newProd).catch((err) => console.warn('[Power24] Product Cloud Save Note:', err));
  return memoryProducts;
};

export const updateProduct = (id, updatedFields) => {
  memoryProducts = memoryProducts.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
  saveToStorage(STORAGE_KEYS.PRODUCTS, memoryProducts);
  window.dispatchEvent(new Event('power24_products_updated'));
  const updatedItem = memoryProducts.find((p) => p.id === id);
  if (updatedItem) {
    saveProductToDB(updatedItem).catch((err) => console.warn('[Power24] Product Update Cloud Note:', err));
  }
  return memoryProducts;
};

export const deleteProduct = (id) => {
  memoryProducts = memoryProducts.filter((p) => p.id !== id);
  saveToStorage(STORAGE_KEYS.PRODUCTS, memoryProducts);
  window.dispatchEvent(new Event('power24_products_updated'));
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
// 2. ORDERS (Direct Memory, LocalStorage & Firestore)
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
  saveToStorage(STORAGE_KEYS.ORDERS, memoryOrders);
  window.dispatchEvent(new Event('power24_orders_updated'));
  saveOrderToDB(entry).catch((err) => console.warn('[Power24] Order Cloud Sync Note:', err));
  return entry;
};

export const updateOrderStatus = (id, status) => {
  memoryOrders = memoryOrders.map((o) => (o.id === id ? { ...o, status } : o));
  saveToStorage(STORAGE_KEYS.ORDERS, memoryOrders);
  window.dispatchEvent(new Event('power24_orders_updated'));
  updateOrderStatusInDB(id, status).catch((err) => console.warn('[Power24] Order Status Cloud Sync Note:', err));
  return memoryOrders;
};

export const deleteOrder = (id) => {
  memoryOrders = memoryOrders.filter((o) => o.id !== id);
  saveToStorage(STORAGE_KEYS.ORDERS, memoryOrders);
  window.dispatchEvent(new Event('power24_orders_updated'));
  deleteOrderFromDB(id).catch((err) => console.warn('[Power24] Order Delete Cloud Sync Note:', err));
  return memoryOrders;
};

// ==========================================
// 3. BOOKINGS & SITE SURVEY (Direct Memory, LocalStorage & Firestore)
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
  saveToStorage(STORAGE_KEYS.BOOKINGS, memoryBookings);
  window.dispatchEvent(new Event('power24_bookings_updated'));
  saveBookingToDB(entry).catch((err) => console.warn('[Power24] Booking Cloud Sync Note:', err));
  return entry;
};

export const updateBookingStatus = (id, status) => {
  memoryBookings = memoryBookings.map((b) => (b.id === id ? { ...b, status } : b));
  saveToStorage(STORAGE_KEYS.BOOKINGS, memoryBookings);
  window.dispatchEvent(new Event('power24_bookings_updated'));
  updateBookingStatusInDB(id, status).catch((err) => console.warn('[Power24] Booking Status Cloud Sync Note:', err));
  return memoryBookings;
};

export const deleteBooking = (id) => {
  memoryBookings = memoryBookings.filter((b) => b.id !== id);
  saveToStorage(STORAGE_KEYS.BOOKINGS, memoryBookings);
  window.dispatchEvent(new Event('power24_bookings_updated'));
  deleteBookingFromDB(id).catch((err) => console.warn('[Power24] Booking Delete Cloud Note:', err));
  return memoryBookings;
};

// ==========================================
// 4. GALLERY SERVICES (Direct Memory, LocalStorage & Firestore)
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
  saveToStorage(STORAGE_KEYS.GALLERY, memoryGallery);
  window.dispatchEvent(new Event('power24_gallery_updated'));
  saveGalleryItemToDB(newItem).catch((err) => console.warn('[Power24] Gallery Cloud Save Note:', err));
  return memoryGallery;
};

export const updateGalleryItem = (id, updatedFields) => {
  memoryGallery = memoryGallery.map((g) => (g.id === id ? { ...g, ...updatedFields } : g));
  saveToStorage(STORAGE_KEYS.GALLERY, memoryGallery);
  window.dispatchEvent(new Event('power24_gallery_updated'));
  const updated = memoryGallery.find((g) => g.id === id);
  if (updated) {
    saveGalleryItemToDB(updated).catch((err) => console.warn('[Power24] Gallery Cloud Update Note:', err));
  }
  return memoryGallery;
};

export const deleteGalleryItem = (id) => {
  memoryGallery = memoryGallery.filter((g) => g.id !== id);
  saveToStorage(STORAGE_KEYS.GALLERY, memoryGallery);
  window.dispatchEvent(new Event('power24_gallery_updated'));
  deleteGalleryItemFromDB(id).catch((err) => console.warn('[Power24] Gallery Cloud Delete Note:', err));
  return memoryGallery;
};

// ==========================================
// 5. STAFF PORTAL SERVICES (Direct Memory, LocalStorage & Firestore)
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
  saveToStorage(STORAGE_KEYS.STAFF, memoryStaff);
  window.dispatchEvent(new Event('power24_staff_updated'));
  saveStaffToDB(newStaff).catch((err) => console.warn('[Power24] Staff Cloud Save Note:', err));
  return memoryStaff;
};

export const updateStaffMember = (id, updatedFields) => {
  memoryStaff = memoryStaff.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
  saveToStorage(STORAGE_KEYS.STAFF, memoryStaff);
  window.dispatchEvent(new Event('power24_staff_updated'));
  const updated = memoryStaff.find((s) => s.id === id);
  if (updated) {
    saveStaffToDB(updated).catch((err) => console.warn('[Power24] Staff Cloud Update Note:', err));
  }
  return memoryStaff;
};

export const deleteStaffMember = (id) => {
  memoryStaff = memoryStaff.filter((s) => s.id !== id);
  saveToStorage(STORAGE_KEYS.STAFF, memoryStaff);
  window.dispatchEvent(new Event('power24_staff_updated'));
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
// 6. SOLAR PROJECT MANAGEMENT SITES (Direct Memory, LocalStorage & Firestore)
// ==========================================

export const getManagementSites = () => {
  return memorySites.map((s, idx) => ({
    ...s,
    id: s.id || `P24-${String(idx + 1).padStart(3, '0')}`,
    customerName: s.customerName || s.clientName || s.name || '',
    siteAddress: s.siteAddress || s.location || '',
    district: s.district || '',
    capacity: s.capacity || '',
    projectValue: Number(s.projectValue) || Number(s.projectIncome) || 0,
    loanAmount: s.loanAmount !== undefined ? Number(s.loanAmount) : Number(s.projectIncome) || 0,
    customerMargin: s.customerMargin !== undefined ? Number(s.customerMargin) : 0,
    projectIncome: Number(s.projectIncome) || (Number(s.loanAmount || 0) + Number(s.customerMargin || 0)) || 0,
    materialCost: Number(s.materialCost) || 0,
    labourCost: Number(s.labourCost) || 0,
    transportCost: Number(s.transportCost) || 0,
    miscCost: Number(s.miscCost) || 0,
    totalExpense: Number(s.totalExpense) || ((Number(s.materialCost) || 0) + (Number(s.labourCost) || 0) + (Number(s.transportCost) || 0) + (Number(s.miscCost) || 0)),
    amountReceived: Number(s.amountReceived) || 0,
    amountPending: s.amountPending !== undefined ? Number(s.amountPending) : (Number(s.projectIncome || 0) - Number(s.amountReceived || 0)),
    profitLoss: s.profitLoss !== undefined ? Number(s.profitLoss) : 0,
    profitMargin: s.profitMargin !== undefined ? Number(s.profitMargin) : 0,
    siteStatus: s.siteStatus || s.status || 'Running',
    startDate: s.startDate || '',
    completionDate: s.completionDate || '',
    remarks: s.remarks || s.notes || ''
  }));
};

export const addManagementSite = (site) => {
  const nextNum = memorySites.length + 1;
  const autoId = `P24-${String(nextNum).padStart(3, '0')}`;
  const loan = Number(site.loanAmount) || 0;
  const margin = Number(site.customerMargin) || 0;
  const income = (loan + margin) > 0 ? (loan + margin) : (Number(site.projectIncome) || Number(site.projectValue) || 0);
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
    customerName: site.customerName || site.clientName || '',
    siteAddress: site.siteAddress || site.location || '',
    district: site.district || '',
    projectValue: Number(site.projectValue) || 0,
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
    startDate: site.startDate || '',
    completionDate: site.completionDate || '',
    remarks: site.remarks || '',
    createdAt: new Date().toISOString()
  };
  memorySites = [newSite, ...memorySites];
  saveToStorage(STORAGE_KEYS.SITES, memorySites);
  window.dispatchEvent(new Event('power24_sites_updated'));
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
  saveToStorage(STORAGE_KEYS.SITES, memorySites);
  window.dispatchEvent(new Event('power24_sites_updated'));
  const updated = memorySites.find((s) => s.id === id);
  if (updated) {
    saveSiteToDB(updated).catch((err) => console.warn('[Power24] Site Cloud Update Note:', err));
  }
  return memorySites;
};

export const deleteManagementSite = (id) => {
  memorySites = memorySites.filter((s) => s.id !== id);
  saveToStorage(STORAGE_KEYS.SITES, memorySites);
  window.dispatchEvent(new Event('power24_sites_updated'));
  deleteSiteFromDB(id).catch((err) => console.warn('[Power24] Site Cloud Delete Note:', err));
  return memorySites;
};

// ==========================================
// 7. PROJECT EXPENSES (Direct Memory, LocalStorage & Firestore)
// ==========================================

export const getManagementExpenses = () => {
  return memoryExpenses.map((e, idx) => ({
    ...e,
    id: e.id || `EXP-${String(idx + 1).padStart(3, '0')}`,
    amount: Number(e.amount) || 0,
    category: e.category || 'Misc',
    vendor: e.vendor || '',
    date: e.date || ''
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
  saveToStorage(STORAGE_KEYS.EXPENSES, memoryExpenses);
  window.dispatchEvent(new Event('power24_expenses_updated'));
  saveExpenseToDB(newExp).catch((err) => console.warn('[Power24] Expense Cloud Save Note:', err));
  return memoryExpenses;
};

export const updateManagementExpense = (id, updatedFields) => {
  memoryExpenses = memoryExpenses.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
  saveToStorage(STORAGE_KEYS.EXPENSES, memoryExpenses);
  window.dispatchEvent(new Event('power24_expenses_updated'));
  const updated = memoryExpenses.find((e) => e.id === id);
  if (updated) {
    saveExpenseToDB(updated).catch((err) => console.warn('[Power24] Expense Cloud Update Note:', err));
  }
  return memoryExpenses;
};

export const deleteManagementExpense = (id) => {
  memoryExpenses = memoryExpenses.filter((e) => e.id !== id);
  saveToStorage(STORAGE_KEYS.EXPENSES, memoryExpenses);
  window.dispatchEvent(new Event('power24_expenses_updated'));
  deleteExpenseFromDB(id).catch((err) => console.warn('[Power24] Expense Cloud Delete Note:', err));
  return memoryExpenses;
};

// ==========================================
// 8. PROJECT PAYMENTS (Direct Memory, LocalStorage & Firestore)
// ==========================================

export const getManagementPayments = () => {
  return memoryPayments.map((p, idx) => ({
    ...p,
    id: p.id || `PAY-${String(idx + 1).padStart(3, '0')}`,
    amount: Number(p.amount) || 0,
    paymentType: p.paymentType || 'Customer Margin',
    disbursementStage: p.disbursementStage || (String(p.paymentType).includes('2') ? 'Disbursement 2' : String(p.paymentType).includes('1') ? 'Disbursement 1' : ''),
    date: p.date || ''
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
  saveToStorage(STORAGE_KEYS.PAYMENTS, memoryPayments);
  window.dispatchEvent(new Event('power24_payments_updated'));
  savePaymentToDB(newPay).catch((err) => console.warn('[Power24] Payment Cloud Save Note:', err));
  return memoryPayments;
};

export const updateManagementPayment = (id, updatedFields) => {
  memoryPayments = memoryPayments.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
  saveToStorage(STORAGE_KEYS.PAYMENTS, memoryPayments);
  window.dispatchEvent(new Event('power24_payments_updated'));
  const updated = memoryPayments.find((p) => p.id === id);
  if (updated) {
    savePaymentToDB(updated).catch((err) => console.warn('[Power24] Payment Cloud Update Note:', err));
  }
  return memoryPayments;
};

export const deleteManagementPayment = (id) => {
  memoryPayments = memoryPayments.filter((p) => p.id !== id);
  saveToStorage(STORAGE_KEYS.PAYMENTS, memoryPayments);
  window.dispatchEvent(new Event('power24_payments_updated'));
  deletePaymentFromDB(id).catch((err) => console.warn('[Power24] Payment Cloud Delete Note:', err));
  return memoryPayments;
};

// ==========================================
// 9. MATERIAL BUDGETS (Direct Memory, LocalStorage & Firestore)
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
  saveToStorage(STORAGE_KEYS.BUDGETS, memoryBudgets);
  window.dispatchEvent(new Event('power24_budgets_updated'));
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
  saveToStorage(STORAGE_KEYS.BUDGETS, memoryBudgets);
  window.dispatchEvent(new Event('power24_budgets_updated'));
  const updated = memoryBudgets.find((b) => b.id === id);
  if (updated) {
    saveBudgetToDB(updated).catch((err) => console.warn('[Power24] Budget Cloud Update Note:', err));
  }
  return memoryBudgets;
};

export const deleteManagementBudgetItem = (id) => {
  memoryBudgets = memoryBudgets.filter((b) => b.id !== id);
  saveToStorage(STORAGE_KEYS.BUDGETS, memoryBudgets);
  window.dispatchEvent(new Event('power24_budgets_updated'));
  deleteBudgetFromDB(id).catch((err) => console.warn('[Power24] Budget Cloud Delete Note:', err));
  return memoryBudgets;
};

export const saveManagementMaterialBudget = (items) => {
  memoryBudgets = Array.isArray(items) ? items : [];
  saveToStorage(STORAGE_KEYS.BUDGETS, memoryBudgets);
  window.dispatchEvent(new Event('power24_budgets_updated'));
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
  saveToStorage(STORAGE_KEYS.USERS, memoryUsers);
  window.dispatchEvent(new Event('power24_users_updated'));
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('power24_user_updated'));
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
    // 1. Unique Match by User ID
    if (uId && b.userId && String(b.userId) === String(uId)) return true;
    // 2. Unique Match by Verified Email Address
    if (uEmail && b.email && b.email.toLowerCase().trim() === uEmail) return true;
    // 3. Unique Match by 10-Digit Mobile Number
    if (uPhone.length >= 10 && b.phone) {
      const bPhoneClean = b.phone.replace(/\D/g, '');
      if (bPhoneClean.length >= 10 && bPhoneClean.slice(-10) === uPhone.slice(-10)) return true;
    }
    return false;
  });
};

export const getUserOrders = (user) => {
  if (!user) return [];
  const uId = typeof user === 'string' ? user : user.id;
  const uEmail = (typeof user === 'object' && user.email ? user.email : '').toLowerCase().trim();
  const uPhone = (typeof user === 'object' && user.phone ? user.phone : '').replace(/\D/g, '');

  return memoryOrders.filter((o) => {
    // 1. Unique Match by User ID
    if (uId && o.userId && String(o.userId) === String(uId)) return true;
    // 2. Unique Match by Verified Email Address
    if (uEmail && o.email && o.email.toLowerCase().trim() === uEmail) return true;
    // 3. Unique Match by 10-Digit Mobile Number
    if (uPhone.length >= 10 && o.phone) {
      const oPhoneClean = o.phone.replace(/\D/g, '');
      if (oPhoneClean.length >= 10 && oPhoneClean.slice(-10) === uPhone.slice(-10)) return true;
    }
    return false;
  });
};

export const initFirebaseAutoSync = () => {
  return true;
};

// ==========================================
// UTILITIES
// ==========================================

export const safeSetItem = (key, value) => {
  if (typeof window === 'undefined') return true;
  try {
    const valStr = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, valStr);
    return true;
  } catch (err) {
    console.warn('[Power24] safeSetItem note:', err);
    return false;
  }
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
