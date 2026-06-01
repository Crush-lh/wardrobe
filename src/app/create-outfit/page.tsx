import Link from "next/link";

export default function CreateOutfitPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          搭配功能开发中
        </h1>
        <p className="text-gray-600 mb-8">
          请先上传衣服到衣橱，后续会开放搭配功能
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/wardrobe"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            去衣橱
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
