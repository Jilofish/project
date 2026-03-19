// components/GatePass.jsx
import { QRCodeCanvas } from "qrcode.react";

export default function GatePass({ data, items, proofUrl }) {
  return (
    <div className="bg-white p-6 w-[794px] text-black">

    <h1 className="text-xl font-bold mb-6 text-center">
      Warehouse Gate Pass
    </h1>

    <div className="mb-4 text-sm">
      <p><b>SI No:</b> {data.si}</p>
      <p><b>Customer:</b> {data.customer.name}</p>
    </div>

    <table className="w-[98%] mx-auto border table-fixed text-[11px]">

    <thead>
    <tr>
      <th className="border p-2 w-[28%]">Brand</th>
      <th className="border p-2 w-[22%]">Type</th>
      <th className="border p-2 w-[15%]">Qty</th>
      <th className="border p-2 w-[15%]">Unit</th>
      <th className="border p-2 w-[18%]">Total</th>
    </tr>
    </thead>

    <tbody>
    {items.map(item => (
    <tr key={item.id}>
      <td className="border p-2">{item.product_name}</td>
      <td className="border p-2">{item.type}</td>
      <td className="border p-2 text-center">{item.quantity}</td>
      <td className="border p-2">{item.unit_price}</td>
      <td className="border p-2">{item.line_total}</td>
    </tr>
    ))}
    </tbody>

    </table>

    {proofUrl && (
    <div className="flex justify-center mt-6">
      <QRCodeCanvas value={proofUrl} size={140}/>
    </div>
    )}

    </div>
  );
}