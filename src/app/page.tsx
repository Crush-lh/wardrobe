import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          👔 电子衣柜
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          拍照上传衣服，AI 帮你推荐搭配
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/wardrobe"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            我的衣橱
          </Link>
          <Link 
            href="/create-outfit"
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            创建搭配
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">📸</div>
            <div className="text-sm text-gray-600">拍照上传</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">🏷️</div>
            <div className="text-sm text-gray-600">智能分类</div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl mb-2">✨</div>
            <div className="text-sm text-gray-600">穿搭推荐</div>
          </div>
        </div>
      </div>
    </main>
  );
}
