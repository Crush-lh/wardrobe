import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function WardrobePage() {
  const supabase = await createClient();
  
  // Fetch all clothes (in real app, filter by user_id)
  const { data: clothes, error } = await supabase
    .from("clothes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">我的衣橱</h1>
            <p className="text-gray-600 mt-1">管理你的所有衣服</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← 首页
            </Link>
            <Link
              href="/upload"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              + 上传衣服
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {(!clothes || clothes.length === 0) && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">👕</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              衣橱还是空的
            </h2>
            <p className="text-gray-500 mb-6">
              上传你的第一件衣服，开始管理你的电子衣柜
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              上传衣服
            </Link>
          </div>
        )}

        {/* Clothes Grid */}
        {clothes && clothes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {clothes.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name || "衣服"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      👕
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800">
                    {item.name || "未命名"}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {item.category || "未分类"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
