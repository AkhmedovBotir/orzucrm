import { useState, useEffect } from 'react';
import axios from 'axios';
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
  XMarkIcon
} from '@heroicons/react/24/outline';
import AdminFormModal from '../../components/admins/AdminFormModal';
import DeleteConfirmModal from '../../components/admins/DeleteConfirmModal';

const permissions = [
  { value: 'Dashboard', label: 'Dashboard' },
  { value: 'Adminlar', label: 'Adminlar' },
  { value: 'Bugalteriya', label: 'Bugalteriya' },
  { value: 'Kategoriyalar', label: 'Kategoriyalar' },
  { value: 'Maxsulotlar', label: 'Maxsulotlar' },
  { value: 'Do\'konlar', label: 'Do\'konlar' },
  { value: 'Agentlar', label: 'Agentlar' },
  { value: 'Mijozlar', label: 'Mijozlar' },
  { value: 'Optom buyurtma', label: 'Optom buyurtma' },
  { value: 'Dona buyurtma', label: 'Dona buyurtma' },
  { value: 'Buyurtmalar', label: 'Buyurtmalar' },
  { value: 'Statistika', label: 'Statistika' }
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPermissionsDropdown, setShowPermissionsDropdown] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backend.milliycrm.uz/api/admins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Admins data:', response.data);
      setAdmins(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Adminlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (data) => {
    try {


      await fetchAdmins();
      setShowAddModal(false);
      setSelectedPermissions([]);
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setShowViewModal(true);
  };

  const handleEdit = (admin) => {
    console.log("Editing admin:", admin); // debug
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleUpdateAdmin = async (data) => {
    console.log("Updating admin:", selectedAdmin, data); // debug
    try {
      if (!selectedAdmin?._id) {
        console.error('No admin selected for update');
        return;
      }

      const token = localStorage.getItem('token');
      const formattedData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        username: data.username,
        permissions: data.permissions,
        status: selectedAdmin.status
      };
      
      if (data.password) {
        formattedData.password = data.password;
      }

      await axios.put(
        `https://backend.milliycrm.uz/api/admins/${selectedAdmin._id}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchAdmins();
      setShowEditModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://backend.milliycrm.uz/api/admins/${selectedAdmin._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchAdmins();
      setShowDeleteModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = selectedAdmin.status === 'active' ? 'inactive' : 'active';
      await axios.patch(
        `https://backend.milliycrm.uz/api/admins/${selectedAdmin._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchAdmins();
      setShowStatusModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = !searchTerm || (
      (admin.first_name && admin.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (admin.last_name && admin.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (admin.phone && admin.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (admin.username && admin.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesPermissions = selectedPermissions.length === 0 || 
      selectedPermissions.every(permission => admin.permissions?.some(p => p.toLowerCase() === permission.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;

    return matchesSearch && matchesPermissions && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdmins = filteredAdmins.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Adminlar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Tizim administratorlari ro'yxati
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
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
                    {selectedPermissions.map((value) => {
                      const label = permissions.find(p => p.value === value)?.label;
                      return label ? (
                        <span
                          key={value}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {label}
                        </span>
                      ) : null;
                    })}
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
            <div className="grid grid-cols-10 gap-4 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500">
              <div className="col-span-2">Admin</div>
              <div className="col-span-2">Telefon</div>
              <div className="col-span-2">Username</div>
              <div className="col-span-2">Ruxsatlar</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Amallar</div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {currentAdmins.map((admin) => (
              <div key={admin._id} className="grid grid-cols-10 px-6 py-4 gap-4 hover:bg-gray-50">
                <div className="col-span-2">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {admin.first_name} {admin.last_name}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="text-sm text-gray-900">{admin.phone}</div>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="text-sm text-gray-900">{admin.username}</div>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="flex flex-wrap gap-1">
                    {admin.permissions?.map(p => {
                      const label = permissions.find(perm => 
                        perm.value.toLowerCase() === p.toLowerCase() ||
                        perm.label.toLowerCase() === p.toLowerCase()
                      )?.label;
                      return label ? (
                        <span
                          key={p}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="col-span-1 flex items-center">
                  <button
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setShowStatusModal(true);
                    }}
                    className={admin.status === 'active'
                      ? 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'
                      : 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'
                    }
                  >
                    {admin.status === 'active' ? 'Faol' : 'Nofaol'}
                  </button>
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
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setShowDeleteModal(true);
                    }}
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Oldingi
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Oldingi</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

      {/* Add Admin Modal */}
      <AdminFormModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAdmin}
        title="Admin qo'shish"
      />

      {/* Edit Admin Modal */}
      <AdminFormModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAdmin(null);
        }}
        onSubmit={handleUpdateAdmin}
        title="Admin ma'lumotlarini tahrirlash"
        initialData={selectedAdmin ? {
          firstName: selectedAdmin.first_name,
          lastName: selectedAdmin.last_name,
          phone: selectedAdmin.phone,
          username: selectedAdmin.username,
          permissions: selectedAdmin.permissions || []
        } : null}
      />

      {/* View Admin Modal */}
      {showViewModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => {
                setShowViewModal(false);
                setSelectedAdmin(null);
              }}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Close button */}
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedAdmin(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Admin ma'lumotlari
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ism</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedAdmin.first_name}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Familiya</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedAdmin.last_name}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Telefon</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedAdmin.phone}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Username</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedAdmin.username}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className={`mt-1 text-sm ${selectedAdmin.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedAdmin.status === 'active' ? 'Faol' : 'Nofaol'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Ruxsatlar</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedAdmin.permissions?.map(p => {
                        const label = permissions.find(perm => 
                          perm.value.toLowerCase() === p.toLowerCase() ||
                          perm.label.toLowerCase() === p.toLowerCase()
                        )?.label;
                        return label ? (
                          <span
                            key={p}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedAdmin(null);
                    }}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAdmin(null);
        }}
        onConfirm={handleDeleteAdmin}
      />

      {/* Status Change Modal */}
      {showStatusModal && selectedAdmin && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Admin statusini o'zgartirish
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedAdmin.first_name} {selectedAdmin.last_name} statusini{' '}
                        {selectedAdmin.status === 'active' ? 'nofaol' : 'faol'} holatga o'zgartirishni xohlaysizmi?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleStatusChange}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  O'zgartirish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedAdmin(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
