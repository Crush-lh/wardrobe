import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  image_url: string;
  season: string;
  occasion: string;
  created_at: string;
}

export default function ClothingList({ onRefresh }: { onRefresh?: number }) {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'top', label: '上衣' },
    { value: 'bottom', label: '裤子/裙子' },
    { value: 'shoes', label: '鞋子' },
    { value: 'outerwear', label: '外套' },
    { value: 'accessory', label: '配饰' }
  ];

  useEffect(() => {
    fetchClothing();
  }, [onRefresh]);

  const fetchClothing = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clothing`);
      const result = await response.json();
      if (result.success) {
        setItems(result.data || []);
      }
    } catch (error) {
      console.error('获取衣物失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('确定要删除这件衣物吗？')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/clothing/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-2xl">⏳ 加载中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👔 我的衣柜</h2>
        
        {/* 筛选器 */}
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">👕</div>
          <p className="text-xl mb-2">衣柜还是空的</p>
          <p>快去添加你的第一件衣物吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* 图片 */}
              <div className="aspect-square bg-gray-100 relative">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    👕
                  </div>
                )}
              </div>
              
              {/* 信息 */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {getCategoryLabel(item.category)}
                  </span>
                  <span>{item.color}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {item.season} · {item.occasion}
                </div>
                
                {/* 操作按钮 */}
                <div className="mt-3 flex gap-2">
                  <button 
                    className="flex-1 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    ✏️ 编辑
                  </button>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="flex-1 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
