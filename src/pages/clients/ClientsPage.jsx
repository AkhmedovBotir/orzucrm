import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline';
import ClientFormModal from '../../components/clients/ClientFormModal';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import ClientViewModal from '../../components/clients/ClientViewModal';

import { getClients, createClient, updateClient, deleteClient, updateClientStatus } from '../../api/clients';
import { getRegions } from '../../api/regions';
import { getStores } from '../../api/stores';

export default function ClientsPage() {
  // States
  const [clients, setClients] = useState([]);
  const [regions, setRegions] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const itemsPerPage = 10;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [clientsData, regionsData, storesData] = await Promise.all([
          getClients(),
          getRegions(),
          getStores()
        ]);
        setClients(clientsData);
        setRegions(regionsData);
        setStores(storesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = !selectedRegion || client.region._id === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
  };

  // Handle client operations
  const handleCreateClient = async (data) => {
    try {
      const newClient = await createClient(data);
      setClients([...clients, newClient]);
      setShowFormModal(false);
    } catch (err) {
      setError(err.message);
    }
  };



  const handleUpdateClient = async (data) => {
    try {
      const updatedClient = await updateClient(selectedClient._id, {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        region: data.region,
        store: data.store
      });
      setClients(clients.map(client => 
        client._id === selectedClient._id
          ? { ...client, ...updatedClient.data }
          : client
      ));
      setShowFormModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await deleteClient(clientId);
      setClients(clients.filter(client => client._id !== clientId));
      setShowDeleteModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setSelectedClient(null);
    setModalMode('create');
    setShowFormModal(true);
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setModalMode('edit');
    setShowFormModal(true);
  };

  const openViewModal = (client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Mijozlar</h1>
          <p className="mt-2 text-sm text-gray-700">
            Barcha mijozlar ro'yxati
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Yangi mijoz
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filterlar</h3>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <XMarkIcon className="h-4 w-4 mr-1.5" />
                Tozalash
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Qidirish
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ism, telefon yoki do'kon nomi"
                  />
                </div>
              </div>

              {/* Region filter */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                  Viloyat
                </label>
                <select
                  id="region"
                  name="region"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Barchasi</option>
                  {regions.map((region) => (
                    <option key={region._id} value={region._id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      <button 
                        onClick={() => {
                          const sorted = [...clients].sort((a, b) => 
                            `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
                          );
                          setClients(sorted);
                        }}
                        className="group inline-flex items-center space-x-2 text-gray-900"
                      >
                        <span>Ism va familya</span>
                        <ChevronUpIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <button 
                        onClick={() => {
                          setSortConfig(prev => ({
                            key: 'phone',
                            direction: prev.key === 'phone' && prev.direction === 'asc' ? 'desc' : 'asc'
                          }));
                          const sorted = [...clients].sort((a, b) => {
                            if (sortConfig.key === 'phone') {
                              return sortConfig.direction === 'asc' 
                                ? b.phone.localeCompare(a.phone)
                                : a.phone.localeCompare(b.phone);
                            }
                            return 0;
                          });
                          setClients(sorted);
                        }}
                        className="group inline-flex items-center space-x-2 text-gray-900"
                      >
                        <span>Telefon raqam</span>
                        {sortConfig.key === 'phone' ? (
                          sortConfig.direction === 'desc' ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <button 
                        onClick={() => {
                          setSortConfig(prev => ({
                            key: 'region',
                            direction: prev.key === 'region' && prev.direction === 'asc' ? 'desc' : 'asc'
                          }));
                          const sorted = [...clients].sort((a, b) => {
                            if (sortConfig.key === 'region') {
                              const aName = a.region?.name || '';
                              const bName = b.region?.name || '';
                              return sortConfig.direction === 'asc' 
                                ? bName.localeCompare(aName)
                                : aName.localeCompare(bName);
                            }
                            return 0;
                          });
                          setClients(sorted);
                        }}
                        className="group inline-flex items-center space-x-2 text-gray-900"
                      >
                        <span>Viloyat</span>
                        {sortConfig.key === 'region' ? (
                          sortConfig.direction === 'desc' ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <button 
                        onClick={() => {
                          setSortConfig(prev => ({
                            key: 'store',
                            direction: prev.key === 'store' && prev.direction === 'asc' ? 'desc' : 'asc'
                          }));
                          const sorted = [...clients].sort((a, b) => {
                            if (sortConfig.key === 'store') {
                              const aName = a.store?.name || '';
                              const bName = b.store?.name || '';
                              return sortConfig.direction === 'asc' 
                                ? bName.localeCompare(aName)
                                : aName.localeCompare(bName);
                            }
                            return 0;
                          });
                          setClients(sorted);
                        }}
                        className="group inline-flex items-center space-x-2 text-gray-900"
                      >
                        <span>Do'kon nomi</span>
                        {sortConfig.key === 'store' ? (
                          sortConfig.direction === 'desc' ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Amallar</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : paginatedClients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        Mijozlar topilmadi
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((client) => (
                      <tr key={client._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {`${client.first_name} ${client.last_name}`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {client.phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {client.region?.name || 'Viloyat mavjud emas'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {client.store?.name || 'Do\'kon mavjud emas'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button
                            onClick={async () => {
                              try {
                                const newStatus = client.status === 'active' ? 'inactive' : 'active';
                                await updateClientStatus(client._id, newStatus);
                                setClients(clients.map(c => 
                                  c._id === client._id 
                                    ? { ...c, status: newStatus }
                                    : c
                                ));
                              } catch (error) {
                                setError(error.message);
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${client.status === 'active' ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            role="switch"
                            aria-checked={client.status === 'active'}
                          >
                            <span className="sr-only">Status o'zgartirish</span>
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${client.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                          </button>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => openViewModal(client)}
                            className="text-gray-400 hover:text-gray-500 mx-2"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(client)}
                            className="text-indigo-600 hover:text-indigo-900 mx-2"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(client)}
                            className="text-red-600 hover:text-red-900 mx-2"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
              </table>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Oldingi
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Keyingi
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Jami <span className="font-medium">{filteredClients.length}</span> tadan{' '}
                      <span className="font-medium">{startIndex + 1}</span> dan{' '}
                      <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredClients.length)}</span> gacha ko'rsatilmoqda
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Oldingi</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === currentPage
                              ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Keyingi</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Form Modal */}
      {showFormModal && (
        <ClientFormModal
          client={selectedClient}
          regions={regions}
          stores={stores}
          onSave={modalMode === 'create' ? handleCreateClient : handleUpdateClient}
          onClose={() => setShowFormModal(false)}
        />
      )}

      {/* Client View Modal */}
      {showViewModal && selectedClient && (
        <ClientViewModal
          clientId={selectedClient._id}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteClient(selectedClient?._id)}
        title="Mijozni o'chirish"
        message="Rostdan ham bu mijozni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
      />
    </div>
  );
}
