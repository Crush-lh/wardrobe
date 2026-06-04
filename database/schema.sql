-- ============================================
-- 电子衣柜数据库 Schema
-- 在 Supabase SQL Editor 中运行此文件
-- ============================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用户扩展表 (Supabase Auth 自带 users 表，这里扩展 profile 信息)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 衣物分类表
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 衣物表 (核心表)
CREATE TABLE IF NOT EXISTS public.clothing_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category TEXT NOT NULL,           -- top, bottom, shoes, outerwear, accessory
  color TEXT,                       -- 主颜色
  colors TEXT[],                    -- 多颜色数组
  season TEXT,                      -- spring, summer, autumn, winter, all
  occasion TEXT,                    -- casual, formal, sport, party, work
  style TEXT[],                     -- 风格标签
  image_url TEXT,                   -- 主图片URL
  thumbnail_url TEXT,               -- 缩略图
  brand TEXT,                       -- 品牌
  material TEXT,                    -- 材质
  is_favorite BOOLEAN DEFAULT FALSE,
  wear_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 穿搭表
CREATE TABLE IF NOT EXISTS public.outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  items UUID[],                     -- 衣物ID数组
  occasion TEXT,
  season TEXT,
  weather_type TEXT,                -- sunny, rainy, cloudy, cold
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_favorite BOOLEAN DEFAULT FALSE,
  wear_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 穿搭记录表 (日历)
CREATE TABLE IF NOT EXISTS public.outfit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  outfit_id UUID REFERENCES public.outfits(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  weather TEXT,
  temperature INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 索引 (提高查询性能)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_clothing_items_user_id ON public.clothing_items(user_id);
CREATE INDEX IF NOT EXISTS idx_clothing_items_category ON public.clothing_items(category);
CREATE INDEX IF NOT EXISTS idx_clothing_items_color ON public.clothing_items(color);
CREATE INDEX IF NOT EXISTS idx_clothing_items_season ON public.clothing_items(season);

CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON public.outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_weather ON public.outfits(weather_type);

CREATE INDEX IF NOT EXISTS idx_outfit_logs_date ON public.outfit_logs(date);
CREATE INDEX IF NOT EXISTS idx_outfit_logs_user_date ON public.outfit_logs(user_id, date);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- ============================================
-- 行级安全 (RLS) 策略
-- 每个用户只能看到自己的数据
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- profiles 表策略
CREATE POLICY "Users can only view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can only update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- clothing_items 表策略
CREATE POLICY "Users can only view their own clothing" 
  ON public.clothing_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own clothing" 
  ON public.clothing_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own clothing" 
  ON public.clothing_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own clothing" 
  ON public.clothing_items FOR DELETE USING (auth.uid() = user_id);

-- outfits 表策略
CREATE POLICY "Users can only view their own outfits" 
  ON public.outfits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own outfits" 
  ON public.outfits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own outfits" 
  ON public.outfits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own outfits" 
  ON public.outfits FOR DELETE USING (auth.uid() = user_id);

-- outfit_logs 表策略
CREATE POLICY "Users can only view their own logs" 
  ON public.outfit_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own logs" 
  ON public.outfit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own logs" 
  ON public.outfit_logs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own logs" 
  ON public.outfit_logs FOR DELETE USING (auth.uid() = user_id);

-- categories 表策略
CREATE POLICY "Users can only view their own categories" 
  ON public.categories FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own categories" 
  ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own categories" 
  ON public.categories FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own categories" 
  ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 默认分类数据 (可选，每个用户创建后自动插入)
-- ============================================
-- 注意：这条数据需要通过应用层插入，因为 user_id 需要动态获取

-- ============================================
-- 触发器：自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clothing_items_updated_at
  BEFORE UPDATE ON public.clothing_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_outfits_updated_at
  BEFORE UPDATE ON public.outfits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Schema 创建完成！
-- ============================================
