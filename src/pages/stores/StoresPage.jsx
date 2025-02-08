import { useState, useMemo, useEffect } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import AppLayout from '../../components/layout/AppLayout';
import StoreFormModal from '../../components/stores/StoreFormModal';
import DeleteConfirmModal from '../../components/stores/DeleteConfirmModal';
import StoreViewModal from '../../components/stores/StoreViewModal';
import StatusChangeModal from '../../components/stores/StatusChangeModal';
import { getStores, updateStoreStatus, createStore, getStore, deleteStore, updateStore } from '../../api/stores';



export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter stores
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [stores, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStores = filteredStores.slice(startIndex, endIndex);

  const handleAdd = () => {
    setSelectedStore(null);
    setShowModal(true);
  };

  const handleEdit = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  const handleDelete = (store) => {
    setSelectedStore(store);
    setShowDeleteModal(true);
  };

  const handleView = async (store) => {
    try {
      const storeData = await getStore(store._id);
      setSelectedStore(storeData);
      setShowViewModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load stores on mount
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const data = await getStores();
        setStores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleSave = async (storeData) => {
    try {
      if (selectedStore) {
        // Edit existing store
        const updatedStore = await updateStore(selectedStore._id, storeData);
        setStores(stores.map(store => 
          store._id === selectedStore._id ? updatedStore : store
        ));
        setShowModal(false);
      } else {
        // Create new store
        const newStore = await createStore(storeData);
        setStores([...stores, newStore]);
        setShowModal(false);
      }
      setSelectedStore(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStore(selectedStore._id);
      setStores(stores.filter(store => store._id !== selectedStore._id));
      setShowDeleteModal(false);
      setSelectedStore(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStoreStatus(selectedStore._id, newStatus);
      setStores(stores.map(store =>
        store._id === selectedStore._id
          ? { ...store, status: newStatus }
          : store
      ));
      setShowStatusModal(false);
      setSelectedStore(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Do'konlar</h1>
            <p className="mt-1 text-sm text-gray-600">
              Do'konlar ro'yxati
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Do'kon qo'shish
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Do'kon nomi, manzil yoki telefon"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
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
                    setStatusFilter('all');
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

        {/* Stores Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Do'kon
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manzil
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStores.map((store) => (
                  <tr key={store._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={`https://backend.milliycrm.uz/${store.image}`}
                            alt={store.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {store.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{store.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{store.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedStore(store);
                          setShowStatusModal(true);
                        }}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          store.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {store.status === 'active' ? 'Faol' : 'Nofaol'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(store)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(store)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(store)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5">
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Oldingi
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Keyingi
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Jami <span className="font-medium">{filteredStores.length}</span> ta do'kon,{' '}
                            <span className="font-medium">{startIndex + 1}</span> dan{' '}
                            <span className="font-medium">{Math.min(endIndex, filteredStores.length)}</span> gacha ko'rsatilmoqda
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Oldingi</span>
                              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            {Array.from({ length: totalPages }).map((_, index) => (
                              <button
                                key={index}
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
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showModal && (
          <StoreFormModal
            store={selectedStore}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmModal
            store={selectedStore}
            onConfirm={handleConfirmDelete}
            onClose={() => setShowDeleteModal(false)}
          />
        )}

        {showViewModal && (
          <StoreViewModal
            store={selectedStore}
            onClose={() => setShowViewModal(false)}
          />
        )}

        {showStatusModal && (
          <StatusChangeModal
            show={showStatusModal}
            store={selectedStore}
            onConfirm={handleStatusChange}
            onClose={() => {
              setShowStatusModal(false);
              setSelectedStore(null);
            }}
          />
        )}
      </div>
    </>
  );
}
