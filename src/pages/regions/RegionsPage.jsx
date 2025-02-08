import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import {
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import RegionFormModal from '../../components/regions/RegionFormModal';
import DeleteConfirmModal from '../../components/regions/DeleteConfirmModal';
import { getRegions, createRegion, updateRegionStatus, deleteRegion, updateRegion } from '../../api/regions';

export default function RegionsPage() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [error, setError] = useState('');

  const itemsPerPage = 20;

  // Filter regions based on search query and status
  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || region.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegions = filteredRegions.slice(startIndex, endIndex);

  const handleAdd = () => {
    setSelectedRegion(null);
    setShowModal(true);
  };

  const handleEdit = (region) => {
    setSelectedRegion(region);
    setShowModal(true);
  };

  const handleDelete = (region) => {
    setSelectedRegion(region);
    setShowDeleteModal(true);
  };

  const handleStatusChange = async (region) => {
    try {
      const newStatus = region.status === 'active' ? 'inactive' : 'active';
      const updatedRegion = await updateRegionStatus(region._id, newStatus);
      setRegions(regions.map(r => 
        r._id === region._id ? updatedRegion : r
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (regionData) => {
    try {
      if (selectedRegion) {
        // Update existing region
        const updatedRegion = await updateRegion(selectedRegion._id, regionData);
        setRegions(regions.map(region =>
          region._id === selectedRegion._id ? updatedRegion : region
        ));
      } else {
        // Add new region
        const newRegion = await createRegion(regionData);
        setRegions([...regions, newRegion]);
      }
      setShowModal(false);
      setSelectedRegion(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmDelete = async (region) => {
    try {
      await deleteRegion(region._id);
      setRegions(regions.filter(r => r._id !== region._id));
      setShowDeleteModal(false);
      setSelectedRegion(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const data = await getRegions();
        setRegions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return (
    <>
      <div className="p-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Viloyatlar</h1>
            <p className="mt-1 text-sm text-gray-600">
              Barcha viloyatlar ro'yxati
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yangi viloyat
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Viloyat nomi bo'yicha qidirish..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">Barcha statuslar</option>
            <option value="active">Faol</option>
            <option value="inactive">Faol emas</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => {
                        setSortConfig(prev => ({
                          key: 'name',
                          direction: prev.key === 'name' && prev.direction === 'asc' ? 'desc' : 'asc'
                        }));
                        const sorted = [...regions].sort((a, b) => {
                          if (sortConfig.key === 'name') {
                            return sortConfig.direction === 'asc' 
                              ? b.name.localeCompare(a.name)
                              : a.name.localeCompare(b.name);
                          }
                          return 0;
                        });
                        setRegions(sorted);
                      }}
                      className="group inline-flex items-center space-x-2 text-gray-500 hover:text-gray-900"
                    >
                      <span>Viloyat nomi</span>
                      <span className="ml-2 flex-none rounded">
                        {sortConfig.key === 'name' ? (
                          sortConfig.direction === 'desc' ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => {
                        setSortConfig(prev => ({
                          key: 'status',
                          direction: prev.key === 'status' && prev.direction === 'asc' ? 'desc' : 'asc'
                        }));
                        const sorted = [...regions].sort((a, b) => {
                          if (sortConfig.key === 'status') {
                            return sortConfig.direction === 'asc' 
                              ? b.status.localeCompare(a.status)
                              : a.status.localeCompare(b.status);
                          }
                          return 0;
                        });
                        setRegions(sorted);
                      }}
                      className="group inline-flex items-center space-x-2 text-gray-500 hover:text-gray-900"
                    >
                      <span>Status</span>
                      <span className="ml-2 flex-none rounded">
                        {sortConfig.key === 'status' ? (
                          sortConfig.direction === 'desc' ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
                    </div>
                  </td>
                </tr>
                ) : currentRegions.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      Viloyatlar topilmadi
                    </td>
                  </tr>
                ) : currentRegions.map((region) => (
                  <tr key={region._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {region.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Switch
                        checked={region.status === 'active'}
                        onChange={() => handleStatusChange(region)}
                        className={`${region.status === 'active' ? 'bg-indigo-600' : 'bg-gray-200'}
                          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${region.status === 'active' ? 'translate-x-5' : 'translate-x-0'}
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(region)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(region)}
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
                  <td colSpan="3">
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
                            Jami <span className="font-medium">{filteredRegions.length}</span> ta viloyat,{' '}
                            <span className="font-medium">{startIndex + 1}</span> dan{' '}
                            <span className="font-medium">{Math.min(endIndex, filteredRegions.length)}</span> gacha ko'rsatilmoqda
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
      </div>

      {/* Modals */}
      {showModal && (
        <RegionFormModal
          region={selectedRegion}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setSelectedRegion(null);
          }}
        />
      )}

      {showDeleteModal && selectedRegion && (
        <DeleteConfirmModal
          region={selectedRegion}
          onConfirm={handleConfirmDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedRegion(null);
          }}
        />
      )}
    </>
  );
}
