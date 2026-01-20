import React, { useMemo } from "react";
import moment from "moment";
import { Order } from "../types";
import { ViewSvg } from "@/components/svgs/page";
import MainDatatable from "@/components/common/MainDatatable";
import { SendHorizonal } from "lucide-react";
import { SendAndArchive } from "@mui/icons-material";

interface Props {
  data: Order[];
  loading: boolean;
  page: number;
  limit: number;
  onView: (row: Order) => void;
  onProcessSingle: (reportId: string) => void;
  onMarkAsDelivered: (orderId: string) => void; // ✅ NEW: Add this prop
}

export const OrdersTable: React.FC<Props> = ({ 
  data, 
  loading, 
  page, 
  limit, 
  onView,
  onProcessSingle,
  onMarkAsDelivered // ✅ NEW: Add this
}) => {
  const columns = useMemo(() => [
    { 
      name: "S.No.", 
      selector: (_: Order, idx?: number) => ((page - 1) * limit) + (idx || 0) + 1, 
      width: "80px" 
    },
    { 
      name: "Order ID", 
      selector: (row: Order) => row?.orderID || "—", 
      width: "150px" 
    },
    { 
      name: "Plan", 
      selector: (row: Order) => row?.planName || "—", 
      width: "200px" 
    },
    { 
      name: "Amount", 
      selector: (row: Order) => `₹${row?.amount?.split(' ')[0] || "0"}`, 
      width: "120px" 
    },
    {
      name: "Payment",
      cell: (row: Order) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row?.status === "paid" ? "bg-green-100 text-green-700" :
          row?.status === "pending" ? "bg-yellow-100 text-yellow-700" :
          "bg-gray-100 text-gray-700"
        }`}>
          {row?.status === "paid" ? "Paid" : row?.status || "—"}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Report Status",
      cell: (row: Order) => {
        const deliveryStatus = row?.reportDeliveryStatus;
        const driveUrl = row?.driveFileUrl;
        
        if (!deliveryStatus || deliveryStatus === 'pending') {
          return (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
              Pending
            </span>
          );
        }
        
        if (deliveryStatus === 'delivered') {
          return (
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Delivered
              </span>
              {driveUrl && (
                <a 
                  href={driveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-lg"
                  title="View Report"
                >
                  📄
                </a>
              )}
            </div>
          );
        }
        
        if (deliveryStatus === 'failed') {
          return (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              ❌ Failed
            </span>
          );
        }
        
        return <span className="text-gray-500">—</span>;
      },
      width: "140px",
    },
    { 
      name: "Name", 
      selector: (row: Order) => row?.name || "—", 
      width: "150px" 
    },
    { 
      name: "WhatsApp", 
      selector: (row: Order) => row?.whatsapp || "—", 
      width: "120px" 
    },
    { 
      name: "Language", 
      selector: (row: Order) => row?.reportLanguage || "—", 
      width: "100px" 
    },
    { 
      name: "Created", 
      selector: (row: Order) => row?.formattedCreatedAt || 
        (row?.createdAt ? moment(row.createdAt).format("DD/MM/YY hh:mm A") : "—"), 
      width: "140px" 
    },
    {
      name: "Actions",
      cell: (row: Order) => (
        <div className="flex items-center gap-2">
          {/* View Button */}
          <button
            onClick={() => onView(row)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="View Details"
          >
            <ViewSvg />
          </button>
          
          {/* Resend Button - Only for Failed */}
          {row.reportDeliveryStatus === 'failed' && row._id && (
            <>
              <button
                onClick={() => onProcessSingle(row._id!)}
                title="Retry Failed Report"
              >
                <SendAndArchive/>
              </button>
              
              {/* ✅ NEW: Mark as Delivered Button */}
              <button
                onClick={() => onMarkAsDelivered(row._id!)}
                title="Mark as Delivered"
              >
                <SendHorizonal/>
              </button>
            </>
          )}
        </div>
      ),
      width: "180px" // ✅ Increased width for extra button
    }
  ], [page, limit, onView, onProcessSingle, onMarkAsDelivered]); // ✅ Add dependency

  return (
    <div className="mb-4">
      {data.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          No orders found with the current filters.
        </div>
      ) : (
        <MainDatatable
          data={data}
          columns={columns.map((col) => ({
            ...col,
            minwidth: col.width,
            width: undefined,
          }))}
          isLoading={loading}
          showSearch={false}
        />
      )}
    </div>
  );
};