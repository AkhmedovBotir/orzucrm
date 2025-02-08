import { useState, useMemo, useEffect } from 'react';
import { formatPrice } from '../../utils/format';
// import ProductFormModal from '../../components/products/ProductFormModal';
import ProductViewModal from '../../components/products/ProductViewModal';
import EditProductModal from '../../components/products/EditProductModal';
import CreateProductModal from '../../components/products/CreateProductModal';
import DeleteConfirmModal from '../../components/products/DeleteConfirmModal';
import StatusChangeModal from '../../components/products/StatusChangeModal';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

import { getProducts, updateProductStatus, deleteProduct } from '../../api/products';
import { getCategoryWithSubs } from '../../api/categories';
import { Avatar } from '@mui/material';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
      const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
      const matchesStatus = !selectedStatus || product.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedSubcategory, selectedStatus]);

  // Fetch products and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);

        // Fetch subcategories for each unique category
        const uniqueCategories = [...new Set(data.map(product => product.category?._id))].filter(Boolean);
        const subcategoriesMap = {};

        for (const categoryId of uniqueCategories) {
          const categoryData = await getCategoryWithSubs(categoryId);
          subcategoriesMap[categoryId] = categoryData.subcategories;
        }

        setSubcategories(subcategoriesMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowFormModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowFormModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleStatusChange = (product) => {
    setSelectedProduct(product);
    setShowStatusModal(true);
  };

  const handleStatusConfirm = async () => {
    try {
      const newStatus = selectedProduct.status === 'active' ? 'inactive' : 'active';
      await updateProductStatus(selectedProduct._id, newStatus);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setShowStatusModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product status:', error);
      setError(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(selectedProduct._id);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Maxsulotlar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Barcha maxsulotlar ro'yxati
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Maxsulot qo'shish
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  placeholder="Maxsulot nomi"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategoriya
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('');
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Barchasi</option>
                {products
                  .reduce((acc, product) => {
                    if (product.category && !acc.find(cat => cat._id === product.category._id)) {
                      acc.push(product.category);
                    }
                    return acc;
                  }, [])
                  .map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Subcategory Filter */}
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Subkategoriya
              </label>
              <select
                id="subcategory"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={!selectedCategory}
              >
                <option value="">Barchasi</option>
                {selectedCategory && subcategories[selectedCategory]?.map(subcategory => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Barchasi</option>
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                  setSelectedStatus('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filterni tozalash
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-12 px-6 py-3 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">Rasm</div>
              <div className="col-span-2">
                <button 
                  onClick={() => {
                    const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
                    setProducts(sorted);
                  }}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Nomi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              </div>
              <div className="col-span-2 text-center">
                <button 
                  onClick={() => {
                    const sorted = [...products].sort((a, b) => a.category?.name.localeCompare(b.category?.name));
                    setProducts(sorted);
                  }}
                  className="flex items-center justify-center space-x-1 hover:text-gray-700"
                >
                  <span>Kategoriya</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              </div>
              <div className="col-span-2 text-center">Subkategoriya</div>
              <div className="col-span-1 text-center">
                <button 
                  onClick={() => {
                    const sorted = [...products].sort((a, b) => a.status.localeCompare(b.status));
                    setProducts(sorted);
                  }}
                  className="flex items-center justify-center space-x-1 hover:text-gray-700"
                >
                  <span>Status</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              </div>
              <div className="col-span-1 text-center">
                <button 
                  onClick={() => {
                    const sorted = [...products].sort((a, b) => a.quantity - b.quantity);
                    setProducts(sorted);
                  }}
                  className="flex items-center justify-center space-x-1 hover:text-gray-700"
                >
                  <span>Soni</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              </div>
              <div className="col-span-1 text-center">
                <button 
                  onClick={() => {
                    const sorted = [...products].sort((a, b) => a.packageQuantity - b.packageQuantity);
                    setProducts(sorted);
                  }}
                  className="flex items-center justify-center space-x-1 hover:text-gray-700"
                >
                  <span>Optom soni</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              </div>
              <div className="col-span-2 text-center">Amallar</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <div key={product._id} className="grid grid-cols-12 px-6 py-4 gap-4 hover:bg-gray-50">
                <div className="col-span-1">
                  <div className="w-12 h-12">
                    {product.images.length > 0 ? (
                      <img
                        src={`https://backend.milliycrm.uz/${product.images[0]}`}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <Avatar className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-900 text-center">{product.category?.name}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-900 text-center">
                    {product.category && subcategories[product.category._id]?.find(sub => sub._id === product.subcategory)?.name || '-'}
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleStatusChange(product)}
                      className={`${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 text-xs font-medium rounded-full`}
                    >
                      {product.status === 'active' ? 'Faol' : 'Nofaol'}
                    </button>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <div className="text-sm text-gray-900">{product.quantity}</div>
                </div>
                <div className="col-span-1 text-center">
                  <div className="text-sm text-gray-900">{product.packageQuantity}</div>
                </div>
                <div className="col-span-2">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowViewModal(true);
                      }}
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowEditModal(true);
                      }}
                      className="text-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Oldingi
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Keyingi
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Jami <span className="font-medium">{filteredProducts.length}</span> ta maxsulotdan{' '}
                  <span className="font-medium">{indexOfFirstProduct + 1}</span> dan{' '}
                  <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> gacha
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="sr-only">Oldingi</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
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
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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

      {/* <ProductFormModal
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedProduct}
        categories={categories}
      />
      */}

      <ProductViewModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <CreateProductModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={async () => {
          const data = await getProducts();
          setProducts(data);
        }}
      />

      <EditProductModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSuccess={async () => {
          const data = await getProducts();
          setProducts(data);
        }}
        product={selectedProduct}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        product={selectedProduct}
      />

      <StatusChangeModal
        show={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleStatusConfirm}
        product={selectedProduct}
      />
    </div>
  );
}
