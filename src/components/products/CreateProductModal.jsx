import { useState, useEffect } from 'react';
import { createProduct } from '../../api/products';
import { getCategoryWithSubs } from '../../api/categories';

export default function CreateProductModal({ show, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    quantity: '',
    packageQuantity: '',
    price: '',
    status: 'active',
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Kategoriyalarni yuklash
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://backend.milliycrm.uz/api/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Kategoriya tanlanganda subkategoriyalarni yuklash
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.category) {
        try {
          const categoryData = await getCategoryWithSubs(formData.category);
          setSubcategories(categoryData.subcategories);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      }
    };
    fetchSubcategories();
  }, [formData.category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, {
          file,
          preview: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      selectedImages.forEach(image => {
        formDataToSend.append('images', image.file);
      });

      const response = await createProduct(formDataToSend);
      if (response.success) {
        onSuccess(response.data);
        onClose();
        setFormData({
          name: '',
          category: '',
          subcategory: '',
          quantity: '',
          packageQuantity: '',
          price: '',
          status: 'active',
          images: null
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Yangi mahsulot qo'shish</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nomi</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kategoriya</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Tanlang</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subkategoriya</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                disabled={!formData.category}
              >
                <option value="">Tanlang</option>
                {subcategories.map(subcategory => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Soni</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Optom soni <span className='text-xs text-gray-500'>(Ya'ni 1 qadoqda nechta mahsulot bo'lishi)</span></label>
              <input
                type="number"
                name="packageQuantity"
                value={formData.packageQuantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Narxi</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Rasmlar</label>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Rasm qo'shish
                  <input
                    type="file"
                    name="images"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    multiple
                  />
                </label>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="flex gap-4 flex-wrap pb-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 mt-3 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute z-100 -top-0 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
