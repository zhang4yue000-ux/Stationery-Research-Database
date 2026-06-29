/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  TrendingUp, 
  BookMarked,
  Layers,
  ArrowRight,
  Sparkles,
  Scale,
  BrainCircuit,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { Brand, Product, Material, Craft } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  brands: Brand[];
  products: Product[];
  materials: Material[];
  crafts: Craft[];
  onNavigate: (tab: any, selectedId?: string) => void;
  onAddTrigger: (category: 'brand' | 'product' | 'material' | 'craft') => void;
}

export default function Dashboard({ 
  brands, 
  products, 
  materials, 
  crafts, 
  onNavigate,
  onAddTrigger
}: DashboardProps) {
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{
    brands: Brand[];
    products: Product[];
    materials: Material[];
    crafts: Craft[];
  } | null>(null);

  // Spotlight pagination index
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGlobalSearch(val);
    if (!val.trim()) {
      setSearchResults(null);
      return;
    }

    const query = val.toLowerCase();
    const filteredBrands = brands.filter(b => 
      b.name.toLowerCase().includes(query) || 
      b.englishName.toLowerCase().includes(query) ||
      b.brandStory.toLowerCase().includes(query) ||
      b.tags.some(t => t.toLowerCase().includes(query))
    );

    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.paperType.toLowerCase().includes(query) || 
      p.notes.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );

    const filteredMaterials = materials.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.features.toLowerCase().includes(query) ||
      m.tags.some(t => t.toLowerCase().includes(query))
    );

    const filteredCrafts = crafts.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.definition.toLowerCase().includes(query)
    );

    setSearchResults({
      brands: filteredBrands,
      products: filteredProducts,
      materials: filteredMaterials,
      crafts: filteredCrafts
    });
  };

  // Chart data calculations
  const countryCounts = brands.reduce((acc, b) => {
    acc[b.country] = (acc[b.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryChartData = Object.entries(countryCounts).map(([name, value]) => ({
    name: name === 'Japan' ? '日本' : name === 'China' ? '中国' : name === 'France' ? '法国' : name,
    value
  }));

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryCounts).map(([name, value]) => {
    const mapped = name === 'Notebook' ? '笔记本' : name === 'Planner' ? '手帐/日程' : name === 'Writing Instrument' ? '书写工具' : name;
    return { name: mapped, value };
  });

  const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#cbd5e1'];

  // Safe Spotlight rotation from brand array
  const activeSpotlightBrand = brands[spotlightIndex % brands.length] || brands[0];

  // Pick a featured material from db
  const featuredMaterial = materials[0] || {
    name: '巴川纸 Tomoe River 52g',
    category: '特种内页书写纸',
    origin: '日本',
    features: '极薄坚韧、不化墨，钢笔试纸之皇',
    tags: ['超薄', '防洇墨', '轻量化']
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 px-8 py-8">
      
      {/* Top Banner Header: Minimal and Sleek */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 bg-zinc-200/60 px-2.5 py-0.5 rounded-full font-bold uppercase">
              Stationery Research Core • STRC
            </span>
          </div>
          <h2 className="font-sans font-extrabold text-3xl text-zinc-900 tracking-tight flex items-center gap-2">
            文具工业研究控制台
          </h2>
          <p className="font-sans text-[13px] text-zinc-500 mt-1 max-w-2xl">
            基于「纸张物理阻尼与工艺谱系」的交互控制台。汇集全球大师本册装帧、特种防洇涂层及制本规范。
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            id="quick-add-brand-btn"
            onClick={() => onAddTrigger('brand')}
            className="flex items-center gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>补充品牌档案</span>
          </button>
          <button 
            id="quick-compare-btn"
            onClick={() => onNavigate('comparison')}
            className="flex items-center gap-1.5 bg-white text-zinc-900 hover:bg-zinc-50 px-4 py-2 rounded-xl text-[12px] font-semibold border border-zinc-200 transition-all shadow-sm"
          >
            <Scale className="w-4 h-4 text-zinc-400" />
            <span>纸品横向比</span>
          </button>
        </div>
      </div>

      {/* Global Unified Action Search Panel */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-8 shadow-sm">
        <h4 className="font-sans text-[13px] font-bold text-zinc-800 mb-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="uppercase tracking-wider">全景交叉搜索引擎</span>
        </h4>
        <div className="relative">
          <input
            id="dashboard-global-search"
            type="text"
            className="w-full bg-zinc-100/50 border border-zinc-200 rounded-xl py-3 pl-11 pr-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all"
            placeholder="搜索品牌故事、主打作 (如 Traveler's)、内页材质 (如巴川纸)、压凸工艺、或者莫兰迪色系..."
            value={globalSearch}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
          {globalSearch && (
            <button 
              onClick={() => { setGlobalSearch(''); setSearchResults(null); }}
              className="absolute right-4 top-3.5 text-xs text-zinc-400 hover:text-zinc-900 font-sans font-medium"
            >
              清除
            </button>
          )}
        </div>

        {/* Global Search Results Overlay Panel */}
        {searchResults && (
          <div className="mt-4 border-t border-zinc-200 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto">
            {/* Brands matched */}
            <div className="space-y-2">
              <h5 className="font-sans text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                匹配品牌 ({searchResults.brands.length})
              </h5>
              {searchResults.brands.length > 0 ? (
                searchResults.brands.map(b => (
                  <div 
                    key={b.id} 
                    onClick={() => onNavigate('brands', b.id)}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-white cursor-pointer transition flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-sans font-semibold text-[13px] text-zinc-800">{b.name}</div>
                      <div className="font-mono text-[9px] text-zinc-400 font-medium">{b.englishName} ({b.country})</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 group-hover:translate-x-0.5 transition" />
                  </div>
                ))
              ) : <div className="text-xs text-zinc-400 py-1 font-mono">No matching brands</div>}
            </div>

            {/* Products matched */}
            <div className="space-y-2">
              <h5 className="font-sans text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                匹配款式 ({searchResults.products.length})
              </h5>
              {searchResults.products.length > 0 ? (
                searchResults.products.map(p => {
                  const br = brands.find(b => b.id === p.brandId);
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => onNavigate('products', p.id)}
                      className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-white cursor-pointer transition flex justify-between items-center group"
                    >
                      <div>
                        <div className="font-sans font-semibold text-[13px] text-zinc-800">{p.name}</div>
                        <div className="font-mono text-[9px] text-zinc-400">品牌: {br?.name || '研发定制'}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 group-hover:translate-x-0.5 transition" />
                    </div>
                  );
                })
              ) : <div className="text-xs text-zinc-400 py-1 font-mono">No matching models</div>}
            </div>

            {/* Materials matched */}
            <div className="space-y-2">
              <h5 className="font-sans text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                匹配材质粘度 ({searchResults.materials.length})
              </h5>
              {searchResults.materials.length > 0 ? (
                searchResults.materials.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => onNavigate('materials', m.id)}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-white cursor-pointer transition flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-sans font-semibold text-[13px] text-zinc-800">{m.name}</div>
                      <div className="font-mono text-[9px] text-zinc-400">{m.category} • {m.origin}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 group-hover:translate-x-0.5 transition" />
                  </div>
                ))
              ) : <div className="text-xs text-zinc-400 py-1 font-mono">No matching materials</div>}
            </div>

            {/* Crafts matched */}
            <div className="space-y-2">
              <h5 className="font-sans text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                匹配工艺细节 ({searchResults.crafts.length})
              </h5>
              {searchResults.crafts.length > 0 ? (
                searchResults.crafts.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => onNavigate('crafts', c.id)}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-white cursor-pointer transition flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-sans font-semibold text-[13px] text-zinc-800">{c.name}</div>
                      <div className="font-mono text-[9px] text-zinc-400">开模成本: {c.costLevel === 'High' ? '高奢' : '普通'}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-800 group-hover:translate-x-0.5 transition" />
                  </div>
                ))
              ) : <div className="text-xs text-zinc-400 py-1 font-mono">No matching crafts</div>}
            </div>
          </div>
        )}
      </div>

      {/* CORE BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Component 1: Brand Spotlight (Spans 2 columns, 2 rows) */}
        {activeSpotlightBrand ? (
          <div className="col-span-1 md:col-span-2 row-span-2 bg-white border border-zinc-200 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-sm bento-card min-h-[440px]">
            <div className="flex justify-between items-start">
              <div className="z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-zinc-100 text-[9px] font-extrabold uppercase rounded-full tracking-widest text-zinc-600">
                    Brand Spotlight • 精选品牌聚焦
                  </span>
                  {brands.length > 1 && (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setSpotlightIndex(prev => prev + 1); 
                      }} 
                      className="text-[10px] text-zinc-500 hover:text-zinc-900 border border-zinc-200 rounded-full px-2 py-0.5 bg-zinc-50 transition-colors"
                      title="切换品牌"
                    >
                      轮换 ❯
                    </button>
                  )}
                </div>
                <h3 className="text-4xl font-serif font-black text-zinc-900 mb-3 tracking-tight group-hover:text-zinc-800">
                  {activeSpotlightBrand.name} 
                  <span className="text-zinc-300 ml-1.5 font-sans font-medium text-xl">®</span>
                </h3>
                <p className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest font-semibold mb-3">
                  {activeSpotlightBrand.englishName} • {activeSpotlightBrand.country}
                </p>
                <p className="text-[13px] text-zinc-500 max-w-sm leading-relaxed mb-4 line-clamp-4">
                  {activeSpotlightBrand.brandStory}
                </p>
              </div>
              <div className="text-right z-10 shrink-0">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">风格特征</span>
                <span className="text-[12px] font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded italic">
                  {activeSpotlightBrand.style}
                </span>
              </div>
            </div>

            <div className="mt-auto z-10">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase text-zinc-400 mb-2 tracking-wider">核心款式代表作</p>
                <div className="flex flex-wrap gap-1.5">
                  {(activeSpotlightBrand.representativeProducts || []).map((prod, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-[10px] text-zinc-600 font-medium"
                    >
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onNavigate('brands', activeSpotlightBrand.id)}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>浏览该品牌纸张工艺档案</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Soft geometric design circle accent */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-zinc-50 rounded-full opacity-60 pointer-events-none border border-zinc-100"></div>
          </div>
        ) : (
          <div className="col-span-1 md:col-span-2 row-span-2 bg-white border border-zinc-200 rounded-3xl p-8 flex items-center justify-center text-zinc-400">
            建立品牌档案后在此激活特写。
          </div>
        )}

        {/* Component 2: Weekly Insight & Hot Design Trends (Spans 1 column, 2 rows, Deep Charcoal Vibe) */}
        <div className="bg-zinc-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-md bento-card relative overflow-hidden min-h-[440px]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#a1a1aa] bg-zinc-800 px-2.5 py-0.5 rounded-full">
                Weekly Trend • 工业设计焦点
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>

            <h4 className="text-xl font-medium leading-snug mb-4 underline decoration-zinc-700 underline-offset-8 italic text-zinc-100">
              模块化多板芯与磁扣拆卸本
            </h4>
            
            <p className="text-[12px] text-zinc-300 leading-relaxed mb-6">
              文具产业正经历由“固定尺寸”向“无缝拼装、自由磁吸格式、多内页混搭”的高柔性拆解生态演变，极高地启发了数码与实体交互思考。
            </p>

            <div className="space-y-2 border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">主导材料</span>
                <span className="font-mono text-zinc-300 font-semibold">植鞣皮革 / N52磁吸</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">代表品牌</span>
                <span className="text-zinc-300">TRAVELER'S, Kokuyo</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">阻尼摩擦</span>
                <span className="text-zinc-300">中高 (38 mN)</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => onNavigate('trends')}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>查看全部 3 项设计趋势档案</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Component 3: Spark Stats & Connections Count (Spans 1 column, 1 row) */}
        <div 
          onClick={() => onNavigate('graph')}
          className="bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm bento-card cursor-pointer group hover:border-zinc-900 min-h-[208px]"
        >
          <div>
            <div className="flex justify-between items-center text-zinc-400 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Knowledge Space</span>
              <BrainCircuit className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            </div>
            <div className="text-3xl font-mono font-extrabold text-zinc-900">
              {brands.length + products.length + materials.length + crafts.length}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              已链接物理材料与装帧节点
            </div>
          </div>

          {/* Aesthetic miniature bar chart aligned to mock spec */}
          <div className="mt-4">
            <div className="flex items-end gap-1.5 h-10 select-none pb-1">
              <div className="flex-1 bg-zinc-200 h-[45%] rounded-sm hover:bg-zinc-900 transition-colors" title="品牌库"></div>
              <div className="flex-1 bg-zinc-300 h-[70%] rounded-sm hover:bg-zinc-900 transition-colors" title="款式库"></div>
              <div className="flex-1 bg-zinc-200 h-[30%] rounded-sm hover:bg-zinc-900 transition-colors" title="材质库"></div>
              <div className="flex-1 bg-zinc-900 h-[92%] rounded-sm" title="图谱互联"></div>
              <div className="flex-1 bg-zinc-400 h-[50%] rounded-sm hover:bg-zinc-900 transition-colors" title="工艺库"></div>
            </div>
            <div className="flex justify-between text-[8px] font-mono text-zinc-400 pt-1">
              <span>BRANDS</span>
              <span>PRODUCTS</span>
              <span>GRAPH</span>
            </div>
          </div>
        </div>

        {/* Component 4: Material Spotlight (Spans 1 column, 1 row, Warm cream tone) */}
        <div 
          onClick={() => onNavigate('materials')}
          className="bg-[#F4F1EA] border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm bento-card cursor-pointer hover:border-zinc-500 min-h-[208px]"
        >
          <div>
            <span className="text-[9px] font-extrabold uppercase text-zinc-500/80 tracking-widest block mb-1">
              Material Archive • 纸张阻尼
            </span>
            <h4 className="text-[15px] font-bold text-zinc-800 line-clamp-1">{featuredMaterial.name}</h4>
            <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-tight">
              {featuredMaterial.features}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              {featuredMaterial.category}
            </span>
            <div className="w-6 h-6 rounded-full border-2 border-zinc-900 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
            </div>
          </div>
        </div>

        {/* Component 5: Brand Geolocations Chart (Spans 2 columns, 1 row) */}
        <div className="col-span-1 md:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm bento-card flex flex-col justify-between min-h-[240px]">
          <div>
            <h4 className="font-sans font-bold text-[14px] text-zinc-800 uppercase tracking-wider mb-1">品牌地理分布权重</h4>
            <p className="font-sans text-[11px] text-zinc-500">定量分析平台内记录的日系、国潮、以及法德意高奢本册的储备比重</p>
          </div>
          <div className="h-32 mt-2 w-full">
            {countryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(244, 244, 245, 0.6)' }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="value" fill="#18181b" radius={[4, 4, 0, 0]} barSize={24}>
                    {countryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">暂无地理分布数据</div>
            )}
          </div>
        </div>

        {/* Component 6: Category Specs Spectrum (Spans 2 columns, 1 row) */}
        <div className="col-span-1 md:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm bento-card flex flex-col justify-between min-h-[240px]">
          <div>
            <h4 className="font-sans font-bold text-[14px] text-zinc-800 uppercase tracking-wider mb-1">本册版心布局占比</h4>
            <p className="font-sans text-[11px] text-zinc-500">点阵 (Dot Grid)、方格 (Sect Grid)、横线 (Ruled) 及完全纯白无感内页的分类统计</p>
          </div>
          <div className="h-32 mt-2 w-full">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <XAxis type="number" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} width={64} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="value" fill="#71717a" radius={[0, 4, 4, 0]} barSize={12}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">暂无内页布局统计</div>
            )}
          </div>
        </div>

        {/* Component 7: Process / Craft Gallery Spec (Spans 2 columns, 1 row) */}
        <div className="col-span-1 md:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col md:flex-row gap-6 justify-between bento-card shadow-sm min-h-[160px]">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 mb-1 leading-none">
                Process Spec • 行业推荐工艺
              </p>
              <h4 className="text-base font-bold text-zinc-900">烫金金箔 / 气动凹凸压印</h4>
              <p className="text-[11.5px] text-zinc-500 mt-1 lines-clamp-3">
                主要适用于高档封面装帧及企业礼盒定制。利用气动的恒定下压压凹，形成1.2mm深邃致密的盲压LOGO效果，极具古典厚重度。
              </p>
            </div>
            <div className="flex gap-2 items-center mt-3">
              <span className="text-[10px] text-zinc-400 uppercase">开模成本：</span>
              <div className="flex items-center gap-0.5" title="高偏上">
                <span className="text-zinc-800 text-xs">★★★★☆</span>
              </div>
            </div>
          </div>
          <div 
            onClick={() => onNavigate('crafts')}
            className="w-full md:w-32 h-28 md:h-full bg-zinc-50 rounded-xl border border-dashed border-zinc-300 flex flex-col items-center justify-center text-[10px] text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer transition-all shrink-0 select-none gap-1"
          >
            <Sparkle className="w-4 h-4 text-zinc-400" />
            <span>IMAGE_REF</span>
            <span className="text-[8px] tracking-wider text-zinc-400/80 uppercase">VIEW CRAFT</span>
          </div>
        </div>

        {/* Component 8: Masterclass Inspiration Series (Spans 2 columns, 1 row) */}
        <div className="col-span-1 md:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 bento-card shadow-sm min-h-[160px]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-serif font-black text-xl shadow-inner shrink-0 select-none">
              原
            </div>
            <div>
              <p className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Master Theory • 简素设计论</p>
              <p className="font-bold text-sm text-zinc-900 mt-0.5">原研哉与日本精装本册“日常的白”</p>
              <p className="text-[12px] text-zinc-500 leading-snug mt-1 max-w-sm">
                去除了高饱和亮光。研究白之于阴影、粗粝凹折处在漫反射照明下的质地，确立了日本国民 Campus 纸张纯白色值对齐机制。
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('designers')}
            className="w-full md:w-auto px-4 py-2.5 border border-zinc-900 hover:bg-zinc-900 hover:text-white rounded-xl text-xs font-bold uppercase transition-all shrink-0 shadow-sm"
          >
            研习艺术大师
          </button>
        </div>

      </div>

      {/* Embedded Dynamic Footer Bar in Grid Alignment */}
      <div className="bg-zinc-900 text-zinc-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-[14px] text-white">
              佐藤卓 (Taku Satoh) 的「物体感」造本设计法
            </h4>
            <p className="font-sans text-[11px] text-zinc-400 max-w-xl mt-0.5">
              本周独家特辑：Campus 笔记载体第5代网格盲击。探析书本侧边烫金以及裸脊纸张沙感对触觉传达的卓越价值。
            </p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('designers')}
          className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all whitespace-nowrap shadow-sm"
        >
          <span>开展专栏研讨</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
