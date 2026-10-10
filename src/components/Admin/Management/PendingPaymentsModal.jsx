import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Printer,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';

export default function PendingPaymentsModal({
  isOpen,
  onClose,
  sites = [],
  payments = [],
  formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`,
  onSelectSite = null,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('pending'); // 'pending' | 'all' | 'paid'
  const [sortBy, setSortBy] = useState('pending-desc'); // 'pending-desc' | 'pending-asc' | 'name-asc' | 'income-desc'

  const normSiteId = (id) => String(id || '').trim().toLowerCase();

  // Process site-level pending calculations
  const siteListWithPending = useMemo(() => {
    return sites.map((st) => {
      const sId = st.id || st.siteId || 'N/A';
      const customerName = st.customerName || st.clientName || st.name || 'Unnamed Customer';
      const phone = st.phone || st.contact || '';
      const city = st.city || st.location || '';
      const status = st.siteStatus || st.status || 'Running';

      const loan = Number(st.loanAmount) || 0;
      const margin = Number(st.customerMargin) || 0;
      const totalIncome = (loan + margin) > 0 ? (loan + margin) : (Number(st.projectIncome) || Number(st.projectValue) || 0);

      const sitePayments = payments.filter((p) => normSiteId(p.siteId) === normSiteId(sId));
      const paymentSum = sitePayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const siteReceived = Number(st.amountReceived) > 0 ? Number(st.amountReceived) : paymentSum;

      const sitePending = totalIncome - siteReceived;
      const percentPaid = totalIncome > 0 ? Math.min(100, Math.round((siteReceived / totalIncome) * 100)) : 0;

      return {
        raw: st,
        siteId: sId,
        customerName,
        phone,
        city,
        status,
        loan,
        margin,
        totalIncome,
        siteReceived,
        sitePending,
        percentPaid,
        paymentsCount: sitePayments.length,
        lastPaymentDate: sitePayments.length > 0 ? sitePayments[sitePayments.length - 1].paymentDate : null,
      };
    });
  }, [sites, payments]);

  // Overall aggregate stats
  const overallStats = useMemo(() => {
    const totalPending = siteListWithPending.reduce((sum, s) => sum + Math.max(0, s.sitePending), 0);
    const totalReceived = siteListWithPending.reduce((sum, s) => sum + s.siteReceived, 0);
    const totalIncome = siteListWithPending.reduce((sum, s) => sum + s.totalIncome, 0);
    const pendingSitesCount = siteListWithPending.filter((s) => s.sitePending > 0).length;
    const paidSitesCount = siteListWithPending.filter((s) => s.sitePending <= 0 && s.totalIncome > 0).length;

    return {
      totalPending,
      totalReceived,
      totalIncome,
      pendingSitesCount,
      paidSitesCount,
      totalSites: siteListWithPending.length,
      collectionRatio: totalIncome > 0 ? Math.min(100, Math.round((totalReceived / totalIncome) * 100)) : 0
    };
  }, [siteListWithPending]);

  // Filtered & Sorted sites
  const displayedSites = useMemo(() => {
    let result = siteListWithPending.filter((item) => {
      // Filter Type
      if (filterType === 'pending' && item.sitePending <= 0) return false;
      if (filterType === 'paid' && (item.sitePending > 0 || item.totalIncome === 0)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.customerName.toLowerCase().includes(q);
        const matchesId = item.siteId.toLowerCase().includes(q);
        const matchesPhone = item.phone.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        return matchesName || matchesId || matchesPhone || matchesCity;
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'pending-desc') return b.sitePending - a.sitePending;
      if (sortBy === 'pending-asc') return a.sitePending - b.sitePending;
      if (sortBy === 'name-asc') return a.customerName.localeCompare(b.customerName);
      if (sortBy === 'income-desc') return b.totalIncome - a.totalIncome;
      return 0;
    });
  }, [siteListWithPending, filterType, searchQuery, sortBy]);

  // Print pending report
  const handlePrintReport = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const rowsHtml = displayedSites.map((s, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
        <td style="padding: 6px 8px; text-align: center; color: #64748b;">${idx + 1}</td>
        <td style="padding: 6px 8px; font-weight: bold; color: #0f172a;">
          ${s.customerName}
          ${s.phone ? `<div style="font-size: 9px; color: #64748b; font-weight: normal;">📞 ${s.phone}</div>` : ''}
        </td>
        <td style="padding: 6px 8px; font-family: monospace; font-weight: bold; color: #1d4ed8;">${s.siteId}</td>
        <td style="padding: 6px 8px; color: #475569;">${s.city || '-'}</td>
        <td style="padding: 6px 8px; text-align: center;">
          <span style="display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: bold; border-radius: 4px; background: ${
            s.status === 'Completed' ? '#dcfce7; color: #166534;' : '#fef3c7; color: #92400e;'
          }">
            ${s.status}
          </span>
        </td>
        <td style="padding: 6px 8px; text-align: right; font-family: monospace;">${formatINR(s.totalIncome)}</td>
        <td style="padding: 6px 8px; text-align: right; font-family: monospace; color: #16a34a; font-weight: bold;">${formatINR(s.siteReceived)}</td>
        <td style="padding: 6px 8px; text-align: right; font-family: monospace; color: #b45309; font-weight: 800; font-size: 12px; background: #fffbeb;">
          ${formatINR(s.sitePending)}
        </td>
      </tr>
    `).join('');

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Customer Pending Payment Report - Power24</title>
          <style>
            @page { size: A4 portrait; margin: 12mm 10mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 0; }
            .header-box { border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; }
            .badge-total { background: #fffbeb; border: 1.5px solid #f59e0b; padding: 6px 12px; border-radius: 8px; text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #1e3a8a; color: white; padding: 7px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
            .footer { margin-top: 25px; border-top: 1px dashed #cbd5e1; padding-top: 10px; font-size: 9px; color: #64748b; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header-box">
            <div>
              <div style="font-size: 20px; font-weight: 900; color: #1e3a8a; letter-spacing: -0.5px;">POWER24 SOLAR ENERGY</div>
              <div style="font-size: 12px; font-weight: bold; color: #b45309; margin-top: 2px;">CUSTOMER PENDING PAYMENTS BREAKDOWN (बकाया भुगतान सूची)</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 3px;">Report Generated: ${dateStr}</div>
            </div>
            <div class="badge-total">
              <div style="font-size: 10px; font-weight: bold; color: #92400e; text-transform: uppercase;">Total Pending Due</div>
              <div style="font-size: 18px; font-weight: 900; color: #b45309; font-family: monospace;">${formatINR(overallStats.totalPending)}</div>
              <div style="font-size: 9px; color: #64748b;">${overallStats.pendingSitesCount} Customer Sites Due</div>
            </div>
          </div>

          <div style="display: flex; gap: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-size: 11px; margin-bottom: 10px;">
            <div><strong>Total Project Income:</strong> ${formatINR(overallStats.totalIncome)}</div>
            <div style="color: #16a34a;"><strong>Total Received:</strong> ${formatINR(overallStats.totalReceived)}</div>
            <div style="color: #b45309;"><strong>Total Pending:</strong> ${formatINR(overallStats.totalPending)}</div>
            <div><strong>Collection Ratio:</strong> ${overallStats.collectionRatio}%</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 25px; text-align: center;">#</th>
                <th style="text-align: left;">Customer Name</th>
                <th style="text-align: left;">Site ID</th>
                <th style="text-align: left;">City</th>
                <th style="text-align: center;">Status</th>
                <th style="text-align: right;">Total Income</th>
                <th style="text-align: right;">Received</th>
                <th style="text-align: right;">Pending Due (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer">
            <div>Confidential & Internal Financial Report | Power24 Management System</div>
            <div>Authorized Signatory: _________________________</div>
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow || iframe.contentDocument;
    if (doc.document) {
      doc.document.open();
      doc.document.write(printHtml);
      doc.document.close();
    } else {
      doc.open();
      doc.write(printHtml);
      doc.close();
    }

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Print failed:', err);
      } finally {
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 3000);
      }
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 py-5 text-white flex items-center justify-between shadow-md relative">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Pending Payments Breakdown (बकाया भुगतान विवरण)
                </h3>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  {overallStats.pendingSitesCount} Customer Sites Due
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Kis customer ya site ka kitna paisa baaki hai uska complete live financial record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 active:scale-95 shadow-xs cursor-pointer"
              title="Print / Save PDF Report"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-all active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/90 border-b border-slate-200 text-xs">
          {/* Card 1: Total Pending */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
              Total Pending Due (कुल बकाया)
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-amber-700 font-mono">
                {formatINR(overallStats.totalPending)}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-bold">
                {overallStats.pendingSitesCount} Sites
              </span>
            </div>
          </div>

          {/* Card 2: Total Received */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
              Total Received (प्राप्त राशि)
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-emerald-700 font-mono">
                {formatINR(overallStats.totalReceived)}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">
                {overallStats.collectionRatio}% Paid
              </span>
            </div>
          </div>

          {/* Card 3: Total Project Value */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50/50 p-3.5 rounded-2xl border border-blue-200 shadow-xs">
            <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block">
              Total Project Income (कुल मूल्य)
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-blue-900 font-mono">
                {formatINR(overallStats.totalIncome)}
              </span>
              <span className="text-[10px] text-blue-600 font-bold">
                {overallStats.totalSites} Total Sites
              </span>
            </div>
          </div>

          {/* Card 4: Fully Cleared */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50/50 p-3.5 rounded-2xl border border-purple-200 shadow-xs">
            <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider block">
              Fully Settled (पूरा भुगतान)
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-purple-900 font-mono">
                {overallStats.paidSitesCount} Sites
              </span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-bold">
                100% Cleared
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by customer name, site ID, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Only ({overallStats.pendingSitesCount})
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Sites ({overallStats.totalSites})
            </button>
            <button
              onClick={() => setFilterType('paid')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'paid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fully Paid ({overallStats.paidSitesCount})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="pending-desc">Highest Pending First</option>
              <option value="pending-asc">Lowest Pending First</option>
              <option value="name-asc">Customer Name (A-Z)</option>
              <option value="income-desc">Total Value (Highest)</option>
            </select>
          </div>
        </div>

        {/* Sites Table / List */}
        <div className="flex-1 overflow-y-auto">
          {displayedSites.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 stroke-1" />
              <p className="font-bold text-slate-600 text-sm">Koi pending payment nahi mili</p>
              <p className="text-xs text-slate-400">Sabhi payments clear hain ya search filter match nahi hua.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
                <tr>
                  <th className="p-3.5 pl-5">Customer & Site Details</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right font-mono">Total Value</th>
                  <th className="p-3.5 text-right font-mono text-emerald-700">Received</th>
                  <th className="p-3.5 text-right font-mono text-amber-700 bg-amber-50/70">
                    Pending Due (₹)
                  </th>
                  <th className="p-3.5 text-center">Payment Progress</th>
                  <th className="p-3.5 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedSites.map((s, idx) => (
                  <tr
                    key={s.siteId}
                    className={`hover:bg-amber-50/40 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    {/* Customer & Site Details */}
                    <td className="p-3.5 pl-5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {s.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{s.customerName}</span>
                            <span className="font-mono text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                              {s.siteId}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-0.5 font-medium">
                            {s.phone && (
                              <a
                                href={`tel:${s.phone}`}
                                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{s.phone}</span>
                              </a>
                            )}
                            {s.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{s.city}</span>
                              </span>
                            )}
                            <span className="text-slate-400">
                              ({s.paymentsCount} Payment{s.paymentsCount === 1 ? '' : 's'})
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Site Status */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          s.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : s.status === 'On Hold'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    {/* Total Value */}
                    <td className="p-3.5 text-right font-mono font-bold text-slate-800">
                      {formatINR(s.totalIncome)}
                    </td>

                    {/* Received */}
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-700">
                      {formatINR(s.siteReceived)}
                    </td>

                    {/* Pending Due */}
                    <td className="p-3.5 text-right font-mono bg-amber-50/70">
                      <span
                        className={`font-black text-sm ${
                          s.sitePending > 0
                            ? 'text-amber-700'
                            : s.sitePending < 0
                            ? 'text-blue-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {formatINR(s.sitePending)}
                      </span>
                      {s.sitePending > 0 && (
                        <div className="text-[10px] text-amber-800 font-sans font-semibold">
                          बकाया राशि
                        </div>
                      )}
                    </td>

                    {/* Payment Progress Bar */}
                    <td className="p-3.5 text-center min-w-[120px]">
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            s.percentPaid >= 100
                              ? 'bg-emerald-500'
                              : s.percentPaid >= 50
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${s.percentPaid}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono mt-0.5 block">
                        {s.percentPaid}% Collected
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="p-3.5 pr-5 text-right">
                      {onSelectSite ? (
                        <button
                          onClick={() => {
                            onSelectSite(s.siteId);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-all border border-blue-200 hover:border-blue-600 cursor-pointer shadow-2xs"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono font-bold">
                          {s.siteId}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-600">
            Showing <strong className="text-slate-900">{displayedSites.length}</strong> of{' '}
            <strong className="text-slate-900">{siteListWithPending.length}</strong> customer sites
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
