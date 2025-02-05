import { useRef, useState, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function ProductFormModal({ show, onClose, onSubmit, initialData, categories }) {
  const [selectedCategory, setSelectedCategory] = useState(initialData?.categoryId || '');
  const formRef = useRef(null);
  const imageRef = useRef(null);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    wholesalePrice: initialData?.wholesalePrice || '',
    quantity: initialData?.quantity || '',
  });

  useEffect(() => {
    if (initialData) {
      setSelectedCategory(initialData.categoryId);
      setImages(initialData.images ? [initialData.images] : []);
      setFormData({
        name: initialData.name,
        price: initialData.price,
        wholesalePrice: initialData.wholesalePrice,
        quantity: initialData.quantity,
      });
    } else {
      setSelectedCategory('');
      setImages([]);
      setFormData({
        name: '',
        price: '',
        wholesalePrice: '',
        quantity: '',
      });
    }
  }, [initialData]);

  if (!show) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData(formRef.current);
    
    // Rasmlarni formData ga qo'shish
    images.forEach((image, index) => {
      if (image.file) {
        formDataToSend.append(`image${index}`, image.file);
      }
    });
    
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('wholesalePrice', formData.wholesalePrice);
    formDataToSend.append('quantity', formData.quantity);
    
    onSubmit(formDataToSend);
  };

  const getSubcategories = () => {
    return categories.filter(cat => 
      cat.type === 'subcategory' && 
      cat.categoryId === Number(selectedCategory)
    );
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rasmlar
                </label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview || image}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-32 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="h-32 w-32">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer block h-full"
                    >
                      <div className="h-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                      </div>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        ref={imageRef}
                        accept="image/*"
                        multiple
                      />
                    </label>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG formatlar (max. 2MB)
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomi
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Narxi (dona)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="wholesalePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Narxi (optom)
                  </label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    id="wholesalePrice"
                    required
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, wholesalePrice: e.target.value }))}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <select
                    name="categoryId"
                    id="categoryId"
                    required
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Tanlang</option>
                    {categories
                      .filter(cat => cat.type === 'category')
                      .map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    Subkategoriya
                  </label>
                  <select
                    name="subcategoryId"
                    id="subcategoryId"
                    required
                    defaultValue={initialData?.subcategoryId}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={!selectedCategory}
                  >
                    <option value="">Tanlang</option>
                    {getSubcategories().map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Soni
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {initialData ? 'Saqlash' : 'Qo\'shish'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
