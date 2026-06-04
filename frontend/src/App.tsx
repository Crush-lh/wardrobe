import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          👔 电子衣柜
        </h1>
        <p className="text-gray-600 mb-8">
          智能穿搭推荐系统
        </p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => setCount((count) => count + 1)}
        >
          点击了 {count} 次
        </button>
      </div>
    </div>
  )
}

export default App
