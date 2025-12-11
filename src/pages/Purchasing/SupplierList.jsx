import React, { useState, useMemo } from 'react';

import SupplierStatsGrid from './SupplierStatsGrid';
import SupplierListTable from './SupplierListTable';
import SupplierListTableHeader from './SupplierListTableHeader';
import TablePagination from '../../components/pagination/TablePagination';
import RowLimiter from '../../components/filter/RowLimiter';

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
    Name: 'Maria Cruz',
    businessName: "Maria's Meat Shop",
    Address: 'Caloocan City',
    Email: 'maria.cruz@yahoo.com',
    ContactNo: '09171122334',
    tinNo: '987654321',
    BankAcc: '987-654-321',
    Status: 'Active',
  },
  {
    Name: 'Roberto Sanchez',
    businessName: "Berto's Cuts",
    Address: 'Quezon City',
    Email: 'r.sanchez@cuts.ph',
    ContactNo: '09995566778',
    tinNo: '112233445',
    BankAcc: '112-233-445',
    Status: 'Active',
  },
  {
    Name: 'Jenny Lim',
    businessName: "Lim Livestock Trading",
    Address: 'Bulacan Province',
    Email: 'jenny.lim@llt.ph',
    ContactNo: '09228901234',
    tinNo: '556677889',
    BankAcc: '556-677-889',
    Status: 'Inactive',
  },
  {
    Name: 'Luis Garcia',
    businessName: "Garci's Gourmet Meats",
    Address: 'Makati Central Business District',
    Email: 'luis.garcia@gourmet.ph',
    ContactNo: '09081234567',
    tinNo: '678901234',
    BankAcc: '678-901-234',
    Status: 'Active',
  },
  {
    Name: 'Teresa Reyes',
    businessName: "Teresa's Fresh Poultry",
    Address: 'Pasig City',
    Email: 'teresa.reyes@fresh.com',
    ContactNo: '09774321098',
    tinNo: '345678901',
    BankAcc: '345-678-901',
    Status: 'Active',
  },
  {
    Name: 'Miguel Ramos',
    businessName: "Ramos Refrigeration",
    Address: 'Mandaluyong City',
    Email: 'miguel.ramos@refrig.ph',
    ContactNo: '09391029384',
    tinNo: '210987654',
    BankAcc: '210-987-654',
    Status: 'Active',
  },
  {
    Name: 'Carla Diaz',
    businessName: "The Beef Joint",
    Address: 'Taguig City, BGC',
    Email: 'carla.diaz@beefjoint.net',
    ContactNo: '09176543210',
    tinNo: '543210987',
    BankAcc: '543-210-987',
    Status: 'Inactive',
  },
  {
    Name: 'Eduardo Santos',
    businessName: "Santos Quality Pork",
    Address: 'Pampanga',
    Email: 'eduardo.santos@sqp.com',
    ContactNo: '09207890123',
    tinNo: '445566778',
    BankAcc: '445-566-778',
    Status: 'Active',
  },
  {
    Name: 'Grace Chua',
    businessName: "Chua Wholesale Meats",
    Address: 'Binondo, Manila',
    Email: 'grace.chua@wholesale.ph',
    ContactNo: '09452345678',
    tinNo: '778899001',
    BankAcc: '778-899-001',
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

// Removed unused date helper functions

function SupplierList() {
  const iconProps = {
    className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
  };

// --- DYNAMIC OPTION GENERATION ---
const extractUniqueOptions = (key, placeholder) => {
  const uniqueValues = [...new Set(SuppliersData.map(supplier => supplier[key]))];
  return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
};

  const rowLimitOptions = [5, 10, 15]; 

  // New/Recalibrated Dropdown Options
  const nameOptions = extractUniqueOptions('Name', 'Name');
  const businessNameOptions = extractUniqueOptions('businessName', 'Business Name');
  const statusOptions = extractUniqueOptions('Status', 'Status');

  // New/Recalibrated Placeholders
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

  // --- HANDLER FUNCTIONS ---
  const handleRowLimitChange = (newValue) => {
    setRowLimit(parseInt(newValue));
    setCurrentPage(1); 
  };

  const handleNameChange = (newValue) => {
    setNameFilter(newValue);
    setCurrentPage(1);
  };

  const handleBusinessNameChange = (newValue) => {
    setBusinessNameFilter(newValue);
    setCurrentPage(1);
  };

  const handleStatusChange = (newValue) => {
    setStatusFilter(newValue);
    setCurrentPage(1);
  };

  // --- FILTERING LOGIC ---
  const filteredSuppliers = useMemo(() => {
  let filtered = SuppliersData;

  // 1. Name Filter
  if (nameFilter !== initialName && nameFilter !== ALL_OPTION) {
    filtered = filtered.filter(supplier => supplier.Name === nameFilter);
  }

  // 2. Business Name Filter
  if (businessNameFilter !== initialBusinessName && businessNameFilter !== ALL_OPTION) {
    filtered = filtered.filter(supplier => supplier.businessName === businessNameFilter);
  }

  // 3. Status Filter
  if (statusFilter !== initialStatus && statusFilter !== ALL_OPTION) {
    filtered = filtered.filter(supplier => supplier.Status === statusFilter);
  }

  return filtered;
  }, [nameFilter, businessNameFilter, statusFilter, initialName, initialBusinessName, initialStatus]); 

  // --- Pagination Logic ---
  const totalSuppliers = filteredSuppliers.length;
  const totalPages = Math.ceil(totalSuppliers / rowLimit);

  const paginatedSuppliers = useMemo(() => {
  const startIndex = (currentPage - 1) * rowLimit;
  const endIndex = startIndex + rowLimit;
  return filteredSuppliers.slice(startIndex, endIndex);
  }, [filteredSuppliers, rowLimit, currentPage]);

  return (
  <div>
    <SupplierStatsGrid/>
    <div className = "bg-white/80 space-y-5 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">

      <SupplierListTableHeader
        nameOptions={nameOptions}
        businessNameOptions={businessNameOptions}
        statusOptions={statusOptions}

        currentName={nameFilter}
        currentBusinessName={businessNameFilter}
        currentStatus={statusFilter}

        handleNameChange={handleNameChange}
        handleBusinessNameChange={handleBusinessNameChange}
        handleStatusChange={handleStatusChange}

        iconProps={iconProps}
      />

      <SupplierListTable orders={paginatedSuppliers} />

      <div className = "flex items-center justify-between mb-3">
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
  </div>
  )
}

export default SupplierList;