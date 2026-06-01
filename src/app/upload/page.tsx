'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('top');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `clothes/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('clothes-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('clothes-images')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase.from('clothes').insert({
        image_url: urlData.publicUrl,
        name: name || null,
        category: category,
      });

      if (dbError) throw dbError;

      router.push('/wardrobe');
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请检查 Supabase 配置');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">上传衣服</h1>
        <p className="text-gray-600 mb-8">拍照或选择图片上传到衣橱</p>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              衣服照片
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer block"
              >
                {file ? (
                  <div className="text-gray-800">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">点击更换图片</p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="font-medium">点击选择图片</p>
                    <p className="text-sm">或将图片拖到这里</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名称（可选）
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：黑色卫衣"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              品类
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="top">上衣</option>
              <option value="bottom">裤子/裙子</option>
              <option value="outer">外套</option>
              <option value="shoes">鞋子</option>
              <option value="accessory">配饰</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => router.push('/wardrobe')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '上传中...' : '上传'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
