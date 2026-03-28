import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PrintPO() {
  const { po } = useParams();
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/purchasing/${po}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch PO");
        return res.json();
      })
      .then(res => {
        console.log("FETCH RESULT:", res);
        setData(res);
      })
      .catch(console.error);
  }, [po]);

  useEffect(() => {
    if (data?.items) {
      setItems(data.items);
    }
  }, [data]);

  if (!data) return <div>Loading...</div>;

  console.log("PO DATA:", JSON.stringify(data, null, 2));

  return (
    <div
      id="print-content"
      className="bg-white text-black w-[210mm] min-h-[297mm] p-8"
    >
      {/* HEADER */}
      <div className="mb-6 flex justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Purchase Order</h1>
          <p>PO #: {data.po}</p>
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
          <p><strong>Supplier:</strong> {data.supplier?.businessname}</p>
          <p><strong>Warehouse:</strong> {data.warehouse}</p>
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
          {data?.purchased_order_item?.map((item, i) => (
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

      {/* REMARKS */}
      <div className="mb-6 text-sm">
        <p className="font-semibold">Remarks:</p>
        <p>{data.remarks || "—"}</p>
      </div>

      {/* TOTALS */}
      <div className="flex justify-end">
        <div className="w-64 text-sm">
          <div className="flex justify-between">
            <span>Merchandise:</span>
            <span>{Number(data?.merchandiseSubtotal || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{Number(data?.shippingSubtotal || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount:</span>
            <span>{Number(data?.discountSubtotal || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold border-t mt-2 pt-2">
            <span>Total:</span>
            <span>{Number(data?.totalPayment || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}