export const fetchPoPreview = async (transactionDate) => {
  if (!transactionDate) return "";

  try {
    const res = await fetch(
      `http://localhost:5000/api/preview/po?transaction_date=${transactionDate}`
    );

    if (!res.ok) throw new Error("Failed to fetch");

    return await res.json();
  } catch (err) {
    console.error("PO preview error:", err);
    return "";
  }
};

export const fetchSIPreview = async (transactionDate) => {
  if (!transactionDate) return "";

  try {
    const res = await fetch(
      `http://localhost:5000/api/preview/si?transaction_date=${transactionDate}`
    );

    if (!res.ok) throw new Error("Failed to fetch");

    return await res.json();
  } catch (err) {
    console.error("SI preview error:", err);
    return "";
  }
};