import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from './firebase';

// Collection Names in Firestore Database
export const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  BOOKINGS: 'bookings',
  GALLERY: 'gallery',
  CONTACTS: 'contact_messages',
  CUSTOM_KITS: 'custom_kits',
  USERS: 'users',
  STAFF_USERS: 'staff_users',
  MGMT_SITES: 'mgmt_sites',
  MGMT_EXPENSES: 'mgmt_expenses',
  MGMT_PAYMENTS: 'mgmt_payments',
  MGMT_BUDGETS: 'mgmt_budgets'
};

// Helper to remove any undefined or invalid fields before writing to Firestore
export const sanitizeForFirestore = (data) => {
  if (data === null || data === undefined) {
    return null;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item));
  }
  if (typeof data === 'object') {
    if (data.constructor && data.constructor.name === 'FieldValue') {
      return data;
    }
    const cleanObj = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeForFirestore(value);
      }
    }
    return cleanObj;
  }
  return data;
};

// ==========================================
// 1. PRODUCTS & KITS SERVICES
// ==========================================

export const fetchProductsFromDB = async () => {
  if (!db) return [];
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const snapshot = await getDocs(productsRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching products:', err);
    return [];
  }
};

export const subscribeProducts = (callback, onError) => {
  if (!db) return () => {};
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    return onSnapshot(
      productsRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Products snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeProducts init failed:', err);
    return () => {};
  }
};

export const seedInitialProducts = async (initialProducts) => {
  if (!db || !Array.isArray(initialProducts) || initialProducts.length === 0) return;
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) {
      for (const prod of initialProducts) {
        const docRef = doc(db, COLLECTIONS.PRODUCTS, String(prod.id));
        const cleanProd = sanitizeForFirestore({ ...prod, updatedAt: serverTimestamp() });
        await setDoc(docRef, cleanProd, { merge: true });
      }
      console.log('✅ [Power24 Firebase] Products initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed products note:', err);
  }
};

export const saveProductToDB = async (product) => {
  const productId = String(product.id || 'prod-' + Date.now());
  const payload = {
    ...product,
    id: productId,
    updatedAt: new Date().toISOString(),
    createdAt: product.createdAt || new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    const cleanPayload = sanitizeForFirestore({
      ...payload,
      updatedAt: serverTimestamp()
    });
    await setDoc(docRef, cleanPayload, { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving product to DB:', err);
    return payload;
  }
};

export const deleteProductFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting product from DB:', err);
    return false;
  }
};

// ==========================================
// 2. ORDERS (COD & ONLINE) SERVICES
// ==========================================

export const fetchOrdersFromDB = async () => {
  if (!db) return [];
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const snapshot = await getDocs(ordersRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return items;
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching orders:', err);
    return [];
  }
};

export const subscribeOrders = (callback, onError) => {
  if (!db) return () => {};
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    return onSnapshot(
      ordersRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Orders snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeOrders init failed:', err);
    return () => {};
  }
};

export const seedInitialOrders = async (initialOrders) => {
  if (!db || !Array.isArray(initialOrders) || initialOrders.length === 0) return;
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const snapshot = await getDocs(ordersRef);
    if (snapshot.empty) {
      for (const ord of initialOrders) {
        const docRef = doc(db, COLLECTIONS.ORDERS, String(ord.id));
        await setDoc(docRef, sanitizeForFirestore({ ...ord, syncedAt: serverTimestamp() }), { merge: true });
      }
      console.log('✅ [Power24 Firebase] Orders initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed orders note:', err);
  }
};

export const saveOrderToDB = async (orderData) => {
  const orderId = String(orderData.id || 'ORD-' + Math.floor(10000 + Math.random() * 90000));
  const payload = {
    ...orderData,
    id: orderId,
    status: orderData.status || 'Order Received',
    paymentMode: orderData.paymentMode || 'Cash on Delivery (COD)',
    createdAt: orderData.createdAt || new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const firestorePayload = {
      ...payload,
      timestamp: serverTimestamp()
    };
    await setDoc(docRef, sanitizeForFirestore(firestorePayload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving order to DB:', err);
    return payload;
  }
};

export const updateOrderStatusInDB = async (id, status) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, String(id));
    await updateDoc(docRef, sanitizeForFirestore({
      status,
      updatedAt: serverTimestamp()
    }));
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error updating order status in DB:', err);
    return false;
  }
};

export const deleteOrderFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting order from DB:', err);
    return false;
  }
};

// ==========================================
// 3. SITE SURVEY & BOOKINGS SERVICES
// ==========================================

export const fetchBookingsFromDB = async () => {
  if (!db) return [];
  try {
    const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);
    const snapshot = await getDocs(bookingsRef);
    if (!snapshot.empty) {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return items;
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching bookings:', err);
    return [];
  }
};

export const subscribeBookings = (callback, onError) => {
  if (!db) return () => {};
  try {
    const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);
    return onSnapshot(
      bookingsRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Bookings snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeBookings init failed:', err);
    return () => {};
  }
};

export const seedInitialBookings = async (initialBookings) => {
  if (!db || !Array.isArray(initialBookings) || initialBookings.length === 0) return;
  try {
    const bookingsRef = collection(db, COLLECTIONS.BOOKINGS);
    const snapshot = await getDocs(bookingsRef);
    if (snapshot.empty) {
      for (const bkg of initialBookings) {
        const docRef = doc(db, COLLECTIONS.BOOKINGS, String(bkg.id));
        await setDoc(docRef, sanitizeForFirestore({ ...bkg, syncedAt: serverTimestamp() }), { merge: true });
      }
      console.log('✅ [Power24 Firebase] Bookings initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed bookings note:', err);
  }
};

export const saveBookingToDB = async (bookingData) => {
  const bookingId = String(bookingData.id || 'lead-' + Date.now());
  const payload = {
    ...bookingData,
    id: bookingId,
    status: bookingData.status || 'Request Received',
    createdAt: bookingData.createdAt || new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    const firestorePayload = {
      ...payload,
      timestamp: serverTimestamp()
    };
    await setDoc(docRef, sanitizeForFirestore(firestorePayload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving booking to DB:', err);
    return payload;
  }
};

export const updateBookingStatusInDB = async (id, status) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, String(id));
    await updateDoc(docRef, sanitizeForFirestore({
      status,
      updatedAt: serverTimestamp()
    }));
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error updating booking status in DB:', err);
    return false;
  }
};

export const deleteBookingFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting booking from DB:', err);
    return false;
  }
};

// ==========================================
// 4. GALLERY SERVICES
// ==========================================

export const fetchGalleryFromDB = async () => {
  if (!db) return [];
  try {
    const galleryRef = collection(db, COLLECTIONS.GALLERY);
    const snapshot = await getDocs(galleryRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching gallery:', err);
    return [];
  }
};

export const subscribeGallery = (callback, onError) => {
  if (!db) return () => {};
  try {
    const galleryRef = collection(db, COLLECTIONS.GALLERY);
    return onSnapshot(
      galleryRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Gallery snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeGallery init failed:', err);
    return () => {};
  }
};

export const seedInitialGallery = async (initialGallery) => {
  if (!db || !Array.isArray(initialGallery) || initialGallery.length === 0) return;
  try {
    const galleryRef = collection(db, COLLECTIONS.GALLERY);
    const snapshot = await getDocs(galleryRef);
    if (snapshot.empty) {
      for (const item of initialGallery) {
        const docRef = doc(db, COLLECTIONS.GALLERY, String(item.id));
        await setDoc(docRef, sanitizeForFirestore({ ...item, syncedAt: serverTimestamp() }), { merge: true });
      }
      console.log('✅ [Power24 Firebase] Gallery initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed gallery note:', err);
  }
};

export const saveGalleryItemToDB = async (item) => {
  const itemId = String(item.id || 'gal-' + Date.now());
  const payload = {
    ...item,
    id: itemId,
    updatedAt: new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.GALLERY, itemId);
    const cleanPayload = sanitizeForFirestore({
      ...payload,
      updatedAt: serverTimestamp()
    });
    await setDoc(docRef, cleanPayload, { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving gallery item:', err);
    return payload;
  }
};

export const deleteGalleryItemFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.GALLERY, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting gallery item:', err);
    return false;
  }
};

// ==========================================
// 5. STAFF USERS SERVICES
// ==========================================

export const fetchStaffFromDB = async () => {
  if (!db) return [];
  try {
    const staffRef = collection(db, COLLECTIONS.STAFF_USERS);
    const snapshot = await getDocs(staffRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching staff:', err);
    return [];
  }
};

export const subscribeStaffUsers = (callback, onError) => {
  if (!db) return () => {};
  try {
    const staffRef = collection(db, COLLECTIONS.STAFF_USERS);
    return onSnapshot(
      staffRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Staff snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeStaffUsers init failed:', err);
    return () => {};
  }
};

export const seedInitialStaff = async (initialStaffMembers) => {
  if (!db || !Array.isArray(initialStaffMembers) || initialStaffMembers.length === 0) return;
  try {
    const staffRef = collection(db, COLLECTIONS.STAFF_USERS);
    const snapshot = await getDocs(staffRef);
    if (snapshot.empty) {
      for (const staff of initialStaffMembers) {
        const docRef = doc(db, COLLECTIONS.STAFF_USERS, String(staff.id));
        await setDoc(docRef, sanitizeForFirestore({ ...staff, syncedAt: serverTimestamp() }), { merge: true });
      }
      console.log('✅ [Power24 Firebase] Staff initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed staff note:', err);
  }
};

export const saveStaffToDB = async (staffData) => {
  const staffId = String(staffData.id || 'staff-' + Date.now());
  const payload = {
    ...staffData,
    id: staffId,
    updatedAt: new Date().toISOString(),
    createdAt: staffData.createdAt || new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.STAFF_USERS, staffId);
    await setDoc(docRef, sanitizeForFirestore(payload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving staff:', err);
    return payload;
  }
};

export const deleteStaffFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.STAFF_USERS, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting staff:', err);
    return false;
  }
};

// ==========================================
// 6. PROJECT MANAGEMENT SITES SERVICES
// ==========================================

export const fetchSitesFromDB = async () => {
  if (!db) return [];
  try {
    const sitesRef = collection(db, COLLECTIONS.MGMT_SITES);
    const snapshot = await getDocs(sitesRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching sites:', err);
    return [];
  }
};

export const subscribeSites = (callback, onError) => {
  if (!db) return () => {};
  try {
    const sitesRef = collection(db, COLLECTIONS.MGMT_SITES);
    return onSnapshot(
      sitesRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Sites snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeSites init failed:', err);
    return () => {};
  }
};

export const seedInitialSites = async (initialManagementSites) => {
  if (!db || !Array.isArray(initialManagementSites) || initialManagementSites.length === 0) return;
  try {
    const sitesRef = collection(db, COLLECTIONS.MGMT_SITES);
    const snapshot = await getDocs(sitesRef);
    if (snapshot.empty) {
      for (const site of initialManagementSites) {
        const docRef = doc(db, COLLECTIONS.MGMT_SITES, String(site.id));
        await setDoc(docRef, sanitizeForFirestore({ ...site, syncedAt: serverTimestamp() }), { merge: true });
      }
      console.log('✅ [Power24 Firebase] Sites initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed sites note:', err);
  }
};

export const saveSiteToDB = async (siteData) => {
  const siteId = String(siteData.id || 'site-' + Date.now());
  const payload = {
    ...siteData,
    id: siteId,
    updatedAt: new Date().toISOString(),
    createdAt: siteData.createdAt || new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.MGMT_SITES, siteId);
    await setDoc(docRef, sanitizeForFirestore(payload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving site:', err);
    return payload;
  }
};

export const deleteSiteFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.MGMT_SITES, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting site:', err);
    return false;
  }
};

// ==========================================
// 7. PROJECT MANAGEMENT EXPENSES SERVICES
// ==========================================

export const fetchExpensesFromDB = async () => {
  if (!db) return [];
  try {
    const expensesRef = collection(db, COLLECTIONS.MGMT_EXPENSES);
    const snapshot = await getDocs(expensesRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching expenses:', err);
    return [];
  }
};

export const subscribeExpenses = (callback, onError) => {
  if (!db) return () => {};
  try {
    const expensesRef = collection(db, COLLECTIONS.MGMT_EXPENSES);
    return onSnapshot(
      expensesRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Expenses snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeExpenses init failed:', err);
    return () => {};
  }
};

export const seedInitialExpenses = async (initialManagementExpenses) => {
  if (!db || !Array.isArray(initialManagementExpenses) || initialManagementExpenses.length === 0) return;
  try {
    const expensesRef = collection(db, COLLECTIONS.MGMT_EXPENSES);
    const snapshot = await getDocs(expensesRef);
    if (snapshot.empty) {
      for (const exp of initialManagementExpenses) {
        const docRef = doc(db, COLLECTIONS.MGMT_EXPENSES, String(exp.id));
        await setDoc(docRef, sanitizeForFirestore({ ...exp, syncedAt: serverTimestamp() }), { merge: true });
      }
      console.log('✅ [Power24 Firebase] Expenses initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed expenses note:', err);
  }
};

export const saveExpenseToDB = async (expenseData) => {
  const expenseId = String(expenseData.id || 'EXP-' + Date.now());
  const payload = {
    ...expenseData,
    id: expenseId,
    updatedAt: new Date().toISOString(),
    createdAt: expenseData.createdAt || new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.MGMT_EXPENSES, expenseId);
    await setDoc(docRef, sanitizeForFirestore(payload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving expense:', err);
    return payload;
  }
};

export const deleteExpenseFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.MGMT_EXPENSES, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting expense:', err);
    return false;
  }
};

// ==========================================
// 8. PROJECT MANAGEMENT PAYMENTS SERVICES
// ==========================================

export const fetchPaymentsFromDB = async () => {
  if (!db) return [];
  try {
    const paymentsRef = collection(db, COLLECTIONS.MGMT_PAYMENTS);
    const snapshot = await getDocs(paymentsRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching payments:', err);
    return [];
  }
};

export const subscribePayments = (callback, onError) => {
  if (!db) return () => {};
  try {
    const paymentsRef = collection(db, COLLECTIONS.MGMT_PAYMENTS);
    return onSnapshot(
      paymentsRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Payments snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribePayments init failed:', err);
    return () => {};
  }
};

export const seedInitialPayments = async (initialManagementPayments) => {
  if (!db || !Array.isArray(initialManagementPayments) || initialManagementPayments.length === 0) return;
  try {
    const paymentsRef = collection(db, COLLECTIONS.MGMT_PAYMENTS);
    const snapshot = await getDocs(paymentsRef);
    if (snapshot.empty) {
      for (const pay of initialManagementPayments) {
        const docRef = doc(db, COLLECTIONS.MGMT_PAYMENTS, String(pay.id));
        await setDoc(docRef, sanitizeForFirestore({ ...pay, syncedAt: serverTimestamp() }), { merge: true });
      }
      console.log('✅ [Power24 Firebase] Payments initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed payments note:', err);
  }
};

export const savePaymentToDB = async (paymentData) => {
  const paymentId = String(paymentData.id || 'PAY-' + Date.now());
  const payload = {
    ...paymentData,
    id: paymentId,
    updatedAt: new Date().toISOString(),
    createdAt: paymentData.createdAt || new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.MGMT_PAYMENTS, paymentId);
    await setDoc(docRef, sanitizeForFirestore(payload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving payment:', err);
    return payload;
  }
};

export const deletePaymentFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.MGMT_PAYMENTS, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting payment:', err);
    return false;
  }
};

// ==========================================
// 9. PROJECT MANAGEMENT BUDGETS SERVICES
// ==========================================

export const fetchBudgetsFromDB = async () => {
  if (!db) return [];
  try {
    const budgetsRef = collection(db, COLLECTIONS.MGMT_BUDGETS);
    const snapshot = await getDocs(budgetsRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching budgets:', err);
    return [];
  }
};

export const subscribeBudgets = (callback, onError) => {
  if (!db) return () => {};
  try {
    const budgetsRef = collection(db, COLLECTIONS.MGMT_BUDGETS);
    return onSnapshot(
      budgetsRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Budgets snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeBudgets init failed:', err);
    return () => {};
  }
};

export const seedInitialBudgets = async (initialMaterialBudgets) => {
  if (!db || !Array.isArray(initialMaterialBudgets) || initialMaterialBudgets.length === 0) return;
  try {
    const budgetsRef = collection(db, COLLECTIONS.MGMT_BUDGETS);
    const snapshot = await getDocs(budgetsRef);
    if (snapshot.empty) {
      for (const mat of initialMaterialBudgets) {
        const docRef = doc(db, COLLECTIONS.MGMT_BUDGETS, String(mat.id));
        await setDoc(docRef, sanitizeForFirestore({ ...mat, syncedAt: serverTimestamp() }), { merge: true });
      }
      console.log('✅ [Power24 Firebase] Budgets initial seed completed directly in Firestore.');
    }
  } catch (err) {
    console.warn('[Power24 Firebase] Seed budgets note:', err);
  }
};

export const saveBudgetToDB = async (budgetData) => {
  const budgetId = String(budgetData.id || 'MAT-' + Date.now());
  const payload = {
    ...budgetData,
    id: budgetId,
    updatedAt: new Date().toISOString(),
    createdAt: budgetData.createdAt || new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.MGMT_BUDGETS, budgetId);
    await setDoc(docRef, sanitizeForFirestore(payload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving budget:', err);
    return payload;
  }
};

export const deleteBudgetFromDB = async (id) => {
  if (!db) return true;
  try {
    const docRef = doc(db, COLLECTIONS.MGMT_BUDGETS, String(id));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('[Power24 Firebase] Error deleting budget:', err);
    return false;
  }
};

// ==========================================
// 10. CONTACT MESSAGES & CUSTOM KITS
// ==========================================

export const saveContactMessageToDB = async (contactData) => {
  const msgId = 'msg-' + Date.now();
  const payload = {
    ...contactData,
    id: msgId,
    createdAt: new Date().toISOString(),
    status: 'New Inquiry'
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.CONTACTS, msgId);
    const firestorePayload = {
      ...payload,
      timestamp: serverTimestamp()
    };
    await setDoc(docRef, sanitizeForFirestore(firestorePayload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving contact message:', err);
    return payload;
  }
};

export const subscribeContactMessages = (callback, onError) => {
  if (!db) return () => {};
  try {
    const contactsRef = collection(db, COLLECTIONS.CONTACTS);
    return onSnapshot(
      contactsRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Contacts snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeContactMessages init failed:', err);
    return () => {};
  }
};

export const saveCustomKitInquiryToDB = async (kitData) => {
  const kitId = 'custom-' + Date.now();
  const payload = {
    ...kitData,
    id: kitId,
    createdAt: new Date().toISOString(),
    status: 'Inquiry Pending'
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.CUSTOM_KITS, kitId);
    const firestorePayload = {
      ...payload,
      timestamp: serverTimestamp()
    };
    await setDoc(docRef, sanitizeForFirestore(firestorePayload), { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving custom kit inquiry:', err);
    return payload;
  }
};

// ==========================================
// 11. USERS SERVICES
// ==========================================

export const fetchUsersFromDB = async () => {
  if (!db) return [];
  try {
    const usersRef = collection(db, COLLECTIONS.USERS);
    const snapshot = await getDocs(usersRef);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    }
    return [];
  } catch (err) {
    console.error('[Power24 Firebase] Error fetching users:', err);
    return [];
  }
};

export const subscribeUsers = (callback, onError) => {
  if (!db) return () => {};
  try {
    const usersRef = collection(db, COLLECTIONS.USERS);
    return onSnapshot(
      usersRef,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        if (callback) callback(items);
      },
      (error) => {
        console.warn('[Power24 Firebase] Users snapshot error:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('[Power24 Firebase] subscribeUsers init failed:', err);
    return () => {};
  }
};

export const saveUserToDB = async (userData) => {
  const userId = String(userData.id || 'user-' + Date.now());
  const payload = {
    ...userData,
    id: userId,
    updatedAt: new Date().toISOString()
  };
  if (!db) return payload;
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const cleanPayload = sanitizeForFirestore({
      ...payload,
      updatedAt: serverTimestamp()
    });
    await setDoc(docRef, cleanPayload, { merge: true });
    return payload;
  } catch (err) {
    console.error('[Power24 Firebase] Error saving user to DB:', err);
    return payload;
  }
};
