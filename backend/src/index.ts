import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase, testConnection } from './config/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 测试数据库连接
app.get('/', async (req, res) => {
  const connected = await testConnection();
  res.json({ 
    message: '👔 电子衣柜 API 服务运行中!',
    database: connected ? '已连接' : '未连接'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ====================
// 衣物 API 路由
// ====================

// 获取所有衣物
app.get('/api/clothing', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clothing_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 添加衣物
app.post('/api/clothing', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clothing_items')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 更新衣物
app.put('/api/clothing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('clothing_items')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 删除衣物
app.delete('/api/clothing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('clothing_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: '衣物已删除' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ====================
// 分类 API 路由
// ====================

// 获取分类
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  // 启动时测试数据库连接
  await testConnection();
});
