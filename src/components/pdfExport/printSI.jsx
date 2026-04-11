import { useEffect, useState,useMemo } from "react";
import { useParams } from "react-router-dom";
import { calculatePurchaseTotals } from "../../utils/paymentCalculator";

export default function PrintSI() {
  const { si } = useParams();
  const [data, setData] = useState(null);
  const [purchaseItems, setPurchaseItems] = useState([]);

  useEffect(() => {
    fetch(`/api/sales-invoice/${si}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, [si]);
    useEffect(() => {
        if (data?.sales_invoice_item) {
            setPurchaseItems(data.sales_invoice_item);
        }
        }, [data]);
  const paymentTotals = useMemo(() => {
      return calculatePurchaseTotals(purchaseItems);
  }, [purchaseItems]);
  if (!data) return <div>Loading...</div>;
  return (
    <div
      id="print-content"
      className="bg-white text-black w-[210mm] min-h-[297mm] p-8"
    >

      {/* HEADER */}
      <div className="mb-6 flex justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Invoice</h1>
          <p>Sales Invoice #: {data.si}</p>
          <p>Status: {data.approval_status}</p>
        </div>

        <div className="text-right">
          <p className="font-bold">Jab Meats</p>
          <p>Company Address</p>
        </div>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p><strong>Customer:</strong> {data.customer.name}</p>
          <p><strong>Contact:</strong> {data.customer.contactno}</p>
          <p><strong>Address:</strong> {data.customer.address}</p>
        </div>

        <div>
          <p><strong>Date:</strong> {data.transaction_date}</p>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border border-black text-sm mb-6">
        <thead>
          <tr className="border-b">
            <th className="border px-2 py-1 text-left">Brand</th>
            <th className="border px-2 py-1 text-left">Type</th>
            <th className="border px-2 py-1 text-center">Qty</th>
            <th className="border px-2 py-1 text-right">Price</th>
            <th className="border px-2 py-1 text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          {data.sales_invoice_item.map((item, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{item.product_name}</td>
              <td className="border px-2 py-1">{item.type}</td>
              <td className="border px-2 py-1 text-center">{item.quantity}</td>
              <td className="border px-2 py-1 text-right">{item.unit_price}</td>
              <td className="border px-2 py-1 text-right">{item.line_total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="flex justify-end">
        <div className="w-64 text-sm">
          <div className="flex justify-between">
            <span>Merchandise:</span>
            <span>{Number(paymentTotals.merchandiseSubtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{Number(paymentTotals.shippingSubtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount:</span>
            <span>{Number(paymentTotals.discountSubtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold border-t mt-2 pt-2">
            <span>Total:</span>
            <span>{Number(paymentTotals.totalPayment).toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}