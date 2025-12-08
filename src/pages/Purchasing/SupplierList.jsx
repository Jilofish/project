import React from 'react'
import SupplierStatsGrid from './SupplierStatsGrid';
import SupplierListTable from './SupplierListTable';
import SupplierListTableHeader from './SupplierListTableHeader';
import TablePagination from '../../components/pagination/TablePagination';
import RowLimiter from '../../components/filter/RowLimiter';

function supplierList() {
  const iconProps = {
    className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
  };

    // --- DATA FOR ALL FILTERS ---
  const RowOptions = ['5', '15', '20'];
  const HandleRowLimitChange = (newValue) => {
    console.log('Row limiter value changed:', newValue);
  };

  return (
    <div>
      {/* flex flex-row gap-12 border border-red-500 */}
      <SupplierStatsGrid/>
      <div className = "bg-white/80 space-y-5 dark:bg-slate-900/80 backdrop-blur-xl rounded-lg py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">
        <SupplierListTableHeader/>
        <SupplierListTable/>

        <div class = "flex items-center justify-between mb-3">
          <RowLimiter
            options={RowOptions}
            initialValue={RowOptions[0]}
            onSelect={HandleRowLimitChange}
            iconProps={iconProps}
          />
          <TablePagination/>
        </div>
      </div>
      
    </div>
  )
}

export default supplierList
