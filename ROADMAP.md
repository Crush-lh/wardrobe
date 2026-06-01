# 电子衣柜 - 穿搭推荐系统

**开发模式：** 一小步一小步迭代，每步可验证

---

## Phase 0: 环境准备

### Step 1: 创建项目 ✅
- Next.js 项目已创建
- 安装依赖：supabase-js, @supabase/ssr, uuid
- 已提交到 Git ✅

### Step 2: 配置 Supabase
- 在 Supabase 创建新项目
- 拿到 `SUPABASE_URL` + `SUPABASE_ANON_KEY`
- 配置到项目环境变量

### Step 3: 创建数据库表
创建 `clothes` 表（极简版）：
```sql
create table clothes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid(),
  image_url text not null,
  name text,               -- 用户起的名字，如"黑色卫衣"
  category text,           -- top / bottom / outer / shoes / accessory
  created_at timestamp default now()
);
```
- 开启 RLS（行级安全）策略

### Step 4: 创建 Storage Bucket
- 创建 `clothes-images` bucket
- 配置上传权限
- 测试：能上传图片并拿到 URL

### Step 5: 部署空项目到 Vercel
- 连接 GitHub 仓库
- 配置环境变量
- 确认 `https://你的域名` 能打开

**Phase 0 验收标准：** 能打开网页，Supabase 连接正常，可以手动手写 SQL 插入一条衣服记录并在页面展示出来。

---

## Phase 1: 最小闭环（MVP v0.1 - 能上传+看到图）

### Step 6: 上传图片页面
- 一个拖拽/选择图片的组件
- 上传到 Supabase Storage
- 返回 image_url

### Step 7: 保存到数据库
- 上传成功后，把 `image_url` 写入 `clothes` 表
- 给一个简单的名字输入框（可选填）

### Step 8: 衣橱展示页
- 网格布局展示所有衣服图片
- 从 Supabase 查询 `clothes` 表
- 图片用 `next/image` 或 `img` 展示

### Step 9: 删除单品
- 每张图右上角加个删除按钮
- 删除 Storage 里的图片 + 数据库记录

**Phase 1 验收标准：** 用户可以上传一张自己衣服的照片，在网页上看到一个衣橱网格，能删能看。

---

## Phase 2: 单品打标签（MVP v0.2 - 衣服有属性）

### Step 10: 扩展数据库
给 `clothes` 表加字段：
```sql
alter table clothes add column color text;
alter table clothes add column style text;
alter table clothes add column season text;
alter table clothes add column tags text[];
```

### Step 11: 上传时填表单
- 上传图片后弹表单
- 选择：品类（上衣/裤子/外套/鞋子/配饰）
- 选择：颜色、风格、季节
- 输入：自定义标签

### Step 12: 单品详情/编辑页
- 点击衣服图片进入详情
- 可以修改属性
- 可以换图片

### Step 13: 筛选功能
- 顶部放筛选栏：只看上衣 / 只看裤子 / 只看黑色
- 筛选条件组合查询 Supabase

**Phase 2 验收标准：** 每件衣服有品类+颜色+风格标签，能筛选查看。

---

## Phase 3: 手动搭配（MVP v0.3 - 能组合衣服）

### Step 14: 创建搭配表
```sql
create table outfits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid default auth.uid(),
  top_id uuid references clothes(id),
  bottom_id uuid references clothes(id),
  outer_id uuid references clothes(id),
  shoes_id uuid references clothes(id),
  accessory_id uuid references clothes(id),
  name text,
  occasion text,
  is_favorite boolean default false,
  created_at timestamp default now()
);
```

### Step 15: 搭配界面
- 新建页面：`/create-outfit`
- 从衣橱里选一件上衣 → 选裤子 → 选外套 → 选鞋
- 每一步只展示对应品类的衣服
- 实时预览组合效果

### Step 16: 保存搭配
- 确认组合后保存到 `outfits` 表
- 输入场合标签

### Step 17: 我的搭配页
- 展示所有保存的搭配方案
- 能看到每组搭配用到的衣服图
- 可以收藏/删除

**Phase 3 验收标准：** 用户可以从衣橱里选几件衣服，保存为一个搭配方案，查看历史搭配。

---

## Phase 4: 智能推荐（MVP v0.4 - 系统主动推荐）

### Step 18: 设计推荐规则
先不做 AI，用规则引擎：
- 颜色规则：中性色可以搭任何颜色；蓝色+白色=清爽；同色系=高级感
- 风格规则：休闲+休闲，商务+商务
- 品类规则：上衣+裤子+鞋 是完整搭配；冷天加外套

### Step 19: 实现推荐算法
- 从 `clothes` 表随机取一件上衣
- 根据颜色规则匹配裤子
- 根据风格一致匹配鞋子
- 返回 3-5 个推荐方案

### Step 20: 推荐结果页
- 首页展示"今日推荐"
- 展示 3 套搭配，左右滑动
- 用户点 👍 / 👎 反馈

**Phase 4 验收标准：** 系统能根据衣橱里的衣服自动推荐 3 套搭配。

---

## Phase 5: 增强体验（可选）

- Step 21: 接入天气 API
- Step 22: 接入日历/场合
- Step 23: AI 自动识别衣服属性
- Step 24: 穿搭历史记录
- Step 25: 分享功能

---

## 当前进度

| Phase | 状态 | 完成日期 |
|-------|------|----------|
| Phase 0 | 🔄 进行中 | - |
| Step 1 | ✅ 完成 | 2026-06-01 |
| Step 2 | ⏳ 待开始 | - |
| Step 3 | ⏳ 待开始 | - |
| Step 4 | ⏳ 待开始 | - |
| Step 5 | ⏳ 待开始 | - |
| Phase 1-5 | ⏳ 待开始 | - |

---

## 项目结构

```
wardrobe/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 首页
│   │   ├── wardrobe/         # 衣橱页
│   │   │   └── page.tsx
│   │   ├── upload/           # 上传页
│   │   │   └── page.tsx
│   │   ├── create-outfit/    # 创建搭配（开发中）
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── lib/
│       ├── supabase.ts       # 浏览器端 Supabase 客户端
│       └── supabase-server.ts # 服务端 Supabase 客户端
├── .env.local.example
└── ROADMAP.md
```