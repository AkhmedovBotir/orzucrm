import { useState, useMemo } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import AppLayout from '../../components/layout/AppLayout';
import AdminFormModal from '../../components/admins/AdminFormModal';
import DeleteConfirmModal from '../../components/admins/DeleteConfirmModal';
import AdminViewModal from '../../components/admins/AdminViewModal';

const permissions = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'warehouse', label: 'Ombor' },
  { value: 'stores', label: 'Do\'konlar' },
  { value: 'agents', label: 'Agentlar' },
  { value: 'statistics', label: 'Statistika' },
  { value: 'accounting', label: 'Bugalteriya' },
  { value: 'clients', label: 'Mijozlar' },
  { value: 'regions', label: 'Viloyatlar' }
];

// Mock data
const initialAdmins = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    phone: '+998901234567',
    username: 'john_admin',
    status: 'active',
    permissions: ['dashboard', 'warehouse', 'stores']
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+998907654321',
    username: 'jane_admin',
    status: 'inactive',
    permissions: ['dashboard', 'clients', 'regions']
  },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPermissionsDropdown, setShowPermissionsDropdown] = useState(false);

  // Get selected permissions labels
  const selectedPermissionLabels = selectedPermissions.map(
    value => permissions.find(p => p.value === value)?.label
  ).filter(Boolean);

  // Filter admins
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const matchesSearch = 
        admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPermissions = selectedPermissions.length === 0 || 
        selectedPermissions.every(permission => admin.permissions.includes(permission));
      
      const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
      
      return matchesSearch && matchesPermissions && matchesStatus;
    });
  }, [admins, searchTerm, selectedPermissions, statusFilter]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdmins = filteredAdmins.slice(startIndex, endIndex);

  const handleAdd = () => {
    setSelectedAdmin(null);
    setShowModal(true);
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setShowViewModal(true);
  };

  const handleConfirmDelete = () => {
    setAdmins(admins.filter(admin => admin.id !== selectedAdmin.id));
    setShowDeleteModal(false);
    setSelectedAdmin(null);
  };

  const handleSubmit = (formData) => {
    if (selectedAdmin) {
      // Edit existing admin
      setAdmins(admins.map(admin =>
        admin.id === selectedAdmin.id
          ? { ...formData, id: admin.id, password: formData.password || admin.password }
          : admin
      ));
    } else {
      // Add new admin
      setAdmins([...admins, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Adminlar</h1>
            <p className="mt-1 text-sm text-gray-600">
              Tizim administratorlari ro'yxati
            </p>
          </div>
          <button
            onClick={() => handleAdd()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Admin qo'shish
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Qidirish
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ism, familiya yoki telefon"
                  />
                </div>
              </div>

              {/* Permissions Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ruxsatlar
                </label>
                <div>
                  <button
                    type="button"
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onClick={() => setShowPermissionsDropdown(!showPermissionsDropdown)}
                  >
                    <span className="block truncate">
                      {selectedPermissions.length === 0
                        ? 'Ruxsatlarni tanlang'
                        : `${selectedPermissions.length} ta tanlangan`}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </button>
                  
                  {/* Selected permissions tags */}
                  {selectedPermissions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedPermissionLabels.map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dropdown */}
                  {showPermissionsDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {permissions.map((permission) => (
                        <div
                          key={permission.value}
                          className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-50"
                          onClick={() => {
                            setSelectedPermissions(prev =>
                              prev.includes(permission.value)
                                ? prev.filter(p => p !== permission.value)
                                : [...prev, permission.value]
                            );
                          }}
                        >
                          <div className="flex items-center">
                            <span className="flex items-center h-4 w-4 mr-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={selectedPermissions.includes(permission.value)}
                                onChange={() => {}} // Handled by parent div click
                              />
                            </span>
                            <span className={`block truncate ${
                              selectedPermissions.includes(permission.value) ? 'font-semibold' : 'font-normal'
                            }`}>
                              {permission.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Barchasi</option>
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                </select>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPermissions([]);
                    setStatusFilter('all');
                    setShowPermissionsDropdown(false);
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Filterni tozalash
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="bg-gray-50">
              <div className="grid grid-cols-12 px-6 py-3 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-3">Admin</div>
                <div className="col-span-2">Telefon</div>
                <div className="col-span-2">Username</div>
                <div className="col-span-4">Ruxsatlar</div>
                <div className="col-span-1 text-right">Amallar</div>
              </div>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {currentAdmins.map((admin) => (
                <div key={admin.id} className="grid grid-cols-12 px-6 py-4 gap-4 hover:bg-gray-50">
                  <div className="col-span-3">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {admin.firstName} {admin.lastName}
                      </div>
                      <div className={`text-sm ${admin.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {admin.status === 'active' ? 'Faol' : 'Nofaol'}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="text-sm text-gray-900">{admin.phone}</div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="text-sm text-gray-900">{admin.username}</div>
                  </div>
                  <div className="col-span-4 flex items-center">
                    <div className="flex flex-wrap gap-2">
                      {admin.permissions.map(p => (
                        <span
                          key={p}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {permissions.find(perm => perm.value === p)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end items-center space-x-2">
                    <button
                      onClick={() => handleView(admin)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(admin)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {admins.length === 0 && (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">Hozircha adminlar yo'q</div>
            </div>
          )}

          {/* Pagination */}
          {admins.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Oldingi
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keyingi
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Jami <span className="font-medium">{admins.length}</span> ta admindan{' '}
                    <span className="font-medium">{startIndex + 1}</span>-
                    <span className="font-medium">{Math.min(endIndex, admins.length)}</span>{' '}
                    ko'rsatilyapti
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Oldingi</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Keyingi</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Form Modal */}
        <AdminFormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          initialData={selectedAdmin}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          show={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAdmin(null);
          }}
          onConfirm={handleConfirmDelete}
          admin={selectedAdmin}
        />

        {/* View Admin Modal */}
        <AdminViewModal
          show={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedAdmin(null);
          }}
          admin={selectedAdmin}
        />
      </div>
    </>
  );
}
