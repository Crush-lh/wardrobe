import { useState } from 'react'
import ClothingForm from './components/ClothingForm'
import ClothingList from './components/ClothingList'

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setActiveTab('list')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👔</span>
            <h1 className="text-xl font-bold text-gray-800">电子衣柜</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'list' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 我的衣柜
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'add' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ➕ 添加衣物
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto">
        {activeTab === 'list' ? (
          <ClothingList onRefresh={refreshTrigger} />
        ) : (
          <ClothingForm onSuccess={handleAddSuccess} />
        )}
      </main>
    </div>
  )
}

export default App
