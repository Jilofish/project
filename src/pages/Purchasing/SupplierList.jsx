import React, { useState, useMemo } from 'react';

import SupplierStatsGrid from './SupplierStatsGrid';
import SupplierListTable from './SupplierListTable';
import SupplierListTableHeader from './SupplierListTableHeader';
import TablePagination from '../../components/pagination/TablePagination';
import RowLimiter from '../../components/filter/RowLimiter';

import AddSupplierModal from '../../components/modals/AddSupplierModal'; 
import EditSupplierListModal from '../../components/modals/EditSupplierListModal';

const ALL_OPTION = 'All';

const SuppliersData = [
  {
    Name: 'Sarah Trinidad',
    businessName: "Sarah's Karnehan",
    Address: 'Valenzuela',
    Email: 'sarah.t@gmail.com',
    ContactNo: '09123456789',
    tinNo: '123456789',
    BankAcc: '123-456-789',
    Status: 'Active',
  },
  {
    Name: 'Javier Pehipol',
    businessName: "Pata Slayer",
    Address: 'BB Paz Street',
    Email: 'jppehipol@gmail.com',
    ContactNo: '09123456789',
    tinNo: '123456789',
    BankAcc: '123-456-789',
    Status: 'Active',
  },
  {
    Name: 'John Doe',
    businessName: "Kimetsu no Karne",
    Address: '123 Zone A, Cityville',
    Email: 'muzankibu@gmail.com',
    ContactNo: '09123456789',
    tinNo: '123456789',
    BankAcc: '123-456-789',
    Status: 'Active',
  },
  {
    Name: 'Richard Dela Cruz',
    businessName: "DC Meat Supply",
    Address: 'Cavite',
    Email: 'r.delacruz@dcmeat.ph',
    ContactNo: '09989012345',
    tinNo: '001122334',
    BankAcc: '001-122-334',
    Status: 'Active',
  },
];

function SupplierList() {
  const iconProps = {
    className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
  };

  // --- OPTION GENERATION ---
  const extractUniqueOptions = (key, placeholder) => {
    const uniqueValues = [...new Set(SuppliersData.map(supplier => supplier[key]))];
    return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
  };

  const rowLimitOptions = [5, 10, 15]; 
  const nameOptions = extractUniqueOptions('Name', 'Name');
  const businessNameOptions = extractUniqueOptions('businessName', 'Business Name');
  const statusOptions = extractUniqueOptions('Status', 'Status');

  const initialRowLimit = rowLimitOptions[0];
  const initialName = nameOptions[0];
  const initialBusinessName = businessNameOptions[0];
  const initialStatus = statusOptions[0];

  // --- STATE MANAGEMENT ---
  const [rowLimit, setRowLimit] = useState(initialRowLimit);
  const [nameFilter, setNameFilter] = useState(initialName);
  const [businessNameFilter, setBusinessNameFilter] = useState(initialBusinessName);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(1);
  
  // --- MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  // --- HANDLER FUNCTIONS ---
  const handleRowLimitChange = (newValue) => {
    setRowLimit(parseInt(newValue));
    setCurrentPage(1); 
  };

  // Edit Handlers
  const handleOpenEditModal = (supplier) => {
    setSupplierToEdit(supplier);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSupplierToEdit(null);
  };

  const handleSaveEdit = (updatedSupplier) => {
    console.log("Updated Supplier Data:", updatedSupplier);
    // Here you would typically update your database or global state
    handleCloseEditModal();
  };

  // --- FILTERING LOGIC ---
  const filteredSuppliers = useMemo(() => {
    let filtered = SuppliersData;

    if (nameFilter !== initialName && nameFilter !== ALL_OPTION) {
      filtered = filtered.filter(s => s.Name === nameFilter);
    }
    if (businessNameFilter !== initialBusinessName && businessNameFilter !== ALL_OPTION) {
      filtered = filtered.filter(s => s.businessName === businessNameFilter);
    }
    if (statusFilter !== initialStatus && statusFilter !== ALL_OPTION) {
      filtered = filtered.filter(s => s.Status === statusFilter);
    }

    return filtered;
  }, [nameFilter, businessNameFilter, statusFilter, initialName, initialBusinessName, initialStatus]); 

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredSuppliers.length / rowLimit);
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowLimit;
    return filteredSuppliers.slice(startIndex, startIndex + rowLimit);
  }, [filteredSuppliers, rowLimit, currentPage]);

  return (
    <div>
      <SupplierStatsGrid/>
      <div className="bg-white/80 space-y-5 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">

        <SupplierListTableHeader
          nameOptions={nameOptions}
          businessNameOptions={businessNameOptions}
          statusOptions={statusOptions}
          currentName={nameFilter}
          currentBusinessName={businessNameFilter}
          currentStatus={statusFilter}
          
          // Update these three lines to use setters directly
          handleNameChange={setNameFilter}
          handleBusinessNameChange={setBusinessNameFilter}
          handleStatusChange={setStatusFilter} 
          
          onAddSupplierClick={() => setIsAddModalOpen(true)} 
          iconProps={iconProps}
        />

        <SupplierListTable 
            orders={paginatedSuppliers} 
            onEdit={handleOpenEditModal} 
        />

        <div className="flex items-center justify-between mb-3">
          <RowLimiter
            options={rowLimitOptions}
            initialValue={rowLimit.toString()}
            onSelect={handleRowLimitChange}
            iconProps={iconProps}
          />

          <TablePagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      
      <AddSupplierModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <EditSupplierListModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        supplierData={supplierToEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default SupplierList;