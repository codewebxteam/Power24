import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sun,
  LogOut,
  CalendarCheck,
  PackagePlus,
  Image,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Tag,
  Zap,
  DollarSign,
  Upload,
  X,
  Eye,
  AlertCircle,
  LayoutDashboard,
  Menu,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  BarChart3,
  FileText,
  Sliders,
  Check,
  Sparkles,
  Pencil,
  ShoppingBag,
  Truck,
  MessageCircle,
  Users,
  KeyRound,
  Copy,
  EyeOff,
  UserCheck,
  UserX,
  Lock
} from 'lucide-react';
import {
  getAdminAuth,
  setAdminAuth,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getGalleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getManagementSites,
  getManagementExpenses,
  getManagementPayments,
  getStaffList,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
  toggleStaffStatus,
  BOOKING_STATUS_STEPS,
  compressImageFile
} from '../../utils/storage';
import {
  subscribeBookings,
  subscribeOrders,
  subscribeProducts,
  subscribeGallery,
  subscribeContactMessages,
  subscribeStaffUsers,
  subscribeSites,
  subscribeExpenses,
  subscribePayments
} from '../../firebase/firestoreService';
import ProjectManagement from '../../components/Admin/Management/ProjectManagement.jsx';
const solarHeroImg = 'https://ik.imagekit.io/qvztwdsij/solar%20hero%20-%20Copy.png?updatedAt=1790432262362';

const getAdminStatusMeta = (status) => {
  const norm = (status || '').toLowerCase().trim();
  if (norm === 'installation done' || norm === 'completed') {
    return {
      bg: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      label: 'Installation Done',
      badge: 'Installation Done',
      step: 4
    };
  }
  if (norm === 'subsidy approval') {
    return {
      bg: 'bg-purple-100 text-purple-800 border border-purple-300',
      label: 'Subsidy Approval',
      badge: 'Subsidy Approval',
      step: 3
    };
  }
  if (norm === 'site inspection' || norm === 'scheduled' || norm === 'contacted') {
    return {
      bg: 'bg-blue-100 text-blue-800 border border-blue-300',
      label: 'Site Inspection',
      badge: 'Site Inspection',
      step: 2
    };
  }
  if (norm === 'cancelled') {
    return {
      bg: 'bg-rose-100 text-rose-800 border border-rose-300',
      label: 'Cancelled',
      badge: 'Cancelled',
      step: 0
    };
  }
  return {
    bg: 'bg-amber-100 text-amber-800 border border-amber-300',
    label: 'Request Received',
    badge: 'Request Received',
    step: 1
  };
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Auth protection
  useEffect(() => {
    if (!getAdminAuth()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bookings' | 'orders' | 'products' | 'gallery' | 'management'

  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [mgmtSites, setMgmtSites] = useState([]);
  const [mgmtExpenses, setMgmtExpenses] = useState([]);
  const [mgmtPayments, setMgmtPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Orders Filter
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [adminProductFilter, setAdminProductFilter] = useState('all'); // 'all' | 'single' | 'kits'

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [productType, setProductType] = useState('kit'); // 'kit' | 'product'

  // Quick Manual Price Editor Modal State
  const [showQuickPriceModal, setShowQuickPriceModal] = useState(false);
  const [quickPriceProduct, setQuickPriceProduct] = useState(null);
  const [quickPriceForm, setQuickPriceForm] = useState({
    manualPrice: 35000,
    manualGross: 65000,
    manualSubsidy: 30000,
    priceLabel: 'Effective 1kW Price (After Subsidy)',
    price: '',
    capacityPricing: {},
  });

  // New Product / Kit Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'kits',
    isKit: true,
    efficiency: 'Tier-1 High Yield',
    warranty: '25-Year Tata / Tier-1 Linear Warranty',
    description: '',
    features: 'High Efficiency Solar Modules, Smart Dual MPPT Inverter, GI Structure & DC Cabling, Net Metering Approval',
    tag: 'Solar Kit',
    image: '',
    images: [],
    price: '₹24 / Watt',
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
  });
  const [newProductUrlInput, setNewProductUrlInput] = useState('');
  const [editProductUrlInput, setEditProductUrlInput] = useState('');

  // New Gallery Form State
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'residential',
    location: 'Gorakhpur, UP',
    capacity: '5 kW System',
    savings: '85% Bill Cut',
    image: '',
  });
  const [showEditGalleryModal, setShowEditGalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editGalleryUrlInput, setEditGalleryUrlInput] = useState('');

  // Staff Management State
  const [staffList, setStaffList] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffStatusFilter, setStaffStatusFilter] = useState('all'); // 'all' | 'Active' | 'Inactive'
  const [showAddStaffPassword, setShowAddStaffPassword] = useState(false);
  const [showEditStaffPassword, setShowEditStaffPassword] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Solar Project Incharge',
    department: 'Solar Project Operations',
    badgeId: '',
    status: 'Active',
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Load Data
  const refreshData = () => {
    setBookings(getBookings());
    setOrders(getOrders());
    setProducts(getProducts());
    setGallery(getGalleryItems());
    setMgmtSites(getManagementSites());
    setMgmtExpenses(getManagementExpenses());
    setMgmtPayments(getManagementPayments());
    setStaffList(getStaffList());
  };

  useEffect(() => {
    refreshData();
    const unsubBookings = subscribeBookings((data) => setBookings(data));
    const unsubOrders = subscribeOrders((data) => setOrders(data));
    const unsubProducts = subscribeProducts((data) => setProducts(data));
    const unsubGallery = subscribeGallery((data) => setGallery(data));
    const unsubStaff = subscribeStaffUsers((data) => setStaffList(data));
    const unsubSites = subscribeSites((data) => setMgmtSites(data));
    const unsubExpenses = subscribeExpenses((data) => setMgmtExpenses(data));
    const unsubPayments = subscribePayments((data) => setMgmtPayments(data));

    const handleDataSync = () => {
      refreshData();
    };
    window.addEventListener('power24_products_updated', handleDataSync);
    window.addEventListener('power24_orders_updated', handleDataSync);
    window.addEventListener('power24_bookings_updated', handleDataSync);
    window.addEventListener('power24_gallery_updated', handleDataSync);
    window.addEventListener('power24_staff_updated', handleDataSync);
    window.addEventListener('power24_sites_updated', handleDataSync);
    window.addEventListener('power24_expenses_updated', handleDataSync);
    window.addEventListener('power24_payments_updated', handleDataSync);

    return () => {
      if (typeof unsubBookings === 'function') unsubBookings();
      if (typeof unsubOrders === 'function') unsubOrders();
      if (typeof unsubProducts === 'function') unsubProducts();
      if (typeof unsubGallery === 'function') unsubGallery();
      if (typeof unsubStaff === 'function') unsubStaff();
      if (typeof unsubSites === 'function') unsubSites();
      if (typeof unsubExpenses === 'function') unsubExpenses();
      if (typeof unsubPayments === 'function') unsubPayments();
      window.removeEventListener('power24_products_updated', handleDataSync);
      window.removeEventListener('power24_orders_updated', handleDataSync);
      window.removeEventListener('power24_bookings_updated', handleDataSync);
      window.removeEventListener('power24_gallery_updated', handleDataSync);
      window.removeEventListener('power24_staff_updated', handleDataSync);
      window.removeEventListener('power24_sites_updated', handleDataSync);
      window.removeEventListener('power24_expenses_updated', handleDataSync);
      window.removeEventListener('power24_payments_updated', handleDataSync);
    };
  }, []);

  const handleLogout = () => {
    setAdminAuth(false);
    navigate('/admin/login');
  };

  // Image Upload helper with automatic compression (~30KB-50KB)
  const handleImageFileChange = async (e, callback) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 900, 900, 0.72);
        if (compressed) callback(compressed);
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }
  };

  // Multiple Images Upload helper with compression
  const handleMultiImageUpload = async (e, currentImages, setImages) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const compressedList = await Promise.all(
        files.map((file) => compressImageFile(file, 900, 900, 0.72))
      );
      const validImages = compressedList.filter(Boolean);
      setImages([...(currentImages || []), ...validImages]);
    } catch (err) {
      console.error('Multi-image upload compression error:', err);
    }
  };

  // Booking Handlers
  const handleStatusChange = (id, newStatus) => {
    const updated = updateBookingStatus(id, newStatus);
    setBookings(updated);
    showToast(`Status updated to "${newStatus}"`);
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm('Delete this inquiry record?')) {
      const updated = deleteBooking(id);
      setBookings(updated);
      showToast('Inquiry deleted');
    }
  };

  // Order Handlers
  const handleOrderStatusChange = (id, newStatus) => {
    const updated = updateOrderStatus(id, newStatus);
    setOrders(updated);
    showToast(`Order status updated to "${newStatus}"`);
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Delete this product order record?')) {
      const updated = deleteOrder(id);
      setOrders(updated);
      showToast('Order removed');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const feats = typeof newProduct.features === 'string'
      ? newProduct.features.split(',').map(f => f.trim()).filter(Boolean)
      : newProduct.features;

    const isKit = productType === 'kit';
    const rawImages = (newProduct.images && newProduct.images.length > 0)
      ? newProduct.images
      : (newProduct.image ? [newProduct.image] : [solarHeroImg]);

    const allImages = await Promise.all(
      rawImages.map((img) => compressImageFile(img, 900, 900, 0.72))
    );
    const validImages = allImages.filter(Boolean);

    const itemToSave = {
      ...newProduct,
      isKit,
      category: isKit ? 'kits' : newProduct.category,
      tag: newProduct.tag || (isKit ? 'Solar Kit' : 'Solar Hardware'),
      features: feats.length > 0 ? feats : ['Tier-1 High Quality', 'MNRE Approved'],
      image: validImages[0] || solarHeroImg,
      images: validImages,
      manualPrice: newProduct.manualPrice !== undefined && newProduct.manualPrice !== '' ? newProduct.manualPrice : (isKit ? 35000 : undefined),
      manualGross: newProduct.manualGross !== undefined && newProduct.manualGross !== '' ? newProduct.manualGross : (isKit ? 65000 : undefined),
      manualSubsidy: newProduct.manualSubsidy !== undefined && newProduct.manualSubsidy !== '' ? newProduct.manualSubsidy : (isKit ? 30000 : undefined),
      priceLabel: newProduct.priceLabel || (isKit ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price'),
    };

    if (isKit && newProduct.capacityPricing) {
      itemToSave.capacityPricing = {
        ...newProduct.capacityPricing,
        '1kW': Number(newProduct.manualGross) || Number(newProduct.capacityPricing['1kW']) || 65000,
      };
    }
    if (!isKit) {
      itemToSave.price = newProduct.price || (newProduct.manualPrice ? `₹${newProduct.manualPrice}` : '₹25,000');
    }

    const updated = addProduct(itemToSave);
    setProducts(updated);
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      category: 'kits',
      isKit: true,
      efficiency: 'Tier-1 High Yield',
      warranty: '25-Year Linear Warranty',
      description: '',
      features: 'High Efficiency Solar Modules, Smart Inverter, Structure & Wires, Net Metering Approval',
      tag: 'Solar Kit',
      image: '',
      images: [],
      price: '₹24 / Watt',
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
    });
    setNewProductUrlInput('');
    showToast(isKit ? 'Solar Kit added successfully!' : 'Solar Product added successfully!');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Delete this product from catalog?')) {
      const updated = deleteProduct(id);
      setProducts(updated);
      showToast('Product removed');
    }
  };

  const handleOpenEditProduct = (prod) => {
    const isKit = prod.isKit || prod.category === 'kits';
    const imgs = Array.isArray(prod.images) && prod.images.length > 0
      ? [...prod.images]
      : (prod.image ? [prod.image] : []);

    setEditingProduct({
      id: prod.id,
      name: prod.name || '',
      category: prod.category || (isKit ? 'kits' : 'panels'),
      isKit,
      efficiency: prod.efficiency || 'Tier-1 High Yield',
      warranty: prod.warranty || '25-Year Linear Warranty',
      description: prod.description || '',
      features: Array.isArray(prod.features) ? prod.features.join(', ') : (prod.features || ''),
      tag: prod.tag || '',
      image: prod.image || (imgs[0] || ''),
      images: imgs,
      price: prod.price || '₹24 / Watt',
      manualPrice: prod.manualPrice !== undefined ? prod.manualPrice : (isKit ? 35000 : ''),
      manualGross: prod.manualGross !== undefined ? prod.manualGross : (isKit ? (Number(prod.capacityPricing?.['1kW']) || 65000) : ''),
      manualSubsidy: prod.manualSubsidy !== undefined ? prod.manualSubsidy : (isKit ? 30000 : ''),
      priceLabel: prod.priceLabel || (isKit ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price'),
      capacityPricing: prod.capacityPricing ? { ...prod.capacityPricing } : {
        '1kW': 65000,
        '2kW': 125000,
        '3kW': 185000,
        '4kW': 240000,
        '5kW': 295000,
        '6kW': 350000,
        '8kW': 450000,
        '10kW': 550000,
      },
    });
    setEditProductUrlInput('');
    setShowEditProductModal(true);
  };

  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    const feats = typeof editingProduct.features === 'string'
      ? editingProduct.features.split(',').map(f => f.trim()).filter(Boolean)
      : editingProduct.features;

    const isKit = editingProduct.isKit || editingProduct.category === 'kits';
    const rawImages = (editingProduct.images && editingProduct.images.length > 0)
      ? editingProduct.images
      : (editingProduct.image ? [editingProduct.image] : [solarHeroImg]);

    const allImages = await Promise.all(
      rawImages.map((img) => compressImageFile(img, 900, 900, 0.72))
    );
    const validImages = allImages.filter(Boolean);

    const itemToSave = {
      name: editingProduct.name,
      isKit,
      category: isKit ? 'kits' : editingProduct.category,
      tag: editingProduct.tag || (isKit ? 'Solar Kit' : 'Solar Hardware'),
      features: feats && feats.length > 0 ? feats : ['Tier-1 High Quality', 'MNRE Approved'],
      efficiency: editingProduct.efficiency || '',
      warranty: editingProduct.warranty || '',
      description: editingProduct.description || '',
      image: validImages[0] || solarHeroImg,
      images: validImages,
      manualPrice: editingProduct.manualPrice !== undefined ? editingProduct.manualPrice : '',
      manualGross: editingProduct.manualGross !== undefined ? editingProduct.manualGross : '',
      manualSubsidy: editingProduct.manualSubsidy !== undefined ? editingProduct.manualSubsidy : '',
      priceLabel: editingProduct.priceLabel || '',
    };

    if (isKit && editingProduct.capacityPricing) {
      itemToSave.capacityPricing = {
        ...editingProduct.capacityPricing,
        '1kW': Number(editingProduct.manualGross) || Number(editingProduct.capacityPricing['1kW']) || 65000,
      };
    }
    if (!isKit) {
      itemToSave.price = editingProduct.price || (editingProduct.manualPrice ? `₹${editingProduct.manualPrice}` : '₹25,000');
    }

    const updated = updateProduct(editingProduct.id, itemToSave);
    setProducts(updated);
    setShowEditProductModal(false);
    setEditingProduct(null);
    showToast('Product & Pricing updated successfully!');
  };

  // Quick 1-Click Manual Price Editor Handlers
  const handleOpenQuickPrice = (prod) => {
    const isKit = prod.isKit || prod.category === 'kits';
    setQuickPriceProduct(prod);
    setQuickPriceForm({
      manualPrice: prod.manualPrice !== undefined ? prod.manualPrice : (isKit ? 35000 : 25000),
      manualGross: prod.manualGross !== undefined ? prod.manualGross : (isKit ? (Number(prod.capacityPricing?.['1kW']) || 65000) : ''),
      manualSubsidy: prod.manualSubsidy !== undefined ? prod.manualSubsidy : (isKit ? 30000 : ''),
      priceLabel: prod.priceLabel || (isKit ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price'),
      price: prod.price || '₹24 / Watt',
      capacityPricing: prod.capacityPricing ? { ...prod.capacityPricing } : {
        '1kW': 65000,
        '2kW': 125000,
        '3kW': 185000,
        '4kW': 240000,
        '5kW': 295000,
        '6kW': 350000,
        '8kW': 450000,
        '10kW': 550000,
      },
    });
    setShowQuickPriceModal(true);
  };

  const handleSaveQuickPrice = (e) => {
    e.preventDefault();
    if (!quickPriceProduct) return;

    const isKit = quickPriceProduct.isKit || quickPriceProduct.category === 'kits';
    const payload = {
      manualPrice: quickPriceForm.manualPrice,
      manualGross: quickPriceForm.manualGross,
      manualSubsidy: quickPriceForm.manualSubsidy,
      priceLabel: quickPriceForm.priceLabel,
    };

    if (isKit) {
      payload.capacityPricing = {
        ...(quickPriceProduct.capacityPricing || {}),
        ...(quickPriceForm.capacityPricing || {}),
        '1kW': Number(quickPriceForm.manualGross) || Number(quickPriceProduct.capacityPricing?.['1kW']) || 65000,
      };
    } else {
      payload.price = quickPriceForm.price || (quickPriceForm.manualPrice ? `₹${quickPriceForm.manualPrice}` : '₹25,000');
    }

    const updated = updateProduct(quickPriceProduct.id, payload);
    setProducts(updated);
    setShowQuickPriceModal(false);
    setQuickPriceProduct(null);
    showToast(`💰 Manual Rate updated successfully to ₹${Number(quickPriceForm.manualPrice).toLocaleString('en-IN')}*!`);
  };

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!newGallery.title) return;

    const compressedImg = await compressImageFile(newGallery.image, 900, 900, 0.72);

    const itemToSave = {
      ...newGallery,
      image: compressedImg || solarHeroImg,
    };

    const updated = addGalleryItem(itemToSave);
    setGallery(updated);
    setShowAddGalleryModal(false);
    setNewGallery({
      title: '',
      category: 'residential',
      location: 'Gorakhpur, UP',
      capacity: '5 kW System',
      savings: '85% Bill Cut',
      image: '',
    });
    showToast('Installation photo added to gallery!');
  };

  const handleDeleteGallery = (id) => {
    if (window.confirm('Delete this project from gallery?')) {
      const updated = deleteGalleryItem(id);
      setGallery(updated);
      showToast('Project removed');
    }
  };

  const handleOpenEditGallery = (item) => {
    setEditingGallery({
      id: item.id,
      title: item.title || '',
      category: item.category || 'residential',
      location: item.location || 'Gorakhpur, UP',
      capacity: item.capacity || '5 kW System',
      savings: item.savings || '85% Bill Cut',
      image: item.image || solarHeroImg,
    });
    setEditGalleryUrlInput('');
    setShowEditGalleryModal(true);
  };

  const handleSaveEditGallery = async (e) => {
    e.preventDefault();
    if (!editingGallery || !editingGallery.title) return;

    let finalImg = editingGallery.image;
    if (editGalleryUrlInput && editGalleryUrlInput.trim()) {
      finalImg = editGalleryUrlInput.trim();
    } else if (editingGallery.image && editingGallery.image.startsWith('data:')) {
      finalImg = await compressImageFile(editingGallery.image, 900, 900, 0.72);
    }

    const itemToSave = {
      title: editingGallery.title,
      category: editingGallery.category || 'residential',
      location: editingGallery.location || 'Gorakhpur, UP',
      capacity: editingGallery.capacity || '5 kW System',
      savings: editingGallery.savings || '85% Bill Cut',
      image: finalImg || solarHeroImg,
    };

    const updated = updateGalleryItem(editingGallery.id, itemToSave);
    setGallery(updated);
    setShowEditGalleryModal(false);
    setEditingGallery(null);
    setEditGalleryUrlInput('');
    showToast('Gallery project updated successfully!');
  };

  // Staff Management Handlers
  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.email || !newStaffForm.password) {
      alert('Please fill in staff name, login email and password.');
      return;
    }
    const updated = addStaffMember(newStaffForm);
    setStaffList(updated);
    setShowAddStaffModal(false);
    const createdName = newStaffForm.name;
    setNewStaffForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'Solar Project Incharge',
      department: 'Solar Project Operations',
      badgeId: '',
      status: 'Active',
    });
    showToast(`Staff member "${createdName}" created! Login credentials are active.`);
  };

  const handleSaveEditStaff = (e) => {
    e.preventDefault();
    if (!editingStaff || !editingStaff.id) return;
    const updated = updateStaffMember(editingStaff.id, editingStaff);
    setStaffList(updated);
    setShowEditStaffModal(false);
    setEditingStaff(null);
    showToast('Staff credentials and profile updated successfully!');
  };

  const handleDeleteStaff = (id, name) => {
    if (window.confirm(`Are you sure you want to delete staff account "${name}"? They will no longer be able to log in to the staff portal.`)) {
      const updated = deleteStaffMember(id);
      setStaffList(updated);
      showToast(`Staff account "${name}" deleted.`);
    }
  };

  const handleToggleStaffStatus = (id, currentStatus, name) => {
    const updated = toggleStaffStatus(id);
    setStaffList(updated);
    const newStat = currentStatus === 'Active' ? 'Inactive (Blocked)' : 'Active (Allowed)';
    showToast(`Staff account "${name}" is now ${newStat}.`);
  };

  const handleCopyCredential = (text, label, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(`${id}-${label}`);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.phone && b.phone.includes(searchQuery)) ||
      (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.email && b.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      b.status === statusFilter ||
      (statusFilter === 'Request Received' && (b.status === 'New' || !b.status)) ||
      (statusFilter === 'Site Inspection' && (b.status === 'Contacted' || b.status === 'Scheduled')) ||
      (statusFilter === 'Installation Done' && b.status === 'Completed');
    return matchesSearch && matchesStatus;
  });

  const newLeadsCount = bookings.filter(b => b.status === 'Request Received' || b.status === 'New' || !b.status).length;

  // Filtered Staff List
  const filteredStaffList = staffList.filter((st) => {
    const query = staffSearchQuery.toLowerCase();
    const matchesSearch =
      (st.name && st.name.toLowerCase().includes(query)) ||
      (st.email && st.email.toLowerCase().includes(query)) ||
      (st.role && st.role.toLowerCase().includes(query)) ||
      (st.phone && st.phone.includes(query)) ||
      (st.badgeId && st.badgeId.toLowerCase().includes(query));
    const matchesStatus =
      staffStatusFilter === 'all' || (st.status || 'Active') === staffStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeStaffCount = staffList.filter((st) => (st.status || 'Active') === 'Active').length;
  const inactiveStaffCount = staffList.filter((st) => st.status === 'Inactive').length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.id && o.id.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.phone && o.phone.includes(orderSearchQuery)) ||
      (o.address && o.address.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.city && o.city.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.productName && o.productName.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const newOrdersCount = orders.filter(o => o.status === 'Order Received' || !o.status).length;
  const totalCodValue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + (Number(o.netPayable) || 0), 0);

  const filteredAdminProducts = products.filter((p) => {
    const isKit = p.isKit || p.category === 'kits';
    if (adminProductFilter === 'kits') return isKit;
    if (adminProductFilter === 'single') return !isKit;
    return true;
  });

  // Helper for formatting Currency in Admin Dashboard
  const formatINR = (val) => {
    const num = Number(val) || 0;
    const isNeg = num < 0;
    const absStr = Math.abs(num).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return isNeg ? `-₹${absStr}` : `₹${absStr}`;
  };

  const normMgmtSiteId = (id) => String(id || '').trim().toUpperCase();
  const normMgmtCategory = (cat) => String(cat || '').trim().toLowerCase();

  // Real-time Project Management Financial Calculations (Synchronized across all sections)
  const mgmtTotalSitesCount = mgmtSites.length;
  const mgmtCompletedSitesCount = mgmtSites.filter(
    (s) => normMgmtCategory(s.siteStatus || s.status) === 'completed'
  ).length;
  const mgmtRunningSitesCount = mgmtSites.filter(
    (s) => normMgmtCategory(s.siteStatus || s.status) !== 'completed'
  ).length;

  const mgmtLoanTotal = mgmtSites.reduce((acc, curr) => acc + (Number(curr.loanAmount) || 0), 0);
  const mgmtMarginTotal = mgmtSites.reduce((acc, curr) => acc + (Number(curr.customerMargin) || 0), 0);

  const mgmtTotalIncome = mgmtSites.reduce((acc, curr) => {
    const loan = Number(curr.loanAmount) || 0;
    const margin = Number(curr.customerMargin) || 0;
    const inc = (loan + margin) > 0 ? (loan + margin) : (Number(curr.projectIncome) || Number(curr.projectValue) || 0);
    return acc + inc;
  }, 0);

  const mgmtTotalExpenses = mgmtExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const mgmtNetProfit = mgmtTotalIncome - mgmtTotalExpenses;
  const mgmtProfitPercent = mgmtTotalIncome > 0 ? ((mgmtNetProfit / mgmtTotalIncome) * 100) : 0;

  const mgmtTotalReceived = mgmtPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const mgmtTotalPending = mgmtTotalIncome - mgmtTotalReceived;
  const mgmtCollectionPercent = mgmtTotalIncome > 0 ? Math.min(100, Math.round((mgmtTotalReceived / mgmtTotalIncome) * 100)) : 0;

  const mgmtMaterialExp = mgmtExpenses
    .filter((e) => normMgmtCategory(e.category) === 'material')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const mgmtLabourExp = mgmtExpenses
    .filter((e) => normMgmtCategory(e.category) === 'labour')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const mgmtTransportExp = mgmtExpenses
    .filter((e) => normMgmtCategory(e.category) === 'transport')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const mgmtMiscExp = mgmtExpenses
    .filter((e) => normMgmtCategory(e.category) === 'misc')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-row font-['Outfit',sans-serif] text-slate-800 antialiased overflow-x-hidden">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#10b981] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. LEFT SIDEBAR (Dark Theme - Gentelella Style) */}
      {/* ============================================================ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#141e2e] text-slate-300 w-64 transition-all duration-300 flex flex-col justify-between shadow-2xl lg:static ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0e1622]">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                <Sun className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              {(sidebarOpen || mobileSidebarOpen) && (
                <div className="truncate">
                  <span className="text-base font-black text-white tracking-tight">
                    Power<span className="text-amber-400">24</span>
                  </span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest -mt-1">
                    Admin v2.4
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-5 space-y-6">
            <div>
              {(sidebarOpen || mobileSidebarOpen) && (
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                  GENERAL
                </p>
              )}

              <nav className="space-y-1">
                {/* 1. Overview */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('overview');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview'
                    ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-950/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  title="Overview Dashboard"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Dashboard Overview</span>}
                  </div>
                </button>

                {/* 2. Customer Bookings */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('bookings');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'bookings'
                    ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-950/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  title="Customer Leads"
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-4 h-4 shrink-0" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Booking Queries</span>}
                  </div>
                </button>

                {/* 3. Product Orders (COD) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('orders');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'orders'
                    ? 'bg-[#d91478] text-white shadow-lg shadow-pink-950/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  title="Product Orders (COD)"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Product Orders (COD)</span>}
                  </div>
                </button>

                {/* 4. Products */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'products'
                    ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-950/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  title="Product Catalog"
                >
                  <div className="flex items-center gap-3">
                    <PackagePlus className="w-4 h-4 shrink-0" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Products</span>}
                  </div>
                </button>

                {/* 5. Gallery */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('gallery');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'gallery'
                    ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-950/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  title="Project Gallery"
                >
                  <div className="flex items-center gap-3">
                    <Image className="w-4 h-4 shrink-0" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Project Gallery</span>}
                  </div>
                </button>

                {/* 6. Project Management (P&L, Site Master, Expenses, Payments, Budget) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('management');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'management'
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  title="Project Profit & Loss Management"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 shrink-0 text-amber-400" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Project Management</span>}
                  </div>
                </button>

                {/* 7. Staff Management (Authority to Add/Manage Staff with Credentials) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('staff');
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'staff'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-blue-950/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  title="Staff Accounts & Login Passwords"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 shrink-0 text-sky-400" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Staff Management</span>}
                  </div>
                </button>
              </nav>
            </div>

            <div>
              {(sidebarOpen || mobileSidebarOpen) && (
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                  SHORTCUTS
                </p>
              )}
              <nav className="space-y-1">
                <Link
                  to="/staff/login"
                  target="_blank"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-4 h-4 shrink-0 text-sky-400" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Staff Login Portal</span>}
                  </div>
                </Link>
                <Link
                  to="/"
                  target="_blank"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 shrink-0 text-amber-400" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Live Website</span>}
                  </div>
                </Link>
                <Link
                  to="/book"
                  target="_blank"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 shrink-0 text-sky-400" />
                    {(sidebarOpen || mobileSidebarOpen) && <span>Book Survey Form</span>}
                  </div>
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-3 border-t border-slate-800 bg-[#0e1622]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                A
              </div>
              {(sidebarOpen || mobileSidebarOpen) && (
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">Abhishek (Admin)</p>
                  <p className="text-[10px] text-slate-400 truncate">Gorakhpur HQ</p>
                </div>
              )}
            </div>

            {(sidebarOpen || mobileSidebarOpen) && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* ============================================================ */}
      {/* 2. MAIN WORKSPACE CONTENT */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header (Clean White / Light) */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle for desktop */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Sidebar toggle for mobile */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Section Name */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="text-slate-400">Home</span>
              <span>/</span>
              <span className="text-slate-800 uppercase capitalize">
                {activeTab === 'overview' ? 'Dashboard' : activeTab === 'management' ? 'Project Management' : activeTab === 'staff' ? 'Staff Management' : activeTab}
              </span>
            </div>
          </div>

          {/* Right Top Header Actions */}
          <div className="flex items-center gap-3">
            {/* Live Website Shortcut */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-bold border border-slate-200/80 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              <span>Live Site</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
                title="View Inquiries / Notifications"
              >
                <Bell className="w-4 h-4" />
                {newLeadsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 animate-pulse" />
                )}
              </button>
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                A
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight">Admin</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* MAIN BODY AREA */}
        {/* ============================================================ */}
        <main className="p-4 sm:p-7 space-y-6">

          {/* Header Title Section (Hidden on Project Management and Staff tabs) */}
          {activeTab !== 'management' && activeTab !== 'staff' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">OVERVIEW</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'overview' && 'Solar Operations Dashboard'}
                  {activeTab === 'bookings' && 'Customer Inquiries & Leads'}
                  {activeTab === 'orders' && 'Product Orders (COD)'}
                  {activeTab === 'products' && 'Product Hardware Catalog'}
                  {activeTab === 'gallery' && 'Project Installation Gallery'}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>+ New Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4 STAT CARDS (Clean Overview Metrics - Hidden in Project Management and Staff) */}
          {/* ============================================================ */}
          {activeTab !== 'management' && activeTab !== 'staff' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

              {/* 1. Total Leads */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">TOTAL LEADS</span>
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{bookings.length}</p>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span>+{bookings.length}</span>
                    <span className="text-slate-400 font-normal">all inquiries</span>
                  </p>
                </div>
                <div className="h-1 bg-emerald-500 rounded-full mt-3 w-full" />
              </div>

              {/* 2. New Bookings */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">NEW LEADS</span>
                    <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{newLeadsCount}</p>
                  <p className="text-[10px] text-sky-600 font-bold">Needs Contact</p>
                </div>
                <div className="h-1 bg-sky-500 rounded-full mt-3 w-full" />
              </div>

              {/* 3. Products in Catalog */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">PRODUCTS & KITS</span>
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <PackagePlus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{products.length}</p>
                  <p className="text-[10px] text-amber-600 font-bold">Active in Catalog</p>
                </div>
                <div className="h-1 bg-amber-500 rounded-full mt-3 w-full" />
              </div>

              {/* 4. Gallery Installations */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">GALLERY SITES</span>
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Image className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{gallery.length}</p>
                  <p className="text-[10px] text-purple-600 font-bold">Completed Sites</p>
                </div>
                <div className="h-1 bg-purple-500 rounded-full mt-3 w-full" />
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 1: DASHBOARD OVERVIEW VIEW */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Live Solar Project Management Financial Overview Section */}
              <div className="lg:col-span-12 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
                {/* Header with gradient badge and actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          Solar Project Management & Financials
                        </h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Live Real-time
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Total {mgmtTotalSitesCount} Projects ({mgmtCompletedSitesCount} Completed, {mgmtRunningSitesCount} Running) — Real-time P&L, expenses & payments
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setActiveTab('management')}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <span>Open Full P&L Portal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4 Financial KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {/* Card 1: Total Project Income */}
                  <div className="bg-gradient-to-br from-blue-50/60 via-white to-blue-50/30 p-4 rounded-2xl border border-blue-100/80 shadow-xs flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between text-blue-900">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">PROJECT INCOME</span>
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-mono">₹</span>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-blue-950 font-mono">
                        {formatINR(mgmtTotalIncome)}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Loan: <strong className="text-slate-700 font-mono">{formatINR(mgmtLoanTotal)}</strong> | Margin: <strong className="text-slate-700 font-mono">{formatINR(mgmtMarginTotal)}</strong>
                      </p>
                    </div>
                    <div className="h-1 bg-blue-500 rounded-full w-full opacity-60" />
                  </div>

                  {/* Card 2: Total Expenses */}
                  <div className="bg-gradient-to-br from-rose-50/60 via-white to-rose-50/30 p-4 rounded-2xl border border-rose-100/80 shadow-xs flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between text-rose-900">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">TOTAL EXPENSES</span>
                      <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                        <TrendingDown className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-black text-rose-600 font-mono">
                        {formatINR(mgmtTotalExpenses)}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                        Mat: <strong className="text-slate-700 font-mono">{formatINR(mgmtMaterialExp)}</strong> | Lab: <strong className="text-slate-700 font-mono">{formatINR(mgmtLabourExp)}</strong>
                      </p>
                    </div>
                    <div className="h-1 bg-rose-500 rounded-full w-full opacity-60" />
                  </div>

                  {/* Card 3: Net Profit & Margin */}
                  <div className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between space-y-2 ${mgmtNetProfit >= 0
                    ? 'bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/30 border-emerald-100/80 text-emerald-900'
                    : 'bg-gradient-to-br from-rose-50/60 via-white to-rose-50/30 border-rose-100/80 text-rose-900'
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">NET PROFIT / LOSS</span>
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${mgmtNetProfit >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                        <TrendingUp className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div>
                      <p className={`text-xl sm:text-2xl font-black font-mono ${mgmtNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}>
                        {formatINR(mgmtNetProfit)}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Profit Margin: <strong className={`font-mono font-bold ${mgmtNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{mgmtProfitPercent.toFixed(1)}%</strong>
                      </p>
                    </div>
                    <div className={`h-1 rounded-full w-full opacity-60 ${mgmtNetProfit >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                  </div>

                  {/* Card 4: Payments Received & Pending */}
                  <div className="bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 p-4 rounded-2xl border border-amber-100/80 shadow-xs flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between text-amber-900">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">PAYMENTS & PENDING</span>
                      <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold font-mono">
                        {mgmtCollectionPercent}%
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 font-bold">Received:</span>
                        <span className="text-base font-black text-emerald-700 font-mono">{formatINR(mgmtTotalReceived)}</span>
                      </div>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="text-xs text-slate-500 font-bold">Pending:</span>
                        <span className="text-base font-black text-amber-700 font-mono">{formatINR(mgmtTotalPending)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${mgmtCollectionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Category Expense Breakdown & Quick Access */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-700 uppercase tracking-wider">
                        Live Expense Distribution (Material / Labour / Transport / Misc)
                      </span>
                      <span className="font-mono text-slate-500 text-[11px]">
                        Total: {formatINR(mgmtTotalExpenses)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          <span>Material</span>
                        </div>
                        <p className="font-black text-slate-900 font-mono text-sm mt-0.5">{formatINR(mgmtMaterialExp)}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {mgmtTotalExpenses > 0 ? ((mgmtMaterialExp / mgmtTotalExpenses) * 100).toFixed(0) : 0}% share
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span>Labour</span>
                        </div>
                        <p className="font-black text-slate-900 font-mono text-sm mt-0.5">{formatINR(mgmtLabourExp)}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {mgmtTotalExpenses > 0 ? ((mgmtLabourExp / mgmtTotalExpenses) * 100).toFixed(0) : 0}% share
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>Transport</span>
                        </div>
                        <p className="font-black text-slate-900 font-mono text-sm mt-0.5">{formatINR(mgmtTransportExp)}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {mgmtTotalExpenses > 0 ? ((mgmtTransportExp / mgmtTotalExpenses) * 100).toFixed(0) : 0}% share
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          <span>Misc</span>
                        </div>
                        <p className="font-black text-slate-900 font-mono text-sm mt-0.5">{formatINR(mgmtMiscExp)}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {mgmtTotalExpenses > 0 ? ((mgmtMiscExp / mgmtTotalExpenses) * 100).toFixed(0) : 0}% share
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col justify-center space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Quick Portal Navigation
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('management')}
                        className="py-1.5 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold text-center border border-blue-200 transition-colors cursor-pointer"
                      >
                        Site Master
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('management')}
                        className="py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold text-center border border-rose-200 transition-colors cursor-pointer"
                      >
                        Expense Entry
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('management')}
                        className="py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold text-center border border-emerald-200 transition-colors cursor-pointer"
                      >
                        Payment Entry
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('management')}
                        className="py-1.5 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold text-center border border-purple-200 transition-colors cursor-pointer"
                      >
                        Material Budget
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Column: Recent Customer Inquiries Table */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Recent Customer Inquiries</h3>
                    <p className="text-xs text-slate-500">Live leads captured from Book Survey and Contact pages</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                  >
                    View All ({bookings.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Phone & Email</th>
                        <th className="pb-3">Type & Property</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.slice(0, 5).map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 font-bold text-slate-900">
                            <div>{lead.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal truncate max-w-[140px]">
                              {lead.address || lead.city}
                            </div>
                          </td>
                          <td className="py-3">
                            <a href={`tel:${lead.phone}`} className="font-bold text-emerald-600 hover:underline">
                              {lead.phone}
                            </a>
                            {lead.email && <div className="text-[10px] text-slate-400 truncate">{lead.email}</div>}
                          </td>
                          <td className="py-3">
                            <span className="font-bold text-slate-900 block">{lead.type || 'Site Survey'}</span>
                            <span className="text-[10px] text-slate-400 block capitalize">{lead.propertyType || 'Residential'}</span>
                          </td>
                          <td className="py-3">
                            {(() => {
                              const meta = getAdminStatusMeta(lead.status);
                              return (
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${meta.bg}`}>
                                  {meta.badge}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-3 text-right">
                            <select
                              value={lead.status || 'Request Received'}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className="text-[11px] font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="Request Received">Request Received</option>
                              <option value="Site Inspection">Site Inspection</option>
                              <option value="Subsidy Approval">Subsidy Approval</option>
                              <option value="Installation Done">Installation Done</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Recent Activity Feed (Gentelella style) */}
              <div className="lg:col-span-4 space-y-6">

                {/* Activity Feed */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-slate-900">Recent Activity</h3>

                  <div className="space-y-3.5 text-xs">
                    {bookings.slice(0, 3).map((b, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {b.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-slate-800 font-bold leading-tight">
                            {b.name} <span className="font-normal text-slate-500">requested a rooftop survey</span>
                          </p>
                          <span className="text-[10px] text-slate-400">{b.date ? `Slot: ${b.date}` : 'Recently'}</span>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        ⚡
                      </div>
                      <div>
                        <p className="text-slate-800 font-bold leading-tight">
                          Products Catalog <span className="font-normal text-slate-500">synced & active</span>
                        </p>
                        <span className="text-[10px] text-slate-400">{products.length} Items Live</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        🖼️
                      </div>
                      <div>
                        <p className="text-slate-800 font-bold leading-tight">
                          Gallery Projects <span className="font-normal text-slate-500">updated with photos</span>
                        </p>
                        <span className="text-[10px] text-slate-400">{gallery.length} Installations Live</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Subsidy Rates Card */}
                <div className="bg-[#141e2e] text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-3 border border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>PM Surya Ghar Muft Bijli Rates</span>
                  </div>
                  <p className="text-xs text-slate-300">Central Government rooftop subsidy guidelines:</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">1 kW System:</span>
                      <span className="font-bold text-amber-400">₹30,000 Subsidy</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">2 kW System:</span>
                      <span className="font-bold text-amber-400">₹60,000 Subsidy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">3 kW+ System:</span>
                      <span className="font-bold text-emerald-400">₹78,000 Subsidy</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: FULL CUSTOMER INQUIRIES & LEADS */}
          {/* ============================================================ */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by customer name, phone, email, address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs text-slate-400 font-bold uppercase shrink-0 mr-1">Status:</span>
                  {['all', 'Request Received', 'Site Inspection', 'Subsidy Approval', 'Installation Done', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors shrink-0 cursor-pointer ${statusFilter === st
                        ? 'bg-[#10b981] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {st === 'all' ? 'All Leads' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leads List */}
              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 space-y-2 text-slate-500">
                  <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-700">No booking queries found</p>
                  <p className="text-xs">Queries submitted on the Book/Contact forms will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredBookings.map((lead) => {
                    const meta = getAdminStatusMeta(lead.status);
                    return (
                      <div
                        key={lead.id}
                        className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-2.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-black text-slate-900">{lead.name}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${meta.bg}`}>
                              {meta.badge}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                              {lead.propertyType || 'Residential'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: #{lead.id.slice(-6)}
                            </span>
                          </div>

                          {/* If a specific product/kit was booked */}
                          {(lead.productName || lead.kitName) && (
                            <div className="p-3 bg-gradient-to-r from-pink-50/60 to-emerald-50/60 rounded-xl border border-pink-200/70 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                {lead.productImage ? (
                                  <img
                                    src={lead.productImage}
                                    alt={lead.productName || lead.kitName}
                                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-950 shrink-0"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-lg bg-[#d91478]/10 text-[#d91478] flex items-center justify-center font-bold text-sm shrink-0">
                                    ☀️
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs font-black text-slate-950 leading-tight">
                                    {lead.productName || lead.kitName}
                                  </p>
                                  {(lead.capacity || lead.kw) && (
                                    <span className="text-[10px] font-bold text-[#d91478]">
                                      ⚡ Capacity: {lead.capacity || lead.kw}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Price Details */}
                              {lead.grossPrice && (
                                <div className="text-right text-xs">
                                  <span className="text-[10px] text-slate-500 line-through block">
                                    Gross: ₹{Number(lead.grossPrice).toLocaleString('en-IN')}
                                  </span>
                                  <span className="font-black text-[#d91478] text-sm">
                                    Net: ₹{Number(lead.netPayable || lead.grossPrice).toLocaleString('en-IN')}
                                  </span>
                                  {lead.subsidy > 0 && (
                                    <span className="text-[9px] font-bold text-emerald-700 block">
                                      (-₹{Number(lead.subsidy).toLocaleString('en-IN')} Sub)
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <a href={`tel:${lead.phone}`} className="font-bold text-slate-900 hover:underline">
                                {lead.phone}
                              </a>
                            </div>
                            {lead.email && (
                              <div className="flex items-center gap-2 truncate">
                                <Mail className="w-3.5 h-3.5 text-sky-600" />
                                <span className="truncate">{lead.email}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Type: <strong className="text-slate-900">{lead.type || 'Free Site Survey'}</strong></span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-500 flex flex-wrap gap-4 pt-1 border-t border-slate-100">
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <span>{lead.address || lead.city || 'Address Not Provided'}</span>
                            </div>
                            {lead.date && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>Slot: {lead.date} ({lead.timeSlot})</span>
                              </div>
                            )}
                          </div>

                          {lead.message && (
                            <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <strong>Note/Message:</strong> {lead.message}
                            </div>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Status:</span>
                            <select
                              value={lead.status || 'Request Received'}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                            >
                              <option value="Request Received">Request Received</option>
                              <option value="Site Inspection">Site Inspection</option>
                              <option value="Subsidy Approval">Subsidy Approval</option>
                              <option value="Installation Done">Installation Done</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${lead.phone}`}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(lead.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-rose-200 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: PRODUCT ORDERS (COD - CASH ON DELIVERY) */}
          {/* ============================================================ */}
          {activeTab === 'orders' && (
            <div className="space-y-4">

              {/* Top Filter & Search Bar */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#d91478]" />
                      <span>Product Orders (Cash on Delivery / COD)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Live consumer product orders placed with Doorstep Cash on Delivery
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
                    <span>Total COD Value:</span>
                    <strong className="text-emerald-800 text-sm">₹{totalCodValue.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                    {[
                      { id: 'all', label: 'All Orders', count: orders.length },
                      { id: 'Order Received', label: 'Received', count: orders.filter(o => o.status === 'Order Received' || !o.status).length },
                      { id: 'Confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length },
                      { id: 'Dispatched', label: 'Dispatched', count: orders.filter(o => o.status === 'Dispatched').length },
                      { id: 'Out for Delivery', label: 'Out for Delivery', count: orders.filter(o => o.status === 'Out for Delivery').length },
                      { id: 'Delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
                      { id: 'Cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setOrderStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${orderStatusFilter === tab.id
                          ? 'bg-[#d91478] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${orderStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search input */}
                  <div className="relative w-full md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search order ID, name, phone..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d91478]"
                    />
                  </div>
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center space-y-2 text-slate-500 border border-slate-200">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="font-black text-slate-800 text-base">No product orders found</p>
                  <p className="text-xs">When users place Cash on Delivery (COD) orders, they will appear here live.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredOrders.map((ord) => {
                    const statusColors = {
                      'Order Received': 'bg-amber-100 text-amber-900 border-amber-300',
                      'Confirmed': 'bg-blue-100 text-blue-900 border-blue-300',
                      'Dispatched': 'bg-purple-100 text-purple-900 border-purple-300',
                      'Out for Delivery': 'bg-indigo-100 text-indigo-900 border-indigo-300',
                      'Delivered': 'bg-emerald-100 text-emerald-900 border-emerald-300',
                      'Cancelled': 'bg-rose-100 text-rose-900 border-rose-300',
                    };
                    const statusClass = statusColors[ord.status] || 'bg-amber-100 text-amber-900 border-amber-300';

                    const dateFormatted = ord.createdAt
                      ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : 'Recently Placed';

                    return (
                      <div
                        key={ord.id}
                        className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-[#d91478]/40 shadow-xs transition-all"
                      >
                        {/* Order Header Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-mono text-xs font-black">
                              {ord.id}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">
                              {dateFormatted}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${statusClass}`}>
                              {ord.status || 'Order Received'}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {ord.paymentMode || 'Cash on Delivery (COD)'}
                            </span>
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                          {/* Left: Customer & Delivery Address (6 cols) */}
                          <div className="lg:col-span-6 space-y-3">
                            <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Customer Details</span>
                              <h4 className="text-base font-black text-slate-900">{ord.customerName}</h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <a href={`tel:${ord.phone}`} className="font-bold text-slate-900 hover:underline">
                                  {ord.phone}
                                </a>
                              </div>
                              {ord.email && ord.email !== 'N/A' && (
                                <div className="flex items-center gap-2 truncate">
                                  <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                  <span className="truncate text-slate-600">{ord.email}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-slate-900 block">Delivery Address:</span>
                                <span>{ord.address}, {ord.city} - {ord.pincode}</span>
                              </div>
                            </div>

                            {ord.notes && (
                              <div className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                                <strong className="text-amber-900">Notes:</strong> {ord.notes}
                              </div>
                            )}
                          </div>

                          {/* Right: Ordered Product & Price Breakdown (6 cols) */}
                          <div className="lg:col-span-6 space-y-3">
                            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Ordered Product</span>

                            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                              {ord.productImage && (
                                <img
                                  src={ord.productImage}
                                  alt={ord.productName}
                                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">{ord.productName}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  {ord.capacity && (
                                    <span className="text-[10px] font-black bg-pink-100 text-[#d91478] px-2 py-0.5 rounded-md">
                                      Size: {ord.capacity}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-bold text-slate-500">
                                    Qty: {ord.quantity || 1} Unit
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Price Strip */}
                            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 text-xs space-y-1">
                              {ord.grossPrice && (
                                <div className="flex items-center justify-between text-slate-500">
                                  <span>Gross Amount:</span>
                                  <span className="font-bold">₹{Number(ord.grossPrice).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {ord.subsidy > 0 && (
                                <div className="flex items-center justify-between text-emerald-700 font-bold">
                                  <span>Govt Subsidy:</span>
                                  <span>- ₹{Number(ord.subsidy).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                                <span className="font-black text-slate-900 uppercase">Payable on Delivery (COD):</span>
                                <span className="text-base font-black text-[#d91478]">₹{Number(ord.netPayable || ord.grossPrice || 0).toLocaleString('en-IN')}*</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Order Footer Actions & Status Changer */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                          {/* Live Status Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5 text-[#d91478]" />
                              <span>Update Status:</span>
                            </span>
                            <select
                              value={ord.status || 'Order Received'}
                              onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                              className="text-xs font-black bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-[#d91478] cursor-pointer shadow-2xs"
                            >
                              <option value="Order Received">Order Received (नया आर्डर)</option>
                              <option value="Confirmed">Confirmed (कन्फर्म)</option>
                              <option value="Dispatched">Dispatched (डिस्पैच / रवाना)</option>
                              <option value="Out for Delivery">Out for Delivery (डिलीवरी में)</option>
                              <option value="Delivered">Delivered (डिलीवर हो गया)</option>
                              <option value="Cancelled">Cancelled (रद्द)</option>
                            </select>
                          </div>

                          {/* Action Buttons: WhatsApp update, Call, Delete */}
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(ord.phone.replace(/[^0-9]/g, ''))}&text=*Power24 Solar Order Status Update*%0A%0A*Order ID:* ${ord.id}%0A*Product:* ${ord.productName} (${ord.capacity})%0A*Current Status:* ${ord.status || 'Order Received'}%0A*Payable on Delivery (COD):* ₹${Number(ord.netPayable || 0).toLocaleString('en-IN')}%0A%0AOur dispatch team will contact you soon. Thank you for choosing Power24!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-[#16a34a] hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Status</span>
                            </a>

                            <a
                              href={`tel:${ord.phone}`}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">Manage Products</h3>
                    <p className="text-xs text-slate-500">Products and solar kits added here sync directly with <Link to="/product" target="_blank" className="text-emerald-600 font-bold underline">/product</Link></p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add New Product / Kit</span>
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAdminProductFilter('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${adminProductFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                  >
                    <span>⚡ All Items</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${adminProductFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {products.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminProductFilter('single')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${adminProductFilter === 'single'
                      ? 'bg-[#10b981] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                  >
                    <span>📦 Single Products</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${adminProductFilter === 'single' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {products.filter(p => !p.isKit && p.category !== 'kits').length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminProductFilter('kits')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${adminProductFilter === 'kits'
                      ? 'bg-[#d91478] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                  >
                    <span>☀️ Solar Kits (1kW - 10kW)</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${adminProductFilter === 'kits' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {products.filter(p => p.isKit || p.category === 'kits').length}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAdminProducts.map((prod) => {
                  const isKit = prod.isKit || prod.category === 'kits';
                  return (
                    <div
                      key={prod.id}
                      className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-[#d91478]/50 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${isKit
                              ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white'
                              : 'bg-slate-900 text-white'
                              }`}>
                              {isKit ? '☀️ Solar Kit (1kW - 10kW)' : '⚡ Single Product'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              {prod.tag || prod.category}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600">
                            {prod.efficiency}
                          </span>
                        </div>

                        <h4 className="text-lg font-black text-slate-900 leading-snug">{prod.name}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{prod.description}</p>

                        {/* Highlighted Manual Pricing Card (Matching Front-End Display) */}
                        <div className="bg-gradient-to-r from-pink-50/90 via-slate-50 to-emerald-50/70 p-3 sm:p-3.5 rounded-2xl border-2 border-pink-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-500 block">
                              {prod.priceLabel || (isKit ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price')}
                            </span>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-base sm:text-lg font-black text-[#d91478] font-mono">
                                ₹{Number(prod.manualPrice !== undefined && prod.manualPrice !== '' ? prod.manualPrice : (isKit ? 35000 : 25000)).toLocaleString('en-IN')}*
                              </span>
                              {(prod.manualGross || isKit) && (
                                <span className="text-xs text-slate-400 line-through font-bold font-mono">
                                  ₹{Number(prod.manualGross || prod.capacityPricing?.['1kW'] || 65000).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex items-center sm:flex-col gap-1.5">
                            {(prod.manualSubsidy || isKit) && (
                              <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300 shadow-2xs">
                                -₹{Number(prod.manualSubsidy || 30000).toLocaleString('en-IN')} Subsidy
                              </span>
                            )}
                          </div>
                        </div>

                        {/* If it is a kit, show Capacity Pricing Grid */}
                        {isKit && prod.capacityPricing && (
                          <div className="pt-1">
                            <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                              <span>Capacity Pricing (1kW - 10kW):</span>
                              <span className="text-[10px] text-slate-500 font-normal">Gross Rates</span>
                            </p>
                            <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center">
                              {['1kW', '2kW', '3kW', '4kW', '5kW', '6kW', '8kW', '10kW'].map((kw) => (
                                <div key={kw} className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-2xs">
                                  <span className="block text-[10px] font-black text-[#d91478]">{kw}</span>
                                  <span className="block text-[11px] font-bold text-slate-900">
                                    {prod.capacityPricing[kw] ? `₹${Number(prod.capacityPricing[kw]).toLocaleString('en-IN')}` : 'N/A'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* If single product, show single price */}
                        {!isKit && prod.price && (
                          <div className="inline-block px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-800">
                            Base Hardware Rate: {prod.price}
                          </div>
                        )}

                        <div className="space-y-1 pt-1 text-xs text-slate-700">
                          {Array.isArray(prod.features) && prod.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2 gap-2 flex-wrap">
                        <span className="text-xs text-slate-500 font-medium">{prod.warranty}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleOpenQuickPrice(prod)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            title="Quickly change manual price and subsidy"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Manual Rate (रेट बदलें)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(prod)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Full Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: GALLERY MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
                <div>
                  <h3 className="text-base font-black text-slate-900">Project Installation Gallery</h3>
                  <p className="text-xs text-slate-500">Photos added here automatically appear on <Link to="/gallery" target="_blank" className="text-emerald-600 font-bold underline">/gallery</Link></p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Project Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={item.image || solarHeroImg}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 shadow-md">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.title}</h4>
                      <p className="text-xs text-emerald-600 font-bold">{item.capacity} • {item.savings}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                    </div>

                    <div className="p-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditGallery(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGallery(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: SOLAR PROJECT PROFIT & LOSS MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'management' && (
            <div className="space-y-6">
              <ProjectManagement onShowToast={showToast} />
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: STAFF AUTHORITY & LOGIN CREDENTIALS MANAGEMENT */}
          {/* ============================================================ */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              {/* Header Hero Section */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Admin Authority & Access Control</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Staff User Management & Portal Login
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                      Admin can create and manage unlimited staff accounts. Generate custom Email & Password credentials for any staff member, which they can immediately use to log into the Staff Project Portal.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddStaffModal(true)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ Add New Staff Member</span>
                    </button>
                    <Link
                      to="/staff/login"
                      target="_blank"
                      className="px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 text-sky-400" />
                      <span>Open Staff Login</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4 Staff Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* 1. Total Staff */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">TOTAL STAFF</span>
                    <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{staffList.length}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 font-medium">Configured by Admin</span>
                    <span className="font-bold text-blue-600">{staffList.length} Accounts</span>
                  </div>
                </div>

                {/* 2. Active Staff */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">ACTIVE ACCOUNTS</span>
                    <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">{activeStaffCount}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 font-medium">Can Log In</span>
                    <span className="font-bold text-emerald-600">Access Enabled</span>
                  </div>
                </div>

                {/* 3. Inactive / Suspended */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">INACTIVE / BLOCKED</span>
                    <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <UserX className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">{inactiveStaffCount}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 font-medium">Login Blocked</span>
                    <span className="font-bold text-rose-600">Deactivated</span>
                  </div>
                </div>

                {/* 4. Staff Login Portal URL */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">LOGIN URL</span>
                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-sm font-black text-slate-900 font-mono truncate">/staff/login</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 font-medium">Portal Access</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCredential(`${window.location.origin}/staff/login`, 'Portal URL', 'portal')}
                      className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'portal-Portal URL' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'portal-Portal URL' ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Staff Directory Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Tabs */}
                    <button
                      type="button"
                      onClick={() => setStaffStatusFilter('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${staffStatusFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      All Staff ({staffList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffStatusFilter('Active')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${staffStatusFilter === 'Active'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                    >
                      Active ({activeStaffCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffStatusFilter('Inactive')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${staffStatusFilter === 'Inactive'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                    >
                      Inactive ({inactiveStaffCount})
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1 sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search name, email, phone, role..."
                        value={staffSearchQuery}
                        onChange={(e) => setStaffSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                      />
                      {staffSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setStaffSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddStaffModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>+ Add Staff</span>
                    </button>
                  </div>
                </div>

                {/* Staff Directory Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b-2 border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="pb-3.5 pl-2">Staff Member & Badge</th>
                        <th className="pb-3.5">Login Email & Password</th>
                        <th className="pb-3.5">Role & Department</th>
                        <th className="pb-3.5">Contact Phone</th>
                        <th className="pb-3.5">Login Status</th>
                        <th className="pb-3.5 pr-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStaffList.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center">
                            <div className="max-w-xs mx-auto space-y-3">
                              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                                <Users className="w-6 h-6" />
                              </div>
                              <p className="font-bold text-slate-800 text-sm">No Staff Members Found</p>
                              <p className="text-xs text-slate-500">
                                {staffSearchQuery || staffStatusFilter !== 'all'
                                  ? 'Try adjusting your search query or filter.'
                                  : 'Click "+ Add New Staff Member" to add your first staff account with custom login credentials.'}
                              </p>
                              <button
                                type="button"
                                onClick={() => setShowAddStaffModal(true)}
                                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
                              >
                                + Add Staff Member
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredStaffList.map((st) => {
                          const isShowingPass = !!showPasswords[st.id];
                          const isActive = (st.status || 'Active') === 'Active';

                          return (
                            <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* 1. Staff Profile */}
                              <td className="py-3.5 pl-2 font-bold text-slate-900">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                                    {(st.name || 'S').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-black text-slate-900 block text-xs sm:text-sm">
                                      {st.name}
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                                        {st.badgeId || 'P24-STAFF'}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        ID: {st.id.slice(0, 10)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Login Credentials (Email & Password) */}
                              <td className="py-3.5">
                                <div className="space-y-1.5">
                                  {/* Email with copy */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-extrabold uppercase text-slate-400 w-10">Email:</span>
                                    <code className="px-2 py-0.5 rounded-lg bg-slate-100 font-mono text-slate-900 font-bold text-xs">
                                      {st.email}
                                    </code>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyCredential(st.email, 'Email', st.id)}
                                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                      title="Copy Login Email"
                                    >
                                      {copiedId === `${st.id}-Email` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Password with eye and copy */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-extrabold uppercase text-slate-400 w-10">Pass:</span>
                                    <code className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-950 font-mono font-bold text-xs border border-amber-200">
                                      {isShowingPass ? st.password : '••••••••'}
                                    </code>
                                    <button
                                      type="button"
                                      onClick={() => togglePasswordVisibility(st.id)}
                                      className="p-1 rounded-md text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                      title={isShowingPass ? 'Hide Password' : 'Show Password'}
                                    >
                                      {isShowingPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyCredential(st.password, 'Password', st.id)}
                                      className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                      title="Copy Password"
                                    >
                                      {copiedId === `${st.id}-Password` ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* 3. Role & Department */}
                              <td className="py-3.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px] block w-fit mb-0.5">
                                  {st.role || 'Solar Project Incharge'}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-medium">
                                  {st.department || 'Solar Project Operations'}
                                </span>
                              </td>

                              {/* 4. Contact Phone */}
                              <td className="py-3.5 font-bold">
                                {st.phone ? (
                                  <a
                                    href={`tel:${st.phone}`}
                                    className="text-slate-800 hover:text-blue-600 font-mono text-xs flex items-center gap-1"
                                  >
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span>{st.phone}</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-400 font-normal italic text-[11px]">Not provided</span>
                                )}
                              </td>

                              {/* 5. Status Toggle */}
                              <td className="py-3.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStaffStatus(st.id, st.status || 'Active', st.name)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${isActive
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                                    }`}
                                  title="Click to toggle account status (Active / Inactive)"
                                >
                                  {isActive ? (
                                    <>
                                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Active (Allowed)</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="w-3.5 h-3.5 text-rose-600" />
                                      <span>Inactive (Blocked)</span>
                                    </>
                                  )}
                                </button>
                              </td>

                              {/* 6. Action Buttons */}
                              <td className="py-3.5 pr-2 text-right">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingStaff({ ...st });
                                      setShowEditStaffModal(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                                    title="Edit Staff Credentials & Details"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStaff(st.id, st.name)}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                    title="Delete Staff Account"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* How Staff Login Works - Information Guide Card */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 text-slate-300 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>How Staff Access & Login Works:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-black flex items-center justify-center text-xs">
                      1
                    </div>
                    <p className="font-bold text-white">Admin Adds Staff & Credentials</p>
                    <p className="text-slate-400 leading-relaxed">
                      Admin enters any custom email (e.g. <code className="text-sky-300">staff@power24.com</code>) and any password of choice.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs">
                      2
                    </div>
                    <p className="font-bold text-white">Staff Logs In Directly</p>
                    <p className="text-slate-400 leading-relaxed">
                      Staff opens <code className="text-emerald-300">/staff/login</code>, inputs the assigned credentials, and gains instant access to the Project Management portal.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-xs">
                      3
                    </div>
                    <p className="font-bold text-white">Full Admin Control 24/7</p>
                    <p className="text-slate-400 leading-relaxed">
                      Admin can update passwords, change staff details, or switch status to <span className="text-rose-400 font-bold">Inactive</span> to block access at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD PRODUCT / KIT */}
      {/* ============================================================ */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <PackagePlus className="w-5 h-5 text-[#d91478]" />
                  <span>Add Solar Kit or Product</span>
                </h3>
                <p className="text-xs text-slate-500">Choose whether to list a complete solar kit with 1kW–10kW capacity rates, or a standalone product</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Selector Toggle */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setProductType('kit')}
                className={`py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${productType === 'kit'
                  ? 'bg-gradient-to-r from-[#d91478] to-[#16a34a] text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <span>☀️ Complete Solar Kit (1kW–10kW)</span>
              </button>
              <button
                type="button"
                onClick={() => setProductType('product')}
                className={`py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${productType === 'product'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <span>⚡ Individual Product (Panel/Inverter)</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="font-bold uppercase block mb-1">
                  {productType === 'kit' ? 'Solar Kit Title' : 'Product Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={productType === 'kit' ? 'e.g. Tata Power 1kW–10kW On-Grid Complete Solar System' : 'e.g. Power24 600W Bi-Facial Solar Module'}
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#d91478] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {productType === 'product' ? (
                  <div>
                    <label className="font-bold uppercase block mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="panels">Solar Cells & Panels</option>
                      <option value="inverters">Smart Inverters</option>
                      <option value="batteries">Battery Storage</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="font-bold uppercase block mb-1">Brand / System Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Tata Power / Tier-1 On-Grid"
                      value={newProduct.tag}
                      onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold uppercase block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. PM Surya Ghar Approved / Best Seller"
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Manual Pricing & Subsidy Override (मैनुअल रेट और सब्सिडी सेट करें) */}
              <div className="bg-gradient-to-br from-pink-50/70 via-slate-50 to-emerald-50/50 p-4 rounded-2xl border-2 border-pink-200/90 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-black uppercase text-slate-900 text-xs flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#d91478]" />
                    <span>Manual Price & Subsidy Customization (मैनुअल रेट/सब्सिडी)</span>
                  </label>
                  <span className="text-[10px] text-[#d91478] font-bold">Direct Front Display Controls</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Effective Display Price */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 mb-1">
                      1. Effective Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 35000"
                      value={newProduct.manualPrice ?? ''}
                      onChange={(e) => setNewProduct({ ...newProduct, manualPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border-2 border-pink-300 text-slate-900 font-black text-sm font-mono focus:outline-none focus:border-[#d91478]"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">मुख्य बड़ा रेट (जैसे ₹35,000*)</span>
                  </div>

                  {/* Gross / MRP Price */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 mb-1">
                      2. Gross / MRP Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 65000"
                      value={newProduct.manualGross ?? ''}
                      onChange={(e) => setNewProduct({ ...newProduct, manualGross: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-sm font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">कटने वाला कुल रेट (जैसे ₹65,000)</span>
                  </div>

                  {/* Subsidy Discount Amount */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 mb-1">
                      3. Subsidy Discount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 30000"
                      value={newProduct.manualSubsidy ?? ''}
                      onChange={(e) => setNewProduct({ ...newProduct, manualSubsidy: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-sm font-mono focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">सब्सिडी छूट (जैसे -₹30,000 Subsidy)</span>
                  </div>
                </div>

                {/* Custom Label (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Price Label (वैकल्पिक / Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Effective 1kW Price (After Subsidy)"
                    value={newProduct.priceLabel || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, priceLabel: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:border-[#d91478]"
                  />
                </div>

                {/* Live Realtime Preview matching user's screenshot */}
                <div className="p-3 rounded-2xl bg-white border border-pink-200 shadow-2xs space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                    🔴 Live Customer Preview on Website (/product):
                  </span>
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-50/90 via-slate-50 to-emerald-50/70 border border-pink-200/80 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-slate-500 block">
                        {newProduct.priceLabel || (productType === 'kit' ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price')}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-[#d91478] font-mono">
                          ₹{Number(newProduct.manualPrice || 35000).toLocaleString('en-IN')}*
                        </span>
                        {newProduct.manualGross && (
                          <span className="text-xs text-slate-400 line-through font-bold font-mono">
                            ₹{Number(newProduct.manualGross).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    {newProduct.manualSubsidy && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300">
                        -₹{Number(newProduct.manualSubsidy).toLocaleString('en-IN')} Subsidy
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* If Single Product: Ask for single unit price string */}
              {productType === 'product' && (
                <div>
                  <label className="font-bold uppercase block mb-1">Hardware Rate String (₹ / Watt)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹24 / Watt or ₹26 / Watt"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              )}

              {/* If Kit: Capacity-based Pricing inputs for 1kW to 10kW */}
              {productType === 'kit' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-black uppercase text-slate-900 text-xs flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#d91478]" />
                      <span>Capacity-Wise Kit Pricing (1kW to 10kW in ₹)</span>
                    </label>
                    <span className="text-[11px] text-slate-500">Gross kit price before subsidy</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['1kW', '2kW', '3kW', '4kW', '5kW', '6kW', '8kW', '10kW'].map((kw) => (
                      <div key={kw} className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <label className="block text-[11px] font-black text-slate-700 mb-1">{kw} Kit Price (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 68000"
                          value={kw === '1kW' ? (newProduct.manualGross || newProduct.capacityPricing?.[kw] || '') : (newProduct.capacityPricing?.[kw] || '')}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setNewProduct({
                              ...newProduct,
                              manualGross: kw === '1kW' ? val : newProduct.manualGross,
                              capacityPricing: {
                                ...newProduct.capacityPricing,
                                [kw]: val,
                              }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#d91478]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase block mb-1">Efficiency / Spec</label>
                  <input
                    type="text"
                    placeholder="e.g. 23.8% Efficiency / Bi-Facial"
                    value={newProduct.efficiency}
                    onChange={(e) => setNewProduct({ ...newProduct, efficiency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Warranty</label>
                  <input
                    type="text"
                    placeholder="e.g. 25-Year Performance Warranty"
                    value={newProduct.warranty}
                    onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="System inclusions, cell technology and performance details..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                ></textarea>
              </div>

              <div>
                <label className="font-bold uppercase block mb-1">Key Inclusions / Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. TopCon Panels, Smart MPPT Inverter, GI Structure, Net Metering Approval"
                  value={newProduct.features}
                  onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase block text-slate-800">
                    Product Photos / Multi-Image Gallery (Optional)
                  </label>
                  <span className="text-[10px] text-slate-500 font-bold">
                    {newProduct.images?.length || (newProduct.image ? 1 : 0)} photos added
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      1. Select 1 or Multiple Image Files:
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleMultiImageUpload(e, newProduct.images, (imgs) => setNewProduct({ ...newProduct, images: imgs, image: imgs[0] || '' }))}
                      className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#d91478]/10 file:text-[#d91478] hover:file:bg-[#d91478]/20 cursor-pointer w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Or paste image URL (e.g. https://...)"
                      value={newProductUrlInput}
                      onChange={(e) => setNewProductUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#d91478]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newProductUrlInput.trim()) {
                          const updated = [...(newProduct.images || []), newProductUrlInput.trim()];
                          setNewProduct({ ...newProduct, images: updated, image: updated[0] });
                          setNewProductUrlInput('');
                        }
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                    >
                      + Add URL
                    </button>
                  </div>

                  {newProduct.images && newProduct.images.length > 0 && (
                    <div className="pt-1">
                      <span className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">Gallery Thumbnails (First is Cover Image):</span>
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                        {newProduct.images.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-300 shrink-0 group">
                            <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-[#d91478] text-white text-[8px] font-black text-center uppercase py-0.5">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = newProduct.images.filter((_, i) => i !== idx);
                                setNewProduct({ ...newProduct, images: filtered, image: filtered[0] || '' });
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow cursor-pointer opacity-90 hover:opacity-100"
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  {productType === 'kit' ? 'Save Solar Kit' : 'Save Solar Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT PRODUCT & MANAGE PRICE FLUCTUATIONS */}
      {/* ============================================================ */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-blue-600" />
                  <span>Edit Product & Manage Pricing</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Update market rates, capacity-based kW pricing, technical specs, or multi-image gallery
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditingProduct(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="font-bold uppercase block mb-1">
                  {editingProduct.isKit ? 'Solar Kit Title' : 'Product Title'}
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase block mb-1">Category / Type</label>
                  <select
                    value={editingProduct.category || (editingProduct.isKit ? 'kits' : 'panels')}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setEditingProduct({
                        ...editingProduct,
                        category: newCat,
                        isKit: newCat === 'kits',
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="kits">Solar Complete Kit (1kW - 10kW)</option>
                    <option value="panels">Solar Cells & Panels (for Own Kit)</option>
                    <option value="inverters">Smart Inverters (for Own Kit)</option>
                    <option value="batteries">Battery Storage (for Own Kit)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Solar Kit / Best Seller"
                    value={editingProduct.tag}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Manual Pricing & Subsidy Override (मैनुअल रेट और सब्सिडी बदलें) */}
              <div className="bg-gradient-to-br from-pink-50/70 via-slate-50 to-emerald-50/50 p-4 rounded-2xl border-2 border-pink-200/90 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="font-black uppercase text-slate-900 text-xs flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#d91478]" />
                    <span>Manual Price & Subsidy Customization (मैनुअल रेट/सब्सिडी)</span>
                  </label>
                  <span className="text-[10px] text-[#d91478] font-bold">Direct Front Display Controls</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Effective Display Price */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 mb-1">
                      1. Effective Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 35000"
                      value={editingProduct.manualPrice ?? ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, manualPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border-2 border-pink-300 text-slate-900 font-black text-sm font-mono focus:outline-none focus:border-[#d91478]"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">मुख्य बड़ा रेट (जैसे ₹35,000*)</span>
                  </div>

                  {/* Gross / MRP Price */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 mb-1">
                      2. Gross / MRP Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 65000"
                      value={editingProduct.manualGross ?? ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, manualGross: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-sm font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">कटने वाला कुल रेट (जैसे ₹65,000)</span>
                  </div>

                  {/* Subsidy Discount Amount */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 mb-1">
                      3. Subsidy Discount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 30000"
                      value={editingProduct.manualSubsidy ?? ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, manualSubsidy: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-sm font-mono focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">सब्सिडी छूट (जैसे -₹30,000 Subsidy)</span>
                  </div>
                </div>

                {/* Custom Label (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Price Label (वैकल्पिक / Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Effective 1kW Price (After Subsidy)"
                    value={editingProduct.priceLabel || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceLabel: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:border-[#d91478]"
                  />
                </div>

                {/* Live Realtime Preview matching user's screenshot */}
                <div className="p-3 rounded-2xl bg-white border border-pink-200 shadow-2xs space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                    🔴 Live Customer Preview on Website (/product):
                  </span>
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-50/90 via-slate-50 to-emerald-50/70 border border-pink-200/80 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-slate-500 block">
                        {editingProduct.priceLabel || (editingProduct.isKit ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price')}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-[#d91478] font-mono">
                          ₹{Number(editingProduct.manualPrice || 35000).toLocaleString('en-IN')}*
                        </span>
                        {editingProduct.manualGross && (
                          <span className="text-xs text-slate-400 line-through font-bold font-mono">
                            ₹{Number(editingProduct.manualGross).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    {editingProduct.manualSubsidy && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300">
                        -₹{Number(editingProduct.manualSubsidy).toLocaleString('en-IN')} Subsidy
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Single Product Price (if not a solar kit) */}
              {!editingProduct.isKit && (
                <div>
                  <label className="font-bold uppercase block mb-1">Hardware Rate String (₹ / Watt)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹24 / Watt or ₹26 / Watt"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              )}

              {/* Solar Kit ONLY: Capacity-based Pricing inputs for 1kW to 10kW */}
              {editingProduct.isKit && (
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-black uppercase text-slate-900 text-xs flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Edit Kit Capacity Rates (1kW to 10kW in ₹)</span>
                    </label>
                    <span className="text-[10px] text-blue-600 font-bold">Live pricing on /product and /product/:id</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['1kW', '2kW', '3kW', '4kW', '5kW', '6kW', '8kW', '10kW'].map((kw) => (
                      <div key={kw} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <label className="block text-[11px] font-black text-slate-800 mb-1">{kw} Kit Price (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 65000"
                          value={kw === '1kW' ? (editingProduct.manualGross || editingProduct.capacityPricing?.[kw] || '') : (editingProduct.capacityPricing?.[kw] ?? '')}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setEditingProduct({
                              ...editingProduct,
                              manualGross: kw === '1kW' ? val : editingProduct.manualGross,
                              capacityPricing: {
                                ...editingProduct.capacityPricing,
                                [kw]: val,
                              }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase block mb-1">Efficiency / Spec</label>
                  <input
                    type="text"
                    value={editingProduct.efficiency}
                    onChange={(e) => setEditingProduct({ ...editingProduct, efficiency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Warranty</label>
                  <input
                    type="text"
                    value={editingProduct.warranty}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warranty: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                ></textarea>
              </div>

              <div>
                <label className="font-bold uppercase block mb-1">Key Inclusions / Features (Comma separated)</label>
                <input
                  type="text"
                  value={editingProduct.features}
                  onChange={(e) => setEditingProduct({ ...editingProduct, features: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Edit Multi-Image Gallery */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase block text-slate-800">
                    Manage Product Photos ({editingProduct.images?.length || 0} photos)
                  </label>
                  <span className="text-[10px] text-blue-600 font-bold">First image is Main Cover</span>
                </div>

                <div className="p-3 bg-blue-50/40 rounded-2xl border border-blue-200 space-y-3">
                  {/* Gallery Thumbnails with remove button */}
                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                        {editingProduct.images.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-300 shrink-0 group">
                            <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[8px] font-black text-center uppercase py-0.5">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = editingProduct.images.filter((_, i) => i !== idx);
                                setEditingProduct({ ...editingProduct, images: filtered, image: filtered[0] || '' });
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow cursor-pointer opacity-90 hover:opacity-100"
                              title="Delete photo"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add more files */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      + Add More Photo Files:
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleMultiImageUpload(e, editingProduct.images, (imgs) => setEditingProduct({ ...editingProduct, images: imgs, image: imgs[0] || '' }))}
                      className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer w-full"
                    />
                  </div>

                  {/* Add by URL */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Or paste photo URL to add to gallery"
                      value={editProductUrlInput}
                      onChange={(e) => setEditProductUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editProductUrlInput.trim()) {
                          const updated = [...(editingProduct.images || []), editProductUrlInput.trim()];
                          setEditingProduct({ ...editingProduct, images: updated, image: updated[0] });
                          setEditProductUrlInput('');
                        }
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Save Changes & Update Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD GALLERY PHOTO */}
      {/* ============================================================ */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Image className="w-5 h-5 text-emerald-600" />
                <span>Add Installation to Gallery</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddGalleryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGallery} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="font-bold uppercase block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 kW Residential Rooftop Solar System"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase block mb-1">Category</label>
                  <select
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Location / City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gorakhpur, UP"
                    value={newGallery.location}
                    onChange={(e) => setNewGallery({ ...newGallery, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase block mb-1">Capacity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 kW System"
                    value={newGallery.capacity}
                    onChange={(e) => setNewGallery({ ...newGallery, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Savings Metric</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 90% Bill Cut"
                    value={newGallery.savings}
                    onChange={(e) => setNewGallery({ ...newGallery, savings: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase block mb-1">Upload Installation Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileChange(e, (dataUrl) => setNewGallery({ ...newGallery, image: dataUrl }))}
                  className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {newGallery.image && (
                  <div className="mt-2 w-20 h-14 rounded-xl overflow-hidden border border-slate-200">
                    <img src={newGallery.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-black uppercase tracking-wider shadow-sm"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT GALLERY PHOTO / PROJECT */}
      {/* ============================================================ */}
      {showEditGalleryModal && editingGallery && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-emerald-600" />
                <span>Edit Gallery Project</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditGalleryModal(false);
                  setEditingGallery(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditGallery} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="font-bold uppercase block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 kW Residential Rooftop Solar System"
                  value={editingGallery.title}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase block mb-1">Category</label>
                  <select
                    value={editingGallery.category}
                    onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Location / City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gorakhpur, UP"
                    value={editingGallery.location}
                    onChange={(e) => setEditingGallery({ ...editingGallery, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase block mb-1">Capacity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 kW System"
                    value={editingGallery.capacity}
                    onChange={(e) => setEditingGallery({ ...editingGallery, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase block mb-1">Savings Metric</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 90% Bill Cut"
                    value={editingGallery.savings}
                    onChange={(e) => setEditingGallery({ ...editingGallery, savings: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Image Input Options (URL or Local Upload) */}
              <div className="space-y-2">
                <label className="font-bold uppercase block">Project Image (Photo / CDN URL)</label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste Image URL (https://ik.imagekit.io/...)"
                    value={editGalleryUrlInput}
                    onChange={(e) => setEditGalleryUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  {editGalleryUrlInput.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGallery({ ...editingGallery, image: editGalleryUrlInput.trim() });
                        setEditGalleryUrlInput('');
                      }}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs shrink-0 cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">or upload file:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, (dataUrl) => setEditingGallery({ ...editingGallery, image: dataUrl }))}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>

                {editingGallery.image && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    <img src={editingGallery.image} alt="Preview" className="w-20 h-16 rounded-xl object-cover border border-slate-200" />
                    <div className="text-[11px] text-slate-600 font-medium truncate flex-1">
                      <span className="font-bold block text-slate-800">Current Image Preview</span>
                      <span className="text-[10px] text-slate-500 truncate block">{editingGallery.image.slice(0, 50)}...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditGalleryModal(false);
                    setEditingGallery(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD STAFF MEMBER & GENERATE LOGIN CREDENTIALS */}
      {/* ============================================================ */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Add New Staff Member</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create custom email and password credentials for staff portal login
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs text-slate-700">
              {/* Name */}
              <div>
                <label className="font-extrabold uppercase text-slate-800 block mb-1">
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma / Priya Singh"
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Login Credentials Section (Email & Password) */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-sky-50/80 rounded-2xl border border-blue-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-900 font-black uppercase text-[11px]">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span>Login Credentials for Staff Portal</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold">Portal: /staff/login</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email */}
                  <div>
                    <label className="font-bold uppercase text-slate-700 block mb-1">
                      Staff Login Email *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. rahul@power24.com"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold uppercase text-slate-700 block">
                        Login Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const randomNum = Math.floor(1000 + Math.random() * 9000);
                          setNewStaffForm({ ...newStaffForm, password: `p24staff#${randomNum}` });
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        🎲 Auto Generate
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showAddStaffPassword ? 'text' : 'password'}
                        required
                        placeholder="e.g. staff123 / secretPass"
                        value={newStaffForm.password}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAddStaffPassword(!showAddStaffPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showAddStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Designation / Role
                  </label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Solar Project Incharge">Solar Project Incharge</option>
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Project Operations Manager">Project Operations Manager</option>
                    <option value="Field Survey Officer">Field Survey Officer</option>
                    <option value="Solar Technician">Solar Technician</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Solar Project Operations"
                    value={newStaffForm.department}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone, Badge ID, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Badge ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Auto generated if blank"
                    value={newStaffForm.badgeId}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, badgeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Account Status
                  </label>
                  <select
                    value={newStaffForm.status}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Active">Active (Can Login)</option>
                    <option value="Inactive">Inactive (Blocked)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-2xl text-[11px] text-slate-600 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Once created, the staff member can instantly log in at <code className="font-bold text-blue-700">/staff/login</code> with these credentials.</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create Staff Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT STAFF MEMBER & UPDATE PASSWORD */}
      {/* ============================================================ */}
      {showEditStaffModal && editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <span>Edit Staff Account & Password</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update login credentials, reset password, or change designation
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditStaffModal(false);
                  setEditingStaff(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStaff} className="space-y-4 text-xs text-slate-700">
              {/* Name */}
              <div>
                <label className="font-extrabold uppercase text-slate-800 block mb-1">
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Login Credentials Section (Email & Password) */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-sky-50/80 rounded-2xl border border-blue-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-900 font-black uppercase text-[11px]">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span>Staff Portal Login Credentials</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold">Portal: /staff/login</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email */}
                  <div>
                    <label className="font-bold uppercase text-slate-700 block mb-1">
                      Staff Login Email *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingStaff.email}
                      onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold uppercase text-slate-700 block">
                        Login Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const randomNum = Math.floor(1000 + Math.random() * 9000);
                          setEditingStaff({ ...editingStaff, password: `p24staff#${randomNum}` });
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        🎲 Reset Random
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showEditStaffPassword ? 'text' : 'password'}
                        required
                        value={editingStaff.password}
                        onChange={(e) => setEditingStaff({ ...editingStaff, password: e.target.value })}
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditStaffPassword(!showEditStaffPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showEditStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Designation / Role
                  </label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Solar Project Incharge">Solar Project Incharge</option>
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Project Operations Manager">Project Operations Manager</option>
                    <option value="Field Survey Officer">Field Survey Officer</option>
                    <option value="Solar Technician">Solar Technician</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editingStaff.department}
                    onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone, Badge ID, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Badge ID
                  </label>
                  <input
                    type="text"
                    value={editingStaff.badgeId}
                    onChange={(e) => setEditingStaff({ ...editingStaff, badgeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold uppercase text-slate-800 block mb-1">
                    Account Status
                  </label>
                  <select
                    value={editingStaff.status || 'Active'}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Active">Active (Can Login)</option>
                    <option value="Inactive">Inactive (Blocked)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditStaffModal(false);
                    setEditingStaff(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: QUICK 1-CLICK MANUAL PRICE EDITOR */}
      {/* ============================================================ */}
      {showQuickPriceModal && quickPriceProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl border-2 border-pink-200 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d91478] to-[#16a34a] flex items-center justify-center text-white shadow-md">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Quick Manual Rate Editor (मैनुअल रेट सेट करें)
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {quickPriceProduct.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowQuickPriceModal(false);
                  setQuickPriceProduct(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickPrice} className="space-y-4 text-xs text-slate-700">
              {/* Product Info Bar */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {quickPriceProduct.image && (
                  <img
                    src={quickPriceProduct.image}
                    alt={quickPriceProduct.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-[#d91478] block">
                    {quickPriceProduct.tag || (quickPriceProduct.isKit ? 'Solar Kit' : 'Solar Hardware')}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {quickPriceProduct.name}
                  </h4>
                </div>
              </div>

              {/* 3 Main Pricing Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-br from-pink-50/80 via-white to-emerald-50/60 rounded-2xl border-2 border-pink-200/90 shadow-2xs">
                {/* 1. Effective Display Price */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 mb-1">
                    1. Effective Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35000"
                    value={quickPriceForm.manualPrice ?? ''}
                    onChange={(e) => setQuickPriceForm({
                      ...quickPriceForm,
                      manualPrice: e.target.value === '' ? '' : Number(e.target.value),
                    })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-pink-400 text-slate-900 font-black text-base font-mono focus:outline-none focus:border-[#d91478] shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1 font-medium">
                    ऑफर रेट (₹35,000*)
                  </span>
                </div>

                {/* 2. Gross / MRP Price */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 mb-1">
                    2. Gross / MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 65000"
                    value={quickPriceForm.manualGross ?? ''}
                    onChange={(e) => setQuickPriceForm({
                      ...quickPriceForm,
                      manualGross: e.target.value === '' ? '' : Number(e.target.value),
                    })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-base font-mono focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1 font-medium">
                    कटने वाला रेट (₹65,000)
                  </span>
                </div>

                {/* 3. Subsidy Discount Amount */}
                <div>
                  <label className="block text-[11px] font-black text-slate-800 mb-1">
                    3. Subsidy (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 30000"
                    value={quickPriceForm.manualSubsidy ?? ''}
                    onChange={(e) => setQuickPriceForm({
                      ...quickPriceForm,
                      manualSubsidy: e.target.value === '' ? '' : Number(e.target.value),
                    })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-base font-mono focus:outline-none focus:border-emerald-600 shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1 font-medium">
                    सब्सिडी (-₹30,000)
                  </span>
                </div>
              </div>

              {/* Custom Label (Optional) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Price Heading / Custom Label (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="Effective 1kW Price (After Subsidy)"
                  value={quickPriceForm.priceLabel || ''}
                  onChange={(e) => setQuickPriceForm({ ...quickPriceForm, priceLabel: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:border-[#d91478]"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Front-End Card Live Preview:</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Will update instantly on /product
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-50/90 via-slate-50 to-emerald-50/70 border-2 border-pink-200/90 flex items-center justify-between gap-2 shadow-sm">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase text-slate-500 block">
                      {quickPriceForm.priceLabel || (quickPriceProduct.isKit ? 'Effective 1kW Price (After Subsidy)' : 'Effective Offer Price')}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-[#d91478] font-mono">
                        ₹{Number(quickPriceForm.manualPrice || 35000).toLocaleString('en-IN')}*
                      </span>
                      {quickPriceForm.manualGross && (
                        <span className="text-xs text-slate-400 line-through font-bold font-mono">
                          ₹{Number(quickPriceForm.manualGross).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  {quickPriceForm.manualSubsidy && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
                      -₹{Number(quickPriceForm.manualSubsidy).toLocaleString('en-IN')} Subsidy
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickPriceModal(false);
                    setQuickPriceProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d91478] to-[#16a34a] hover:opacity-95 text-white font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save & Update Rate Live (रेट सेव करें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
