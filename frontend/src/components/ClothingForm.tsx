import { useState } from 'react';
import { API_URL } from '../config/api';

export default function ClothingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'top',
    color: '',
    season: 'all',
    occasion: 'casual',
    notes: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const clothingData = {
        ...formData,
        user_id: '00000000-0000-0000-0000-000000000001',
        colors: formData.color ? [formData.color] : [],
        style: []
      };

      const response = await fetch(`${API_URL}/api/clothing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clothingData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ 衣物添加成功！');
        setFormData({
          name: '',
          category: 'top',
          color: '',
          season: 'all',
          occasion: 'casual',
          notes: '',
          image_url: ''
        });
        onSuccess?.();
      } else {
        setMessage('❌ 添加失败: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ 网络错误，请检查后端是否运行');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'top', label: '上衣' },
    { value: 'bottom', label: '裤子/裙子' },
    { value: 'shoes', label: '鞋子' },
    { value: 'outerwear', label: '外套' },
    { value: 'accessory', label: '配饰' }
  ];

  const seasons = [
    { value: 'spring', label: '春季' },
    { value: 'summer', label: '夏季' },
    { value: 'autumn', label: '秋季' },
    { value: 'winter', label: '冬季' },
    { value: 'all', label: '四季通用' }
  ];

  const occasions = [
    { value: 'casual', label: '休闲' },
    { value: 'formal', label: '正式' },
    { value: 'sport', label: '运动' },
    { value: 'party', label: '派对' },
    { value: 'work', label: '工作' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">👕 添加衣物</h2>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 图片URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">图片链接</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/your-image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 建议用图床（如 imgbb.com、sm.ms）上传图片后粘贴链接
          </p>
          {formData.image_url && (
            <div className="mt-2">
              <img 
                src={formData.image_url} 
                alt="预览" 
                className="max-h-48 rounded-lg border"
                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
              />
            </div>
          )}
        </div>

        {/* 名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">衣物名称 *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如：白色T恤"
          />
        </div>

        {/* 分类 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* 颜色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">主颜色</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="例如：白色、蓝色、黑色"
          />
        </div>

        {/* 季节 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">适用季节</label>
          <select
            value={formData.season}
            onChange={(e) => setFormData({...formData, season: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {seasons.map(season => (
              <option key={season.value} value={season.value}>{season.label}</option>
            ))}
          </select>
        </div>

        {/* 场合 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">适用场合</label>
          <select
            value={formData.occasion}
            onChange={(e) => setFormData({...formData, occasion: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {occasions.map(occ => (
              <option key={occ.value} value={occ.value}>{occ.label}</option>
            ))}
          </select>
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="品牌、材质、购买日期等..."
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 font-medium"
        >
          {loading ? '⏳ 保存中...' : '💾 保存衣物'}
        </button>
      </form>
    </div>
  );
}
