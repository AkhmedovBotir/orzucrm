const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RfbmFtZSI6IlN1cGVyIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJwaG9uZSI6Iis5OTg5MDAwMDAwMDAiLCJ1c2VybmFtZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsiRGFzaGJvYXJkIiwiQWRtaW5sYXIiLCJCdWdhbHRlcml5YSIsIkthdGVnb3JpeWFsYXIiLCJNYXhzdWxvdGxhciIsIkRvJ2tvbmxhciIsIkFnZW50bGFyIiwiTWlqb3psYXIiLCJPcHRvbSBidXl1cnRtYSIsIkRvbmEgYnV5dXJ0bWEiLCJCdXl1cnRtYWxhciIsIlN0YXRpc3Rpa2EiXSwiY3JlYXRlZF9hdCI6IjIwMjUtMDItMDVUMDg6Mzc6NTUuMDAwWiIsImlhdCI6MTczODc1NjY5NiwiZXhwIjoxNzcwMjkyNjk2fQ.Lk4KS73ngVEa4mB_y0R_eT9JzjrC9-powjtSpbO818A';

const categories = [
  {
    name: 'Elektronika',
    subcategories: ['Telefonlar', 'Noutbuklar', 'Televizorlar', 'Quloqchinlar']
  },
  {
    name: 'Kiyimlar',
    subcategories: ['Erkaklar uchun', 'Ayollar uchun', 'Bolalar uchun', 'Sport kiyimlari']
  },
  {
    name: 'Oziq-ovqat',
    subcategories: ['Ichimliklar', 'Shirinliklar', 'Sut mahsulotlari', 'Non mahsulotlari']
  },
  {
    name: 'Uy jihozlari',
    subcategories: ['Mebellar', 'Oshxona jihozlari', 'Yoritish uskunalari', 'Gigiyena mahsulotlari']
  }
];

async function addCategoryWithSubcategories(category) {
  try {
    // Add main category
    const categoryResponse = await axios.post('http://localhost:3000/api/categories', 
      { name: category.name },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    console.log(`✅ Kategoriya qo'shildi: ${category.name}`);
    
    // Add subcategories
    for (const subName of category.subcategories) {
      await axios.post('http://localhost:3000/api/categories/sub',
        { 
          category_id: categoryResponse.data.data.id,
          name: subName
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log(`  └─ Subkategoriya qo'shildi: ${subName}`);
    }
  } catch (error) {
    console.error(`❌ Xatolik: ${category.name}`, error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Kategoriyalar qo'shilmoqda...\n');
  
  for (const category of categories) {
    await addCategoryWithSubcategories(category);
    console.log(''); // Empty line for better readability
  }
  
  console.log('\n✨ Barcha kategoriyalar qo'shildi!');
}

main().catch(console.error);
