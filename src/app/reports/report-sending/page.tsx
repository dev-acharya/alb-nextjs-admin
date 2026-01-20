"use client";

import React, { useEffect, useState } from "react";
import { Filters, Order, ApiResponse } from "./types";
import { FilterBar } from "./components/FilterBar";
import { OrdersTable } from "./components/OrdersTable";
import { ViewModal } from "./components/ViewModal";
import { Pagination } from "./components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import Swal from "sweetalert2";

const ReportOrders: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    q: "",
    from: "",
    to: "",
    language: "all",
    planName: "life changing",
    status: "paid",
    reportDeliveryStatus: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 100,
    selectFirstN: undefined,
  });

  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedFilters = useDebounce(filters, 500);

  const getAuthHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  });

  const fetchOrders = async (currentFilters: Filters, currentPage: number) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      
      const params: Record<string, string> = {
        q: currentFilters.q,
        language: currentFilters.language,
        reportDeliveryStatus: currentFilters.reportDeliveryStatus,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder,
        page: currentPage.toString(),
        limit: currentFilters.limit.toString(),
      };

      if (currentFilters.from) {
        params.from = currentFilters.from;
      }
      if (currentFilters.to) {
        params.to = currentFilters.to;
      }
      if (currentFilters.from && !currentFilters.to) {
        params.date = currentFilters.from;
        delete params.from;
        delete params.to;
      }

      // ✅ selectFirstN: fetch all non-delivered
      if (currentFilters.selectFirstN && currentFilters.selectFirstN > 0) {
        params.sortBy = "createdAt";
        params.sortOrder = "asc";
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all") {
          qs.set(key, value);
        }
      });

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/get-reports?${qs.toString()}`;
      console.log("🔍 Fetching from:", apiUrl);

      const response = await fetch(apiUrl, { 
        headers: getAuthHeaders() 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
      }

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || "API returned error");
      }

      const { items, pagination } = result.data;
      
      // ✅ Filter & slice for selectFirstN
      let filteredItems = items || [];
      if (currentFilters.selectFirstN && currentFilters.selectFirstN > 0) {
        const nonDeliveredItems = filteredItems.filter(
          order => order.reportDeliveryStatus !== 'delivered'
        );
        filteredItems = nonDeliveredItems.slice(0, currentFilters.selectFirstN);
      }
      
      setRows(filteredItems);
      setPage(pagination?.page || 1);
      setTotalPages(pagination?.pages || 1);
      setTotalItems(pagination?.total || 0);
      
    } catch (error) {
      console.error("❌ Fetch error:", error);
      Swal.fire({ 
        icon: "error", 
        title: "Failed to load orders", 
        text: error instanceof Error ? error.message : "Unknown error",
        timer: 3000, 
        showConfirmButton: false 
      });
      setRows([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(debouncedFilters, page);
  }, [debouncedFilters]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchOrders(filters, newPage);
  };

  const handleRefresh = () => fetchOrders(filters, page);

  const handleReset = () => {
    const resetFilters: Filters = {
      q: "",
      from: "",
      to: "",
      language: "all",
      planName: "life changing",
      status: "paid",
      reportDeliveryStatus: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: 100,
      selectFirstN: undefined,
    };
    setFilters(resetFilters);
    setPage(1);
  };

  // ReportOrders.tsx me yeh function add karo:
const handleMarkAsDelivered = async (orderId: string) => {
  console.log(orderId, "orderissssssssssssssssssssssssssssssssssssssssddddddddddd")
  try {
    const result = await Swal.fire({
      title: 'Mark as Delivered?',
      text: 'This will manually mark the failed report as delivered.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as delivered!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/update-status/${orderId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) throw new Error('Failed to update');

    const data = await response.json();
    
    await Swal.fire({
      icon: 'success',
      title: '✅ Marked as Delivered!',
      text: data.message,
      timer: 2000,
      showConfirmButton: false
    });

    // Refresh orders
    fetchOrders(filters, page);

  } catch (error) {
    console.error('Error marking as delivered:', error);
    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text: 'Could not mark as delivered',
      timer: 2000
    });
  }
};

  // ✅ Process single report (for failed retry)
  const handleProcessSingle = async (reportId: string) => {
    try {
      const result = await Swal.fire({
        title: "Resend Report?",
        text: "This will retry generating this failed report.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Resend!",
      });

      if (!result.isConfirmed) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/life-journey-report/process-lcr-reports`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reportIds: [reportId] })
      });

      if (!response.ok) throw new Error("Failed to process report");

      await Swal.fire({
        icon: "success",
        title: "Report Queued!",
        text: "Report generation has been restarted.",
        timer: 2000,
        showConfirmButton: false
      });

      fetchOrders(filters, page);

    } catch (error) {
      console.error("Error processing report:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not process the report.",
        timer: 2000
      });
    }
  };

  // ✅ Process all non-delivered reports
  const handleProcessAll = async () => {
    const processableOrders = rows.filter(
      row => row._id && row.reportDeliveryStatus !== 'delivered'
    );

    if (processableOrders.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Reports to Process",
        text: "All visible reports are already delivered.",
        timer: 2000
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: `Process ${processableOrders.length} Reports?`,
        html: `
          <div class="text-left">
            <p><strong>Pending:</strong> ${processableOrders.filter(r => r.reportDeliveryStatus === 'pending').length}</p>
            <p><strong>Failed:</strong> ${processableOrders.filter(r => r.reportDeliveryStatus === 'failed').length}</p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Process All!",
      });

      if (!result.isConfirmed) return;

      const reportIds = processableOrders.map(order => order._id!);

      const response = await fetch(`https://alb.gennextit.com/api/life-journey-report/process-lcr-reports`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reportIds })
      });

      if (!response.ok) throw new Error("Failed to process reports");

      await Swal.fire({
        icon: "success",
        title: "Processing Started!",
        text: `${reportIds.length} reports queued for generation.`,
        timer: 3000,
        showConfirmButton: false
      });

      fetchOrders(filters, page);

    } catch (error) {
      console.error("Error processing reports:", error);
      Swal.fire({
        icon: "error",
        title: "Processing Failed",
        text: "There was an error while processing reports.",
        timer: 3000
      });
    }
  };

  // ✅ Count stats
  const pendingCount = rows.filter(r => r.reportDeliveryStatus === 'pending').length;
  const failedCount = rows.filter(r => r.reportDeliveryStatus === 'failed').length;
  const deliveredCount = rows.filter(r => r.reportDeliveryStatus === 'delivered').length;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="font-bold text-2xl mb-4">Report Automation</h1>
      
      {/* Stats Banner */}
      {rows.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-blue-800">
                Showing {rows.length} of {totalItems} orders
              </span>
              <div className="flex gap-3 text-sm">
                
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                  Failed: {failedCount}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  Delivered: {deliveredCount}
                </span>
              </div>
            </div>
            {filters.selectFirstN && filters.selectFirstN > 0 && (
              <div className="text-sm text-green-700 font-medium">
                ⚡ First {rows.length} non-delivered reports
              </div>
            )}
          </div>
        </div>
      )}
      
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onRefresh={handleRefresh}
        onReset={handleReset}
        onProcessAll={handleProcessAll}
        canProcessAll={pendingCount + failedCount > 0}
      />

      <OrdersTable
        data={rows}
        loading={loading}
        page={page}
        limit={filters.limit}
        onView={(row) => {
          setActiveRow(row);
          setViewOpen(true);
        }}
        onProcessSingle={handleProcessSingle}
        onMarkAsDelivered={handleMarkAsDelivered}
      />

      {!filters.selectFirstN && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={filters.limit}
          onPageChange={handlePageChange}
        />
      )}

      {viewOpen && activeRow && (
        <ViewModal
          order={activeRow}
          onClose={() => setViewOpen(false)}
        />
      )}
    </div>
  );
};

export default ReportOrders;