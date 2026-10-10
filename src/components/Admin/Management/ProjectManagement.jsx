import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Building,
  DollarSign,
  CreditCard,
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  MapPin,
  FileText,
  Printer,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  X,
  Sparkles,
  Layers,
  Wrench,
  Truck,
  Users,
  Info,
  BookOpen,
  User,
  Receipt,
  Wallet,
  ExternalLink,
  History,
  ClipboardList,
  Check
} from 'lucide-react';
import p24Logo from '../../../assets/P24logo.webp';
import {
  getManagementSites,
  addManagementSite,
  updateManagementSite,
  deleteManagementSite,
  getManagementExpenses,
  addManagementExpense,
  updateManagementExpense,
  deleteManagementExpense,
  getManagementPayments,
  addManagementPayment,
  updateManagementPayment,
  deleteManagementPayment,
  getManagementMaterialBudgets,
  addManagementBudgetItem,
  updateManagementBudgetItem,
  deleteManagementBudgetItem,
  saveManagementMaterialBudget
} from '../../../utils/storage';

const ProjectManagement = ({ onShowToast }) => {
  // Sub-tabs: 'all_in_one' | 'dashboard' | 'site_master' | 'expense_entry' | 'payment_entry' | 'material_budget'
  const [subTab, setSubTab] = useState('all_in_one');
  const [showLogicRulesGuide, setShowLogicRulesGuide] = useState(false);

  // State
  const [sites, setSites] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // All-in-One Operations Hub State
  const [selectedHubSiteId, setSelectedHubSiteId] = useState('');
  const [hubSearchQuery, setHubSearchQuery] = useState('');
  const [hubInnerTab, setHubInnerTab] = useState('all'); // 'all' | 'expenses' | 'payments' | 'materials' | 'pl_sheet'

  // Dashboard Filters
  const [selectedDashboardSiteId, setSelectedDashboardSiteId] = useState('ALL');

  // Search & Filter
  const [siteSearch, setSiteSearch] = useState('');
  const [siteStatusFilter, setSiteStatusFilter] = useState('ALL');
  const [siteDistrictFilter, setSiteDistrictFilter] = useState('ALL');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('ALL');
  const [expenseSiteFilter, setExpenseSiteFilter] = useState('ALL');
  const [expensePaymentModeFilter, setExpensePaymentModeFilter] = useState('ALL');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentSiteFilter, setPaymentSiteFilter] = useState('ALL');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('ALL');
  const [paymentModeFilter, setPaymentModeFilter] = useState('ALL');
  const [budgetSearch, setBudgetSearch] = useState('');
  const [budgetSiteFilter, setBudgetSiteFilter] = useState('ALL');
  const [budgetBrandFilter, setBudgetBrandFilter] = useState('ALL');
  const [selectedBudgetSiteId, setSelectedBudgetSiteId] = useState('');

  // Modals
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [showEditSiteModal, setShowEditSiteModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showAddBudgetItemModal, setShowAddBudgetItemModal] = useState(false);
  const [showEditBudgetItemModal, setShowEditBudgetItemModal] = useState(false);
  const [editingBudgetItem, setEditingBudgetItem] = useState(null);

  // Dedicated Print Slips Modals
  const [printingSite, setPrintingSite] = useState(null);
  const [printingExpense, setPrintingExpense] = useState(null);
  const [printingPayment, setPrintingPayment] = useState(null);

  // Date helper for HTML5 Date Inputs
  const getTodayDateStr = () => new Date().toISOString().split('T')[0];
  const formatForDateInput = (val) => {
    if (!val) return '';
    const str = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const parts = str.split(/[./-]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      }
      if (parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return str;
  };

  // Forms & Empty Generators
  const getEmptySiteForm = () => ({
    id: '',
    customerName: '',
    siteAddress: '',
    district: '',
    capacity: '',
    projectValue: '',
    loanAmount: '',
    customerMargin: '',
    materialCost: '',
    labourCost: '',
    transportCost: '',
    miscCost: '',
    amountReceived: '',
    siteStatus: 'Running',
    startDate: getTodayDateStr(),
    completionDate: '',
    remarks: '',
    phone: ''
  });

  const getEmptyExpenseForm = (currentSites = []) => ({
    id: '',
    siteId: currentSites.length > 0 ? currentSites[0].id : '',
    date: getTodayDateStr(),
    vendor: '',
    vendorContact: '',
    itemType: '',
    description: '',
    category: 'Material',
    qty: '',
    unit: 'NO',
    rate: '',
    amount: '',
    gstAmount: '',
    paymentMode: 'UPI',
    paymentStatus: 'Paid',
    billNo: '',
    paidBy: '',
    remarks: ''
  });

  const getEmptyPaymentForm = (currentSites = []) => ({
    id: '',
    siteId: currentSites.length > 0 ? currentSites[0].id : '',
    customerName: '',
    date: getTodayDateStr(),
    paymentType: 'Loan - Disbursement 1',
    disbursementStage: 'Disbursement 1',
    amount: '',
    paymentMode: 'NEFT/RTGS',
    bankName: '',
    refNo: '',
    receivedBy: '',
    receiptNo: '',
    remarks: ''
  });

  const getEmptyBudgetItemForm = (currentSites = []) => ({
    id: '',
    siteId: currentSites.length > 0 ? currentSites[0].id : '',
    material: '',
    category: 'Solar Modules',
    brand: '',
    specification: '',
    qty: '',
    unit: 'NO',
    budgetRate: '',
    budgetAmount: '',
    actualRate: '',
    actualAmount: '',
    procurementStatus: 'Delivered on Site',
    supplier: '',
    remarks: ''
  });

  const [newSiteForm, setNewSiteForm] = useState(getEmptySiteForm());
  const [newExpenseForm, setNewExpenseForm] = useState(getEmptyExpenseForm());
  const [newPaymentForm, setNewPaymentForm] = useState(getEmptyPaymentForm());
  const [newBudgetItemForm, setNewBudgetItemForm] = useState(getEmptyBudgetItemForm());
  const [pendingConfirm, setPendingConfirm] = useState(null);

  // Normalization Helpers
  const normSiteId = (id) => String(id || '').trim().toUpperCase();
  const normCategory = (cat) => String(cat || '').trim().toLowerCase();

  // Load Initial Data
  const loadAllData = () => {
    const s = getManagementSites();
    const e = getManagementExpenses();
    const p = getManagementPayments();
    const b = getManagementMaterialBudgets();
    setSites(s);
    setExpenses(e);
    setPayments(p);
    setBudgets(b);

    if (s.length > 0) {
      if (!selectedBudgetSiteId) {
        setSelectedBudgetSiteId(s[0].id);
      }
      setSelectedHubSiteId((prev) => (prev && s.some((item) => normSiteId(item.id) === normSiteId(prev)) ? prev : s[0].id));
    }
  };

  useEffect(() => {
    loadAllData();
    const handleSync = () => {
      loadAllData();
    };
    window.addEventListener('power24_sites_updated', handleSync);
    window.addEventListener('power24_expenses_updated', handleSync);
    window.addEventListener('power24_payments_updated', handleSync);
    window.addEventListener('power24_budgets_updated', handleSync);
    return () => {
      window.removeEventListener('power24_sites_updated', handleSync);
      window.removeEventListener('power24_expenses_updated', handleSync);
      window.removeEventListener('power24_payments_updated', handleSync);
      window.removeEventListener('power24_budgets_updated', handleSync);
    };
  }, []);

  const toast = (msg) => {
    if (onShowToast) onShowToast(msg);
  };

  // Helper for formatting Currency
  const formatINR = (val) => {
    const num = Number(val) || 0;
    const isNeg = num < 0;
    const absStr = Math.abs(num).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return isNeg ? `-₹${absStr}` : `₹${absStr}`;
  };

  // Helper for Number to Words (Indian Numbering Format for Invoices & Slips)
  const numberToWords = (num) => {
    const n = Math.floor(Math.abs(Number(num) || 0));
    if (n === 0) return 'Zero Rupees Only';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (num) => {
      let str = '';
      if (num > 99) {
        str += a[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      if (num > 19) {
        str += b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '') + ' ';
      } else if (num > 0) {
        str += a[num] + ' ';
      }
      return str;
    };

    let crore = Math.floor(n / 10000000);
    let remainder = n % 10000000;
    let lakh = Math.floor(remainder / 100000);
    remainder = remainder % 100000;
    let thousand = Math.floor(remainder / 1000);
    remainder = remainder % 1000;
    let hundred = remainder;

    let res = '';
    if (crore > 0) res += inWords(crore) + 'Crore ';
    if (lakh > 0) res += inWords(lakh) + 'Lakh ';
    if (thousand > 0) res += inWords(thousand) + 'Thousand ';
    if (hundred > 0) res += inWords(hundred);

    return res.trim() + ' Rupees Only';
  };

  // Direct Instant Print / Save as PDF Handlers (No Extra Web Popups)
  const handleDirectPrintSite = (st) => {
    if (!st) return;
    const siteExpenses = expenses.filter((e) => normSiteId(e.siteId) === normSiteId(st.id));
    const sitePayments = payments.filter((p) => normSiteId(p.siteId) === normSiteId(st.id));

    const matCost = siteExpenses.filter(e => normCategory(e.category) === 'material').reduce((a, c) => a + (Number(c.amount) || 0), 0);
    const labCost = siteExpenses.filter(e => normCategory(e.category) === 'labour').reduce((a, c) => a + (Number(c.amount) || 0), 0);
    const traCost = siteExpenses.filter(e => normCategory(e.category) === 'transport').reduce((a, c) => a + (Number(c.amount) || 0), 0);
    const misCost = siteExpenses.filter(e => normCategory(e.category) === 'misc').reduce((a, c) => a + (Number(c.amount) || 0), 0);
    const totExpense = matCost + labCost + traCost + misCost;

    const loan = Number(st.loanAmount) || 0;
    const margin = Number(st.customerMargin) || 0;
    const totIncome = (loan + margin) > 0 ? (loan + margin) : (Number(st.projectIncome) || Number(st.projectValue) || 0);
    const profit = totIncome - totExpense;
    const profitMargin = totIncome > 0 ? ((profit / totIncome) * 100) : 0;

    const totalReceived = sitePayments.reduce((a, c) => a + (Number(c.amount) || 0), 0);
    const totalPending = totIncome - totalReceived;

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      setPrintingSite(st);
      setTimeout(() => window.print(), 150);
      return;
    }

    const logoUrl = window.location.origin + '/P24logo.webp';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>POWER24 Solar Settlement Slip - ${st.id} - ${st.customerName || st.clientName || 'Customer'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; color: #0f172a; background: #fff; padding: 24px; font-size: 12px; }
          @media print {
            @page { margin: 8mm 10mm; size: A4 portrait; }
            body { padding: 0; }
          }
          .mono { font-family: 'JetBrains Mono', monospace; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px; }
          .brand { display: flex; align-items: center; gap: 12px; }
          .brand img { height: 48px; width: auto; object-fit: contain; }
          .brand-title { font-size: 22px; font-weight: 900; line-height: 1; }
          .p-pink { color: #d91478; }
          .p-green { color: #16a34a; }
          .p-blue { color: #0284c7; }
          .sub-text { font-size: 10px; color: #475569; font-weight: 600; margin-top: 4px; }
          .doc-tag { text-align: right; font-size: 11px; border-left: 2px solid #e2e8f0; padding-left: 12px; }
          .banner { text-align: center; background: linear-gradient(90deg, #0f172a, #0284c7, #16a34a); color: #fff; padding: 7px; border-radius: 8px; font-weight: 900; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 14px; }
          .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 14px; }
          .field-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; }
          .field-val { font-size: 12px; font-weight: 700; color: #0f172a; }
          .ledger-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
          .ledger-box { border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; font-size: 11px; }
          .ledger-head { padding: 7px 10px; font-weight: 900; font-size: 11px; color: #fff; text-transform: uppercase; display: flex; justify-content: space-between; }
          .head-inflow { background: #0284c7; }
          .head-outflow { background: #d91478; }
          .ledger-body { padding: 10px; background: #fff; }
          .row { display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #f1f5f9; }
          .row.total { font-weight: 900; font-size: 12px; border-top: 2px solid #cbd5e1; padding-top: 6px; margin-top: 4px; }
          .kpi-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #020617; color: #fff; padding: 12px; border-radius: 10px; margin-bottom: 14px; }
          .kpi-item span:first-child { font-size: 9px; color: #94a3b8; text-transform: uppercase; display: block; }
          .kpi-item span:last-child { font-size: 15px; font-weight: 900; }
          .c-green { color: #22c55e; }
          .c-pink { color: #f43f5e; }
          .c-sky { color: #38bdf8; }
          .c-amber { color: #fbbf24; }
          .tables-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; font-size: 10px; }
          .table-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px; background: #f8fafc; }
          .table-card h4 { font-weight: 900; font-size: 10px; margin-bottom: 4px; text-transform: uppercase; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { border-bottom: 1px solid #cbd5e1; padding: 3px 2px; color: #64748b; font-weight: 700; }
          td { padding: 3px 2px; border-bottom: 1px solid #f1f5f9; }
          .sig-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; text-align: center; border-top: 2px solid #0f172a; padding-top: 18px; margin-top: 20px; }
          .sig-line { border-bottom: 1px dashed #94a3b8; padding-bottom: 3px; font-weight: 700; margin-bottom: 4px; min-height: 20px; }
          .sig-title { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <img src="${logoUrl}" alt="POWER24" onerror="this.style.display='none'">
            <div>
              <div class="brand-title">
                <span class="p-pink">POWER</span><span class="p-green">24</span> <span class="p-blue">Solar Services Pvt Ltd</span>
              </div>
              <div class="sub-text">
                Authorized Rooftop Solar Installation & EPC Partner • Gorakhpur HQ, UP | Helpline: +91 94508 81224 | Web: www.power24.in
              </div>
            </div>
          </div>
          <div class="doc-tag mono">
            <div><strong>DATE:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
            <div style="color: #0284c7; font-weight: 900;">SITE ID: #${st.id}</div>
            <div style="font-size: 8px; color: #64748b;">OFFICIAL DOSSIER</div>
          </div>
        </div>

        <div class="banner">
          SOLAR PROJECT SETTLEMENT & PROFIT / LOSS SUMMARY STATEMENT
        </div>

        <div class="grid-4">
          <div>
            <span class="field-label">Customer Name</span>
            <span class="field-val" style="font-size: 13px;">${st.customerName || st.clientName || '-'}</span>
          </div>
          <div>
            <span class="field-label">Contact / Phone</span>
            <span class="field-val mono">${st.customerPhone || st.phone || st.contact || '-'}</span>
          </div>
          <div>
            <span class="field-label">Site Location / District</span>
            <span class="field-val">${st.siteAddress || st.district || '-'}</span>
          </div>
          <div>
            <span class="field-label">Solar Capacity</span>
            <span class="field-val mono" style="color: #0284c7;">${st.capacity || '-'} kW</span>
          </div>
          <div>
            <span class="field-label">Consumer / CA No.</span>
            <span class="field-val mono">${st.consumerNumber || st.caNumber || '-'}</span>
          </div>
          <div>
            <span class="field-label">DISCOM / Grid</span>
            <span class="field-val">${st.discom || 'UPPCL'}</span>
          </div>
          <div>
            <span class="field-label">Site Status</span>
            <span class="field-val" style="color: #16a34a; font-weight: 900;">${st.siteStatus || st.status || 'Running'}</span>
          </div>
          <div>
            <span class="field-label">Project Dates</span>
            <span class="field-val mono">${st.startDate || '-'} → ${st.completionDate || 'Ongoing'}</span>
          </div>
          ${(st.remarks || st.notes) ? `
            <div style="grid-column: span 4; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              <span class="field-label">Project Notes:</span>
              <span style="font-style: italic; color: #475569; font-size: 10px;">${st.remarks || st.notes}</span>
            </div>
          ` : ''}
        </div>

        <div class="ledger-grid">
          <div class="ledger-box">
            <div class="ledger-head head-inflow">
              <span>1. Project Inflow (Revenue)</span>
              <span class="mono">CREDIT</span>
            </div>
            <div class="ledger-body">
              <div class="row">
                <span>Project Quoted Value:</span>
                <span class="mono"><strong>${formatINR(st.projectValue || 0)}</strong></span>
              </div>
              <div class="row">
                <span>Bank Loan Component:</span>
                <span class="mono"><strong>${formatINR(loan)}</strong></span>
              </div>
              ${loan > 0 ? `
                <div style="padding-left: 8px; font-size: 9px; color: #64748b; background: #f8fafc; padding: 4px; border-radius: 4px; margin: 3px 0;">
                  <div style="display:flex;justify-content:space-between;">
                    <span>• Tranche 1 (Disb 1):</span>
                    <span class="mono" style="color:#0284c7;font-weight:700;">${formatINR(sitePayments.filter(p => normCategory(p.paymentType).includes('loan') && (p.disbursementStage === 'Disbursement 1' || (!p.disbursementStage && !String(p.paymentType).includes('2')))).reduce((a, c) => a + (Number(c.amount) || 0), 0))}</span>
                  </div>
                  <div style="display:flex;justify-content:space-between; margin-top: 2px;">
                    <span>• Tranche 2 (Disb 2):</span>
                    <span class="mono" style="color:#4f46e5;font-weight:700;">${formatINR(sitePayments.filter(p => normCategory(p.paymentType).includes('loan') && (p.disbursementStage === 'Disbursement 2' || String(p.paymentType).includes('2'))).reduce((a, c) => a + (Number(c.amount) || 0), 0))}</span>
                  </div>
                </div>
              ` : ''}
              <div class="row">
                <span>Customer Margin Amount:</span>
                <span class="mono"><strong>${formatINR(margin)}</strong></span>
              </div>
              <div class="row total" style="background: #f0f9ff; color: #0369a1; padding: 4px 6px; border-radius: 4px;">
                <span>TOTAL PROJECT INCOME:</span>
                <span class="mono">${formatINR(totIncome)}</span>
              </div>
              <div style="font-size: 8px; color: #64748b; font-style: italic; margin-top: 3px;">(${numberToWords(totIncome)})</div>
            </div>
          </div>

          <div class="ledger-box">
            <div class="ledger-head head-outflow">
              <span>2. Cost Outflow (Incurred Expenses)</span>
              <span class="mono">DEBIT</span>
            </div>
            <div class="ledger-body">
              <div class="row">
                <span>Material Cost (Panels/Inverter):</span>
                <span class="mono"><strong>${formatINR(matCost)}</strong></span>
              </div>
              <div class="row">
                <span>Labour & Installation Cost:</span>
                <span class="mono"><strong>${formatINR(labCost)}</strong></span>
              </div>
              <div class="row">
                <span>Transport & Freight:</span>
                <span class="mono"><strong>${formatINR(traCost)}</strong></span>
              </div>
              <div class="row">
                <span>Misc & Statutory Approvals:</span>
                <span class="mono"><strong>${formatINR(misCost)}</strong></span>
              </div>
              <div class="row total" style="background: #fff1f2; color: #9f1239; padding: 4px 6px; border-radius: 4px;">
                <span>TOTAL INCURRED EXPENSES:</span>
                <span class="mono">${formatINR(totExpense)}</span>
              </div>
              <div style="font-size: 8px; color: #64748b; font-style: italic; margin-top: 3px;">(${numberToWords(totExpense)})</div>
            </div>
          </div>
        </div>

        <div class="kpi-bar mono">
          <div class="kpi-item">
            <span>NET PROFIT / LOSS</span>
            <span class="${profit >= 0 ? 'c-green' : 'c-pink'}">${formatINR(profit)}</span>
          </div>
          <div class="kpi-item">
            <span>PROFIT MARGIN</span>
            <span class="c-sky">${profitMargin.toFixed(2)}%</span>
          </div>
          <div class="kpi-item">
            <span>TOTAL RECEIVED</span>
            <span class="c-green">${formatINR(totalReceived)}</span>
          </div>
          <div class="kpi-item">
            <span>PENDING / DUE</span>
            <span class="${totalPending > 0 ? 'c-amber' : ''}">${formatINR(totalPending)}</span>
          </div>
        </div>

        <div class="tables-grid">
          <div class="table-card">
            <h4>Expense Vouchers Logged (${siteExpenses.length})</h4>
            ${siteExpenses.length === 0 ? '<p style="color:#94a3b8; font-style:italic;">No expenses recorded.</p>' : `
              <table>
                <thead>
                  <tr><th>Date</th><th>Item / Vendor</th><th>Cat</th><th style="text-align:right;">Amt</th></tr>
                </thead>
                <tbody class="mono">
                  ${siteExpenses.slice(0, 6).map(e => `
                    <tr>
                      <td>${e.date || '-'}</td>
                      <td>${e.vendor || e.description || '-'}</td>
                      <td>${e.category}</td>
                      <td style="text-align:right; color:#e11d48; font-weight:700;">${formatINR(e.amount)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>

          <div class="table-card">
            <h4>Payment Receipts Logged (${sitePayments.length})</h4>
            ${sitePayments.length === 0 ? '<p style="color:#94a3b8; font-style:italic;">No payments recorded.</p>' : `
              <table>
                <thead>
                  <tr><th>Date</th><th>Type</th><th>Mode</th><th style="text-align:right;">Amt</th></tr>
                </thead>
                <tbody class="mono">
                  ${sitePayments.slice(0, 6).map(p => `
                    <tr>
                      <td>${p.date || '-'}</td>
                      <td>${p.disbursementStage ? `Loan (${p.disbursementStage === 'Disbursement 2' ? 'Disb 2' : 'Disb 1'})` : (p.paymentType || 'Receipt')}</td>
                      <td>${p.paymentMode}</td>
                      <td style="text-align:right; color:#16a34a; font-weight:700;">${formatINR(p.amount)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

        <div class="sig-grid">
          <div>
            <div class="sig-line">${st.customerName || 'Customer'}</div>
            <div class="sig-title">Customer Acceptance</div>
          </div>
          <div>
            <div class="sig-line">Solar Project Eng.</div>
            <div class="sig-title">Site Engineer</div>
          </div>
          <div>
            <div class="sig-line">Accounts Dept.</div>
            <div class="sig-title">Verified By</div>
          </div>
          <div>
            <div class="sig-line" style="color: #0284c7;">POWER24 Signatory</div>
            <div class="sig-title">Authorized Signatory</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDirectPrintExpense = (exp) => {
    if (!exp) return;
    const targetSite = sites.find(s => normSiteId(s.id) === normSiteId(exp.siteId));
    const printWindow = window.open('', '_blank', 'width=800,height=700');
    if (!printWindow) {
      setPrintingExpense(exp);
      setTimeout(() => window.print(), 150);
      return;
    }

    const logoUrl = window.location.origin + '/P24logo.webp';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Expense Voucher - ${exp.id}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Outfit', sans-serif; color: #0f172a; padding: 24px; font-size: 12px; }
          @media print {
            @page { margin: 10mm; size: A5 landscape; }
            body { padding: 0; }
          }
          .mono { font-family: 'JetBrains Mono', monospace; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
          .brand { display: flex; align-items: center; gap: 10px; }
          .brand img { height: 42px; width: auto; object-fit: contain; }
          .brand-title { font-size: 18px; font-weight: 900; line-height: 1; }
          .p-pink { color: #d91478; }
          .p-green { color: #16a34a; }
          .p-blue { color: #0284c7; }
          .banner { text-align: center; background: #be123c; color: #fff; padding: 6px; border-radius: 6px; font-weight: 900; font-size: 11px; text-transform: uppercase; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace; }
          .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 14px; }
          .field-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; }
          .field-val { font-size: 12px; font-weight: 700; color: #0f172a; }
          .amt-box { background: #fff1f2; border: 2px solid #fecdd3; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .amt-fig { font-size: 20px; font-weight: 900; color: #be123c; font-family: 'JetBrains Mono', monospace; }
          .sig-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; border-top: 2px solid #0f172a; padding-top: 18px; margin-top: 24px; }
          .sig-line { border-bottom: 1px dashed #94a3b8; padding-bottom: 4px; font-weight: 700; margin-bottom: 4px; }
          .sig-title { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <img src="${logoUrl}" alt="POWER24" onerror="this.style.display='none'">
            <div>
              <div class="brand-title">
                <span class="p-pink">POWER</span><span class="p-green">24</span> <span class="p-blue">Solar Services Pvt Ltd</span>
              </div>
              <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Gorakhpur HQ, UP | Helpline: +91 94508 81224 | Web: www.power24.in</div>
            </div>
          </div>
          <div class="mono" style="text-align: right; border-left: 2px solid #e2e8f0; padding-left: 10px;">
            <div><strong>DATE:</strong> ${exp.date || new Date().toLocaleDateString('en-IN')}</div>
            <div style="color: #be123c; font-weight: 900;">VOUCHER NO: #${exp.id || '-'}</div>
          </div>
        </div>

        <div class="banner">PAYMENT EXPENSE VOUCHER (DEBIT SLIP)</div>

        <div class="grid-3">
          <div>
            <span class="field-label">Site ID</span>
            <span class="field-val mono" style="color: #0284c7;">${exp.siteId || '-'}</span>
          </div>
          <div>
            <span class="field-label">Site / Customer</span>
            <span class="field-val">${targetSite ? (targetSite.customerName || targetSite.name) : '-'}</span>
          </div>
          <div>
            <span class="field-label">Expense Category</span>
            <span class="field-val" style="color: #be123c; font-weight: 900;">${exp.category || 'Material'}</span>
          </div>
          <div>
            <span class="field-label">Paid To (Vendor)</span>
            <span class="field-val">${exp.vendor || exp.vendorPerson || '-'}</span>
          </div>
          <div>
            <span class="field-label">Payment Mode</span>
            <span class="field-val">${exp.paymentMode || 'UPI'}</span>
          </div>
          <div>
            <span class="field-label">Bill / Ref No.</span>
            <span class="field-val mono">${exp.billNo || exp.voucherNo || '-'}</span>
          </div>
          <div style="grid-column: span 3; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <span class="field-label">Description:</span>
            <span style="font-size: 11px; color: #334155;">${exp.description || '-'}</span>
          </div>
        </div>

        <div class="amt-box">
          <div>
            <span class="field-label" style="color: #be123c;">Amount Paid (Figures)</span>
            <span class="amt-fig">${formatINR(exp.amount)}</span>
          </div>
          <div style="text-align: right; max-width: 320px;">
            <span class="field-label">Amount in Words</span>
            <span style="font-style: italic; font-weight: 700; color: #334155;">${numberToWords(exp.amount)}</span>
          </div>
        </div>

        <div class="sig-grid">
          <div>
            <div class="sig-line">Prepared By</div>
            <div class="sig-title">Accountant</div>
          </div>
          <div>
            <div class="sig-line">Verified & Approved</div>
            <div class="sig-title">Project Manager</div>
          </div>
          <div>
            <div class="sig-line">${exp.vendor || 'Receiver'}</div>
            <div class="sig-title">Receiver's Signature</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDirectPrintPayment = (pay) => {
    if (!pay) return;
    const targetSite = sites.find(s => normSiteId(s.id) === normSiteId(pay.siteId));
    const sitePayments = payments.filter(p => normSiteId(p.siteId) === normSiteId(pay.siteId));
    const totalRecSite = sitePayments.reduce((a, c) => a + (Number(c.amount) || 0), 0);

    const loan = Number(targetSite?.loanAmount) || 0;
    const margin = Number(targetSite?.customerMargin) || 0;
    const totIncome = (loan + margin) > 0 ? (loan + margin) : (Number(targetSite?.projectIncome) || Number(targetSite?.projectValue) || 0);
    const pendingSite = Math.max(0, totIncome - totalRecSite);

    const printWindow = window.open('', '_blank', 'width=800,height=700');
    if (!printWindow) {
      setPrintingPayment(pay);
      setTimeout(() => window.print(), 150);
      return;
    }

    const logoUrl = window.location.origin + '/P24logo.webp';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Money Receipt - ${pay.id}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Outfit', sans-serif; color: #0f172a; padding: 24px; font-size: 12px; }
          @media print {
            @page { margin: 10mm; size: A5 landscape; }
            body { padding: 0; }
          }
          .mono { font-family: 'JetBrains Mono', monospace; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
          .brand { display: flex; align-items: center; gap: 10px; }
          .brand img { height: 42px; width: auto; object-fit: contain; }
          .brand-title { font-size: 18px; font-weight: 900; line-height: 1; }
          .p-pink { color: #d91478; }
          .p-green { color: #16a34a; }
          .p-blue { color: #0284c7; }
          .banner { text-align: center; background: #047857; color: #fff; padding: 6px; border-radius: 6px; font-weight: 900; font-size: 11px; text-transform: uppercase; margin-bottom: 14px; font-family: 'JetBrains Mono', monospace; }
          .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 14px; }
          .field-label { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; }
          .field-val { font-size: 12px; font-weight: 700; color: #0f172a; }
          .amt-box { background: #ecfdf5; border: 2px solid #a7f3d0; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .amt-fig { font-size: 20px; font-weight: 900; color: #047857; font-family: 'JetBrains Mono', monospace; }
          .sig-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; text-align: center; border-top: 2px solid #0f172a; padding-top: 18px; margin-top: 24px; }
          .sig-line { border-bottom: 1px dashed #94a3b8; padding-bottom: 4px; font-weight: 700; margin-bottom: 4px; }
          .sig-title { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <img src="${logoUrl}" alt="POWER24" onerror="this.style.display='none'">
            <div>
              <div class="brand-title">
                <span class="p-pink">POWER</span><span class="p-green">24</span> <span class="p-blue">Solar Services Pvt Ltd</span>
              </div>
              <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Gorakhpur HQ, UP | Helpline: +91 94508 81224 | Web: www.power24.in</div>
            </div>
          </div>
          <div class="mono" style="text-align: right; border-left: 2px solid #e2e8f0; padding-left: 10px;">
            <div><strong>DATE:</strong> ${pay.date || new Date().toLocaleDateString('en-IN')}</div>
            <div style="color: #047857; font-weight: 900;">RECEIPT NO: #${pay.id || '-'}</div>
          </div>
        </div>

        <div class="banner">OFFICIAL MONEY RECEIPT / PAYMENT ACKNOWLEDGEMENT</div>

        <div class="grid-3">
          <div>
            <span class="field-label">Site ID</span>
            <span class="field-val mono" style="color: #0284c7;">${pay.siteId || '-'}</span>
          </div>
          <div>
            <span class="field-label">Received With Thanks From</span>
            <span class="field-val">${targetSite ? (targetSite.customerName || targetSite.name) : (pay.customerName || '-')}</span>
          </div>
          <div>
            <span class="field-label">Payment Type / Tranche</span>
            <span class="field-val" style="color: #047857; font-weight: 900;">
              ${pay.disbursementStage ? `Bank Loan (${pay.disbursementStage})` : (pay.paymentType || 'Receipt')}
            </span>
          </div>
          <div>
            <span class="field-label">Payment Mode</span>
            <span class="field-val">${pay.paymentMode || pay.mode || 'NEFT/RTGS'}</span>
          </div>
          <div>
            <span class="field-label">UTR / Transaction Ref</span>
            <span class="field-val mono">${pay.refNo || pay.referenceNo || '-'}</span>
          </div>
          <div>
            <span class="field-label">Remaining Balance Due</span>
            <span class="field-val mono" style="color: #b45309;">${formatINR(pendingSite)}</span>
          </div>
          <div style="grid-column: span 3; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            <span class="field-label">Remarks:</span>
            <span style="font-size: 11px; color: #334155;">${pay.remarks || pay.notes || '-'}</span>
          </div>
        </div>

        <div class="amt-box">
          <div>
            <span class="field-label" style="color: #047857;">Amount Received (Figures)</span>
            <span class="amt-fig">${formatINR(pay.amount)}</span>
          </div>
          <div style="text-align: right; max-width: 320px;">
            <span class="field-label">Amount in Words</span>
            <span style="font-style: italic; font-weight: 700; color: #334155;">${numberToWords(pay.amount)}</span>
          </div>
        </div>

        <div class="sig-grid">
          <div>
            <div class="sig-line">Received By (Accounts)</div>
            <div class="sig-title">Cashier / Accountant</div>
          </div>
          <div>
            <div class="sig-line" style="color: #0284c7;">POWER24 Signatory</div>
            <div class="sig-title">Authorized Signatory</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // =========================================================
  // CALCULATIONS FOR PROFIT & LOSS DASHBOARD (RULES 4, 5, 7, 8)
  // =========================================================
  const filteredDashboardSites = selectedDashboardSiteId === 'ALL'
    ? sites
    : sites.filter((s) => normSiteId(s.id) === normSiteId(selectedDashboardSiteId));

  const activeDashboardExpenses = selectedDashboardSiteId === 'ALL'
    ? expenses
    : expenses.filter((e) => normSiteId(e.siteId) === normSiteId(selectedDashboardSiteId));

  const activeDashboardPayments = selectedDashboardSiteId === 'ALL'
    ? payments
    : payments.filter((p) => normSiteId(p.siteId) === normSiteId(selectedDashboardSiteId));

  // Left Summary KPIs (Rule 8)
  const totalSitesCount = filteredDashboardSites.length;
  const completedSitesCount = filteredDashboardSites.filter(
    (s) => normCategory(s.siteStatus || s.status) === 'completed'
  ).length;
  const runningSitesCount = filteredDashboardSites.filter(
    (s) => normCategory(s.siteStatus || s.status) === 'running' || normCategory(s.siteStatus || s.status) === 'in progress'
  ).length;

  // Total Project Income = Loan Amount + Customer Margin Received (Rule 2)
  const totalProjectIncome = filteredDashboardSites.reduce(
    (acc, curr) => {
      const loan = Number(curr.loanAmount) || 0;
      const margin = Number(curr.customerMargin) || 0;
      const income = (loan + margin) > 0 ? (loan + margin) : (Number(curr.projectIncome) || Number(curr.projectValue) || 0);
      return acc + income;
    },
    0
  );

  const totalExpensesAmount = activeDashboardExpenses.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );

  // Profit / Loss = Total Income - Total Expense (Rule 7)
  const totalProfitLoss = totalProjectIncome - totalExpensesAmount;

  // Profit % = (Profit / Total Income) * 100 (Rule 7)
  const averageProfitPercent = totalProjectIncome > 0
    ? ((totalProfitLoss / totalProjectIncome) * 100)
    : 0;

  // Amount Received (Rule 5)
  const totalAmountReceived = activeDashboardPayments.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );

  // Amount Pending = Total Income - Amount Received (Rule 5)
  const totalAmountPending = totalProjectIncome - totalAmountReceived;

  // Payment Collection %
  const paymentCollectionPercent = totalProjectIncome > 0
    ? ((totalAmountReceived / totalProjectIncome) * 100)
    : 0;

  // Right Expense Category Breakdown: Material, Labour, Transport, Misc (Rule 3 & 4)
  const materialExpenses = activeDashboardExpenses
    .filter((e) => normCategory(e.category) === 'material')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const labourExpenses = activeDashboardExpenses
    .filter((e) => normCategory(e.category) === 'labour')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const transportExpenses = activeDashboardExpenses
    .filter((e) => normCategory(e.category) === 'transport')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const miscExpenses = activeDashboardExpenses
    .filter((e) => normCategory(e.category) === 'misc')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // =========================================================
  // CALCULATIONS FOR ALL-IN-ONE OPERATIONS HUB
  // =========================================================
  const filteredHubDropdownSites = sites.filter((s) => {
    if (!hubSearchQuery.trim()) return true;
    const q = hubSearchQuery.toLowerCase();
    return (
      (s.customerName && s.customerName.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      (s.district && s.district.toLowerCase().includes(q)) ||
      (s.siteAddress && s.siteAddress.toLowerCase().includes(q))
    );
  });

  const currentHubSite = sites.find((s) => normSiteId(s.id) === normSiteId(selectedHubSiteId)) || (sites.length > 0 ? sites[0] : null);

  const hubSiteExpenses = currentHubSite
    ? expenses.filter((e) => normSiteId(e.siteId) === normSiteId(currentHubSite.id))
    : [];

  const hubSitePayments = currentHubSite
    ? payments.filter((p) => normSiteId(p.siteId) === normSiteId(currentHubSite.id))
    : [];

  const hubSiteBudgets = currentHubSite
    ? budgets.filter((b) => normSiteId(b.siteId) === normSiteId(currentHubSite.id))
    : [];

  const hubProjectValue = currentHubSite
    ? (((Number(currentHubSite.loanAmount) || 0) + (Number(currentHubSite.customerMargin) || 0)) > 0
        ? (Number(currentHubSite.loanAmount) || 0) + (Number(currentHubSite.customerMargin) || 0)
        : (Number(currentHubSite.projectIncome) || Number(currentHubSite.projectValue) || 0))
    : 0;

  const hubTotalExpenses = hubSiteExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const hubTotalPayments = hubSitePayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const hubPendingPayment = Math.max(0, hubProjectValue - hubTotalPayments);
  const hubNetProfit = hubProjectValue - hubTotalExpenses;
  const hubProfitMargin = hubProjectValue > 0 ? ((hubNetProfit / hubProjectValue) * 100) : 0;
  const hubPaymentCollectionPercent = hubProjectValue > 0 ? ((hubTotalPayments / hubProjectValue) * 100) : 0;

  const hubMaterialExp = hubSiteExpenses.filter((e) => normCategory(e.category) === 'material').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const hubLabourExp = hubSiteExpenses.filter((e) => normCategory(e.category) === 'labour').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const hubTransportExp = hubSiteExpenses.filter((e) => normCategory(e.category) === 'transport').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const hubMiscExp = hubSiteExpenses.filter((e) => normCategory(e.category) === 'misc' || normCategory(e.category) === 'miscellaneous').reduce((s, e) => s + (Number(e.amount) || 0), 0);

  const hubBudgetEstTotal = hubSiteBudgets.reduce((sum, b) => sum + (Number(b.budgetAmount) || (Number(b.qty) * Number(b.budgetRate)) || 0), 0);
  const hubBudgetActualTotal = hubSiteBudgets.reduce((sum, b) => sum + (Number(b.actualAmount) || (Number(b.qty) * Number(b.actualRate)) || 0), 0);

  // Quick Hub Launchers
  const handleOpenAddExpenseForHub = () => {
    if (!currentHubSite) {
      toast('Please select a Customer / Site first.');
      return;
    }
    setNewExpenseForm({
      ...getEmptyExpenseForm(sites),
      siteId: currentHubSite.id,
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddExpenseModal(true);
  };

  const handleOpenAddPaymentForHub = () => {
    if (!currentHubSite) {
      toast('Please select a Customer / Site first.');
      return;
    }
    setNewPaymentForm({
      ...getEmptyPaymentForm(sites),
      siteId: currentHubSite.id,
      customerName: currentHubSite.customerName || '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddPaymentModal(true);
  };

  const handleOpenAddMaterialForHub = () => {
    if (!currentHubSite) {
      toast('Please select a Customer / Site first.');
      return;
    }
    setNewBudgetItemForm({
      ...getEmptyBudgetItemForm(sites),
      siteId: currentHubSite.id
    });
    setShowAddBudgetItemModal(true);
  };

  // =========================================================
  // HANDLERS
  // =========================================================
  // Rule 1: Unique Site ID like P24-001, P24-002
  const handleAddSite = (e) => {
    e.preventDefault();
    const customer = newSiteForm.customerName?.trim() || newSiteForm.name?.trim();
    if (!customer) {
      toast('Please enter customer name');
      return;
    }

    const loan = Number(newSiteForm.loanAmount) || 0;
    const margin = Number(newSiteForm.customerMargin) || 0;
    const calcIncome = (loan + margin) > 0 ? (loan + margin) : (Number(newSiteForm.projectValue) || 0);

    const mat = Number(newSiteForm.materialCost) || 0;
    const lab = Number(newSiteForm.labourCost) || 0;
    const tra = Number(newSiteForm.transportCost) || 0;
    const misc = Number(newSiteForm.miscCost) || 0;
    const totExp = mat + lab + tra + misc;
    const rec = Number(newSiteForm.amountReceived) || 0;
    const profit = calcIncome - totExp;
    const profitMargin = calcIncome > 0 ? ((profit / calcIncome) * 100) : 0;
    const pending = calcIncome - rec;

    const generatedId = newSiteForm.id && newSiteForm.id.trim()
      ? newSiteForm.id.trim()
      : `P24-${String(sites.length + 1).padStart(3, '0')}`;

    const siteObj = {
      ...newSiteForm,
      id: generatedId,
      customerName: customer,
      clientName: customer,
      name: `${customer} ${newSiteForm.capacity ? newSiteForm.capacity + ' ' : ''}Solar`.trim(),
      siteAddress: newSiteForm.siteAddress || newSiteForm.location || '',
      location: newSiteForm.siteAddress || newSiteForm.location || '',
      district: newSiteForm.district || '',
      projectValue: Number(newSiteForm.projectValue) || 0,
      loanAmount: loan,
      customerMargin: margin,
      projectIncome: calcIncome,
      materialCost: mat,
      labourCost: lab,
      transportCost: tra,
      miscCost: misc,
      totalExpense: totExp,
      amountReceived: rec,
      amountPending: pending,
      profitLoss: profit,
      profitMargin: profitMargin,
      siteStatus: newSiteForm.siteStatus || newSiteForm.status || 'Running',
      status: newSiteForm.siteStatus || newSiteForm.status || 'Running',
      remarks: newSiteForm.remarks || newSiteForm.notes || '',
      notes: newSiteForm.remarks || newSiteForm.notes || '',
      startDate: newSiteForm.startDate || '',
      completionDate: newSiteForm.completionDate || ''
    };

    setPendingConfirm({
      title: 'Confirm Create Solar Project Site',
      subtitle: 'Please verify the site details and financial figures before saving.',
      actionLabel: 'Yes, Save Project Site',
      badgeText: 'New Project Site',
      badgeColor: 'blue',
      details: [
        { label: 'Site ID', value: generatedId, highlight: true },
        { label: 'Customer Name', value: customer },
        { label: 'Solar Capacity', value: `${newSiteForm.capacity || '-'} kW` },
        { label: 'District / Location', value: newSiteForm.district || newSiteForm.siteAddress || '-' },
        { label: 'Project Value', value: formatINR(newSiteForm.projectValue || 0) },
        { label: 'Bank Loan', value: formatINR(loan) },
        { label: 'Customer Margin', value: formatINR(margin) },
        { label: 'Total Project Income', value: formatINR(calcIncome), highlight: true }
      ],
      onConfirm: () => {
        const updated = addManagementSite(siteObj);
        setSites(updated);
        setShowAddSiteModal(false);
        setNewSiteForm(getEmptySiteForm());
        setPendingConfirm(null);
        toast(`Solar Project Site ${generatedId} created successfully!`);
      }
    });
  };

  const handleEditSiteSave = (e) => {
    e.preventDefault();
    if (!editingSite) return;
    const customer = editingSite.customerName?.trim() || editingSite.clientName?.trim() || editingSite.name?.trim() || '';
    const loan = Number(editingSite.loanAmount) || 0;
    const margin = Number(editingSite.customerMargin) || 0;
    const calcIncome = (loan + margin) > 0 ? (loan + margin) : (Number(editingSite.projectValue) || 0);

    const mat = Number(editingSite.materialCost) || 0;
    const lab = Number(editingSite.labourCost) || 0;
    const tra = Number(editingSite.transportCost) || 0;
    const misc = Number(editingSite.miscCost) || 0;
    const totExp = mat + lab + tra + misc;
    const rec = Number(editingSite.amountReceived) || 0;
    const profit = calcIncome - totExp;
    const profitMargin = calcIncome > 0 ? ((profit / calcIncome) * 100) : 0;
    const pending = calcIncome - rec;

    const siteObj = {
      ...editingSite,
      customerName: customer,
      clientName: customer,
      name: `${customer} ${editingSite.capacity ? editingSite.capacity + ' ' : ''}Solar`.trim(),
      siteAddress: editingSite.siteAddress || editingSite.location || '',
      location: editingSite.siteAddress || editingSite.location || '',
      district: editingSite.district || '',
      projectValue: Number(editingSite.projectValue) || 0,
      loanAmount: loan,
      customerMargin: margin,
      projectIncome: calcIncome,
      materialCost: mat,
      labourCost: lab,
      transportCost: tra,
      miscCost: misc,
      totalExpense: totExp,
      amountReceived: rec,
      amountPending: pending,
      profitLoss: profit,
      profitMargin: profitMargin,
      siteStatus: editingSite.siteStatus || editingSite.status || 'Running',
      status: editingSite.siteStatus || editingSite.status || 'Running',
      remarks: editingSite.remarks || editingSite.notes || '',
      notes: editingSite.remarks || editingSite.notes || '',
      startDate: editingSite.startDate || '',
      completionDate: editingSite.completionDate || ''
    };

    setPendingConfirm({
      title: `Confirm Update for Site #${editingSite.id}`,
      subtitle: 'Are you sure you want to update this solar project site details?',
      actionLabel: 'Yes, Update Site',
      badgeText: 'Update Site',
      badgeColor: 'blue',
      details: [
        { label: 'Site ID', value: editingSite.id, highlight: true },
        { label: 'Customer Name', value: customer },
        { label: 'Solar Capacity', value: `${editingSite.capacity || '-'} kW` },
        { label: 'Total Income', value: formatINR(calcIncome) },
        { label: 'Total Expenses', value: formatINR(totExp) },
        { label: 'Status', value: editingSite.siteStatus || 'Running' }
      ],
      onConfirm: () => {
        const updated = updateManagementSite(editingSite.id, siteObj);
        setSites(updated);
        setShowEditSiteModal(false);
        setEditingSite(null);
        setPendingConfirm(null);
        toast(`Site ${editingSite.id} updated!`);
      }
    });
  };

  const handleDeleteSite = (id) => {
    setPendingConfirm({
      title: `Confirm Deletion of Site #${id}`,
      subtitle: 'This will permanently remove the project site and all associated financial records.',
      actionLabel: 'Yes, Delete Site Permanently',
      badgeText: 'Permanent Deletion',
      badgeColor: 'rose',
      isDanger: true,
      details: [
        { label: 'Site ID', value: id, highlight: true },
        { label: 'Warning', value: 'All expenses, payments and BOQ items for this site will be lost.' }
      ],
      onConfirm: () => {
        const updated = deleteManagementSite(id);
        setSites(updated);
        setPendingConfirm(null);
        toast('Site record deleted.');
      }
    });
  };

  const handleExportCSV = () => {
    if (!sites.length) {
      toast('No sites to export');
      return;
    }
    const headers = [
      'Site ID',
      'Customer Name',
      'Site Address',
      'District',
      'System (kW)',
      'Project Value',
      'Loan Amount',
      'Customer Margin Received',
      'Total Income',
      'Material Cost',
      'Labour Cost',
      'Transport Cost',
      'Misc Cost',
      'Total Expense',
      'Profit / Loss',
      'Profit %',
      'Amount Received',
      'Amount Pending',
      'Site Status',
      'Start Date',
      'Completion Date',
      'Remarks'
    ];

    const rows = sites.map((st) => {
      const expenseMaterial = expenses
        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'material')
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const siteMaterial = Number(st.materialCost) > 0 ? Number(st.materialCost) : expenseMaterial;

      const expenseLabour = expenses
        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'labour')
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const siteLabour = Number(st.labourCost) > 0 ? Number(st.labourCost) : expenseLabour;

      const expenseTransport = expenses
        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'transport')
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const siteTransport = Number(st.transportCost) > 0 ? Number(st.transportCost) : expenseTransport;

      const expenseMisc = expenses
        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'misc')
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const siteMisc = Number(st.miscCost) > 0 ? Number(st.miscCost) : expenseMisc;

      const siteTotalExpense = siteMaterial + siteLabour + siteTransport + siteMisc;

      const loanAmt = Number(st.loanAmount) || 0;
      const marginAmt = Number(st.customerMargin) || 0;
      const totalIncome = (loanAmt + marginAmt) > 0 ? (loanAmt + marginAmt) : (Number(st.projectIncome) || Number(st.projectValue) || 0);
      const siteProfit = totalIncome - siteTotalExpense;
      const siteProfitMargin = totalIncome > 0 ? ((siteProfit / totalIncome) * 100) : 0;

      const paymentReceived = payments
        .filter((p) => normSiteId(p.siteId) === normSiteId(st.id))
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const siteReceived = Number(st.amountReceived) > 0 ? Number(st.amountReceived) : paymentReceived;
      const sitePending = totalIncome - siteReceived;

      return [
        `"${st.id}"`,
        `"${(st.customerName || st.clientName || '').replace(/"/g, '""')}"`,
        `"${(st.siteAddress || st.location || '').replace(/"/g, '""')}"`,
        `"${st.district || ''}"`,
        `"${st.capacity || ''}"`,
        st.projectValue || 0,
        loanAmt,
        marginAmt,
        totalIncome,
        siteMaterial,
        siteLabour,
        siteTransport,
        siteMisc,
        siteTotalExpense,
        siteProfit,
        `"${siteProfitMargin.toFixed(2)}%"`,
        siteReceived,
        sitePending,
        `"${st.siteStatus || st.status || 'Running'}"`,
        `"${st.startDate || ''}"`,
        `"${st.completionDate || ''}"`,
        `"${(st.remarks || st.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Power24_Solar_Site_Master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Excel CSV Export downloaded!');
  };

  // Rule 3: Date-wise expense entry with Material, Labour, Transport, Misc (Full Manual Calculation)
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseForm.siteId) {
      toast('Please select or specify a Site ID');
      return;
    }
    const targetSite = sites.find((s) => normSiteId(s.id) === normSiteId(newExpenseForm.siteId));
    const generatedId = newExpenseForm.id && newExpenseForm.id.trim()
      ? newExpenseForm.id.trim()
      : `EXP-${String(expenses.length + 1).padStart(3, '0')}`;

    const q = Number(newExpenseForm.qty) || 1;
    const rate = Number(newExpenseForm.rate) || 0;
    const finalAmount = Number(newExpenseForm.amount) > 0 ? Number(newExpenseForm.amount) : (q * rate);
    const gst = Number(newExpenseForm.gstAmount) || 0;

    if (finalAmount <= 0) {
      toast('Please enter a valid expense amount');
      return;
    }

    const expenseObj = {
      ...newExpenseForm,
      id: generatedId,
      siteId: newExpenseForm.siteId,
      siteName: targetSite ? (targetSite.customerName || targetSite.name) : (newExpenseForm.siteName || ''),
      date: newExpenseForm.date || '',
      vendor: newExpenseForm.vendor || '',
      vendorContact: newExpenseForm.vendorContact || '',
      itemType: newExpenseForm.itemType || '',
      category: newExpenseForm.category || 'Material',
      qty: q,
      unit: newExpenseForm.unit || 'NO',
      rate: rate,
      amount: finalAmount,
      gstAmount: gst,
      paymentMode: newExpenseForm.paymentMode || 'UPI',
      paymentStatus: newExpenseForm.paymentStatus || 'Paid',
      billNo: newExpenseForm.billNo || '',
      paidBy: newExpenseForm.paidBy || '',
      description: newExpenseForm.description || '',
      remarks: newExpenseForm.remarks || ''
    };

    setPendingConfirm({
      title: 'Confirm New Expense Voucher',
      subtitle: 'Please verify the expense amount, category, and vendor details before recording.',
      actionLabel: 'Yes, Save Expense Voucher',
      badgeText: 'Expense Debit',
      badgeColor: 'rose',
      details: [
        { label: 'Voucher ID', value: generatedId },
        { label: 'Site / Customer', value: `${newExpenseForm.siteId} - ${expenseObj.siteName || 'Site'}` },
        { label: 'Category', value: expenseObj.category, highlight: true },
        { label: 'Paid Amount', value: formatINR(finalAmount), highlight: true },
        { label: 'Paid To / Vendor', value: expenseObj.vendor || '-' },
        { label: 'Payment Mode', value: expenseObj.paymentMode },
        { label: 'Bill / Voucher Ref', value: expenseObj.billNo || '-' },
        { label: 'Date', value: expenseObj.date || new Date().toLocaleDateString('en-IN') }
      ],
      onConfirm: () => {
        const updated = addManagementExpense(expenseObj);
        setExpenses(updated);
        setShowAddExpenseModal(false);
        setNewExpenseForm(getEmptyExpenseForm(sites));
        setPendingConfirm(null);
        toast(`Expense voucher ${generatedId} recorded successfully!`);
      }
    });
  };

  const handleEditExpenseSave = (e) => {
    e.preventDefault();
    if (!editingExpense) return;
    const targetSite = sites.find((s) => normSiteId(s.id) === normSiteId(editingExpense.siteId));
    const q = Number(editingExpense.qty) || 1;
    const rate = Number(editingExpense.rate) || 0;
    const finalAmount = Number(editingExpense.amount) > 0 ? Number(editingExpense.amount) : (q * rate);
    const gst = Number(editingExpense.gstAmount) || 0;

    const expenseObj = {
      ...editingExpense,
      siteName: targetSite ? (targetSite.customerName || targetSite.name) : editingExpense.siteName || '',
      qty: q,
      unit: editingExpense.unit || 'NO',
      rate: rate,
      amount: finalAmount,
      gstAmount: gst,
      paymentMode: editingExpense.paymentMode || 'UPI',
      paymentStatus: editingExpense.paymentStatus || 'Paid',
      paidBy: editingExpense.paidBy || ''
    };

    setPendingConfirm({
      title: `Confirm Update for Expense Voucher #${editingExpense.id}`,
      subtitle: 'Please verify the updated expense voucher details before saving.',
      actionLabel: 'Yes, Update Expense',
      badgeText: 'Update Expense',
      badgeColor: 'rose',
      details: [
        { label: 'Voucher ID', value: editingExpense.id },
        { label: 'Site ID', value: editingExpense.siteId },
        { label: 'Category', value: expenseObj.category },
        { label: 'Updated Amount', value: formatINR(finalAmount), highlight: true },
        { label: 'Paid To', value: expenseObj.vendor || '-' },
        { label: 'Payment Mode', value: expenseObj.paymentMode }
      ],
      onConfirm: () => {
        const updated = updateManagementExpense(editingExpense.id, expenseObj);
        setExpenses(updated);
        setShowEditExpenseModal(false);
        setEditingExpense(null);
        setPendingConfirm(null);
        toast(`Expense voucher #${editingExpense.id} updated!`);
      }
    });
  };

  const handleDeleteExpense = (id) => {
    setPendingConfirm({
      title: `Confirm Deletion of Expense Voucher #${id}`,
      subtitle: 'This will remove the expense debit entry from project accounts ledger.',
      actionLabel: 'Yes, Delete Expense',
      badgeText: 'Delete Expense',
      badgeColor: 'rose',
      isDanger: true,
      details: [
        { label: 'Voucher ID', value: `#${id}`, highlight: true },
        { label: 'Action', value: 'Debit entry will be removed from site ledger.' }
      ],
      onConfirm: () => {
        const updated = deleteManagementExpense(id);
        setExpenses(updated);
        setPendingConfirm(null);
        toast('Expense record deleted.');
      }
    });
  };

  const handleExportExpensesCSV = () => {
    if (!expenses.length) {
      toast('No expenses to export');
      return;
    }
    const headers = [
      'Row',
      'Expense ID',
      'Site ID',
      'Site Name',
      'Date',
      'Expense Category',
      'Item / Scope Type',
      'Vendor / Contractor',
      'Vendor Contact',
      'Quantity',
      'Unit',
      'Unit Rate (₹)',
      'Total Amount (₹)',
      'GST / Tax (₹)',
      'Payment Mode',
      'Payment Status',
      'Bill / Invoice No.',
      'Paid By',
      'Description',
      'Remarks'
    ];
    const rows = expenses.map((exp, idx) => [
      idx + 4,
      `"${exp.id || ''}"`,
      `"${exp.siteId || ''}"`,
      `"${(exp.siteName || '').replace(/"/g, '""')}"`,
      `"${exp.date || ''}"`,
      `"${exp.category || ''}"`,
      `"${exp.itemType || exp.description || ''}"`,
      `"${exp.vendor || ''}"`,
      `"${exp.vendorContact || ''}"`,
      Number(exp.qty) || 1,
      `"${exp.unit || 'NO'}"`,
      Number(exp.rate) || 0,
      Number(exp.amount) || 0,
      Number(exp.gstAmount) || 0,
      `"${exp.paymentMode || ''}"`,
      `"${exp.paymentStatus || 'Paid'}"`,
      `"${exp.billNo || ''}"`,
      `"${exp.paidBy || 'Accounts'}"`,
      `"${(exp.description || '').replace(/"/g, '""')}"`,
      `"${(exp.remarks || '').replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Power24_Solar_Expense_Entry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Expense CSV Export downloaded!');
  };

  // Rule 5: Payment Entry Handlers (Full Manual Data Entry)
  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!newPaymentForm.siteId) {
      toast('Please select or specify a Site ID');
      return;
    }
    const targetSite = sites.find((s) => normSiteId(s.id) === normSiteId(newPaymentForm.siteId));
    const generatedId = newPaymentForm.id && newPaymentForm.id.trim()
      ? newPaymentForm.id.trim()
      : `PAY-${String(payments.length + 1).padStart(3, '0')}`;

    const cust = newPaymentForm.customerName?.trim() || (targetSite ? (targetSite.customerName || targetSite.name) : 'Customer');
    const amt = Number(newPaymentForm.amount) || 0;

    if (amt <= 0) {
      toast('Please enter a valid payment amount');
      return;
    }

    const payObj = {
      ...newPaymentForm,
      id: generatedId,
      siteId: newPaymentForm.siteId,
      customerName: cust,
      payerName: cust,
      siteName: targetSite ? (targetSite.customerName || targetSite.name) : '',
      date: newPaymentForm.date || '',
      paymentType: newPaymentForm.paymentType || 'Loan - Disbursement 1',
      disbursementStage: normCategory(newPaymentForm.paymentType).includes('loan')
        ? (newPaymentForm.disbursementStage || (String(newPaymentForm.paymentType).includes('2') ? 'Disbursement 2' : 'Disbursement 1'))
        : '',
      amount: amt,
      paymentMode: newPaymentForm.paymentMode || 'NEFT/RTGS',
      bankName: newPaymentForm.bankName || '',
      refNo: newPaymentForm.refNo || '',
      receivedBy: newPaymentForm.receivedBy || '',
      receiptNo: newPaymentForm.receiptNo || generatedId,
      remarks: newPaymentForm.remarks || ''
    };

    setPendingConfirm({
      title: 'Confirm Payment Money Receipt',
      subtitle: 'Please verify the payment credit amount and tranche details before generating receipt.',
      actionLabel: 'Yes, Record Payment',
      badgeText: 'Payment Credit',
      badgeColor: 'emerald',
      details: [
        { label: 'Receipt ID', value: generatedId },
        { label: 'Site / Customer', value: `${newPaymentForm.siteId} - ${cust}` },
        { label: 'Payment Type', value: payObj.disbursementStage ? `Bank Loan (${payObj.disbursementStage})` : payObj.paymentType, highlight: true },
        { label: 'Amount Received', value: formatINR(payObj.amount), highlight: true },
        { label: 'Payment Mode', value: payObj.paymentMode },
        { label: 'UTR / Ref No.', value: payObj.refNo || '-' },
        { label: 'Date', value: payObj.date || new Date().toLocaleDateString('en-IN') }
      ],
      onConfirm: () => {
        const updated = addManagementPayment(payObj);
        setPayments(updated);
        setShowAddPaymentModal(false);
        setNewPaymentForm(getEmptyPaymentForm(sites));
        setPendingConfirm(null);
        toast(`Payment receipt ${generatedId} recorded successfully!`);
      }
    });
  };

  const handleEditPaymentSave = (e) => {
    e.preventDefault();
    if (!editingPayment) return;
    const targetSite = sites.find((s) => normSiteId(s.id) === normSiteId(editingPayment.siteId));
    const cust = editingPayment.customerName?.trim() || (targetSite ? (targetSite.customerName || targetSite.name) : 'Customer');

    const payObj = {
      ...editingPayment,
      customerName: cust,
      payerName: cust,
      siteName: targetSite ? (targetSite.customerName || targetSite.name) : editingPayment.siteName || '',
      paymentType: editingPayment.paymentType,
      disbursementStage: normCategory(editingPayment.paymentType).includes('loan')
        ? (editingPayment.disbursementStage || (String(editingPayment.paymentType).includes('2') ? 'Disbursement 2' : 'Disbursement 1'))
        : '',
      amount: Number(editingPayment.amount) || 0,
      paymentMode: editingPayment.paymentMode || 'NEFT/RTGS',
      bankName: editingPayment.bankName || '',
      receivedBy: editingPayment.receivedBy || ''
    };

    setPendingConfirm({
      title: `Confirm Update for Payment #${editingPayment.id}`,
      subtitle: 'Please verify the updated payment details before saving to ledger.',
      actionLabel: 'Yes, Update Payment',
      badgeText: 'Update Payment',
      badgeColor: 'emerald',
      details: [
        { label: 'Receipt ID', value: editingPayment.id },
        { label: 'Site / Customer', value: `${editingPayment.siteId} (${cust})` },
        { label: 'Updated Amount', value: formatINR(payObj.amount), highlight: true },
        { label: 'Payment Type', value: payObj.paymentType },
        { label: 'Payment Mode', value: payObj.paymentMode }
      ],
      onConfirm: () => {
        const updated = updateManagementPayment(editingPayment.id, payObj);
        setPayments(updated);
        setShowEditPaymentModal(false);
        setEditingPayment(null);
        setPendingConfirm(null);
        toast(`Payment receipt #${editingPayment.id} updated!`);
      }
    });
  };

  const handleDeletePayment = (id) => {
    setPendingConfirm({
      title: `Confirm Deletion of Payment Receipt #${id}`,
      subtitle: 'This will remove the payment credit entry from the project ledger.',
      actionLabel: 'Yes, Delete Payment',
      badgeText: 'Delete Payment',
      badgeColor: 'rose',
      isDanger: true,
      details: [
        { label: 'Receipt ID', value: `#${id}`, highlight: true },
        { label: 'Action', value: 'Credit receipt will be removed from site ledger.' }
      ],
      onConfirm: () => {
        const updated = deleteManagementPayment(id);
        setPayments(updated);
        setPendingConfirm(null);
        toast('Payment record deleted.');
      }
    });
  };

  const handleExportPaymentsCSV = () => {
    if (!payments.length) {
      toast('No payments to export');
      return;
    }
    const headers = [
      'Row',
      'Payment ID',
      'Site ID',
      'Customer / Payer',
      'Date',
      'Payment Type',
      'Amount Received (₹)',
      'Payment Mode',
      'Bank / Branch',
      'UTR / Transaction Ref No.',
      'Received By',
      'Receipt No.',
      'Remarks'
    ];
    const rows = payments.map((p, idx) => [
      idx + 4,
      `"${p.id || ''}"`,
      `"${p.siteId || ''}"`,
      `"${(p.customerName || p.payerName || p.siteName || '').replace(/"/g, '""')}"`,
      `"${p.date || ''}"`,
      `"${p.disbursementStage ? `Loan (${p.disbursementStage})` : (p.paymentType || '')}"`,
      Number(p.amount) || 0,
      `"${p.paymentMode || ''}"`,
      `"${p.bankName || ''}"`,
      `"${p.refNo || ''}"`,
      `"${p.receivedBy || ''}"`,
      `"${p.receiptNo || p.id || ''}"`,
      `"${(p.remarks || '').replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Power24_Solar_Payment_Entry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Payment CSV Export downloaded!');
  };

  // Rule 9: Material Budget Handlers (Budget Amount = Qty * Rate, Variance = Budget - Actual)
  const handleAddBudgetItem = (e) => {
    e.preventDefault();
    if (!newBudgetItemForm.siteId || !newBudgetItemForm.material) {
      toast('Please enter Site ID and Material name');
      return;
    }
    const generatedId = newBudgetItemForm.id && newBudgetItemForm.id.trim()
      ? newBudgetItemForm.id.trim()
      : `BOQ-${String(budgets.length + 1).padStart(3, '0')}`;

    const q = Number(newBudgetItemForm.qty) || 1;
    const bRate = Number(newBudgetItemForm.budgetRate) || 0;
    const bAmt = Number(newBudgetItemForm.budgetAmount) > 0 ? Number(newBudgetItemForm.budgetAmount) : (q * bRate);
    const aRate = Number(newBudgetItemForm.actualRate) || 0;
    const aAmt = Number(newBudgetItemForm.actualAmount) > 0 ? Number(newBudgetItemForm.actualAmount) : (q * aRate);

    const budgetObj = {
      ...newBudgetItemForm,
      id: generatedId,
      material: newBudgetItemForm.material.trim(),
      category: newBudgetItemForm.category || 'Solar Modules',
      brand: newBudgetItemForm.brand || '',
      specification: newBudgetItemForm.specification || '',
      qty: q,
      unit: newBudgetItemForm.unit || 'NO',
      budgetRate: bRate,
      budgetAmount: bAmt,
      actualRate: aRate,
      actualAmount: aAmt,
      variance: bAmt - aAmt,
      procurementStatus: newBudgetItemForm.procurementStatus || 'Delivered on Site',
      supplier: newBudgetItemForm.supplier || '',
      remarks: newBudgetItemForm.remarks || ''
    };

    setPendingConfirm({
      title: 'Confirm Add Material BOQ Item',
      subtitle: 'Please check the material specification and budget rate before adding.',
      actionLabel: 'Yes, Add Material BOQ',
      badgeText: 'BOQ Item',
      badgeColor: 'amber',
      details: [
        { label: 'BOQ Item ID', value: generatedId },
        { label: 'Site ID', value: budgetObj.siteId },
        { label: 'Material', value: budgetObj.material, highlight: true },
        { label: 'Category', value: budgetObj.category },
        { label: 'Quantity', value: `${budgetObj.qty} ${budgetObj.unit}` },
        { label: 'Budget Amount', value: formatINR(bAmt), highlight: true },
        { label: 'Procurement Status', value: budgetObj.procurementStatus }
      ],
      onConfirm: () => {
        const updated = addManagementBudgetItem(budgetObj);
        setBudgets(updated);
        setShowAddBudgetItemModal(false);
        setNewBudgetItemForm(getEmptyBudgetItemForm(sites));
        setPendingConfirm(null);
        toast(`Material budget item ${generatedId} added!`);
      }
    });
  };

  const handleEditBudgetItemSave = (e) => {
    e.preventDefault();
    if (!editingBudgetItem) return;
    const q = Number(editingBudgetItem.qty) || 1;
    const bRate = Number(editingBudgetItem.budgetRate) || 0;
    const bAmt = Number(editingBudgetItem.budgetAmount) > 0 ? Number(editingBudgetItem.budgetAmount) : (q * bRate);
    const aRate = Number(editingBudgetItem.actualRate) || 0;
    const aAmt = Number(editingBudgetItem.actualAmount) > 0 ? Number(editingBudgetItem.actualAmount) : (q * aRate);

    const budgetObj = {
      ...editingBudgetItem,
      qty: q,
      unit: editingBudgetItem.unit || 'NO',
      budgetRate: bRate,
      budgetAmount: bAmt,
      actualRate: aRate,
      actualAmount: aAmt,
      variance: bAmt - aAmt,
      procurementStatus: editingBudgetItem.procurementStatus || 'Delivered on Site',
      supplier: editingBudgetItem.supplier || ''
    };

    setPendingConfirm({
      title: `Confirm Update for BOQ Item #${editingBudgetItem.id}`,
      subtitle: 'Please verify the updated BOQ specification and budget rates before saving.',
      actionLabel: 'Yes, Update BOQ',
      badgeText: 'Update BOQ',
      badgeColor: 'amber',
      details: [
        { label: 'Item ID', value: editingBudgetItem.id },
        { label: 'Material', value: budgetObj.material },
        { label: 'Budget Amount', value: formatINR(bAmt), highlight: true },
        { label: 'Actual Amount', value: formatINR(aAmt) }
      ],
      onConfirm: () => {
        const updated = updateManagementBudgetItem(editingBudgetItem.id, budgetObj);
        setBudgets(updated);
        setShowEditBudgetItemModal(false);
        setEditingBudgetItem(null);
        setPendingConfirm(null);
        toast(`Material budget #${editingBudgetItem.id} updated!`);
      }
    });
  };

  const handleDeleteBudgetItem = (id) => {
    setPendingConfirm({
      title: `Confirm Deletion of BOQ Item #${id}`,
      subtitle: 'This will remove the material item from the site BOQ list.',
      actionLabel: 'Yes, Delete BOQ Item',
      badgeText: 'Delete BOQ',
      badgeColor: 'rose',
      isDanger: true,
      details: [
        { label: 'Item ID', value: `#${id}`, highlight: true },
        { label: 'Action', value: 'Item will be deleted from BOQ master.' }
      ],
      onConfirm: () => {
        const updated = deleteManagementBudgetItem(id);
        setBudgets(updated);
        setPendingConfirm(null);
        toast('Budget item removed.');
      }
    });
  };

  const handleExportBudgetsCSV = () => {
    if (!budgets.length) {
      toast('No budget items to export');
      return;
    }
    const headers = [
      'Row',
      'Budget / BOQ ID',
      'Site ID',
      'Material Name',
      'Category',
      'Brand / Make',
      'Specification',
      'Quantity',
      'Unit',
      'Budget Rate (₹)',
      'Budget Amount (₹)',
      'Actual Rate (₹)',
      'Actual Amount (₹)',
      'Variance (Saving / Overrun ₹)',
      'Procurement Status',
      'Supplier / Vendor',
      'Remarks'
    ];
    const rows = budgets.map((b, idx) => [
      idx + 4,
      `"${b.id || ''}"`,
      `"${b.siteId || ''}"`,
      `"${(b.material || '').replace(/"/g, '""')}"`,
      `"${b.category || 'Solar Modules'}"`,
      `"${b.brand || ''}"`,
      `"${(b.specification || '').replace(/"/g, '""')}"`,
      Number(b.qty) || 1,
      `"${b.unit || 'NO'}"`,
      Number(b.budgetRate) || 0,
      Number(b.budgetAmount) || ((Number(b.qty) || 1) * (Number(b.budgetRate) || 0)),
      Number(b.actualRate) || 0,
      Number(b.actualAmount) || ((Number(b.qty) || 1) * (Number(b.actualRate) || 0)),
      (Number(b.budgetAmount) || 0) - (Number(b.actualAmount) || 0),
      `"${b.procurementStatus || 'Delivered on Site'}"`,
      `"${(b.supplier || '').replace(/"/g, '""')}"`,
      `"${(b.remarks || '').replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Power24_Solar_Material_BOQ_Budget_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Material Budget CSV Export downloaded!');
  };

  // Sub-Navigation Tabs definition (All-in-One Site Hub + 5 Dedicated Sections)
  const navigationSubTabs = [
    { id: 'all_in_one', label: '⚡ All-in-One Site Hub', icon: Zap, badge: 'Quick Entry' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
    { id: 'site_master', label: 'Site Master', icon: Building, badge: sites.length },
    { id: 'expense_entry', label: 'Expense Entry', icon: DollarSign, badge: expenses.length },
    { id: 'payment_entry', label: 'Payment Entry', icon: CreditCard, badge: payments.length },
    { id: 'material_budget', label: 'Material Budget', icon: Package, badge: budgets.length }
  ];

  return (
    <div className="space-y-6 font-['Outfit',sans-serif] bg-slate-50/60 p-2 sm:p-4 rounded-3xl min-h-screen text-slate-800">
      {/* 5 Sub-Sections Navigation Bar (White & Blue Theme) */}
      <div className="bg-white border border-blue-200/80 rounded-2xl p-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 min-w-max">
            {navigationSubTabs.map((t) => {
              const Icon = t.icon;
              const isActive = subTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSubTab(t.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{t.label}</span>
                  {t.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Logic Rules Guide Toggle Button */}
            <button
              onClick={() => setShowLogicRulesGuide(!showLogicRulesGuide)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                showLogicRulesGuide
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
              title="View 9 Management Rules"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Management Rules</span>
              {showLogicRulesGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold border border-slate-200 shadow-sm transition-colors shrink-0 cursor-pointer"
              title="Print Project Summary"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9 Rules & Business Logic Accordion Panel */}
      {showLogicRulesGuide && (
        <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-3xl p-5 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                9
              </span>
              <div>
                <h3 className="text-sm font-black text-blue-950 uppercase tracking-wide">
                  Project Management Business Logic & System Rules
                </h3>
                <p className="text-xs text-blue-700 font-medium">
                  सिस्टम के सभी 9 नियम व ऑटोमैटिक कैलकुलेशन फॉर्मूले सक्रिय हैं
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLogicRulesGuide(false)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* Rule 1 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">1</span>
                <span>Unique Site ID (जैसे P24-001)</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                SITE MASTER में प्रत्येक सोलर प्रोजेक्ट साइट को एक यूनिक आईडी जैसे <strong>P24-001</strong> दी जाती है जो सभी फॉर्म्स में ऑटो-लिंक्ड है।
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">2</span>
                <span>Loan + Customer Margin = Total Income</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Loan Amount और Customer Margin Received को अलग-अलग भरा जाता है; SITE MASTER में कुल प्रोजेक्ट इनकम <strong>Loan + Margin</strong> से बनती है।
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">3</span>
                <span>Date-wise Expense Entry & Categories</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                हर खर्च EXPENSE ENTRY में दिनांक अनुसार दर्ज होता है जिसमें Category: <strong>Material / Labour / Transport / Misc</strong> चुनी जाती है।
              </p>
            </div>

            {/* Rule 4 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">4</span>
                <span>Auto-Sum Expenses by Site ID</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                SITE MASTER में Material, Labour, Transport और Misc लागत Site ID के आधार पर <strong>अपने-आप (Real-time)</strong> जुड़ती है।
              </p>
            </div>

            {/* Rule 5 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">5</span>
                <span>Amount Received & Pending Calculation</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                PAYMENT ENTRY में प्राप्त राशि डालने पर <strong>Amount Received</strong> और <strong>Amount Pending</strong> (Total Income - Received) अपने-आप आता है।
              </p>
            </div>

            {/* Rule 6 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">6</span>
                <span>Site Status & Completion Date</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                साइट पूर्ण होने पर <strong>Site Status = Completed</strong> और <strong>Completion Date</strong> भरें जिससे डैशबोर्ड स्टेटस अपडेट हो सके।
              </p>
            </div>

            {/* Rule 7 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">7</span>
                <span>Profit / Loss = Income – Expense</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                <strong>Profit / Loss = Total Income – Total Expense</strong> एवं <strong>Profit %</strong> ऑटोमैटिक कैलकुलेट होकर ग्रीन/रेड में दिखता है।
              </p>
            </div>

            {/* Rule 8 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">8</span>
                <span>Overall Business & Site Dashboard</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                DASHBOARD पर पूरे बिज़नेस का प्रोजेक्ट इनकम, खर्च, प्रॉफिट, पेंडिंग और 4 कैटेगरी की विजुअल समरी देखें या साइट अनुसार फ़िल्टर करें।
              </p>
            </div>

            {/* Rule 9 */}
            <div className="p-3 bg-white rounded-2xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-2 text-blue-800 font-bold">
                <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-black shrink-0">9</span>
                <span>Material Budget & BOQ Variance</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                MATERIAL BUDGET में बजट Qty/Rate और Actual Amount भरकर <strong>Variance = Budget Amount – Actual Amount</strong> तुरंत देखें।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 0. ALL-IN-ONE CUSTOMER & SITE OPERATIONS HUB (NEW UNIFIED TAB) */}
      {/* ========================================================================= */}
      {subTab === 'all_in_one' && (
        <div className="space-y-6">
          {/* Header & Site Selector Control Card */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border-2 border-blue-600/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-sky-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Single Window Operations Hub</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">Admin & Staff Unified Console</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Customer & Site 360° Management
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Select a customer or site ID once to perform any action — add expenses, log payments, manage material BOQ, edit details & print slips in one place.
                </p>
              </div>

              {/* Action: Quick Add New Site Button */}
              <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setNewSiteForm(getEmptySiteForm());
                    setShowAddSiteModal(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Register New Site</span>
                </button>
              </div>
            </div>

            {/* Customer & Site Selector Combo Box */}
            <div className="mt-5 pt-5 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter customer, site ID, mobile..."
                  value={hubSearchQuery}
                  onChange={(e) => setHubSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {hubSearchQuery && (
                  <button
                    onClick={() => setHubSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Master Dropdown with Customer Name + Site ID + Capacity */}
              <div className="md:col-span-8 flex items-center gap-2">
                <div className="relative flex-1">
                  <Building className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={currentHubSite ? currentHubSite.id : ''}
                    onChange={(e) => setSelectedHubSiteId(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-900/90 border-2 border-blue-500/60 rounded-xl text-xs sm:text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 cursor-pointer appearance-none shadow-inner"
                  >
                    {filteredHubDropdownSites.length === 0 ? (
                      <option value="" disabled className="bg-slate-900 text-slate-400">
                        {sites.length === 0 ? 'No sites registered yet' : 'No matching sites found'}
                      </option>
                    ) : (
                      filteredHubDropdownSites.map((s) => (
                        <option key={s.id} value={s.id} className="bg-slate-900 text-white py-2">
                          👤 {s.customerName || s.clientName || 'Customer'} — 🆔 {s.id} ({s.capacity ? `${s.capacity} kW` : 'kW'} • {s.district || s.siteAddress || 'Site'} • {s.siteStatus || s.status || 'Active'})
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-blue-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                
                <span className="hidden sm:inline-flex px-3 py-2 bg-blue-900/60 border border-blue-700/50 rounded-xl text-[11px] font-bold text-blue-200 shrink-0">
                  {filteredHubDropdownSites.length} of {sites.length} Sites
                </span>
              </div>
            </div>

            {/* Quick-Pills for Fast Switching (Shows top 8 sites) */}
            {sites.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <span className="text-slate-400 shrink-0 font-medium mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Quick Select:
                </span>
                {sites.slice(0, 8).map((s) => {
                  const isSel = currentHubSite && normSiteId(s.id) === normSiteId(currentHubSite.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedHubSiteId(s.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSel
                          ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{s.customerName || 'Customer'}</span>
                      <span className="text-[10px] opacity-75 font-mono">({s.id})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* MAIN SELECTED SITE CONTENT */}
          {!currentHubSite ? (
            <div className="bg-white border-2 border-dashed border-blue-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center shadow-inner">
                <Building className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-black text-slate-900">No Solar Site Selected</h3>
                <p className="text-xs text-slate-500">
                  Select an existing customer from the dropdown above or register a new solar site to start recording expenses, payments and materials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewSiteForm(getEmptySiteForm());
                  setShowAddSiteModal(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register First Site</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Customer & Site Hero Profile Card */}
              <div className="bg-white border border-blue-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg sm:text-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                      {(currentHubSite.customerName || currentHubSite.clientName || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {currentHubSite.customerName || currentHubSite.clientName || 'Customer Site'}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-mono font-black border border-blue-200">
                          {currentHubSite.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 ${
                            normCategory(currentHubSite.siteStatus || currentHubSite.status) === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : normCategory(currentHubSite.siteStatus || currentHubSite.status) === 'running' || normCategory(currentHubSite.siteStatus || currentHubSite.status) === 'in progress'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
                          {currentHubSite.siteStatus || currentHubSite.status || 'Active'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-0.5">
                        {currentHubSite.phone && (
                          <a
                            href={`tel:${currentHubSite.phone}`}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{currentHubSite.phone}</span>
                          </a>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{currentHubSite.siteAddress || currentHubSite.location || 'Address Not Set'}{currentHubSite.district ? `, ${currentHubSite.district}` : ''}</span>
                        </span>
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span>{currentHubSite.capacity || '0'} kW System</span>
                        </span>
                        {currentHubSite.createdDate && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Started: {currentHubSite.createdDate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Action Buttons Bar for this Site */}
                  <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
                    {/* + Add Expense Button */}
                    <button
                      type="button"
                      onClick={handleOpenAddExpenseForHub}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20 transition-all cursor-pointer hover:scale-[1.02]"
                      title="Add Expense for this Customer Site"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>+ Add Expense</span>
                    </button>

                    {/* + Add Payment Button */}
                    <button
                      type="button"
                      onClick={handleOpenAddPaymentForHub}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02]"
                      title="Record Payment for this Customer Site"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>+ Add Payment</span>
                    </button>

                    {/* + Add Material BOQ Button */}
                    <button
                      type="button"
                      onClick={handleOpenAddMaterialForHub}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer hover:scale-[1.02]"
                      title="Add Material Item to BOQ"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>+ Add Material</span>
                    </button>

                    {/* Edit Site Details */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSite({ ...currentHubSite });
                        setShowEditSiteModal(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Edit Site Details"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>

                    {/* Print Site Slip */}
                    <button
                      type="button"
                      onClick={() => handleDirectPrintSite(currentHubSite)}
                      className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Print Site Summary Slip"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-600" />
                      <span>Slip</span>
                    </button>
                  </div>
                </div>

                {/* 4 LIVE FINANCIAL STAT CARDS FOR THIS CUSTOMER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Project Value */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-blue-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-blue-600" />
                        <span>Project Value</span>
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-200/60 text-blue-900 rounded-full">
                        Total Income
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900">
                      {formatINR(hubProjectValue)}
                    </div>
                    <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span>Loan: {formatINR(currentHubSite.loanAmount)}</span>
                      <span>Margin: {formatINR(currentHubSite.customerMargin)}</span>
                    </div>
                  </div>

                  {/* Card 2: Payments Collected */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>Payments Received</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200/60 text-emerald-900 rounded-full">
                        {hubPaymentCollectionPercent.toFixed(0)}% Collected
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-700">
                      {formatINR(hubTotalPayments)}
                    </div>
                    <div className="space-y-1 pt-1 border-t border-emerald-200/60">
                      <div className="w-full bg-emerald-200/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min(100, hubPaymentCollectionPercent)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                        <span>{hubSitePayments.length} Payment(s)</span>
                        <span className="text-amber-700 font-bold">Pending: {formatINR(hubPendingPayment)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Total Expenses */}
                  <div className="bg-gradient-to-br from-rose-50 to-orange-50/60 border border-rose-200 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-rose-800 font-bold">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-rose-600" />
                        <span>Total Expenses</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-200/60 text-rose-900 rounded-full">
                        {hubSiteExpenses.length} Vouchers
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-700">
                      {formatINR(hubTotalExpenses)}
                    </div>
                    <div className="pt-2 border-t border-rose-200/60 grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                      <span>Mat: <strong>{formatINR(hubMaterialExp)}</strong></span>
                      <span>Lab: <strong>{formatINR(hubLabourExp)}</strong></span>
                      <span>Trp: <strong>{formatINR(hubTransportExp)}</strong></span>
                      <span>Misc: <strong>{formatINR(hubMiscExp)}</strong></span>
                    </div>
                  </div>

                  {/* Card 4: Net Profit / Loss */}
                  <div className={`bg-gradient-to-br ${
                    hubNetProfit >= 0
                      ? 'from-sky-50 to-blue-50/60 border-sky-200'
                      : 'from-amber-50 to-rose-50/60 border-rose-300'
                  } border rounded-2xl p-4 shadow-sm space-y-2`}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className={`w-4 h-4 ${hubNetProfit >= 0 ? 'text-blue-600' : 'text-rose-600'}`} />
                        <span>Site Net Profit</span>
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        hubNetProfit >= 0 ? 'bg-blue-200 text-blue-900' : 'bg-rose-200 text-rose-900'
                      }`}>
                        {hubProfitMargin.toFixed(1)}% Margin
                      </span>
                    </div>
                    <div className={`text-xl sm:text-2xl font-black ${
                      hubNetProfit >= 0 ? 'text-blue-900' : 'text-rose-700'
                    }`}>
                      {formatINR(hubNetProfit)}
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span>BOQ Items: {hubSiteBudgets.length}</span>
                      <span>BOQ Est: {formatINR(hubBudgetEstTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* UNIFIED WORKSPACE TABS FOR THE SELECTED SITE */}
              <div className="bg-white border border-blue-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                {/* Inner Tab Buttons */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 flex-wrap">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: '⚡ All Activity Feed', count: hubSiteExpenses.length + hubSitePayments.length },
                      { id: 'expenses', label: '💸 Expense Vouchers', count: hubSiteExpenses.length },
                      { id: 'payments', label: '💳 Payment Receipts', count: hubSitePayments.length },
                      { id: 'materials', label: '📦 Material Budget (BOQ)', count: hubSiteBudgets.length },
                      { id: 'pl_sheet', label: '📊 Site P&L Statement', count: null }
                    ].map((tabItem) => (
                      <button
                        key={tabItem.id}
                        type="button"
                        onClick={() => setHubInnerTab(tabItem.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                          hubInnerTab === tabItem.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        <span>{tabItem.label}</span>
                        {tabItem.count !== null && (
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                            hubInnerTab === tabItem.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {tabItem.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Contextual Quick Add Button */}
                  <div className="flex items-center gap-2">
                    {hubInnerTab === 'expenses' && (
                      <button
                        type="button"
                        onClick={handleOpenAddExpenseForHub}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Expense</span>
                      </button>
                    )}
                    {hubInnerTab === 'payments' && (
                      <button
                        type="button"
                        onClick={handleOpenAddPaymentForHub}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Record Payment</span>
                      </button>
                    )}
                    {hubInnerTab === 'materials' && (
                      <button
                        type="button"
                        onClick={handleOpenAddMaterialForHub}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Material Item</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* INNER TAB 1: ALL ACTIVITY (COMBINED FEED) */}
                {hubInnerTab === 'all' && (
                  <div className="space-y-6">
                    {/* Quick Entry Action Prompt Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      <div
                        onClick={handleOpenAddExpenseForHub}
                        className="bg-gradient-to-br from-rose-50 to-pink-50/50 border border-rose-200/80 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-black text-rose-800">
                            <DollarSign className="w-4 h-4 text-rose-600" />
                            <span>Record Site Expense</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Labour, material purchase, transport or misc bills
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-all shrink-0">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>

                      <div
                        onClick={handleOpenAddPaymentForHub}
                        className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                            <CreditCard className="w-4 h-4 text-emerald-600" />
                            <span>Record Client Payment</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Margin money, loan disbursement or subsidy credit
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-all shrink-0">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>

                      <div
                        onClick={handleOpenAddMaterialForHub}
                        className="bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-200/80 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-800">
                            <Package className="w-4 h-4 text-indigo-600" />
                            <span>Add Material BOQ Item</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Panels, inverter, structure, cable specifications
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-all shrink-0">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Dual Summary Grid: Recent Expenses vs Recent Payments */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Left: Recent Expenses for this site */}
                      <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-rose-600" />
                            <span>Site Expenses ({hubSiteExpenses.length})</span>
                          </h4>
                          <button
                            onClick={() => setHubInnerTab('expenses')}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                          >
                            View All →
                          </button>
                        </div>

                        {hubSiteExpenses.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400">
                            No expenses recorded yet for this site.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {hubSiteExpenses.slice(0, 5).map((exp) => (
                              <div
                                key={exp.id}
                                className="p-2.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 rounded-xl flex items-center justify-between text-xs transition-all"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900">{exp.itemType || exp.description || exp.category}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-slate-200/80 text-[10px] font-mono text-slate-700">
                                      {exp.category}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {exp.date || 'No Date'} • Vendor: {exp.vendor || 'N/A'} • {exp.paymentMode}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-rose-600 block">{formatINR(exp.amount)}</span>
                                  <div className="flex items-center gap-1 mt-0.5 justify-end">
                                    <button
                                      onClick={() => handleDirectPrintExpense(exp)}
                                      className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                                      title="Print Voucher"
                                    >
                                      <Printer className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingExpense({ ...exp });
                                        setShowEditExpenseModal(true);
                                      }}
                                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Recent Payments for this site */}
                      <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Client Payments ({hubSitePayments.length})</span>
                          </h4>
                          <button
                            onClick={() => setHubInnerTab('payments')}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                          >
                            View All →
                          </button>
                        </div>

                        {hubSitePayments.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400">
                            No payment receipts recorded yet for this site.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {hubSitePayments.slice(0, 5).map((pay) => (
                              <div
                                key={pay.id}
                                className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 rounded-xl flex items-center justify-between text-xs transition-all"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900">{pay.paymentType || 'Payment'}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-[10px] font-bold text-emerald-800">
                                      {pay.paymentMode || 'NEFT'}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {pay.date || 'No Date'} • Ref: {pay.refNo || 'Direct'}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-emerald-600 block">{formatINR(pay.amount)}</span>
                                  <div className="flex items-center gap-1 mt-0.5 justify-end">
                                    <button
                                      onClick={() => handleDirectPrintPayment(pay)}
                                      className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                                      title="Print Receipt"
                                    >
                                      <Printer className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingPayment({ ...pay });
                                        setShowEditPaymentModal(true);
                                      }}
                                      className="p-1 text-slate-400 hover:text-slate-700"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* INNER TAB 2: EXPENSES TABLE */}
                {hubInnerTab === 'expenses' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                          <tr>
                            <th className="px-3 py-3">Voucher #</th>
                            <th className="px-3 py-3">Date</th>
                            <th className="px-3 py-3">Category</th>
                            <th className="px-3 py-3">Item / Description</th>
                            <th className="px-3 py-3">Vendor</th>
                            <th className="px-3 py-3 text-right">Qty & Rate</th>
                            <th className="px-3 py-3 text-right">Total Amount</th>
                            <th className="px-3 py-3">Mode</th>
                            <th className="px-3 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {hubSiteExpenses.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-xs">
                                No expenses logged for this site. Click "+ Add Expense" above to record one.
                              </td>
                            </tr>
                          ) : (
                            hubSiteExpenses.map((exp) => (
                              <tr key={exp.id} className="hover:bg-blue-50/40 transition-colors">
                                <td className="px-3 py-3 font-mono font-bold text-blue-700">{exp.id}</td>
                                <td className="px-3 py-3 text-slate-600">{exp.date || '—'}</td>
                                <td className="px-3 py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                                    {exp.category}
                                  </span>
                                </td>
                                <td className="px-3 py-3 font-semibold text-slate-800">
                                  {exp.itemType || exp.description || '—'}
                                </td>
                                <td className="px-3 py-3 text-slate-600">{exp.vendor || '—'}</td>
                                <td className="px-3 py-3 text-right text-slate-600 font-mono">
                                  {exp.qty || 1} {exp.unit || 'NO'} @ {formatINR(exp.rate || 0)}
                                </td>
                                <td className="px-3 py-3 text-right font-black text-rose-600 font-mono">
                                  {formatINR(exp.amount)}
                                </td>
                                <td className="px-3 py-3 text-slate-600 font-medium">{exp.paymentMode || 'UPI'}</td>
                                <td className="px-3 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleDirectPrintExpense(exp)}
                                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all cursor-pointer"
                                      title="Print Expense Voucher"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingExpense({ ...exp });
                                        setShowEditExpenseModal(true);
                                      }}
                                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                      title="Edit Expense"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteExpense(exp.id)}
                                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                                      title="Delete Expense"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* INNER TAB 3: PAYMENTS TABLE */}
                {hubInnerTab === 'payments' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                          <tr>
                            <th className="px-3 py-3">Receipt #</th>
                            <th className="px-3 py-3">Date</th>
                            <th className="px-3 py-3">Payment Type / Stage</th>
                            <th className="px-3 py-3 text-right">Amount Received</th>
                            <th className="px-3 py-3">Payment Mode</th>
                            <th className="px-3 py-3">Bank & Ref Txn ID</th>
                            <th className="px-3 py-3">Received By</th>
                            <th className="px-3 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {hubSitePayments.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-xs">
                                No payments recorded for this site yet. Click "+ Record Payment" above to add.
                              </td>
                            </tr>
                          ) : (
                            hubSitePayments.map((pay) => (
                              <tr key={pay.id} className="hover:bg-emerald-50/40 transition-colors">
                                <td className="px-3 py-3 font-mono font-bold text-emerald-700">{pay.id}</td>
                                <td className="px-3 py-3 text-slate-600">{pay.date || '—'}</td>
                                <td className="px-3 py-3 font-bold text-slate-800">
                                  {pay.paymentType || 'Customer Payment'}
                                </td>
                                <td className="px-3 py-3 text-right font-black text-emerald-600 font-mono">
                                  {formatINR(pay.amount)}
                                </td>
                                <td className="px-3 py-3 font-medium text-slate-600">{pay.paymentMode || 'NEFT'}</td>
                                <td className="px-3 py-3 text-slate-600 font-mono text-[11px]">
                                  {pay.bankName ? `${pay.bankName} • ` : ''}{pay.refNo || '—'}
                                </td>
                                <td className="px-3 py-3 text-slate-600">{pay.receivedBy || 'Accounts'}</td>
                                <td className="px-3 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleDirectPrintPayment(pay)}
                                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all cursor-pointer"
                                      title="Print Payment Slip"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingPayment({ ...pay });
                                        setShowEditPaymentModal(true);
                                      }}
                                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                      title="Edit Payment"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePayment(pay.id)}
                                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                                      title="Delete Payment"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* INNER TAB 4: MATERIAL BUDGET (BOQ) */}
                {hubInnerTab === 'materials' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                          <tr>
                            <th className="px-3 py-3">Category</th>
                            <th className="px-3 py-3">Material Item</th>
                            <th className="px-3 py-3">Brand & Spec</th>
                            <th className="px-3 py-3 text-right">Qty & Unit</th>
                            <th className="px-3 py-3 text-right">Budget Rate</th>
                            <th className="px-3 py-3 text-right">Budget Amount</th>
                            <th className="px-3 py-3 text-right">Actual Amount</th>
                            <th className="px-3 py-3 text-center">Variance</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="px-3 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {hubSiteBudgets.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="px-4 py-8 text-center text-slate-400 text-xs">
                                No material BOQ budgeted for this site yet. Click "+ Add Material Item" to budget panels, inverters, structures etc.
                              </td>
                            </tr>
                          ) : (
                            hubSiteBudgets.map((b) => {
                              const bAmt = Number(b.budgetAmount) || ((Number(b.qty) || 0) * (Number(b.budgetRate) || 0));
                              const aAmt = Number(b.actualAmount) || ((Number(b.qty) || 0) * (Number(b.actualRate) || 0));
                              const variance = bAmt - aAmt;
                              return (
                                <tr key={b.id} className="hover:bg-indigo-50/40 transition-colors">
                                  <td className="px-3 py-3 font-semibold text-slate-800">{b.category || 'General'}</td>
                                  <td className="px-3 py-3 font-bold text-slate-900">{b.material || '—'}</td>
                                  <td className="px-3 py-3 text-slate-600">{b.brand ? `${b.brand} ` : ''}{b.specification || ''}</td>
                                  <td className="px-3 py-3 text-right font-mono font-bold">{b.qty} {b.unit || 'NO'}</td>
                                  <td className="px-3 py-3 text-right font-mono text-slate-600">{formatINR(b.budgetRate)}</td>
                                  <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">{formatINR(bAmt)}</td>
                                  <td className="px-3 py-3 text-right font-mono font-bold text-blue-700">{formatINR(aAmt)}</td>
                                  <td className="px-3 py-3 text-center font-mono font-bold">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                      variance >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {formatINR(variance)}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                      {b.procurementStatus || 'Planned'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingBudgetItem({ ...b });
                                          setShowEditBudgetItemModal(true);
                                        }}
                                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                        title="Edit Budget Item"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteBudgetItem(b.id)}
                                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                                        title="Delete Budget Item"
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
                )}

                {/* INNER TAB 5: PRINTABLE SITE P&L STATEMENT */}
                {hubInnerTab === 'pl_sheet' && (
                  <div className="space-y-4">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-2">
                        <div>
                          <h3 className="text-base font-black text-slate-900 uppercase">
                            Site Profit & Loss Summary Statement
                          </h3>
                          <p className="text-xs text-slate-500">
                            Customer: {currentHubSite.customerName} • Site ID: {currentHubSite.id} • Capacity: {currentHubSite.capacity || 'N/A'} kW
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDirectPrintSite(currentHubSite)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print Official Slip</span>
                        </button>
                      </div>

                      {/* Financial Breakdown Table */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Income Section */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <h4 className="font-black text-emerald-800 border-b border-emerald-100 pb-1.5 uppercase text-[11px]">
                            1. Inflow / Project Revenues
                          </h4>
                          <div className="space-y-1.5">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-600">Bank / NBFC Loan Amount:</span>
                              <span className="font-mono font-bold text-slate-900">{formatINR(currentHubSite.loanAmount)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-600">Customer Margin Amount:</span>
                              <span className="font-mono font-bold text-slate-900">{formatINR(currentHubSite.customerMargin)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-600">Govt. Subsidy Component:</span>
                              <span className="font-mono font-bold text-slate-900">{formatINR(currentHubSite.subsidyAmount)}</span>
                            </div>
                            <div className="flex justify-between pt-2 font-black text-emerald-700 text-sm">
                              <span>Total Project Value:</span>
                              <span className="font-mono">{formatINR(hubProjectValue)}</span>
                            </div>
                            <div className="flex justify-between pt-1 font-bold text-slate-700 text-xs">
                              <span>Actual Cash Collected:</span>
                              <span className="font-mono text-emerald-600">{formatINR(hubTotalPayments)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Expense Section */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <h4 className="font-black text-rose-800 border-b border-rose-100 pb-1.5 uppercase text-[11px]">
                            2. Outflow / Site Expenses
                          </h4>
                          <div className="space-y-1.5">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-600">Material Expenses:</span>
                              <span className="font-mono font-bold text-slate-900">{formatINR(hubMaterialExp)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-600">Labour / Installation Cost:</span>
                              <span className="font-mono font-bold text-slate-900">{formatINR(hubLabourExp)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-600">Transport & Freight:</span>
                              <span className="font-mono font-bold text-slate-900">{formatINR(hubTransportExp)}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-600">Miscellaneous & Overheads:</span>
                              <span className="font-mono font-bold text-slate-900">{formatINR(hubMiscExp)}</span>
                            </div>
                            <div className="flex justify-between pt-2 font-black text-rose-700 text-sm">
                              <span>Total Incurred Cost:</span>
                              <span className="font-mono">{formatINR(hubTotalExpenses)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Net Bottom Line */}
                      <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <div className="text-xs text-blue-200 font-bold uppercase">Estimated Net Profit / Margin</div>
                          <div className="text-xl sm:text-2xl font-black">{formatINR(hubNetProfit)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-blue-200 font-bold uppercase">Profit Margin %</div>
                          <div className="text-lg font-black text-emerald-300">{hubProfitMargin.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. DASHBOARD TAB (SOLAR PROJECT PROFIT & LOSS DASHBOARD) */}
      {/* ========================================================================= */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top Filter & Header Bar */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white border border-blue-700/60 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                  SOLAR PROJECT PROFIT & LOSS DASHBOARD
                </h2>
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Real-time financial tracking, contractor costs & client payment reconciliation
              </p>
            </div>

            {/* Filter by Site Dropdown (Rule 8) */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-blue-200 whitespace-nowrap">Filter Site:</span>
              <select
                value={selectedDashboardSiteId}
                onChange={(e) => setSelectedDashboardSiteId(e.target.value)}
                className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white focus:outline-none focus:bg-blue-950 cursor-pointer w-full md:w-64"
              >
                <option value="ALL" className="text-slate-900">All Solar Projects ({sites.length})</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id} className="text-slate-900">
                    #{s.id} - {s.customerName || s.name} ({s.capacity || '3kW'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SPREADSHEET / EXCEL STYLE DASHBOARD SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Box: P&L Summary Table */}
            <div className="lg:col-span-6 bg-white border-2 border-blue-200 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between">
              <div>
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 py-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-blue-300" />
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider">
                      Solar Project Financial Ledger
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold">
                    {averageProfitPercent.toFixed(2)}% Net Margin
                  </span>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-blue-100 text-xs sm:text-sm font-medium">
                  {/* Row 1: Total Sites */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-blue-50/30 hover:bg-blue-50/70 transition-colors">
                    <span className="col-span-7 font-bold text-slate-700">Total Sites</span>
                    <span className="col-span-5 font-black text-right font-mono text-blue-950 text-base">
                      {totalSitesCount}
                    </span>
                  </div>

                  {/* Row 2: Completed Sites (Rule 6) */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-white hover:bg-blue-50/50 transition-colors">
                    <span className="col-span-7 font-bold text-slate-700">Completed Sites</span>
                    <span className="col-span-5 font-black text-right font-mono text-emerald-700 text-base">
                      {completedSitesCount}
                    </span>
                  </div>

                  {/* Row 3: Total Project Income (Rule 2) */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-blue-50/30 hover:bg-blue-50/70 transition-colors">
                    <span className="col-span-7 font-bold text-slate-700">Total Project Income (Loan + Margin)</span>
                    <span className="col-span-5 font-black text-right font-mono text-blue-900 text-base">
                      {formatINR(totalProjectIncome)}
                    </span>
                  </div>

                  {/* Row 4: Total Expenses (Rule 4) */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-white hover:bg-blue-50/50 transition-colors">
                    <span className="col-span-7 font-bold text-slate-700">Total Expenses (Material + Labour + Transport + Misc)</span>
                    <span className="col-span-5 font-black text-right font-mono text-rose-600 text-base">
                      {formatINR(totalExpensesAmount)}
                    </span>
                  </div>

                  {/* Row 5: Total Profit / Loss (Rule 7) */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-blue-50/80 hover:bg-blue-100/60 transition-colors border-t border-b border-blue-200">
                    <span className="col-span-7 font-extrabold text-blue-950 uppercase tracking-wide">
                      Total Profit / Loss (Income - Expense)
                    </span>
                    <span className={`col-span-5 font-black text-right font-mono text-base sm:text-lg ${
                      totalProfitLoss >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {formatINR(totalProfitLoss)}
                    </span>
                  </div>

                  {/* Row 6: Average Profit % (Rule 7) */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-white hover:bg-blue-50/50 transition-colors">
                    <span className="col-span-7 font-bold text-slate-700">Profit %</span>
                    <span className="col-span-5 font-black text-right font-mono text-blue-700 text-base">
                      {averageProfitPercent.toFixed(2)}%
                    </span>
                  </div>

                  {/* Row 7: Amount Received (Rule 5) */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-blue-50/30 hover:bg-blue-50/70 transition-colors">
                    <span className="col-span-7 font-bold text-slate-700">Amount Received (Customer / Loan Payments)</span>
                    <span className="col-span-5 font-black text-right font-mono text-emerald-700 text-base">
                      {formatINR(totalAmountReceived)}
                    </span>
                  </div>

                  {/* Row 8: Amount Pending (Rule 5) */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-white hover:bg-blue-50/50 transition-colors">
                    <span className="col-span-7 font-bold text-slate-700">Amount Pending (Income - Received)</span>
                    <span className={`col-span-5 font-black text-right font-mono text-base ${
                      totalAmountPending < 0 ? 'text-blue-700' : totalAmountPending === 0 ? 'text-slate-500' : 'text-amber-700'
                    }`}>
                      {formatINR(totalAmountPending)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Trigger */}
              <div className="p-4 bg-slate-50 border-t border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Showing ledger for: <strong className="text-blue-900">{selectedDashboardSiteId === 'ALL' ? 'All Sites' : selectedDashboardSiteId}</strong>
                </span>
                <button
                  onClick={() => setSubTab('site_master')}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage Sites</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Box: Expense Category Breakdown Table & Charts (Rule 3, 4, 8) */}
            <div className="lg:col-span-6 bg-white border-2 border-blue-200 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between">
              <div>
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 py-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-5 h-5 text-emerald-300" />
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider">
                      Expense Category Breakdown
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setNewExpenseForm(getEmptyExpenseForm(sites));
                      setShowAddExpenseModal(true);
                    }}
                    className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black uppercase flex items-center gap-1 transition-colors cursor-pointer border border-white/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Expense</span>
                  </button>
                </div>

                {/* Categories Table */}
                <div className="divide-y divide-blue-100 text-xs sm:text-sm font-medium">
                  {/* Category Header */}
                  <div className="grid grid-cols-12 px-6 py-2.5 bg-blue-50/70 text-[11px] font-black uppercase text-blue-950 tracking-wider">
                    <span className="col-span-7">Expense Category</span>
                    <span className="col-span-5 text-right">Total Amount</span>
                  </div>

                  {/* Material */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-white hover:bg-blue-50/50 transition-colors items-center">
                    <div className="col-span-7 flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></span>
                      <span className="font-bold text-slate-800">Material (Panels, Inverter, GI)</span>
                    </div>
                    <span className="col-span-5 font-black text-right font-mono text-blue-900 text-base">
                      {formatINR(materialExpenses)}
                    </span>
                  </div>

                  {/* Labour */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-blue-50/30 hover:bg-blue-50/70 transition-colors items-center">
                    <div className="col-span-7 flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
                      <span className="font-bold text-slate-800">Labour (Structure, Wiring, Testing)</span>
                    </div>
                    <span className="col-span-5 font-black text-right font-mono text-slate-800 text-base">
                      {formatINR(labourExpenses)}
                    </span>
                  </div>

                  {/* Transport */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-white hover:bg-blue-50/50 transition-colors items-center">
                    <div className="col-span-7 flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="font-bold text-slate-800">Transport & Freight Delivery</span>
                    </div>
                    <span className="col-span-5 font-black text-right font-mono text-slate-800 text-base">
                      {formatINR(transportExpenses)}
                    </span>
                  </div>

                  {/* Misc */}
                  <div className="grid grid-cols-12 px-6 py-3.5 bg-blue-50/30 hover:bg-blue-50/70 transition-colors items-center">
                    <div className="col-span-7 flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0"></span>
                      <span className="font-bold text-slate-800">Misc (Consumables, Discom Approval)</span>
                    </div>
                    <span className="col-span-5 font-black text-right font-mono text-slate-800 text-base">
                      {formatINR(miscExpenses)}
                    </span>
                  </div>
                </div>

                {/* Visual Bar Chart: Expense by Category */}
                <div className="p-6 bg-slate-50 border-t border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Expense by Category (Visual Share)
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700">
                      Total: {formatINR(totalExpensesAmount)}
                    </span>
                  </div>

                  {/* Bars */}
                  <div className="space-y-2.5 text-xs">
                    {/* Material Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span> Material
                        </span>
                        <span className="font-mono text-slate-900">{totalExpensesAmount > 0 ? ((materialExpenses / totalExpensesAmount) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${totalExpensesAmount > 0 ? (materialExpenses / totalExpensesAmount) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Labour Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span> Labour
                        </span>
                        <span className="font-mono text-slate-900">{totalExpensesAmount > 0 ? ((labourExpenses / totalExpensesAmount) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${totalExpensesAmount > 0 ? (labourExpenses / totalExpensesAmount) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Transport Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Transport
                        </span>
                        <span className="font-mono text-slate-900">{totalExpensesAmount > 0 ? ((transportExpenses / totalExpensesAmount) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${totalExpensesAmount > 0 ? (transportExpenses / totalExpensesAmount) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Misc Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span> Misc
                        </span>
                        <span className="font-mono text-slate-900">{totalExpensesAmount > 0 ? ((miscExpenses / totalExpensesAmount) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${totalExpensesAmount > 0 ? (miscExpenses / totalExpensesAmount) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Link */}
              <div className="p-4 bg-slate-50 border-t border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Recorded Vouchers: <strong className="text-blue-900">{activeDashboardExpenses.length}</strong></span>
                <button
                  onClick={() => setSubTab('expense_entry')}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Expenses</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SITE MASTER TAB - SPREADSHEET PROFIT & LOSS LAYOUT (RULES 1, 2, 4, 5, 6, 7) */}
      {/* ========================================================================= */}
      {subTab === 'site_master' && (
        <div className="space-y-4 font-['Outfit',sans-serif]">
          {/* Top Banner (Executive Blue & White Theme) */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border border-blue-700/60 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider">
                  OFFICIAL P&L LEDGER
                </span>
                <span className="text-xs text-blue-200 font-mono">POWER24 ADVANCED ENTERPRISE</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase font-mono mt-1">
                POWER24Solar Services Pvt Ltd
              </h2>
              <h3 className="text-xs sm:text-sm font-bold text-sky-300 tracking-wider uppercase font-mono">
                ADVANCED SOLAR SITE-WISE PROJECT PROFIT & LOSS — SITE MASTER
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export to CSV / Excel"
              >
                <Download className="w-3.5 h-3.5 text-sky-300" />
                <span>Export Excel (.csv)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print Report"
              >
                <Printer className="w-3.5 h-3.5 text-sky-300" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNewSiteForm(getEmptySiteForm());
                  setShowAddSiteModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add New Site</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-blue-200/80 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Site ID (P24-001...), Customer, Address, District..."
                value={siteSearch}
                onChange={(e) => setSiteSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">District:</span>
                <select
                  value={siteDistrictFilter}
                  onChange={(e) => setSiteDistrictFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Districts</option>
                  <option value="Gorakhpur">Gorakhpur</option>
                  <option value="Deoria">Deoria</option>
                  <option value="Maharajganj">Maharajganj</option>
                  <option value="Kushinagar">Kushinagar</option>
                  <option value="Basti">Basti</option>
                  <option value="Sant Kabir Nagar">Sant Kabir Nagar</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Lucknow">Lucknow</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Status:</span>
                <select
                  value={siteStatusFilter}
                  onChange={(e) => setSiteStatusFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Status</option>
                  <option value="Running">Running</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200">
                Total Sites: <strong className="text-blue-900">{sites.length}</strong>
              </span>
            </div>
          </div>

          {/* Full Enterprise White & Blue Sheet Table View */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[72vh] border-b border-blue-200">
              <table className="w-full text-left text-xs border-collapse font-sans min-w-[2200px]">
                {/* Excel Table Header Row (Royal Blue with crisp white labels) */}
                <thead className="sticky top-0 z-20 shadow-md">
                  <tr className="bg-blue-800 text-white text-[11px] font-black uppercase tracking-wider border-b border-blue-900">
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[130px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Site ID</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Customer Name</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[260px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Site Address</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[130px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>District</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-center min-w-[110px]">
                      <div className="flex items-center justify-center gap-1">
                        <span>System (kW)</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[140px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Project Value</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[140px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Loan Amount</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[170px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Customer Margin Received</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[140px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Total Income (Loan+Margin)</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[130px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Material Cost</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[120px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Labour Cost</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[130px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Transport Cost</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[120px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Misc Cost</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[140px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Total Expense</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[130px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Profit / Loss</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[110px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Profit %</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[140px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Amount Received</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[140px] bg-blue-900">
                      <div className="flex items-center justify-end gap-1">
                        <span>Amount Pending</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-center min-w-[120px]">
                      <div className="flex items-center justify-center gap-1">
                        <span>Site Status</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Start Date</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[130px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Completion Date</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[200px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Remarks</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 whitespace-nowrap text-center sticky right-0 bg-blue-900 text-white min-w-[100px] z-30 shadow-l">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>

                {/* Table Body Rows (Auto calculated by Site ID - Rules 1, 2, 4, 5, 7) */}
                <tbody className="divide-y divide-blue-100 font-medium text-slate-800">
                  {(() => {
                    const filteredSites = sites.filter((st) => {
                      const matchQuery =
                        (st.name || '').toLowerCase().includes(siteSearch.toLowerCase()) ||
                        (st.customerName || st.clientName || '').toLowerCase().includes(siteSearch.toLowerCase()) ||
                        (st.id || '').toLowerCase().includes(siteSearch.toLowerCase()) ||
                        (st.siteAddress || st.location || '').toLowerCase().includes(siteSearch.toLowerCase()) ||
                        (st.district || '').toLowerCase().includes(siteSearch.toLowerCase());
                      const matchStatus = siteStatusFilter === 'ALL' || (st.siteStatus || st.status || 'Running') === siteStatusFilter;
                      const matchDistrict = siteDistrictFilter === 'ALL' || (st.district || '') === siteDistrictFilter;
                      return matchQuery && matchStatus && matchDistrict;
                    });

                    return filteredSites.map((st, idx) => {
                      // Rule 4: Material, Labour, Transport, Misc (Manual or Auto-Sum by Site ID)
                      const expenseMaterial = expenses
                        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'material')
                        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                      const siteMaterial = Number(st.materialCost) > 0 ? Number(st.materialCost) : expenseMaterial;

                      const expenseLabour = expenses
                        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'labour')
                        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                      const siteLabour = Number(st.labourCost) > 0 ? Number(st.labourCost) : expenseLabour;

                      const expenseTransport = expenses
                        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'transport')
                        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                      const siteTransport = Number(st.transportCost) > 0 ? Number(st.transportCost) : expenseTransport;

                      const expenseMisc = expenses
                        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'misc')
                        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                      const siteMisc = Number(st.miscCost) > 0 ? Number(st.miscCost) : expenseMisc;

                      const siteTotalExpense = siteMaterial + siteLabour + siteTransport + siteMisc;

                      // Rule 2: Total Income = Loan + Margin
                      const loanAmt = Number(st.loanAmount) || 0;
                      const marginAmt = Number(st.customerMargin) || 0;
                      const totalIncome = (loanAmt + marginAmt) > 0 ? (loanAmt + marginAmt) : (Number(st.projectIncome) || Number(st.projectValue) || 0);

                      // Rule 7: Profit/Loss = Total Income - Total Expense
                      const siteProfit = totalIncome - siteTotalExpense;
                      const siteProfitMargin = totalIncome > 0 ? ((siteProfit / totalIncome) * 100) : 0;

                      // Rule 5: Amount Received & Amount Pending
                      const sitePaymentsList = payments.filter((p) => normSiteId(p.siteId) === normSiteId(st.id));
                      const paymentReceived = sitePaymentsList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                      const siteReceived = Number(st.amountReceived) > 0 ? Number(st.amountReceived) : paymentReceived;
                      const sitePending = totalIncome - siteReceived;

                      const siteLoanPayments = sitePaymentsList.filter((p) => normCategory(p.paymentType).includes('loan'));
                      const siteDisb1 = siteLoanPayments
                        .filter((p) => (p.disbursementStage === 'Disbursement 1' || String(p.paymentType).includes('1') || (!p.disbursementStage && !String(p.paymentType).includes('2'))))
                        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                      const siteDisb2 = siteLoanPayments
                        .filter((p) => (p.disbursementStage === 'Disbursement 2' || String(p.paymentType).includes('2')))
                        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

                      return (
                        <tr
                          key={st.id}
                          className={`hover:bg-blue-100/50 transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/25'
                          }`}
                        >
                          {/* 1. Site ID (Rule 1) */}
                          <td className="p-3 border-r border-blue-100 font-mono font-bold text-blue-700">
                            {st.id}
                          </td>

                          {/* 2. Customer Name */}
                          <td className="p-3 border-r border-blue-100 font-bold text-slate-900 whitespace-nowrap">
                            {st.customerName || st.clientName || '-'}
                          </td>

                          {/* 3. Site Address */}
                          <td className="p-3 border-r border-blue-100 text-slate-700">
                            {st.siteAddress || st.location || '-'}
                          </td>

                          {/* 4. District */}
                          <td className="p-3 border-r border-blue-100 text-slate-700 font-semibold">
                            {st.district || '-'}
                          </td>

                          {/* 5. System (kW) */}
                          <td className="p-3 border-r border-blue-100 text-center font-bold text-blue-700">
                            {st.capacity || '-'}
                          </td>

                          {/* 6. Project Value */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-slate-900">
                            {formatINR(st.projectValue || 0)}
                          </td>

                          {/* 7. Loan Amount & Disbursements */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono whitespace-nowrap">
                            <span className="font-bold text-slate-900">{formatINR(loanAmt)}</span>
                            {loanAmt > 0 && (
                              <div className="flex flex-col items-end gap-0.5 mt-1 text-[10px] leading-tight font-sans">
                                <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                                  siteDisb1 > 0 ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  Disb 1: {siteDisb1 > 0 ? formatINR(siteDisb1) : 'Pending'}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                                  siteDisb2 > 0 ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  Disb 2: {siteDisb2 > 0 ? formatINR(siteDisb2) : 'Pending'}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* 8. Customer Margin Received (Rule 2) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-slate-700">
                            {formatINR(marginAmt)}
                          </td>

                          {/* 9. Total Income (Rule 2: Loan + Margin) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-black text-blue-900 bg-blue-50/60">
                            {formatINR(totalIncome)}
                          </td>

                          {/* 10. Material Cost (Rule 4: Auto sum) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-rose-600 bg-blue-50/60">
                            {formatINR(siteMaterial)}
                          </td>

                          {/* 11. Labour Cost (Rule 4: Auto sum) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-slate-700 bg-blue-50/60">
                            {formatINR(siteLabour)}
                          </td>

                          {/* 12. Transport Cost (Rule 4: Auto sum) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-slate-700 bg-blue-50/60">
                            {formatINR(siteTransport)}
                          </td>

                          {/* 13. Misc Cost (Rule 4: Auto sum) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-slate-700 bg-blue-50/60">
                            {formatINR(siteMisc)}
                          </td>

                          {/* 14. Total Expense (Rule 4: Sum of 4 categories) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-black text-rose-700 bg-blue-50/60">
                            {formatINR(siteTotalExpense)}
                          </td>

                          {/* 15. Profit / Loss (Rule 7) */}
                          <td className={`p-3 border-r border-blue-100 text-right font-mono font-black bg-blue-50/60 ${
                            siteProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}>
                            {formatINR(siteProfit)}
                          </td>

                          {/* 16. Profit % (Rule 7) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-blue-700 bg-blue-50/60">
                            {siteProfitMargin.toFixed(2)}%
                          </td>

                          {/* 17. Amount Received (Rule 5) */}
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-emerald-700 bg-blue-50/60">
                            {formatINR(siteReceived)}
                          </td>

                          {/* 18. Amount Pending (Rule 5) */}
                          <td className={`p-3 border-r border-blue-100 text-right font-mono font-bold bg-blue-50/60 ${
                            sitePending < 0 ? 'text-blue-700' : sitePending === 0 ? 'text-slate-500' : 'text-amber-700'
                          }`}>
                            {formatINR(sitePending)}
                          </td>

                          {/* 19. Site Status (Rule 6) */}
                          <td className="p-3 border-r border-blue-100 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              (st.siteStatus || st.status) === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : (st.siteStatus || st.status) === 'On Hold'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                              {st.siteStatus || st.status || 'Running'}
                            </span>
                          </td>

                          {/* 20. Start Date */}
                          <td className="p-3 border-r border-blue-100 font-mono text-slate-700 whitespace-nowrap">
                            {st.startDate || '-'}
                          </td>

                          {/* 21. Completion Date (Rule 6) */}
                          <td className="p-3 border-r border-blue-100 font-mono text-slate-500 whitespace-nowrap">
                            {st.completionDate || '-'}
                          </td>

                          {/* 22. Remarks */}
                          <td className="p-3 border-r border-blue-100 text-slate-600 truncate max-w-[200px]" title={st.remarks || st.notes || ''}>
                            {st.remarks || st.notes || '-'}
                          </td>

                          {/* 23. Actions (Sticky Right Column) */}
                          <td className="p-3 text-center sticky right-0 bg-white shadow-l border-l border-blue-100">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDirectPrintSite(st)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                                title="Print Official Site Settlement Slip / Report"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSite({
                                    ...st,
                                    customerName: st.customerName || st.clientName || '',
                                    siteAddress: st.siteAddress || st.location || '',
                                    district: st.district || '',
                                    capacity: st.capacity || '',
                                    projectValue: st.projectValue || '',
                                    loanAmount: st.loanAmount || '',
                                    customerMargin: st.customerMargin || 0,
                                    materialCost: st.materialCost || 0,
                                    labourCost: st.labourCost || 0,
                                    transportCost: st.transportCost || 0,
                                    miscCost: st.miscCost || 0,
                                    amountReceived: st.amountReceived || 0,
                                    siteStatus: st.siteStatus || st.status || 'Running',
                                    startDate: st.startDate || '',
                                    completionDate: st.completionDate || '',
                                    remarks: st.remarks || st.notes || ''
                                  });
                                  setShowEditSiteModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                                title="Edit Site Record"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSite(st.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                title="Delete Site"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>

                {/* Sticky Grand Total Footer Row */}
                {(() => {
                  const filteredSites = sites.filter((st) => {
                    const matchQuery =
                      (st.name || '').toLowerCase().includes(siteSearch.toLowerCase()) ||
                      (st.customerName || st.clientName || '').toLowerCase().includes(siteSearch.toLowerCase()) ||
                      (st.id || '').toLowerCase().includes(siteSearch.toLowerCase()) ||
                      (st.siteAddress || st.location || '').toLowerCase().includes(siteSearch.toLowerCase()) ||
                      (st.district || '').toLowerCase().includes(siteSearch.toLowerCase());
                    const matchStatus = siteStatusFilter === 'ALL' || (st.siteStatus || st.status || 'Running') === siteStatusFilter;
                    const matchDistrict = siteDistrictFilter === 'ALL' || (st.district || '') === siteDistrictFilter;
                    return matchQuery && matchStatus && matchDistrict;
                  });

                  const smTotals = filteredSites.reduce(
                    (acc, st) => {
                      const mat = expenses
                        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'material')
                        .reduce((a, c) => a + (Number(c.amount) || 0), 0);
                      const lab = expenses
                        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'labour')
                        .reduce((a, c) => a + (Number(c.amount) || 0), 0);
                      const tra = expenses
                        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'transport')
                        .reduce((a, c) => a + (Number(c.amount) || 0), 0);
                      const mis = expenses
                        .filter((e) => normSiteId(e.siteId) === normSiteId(st.id) && normCategory(e.category) === 'misc')
                        .reduce((a, c) => a + (Number(c.amount) || 0), 0);
                      const expTot = mat + lab + tra + mis;

                      const loanAmt = Number(st.loanAmount) || 0;
                      const marginAmt = Number(st.customerMargin) || 0;
                      const inc = (loanAmt + marginAmt) > 0 ? (loanAmt + marginAmt) : (Number(st.projectIncome) || Number(st.projectValue) || 0);
                      const prof = inc - expTot;
                      const rec = payments
                        .filter((p) => normSiteId(p.siteId) === normSiteId(st.id))
                        .reduce((a, c) => a + (Number(c.amount) || 0), 0);
                      const pend = inc - rec;

                      acc.projectValue += Number(st.projectValue) || 0;
                      acc.loanAmount += loanAmt;
                      acc.customerMargin += marginAmt;
                      acc.totalIncome += inc;
                      acc.material += mat;
                      acc.labour += lab;
                      acc.transport += tra;
                      acc.misc += mis;
                      acc.totalExpense += expTot;
                      acc.profit += prof;
                      acc.received += rec;
                      acc.pending += pend;
                      return acc;
                    },
                    {
                      projectValue: 0,
                      loanAmount: 0,
                      customerMargin: 0,
                      totalIncome: 0,
                      material: 0,
                      labour: 0,
                      transport: 0,
                      misc: 0,
                      totalExpense: 0,
                      profit: 0,
                      received: 0,
                      pending: 0
                    }
                  );

                  const smProfitPercent = smTotals.totalIncome > 0 ? ((smTotals.profit / smTotals.totalIncome) * 100) : 0;

                  return (
                    <tfoot className="sticky bottom-0 z-20 bg-blue-900 text-white font-mono font-black text-xs shadow-xl border-t-2 border-blue-950">
                      <tr className="divide-x divide-blue-800">
                        <td colSpan={5} className="p-3 text-left font-sans font-black text-sky-200 tracking-wider uppercase">
                          GRAND TOTAL ({filteredSites.length} SITES)
                        </td>
                        <td className="p-3 text-right text-white font-bold">{formatINR(smTotals.projectValue)}</td>
                        <td className="p-3 text-right text-blue-100">{formatINR(smTotals.loanAmount)}</td>
                        <td className="p-3 text-right text-blue-100">{formatINR(smTotals.customerMargin)}</td>
                        <td className="p-3 text-right text-amber-300 bg-blue-950">{formatINR(smTotals.totalIncome)}</td>
                        <td className="p-3 text-right text-rose-300 bg-blue-950">{formatINR(smTotals.material)}</td>
                        <td className="p-3 text-right text-blue-100 bg-blue-950">{formatINR(smTotals.labour)}</td>
                        <td className="p-3 text-right text-blue-100 bg-blue-950">{formatINR(smTotals.transport)}</td>
                        <td className="p-3 text-right text-blue-100 bg-blue-950">{formatINR(smTotals.misc)}</td>
                        <td className="p-3 text-right text-rose-300 bg-blue-950">{formatINR(smTotals.totalExpense)}</td>
                        <td className={`p-3 text-right bg-blue-950 ${smTotals.profit >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                          {formatINR(smTotals.profit)}
                        </td>
                        <td className="p-3 text-right text-sky-300 bg-blue-950">{smProfitPercent.toFixed(2)}%</td>
                        <td className="p-3 text-right text-emerald-300 bg-blue-950">{formatINR(smTotals.received)}</td>
                        <td className="p-3 text-right text-amber-300 bg-blue-950">{formatINR(smTotals.pending)}</td>
                        <td colSpan={4} className="p-3 text-center text-blue-200 font-sans text-[11px]">
                          {filteredSites.filter(s => (s.siteStatus || s.status) === 'Completed').length} Done / {filteredSites.length} Total
                        </td>
                        <td className="p-3 sticky right-0 bg-blue-950 text-center text-emerald-400 font-sans text-[10px] font-bold">
                          ✓ Real-time
                        </td>
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>
            </div>

            {/* Bottom Table Footer Note */}
            <div className="p-3 bg-blue-50 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-mono">
                Formula: Total Income = Loan + Margin | Total Expense = Material + Labour + Transport + Misc | Profit = Income - Expense
              </span>
              <span className="font-bold text-blue-800">
                Live Interactive Grid — Changes auto-calculate across Dashboard & Reports
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EXPENSE ENTRY TAB - SPREADSHEET LAYOUT (RULE 3 & 4) */}
      {/* ========================================================================= */}
      {subTab === 'expense_entry' && (
        <div className="space-y-4 font-['Outfit',sans-serif]">
          {/* Top Banner (Executive Blue & White Theme) */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border border-blue-700/60 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider">
                  OFFICIAL EXPENSE LEDGER
                </span>
                <span className="text-xs text-blue-200 font-mono">POWER24 ADVANCED ENTERPRISE</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase font-mono mt-1">
                POWER24Solar Services Pvt Ltd
              </h2>
              <h3 className="text-xs sm:text-sm font-bold text-sky-300 tracking-wider uppercase font-mono">
                EXPENSE ENTRY – DATE-WISE MATERIAL / LABOUR / MISC COST
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleExportExpensesCSV}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export to CSV / Excel"
              >
                <Download className="w-3.5 h-3.5 text-sky-300" />
                <span>Export Excel (.csv)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print Report"
              >
                <Printer className="w-3.5 h-3.5 text-sky-300" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNewExpenseForm(getEmptyExpenseForm(sites));
                  setShowAddExpenseModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Expense Entry</span>
              </button>
            </div>
          </div>

          {/* Quick Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-blue-200/80 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Expense ID, Site ID, Vendor, Description..."
                value={expenseSearch}
                onChange={(e) => setExpenseSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Site ID:</span>
                <select
                  value={expenseSiteFilter}
                  onChange={(e) => setExpenseSiteFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Project Sites</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} - {s.customerName || s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Category:</span>
                <select
                  value={expenseCategoryFilter}
                  onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Material">Material</option>
                  <option value="Misc">Misc</option>
                  <option value="Labour">Labour</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Payment Mode:</span>
                <select
                  value={expensePaymentModeFilter}
                  onChange={(e) => setExpensePaymentModeFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Modes</option>
                  <option value="UPI">UPI</option>
                  <option value="NEFT/RTGS">NEFT/RTGS</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200">
                Entries: <strong className="text-blue-900">{expenses.length}</strong>
              </span>
            </div>
          </div>

          {/* Full Enterprise Table View for Expense Entry */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[72vh] border-b border-blue-200">
              <table className="w-full text-left text-xs border-collapse font-sans min-w-[1350px]">
                {/* Excel Table Header Row (Royal Blue) */}
                <thead className="sticky top-0 z-20 shadow-md">
                  <tr className="bg-blue-800 text-white text-[11px] font-black uppercase tracking-wider border-b border-blue-900">
                    <th className="p-3 border-r border-blue-700 text-center w-12 text-blue-200 font-mono">
                      #
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Expense ID</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Site ID</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[130px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Date</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[160px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Vendor / Person</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[220px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Description</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[150px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Expense Category</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[150px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Amount</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Payment Mode</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[130px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Bill No.</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Remarks</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 whitespace-nowrap text-center sticky right-0 bg-blue-900 text-white min-w-[90px] z-30 shadow-l">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>

                {/* Table Body Rows */}
                <tbody className="divide-y divide-blue-100 font-medium text-slate-800">
                  {(() => {
                    const filtered = expenses.filter((exp) => {
                      const matchQuery =
                        (exp.description || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                        (exp.siteName || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                        (exp.siteId || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                        (exp.id || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                        (exp.billNo || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                        (exp.remarks || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                        (exp.vendor || '').toLowerCase().includes(expenseSearch.toLowerCase());
                      const matchCategory =
                        expenseCategoryFilter === 'ALL' ||
                        normCategory(exp.category) === normCategory(expenseCategoryFilter);
                      const matchSite =
                        expenseSiteFilter === 'ALL' ||
                        normSiteId(exp.siteId) === normSiteId(expenseSiteFilter);
                      const matchMode =
                        expensePaymentModeFilter === 'ALL' ||
                        normCategory(exp.paymentMode).includes(normCategory(expensePaymentModeFilter));

                      return matchQuery && matchCategory && matchSite && matchMode;
                    });

                    const dataRows = filtered.map((exp, idx) => {
                      return (
                        <tr
                          key={exp.id || idx}
                          className={`hover:bg-blue-100/50 transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/25'
                          }`}
                        >
                          <td className="p-3 border-r border-blue-100 text-center text-blue-900 font-mono text-[11px] bg-blue-50/50">
                            {idx + 4}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono font-bold text-blue-700 whitespace-nowrap">
                            {exp.id || `EXP-${String(idx + 1).padStart(3, '0')}`}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono font-bold text-slate-800 whitespace-nowrap">
                            {exp.siteId || '-'}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono text-slate-700 whitespace-nowrap">
                            {exp.date || '-'}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-bold text-slate-900 uppercase whitespace-nowrap">
                            {exp.vendor || exp.vendorPerson || '-'}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-slate-700">
                            {exp.description ? exp.description : <span className="text-slate-400 italic">-</span>}
                          </td>
                          <td className="p-3 border-r border-blue-100">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                normCategory(exp.category) === 'material'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : normCategory(exp.category) === 'misc'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                  : normCategory(exp.category) === 'labour'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {exp.category || 'Material'}
                            </span>
                          </td>
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-black text-rose-600 text-sm whitespace-nowrap">
                            {formatINR(exp.amount)}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-semibold text-slate-800 whitespace-nowrap">
                            {exp.paymentMode || 'UPI'}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono text-slate-600 whitespace-nowrap">
                            {exp.billNo || exp.voucherNo || <span className="text-slate-400">-</span>}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-slate-600 truncate max-w-[200px]" title={exp.remarks || ''}>
                            {exp.remarks ? exp.remarks : <span className="text-slate-400">-</span>}
                          </td>
                          <td className="p-3 text-center sticky right-0 bg-white shadow-l border-l border-blue-100">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDirectPrintExpense(exp)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                                title="Print Official Expense Voucher"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingExpense({
                                    ...exp,
                                    id: exp.id || `EXP-${String(idx + 1).padStart(3, '0')}`,
                                    siteId: exp.siteId || '',
                                    date: exp.date || '',
                                    vendor: exp.vendor || '',
                                    vendorContact: exp.vendorContact || '',
                                    description: exp.description || '',
                                    category: exp.category || 'Material',
                                    itemType: exp.itemType || '',
                                    qty: exp.qty !== undefined ? exp.qty : 1,
                                    unit: exp.unit || 'Nos',
                                    rate: exp.rate || '',
                                    amount: exp.amount || '',
                                    gstAmount: exp.gstAmount || '',
                                    paymentMode: exp.paymentMode || 'UPI',
                                    paymentStatus: exp.paymentStatus || 'Paid',
                                    paidBy: exp.paidBy || '',
                                    billNo: exp.billNo || '',
                                    remarks: exp.remarks || ''
                                  });
                                  setShowEditExpenseModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                                title="Edit Expense"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(exp.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                title="Delete Expense"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });

                    const emptyRowCount = Math.max(0, 10 - filtered.length);
                    const emptyRows = Array.from({ length: emptyRowCount }).map((_, i) => {
                      const rowNum = filtered.length + i + 4;
                      return (
                        <tr
                          key={`empty-row-${i}`}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/15'}
                        >
                          <td className="p-3 border-r border-blue-100/50 text-center text-slate-400 font-mono text-[11px] bg-blue-50/30">
                            {rowNum}
                          </td>
                          <td className="p-3 border-r border-blue-100/50 font-mono">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 font-mono">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 text-right">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 sticky right-0 bg-white/60 border-l border-blue-100/50">&nbsp;</td>
                        </tr>
                      );
                    });

                    return [...dataRows, ...emptyRows];
                  })()}
                </tbody>

                {/* Sticky Grand Total Footer Row */}
                {(() => {
                  const filtered = expenses.filter((exp) => {
                    const matchQuery =
                      (exp.description || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                      (exp.siteName || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                      (exp.siteId || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                      (exp.id || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                      (exp.billNo || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                      (exp.remarks || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
                      (exp.vendor || '').toLowerCase().includes(expenseSearch.toLowerCase());
                    const matchCategory =
                      expenseCategoryFilter === 'ALL' ||
                      normCategory(exp.category) === normCategory(expenseCategoryFilter);
                    const matchSite =
                      expenseSiteFilter === 'ALL' ||
                      normSiteId(exp.siteId) === normSiteId(expenseSiteFilter);
                    const matchMode =
                      expensePaymentModeFilter === 'ALL' ||
                      normCategory(exp.paymentMode).includes(normCategory(expensePaymentModeFilter));

                    return matchQuery && matchCategory && matchSite && matchMode;
                  });

                  const totalFilteredAmount = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                  const matTot = filtered.filter(e => normCategory(e.category) === 'material').reduce((a, c) => a + (Number(c.amount) || 0), 0);
                  const labTot = filtered.filter(e => normCategory(e.category) === 'labour').reduce((a, c) => a + (Number(c.amount) || 0), 0);
                  const traTot = filtered.filter(e => normCategory(e.category) === 'transport').reduce((a, c) => a + (Number(c.amount) || 0), 0);
                  const misTot = filtered.filter(e => normCategory(e.category) === 'misc').reduce((a, c) => a + (Number(c.amount) || 0), 0);

                  return (
                    <tfoot className="sticky bottom-0 z-20 bg-blue-900 text-white font-mono font-black text-xs shadow-xl border-t-2 border-blue-950">
                      <tr className="divide-x divide-blue-800">
                        <td colSpan={7} className="p-3 text-left font-sans font-black text-sky-200 tracking-wider uppercase">
                          TOTAL EXPENSES ({filtered.length} VOUCHERS) &nbsp;|&nbsp;
                          <span className="text-blue-200 font-mono text-[11px] font-normal">
                            Mat: {formatINR(matTot)} | Lab: {formatINR(labTot)} | Tra: {formatINR(traTot)} | Misc: {formatINR(misTot)}
                          </span>
                        </td>
                        <td className="p-3 text-right font-black text-rose-300 text-sm bg-blue-950 whitespace-nowrap">
                          {formatINR(totalFilteredAmount)}
                        </td>
                        <td colSpan={3} className="p-3 text-center text-blue-200 font-sans text-[11px]">
                          Auto-summed from all active vouchers
                        </td>
                        <td className="p-3 sticky right-0 bg-blue-950 text-center text-emerald-400 font-sans text-[10px] font-bold">
                          ✓ Real-time
                        </td>
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>
            </div>

            {/* Bottom Table Footer Note */}
            <div className="p-3 bg-blue-50 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-mono">
                Formula: Total Incurred Expense = Σ Amount | Updates automatically to Site Master & Dashboard P&L
              </span>
              <span className="font-bold text-blue-800">
                Live Interactive Excel Spreadsheet — Add, edit or filter expense entries in real-time
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PAYMENT ENTRY TAB - SPREADSHEET LAYOUT (RULE 5) */}
      {/* ========================================================================= */}
      {subTab === 'payment_entry' && (
        <div className="space-y-4 font-['Outfit',sans-serif]">
          {/* Top Banner (Executive Blue & White Theme) */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border border-blue-700/60 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider">
                  OFFICIAL PAYMENT & RECEIPT LEDGER
                </span>
                <span className="text-xs text-blue-200 font-mono">POWER24 ADVANCED ENTERPRISE</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase font-mono mt-1">
                POWER24Solar Services Pvt Ltd
              </h2>
              <h3 className="text-xs sm:text-sm font-bold text-sky-300 tracking-wider uppercase font-mono">
                PAYMENT ENTRY – CUSTOMER / LOAN / OTHER RECEIPTS
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleExportPaymentsCSV}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export to CSV / Excel"
              >
                <Download className="w-3.5 h-3.5 text-sky-300" />
                <span>Export Excel (.csv)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print Report"
              >
                <Printer className="w-3.5 h-3.5 text-sky-300" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNewPaymentForm(getEmptyPaymentForm(sites));
                  setShowAddPaymentModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Payment Entry</span>
              </button>
            </div>
          </div>

          {/* Quick Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-blue-200/80 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Payment ID, Site ID, Type, Mode, Remarks..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Site ID:</span>
                <select
                  value={paymentSiteFilter}
                  onChange={(e) => setPaymentSiteFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Project Sites</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} - {s.customerName || s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Type:</span>
                <select
                  value={paymentTypeFilter}
                  onChange={(e) => setPaymentTypeFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Payment Types</option>
                  <option value="Loan">All Loans (सभी बैंक लोन)</option>
                  <option value="Disbursement 1">Loan - Disbursement 1 (1st किश्त)</option>
                  <option value="Disbursement 2">Loan - Disbursement 2 (2nd किश्त)</option>
                  <option value="Customer Margin">Customer Margin</option>
                  <option value="Customer Advance">Customer Advance</option>
                  <option value="Milestone / Stage">Milestone / Stage</option>
                  <option value="Subsidy Receipt">Subsidy Receipt</option>
                  <option value="Final Settlement">Final Settlement</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Mode:</span>
                <select
                  value={paymentModeFilter}
                  onChange={(e) => setPaymentModeFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Modes</option>
                  <option value="NEFT/RTGS">NEFT/RTGS</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200">
                Entries: <strong className="text-blue-900">{payments.length}</strong>
              </span>
            </div>
          </div>

          {/* Full Enterprise Table View for Payment Entry */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[72vh] border-b border-blue-200">
              <table className="w-full text-left text-xs border-collapse font-sans min-w-[1250px]">
                {/* Excel Table Header Row (Royal Blue) */}
                <thead className="sticky top-0 z-20 shadow-md">
                  <tr className="bg-blue-800 text-white text-[11px] font-black uppercase tracking-wider border-b border-blue-900">
                    <th className="p-3 border-r border-blue-700 text-center w-12 text-blue-200 font-mono">
                      #
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Payment ID</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Site ID</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[130px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Date</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[170px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Payment Type</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[160px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Amount Received</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Mode</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[160px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Reference No.</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Remarks</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 whitespace-nowrap text-center sticky right-0 bg-blue-900 text-white min-w-[90px] z-30 shadow-l">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>

                {/* Table Body Rows */}
                <tbody className="divide-y divide-blue-100 font-medium text-slate-800">
                  {(() => {
                    const filtered = payments.filter((pay) => {
                      const matchQuery =
                        (pay.paymentType || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        (pay.siteName || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        (pay.siteId || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        (pay.id || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        (pay.refNo || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        (pay.remarks || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        (pay.notes || '').toLowerCase().includes(paymentSearch.toLowerCase());
                      const matchType =
                        paymentTypeFilter === 'ALL'
                          ? true
                          : paymentTypeFilter === 'Disbursement 1'
                          ? (pay.disbursementStage === 'Disbursement 1' || String(pay.paymentType || '').toLowerCase().includes('disbursement 1') || String(pay.paymentType || '').toLowerCase().includes('disb 1') || (normCategory(pay.paymentType).includes('loan') && !String(pay.paymentType || '').includes('2') && pay.disbursementStage !== 'Disbursement 2'))
                          : paymentTypeFilter === 'Disbursement 2'
                          ? (pay.disbursementStage === 'Disbursement 2' || String(pay.paymentType || '').toLowerCase().includes('disbursement 2') || String(pay.paymentType || '').toLowerCase().includes('disb 2'))
                          : paymentTypeFilter === 'Loan'
                          ? normCategory(pay.paymentType).includes('loan')
                          : normCategory(pay.paymentType).includes(normCategory(paymentTypeFilter));
                      const matchSite =
                        paymentSiteFilter === 'ALL' ||
                        normSiteId(pay.siteId) === normSiteId(paymentSiteFilter);
                      const matchMode =
                        paymentModeFilter === 'ALL' ||
                        normCategory(pay.paymentMode).includes(normCategory(paymentModeFilter));

                      return matchQuery && matchType && matchSite && matchMode;
                    });

                    const dataRows = filtered.map((pay, idx) => {
                      return (
                        <tr
                          key={pay.id || idx}
                          className={`hover:bg-blue-100/50 transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/25'
                          }`}
                        >
                          <td className="p-3 border-r border-blue-100 text-center text-blue-900 font-mono text-[11px] bg-blue-50/50">
                            {idx + 4}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono font-bold text-blue-700 whitespace-nowrap">
                            {pay.id || `PAY-${String(idx + 1).padStart(3, '0')}`}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono font-bold text-slate-800 whitespace-nowrap">
                            {pay.siteId || '-'}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono text-slate-700 whitespace-nowrap">
                            {pay.date || '-'}
                          </td>
                          <td className="p-3 border-r border-blue-100 whitespace-nowrap">
                            {(() => {
                              const isLoan = normCategory(pay.paymentType).includes('loan');
                              const isMargin = normCategory(pay.paymentType).includes('margin');
                              const isDisb2 = pay.disbursementStage === 'Disbursement 2' || String(pay.paymentType || '').toLowerCase().includes('disbursement 2') || String(pay.paymentType || '').toLowerCase().includes('disb 2');

                              if (isLoan) {
                                if (isDisb2) {
                                  return (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-xs">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                                      Loan (Disb. 2 - 2nd किश्त)
                                    </span>
                                  );
                                }
                                return (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-300 shadow-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                    Loan (Disb. 1 - 1st किश्त)
                                  </span>
                                );
                              }

                              return (
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                    isMargin
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  }`}
                                >
                                  {pay.paymentType || 'Receipt'}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-black text-emerald-700 text-sm whitespace-nowrap">
                            {formatINR(pay.amount)}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-semibold text-slate-800 whitespace-nowrap">
                            {pay.paymentMode || pay.mode || 'NEFT/RTGS'}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono text-slate-600 whitespace-nowrap">
                            {pay.refNo || pay.referenceNo || <span className="text-slate-400 italic">-</span>}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-slate-600 truncate max-w-[200px]" title={pay.remarks || pay.notes || ''}>
                            {pay.remarks || pay.notes ? (pay.remarks || pay.notes) : <span className="text-slate-400 italic">-</span>}
                          </td>
                          <td className="p-3 text-center sticky right-0 bg-white shadow-l border-l border-blue-100">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDirectPrintPayment(pay)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                                title="Print Official Money Receipt"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPayment({
                                    ...pay,
                                    id: pay.id || `PAY-${String(idx + 1).padStart(3, '0')}`,
                                    siteId: pay.siteId || '',
                                    customerName: pay.customerName || '',
                                    date: pay.date || '',
                                    paymentType: pay.paymentType || 'Loan',
                                    amount: pay.amount || '',
                                    paymentMode: pay.paymentMode || pay.mode || 'NEFT/RTGS',
                                    bankName: pay.bankName || '',
                                    refNo: pay.refNo || pay.referenceNo || '',
                                    receiptNo: pay.receiptNo || '',
                                    receivedBy: pay.receivedBy || '',
                                    remarks: pay.remarks || pay.notes || ''
                                  });
                                  setShowEditPaymentModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                                title="Edit Payment"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePayment(pay.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                title="Delete Payment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });

                    const emptyRowCount = Math.max(0, 10 - filtered.length);
                    const emptyRows = Array.from({ length: emptyRowCount }).map((_, i) => {
                      const rowNum = filtered.length + i + 4;
                      return (
                        <tr
                          key={`empty-pay-row-${i}`}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/15'}
                        >
                          <td className="p-3 border-r border-blue-100/50 text-center text-slate-400 font-mono text-[11px] bg-blue-50/30">
                            {rowNum}
                          </td>
                          <td className="p-3 border-r border-blue-100/50 font-mono">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 font-mono">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 text-right">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 sticky right-0 bg-white/60 border-l border-blue-100/50">&nbsp;</td>
                        </tr>
                      );
                    });

                    return [...dataRows, ...emptyRows];
                  })()}
                </tbody>

                {/* Sticky Grand Total Footer Row */}
                {(() => {
                  const filtered = payments.filter((pay) => {
                    const matchQuery =
                      (pay.paymentType || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                      (pay.siteName || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                      (pay.siteId || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                      (pay.id || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                      (pay.refNo || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                      (pay.remarks || '').toLowerCase().includes(paymentSearch.toLowerCase()) ||
                      (pay.notes || '').toLowerCase().includes(paymentSearch.toLowerCase());
                    const matchType =
                      paymentTypeFilter === 'ALL'
                        ? true
                        : paymentTypeFilter === 'Disbursement 1'
                        ? (pay.disbursementStage === 'Disbursement 1' || String(pay.paymentType || '').toLowerCase().includes('disbursement 1') || String(pay.paymentType || '').toLowerCase().includes('disb 1') || (normCategory(pay.paymentType).includes('loan') && !String(pay.paymentType || '').includes('2') && pay.disbursementStage !== 'Disbursement 2'))
                        : paymentTypeFilter === 'Disbursement 2'
                        ? (pay.disbursementStage === 'Disbursement 2' || String(pay.paymentType || '').toLowerCase().includes('disbursement 2') || String(pay.paymentType || '').toLowerCase().includes('disb 2'))
                        : paymentTypeFilter === 'Loan'
                        ? normCategory(pay.paymentType).includes('loan')
                        : normCategory(pay.paymentType).includes(normCategory(paymentTypeFilter));
                    const matchSite =
                      paymentSiteFilter === 'ALL' ||
                      normSiteId(pay.siteId) === normSiteId(paymentSiteFilter);
                    const matchMode =
                      paymentModeFilter === 'ALL' ||
                      normCategory(pay.paymentMode).includes(normCategory(paymentModeFilter));

                    return matchQuery && matchType && matchSite && matchMode;
                  });

                  const totalFilteredReceipts = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                  const loanReceipts = filtered.filter(p => normCategory(p.paymentType).includes('loan')).reduce((a, c) => a + (Number(c.amount) || 0), 0);
                  const marginReceipts = filtered.filter(p => normCategory(p.paymentType).includes('margin')).reduce((a, c) => a + (Number(c.amount) || 0), 0);

                  return (
                    <tfoot className="sticky bottom-0 z-20 bg-blue-900 text-white font-mono font-black text-xs shadow-xl border-t-2 border-blue-950">
                      <tr className="divide-x divide-blue-800">
                        <td colSpan={5} className="p-3 text-left font-sans font-black text-sky-200 tracking-wider uppercase">
                          TOTAL AMOUNT RECEIVED ({filtered.length} RECEIPTS) &nbsp;|&nbsp;
                          <span className="text-blue-200 font-mono text-[11px] font-normal">
                            Loan: {formatINR(loanReceipts)} | Margin: {formatINR(marginReceipts)}
                          </span>
                        </td>
                        <td className="p-3 text-right font-black text-emerald-300 text-sm bg-blue-950 whitespace-nowrap">
                          {formatINR(totalFilteredReceipts)}
                        </td>
                        <td colSpan={3} className="p-3 text-center text-blue-200 font-sans text-[11px]">
                          Auto-summed from all active payment receipts
                        </td>
                        <td className="p-3 sticky right-0 bg-blue-950 text-center text-emerald-400 font-sans text-[10px] font-bold">
                          ✓ Real-time
                        </td>
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>
            </div>

            {/* Bottom Table Footer Note */}
            <div className="p-3 bg-blue-50 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-mono">
                Formula: Total Received = Σ Amount | Updates automatically to Site Master & Dashboard P&L
              </span>
              <span className="font-bold text-blue-800">
                Live Interactive Excel Spreadsheet — Add, edit or filter payment entries in real-time
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MATERIAL BUDGET TAB - SPREADSHEET LAYOUT (RULE 9) */}
      {/* ========================================================================= */}
      {subTab === 'material_budget' && (
        <div className="space-y-4 font-['Outfit',sans-serif]">
          {/* Top Banner (Executive Blue & White Theme) */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border border-blue-700/60 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider">
                  OFFICIAL MATERIAL BUDGET & BOQ
                </span>
                <span className="text-xs text-blue-200 font-mono">POWER24 ADVANCED ENTERPRISE</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase font-mono mt-1">
                POWER24Solar Services Pvt Ltd
              </h2>
              <h3 className="text-xs sm:text-sm font-bold text-sky-300 tracking-wider uppercase font-mono">
                SITE-WISE MATERIAL BUDGET VS ACTUAL (BOQ VARIANCE)
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleExportBudgetsCSV}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export to CSV / Excel"
              >
                <Download className="w-3.5 h-3.5 text-sky-300" />
                <span>Export Excel (.csv)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print Report"
              >
                <Printer className="w-3.5 h-3.5 text-sky-300" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNewBudgetItemForm(getEmptyBudgetItemForm(sites));
                  setShowAddBudgetItemModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Add Material Budget Item</span>
              </button>
            </div>
          </div>

          {/* Quick Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-blue-200/80 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Site ID, Material, Brand, Unit, Remarks..."
                value={budgetSearch}
                onChange={(e) => setBudgetSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Site ID:</span>
                <select
                  value={budgetSiteFilter}
                  onChange={(e) => setBudgetSiteFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Project Sites</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} - {s.customerName || s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Brand:</span>
                <select
                  value={budgetBrandFilter}
                  onChange={(e) => setBudgetBrandFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Brands</option>
                  <option value="WAREE">WAREE / WAAREE</option>
                  <option value="TATA">TATA SOLAR</option>
                  <option value="ADANI">ADANI SOLAR</option>
                  <option value="LUMINOUS">LUMINOUS</option>
                  <option value="HAVELLS">HAVELLS</option>
                  <option value="UTL">UTL SOLAR</option>
                  <option value="GENERIC">GENERIC / BOS</option>
                </select>
              </div>

              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200">
                Items: <strong className="text-blue-900">{budgets.length}</strong>
              </span>
            </div>
          </div>

          {/* Full Enterprise Table View for Material Budget (Rule 9: Qty, Budget Rate, Budget Amount, Actual Amount, Variance) */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[72vh] border-b border-blue-200">
              <table className="w-full text-left text-xs border-collapse font-sans min-w-[1300px]">
                {/* Excel Table Header Row (Royal Blue) */}
                <thead className="sticky top-0 z-20 shadow-md">
                  <tr className="bg-blue-800 text-white text-[11px] font-black uppercase tracking-wider border-b border-blue-900">
                    <th className="p-3 border-r border-blue-700 text-center w-12 text-blue-200 font-mono">
                      #
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[130px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Site ID</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Material</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[140px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Brand</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-center min-w-[90px]">
                      <div className="flex items-center justify-center gap-1">
                        <span>Qty</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-center min-w-[90px]">
                      <div className="flex items-center justify-center gap-1">
                        <span>Unit</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[130px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Budget Rate</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[150px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Budget Amount (Qty*Rate)</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[150px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Actual Amount</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap text-right min-w-[130px]">
                      <div className="flex items-center justify-end gap-1">
                        <span>Variance (Budget-Actual)</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 border-r border-blue-700 whitespace-nowrap min-w-[160px]">
                      <div className="flex items-center justify-between gap-1">
                        <span>Remarks</span>
                        <ChevronDown className="w-3 h-3 text-blue-200" />
                      </div>
                    </th>
                    <th className="p-3 whitespace-nowrap text-center sticky right-0 bg-blue-900 text-white min-w-[90px] z-30 shadow-l">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>

                {/* Table Body Rows (Rule 9) */}
                <tbody className="divide-y divide-blue-100 font-medium text-slate-800">
                  {(() => {
                    const filtered = budgets.filter((b) => {
                      const matchQuery =
                        (b.material || '').toLowerCase().includes(budgetSearch.toLowerCase()) ||
                        (b.brand || '').toLowerCase().includes(budgetSearch.toLowerCase()) ||
                        (b.siteId || '').toLowerCase().includes(budgetSearch.toLowerCase()) ||
                        (b.unit || '').toLowerCase().includes(budgetSearch.toLowerCase()) ||
                        (b.remarks || '').toLowerCase().includes(budgetSearch.toLowerCase());
                      const matchSite =
                        budgetSiteFilter === 'ALL' ||
                        normSiteId(b.siteId) === normSiteId(budgetSiteFilter);
                      const matchBrand =
                        budgetBrandFilter === 'ALL' ||
                        normCategory(b.brand).includes(normCategory(budgetBrandFilter));

                      return matchQuery && matchSite && matchBrand;
                    });

                    const dataRows = filtered.map((b, idx) => {
                      const q = Number(b.qty) || 1;
                      const rate = Number(b.budgetRate) || 0;
                      const bAmt = Number(b.budgetAmount !== undefined ? b.budgetAmount : q * rate);
                      const aAmt = Number(b.actualAmount !== undefined ? b.actualAmount : 0);
                      const variance = bAmt - aAmt;

                      return (
                        <tr
                          key={b.id || idx}
                          className={`hover:bg-blue-100/50 transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/25'
                          }`}
                        >
                          <td className="p-3 border-r border-blue-100 text-center text-blue-900 font-mono text-[11px] bg-blue-50/50">
                            {idx + 4}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-mono font-bold text-slate-800 whitespace-nowrap">
                            {b.siteId || '-'}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-bold text-slate-900 uppercase whitespace-nowrap">
                            {b.material || '-'}
                          </td>
                          <td className="p-3 border-r border-blue-100 font-semibold text-blue-700 uppercase whitespace-nowrap">
                            {b.brand || '-'}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-center font-mono font-bold text-slate-800">
                            {b.qty !== undefined ? b.qty : 1}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-center font-mono text-slate-700 uppercase">
                            {b.unit || 'NO'}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-right font-mono text-slate-700">
                            {formatINR(rate)}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-blue-900 text-sm whitespace-nowrap">
                            {formatINR(bAmt)}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-right font-mono font-bold text-rose-600 text-sm whitespace-nowrap">
                            {formatINR(aAmt)}
                          </td>
                          <td className={`p-3 border-r border-blue-100 text-right font-mono font-black text-sm whitespace-nowrap ${
                            variance >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}>
                            {formatINR(variance)}
                          </td>
                          <td className="p-3 border-r border-blue-100 text-slate-600 truncate max-w-[200px]" title={b.remarks || ''}>
                            {b.remarks ? b.remarks : <span className="text-slate-400 italic">-</span>}
                          </td>
                          <td className="p-3 text-center sticky right-0 bg-white shadow-l border-l border-blue-100">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingBudgetItem({
                                    ...b,
                                    id: b.id || `MAT-${String(idx + 1).padStart(3, '0')}`,
                                    siteId: b.siteId || '',
                                    category: b.category || 'Solar Panels',
                                    material: b.material || '',
                                    brand: b.brand || '',
                                    specification: b.specification || '',
                                    qty: b.qty !== undefined ? b.qty : 1,
                                    unit: b.unit || 'NO',
                                    budgetRate: rate,
                                    budgetAmount: bAmt,
                                    actualRate: b.actualRate || '',
                                    actualAmount: aAmt,
                                    procurementStatus: b.procurementStatus || 'Pending',
                                    supplier: b.supplier || '',
                                    remarks: b.remarks || ''
                                  });
                                  setShowEditBudgetItemModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBudgetItem(b.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });

                    const emptyRowCount = Math.max(0, 10 - filtered.length);
                    const emptyRows = Array.from({ length: emptyRowCount }).map((_, i) => {
                      const rowNum = filtered.length + i + 4;
                      return (
                        <tr
                          key={`empty-mat-row-${i}`}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/15'}
                        >
                          <td className="p-3 border-r border-blue-100/50 text-center text-slate-400 font-mono text-[11px] bg-blue-50/30">
                            {rowNum}
                          </td>
                          <td className="p-3 border-r border-blue-100/50 font-mono">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 font-mono">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 text-center">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 text-center">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 text-right">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 text-right">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 text-right">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50 text-right">&nbsp;</td>
                          <td className="p-3 border-r border-blue-100/50">&nbsp;</td>
                          <td className="p-3 sticky right-0 bg-white/60 border-l border-blue-100/50">&nbsp;</td>
                        </tr>
                      );
                    });

                    return [...dataRows, ...emptyRows];
                  })()}
                </tbody>

                {/* Sticky Grand Total Footer Row */}
                {(() => {
                  const filtered = budgets.filter((b) => {
                    const matchQuery =
                      (b.material || '').toLowerCase().includes(budgetSearch.toLowerCase()) ||
                      (b.brand || '').toLowerCase().includes(budgetSearch.toLowerCase()) ||
                      (b.siteId || '').toLowerCase().includes(budgetSearch.toLowerCase()) ||
                      (b.unit || '').toLowerCase().includes(budgetSearch.toLowerCase()) ||
                      (b.remarks || '').toLowerCase().includes(budgetSearch.toLowerCase());
                    const matchSite =
                      budgetSiteFilter === 'ALL' ||
                      normSiteId(b.siteId) === normSiteId(budgetSiteFilter);
                    const matchBrand =
                      budgetBrandFilter === 'ALL' ||
                      normCategory(b.brand).includes(normCategory(budgetBrandFilter));

                    return matchQuery && matchSite && matchBrand;
                  });

                  const totBudget = filtered.reduce((acc, curr) => acc + (Number(curr.budgetAmount) || ((Number(curr.qty) || 1) * (Number(curr.budgetRate) || 0))), 0);
                  const totActual = filtered.reduce((acc, curr) => acc + (Number(curr.actualAmount) || 0), 0);
                  const totVariance = totBudget - totActual;

                  return (
                    <tfoot className="sticky bottom-0 z-20 bg-blue-900 text-white font-mono font-black text-xs shadow-xl border-t-2 border-blue-950">
                      <tr className="divide-x divide-blue-800">
                        <td colSpan={7} className="p-3 text-left font-sans font-black text-sky-200 tracking-wider uppercase">
                          TOTAL MATERIAL BUDGET ({filtered.length} ITEMS)
                        </td>
                        <td className="p-3 text-right font-black text-amber-300 text-sm bg-blue-950 whitespace-nowrap">
                          {formatINR(totBudget)}
                        </td>
                        <td className="p-3 text-right font-black text-rose-300 text-sm bg-blue-950 whitespace-nowrap">
                          {formatINR(totActual)}
                        </td>
                        <td className={`p-3 text-right font-black text-sm bg-blue-950 whitespace-nowrap ${totVariance >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                          {formatINR(totVariance)}
                        </td>
                        <td className="p-3 text-center text-blue-200 font-sans text-[11px]">
                          {totVariance >= 0 ? 'Under Budget (Surplus)' : 'Over Budget (Deficit)'}
                        </td>
                        <td className="p-3 sticky right-0 bg-blue-950 text-center text-emerald-400 font-sans text-[10px] font-bold">
                          ✓ Real-time
                        </td>
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>
            </div>

            {/* Bottom Table Footer Note */}
            <div className="p-3 bg-blue-50 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-mono">
                Formula: Budget Amount = Qty * Budget Rate | Variance = Budget Amount - Actual Amount | Live sync with Material Cost
              </span>
              <span className="font-bold text-blue-800">
                Live Interactive Excel Spreadsheet — Add, edit or filter material items in real-time
              </span>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODALS (White & Blue Executive Styling) */}
      {/* ========================================================================= */}

      {/* Modal: Add New Site Master (All 22 Fields Manual & Calculated) */}
      {showAddSiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white border-2 border-blue-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>Register New Solar Site (Site Master — Complete 22 Fields Entry)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter customer details, loan, manual expenses (Material, Labour, Transport, Misc), and payments
                </p>
              </div>
              <button
                onClick={() => setShowAddSiteModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const loan = Number(newSiteForm.loanAmount) || 0;
              const margin = Number(newSiteForm.customerMargin) || 0;
              const calcIncome = (loan + margin) > 0 ? (loan + margin) : (Number(newSiteForm.projectValue) || 0);
              const mat = Number(newSiteForm.materialCost) || 0;
              const lab = Number(newSiteForm.labourCost) || 0;
              const tra = Number(newSiteForm.transportCost) || 0;
              const misc = Number(newSiteForm.miscCost) || 0;
              const totExp = mat + lab + tra + misc;
              const rec = Number(newSiteForm.amountReceived) || 0;
              const profit = calcIncome - totExp;
              const profitMargin = calcIncome > 0 ? ((profit / calcIncome) * 100) : 0;
              const pending = calcIncome - rec;

              return (
                <form onSubmit={handleAddSite} className="space-y-4 text-xs">
                  {/* 1. Basic Site Information */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      1. Site & Customer Information (साइट व ग्राहक विवरण)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">
                          Site ID (e.g. P24-001)
                        </label>
                        <input
                          type="text"
                          placeholder={`e.g. P24-${String(sites.length + 1).padStart(3, '0')} (leave blank for auto)`}
                          value={newSiteForm.id}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, id: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Customer Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter Customer Name"
                          value={newSiteForm.customerName}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, customerName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Site Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Site Address, City, State"
                        value={newSiteForm.siteAddress}
                        onChange={(e) => setNewSiteForm({ ...newSiteForm, siteAddress: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">District *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. District / City"
                          value={newSiteForm.district}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, district: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">System Capacity (kW) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 3kW / 5kW"
                          value={newSiteForm.capacity}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, capacity: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Site Status</label>
                        <select
                          value={newSiteForm.siteStatus}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, siteStatus: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Running">Running</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Financial Valuation & Income (Loan + Margin) */}
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px]">
                        2. Project Income (प्रोजेक्ट इनकम: Loan + Margin)
                      </span>
                      <span className="text-[11px] text-blue-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                        Total Income: {formatINR(calcIncome)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Project Value (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="Enter Project Value (₹)"
                          value={newSiteForm.projectValue}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, projectValue: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Loan Amount (₹)</label>
                        <input
                          type="number"
                          placeholder="Enter Loan Amount (₹)"
                          value={newSiteForm.loanAmount}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, loanAmount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Customer Margin (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newSiteForm.customerMargin}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, customerMargin: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Project Expenses (Material, Labour, Transport, Misc) */}
                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-900 uppercase tracking-wider text-[11px]">
                        3. Project Expenses Breakdown (खर्चे: Material, Labour, Transport, Misc)
                      </span>
                      <span className="text-[11px] text-rose-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                        Total Expense: {formatINR(totExp)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Material Cost (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newSiteForm.materialCost || ''}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, materialCost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Labour Cost (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newSiteForm.labourCost || ''}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, labourCost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Transport Cost (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newSiteForm.transportCost || ''}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, transportCost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Misc Cost (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newSiteForm.miscCost || ''}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, miscCost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Payment Collection & Pending */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-900 uppercase tracking-wider text-[11px]">
                        4. Payment Collection Tracking (प्राप्त व बकाया भुगतान)
                      </span>
                      <span className="text-[11px] text-amber-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                        Amount Pending: {formatINR(pending)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Amount Received (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newSiteForm.amountReceived || ''}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, amountReceived: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Amount Pending (₹ - Auto Calculated)</label>
                        <input
                          type="text"
                          disabled
                          value={formatINR(pending)}
                          className="w-full px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Live Profit & Loss Preview Ledger Strip */}
                  <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-md space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-200 uppercase tracking-wider">
                        ⚡ Realtime Financial Calculation (लाइव प्रॉफिट / लॉस लेजर)
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${
                        profit >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {profit >= 0 ? `PROFIT: +${formatINR(profit)} (${profitMargin.toFixed(2)}%)` : `LOSS: ${formatINR(profit)} (${profitMargin.toFixed(2)}%)`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-blue-200 block font-sans">Total Income</span>
                        <span className="text-xs font-bold text-white">{formatINR(calcIncome)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-rose-200 block font-sans">Total Expense</span>
                        <span className="text-xs font-bold text-rose-300">{formatINR(totExp)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-emerald-200 block font-sans">Amount Received</span>
                        <span className="text-xs font-bold text-emerald-300">{formatINR(rec)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-amber-200 block font-sans">Amount Pending</span>
                        <span className="text-xs font-bold text-amber-300">{formatINR(pending)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 6. Dates & Remarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Start Date</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formatForDateInput(newSiteForm.startDate)}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, startDate: e.target.value })}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Completion Date</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formatForDateInput(newSiteForm.completionDate)}
                          onChange={(e) => setNewSiteForm({ ...newSiteForm, completionDate: e.target.value })}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Remarks / Project Notes</label>
                    <textarea
                      rows="2"
                      placeholder="e.g. On-grid 3kW system under PM Surya Ghar Yojana"
                      value={newSiteForm.remarks}
                      onChange={(e) => setNewSiteForm({ ...newSiteForm, remarks: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowAddSiteModal(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider shadow-lg shadow-blue-600/25 cursor-pointer"
                    >
                      Save Site to Master (22 Columns Complete)
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal: Edit Site Master (All 22 Fields Manual & Calculated) */}
      {showEditSiteModal && editingSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white border-2 border-blue-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  <span>Edit Site Master #{editingSite.id} (Complete 22 Fields)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update customer info, valuation, manual expenses (Material, Labour, Transport, Misc), and payment collections
                </p>
              </div>
              <button
                onClick={() => setShowEditSiteModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const loan = Number(editingSite.loanAmount) || 0;
              const margin = Number(editingSite.customerMargin) || 0;
              const calcIncome = (loan + margin) > 0 ? (loan + margin) : (Number(editingSite.projectValue) || 0);
              const mat = Number(editingSite.materialCost) || 0;
              const lab = Number(editingSite.labourCost) || 0;
              const tra = Number(editingSite.transportCost) || 0;
              const misc = Number(editingSite.miscCost) || 0;
              const totExp = mat + lab + tra + misc;
              const rec = Number(editingSite.amountReceived) || 0;
              const profit = calcIncome - totExp;
              const profitMargin = calcIncome > 0 ? ((profit / calcIncome) * 100) : 0;
              const pending = calcIncome - rec;

              return (
                <form onSubmit={handleEditSiteSave} className="space-y-4 text-xs">
                  {/* 1. Basic Site Information */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      1. Site & Customer Information (साइट व ग्राहक विवरण)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Site ID</label>
                        <input
                          type="text"
                          disabled
                          value={editingSite.id}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-blue-800 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Customer Name *</label>
                        <input
                          type="text"
                          required
                          value={editingSite.customerName || editingSite.clientName || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, customerName: e.target.value, clientName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Site Address *</label>
                      <input
                        type="text"
                        required
                        value={editingSite.siteAddress || editingSite.location || ''}
                        onChange={(e) => setEditingSite({ ...editingSite, siteAddress: e.target.value, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">District</label>
                        <input
                          type="text"
                          value={editingSite.district || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, district: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">System Capacity (kW)</label>
                        <input
                          type="text"
                          value={editingSite.capacity || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, capacity: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Site Status</label>
                        <select
                          value={editingSite.siteStatus || editingSite.status || 'Running'}
                          onChange={(e) => setEditingSite({ ...editingSite, siteStatus: e.target.value, status: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Running">Running</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Financial Valuation & Income */}
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px]">
                        2. Project Income (Loan + Margin)
                      </span>
                      <span className="text-[11px] text-blue-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                        Total Income: {formatINR(calcIncome)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Project Value (₹)</label>
                        <input
                          type="number"
                          value={editingSite.projectValue || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, projectValue: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Loan Amount (₹)</label>
                        <input
                          type="number"
                          value={editingSite.loanAmount || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, loanAmount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Customer Margin (₹)</label>
                        <input
                          type="number"
                          value={editingSite.customerMargin || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, customerMargin: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Project Expenses (Material, Labour, Transport, Misc) */}
                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-900 uppercase tracking-wider text-[11px]">
                        3. Project Expenses Breakdown (खर्चे: Material, Labour, Transport, Misc)
                      </span>
                      <span className="text-[11px] text-rose-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                        Total Expense: {formatINR(totExp)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Material Cost (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={editingSite.materialCost || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, materialCost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Labour Cost (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={editingSite.labourCost || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, labourCost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Transport Cost (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={editingSite.transportCost || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, transportCost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Misc Cost (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={editingSite.miscCost || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, miscCost: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Payment Collection & Pending */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-900 uppercase tracking-wider text-[11px]">
                        4. Payment Collection Tracking (प्राप्त व बकाया भुगतान)
                      </span>
                      <span className="text-[11px] text-amber-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                        Amount Pending: {formatINR(pending)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Amount Received (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={editingSite.amountReceived || ''}
                          onChange={(e) => setEditingSite({ ...editingSite, amountReceived: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Amount Pending (₹ - Auto Calculated)</label>
                        <input
                          type="text"
                          disabled
                          value={formatINR(pending)}
                          className="w-full px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Live Profit & Loss Preview Ledger Strip */}
                  <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-md space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-200 uppercase tracking-wider">
                        ⚡ Realtime Financial Calculation (लाइव प्रॉफिट / लॉस लेजर)
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${
                        profit >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {profit >= 0 ? `PROFIT: +${formatINR(profit)} (${profitMargin.toFixed(2)}%)` : `LOSS: ${formatINR(profit)} (${profitMargin.toFixed(2)}%)`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-blue-200 block font-sans">Total Income</span>
                        <span className="text-xs font-bold text-white">{formatINR(calcIncome)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-rose-200 block font-sans">Total Expense</span>
                        <span className="text-xs font-bold text-rose-300">{formatINR(totExp)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-emerald-200 block font-sans">Amount Received</span>
                        <span className="text-xs font-bold text-emerald-300">{formatINR(rec)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-amber-200 block font-sans">Amount Pending</span>
                        <span className="text-xs font-bold text-amber-300">{formatINR(pending)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 6. Dates & Remarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Start Date</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formatForDateInput(editingSite.startDate)}
                          onChange={(e) => setEditingSite({ ...editingSite, startDate: e.target.value })}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Completion Date</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formatForDateInput(editingSite.completionDate)}
                          onChange={(e) => setEditingSite({ ...editingSite, completionDate: e.target.value })}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Remarks / Notes</label>
                    <textarea
                      rows="2"
                      value={editingSite.remarks || editingSite.notes || ''}
                      onChange={(e) => setEditingSite({ ...editingSite, remarks: e.target.value, notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-blue-500"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowEditSiteModal(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider shadow-lg shadow-blue-600/25 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODAL: ADD EXPENSE ENTRY (FULL MANUAL DATA ENTRY & LIVE COMPUTATION) */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white border-2 border-rose-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-rose-600" />
                  <span>Record New Site Expense Entry (खर्च प्रविष्टि)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter manual site expenses for Material, Labour, Transport, or Misc with rate and vendor tracking
                </p>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const q = Number(newExpenseForm.qty) || 1;
              const rate = Number(newExpenseForm.rate) || 0;
              const totalAmount = Number(newExpenseForm.amount) > 0 ? Number(newExpenseForm.amount) : (q * rate);
              const targetSite = sites.find((s) => normSiteId(s.id) === normSiteId(newExpenseForm.siteId));

              return (
                <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
                  {/* 1. Site & Vendor Details */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      1. Site & Vendor Information (साइट व वेंडर विवरण)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Expense ID (Auto/Manual)</label>
                        <input
                          type="text"
                          placeholder={`e.g. EXP-${String(expenses.length + 1).padStart(3, '0')}`}
                          value={newExpenseForm.id}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, id: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-700 font-bold block">Select Project Site *</label>
                          {subTab === 'all_in_one' && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-amber-600" /> Locked to Selected Site
                            </span>
                          )}
                        </div>
                        {subTab === 'all_in_one' ? (
                          <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-800 font-bold flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-2 truncate">
                              <Building className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="truncate">
                                {(() => {
                                  const matched = sites.find((s) => normSiteId(s.id) === normSiteId(newExpenseForm.siteId));
                                  return matched ? `👤 ${matched.customerName || matched.name} (🆔 ${matched.id})` : newExpenseForm.siteId;
                                })()}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded font-black shrink-0">
                              LOCKED
                            </span>
                          </div>
                        ) : (
                          <select
                            required
                            value={newExpenseForm.siteId}
                            onChange={(e) => setNewExpenseForm({ ...newExpenseForm, siteId: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:outline-none focus:border-rose-500 cursor-pointer"
                          >
                            {sites.map((s) => (
                              <option key={s.id} value={s.id}>
                                #{s.id} - {s.customerName || s.name} ({s.capacity || '3kw'})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-rose-600" />
                          <span>Expense Date *</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={formatForDateInput(newExpenseForm.date)}
                            onChange={(e) => setNewExpenseForm({ ...newExpenseForm, date: e.target.value })}
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-rose-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Expense Category *</label>
                        <select
                          value={newExpenseForm.category}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, category: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                        >
                          <option value="Material">Material (सामग्री: Panels, Inverter, Wire)</option>
                          <option value="Labour">Labour (मजदूरी: Fitting, Structure, Electrician)</option>
                          <option value="Transport">Transport (किराया: Delivery, Freight)</option>
                          <option value="Misc">Misc (अन्य: Approvals, Consumables, Liasoning)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Sub-Category / Item Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Solar PV Panels / Structure / Delivery"
                          value={newExpenseForm.itemType}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, itemType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Vendor / Contractor / Person *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Sharma / Vendor Name"
                          value={newExpenseForm.vendor}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, vendor: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-rose-500 uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Quantity, Unit Rate & Expense Amount */}
                  <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-900 uppercase tracking-wider text-[11px]">
                        2. Expense Valuation & Pricing (खर्च की राशि एवं दर)
                      </span>
                      <span className="text-[11px] text-rose-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                        Total Amount: {formatINR(totalAmount)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={newExpenseForm.qty}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            const r = Number(newExpenseForm.rate) || 0;
                            setNewExpenseForm({
                              ...newExpenseForm,
                              qty: val,
                              amount: val * r
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Unit</label>
                        <input
                          type="text"
                          placeholder="e.g. NO / SET / MTR / TRIP"
                          value={newExpenseForm.unit}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, unit: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold uppercase focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Unit Rate (₹)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={newExpenseForm.rate}
                          onChange={(e) => {
                            const r = Number(e.target.value) || 0;
                            const val = Number(newExpenseForm.qty) || 1;
                            setNewExpenseForm({
                              ...newExpenseForm,
                              rate: r,
                              amount: val * r
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Total Expense Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newExpenseForm.amount}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, amount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 font-mono font-black text-sm focus:outline-none focus:bg-white focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Payment & Billing Details */}
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3">
                    <span className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] block">
                      3. Payment & Invoice Information (भुगतान एवं बिल विवरण)
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Payment Mode</label>
                        <select
                          value={newExpenseForm.paymentMode}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, paymentMode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                          <option value="NEFT/RTGS">NEFT / RTGS / IMPS</option>
                          <option value="Cash">Cash (नकद)</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Net Banking">Net Banking</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Payment Status</label>
                        <select
                          value={newExpenseForm.paymentStatus || 'Paid'}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, paymentStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Paid">Paid (भुगतान संपन्न)</option>
                          <option value="Pending">Pending (बकाया)</option>
                          <option value="Partial">Partial (आंशिक)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Bill / Invoice No.</label>
                        <input
                          type="text"
                          placeholder="e.g. INV-5693 or BILL-01"
                          value={newExpenseForm.billNo}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, billNo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Paid By (Person)</label>
                        <input
                          type="text"
                          placeholder="e.g. Accounts / Site Supervisor"
                          value={newExpenseForm.paidBy || ''}
                          onChange={(e) => setNewExpenseForm({ ...newExpenseForm, paidBy: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Live Expense Calculation Strip */}
                  <div className="p-4 bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white rounded-2xl shadow-md space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-200 uppercase tracking-wider">
                        ⚡ Realtime Voucher Calculation (लाइव वाउचर गणना)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-rose-500 text-white">
                        {formatINR(totalAmount)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono pt-1">
                      <span className="text-slate-300">
                        Site: <strong className="text-white">{targetSite ? (targetSite.customerName || targetSite.name) : newExpenseForm.siteId}</strong>
                      </span>
                      <span className="text-rose-200 text-[11px] italic">
                        {numberToWords(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* 5. Scope / Description & Remarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Description / Scope</label>
                      <input
                        type="text"
                        placeholder="e.g. Turnkey 3kW modules supply / Earthing rod"
                        value={newExpenseForm.description}
                        onChange={(e) => setNewExpenseForm({ ...newExpenseForm, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Remarks / Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Verified by project engineer"
                        value={newExpenseForm.remarks}
                        onChange={(e) => setNewExpenseForm({ ...newExpenseForm, remarks: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowAddExpenseModal(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-wider shadow-lg shadow-rose-600/25 cursor-pointer"
                    >
                      Save Expense Voucher
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal: Edit Expense Entry */}
      {showEditExpenseModal && editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white border-2 border-rose-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-rose-600" />
                  <span>Edit Expense Entry #{editingExpense.id}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Modify manual expense parameters, vendor, rate and payment status</p>
              </div>
              <button
                onClick={() => setShowEditExpenseModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const q = Number(editingExpense.qty) || 1;
              const rate = Number(editingExpense.rate) || 0;
              const totalAmount = Number(editingExpense.amount) > 0 ? Number(editingExpense.amount) : (q * rate);
              const targetSite = sites.find((s) => normSiteId(s.id) === normSiteId(editingExpense.siteId));

              return (
                <form onSubmit={handleEditExpenseSave} className="space-y-4 text-xs">
                  {/* 1. Site & Vendor Details */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      1. Site & Vendor Information
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Expense ID</label>
                        <input
                          type="text"
                          disabled
                          value={editingExpense.id}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-rose-800 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Site ID *</label>
                        <select
                          required
                          value={editingExpense.siteId}
                          onChange={(e) => setEditingExpense({ ...editingExpense, siteId: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:outline-none focus:border-rose-500 cursor-pointer"
                        >
                          {sites.map((s) => (
                            <option key={s.id} value={s.id}>
                              #{s.id} - {s.customerName || s.name} ({s.capacity || '3kw'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-rose-600" />
                          <span>Date *</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={formatForDateInput(editingExpense.date)}
                            onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-rose-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Expense Category *</label>
                        <select
                          value={editingExpense.category}
                          onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                        >
                          <option value="Material">Material (सामग्री)</option>
                          <option value="Labour">Labour (मजदूरी)</option>
                          <option value="Transport">Transport (किराया)</option>
                          <option value="Misc">Misc (अन्य)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Item / Scope Type</label>
                        <input
                          type="text"
                          value={editingExpense.itemType || ''}
                          onChange={(e) => setEditingExpense({ ...editingExpense, itemType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Vendor / Person *</label>
                        <input
                          type="text"
                          required
                          value={editingExpense.vendor || ''}
                          onChange={(e) => setEditingExpense({ ...editingExpense, vendor: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-rose-500 uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Pricing & Valuation */}
                  <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-900 uppercase tracking-wider text-[11px]">
                        2. Expense Valuation & Pricing
                      </span>
                      <span className="text-[11px] text-rose-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                        Total Amount: {formatINR(totalAmount)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={editingExpense.qty !== undefined ? editingExpense.qty : 1}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            const r = Number(editingExpense.rate) || 0;
                            setEditingExpense({
                              ...editingExpense,
                              qty: val,
                              amount: val * r
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Unit</label>
                        <input
                          type="text"
                          value={editingExpense.unit || 'NO'}
                          onChange={(e) => setEditingExpense({ ...editingExpense, unit: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold uppercase focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Unit Rate (₹)</label>
                        <input
                          type="number"
                          value={editingExpense.rate || ''}
                          onChange={(e) => {
                            const r = Number(e.target.value) || 0;
                            const val = Number(editingExpense.qty) || 1;
                            setEditingExpense({
                              ...editingExpense,
                              rate: r,
                              amount: val * r
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Total Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingExpense.amount}
                          onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 font-mono font-black text-sm focus:outline-none focus:bg-white focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Payment & Billing */}
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Payment Mode</label>
                        <select
                          value={editingExpense.paymentMode}
                          onChange={(e) => setEditingExpense({ ...editingExpense, paymentMode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="UPI">UPI</option>
                          <option value="NEFT/RTGS">NEFT/RTGS</option>
                          <option value="Cash">Cash</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Net Banking">Net Banking</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Payment Status</label>
                        <select
                          value={editingExpense.paymentStatus || 'Paid'}
                          onChange={(e) => setEditingExpense({ ...editingExpense, paymentStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Partial">Partial</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Bill / Invoice No.</label>
                        <input
                          type="text"
                          value={editingExpense.billNo || editingExpense.voucherNo || ''}
                          onChange={(e) => setEditingExpense({ ...editingExpense, billNo: e.target.value, voucherNo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Paid By</label>
                        <input
                          type="text"
                          value={editingExpense.paidBy || 'Accounts'}
                          onChange={(e) => setEditingExpense({ ...editingExpense, paidBy: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Description & Remarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Description</label>
                      <input
                        type="text"
                        value={editingExpense.description || ''}
                        onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Remarks</label>
                      <input
                        type="text"
                        value={editingExpense.remarks || ''}
                        onChange={(e) => setEditingExpense({ ...editingExpense, remarks: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowEditExpenseModal(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-wider shadow-lg shadow-rose-600/25 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: ADD PAYMENT ENTRY (FULL MANUAL DATA ENTRY & LIVE P&L COMPUTATION) */}
      {/* ========================================================================= */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white border-2 border-emerald-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Record New Payment Entry (भुगतान व रसीद प्रविष्टि)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter bank loan disbursement, customer margin or payment receipts with live remaining ledger
                </p>
              </div>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const targetSite = sites.find((s) => normSiteId(s.id) === normSiteId(newPaymentForm.siteId));
              const loan = Number(targetSite?.loanAmount) || 0;
              const margin = Number(targetSite?.customerMargin) || 0;
              const totIncome = (loan + margin) > 0 ? (loan + margin) : (Number(targetSite?.projectIncome) || Number(targetSite?.projectValue) || 0);

              const existingReceived = payments
                .filter(p => normSiteId(p.siteId) === normSiteId(newPaymentForm.siteId))
                .reduce((a, c) => a + (Number(c.amount) || 0), 0);
              const currentPayment = Number(newPaymentForm.amount) || 0;
              const newTotalReceived = existingReceived + currentPayment;
              const newPendingDue = Math.max(0, totIncome - newTotalReceived);

              return (
                <form onSubmit={handleAddPayment} className="space-y-4 text-xs">
                  {/* 1. Site & Payer Details */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      1. Site & Payer Information (साइट व भुगतानकर्ता विवरण)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Payment ID (Auto/Manual)</label>
                        <input
                          type="text"
                          placeholder={`e.g. PAY-${String(payments.length + 1).padStart(3, '0')}`}
                          value={newPaymentForm.id}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, id: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-700 font-bold block">Select Project Site *</label>
                          {subTab === 'all_in_one' && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-amber-600" /> Locked to Selected Site
                            </span>
                          )}
                        </div>
                        {subTab === 'all_in_one' ? (
                          <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-800 font-bold flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-2 truncate">
                              <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate">
                                {(() => {
                                  const matched = sites.find((s) => normSiteId(s.id) === normSiteId(newPaymentForm.siteId));
                                  return matched ? `👤 ${matched.customerName || matched.name} (🆔 ${matched.id})` : newPaymentForm.siteId;
                                })()}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-black shrink-0">
                              LOCKED
                            </span>
                          </div>
                        ) : (
                          <select
                            required
                            value={newPaymentForm.siteId}
                            onChange={(e) => {
                              const sid = e.target.value;
                              const matched = sites.find(s => normSiteId(s.id) === normSiteId(sid));
                              setNewPaymentForm({
                                ...newPaymentForm,
                                siteId: sid,
                                customerName: matched ? (matched.customerName || matched.name) : newPaymentForm.customerName
                              });
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            {sites.map((s) => (
                              <option key={s.id} value={s.id}>
                                #{s.id} - {s.customerName || s.name} ({s.capacity || '3kw'})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Customer / Payer Name</label>
                        <input
                          type="text"
                          placeholder="Enter Customer / Payer Name"
                          value={newPaymentForm.customerName}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, customerName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Receipt Date *</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={formatForDateInput(newPaymentForm.date)}
                            onChange={(e) => setNewPaymentForm({ ...newPaymentForm, date: e.target.value })}
                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Payment Category / Type *</label>
                        <select
                          value={newPaymentForm.paymentType}
                          onChange={(e) => {
                            const val = e.target.value;
                            const isLoanType = normCategory(val).includes('loan');
                            const stage = val === 'Loan - Disbursement 2' ? 'Disbursement 2' : 'Disbursement 1';
                            setNewPaymentForm({
                              ...newPaymentForm,
                              paymentType: val,
                              disbursementStage: isLoanType ? (newPaymentForm.disbursementStage || stage) : '',
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="Loan - Disbursement 1">Loan - Disbursement 1 (1st किश्त - Material Tranche)</option>
                          <option value="Loan - Disbursement 2">Loan - Disbursement 2 (2nd किश्त - Final Tranche)</option>
                          <option value="Customer Margin">Customer Margin (ग्राहक मार्जिन राशि)</option>
                          <option value="Customer Advance">Customer Advance (बुकिंग एडवांस)</option>
                          <option value="Milestone / Stage">Milestone / Stage Payment (चरणबद्ध भुगतान)</option>
                          <option value="Subsidy Receipt">Subsidy Receipt (सरकारी सब्सिडी रसीद)</option>
                          <option value="Final Settlement">Final Settlement (अंतिम निपटान)</option>
                          <option value="Other">Other Receipt</option>
                        </select>
                      </div>
                    </div>

                    {/* Dedicated Bank Loan Tranche Selector & Progress */}
                    {normCategory(newPaymentForm.paymentType).includes('loan') && (
                      <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 mt-2 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-blue-900 text-xs flex items-center gap-1.5">
                            🏦 Loan Disbursement Stage (बैंक लोन किश्त):
                          </span>
                          <span className="text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200">
                            Surya Ghar 2-Stage Loan
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                paymentType: 'Loan - Disbursement 1',
                                disbursementStage: 'Disbursement 1',
                              })
                            }
                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                              (newPaymentForm.disbursementStage === 'Disbursement 1' ||
                                (newPaymentForm.paymentType === 'Loan - Disbursement 1' &&
                                  newPaymentForm.disbursementStage !== 'Disbursement 2'))
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-100/50'
                            }`}
                          >
                            <span className="text-base">1️⃣</span>
                            <div className="text-left">
                              <div className="font-black">Disbursement 1</div>
                              <div className="text-[10px] font-normal opacity-90">1st किश्त (सामान डिस्पैच पर)</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setNewPaymentForm({
                                ...newPaymentForm,
                                paymentType: 'Loan - Disbursement 2',
                                disbursementStage: 'Disbursement 2',
                              })
                            }
                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                              newPaymentForm.disbursementStage === 'Disbursement 2' ||
                              newPaymentForm.paymentType === 'Loan - Disbursement 2'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                                : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100/50'
                            }`}
                          >
                            <span className="text-base">2️⃣</span>
                            <div className="text-left">
                              <div className="font-black">Disbursement 2</div>
                              <div className="text-[10px] font-normal opacity-90">2nd किश्त (मीटरिंग / कमिशनिंग)</div>
                            </div>
                          </button>
                        </div>

                        {targetSite && (
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/80 text-[10px]">
                            <div className="bg-white p-2 rounded-lg border border-blue-100">
                              <span className="text-slate-500 block font-semibold">Sanctioned Loan</span>
                              <strong className="text-blue-900 font-mono text-xs">{formatINR(loan)}</strong>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-blue-100">
                              <span className="text-slate-500 block font-semibold">Disb. 1 Received</span>
                              <strong className="text-blue-700 font-mono text-xs">
                                {formatINR(
                                  payments
                                    .filter(p => normSiteId(p.siteId) === normSiteId(newPaymentForm.siteId) && normCategory(p.paymentType).includes('loan') && (p.disbursementStage === 'Disbursement 1' || (!p.disbursementStage && !String(p.paymentType).includes('2'))))
                                    .reduce((a, c) => a + (Number(c.amount) || 0), 0)
                                )}
                              </strong>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-blue-100">
                              <span className="text-slate-500 block font-semibold">Disb. 2 Received</span>
                              <strong className="text-indigo-700 font-mono text-xs">
                                {formatINR(
                                  payments
                                    .filter(p => normSiteId(p.siteId) === normSiteId(newPaymentForm.siteId) && normCategory(p.paymentType).includes('loan') && (p.disbursementStage === 'Disbursement 2' || String(p.paymentType).includes('2')))
                                    .reduce((a, c) => a + (Number(c.amount) || 0), 0)
                                )}
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. Amount & Bank Details */}
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-900 uppercase tracking-wider text-[11px]">
                        2. Received Amount & Banking Transaction
                      </span>
                      <span className="text-[11px] text-emerald-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                        Amount Received: {formatINR(currentPayment)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Amount Received (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="Enter amount (₹)"
                          value={newPaymentForm.amount}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, amount: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-mono font-black text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Payment Mode *</label>
                        <select
                          value={newPaymentForm.paymentMode}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, paymentMode: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="NEFT/RTGS">NEFT / RTGS / IMPS</option>
                          <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                          <option value="Cash">Cash (नकद)</option>
                          <option value="Cheque">Cheque (चेक)</option>
                          <option value="Net Banking">Net Banking</option>
                          <option value="DD">Demand Draft (DD)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Bank / Branch Name</label>
                        <input
                          type="text"
                          placeholder="e.g. SBI / HDFC / PNB"
                          value={newPaymentForm.bankName}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, bankName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Transaction / UTR / Cheque Ref No.</label>
                        <input
                          type="text"
                          placeholder="e.g. UTR-99882244 or CHQ-001254"
                          value={newPaymentForm.refNo}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, refNo: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Received By (Officer / Cashier)</label>
                        <input
                          type="text"
                          placeholder="e.g. Accounts Dept. / Cashier"
                          value={newPaymentForm.receivedBy}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, receivedBy: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Live Payment Collection Strip */}
                  <div className="p-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-md space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-200 uppercase tracking-wider">
                        ⚡ Site Financial Ledger Impact (लाइव लेजर बैलेंस)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-500 text-white">
                        + {formatINR(currentPayment)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-blue-200 block font-sans">Project Value</span>
                        <span className="text-xs font-bold text-white">{formatINR(totIncome)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-emerald-200 block font-sans">Total Received</span>
                        <span className="text-xs font-bold text-emerald-300">{formatINR(newTotalReceived)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-amber-200 block font-sans">New Balance Due</span>
                        <span className="text-xs font-bold text-amber-300">{formatINR(newPendingDue)}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-200 text-right italic font-mono pt-1">
                      {numberToWords(currentPayment)}
                    </p>
                  </div>

                  {/* 4. Remarks */}
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Remarks / Payment Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Credited via NEFT from Bank towards Solar Loan"
                      value={newPaymentForm.remarks}
                      onChange={(e) => setNewPaymentForm({ ...newPaymentForm, remarks: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowAddPaymentModal(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider shadow-lg shadow-emerald-600/25 cursor-pointer"
                    >
                      Save Payment Entry
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal: Edit Payment Entry */}
      {showEditPaymentModal && editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white border-2 border-emerald-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-emerald-600" />
                  <span>Edit Payment Entry #{editingPayment.id}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Modify payment type, amount, mode, or reference info</p>
              </div>
              <button
                onClick={() => setShowEditPaymentModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditPaymentSave} className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Payment ID</label>
                    <input
                      type="text"
                      disabled
                      value={editingPayment.id}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-emerald-800 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Site ID *</label>
                    <select
                      required
                      value={editingPayment.siteId}
                      onChange={(e) => setEditingPayment({ ...editingPayment, siteId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {sites.map((s) => (
                        <option key={s.id} value={s.id}>
                          #{s.id} - {s.customerName || s.name} ({s.capacity || '3kw'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Customer / Payer</label>
                    <input
                      type="text"
                      value={editingPayment.customerName || editingPayment.payerName || ''}
                      onChange={(e) => setEditingPayment({ ...editingPayment, customerName: e.target.value, payerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Date *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={formatForDateInput(editingPayment.date)}
                        onChange={(e) => setEditingPayment({ ...editingPayment, date: e.target.value })}
                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Payment Type *</label>
                    <select
                      value={editingPayment.paymentType}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isLoanType = normCategory(val).includes('loan');
                        const stage = val === 'Loan - Disbursement 2' ? 'Disbursement 2' : 'Disbursement 1';
                        setEditingPayment({
                          ...editingPayment,
                          paymentType: val,
                          disbursementStage: isLoanType ? (editingPayment.disbursementStage || stage) : '',
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Loan - Disbursement 1">Loan - Disbursement 1 (1st किश्त)</option>
                      <option value="Loan - Disbursement 2">Loan - Disbursement 2 (2nd किश्त)</option>
                      <option value="Customer Margin">Customer Margin (ग्राहक मार्जिन)</option>
                      <option value="Customer Advance">Customer Advance (एडवांस)</option>
                      <option value="Milestone / Stage">Milestone / Stage (चरणबद्ध)</option>
                      <option value="Subsidy Receipt">Subsidy Receipt (सब्सिडी)</option>
                      <option value="Final Settlement">Final Settlement (अंतिम निपटान)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Dedicated Bank Loan Tranche Selector for Edit */}
                {normCategory(editingPayment.paymentType).includes('loan') && (
                  <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 mt-2 space-y-2.5">
                    <span className="font-black text-blue-900 text-xs block">
                      🏦 Bank Loan Tranche (लोन किश्त चयन):
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPayment({
                            ...editingPayment,
                            paymentType: 'Loan - Disbursement 1',
                            disbursementStage: 'Disbursement 1',
                          })
                        }
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                          (editingPayment.disbursementStage === 'Disbursement 1' ||
                            (editingPayment.paymentType === 'Loan - Disbursement 1' &&
                              editingPayment.disbursementStage !== 'Disbursement 2'))
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                            : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-100/50'
                        }`}
                      >
                        <span className="text-base">1️⃣</span>
                        <div className="text-left">
                          <div className="font-black">Disbursement 1</div>
                          <div className="text-[10px] font-normal opacity-90">1st किश्त (Material Tranche)</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingPayment({
                            ...editingPayment,
                            paymentType: 'Loan - Disbursement 2',
                            disbursementStage: 'Disbursement 2',
                          })
                        }
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                          editingPayment.disbursementStage === 'Disbursement 2' ||
                          editingPayment.paymentType === 'Loan - Disbursement 2'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                            : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-100/50'
                        }`}
                      >
                        <span className="text-base">2️⃣</span>
                        <div className="text-left">
                          <div className="font-black">Disbursement 2</div>
                          <div className="text-[10px] font-normal opacity-90">2nd किश्त (Commissioning Tranche)</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Amount Received (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingPayment.amount}
                      onChange={(e) => setEditingPayment({ ...editingPayment, amount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-mono font-black text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Payment Mode *</label>
                    <select
                      value={editingPayment.paymentMode || editingPayment.mode}
                      onChange={(e) => setEditingPayment({ ...editingPayment, paymentMode: e.target.value, mode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="NEFT/RTGS">NEFT/RTGS</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="DD">Demand Draft (DD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={editingPayment.bankName || ''}
                      onChange={(e) => setEditingPayment({ ...editingPayment, bankName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Reference No. (UTR / Cheque)</label>
                    <input
                      type="text"
                      value={editingPayment.refNo || editingPayment.referenceNo || ''}
                      onChange={(e) => setEditingPayment({ ...editingPayment, refNo: e.target.value, referenceNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Received By</label>
                    <input
                      type="text"
                      value={editingPayment.receivedBy || 'Accounts Dept.'}
                      onChange={(e) => setEditingPayment({ ...editingPayment, receivedBy: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Remarks / Notes</label>
                <input
                  type="text"
                  value={editingPayment.remarks || editingPayment.notes || ''}
                  onChange={(e) => setEditingPayment({ ...editingPayment, remarks: e.target.value, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEditPaymentModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider shadow-lg shadow-emerald-600/25 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: ADD MATERIAL BUDGET ITEM (FULL MANUAL ENTRY & REALTIME VARIANCE) */}
      {/* ========================================================================= */}
      {showAddBudgetItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white border-2 border-indigo-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <span>Record New Material Budget & BOQ Item (सामग्री बजट प्रविष्टि)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter site-wise equipment specifications, budget rates, actual procurement cost and variance
                </p>
              </div>
              <button
                onClick={() => setShowAddBudgetItemModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const q = Number(newBudgetItemForm.qty) || 1;
              const bRate = Number(newBudgetItemForm.budgetRate) || 0;
              const bAmt = Number(newBudgetItemForm.budgetAmount) > 0 ? Number(newBudgetItemForm.budgetAmount) : (q * bRate);
              const aRate = Number(newBudgetItemForm.actualRate) || 0;
              const aAmt = Number(newBudgetItemForm.actualAmount) > 0 ? Number(newBudgetItemForm.actualAmount) : (q * aRate);
              const variance = bAmt - aAmt;
              const variancePercent = bAmt > 0 ? ((variance / bAmt) * 100) : 0;

              return (
                <form onSubmit={handleAddBudgetItem} className="space-y-4 text-xs">
                  {/* 1. Equipment & Site Details */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                      1. Equipment & Site Specifications (उपकरण एवं साइट विवरण)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Budget Item ID (Auto/Manual)</label>
                        <input
                          type="text"
                          placeholder={`e.g. BOQ-${String(budgets.length + 1).padStart(3, '0')}`}
                          value={newBudgetItemForm.id}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, id: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-700 font-bold block">Select Project Site *</label>
                          {subTab === 'all_in_one' && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-amber-600" /> Locked to Selected Site
                            </span>
                          )}
                        </div>
                        {subTab === 'all_in_one' ? (
                          <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border-2 border-slate-300 text-slate-800 font-bold flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-2 truncate">
                              <Building className="w-4 h-4 text-indigo-600 shrink-0" />
                              <span className="truncate">
                                {(() => {
                                  const matched = sites.find((s) => normSiteId(s.id) === normSiteId(newBudgetItemForm.siteId));
                                  return matched ? `👤 ${matched.customerName || matched.name} (🆔 ${matched.id})` : newBudgetItemForm.siteId;
                                })()}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded font-black shrink-0">
                              LOCKED
                            </span>
                          </div>
                        ) : (
                          <select
                            required
                            value={newBudgetItemForm.siteId}
                            onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, siteId: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            {sites.map((s) => (
                              <option key={s.id} value={s.id}>
                                #{s.id} - {s.customerName || s.name} ({s.capacity || '3kw'})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Material Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Solar PV Panels / Inverter"
                          value={newBudgetItemForm.material}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, material: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Category</label>
                        <select
                          value={newBudgetItemForm.category || 'Solar Modules'}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, category: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="Solar Modules">Solar Modules (PV Panels)</option>
                          <option value="Inverter">Solar Inverter & Protection</option>
                          <option value="Structure (GI)">Structure Hardware & GI</option>
                          <option value="Electrical & Wiring">AC/DC Cables & Earthing</option>
                          <option value="Net Meter & Liaison">Net Metering & Approvals</option>
                          <option value="Safety & BOS">Safety & BOS Accessories</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Brand / Make *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tata / Adani / Waree / Luminous"
                          value={newBudgetItemForm.brand}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, brand: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold uppercase focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Technical Specification</label>
                        <input
                          type="text"
                          placeholder="e.g. 540W Mono PERC Half-Cut / 3kW IP65"
                          value={newBudgetItemForm.specification}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, specification: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Quantity & Budget Estimates */}
                  <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-indigo-900 uppercase tracking-wider text-[11px]">
                        2. Quantity & Budget Estimates (अनुमानित बजट लागत)
                      </span>
                      <span className="text-[11px] text-indigo-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                        Total Budget: {formatINR(bAmt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Quantity *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={newBudgetItemForm.qty}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            const r = Number(newBudgetItemForm.budgetRate) || 0;
                            const ar = Number(newBudgetItemForm.actualRate) || 0;
                            setNewBudgetItemForm({
                              ...newBudgetItemForm,
                              qty: val,
                              budgetAmount: val * r,
                              actualAmount: ar > 0 ? val * ar : newBudgetItemForm.actualAmount
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Unit *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. NO / SET / MTR / LOT"
                          value={newBudgetItemForm.unit}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, unit: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold uppercase focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Budget Rate (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="Enter rate (₹)"
                          value={newBudgetItemForm.budgetRate}
                          onChange={(e) => {
                            const r = Number(e.target.value) || 0;
                            const val = Number(newBudgetItemForm.qty) || 1;
                            setNewBudgetItemForm({
                              ...newBudgetItemForm,
                              budgetRate: r,
                              budgetAmount: val * r
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Total Budget Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newBudgetItemForm.budgetAmount}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, budgetAmount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-900 font-mono font-black text-sm focus:outline-none focus:bg-white focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Actual Procurement & Supplier */}
                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-900 uppercase tracking-wider text-[11px]">
                        3. Actual Procurement Costs & Vendor
                      </span>
                      <span className="text-[11px] text-rose-800 font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                        Actual Cost: {formatINR(aAmt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Actual Rate (₹)</label>
                        <input
                          type="number"
                          placeholder="Enter actual rate (₹)"
                          value={newBudgetItemForm.actualRate}
                          onChange={(e) => {
                            const ar = Number(e.target.value) || 0;
                            const val = Number(newBudgetItemForm.qty) || 1;
                            setNewBudgetItemForm({
                              ...newBudgetItemForm,
                              actualRate: ar,
                              actualAmount: val * ar
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Actual Total Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newBudgetItemForm.actualAmount}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, actualAmount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-rose-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Procurement Status</label>
                        <select
                          value={newBudgetItemForm.procurementStatus || 'Delivered on Site'}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, procurementStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                        >
                          <option value="Delivered on Site">Delivered on Site (साइट पर उपलब्ध)</option>
                          <option value="Ordered / In-Transit">Ordered / In-Transit (ऑर्डर किया गया)</option>
                          <option value="Installed & Verified">Installed & Verified (स्थापित)</option>
                          <option value="Planned">Planned (योजनाबद्ध)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Supplier / Vendor</label>
                        <input
                          type="text"
                          placeholder="e.g. Waaree Energies Ltd"
                          value={newBudgetItemForm.supplier || ''}
                          onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, supplier: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Live Variance Preview Strip */}
                  <div className="p-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl shadow-md space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-200 uppercase tracking-wider">
                        ⚡ Realtime BOQ Variance Calculation (बजट vs वास्तविक विचलन)
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${
                        variance >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {variance >= 0 ? `SAVING: +${formatINR(variance)} (${variancePercent.toFixed(1)}%)` : `OVERRUN: ${formatINR(variance)} (${variancePercent.toFixed(1)}%)`}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-blue-200 block font-sans">Budget Cost</span>
                        <span className="text-xs font-bold text-white">{formatINR(bAmt)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-rose-200 block font-sans">Actual Cost</span>
                        <span className="text-xs font-bold text-rose-300">{formatINR(aAmt)}</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-[10px] text-emerald-200 block font-sans">Net Variance</span>
                        <span className={`text-xs font-bold ${variance >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                          {formatINR(variance)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Remarks */}
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Remarks / Specification Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Turnkey 3kW on-grid package with 25 year warranty"
                      value={newBudgetItemForm.remarks}
                      onChange={(e) => setNewBudgetItemForm({ ...newBudgetItemForm, remarks: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowAddBudgetItemModal(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider shadow-lg shadow-indigo-600/25 cursor-pointer"
                    >
                      Save Budget Item
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal: Edit Material Budget Item */}
      {showEditBudgetItemModal && editingBudgetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white border-2 border-indigo-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-indigo-600" />
                  <span>Edit Material Budget #{editingBudgetItem.id}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Modify rates, quantities, brand or actual procurement costs</p>
              </div>
              <button
                onClick={() => setShowEditBudgetItemModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const q = Number(editingBudgetItem.qty) || 1;
              const bRate = Number(editingBudgetItem.budgetRate) || 0;
              const bAmt = Number(editingBudgetItem.budgetAmount) > 0 ? Number(editingBudgetItem.budgetAmount) : (q * bRate);
              const aRate = Number(editingBudgetItem.actualRate) || 0;
              const aAmt = Number(editingBudgetItem.actualAmount) > 0 ? Number(editingBudgetItem.actualAmount) : (q * aRate);
              const variance = bAmt - aAmt;

              return (
                <form onSubmit={handleEditBudgetItemSave} className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Budget ID</label>
                        <input
                          type="text"
                          disabled
                          value={editingBudgetItem.id}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-indigo-800 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Site ID *</label>
                        <select
                          required
                          value={editingBudgetItem.siteId}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, siteId: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {sites.map((s) => (
                            <option key={s.id} value={s.id}>
                              #{s.id} - {s.customerName || s.name} ({s.capacity || '3kw'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Material Name *</label>
                        <input
                          type="text"
                          required
                          value={editingBudgetItem.material}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, material: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Brand / Make *</label>
                        <input
                          type="text"
                          required
                          value={editingBudgetItem.brand}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, brand: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold uppercase focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Category</label>
                        <select
                          value={editingBudgetItem.category || 'Solar Modules'}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, category: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="Solar Modules">Solar Modules</option>
                          <option value="Inverter">Inverter</option>
                          <option value="Structure (GI)">Structure (GI)</option>
                          <option value="Electrical & Wiring">Electrical & Wiring</option>
                          <option value="Net Meter & Liaison">Net Meter & Liaison</option>
                          <option value="Safety & BOS">Safety & BOS</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Specification</label>
                        <input
                          type="text"
                          value={editingBudgetItem.specification || ''}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, specification: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Quantity *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={editingBudgetItem.qty}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            const r = Number(editingBudgetItem.budgetRate) || 0;
                            const ar = Number(editingBudgetItem.actualRate) || 0;
                            setEditingBudgetItem({
                              ...editingBudgetItem,
                              qty: val,
                              budgetAmount: val * r,
                              actualAmount: ar > 0 ? val * ar : editingBudgetItem.actualAmount
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Unit *</label>
                        <input
                          type="text"
                          required
                          value={editingBudgetItem.unit}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, unit: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold uppercase focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Budget Rate (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingBudgetItem.budgetRate}
                          onChange={(e) => {
                            const r = Number(e.target.value) || 0;
                            const val = Number(editingBudgetItem.qty) || 1;
                            setEditingBudgetItem({
                              ...editingBudgetItem,
                              budgetRate: r,
                              budgetAmount: val * r
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Budget Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingBudgetItem.budgetAmount}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, budgetAmount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-900 font-mono font-black text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Actual Rate (₹)</label>
                        <input
                          type="number"
                          value={editingBudgetItem.actualRate || ''}
                          onChange={(e) => {
                            const ar = Number(e.target.value) || 0;
                            const val = Number(editingBudgetItem.qty) || 1;
                            setEditingBudgetItem({
                              ...editingBudgetItem,
                              actualRate: ar,
                              actualAmount: val * ar
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Actual Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingBudgetItem.actualAmount}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, actualAmount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-rose-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Procurement Status</label>
                        <select
                          value={editingBudgetItem.procurementStatus || 'Delivered on Site'}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, procurementStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                        >
                          <option value="Delivered on Site">Delivered on Site</option>
                          <option value="Ordered / In-Transit">Ordered / In-Transit</option>
                          <option value="Installed & Verified">Installed & Verified</option>
                          <option value="Planned">Planned</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Supplier / Vendor</label>
                        <input
                          type="text"
                          value={editingBudgetItem.supplier || ''}
                          onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, supplier: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Remarks / Notes</label>
                    <input
                      type="text"
                      value={editingBudgetItem.remarks || ''}
                      onChange={(e) => setEditingBudgetItem({ ...editingBudgetItem, remarks: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowEditBudgetItemModal(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider shadow-lg shadow-indigo-600/25 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}
      {/* ============================================================ */}
      {/* 6. PRINTABLE MODAL 1: OFFICIAL SITE SETTLEMENT & P&L REPORT */}
      {/* ============================================================ */}
      {printingSite && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print-modal-container">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 relative print-modal-box font-['Outfit',sans-serif] space-y-6">
            {/* Action Bar (Hidden on Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                <Printer className="w-4 h-4 text-emerald-600" />
                <span>PRINT PREVIEW: SOLAR PROJECT SETTLEMENT SLIP</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintingSite(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Letterhead */}
            {(() => {
              const st = printingSite;
              const siteExpenses = expenses.filter((e) => normSiteId(e.siteId) === normSiteId(st.id));
              const sitePayments = payments.filter((p) => normSiteId(p.siteId) === normSiteId(st.id));
              const siteBudgets = budgets.filter((b) => normSiteId(b.siteId) === normSiteId(st.id));

              const matCost = siteExpenses.filter(e => normCategory(e.category) === 'material').reduce((a, c) => a + (Number(c.amount) || 0), 0);
              const labCost = siteExpenses.filter(e => normCategory(e.category) === 'labour').reduce((a, c) => a + (Number(c.amount) || 0), 0);
              const traCost = siteExpenses.filter(e => normCategory(e.category) === 'transport').reduce((a, c) => a + (Number(c.amount) || 0), 0);
              const misCost = siteExpenses.filter(e => normCategory(e.category) === 'misc').reduce((a, c) => a + (Number(c.amount) || 0), 0);
              const totExpense = matCost + labCost + traCost + misCost;

              const loan = Number(st.loanAmount) || 0;
              const margin = Number(st.customerMargin) || 0;
              const totIncome = (loan + margin) > 0 ? (loan + margin) : (Number(st.projectIncome) || Number(st.projectValue) || 0);
              const profit = totIncome - totExpense;
              const profitMargin = totIncome > 0 ? ((profit / totIncome) * 100) : 0;

              const totalReceived = sitePayments.reduce((a, c) => a + (Number(c.amount) || 0), 0);
              const totalPending = totIncome - totalReceived;

              return (
                <div className="space-y-5 text-slate-800">
                  {/* Company Header with Official Website Logo & Brand Styling */}
                  <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={p24Logo} alt="POWER24 Logo" className="h-12 w-auto object-contain" />
                      <div>
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                          <span className="text-[#d91478]">POWER</span>
                          <span className="text-[#16a34a]">24</span>{' '}
                          <span className="bg-gradient-to-r from-[#0284c7] via-[#16a34a] to-[#d91478] bg-clip-text text-transparent font-extrabold text-base sm:text-lg">
                            Solar Services Pvt Ltd
                          </span>
                        </h1>
                        <p className="text-[10px] text-slate-600 font-semibold mt-1">
                          Authorized Rooftop Solar Installation & EPC Partner • Gorakhpur HQ, Uttar Pradesh | Helpline: +91 94508 81224 | Web: www.power24.in
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs border-l-2 border-slate-200 pl-3">
                      <p className="font-bold text-slate-900">DATE: {new Date().toLocaleDateString('en-IN')}</p>
                      <p className="text-[11px] text-[#0284c7] font-black">SITE ID: #{st.id}</p>
                      <p className="text-[9px] text-slate-500 uppercase">OFFICIAL DOSSIER</p>
                    </div>
                  </div>

                  {/* Report Title */}
                  <div className="text-center bg-gradient-to-r from-[#0f172a] via-[#0284c7] to-[#16a34a] text-white py-2 rounded-lg font-black text-xs uppercase tracking-wider font-mono shadow-sm">
                    SOLAR PROJECT SETTLEMENT & PROFIT / LOSS SUMMARY STATEMENT
                  </div>

                  {/* Customer & Site Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer Name</span>
                      <span className="font-bold text-slate-900 font-sans text-sm">{st.customerName || st.clientName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact / Phone</span>
                      <span className="font-mono text-slate-800">{st.customerPhone || st.phone || st.contact || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Site Location / District</span>
                      <span className="font-bold text-slate-900">{st.siteAddress || st.district || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Solar Capacity</span>
                      <span className="font-black text-[#0284c7] font-mono text-sm">{st.capacity || '-'} kW</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Consumer / CA No.</span>
                      <span className="font-mono text-slate-700">{st.consumerNumber || st.caNumber || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">DISCOM / Grid</span>
                      <span className="font-mono text-slate-700">{st.discom || 'UPPCL'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Site Status</span>
                      <span className="font-black text-[#16a34a] uppercase">{st.siteStatus || st.status || 'Running'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Project Date Range</span>
                      <span className="font-mono text-slate-700">{st.startDate || '-'} → {st.completionDate || 'Ongoing'}</span>
                    </div>
                    {(st.remarks || st.notes) && (
                      <div className="col-span-2 sm:col-span-4 border-t border-slate-200 pt-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Project Notes / Remarks:</span>
                        <span className="text-slate-700 text-[11px] italic">{st.remarks || st.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* 2-Column Inflow vs Outflow Ledger */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Project Inflow */}
                    <div className="border border-blue-200 rounded-xl overflow-hidden text-xs">
                      <div className="bg-[#0284c7] text-white font-black px-3.5 py-2 uppercase text-[11px] tracking-wider flex items-center justify-between">
                        <span>1. Project Inflow (Revenue)</span>
                        <span className="font-mono text-[10px] opacity-90">CREDIT LEDGER</span>
                      </div>
                      <div className="divide-y divide-slate-100 p-3 bg-white space-y-1.5 font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Project Quoted Value:</span>
                          <span className="font-mono font-bold text-slate-900">{formatINR(st.projectValue || 0)}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Bank Loan Component:</span>
                          <span className="font-mono font-bold text-slate-900">{formatINR(loan)}</span>
                        </div>
                        {loan > 0 && (
                          <div className="pl-3 text-[10px] space-y-0.5 text-slate-500 font-mono bg-blue-50/50 p-1.5 rounded-lg border border-blue-100">
                            <div className="flex justify-between">
                              <span className="text-slate-700">• Tranche 1 (Disb. 1 - 1st किश्त):</span>
                              <span className="text-[#0284c7] font-bold">{formatINR(
                                sitePayments.filter(p => normCategory(p.paymentType).includes('loan') && (p.disbursementStage === 'Disbursement 1' || (!p.disbursementStage && !String(p.paymentType).includes('2')))).reduce((a, c) => a + (Number(c.amount) || 0), 0)
                              )}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-700">• Tranche 2 (Disb. 2 - 2nd किश्त):</span>
                              <span className="text-indigo-800 font-bold">{formatINR(
                                sitePayments.filter(p => normCategory(p.paymentType).includes('loan') && (p.disbursementStage === 'Disbursement 2' || String(p.paymentType).includes('2'))).reduce((a, c) => a + (Number(c.amount) || 0), 0)
                              )}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Customer Margin Amount:</span>
                          <span className="font-mono font-bold text-slate-900">{formatINR(margin)}</span>
                        </div>
                        <div className="flex justify-between pt-1 font-black bg-blue-50 p-2 rounded text-blue-950">
                          <span>TOTAL PROJECT INCOME:</span>
                          <span className="font-mono text-sm">{formatINR(totIncome)}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono italic">
                          ({numberToWords(totIncome)})
                        </p>
                      </div>
                    </div>

                    {/* Right: Project Outflow */}
                    <div className="border border-rose-200 rounded-xl overflow-hidden text-xs">
                      <div className="bg-[#d91478] text-white font-black px-3.5 py-2 uppercase text-[11px] tracking-wider flex items-center justify-between">
                        <span>2. Cost Outflow (Incurred Expenses)</span>
                        <span className="font-mono text-[10px] opacity-90">DEBIT LEDGER</span>
                      </div>
                      <div className="divide-y divide-slate-100 p-3 bg-white space-y-1.5 font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Material Cost (Panels/Inverter):</span>
                          <span className="font-mono font-bold text-slate-900">{formatINR(matCost)}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Labour & Installation Cost:</span>
                          <span className="font-mono font-bold text-slate-900">{formatINR(labCost)}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Transport & Freight:</span>
                          <span className="font-mono font-bold text-slate-900">{formatINR(traCost)}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-600">Misc & Statutory Approvals:</span>
                          <span className="font-mono font-bold text-slate-900">{formatINR(misCost)}</span>
                        </div>
                        <div className="flex justify-between pt-1 font-black bg-rose-50 p-2 rounded text-rose-950">
                          <span>TOTAL INCURRED EXPENSES:</span>
                          <span className="font-mono text-sm">{formatINR(totExpense)}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono italic">
                          ({numberToWords(totExpense)})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Net Financial Position Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 text-white p-4 rounded-xl text-xs font-mono shadow-md">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">NET PROFIT / LOSS</span>
                      <span className={`text-base sm:text-lg font-black ${profit >= 0 ? 'text-[#16a34a]' : 'text-[#d91478]'}`}>
                        {formatINR(profit)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">PROFIT MARGIN</span>
                      <span className="text-base sm:text-lg font-black text-sky-300">
                        {profitMargin.toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">TOTAL RECEIVED</span>
                      <span className="text-base sm:text-lg font-black text-[#16a34a]">
                        {formatINR(totalReceived)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">PENDING / DUE</span>
                      <span className={`text-base sm:text-lg font-black ${totalPending > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {formatINR(totalPending)}
                      </span>
                    </div>
                  </div>

                  {/* Date-wise Vouchers & Receipts Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                    {/* Vouchers Table */}
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                      <span className="font-black text-slate-800 uppercase block flex items-center justify-between">
                        <span>Expense Vouchers Logged ({siteExpenses.length})</span>
                        <span className="text-[10px] font-mono text-rose-700">Total: {formatINR(totExpense)}</span>
                      </span>
                      {siteExpenses.length === 0 ? (
                        <p className="text-slate-400 italic">No expense vouchers recorded for this site.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="border-b border-slate-200 text-slate-500 font-bold">
                              <tr>
                                <th className="pb-1">Date</th>
                                <th className="pb-1">Vendor/Item</th>
                                <th className="pb-1">Cat</th>
                                <th className="pb-1 text-right">Amt</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {siteExpenses.slice(0, 6).map((e, i) => (
                                <tr key={i}>
                                  <td className="py-1 text-slate-600">{e.date || '-'}</td>
                                  <td className="py-1 font-bold text-slate-900 font-sans truncate max-w-[120px]">{e.vendor || e.description}</td>
                                  <td className="py-1 text-slate-600">{e.category}</td>
                                  <td className="py-1 text-right font-bold text-rose-600">{formatINR(e.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Receipts Table */}
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                      <span className="font-black text-slate-800 uppercase block flex items-center justify-between">
                        <span>Payment Receipts Logged ({sitePayments.length})</span>
                        <span className="text-[10px] font-mono text-emerald-700">Total: {formatINR(totalReceived)}</span>
                      </span>
                      {sitePayments.length === 0 ? (
                        <p className="text-slate-400 italic">No payment receipts recorded for this site.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="border-b border-slate-200 text-slate-500 font-bold">
                              <tr>
                                <th className="pb-1">Date</th>
                                <th className="pb-1">Type</th>
                                <th className="pb-1">Mode</th>
                                <th className="pb-1 text-right">Amt</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {sitePayments.slice(0, 6).map((p, i) => (
                                <tr key={i}>
                                  <td className="py-1 text-slate-600">{p.date || '-'}</td>
                                  <td className="py-1 font-bold text-slate-900 font-sans">
                                    {p.disbursementStage ? `Loan (${p.disbursementStage === 'Disbursement 2' ? 'Disb 2' : 'Disb 1'})` : (p.paymentType || 'Receipt')}
                                  </td>
                                  <td className="py-1 text-slate-600">{p.paymentMode}</td>
                                  <td className="py-1 text-right font-bold text-emerald-600">{formatINR(p.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Official Authorization Signatures Block */}
                  <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-4 gap-4 text-center text-xs">
                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-slate-700">
                        {st.customerName || 'Customer'}
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Customer Acceptance</span>
                    </div>

                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-slate-700">
                        Solar Project Eng.
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Site Engineer</span>
                    </div>

                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-slate-700">
                        Accounts Dept.
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Verified By</span>
                    </div>

                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-[#0284c7]">
                        POWER24 Signatory
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Authorized Signatory</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. PRINTABLE MODAL 2: EXPENSE PAYMENT VOUCHER SLIP */}
      {/* ============================================================ */}
      {printingExpense && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print-modal-container">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 relative print-modal-box font-['Outfit',sans-serif] space-y-6">
            {/* Action Bar (Hidden on Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
              <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
                <Printer className="w-4 h-4 text-rose-600" />
                <span>PRINT PREVIEW: OFFICIAL PAYMENT EXPENSE VOUCHER</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-md shadow-rose-700/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintingExpense(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Voucher Body */}
            {(() => {
              const exp = printingExpense;
              const targetSite = sites.find(s => normSiteId(s.id) === normSiteId(exp.siteId));

              return (
                <div className="space-y-5 text-slate-800">
                  {/* Company Header with Official Website Logo & Brand Styling */}
                  <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={p24Logo} alt="POWER24 Logo" className="h-11 w-auto object-contain" />
                      <div>
                        <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none">
                          <span className="text-[#d91478]">POWER</span>
                          <span className="text-[#16a34a]">24</span>{' '}
                          <span className="bg-gradient-to-r from-[#0284c7] via-[#16a34a] to-[#d91478] bg-clip-text text-transparent font-extrabold text-sm sm:text-base">
                            Solar Services Pvt Ltd
                          </span>
                        </h1>
                        <p className="text-[10px] text-slate-600 font-semibold mt-1">
                          Gorakhpur HQ, Uttar Pradesh | Helpline: +91 94508 81224 | Web: www.power24.in
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs border-l-2 border-slate-200 pl-3">
                      <p className="font-bold text-slate-900">DATE: {exp.date || new Date().toLocaleDateString('en-IN')}</p>
                      <p className="text-[10px] text-rose-600 font-black">VOUCHER NO: #{exp.id || '-'}</p>
                    </div>
                  </div>

                  {/* Title Banner */}
                  <div className="text-center bg-rose-800 text-white py-2 rounded-lg font-black text-xs uppercase tracking-wider font-mono">
                    PAYMENT EXPENSE VOUCHER (DEBIT SLIP)
                  </div>

                  {/* Voucher Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Site ID</span>
                      <span className="font-bold text-blue-900 font-mono text-sm">{exp.siteId || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Site / Project Name</span>
                      <span className="font-bold text-slate-900">{targetSite ? (targetSite.customerName || targetSite.name) : '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Expense Category</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 border border-rose-300">
                        {exp.category || 'Material'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Paid To (Vendor / Person)</span>
                      <span className="font-bold text-slate-900 uppercase">{exp.vendor || exp.vendorPerson || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Mode</span>
                      <span className="font-bold text-slate-800">{exp.paymentMode || 'UPI'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Bill / Voucher Ref No.</span>
                      <span className="font-mono text-slate-700">{exp.billNo || exp.voucherNo || '-'}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Nature / Description of Expense</span>
                      <p className="text-slate-800 font-medium text-xs mt-0.5">{exp.description || '-'}</p>
                    </div>
                  </div>

                  {/* Amount Box */}
                  <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-rose-900 uppercase block">Amount Paid (in Figures)</span>
                      <span className="text-2xl font-black text-rose-700 font-mono">{formatINR(exp.amount)}</span>
                    </div>
                    <div className="text-right max-w-xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Amount in Words</span>
                      <span className="text-xs font-bold text-slate-800 italic font-mono">{numberToWords(exp.amount)}</span>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs">
                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-slate-700">
                        Prepared By
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Accountant</span>
                    </div>

                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-slate-700">
                        Verified & Approved
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Project Manager</span>
                    </div>

                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-slate-700">
                        {exp.vendor || 'Receiver'}
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Receiver's Signature</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. PRINTABLE MODAL 3: PAYMENT MONEY RECEIPT SLIP */}
      {/* ============================================================ */}
      {printingPayment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print-modal-container">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 relative print-modal-box font-['Outfit',sans-serif] space-y-6">
            {/* Action Bar (Hidden on Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <Printer className="w-4 h-4 text-emerald-600" />
                <span>PRINT PREVIEW: OFFICIAL MONEY RECEIPT SLIP</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintingPayment(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Receipt Body */}
            {(() => {
              const pay = printingPayment;
              const targetSite = sites.find(s => normSiteId(s.id) === normSiteId(pay.siteId));
              const sitePayments = payments.filter(p => normSiteId(p.siteId) === normSiteId(pay.siteId));
              const totalRecSite = sitePayments.reduce((a, c) => a + (Number(c.amount) || 0), 0);

              const loan = Number(targetSite?.loanAmount) || 0;
              const margin = Number(targetSite?.customerMargin) || 0;
              const totIncome = (loan + margin) > 0 ? (loan + margin) : (Number(targetSite?.projectIncome) || Number(targetSite?.projectValue) || 0);
              const pendingSite = Math.max(0, totIncome - totalRecSite);

              return (
                <div className="space-y-5 text-slate-800">
                  {/* Company Header with Official Website Logo & Brand Styling */}
                  <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={p24Logo} alt="POWER24 Logo" className="h-11 w-auto object-contain" />
                      <div>
                        <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none">
                          <span className="text-[#d91478]">POWER</span>
                          <span className="text-[#16a34a]">24</span>{' '}
                          <span className="bg-gradient-to-r from-[#0284c7] via-[#16a34a] to-[#d91478] bg-clip-text text-transparent font-extrabold text-sm sm:text-base">
                            Solar Services Pvt Ltd
                          </span>
                        </h1>
                        <p className="text-[10px] text-slate-600 font-semibold mt-1">
                          Gorakhpur HQ, Uttar Pradesh | Helpline: +91 94508 81224 | Web: www.power24.in
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs border-l-2 border-slate-200 pl-3">
                      <p className="font-bold text-slate-900">DATE: {pay.date || new Date().toLocaleDateString('en-IN')}</p>
                      <p className="text-[10px] text-emerald-700 font-black">RECEIPT NO: #{pay.id || '-'}</p>
                    </div>
                  </div>

                  {/* Title Banner */}
                  <div className="text-center bg-emerald-800 text-white py-2 rounded-lg font-black text-xs uppercase tracking-wider font-mono">
                    OFFICIAL MONEY RECEIPT / PAYMENT ACKNOWLEDGEMENT
                  </div>

                  {/* Receipt Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Site ID</span>
                      <span className="font-bold text-blue-900 font-mono text-sm">{pay.siteId || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Received With Thanks From</span>
                      <span className="font-bold text-slate-900">{targetSite ? (targetSite.customerName || targetSite.name) : (pay.customerName || '-')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Type / Tranche</span>
                      {(() => {
                        const isLoan = normCategory(pay.paymentType).includes('loan');
                        const isDisb2 = pay.disbursementStage === 'Disbursement 2' || String(pay.paymentType || '').toLowerCase().includes('disbursement 2') || String(pay.paymentType || '').toLowerCase().includes('disb 2');
                        if (isLoan) {
                          if (isDisb2) {
                            return (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-900 border border-indigo-300">
                                Bank Loan (Disbursement 2 - 2nd किश्त)
                              </span>
                            );
                          }
                          return (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-300">
                              Bank Loan (Disbursement 1 - 1st किश्त)
                            </span>
                          );
                        }
                        return (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {pay.paymentType || 'Receipt'}
                          </span>
                        );
                      })()}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Mode</span>
                      <span className="font-bold text-slate-800">{pay.paymentMode || pay.mode || 'NEFT/RTGS'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Transaction / UTR / Ref No.</span>
                      <span className="font-mono text-slate-700 font-bold">{pay.refNo || pay.referenceNo || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Remaining Balance Due</span>
                      <span className="font-mono text-amber-700 font-bold">{formatINR(pendingSite)}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Remarks / Notes</span>
                      <p className="text-slate-800 font-medium text-xs mt-0.5">{pay.remarks || pay.notes || '-'}</p>
                    </div>
                  </div>

                  {/* Amount Box */}
                  <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-900 uppercase block">Amount Received (in Figures)</span>
                      <span className="text-2xl font-black text-emerald-700 font-mono">{formatINR(pay.amount)}</span>
                    </div>
                    <div className="text-right max-w-xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Amount in Words</span>
                      <span className="text-xs font-bold text-slate-800 italic font-mono">{numberToWords(pay.amount)}</span>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs">
                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-slate-700">
                        Received By (Accounts)
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Cashier / Accountant</span>
                    </div>

                    <div className="space-y-8">
                      <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-blue-900">
                        POWER24 Signatory
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Authorized Signatory</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      {/* ============================================================ */}
      {/* 9. UNIVERSAL ACTION CONFIRMATION MODAL (DATA SAFETY POPUP) */}
      {/* ============================================================ */}
      {pendingConfirm && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['Outfit',sans-serif]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-slate-200 relative overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header / Brand Tag */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 ${
                  pendingConfirm.isDanger
                    ? 'bg-rose-600 shadow-rose-600/30'
                    : pendingConfirm.badgeColor === 'emerald'
                    ? 'bg-emerald-600 shadow-emerald-600/30'
                    : pendingConfirm.badgeColor === 'rose'
                    ? 'bg-[#d91478] shadow-[#d91478]/30'
                    : pendingConfirm.badgeColor === 'amber'
                    ? 'bg-amber-600 shadow-amber-600/30'
                    : 'bg-[#0284c7] shadow-[#0284c7]/30'
                }`}>
                  {pendingConfirm.isDanger ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {pendingConfirm.badgeText || 'Confirmation'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">POWER24 VERIFY</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-0.5 leading-tight">
                    {pendingConfirm.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtitle / Notice */}
            <div className="mt-3 text-xs text-slate-600">
              {pendingConfirm.subtitle}
            </div>

            {/* Structured Key-Value Details Grid */}
            {pendingConfirm.details && pendingConfirm.details.length > 0 && (
              <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                {pendingConfirm.details.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-500 font-medium shrink-0">{item.label}:</span>
                    <span className={`font-mono text-right truncate ${
                      item.highlight
                        ? 'font-black text-xs sm:text-sm text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xs'
                        : 'font-semibold text-slate-800'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                className="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel / Edit Again
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingConfirm.onConfirm) {
                    pendingConfirm.onConfirm();
                  }
                }}
                className={`px-5 sm:px-6 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                  pendingConfirm.isDanger
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                    : pendingConfirm.badgeColor === 'emerald'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    : pendingConfirm.badgeColor === 'rose'
                    ? 'bg-[#d91478] hover:bg-[#be0f67] shadow-[#d91478]/30'
                    : pendingConfirm.badgeColor === 'amber'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                    : 'bg-[#0284c7] hover:bg-[#0369a1] shadow-[#0284c7]/30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{pendingConfirm.actionLabel || 'Confirm & Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
