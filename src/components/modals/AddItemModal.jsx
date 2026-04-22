import { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect';


function AddItemModal({ isOpen, onClose, onAddItem, loadItemList, type, isSupplier, data, brandList }) {

  const isSellingItem = type === "Item";
  const [price,setPrice] = useState(0);
  const [isPriceManuallyEdited, setIsPriceManuallyEdited] = useState(false);

  const selectedSupplierPrice = async () => {
    if (!selectedItem) return;

    const item_id = Number(selectedItem?.id);

    try {

      const res = await fetch(
        `/api/pricing/supplier/${data}/item/${item_id}`
      );

      const result = await res.json();
      setPrice(result.supp_price ?? null);

    } catch (err) {
      console.error("Error fetching supplier price:", err);
      setPrice(null); // ← fallback
    }
  };

  const selectedVIPPrice = async() => {
    if (!selectedItem) return;
    const item_id = Number(selectedItem?.id);
    try {
      const res = await fetch(
        `/api/pricing/customer/${data}/item/${item_id}`
      );
      const result = await res.json();
      setPrice(result.vip_price ?? null);
    } catch (err) {
      console.error("Error fetching VIP price:", err);
      setPrice(null); // ← fallback
    }
  };
  /* =======================
     ITEM FORM STATE
  ======================= */
  const [itemForm, setItemForm] = useState({
    brand: "",
    type: "",
    quantity: 0,
    unitPrice: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  /* =======================
     ITEM OPTIONS
  ======================= */
const ITEM_OPTIONS = [
  ...new Map(
    loadItemList?.map(item => [
      item.id,
      {
        value: item.id,        // ✅ FIX
        label: item.item_name,
      }
    ])
  ).values()
];
  const FILTERED_ITEM_OPTIONS = itemForm.brand
    ? loadItemList
        ?.filter(item => Number(item.brand) === Number(itemForm.brand))
        .map(item => ({
          value: item.id,
          label: item.item_name,
        }))
    : [];
  const FINAL_ITEM_OPTIONS =
  FILTERED_ITEM_OPTIONS.length > 0
    ? FILTERED_ITEM_OPTIONS
    : [{ value: "", label: "No items available" }];

  const BRAND_OPTIONS = [
    ...new Map(
      brandList?.map(brand => [
        brand.id,
        {
          value: brand.id, // ✅ must be ID
          label: brand.brand_name,
        }
      ])
    ).values()
  ];
  /* =======================
     SELECTED ITEM
  ======================= */
  const selectedItem = useMemo(() => {
    if (!itemForm.item) return null;

    return loadItemList?.find(
      (item) => Number(item.id) === Number(itemForm.item)
    ) || null;

  }, [itemForm.item, loadItemList]);
  useEffect(() => {
    if (!isOpen) return;
    if (!selectedItem) return;

    if (isSupplier) {
      selectedSupplierPrice();
    } else if (!isSupplier && type === "Item") {
      selectedVIPPrice();
    } 
  }, [isSupplier, selectedItem]);

  /* =======================
     AUTO POPULATE PRICE + TYPE
  ======================= */


    useEffect(() => {
      if (!selectedItem) return;

      const fallbackPrice =
        Number(selectedItem.suggested_retail_price) || 0;

      setItemForm((prev) => ({
        ...prev,
        id: selectedItem.id,
        unitPrice: isPriceManuallyEdited
          ? prev.unitPrice
          : (price ?? fallbackPrice),
        type: selectedItem.item_type,
      }));
    }, [selectedItem, price, isPriceManuallyEdited]);
      /* =======================
     AUTO TOTAL CALCULATION
  ======================= */
  useEffect(() => {
    const quantity = Number(itemForm.quantity) || 0;
    const unitPrice = Number(itemForm.unitPrice) || 0;
    const shipping = Number(itemForm.shipping) || 0;
    const discount = Number(itemForm.discount) || 0;

    setItemForm((prev) => ({
      ...prev,
      total: quantity * unitPrice + shipping - discount,
    }));

  }, [
    itemForm.quantity,
    itemForm.unitPrice,
    itemForm.shipping,
    itemForm.discount,
  ]);
  useEffect(() => {
    setIsPriceManuallyEdited(false);
  }, [selectedItem]);
 

  /* =======================
     MODAL GUARD
  ======================= */
  if (!isOpen) return null;

  /* =======================
     INPUT HANDLERS
  ======================= */
  const handleItemChange = (e) => {
    const { name, value, type } = e.target;

    const parsedValue =
      type === "number"
        ? value === ""
          ? ""
          : parseFloat(value)
        : value;

    if (name === "unitPrice") {
      setIsPriceManuallyEdited(true); // 👈 IMPORTANT
    }

    setItemForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

const handleSelectChange = (value, name) => {
  setItemForm(prev => ({
    ...prev,
    [name]: value,
    ...(name === "brand" && {
      item: "",
      type: "",
      unitPrice: 0
    })
  }));
};
  /* =======================
     SAVE HANDLER
  ======================= */
  const handleSave = (e) => {
    e.preventDefault();

    const finalItem = {
      ...itemForm,
      product_name: selectedItem?.item_name,
      item_id: selectedItem?.id,
      brand_id: itemForm.brand,
      quantity: Number(itemForm.quantity) || 0,
      unitPrice: Number(itemForm.unitPrice) || 0,
      shipping: Number(itemForm.shipping) || 0,
      discount: Number(itemForm.discount) || 0,
      total: Number(itemForm.total) || 0,
    };

    if (!finalItem.brand && type === "Brand") {
      alert("Please select a brand.");
      return;
    }

    if (!finalItem.type) {
      alert("Please select a type.");
      return;
    }

    if (finalItem.quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    if (finalItem.unitPrice <= 0) {
      alert("Price must be greater than 0.");
      return;
    }
    onAddItem(finalItem);

    setItemForm({
      brand: "",
      type: "",
      quantity: 0,
      unitPrice: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">

      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden space-y-4" onClick={e => e.stopPropagation()}>
        <div className = "w-full flex items-center justify-between py-4 px-6 border-b border-slate-300 dark:border-white/10 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Add Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer" />
          </button>
        </div>

        <form id = "addItemForm" onSubmit={handleSave} className="flex-1 overflow-y-auto py-5 space-y-8 px-7">
          {type === "Brand" && (
            <>
              {/* Brand */}
              <CustomFormSelect
                label="Brand"
                name="brand"
                options={BRAND_OPTIONS}
                initialValue={itemForm.brand}
                onSelect={handleSelectChange}
                placeholder="Select Brand..."
              />

              {/* Item */}
              <CustomFormSelect
                key={itemForm.brand} // 👈 forces reset when brand changes
                label="Item"
                name="item"
                options={FINAL_ITEM_OPTIONS}
                initialValue={itemForm.item}
                onSelect={handleSelectChange}
                placeholder={
                  itemForm.brand ? "Select Item..." : "Select brand first"
                }
                isDisabled={!itemForm.brand}
              />
            </>
          )}  
          {type === "Item" && (
            <CustomFormSelect
              label='Item'
              name="item"
              options={ITEM_OPTIONS}
              initialValue={itemForm.item}
              onSelect={handleSelectChange}
              placeholder={`Select Items...`}
            />
           )
          }
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Type
            </label>
            <input
              type="text"
              value={itemForm.type}
              disabled
              className="w-full mt-1 px-3 py-1.5 rounded-md border 
              bg-slate-200 dark:bg-slate-800 
              text-slate-700 dark:text-slate-200 
              border-slate-300 dark:border-slate-600
              cursor-not-allowed"
            />
          </div>

          {/* Shipping & Discount */}
          <div className="grid grid-cols-2 gap-4 dark:text-white">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Shipping
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="shipping"
                value={itemForm.shipping}
                onChange={handleItemChange}
                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Discount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="discount"
                value={itemForm.discount}
                onChange={handleItemChange}
                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600"
                required
              />
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-2 gap-4 dark:text-white">

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Quantity (KG)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="quantity"
                value={itemForm.quantity}
                onChange={handleItemChange}
                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {isSellingItem ? "Selling Price" : "Item Price"}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="unitPrice"
                value={itemForm.unitPrice ?? ""}
                onChange={handleItemChange}
                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600"
                required
              />
            </div>

          </div>

          {/* Total */}
          <div className="text-right pt-2">
            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Total:
            </span>
            <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">
              {itemForm.total.toFixed(2)}
            </span>
          </div>

        </form>

        {/* Buttons */}
        <div className="p-5 flex justify-end space-x-3 border-t border-slate-300 dark:border-slate-700 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300/90 dark:hover:bg-slate-600 transition-colors">
            Cancel
          </button>

          <button
            type="submit"
            form = "addItemForm"
            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;