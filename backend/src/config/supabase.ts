import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 配置，请检查 .env 文件');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 测试连接
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('clothing_items').select('count', { count: 'exact', head: true });
    if (error) {
      console.log('⚠️ 数据库表可能尚未创建，请先运行 schema.sql');
      return false;
    }
    console.log('✅ Supabase 连接成功');
    return true;
  } catch (err) {
    console.error('❌ Supabase 连接失败:', err);
    return false;
  }
}
