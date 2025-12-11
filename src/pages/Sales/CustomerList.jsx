import React, { useState, useMemo } from 'react';

import CustomerListStatsGrid from './CustomerListStatsGrid';
import CustomerListTableHeader from './CustomerListTableHeader';
import CustomerListTable from './CustomerListTable';
import TablePagination from '../../components/pagination/TablePagination';
import RowLimiter from '../../components/filter/RowLimiter';

const ALL_OPTION = 'All';

const CustomersData = [
  {
    Name: 'Sarah Jane',
    FBName: 'Sarah Ganda',
    businessName: "Sarah's Karnehan",
    Address: '13 Jupiter Street',
    Email: 'sjane@gmail.com',
    ContactNo: '09123456789',
    CustomerType: 'VIP',
    BankAcc: '123-456-789',
    Status: 'Active',
  },
  {
    Name: 'Joseph Karl',
    FBName: 'Joseph Jun',
    businessName: "KarlGador",
    Address: '13 Abalos Avenue',
    Email: 'jojo@gmail.com',
    ContactNo: '09123456789',
    CustomerType: 'VACUUM',
    BankAcc: '123-456-789',
    Status: 'Active',

  },
  {
    Name: 'Junnie B. Oy',
    FBName: 'JunnieTV',
    businessName: "Junnie Meats",
    Address: 'Jacinto Building',
    Email: 'junjun@gmail.com',
    ContactNo: '09123456789',
    CustomerType: 'UNPACK',
    BankAcc: '123-456-789',
    Status: 'Active',
  },
  {
    Name: 'Maria Elena Dela Cruz',
    FBName: 'MarieleDC',
    businessName: "Maries' Kapehan",
    Address: '45 Lotus St., Sampaloc',
    Email: 'marielena@web.ph',
    ContactNo: '09171234567',
    CustomerType: 'UNPACK',
    BankAcc: '987-654-321',
    Status: 'Active',
  },
  {
    Name: 'Renato S. Reyes',
    FBName: 'RenReyes',
    businessName: "R-Reyes Food Corp.",
    Address: 'Unit 5, EDSA Mall',
    Email: 'renato.r@corp.com',
    ContactNo: '09087654321',
    CustomerType: 'VIP',
    BankAcc: '111-222-333',
    Status: 'Inactive',
  },
  {
    Name: 'Chloe A. Jimenez',
    FBName: 'ChloJims',
    businessName: "Jimenez Catering",
    Address: 'Bldg B, Makati Ave.',
    Email: 'chloe.jimenez@event.net',
    ContactNo: '09988776655',
    CustomerType: 'VACUUM',
    BankAcc: '444-555-666',
    Status: 'Active',
  },
  {
    Name: 'Antonio V. Santos',
    FBName: 'TonyVS',
    businessName: "Tony's Tapsilogan",
    Address: '10th Avenue, Caloocan',
    Email: 'tonyv@mail.com',
    ContactNo: '09223344556',
    CustomerType: 'UNPACK',
    BankAcc: '777-888-999',
    Status: 'Active',
  },
  {
    Name: 'Liza M. Pascual',
    FBName: 'LizaP',
    businessName: "Liza's Sari-Sari",
    Address: 'Brgy. Hall Compound, QC',
    Email: 'liza.p@shop.net',
    ContactNo: '09506070809',
    CustomerType: 'VIP',
    BankAcc: '101-202-303',
    Status: 'Active',
  },
  {
    Name: 'Gabriel S. Torres',
    FBName: 'GabTorres',
    businessName: "G. Torres Trading",
    Address: 'Manila Port Area, Gate 1',
    Email: 'gabriel.t@trade.ph',
    ContactNo: '09665544332',
    CustomerType: 'VACUUM',
    BankAcc: '404-505-606',
    Status: 'Inactive',
  },
  {
    Name: 'Hannah C. Lopez',
    FBName: 'HannaL',
    businessName: "HL Food Services",
    Address: '32 Redwood Heights',
    Email: 'hannah.c@foodserv.com',
    ContactNo: '09192827363',
    CustomerType: 'VIP',
    BankAcc: '707-808-909',
    Status: 'Active',
  },
  {
    Name: 'Victor R. Cruz',
    FBName: 'VicRuz',
    businessName: "Victor's Pizzeria",
    Address: '55 Emilio St., Malabon',
    Email: 'victor.c@pizza.net',
    ContactNo: '09391472580',
    CustomerType: 'UNPACK',
    BankAcc: '135-792-468',
    Status: 'Active',
  },
  {
    Name: 'Pamela T. Diaz',
    FBName: 'PamDiaz',
    businessName: "Pamee Bakeshop",
    Address: '19 Tulip Drive, Pasig',
    Email: 'pamela.d@bake.com',
    ContactNo: '09778899001',
    CustomerType: 'VACUUM',
    BankAcc: '246-813-579',
    Status: 'Active',
  },
  {
    Name: 'Edward M. Garcia',
    FBName: 'Edgarcia',
    businessName: "Ed's Meats & Deli",
    Address: 'Cubao Expo, QC',
    Email: 'edward.m@deli.ph',
    ContactNo: '09991112223',
    CustomerType: 'VIP',
    BankAcc: '100-200-300',
    Status: 'Inactive',
  }
]

function CustomerList() {
  const iconProps = {
    className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
  };

  // --- DYNAMIC OPTION GENERATION ---
  const extractUniqueOptions = (key, placeholder) => {
    const uniqueValues = [...new Set(CustomersData.map(customer => customer[key]))]; 
    return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
  };

  const rowLimitOptions = [5, 10, 15];

  // New Filter Options
  const nameOptions = extractUniqueOptions('Name', 'Name');
  const customerTypeOptions = extractUniqueOptions('CustomerType', 'Customer Type');
  const statusOptions = extractUniqueOptions('Status', 'Status');

  // Initial Values/Placeholders
  const initialRowLimit = rowLimitOptions[0];
  const initialName = nameOptions[0];
  const initialCustomerType = customerTypeOptions[0];
  const initialStatus = statusOptions[0];


  // --- STATE MANAGEMENT ---
  const [rowLimit, setRowLimit] = useState(initialRowLimit);
  const [nameFilter, setNameFilter] = useState(initialName);
  const [customerTypeFilter, setCustomerTypeFilter] = useState(initialCustomerType);
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

  const handleCustomerTypeChange = (newValue) => {
  setCustomerTypeFilter(newValue);
  setCurrentPage(1);
  };

  const handleStatusChange = (newValue) => {
    setStatusFilter(newValue);
    setCurrentPage(1);
  };


  // --- FILTERING LOGIC ---
  const filteredOrders = useMemo(() => {
  let filtered = CustomersData;

  // 1. Name Filter
  if (nameFilter !== initialName && nameFilter !== ALL_OPTION) {
    filtered = filtered.filter(customer => customer.Name === nameFilter);
    }

  // 2. Customer Type Filter
  if (customerTypeFilter !== initialCustomerType && customerTypeFilter !== ALL_OPTION) {
    filtered = filtered.filter(customer => customer.CustomerType === customerTypeFilter);
    }

  // 3. Status Filter
  if (statusFilter !== initialStatus && statusFilter !== ALL_OPTION) {
    filtered = filtered.filter(customer => customer.Status === statusFilter);
  }

  return filtered;
  }, [nameFilter, customerTypeFilter, statusFilter, initialName, initialCustomerType, initialStatus]);

  // --- Pagination Logic ---
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / rowLimit);

  const paginatedOrders = useMemo(() => {
  const startIndex = (currentPage - 1) * rowLimit;
  const endIndex = startIndex + rowLimit;

  // Ensure current page is valid if filters change
  if (currentPage > totalPages && totalPages > 0) {
  // This part should ideally be handled by useEffect or inside the page change handler, 
  // but keeping the original pattern for minimal change impact:
  // setCurrentPage(totalPages); // Commented out to prevent infinite loop on render
  }

  return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, rowLimit, currentPage, totalPages]);

  // Re-adjust currentPage if it goes out of bounds after filtering
  if (totalPages === 0 && currentPage !== 1) {
    setCurrentPage(1);
  } else if (currentPage > totalPages && totalPages > 0) {
  setCurrentPage(totalPages);
}


return (
  <div>
    <CustomerListStatsGrid />
    <div className = "space-y-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">

      <CustomerListTableHeader 
        nameOptions={nameOptions}
        customerTypeOptions={customerTypeOptions}
        statusOptions={statusOptions}

        currentName={nameFilter}
        currentCustomerType={customerTypeFilter}
        currentStatus={statusFilter}

        handleNameChange={handleNameChange}
        handleCustomerTypeChange={handleCustomerTypeChange}
        handleStatusChange={handleStatusChange}
        iconProps={iconProps}
      />

      <CustomerListTable orders={paginatedOrders} /> 

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

export default CustomerList;