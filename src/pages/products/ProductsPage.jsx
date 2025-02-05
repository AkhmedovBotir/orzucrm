import { useState, useMemo } from 'react';
import { formatPrice } from '../../utils/format';
import ProductFormModal from '../../components/products/ProductFormModal';
import ProductViewModal from '../../components/products/ProductViewModal';
import DeleteConfirmModal from '../../components/products/DeleteConfirmModal';
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

// Test uchun example data
const initialProducts = [
  {
    id: 1,
    name: 'iPhone 13',
    price: 12000000,
    wholesalePrice: 11000000,
    categoryId: 1,
    subcategoryId: 1,
    quantity: 10,
    images: [
      'https://picsum.photos/200',
      'https://picsum.photos/200',
      'https://picsum.photos/200'
    ]
  },
  {
    id: 2,
    name: 'Samsung Galaxy S21',
    price: 8000000,
    wholesalePrice: 7500000,
    categoryId: 1,
    subcategoryId: 1,
    quantity: 15,
    images: [
      'https://picsum.photos/200',
      'https://picsum.photos/200'
    ]
  }
];

// Test uchun kategoriyalar
const categories = [
  { id: 1, name: 'Telefonlar', type: 'category' },
  { id: 2, name: 'Noutbuklar', type: 'category' },
  { id: 1, name: 'Apple', type: 'subcategory', categoryId: 1 },
  { id: 2, name: 'Samsung', type: 'subcategory', categoryId: 1 },
  { id: 3, name: 'Lenovo', type: 'subcategory', categoryId: 2 },
  { id: 4, name: 'HP', type: 'subcategory', categoryId: 2 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.categoryId === parseInt(selectedCategory);
      const matchesSubcategory = !selectedSubcategory || product.subcategoryId === parseInt(selectedSubcategory);
      const matchesPrice = (!minPrice || product.price >= parseInt(minPrice)) && 
                          (!maxPrice || product.price <= parseInt(maxPrice));
      const matchesQuantity = (!minQuantity || product.quantity >= parseInt(minQuantity)) && 
                             (!maxQuantity || product.quantity <= parseInt(maxQuantity));
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice && matchesQuantity;
    });
  }, [products, searchTerm, selectedCategory, selectedSubcategory, minPrice, maxPrice, minQuantity, maxQuantity]);

  // Get available categories and subcategories
  const availableCategories = [...new Set(products.map(p => p.categoryId))];
  const availableSubcategories = selectedCategory 
    ? [...new Set(products.filter(p => p.categoryId === parseInt(selectedCategory)).map(p => p.subcategoryId))]
    : [...new Set(products.map(p => p.subcategoryId))];

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId && cat.type === 'category');
    return category ? category.name : '';
  };

  const getSubcategoryName = (subcategoryId) => {
    const subcategory = categories.find(cat => cat.id === subcategoryId && cat.type === 'subcategory');
    return subcategory ? subcategory.name : '';
  };

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

  const handleSubmit = (formData) => {
    if (selectedProduct) {
      // Update product
      setProducts(products.map(product =>
        product.id === selectedProduct.id
          ? {
              ...product,
              name: formData.get('name'),
              price: Number(formData.get('price')),
              wholesalePrice: Number(formData.get('wholesalePrice')),
              categoryId: Number(formData.get('categoryId')),
              subcategoryId: Number(formData.get('subcategoryId')),
              quantity: Number(formData.get('quantity')),
              images: formData.getAll('images').map(image => URL.createObjectURL(image))
            }
          : product
      ));
    } else {
      // Create product
      const newProduct = {
        id: Date.now(),
        name: formData.get('name'),
        price: Number(formData.get('price')),
        wholesalePrice: Number(formData.get('wholesalePrice')),
        categoryId: Number(formData.get('categoryId')),
        subcategoryId: Number(formData.get('subcategoryId')),
        quantity: Number(formData.get('quantity')),
        images: formData.getAll('images').map(image => URL.createObjectURL(image))
      };
      setProducts([...products, newProduct]);
    }
    setShowFormModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = () => {
    setProducts(products.filter(product => product.id !== selectedProduct.id));
    setShowDeleteModal(false);
    setSelectedProduct(null);
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
          onClick={handleAdd}
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
                {availableCategories.map((catId) => (
                  <option key={catId} value={catId}>
                    {getCategoryName(catId)}
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
              >
                <option value="">Barchasi</option>
                {availableSubcategories.map((subId) => (
                  <option key={subId} value={subId}>
                    {getSubcategoryName(subId)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700">
                  Min soni
                </label>
                <input
                  type="number"
                  id="minQuantity"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="maxQuantity" className="block text-sm font-medium text-gray-700">
                  Max soni
                </label>
                <input
                  type="number"
                  id="maxQuantity"
                  value={maxQuantity}
                  onChange={(e) => setMaxQuantity(e.target.value)}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                  setMinPrice('');
                  setMaxPrice('');
                  setMinQuantity('');
                  setMaxQuantity('');
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
              <div className="col-span-2">Rasmlar</div>
              <div className="col-span-2">Nomi</div>
              <div className="col-span-2 text-center">Narxi (dona)</div>
              <div className="col-span-2 text-center">Narxi (optom)</div>
              <div className="col-span-1 text-center">Kategoriya</div>
              <div className="col-span-1 text-center">Subkategoriya</div>
              <div className="col-span-1 text-center">Soni</div>
              <div className="col-span-1 text-center">Amallar</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <div key={product.id} className="grid grid-cols-12 px-6 py-4 gap-4 hover:bg-gray-50">
                <div className="col-span-2">
                  <div className="flex -space-x-2">
                    {product.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                    {product.images.length > 3 && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white">
                        <span className="text-xs text-gray-500">+{product.images.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                </div>
                <div className="col-span-2 text-center">
                  <div className="text-sm text-gray-900">{formatPrice(product.wholesalePrice)}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-sm text-gray-900 text-center">{getCategoryName(product.categoryId)}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-sm text-gray-900 text-center">{getSubcategoryName(product.subcategoryId)}</div>
                </div>
                <div className="col-span-1 text-center">
                  <div className="text-sm text-gray-900">{product.quantity}</div>
                </div>
                <div className="col-span-1">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => handleView(product)}
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
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

      <ProductFormModal
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedProduct}
        categories={categories}
      />

      <ProductViewModal
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        categories={categories}
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
    </div>
  );
}
