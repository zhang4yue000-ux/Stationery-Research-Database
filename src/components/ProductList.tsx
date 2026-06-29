/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Bookmark, 
  BookmarkCheck,
  Scale,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Trash2,
  Edit3
} from 'lucide-react';
import { Product, Brand, Material } from '../types';

interface ProductListProps {
  products: Product[];
  brands: Brand[];
  materials: Material[];
  onAddTrigger: (category: 'product', editItem?: Product) => void;
  onDeleteProduct: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCompareSelect: (id: string) => void;
  compareList: string[];
  onNavigateToTab: (tab: any) => void;
  selectedProductId?: string;
}

export default function ProductList({ 
  products, 
  brands, 
  materials,
  onAddTrigger,
  onDeleteProduct,
  onToggleFavorite,
  onCompareSelect,
  compareList,
  onNavigateToTab,
  selectedProductId
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [activeProduct, setActiveProduct] = useState<Product | null>(
    selectedProductId ? (products.find(p => p.id === selectedProductId) || null) : null
  );

  React.useEffect(() => {
    if (selectedProductId) {
      const match = products.find(p => p.id === selectedProductId);
      if (match) setActiveProduct(match);
    }
  }, [selectedProductId, products]);

  const categories = ['All', 'Notebook', 'Planner', 'Envelope/Letter', 'Writing Instrument', 'Desk Organizer', 'Accessory'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paperType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (brands.find(b => b.id === p.brandId)?.name.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesCat = catFilter === 'All' || p.category === catFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F5F4EE]">
      {/* Product List Deck */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-sans font-bold text-2xl text-[#1F2937]">产品书写谱系库 (Products Lineup)</h2>
            <p className="font-sans text-[12px] text-[#8C8A82] mt-0.5">研究并横向比对精装本册、内页规划逻辑、克重规格及购买通路</p>
          </div>
          <button
            id="add-product-full-btn"
            onClick={() => onAddTrigger('product')}
            className="flex items-center gap-1.5 bg-[#1F2937] hover:bg-[#374151] text-white px-4 py-2 rounded text-[12px] font-semibold transition"
          >
            <Plus className="w-4 h-4" />
            <span>智能生成/录入产品</span>
          </button>
        </div>

        {/* Toolbar & Compare info */}
        <div className="bg-white rounded border border-[#EBE9E0] p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded py-2 pl-9 pr-4 font-sans text-[12px] focus:outline-none focus:border-[#1F2937]"
                placeholder="搜索产品品名、对应书写原纸规格及设计标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8C8A82]" />
            </div>

            <div className="w-48 flex items-center gap-1.5">
              <span className="font-sans text-[11px] text-[#8C8A82] whitespace-nowrap">分类:</span>
              <select
                className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded py-1.5 px-2 font-sans text-[12px] text-[#1F2937]"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c === 'All' ? '全部品类' : c === 'Notebook' ? '笔记本' : c === 'Planner' ? '日历手帐' : c === 'Writing Instrument' ? '硬笔书写' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparative Drawer Quick stats */}
          {compareList.length > 0 && (
            <div className="flex items-center bg-amber-50 border border-amber-200 px-4 py-2 rounded gap-3 self-center">
              <div className="font-sans text-xs text-[#5C5A52]">
                已选 <strong className="font-mono text-amber-700">{compareList.length}</strong> 款进行横向理化特性对剖
              </div>
              <button
                onClick={() => onNavigateToTab('comparison')}
                className="flex items-center gap-1 bg-[#1F2937] hover:bg-neutral-800 text-white px-3 py-1 rounded text-[11px] font-semibold transition"
              >
                <Scale className="w-3 h-3 text-amber-400" />
                <span>进入横深对比</span>
              </button>
            </div>
          )}
        </div>

        {/* Product List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(p => {
            const brand = brands.find(b => b.id === p.brandId);
            const isCompared = compareList.includes(p.id);

            return (
              <div
                id={`product-card-${p.id}`}
                key={p.id}
                onClick={() => setActiveProduct(p)}
                className={`bg-white rounded-lg border p-5 flex flex-col justify-between cursor-pointer transition shadow-sm hover:-translate-y-0.5 ${
                  activeProduct?.id === p.id ? 'border-[#1F2937] ring-1 ring-[#1F2937]' : 'border-[#EBE9E0]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[9px] bg-[#EFECE3] text-[#5C5A52] px-2 py-0.5 rounded uppercase">
                      {brand?.name || '未知品牌'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                        }}
                        className="text-[#8C8A82] hover:text-amber-600 p-1"
                        title={p.favorited ? '取消收藏' : '加入收藏'}
                      >
                        {p.favorited ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      {/* Compare Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompareSelect(p.id);
                        }}
                        className={`p-1 rounded ${isCompared ? 'text-amber-700 bg-amber-100' : 'text-[#8C8A82] hover:bg-[#FAF9F5]'}`}
                        title="推入对比池"
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-sans font-bold text-[14px] text-[#1F2937] leading-snug line-clamp-2 mb-2">
                    {p.name}
                  </h3>

                  <div className="space-y-1 mb-4 text-[11px] font-sans">
                    <div className="flex justify-between">
                      <span className="text-[#8C8A82]">尺寸内界:</span>
                      <span className="text-[#1F2937] font-medium">{p.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8C8A82]">内页纸质:</span>
                      <span className="text-[#1F2937] font-medium truncate max-w-[150px]">{p.paperType}</span>
                    </div>
                    {p.pageCount && (
                      <div className="flex justify-between">
                        <span className="text-[#8C8A82]">页面厚度:</span>
                        <span className="text-[#1F2937] font-mono">{p.pageCount} 页</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.tags.slice(0, 3).map(t => (
                      <span key={t} className="font-sans text-[10px] bg-[#FAF9F5] text-[#8C8A82] px-2 py-0.5 rounded border border-[#E3DFD5]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-[#FAF9F5] pt-3 flex justify-between items-center">
                    <span className="font-mono text-[12px] text-amber-900 font-bold">{p.price}</span>
                    <span className="font-sans text-[11px] font-semibold text-[#1F2937] flex items-center gap-1">
                      <span>查看纸谱与工艺</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full bg-white text-center py-12 rounded border border-[#EBE9E0]">
              <Compass className="w-8 h-8 text-[#8C8A82] mx-auto mb-3" />
              <p className="font-sans text-[13px] text-[#8C8A82]">未拉取匹配到此过滤规则下的产品记录，请录入新增。</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Sidebar */}
      {activeProduct && (
        <div id="product-detail-sidebar" className="w-96 bg-white border-l border-[#EBE9E0] flex flex-col h-screen sticky top-0 shadow-lg">
          {/* Detail Header */}
          <div className="p-6 border-b border-[#EBE9E0] flex justify-between items-start bg-[#FAF9F5]">
            <div>
              <span className="font-mono text-[10px] text-[#8C8A82] uppercase bg-[#EFECE3] px-2 py-0.5 rounded">
                {(brands.find(b => b.id === activeProduct.brandId))?.name || '核心本册'}
              </span>
              <h3 className="font-sans font-bold text-md text-[#1F2937] leading-snug mt-2">{activeProduct.name}</h3>
              <p className="font-mono text-[11px] text-amber-900 font-bold mt-1">首发估价: {activeProduct.price}</p>
            </div>
            <button 
              onClick={() => setActiveProduct(null)}
              className="font-sans text-xs text-[#8C8A82] hover:text-[#1F2937]"
            >
              关闭
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Technical dossiers */}
            <div>
              <h4 className="font-sans font-bold text-[12px] text-[#1F2937] border-l-2 border-[#1F2937] pl-2 mb-2.5">材料学工艺参数 (Specs)</h4>
              <div className="bg-[#FAF9F5] border border-[#E3DFD5] rounded p-4 space-y-3 font-sans text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8C8A82]">发布时间:</span>
                  <strong className="text-[#1F2937] font-mono">{activeProduct.releaseDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C8A82]">开本规格:</span>
                  <strong className="text-[#1F2937]">{activeProduct.dimensions}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C8A82]">内页用纸:</span>
                  <strong className="text-[#1F2937]">{activeProduct.paperType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C8A82]">装订手段:</span>
                  <strong className="text-[#1F2937]">{activeProduct.bindingMethod}</strong>
                </div>
              </div>
            </div>

            {/* Design & Craft analysis Notes */}
            <div>
              <h4 className="font-sans font-bold text-[12px] text-[#1F2937] border-l-2 border-[#1F2937] pl-2 mb-2">设计师研究批注</h4>
              <p className="font-sans text-[12px] text-[#5C5A52] leading-relaxed bg-[#FAF9F5] p-3 rounded border border-[#EBE9E0]">
                {activeProduct.notes}
              </p>
            </div>

            {/* Links and Purchases */}
            <div className="space-y-2">
              <h4 className="font-sans font-bold text-[12px] text-[#1F2937] border-l-2 border-[#1F2937] pl-2 mb-1">设计参考与获取通道</h4>
              <div className="flex flex-col gap-2 pt-1.5">
                {activeProduct.websiteUrl && (
                  <a 
                    href={activeProduct.websiteUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100 border border-[#E3DFD5] rounded text-xs text-[#1F2937] font-semibold transition"
                  >
                    <span>官方详细规格解读网</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#8C8A82]" />
                  </a>
                )}
                {activeProduct.purchaseUrl && (
                  <a 
                    href={activeProduct.purchaseUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-xs text-amber-950 font-semibold transition"
                  >
                    <span>设计师实体采办样本线</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-800" />
                  </a>
                )}
              </div>
            </div>

            {/* Dynamic Relation Linkage mapping to Materials database */}
            {activeProduct.materialIds.length > 0 && (
              <div>
                <h4 className="font-sans font-bold text-[12px] text-[#1F2937] border-l-2 border-[#1F2937] pl-2 mb-2.5">
                  物理书写载体材质关联 (Double-Linked)
                </h4>
                <div className="space-y-1.5">
                  {materials.filter(m => activeProduct.materialIds.includes(m.id)).map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => onNavigateToTab('materials')} 
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded text-xs flex justify-between items-center transition"
                    >
                      <div>
                        <span className="font-sans font-semibold text-[#1F2937]">{m.name}</span>
                        <span className="font-mono text-[9px] text-emerald-800 ml-1.5">Origin: {m.origin}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-800" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action bars */}
            <div className="border-t border-[#EBE9E0] pt-4 flex gap-2">
              <button
                onClick={() => onAddTrigger('product', activeProduct)}
                className="flex-1 flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 py-1.5 rounded font-sans text-xs text-amber-900 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>编辑产品</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('确认删除此产品谱系？这无法撤回。')) {
                    onDeleteProduct(activeProduct.id);
                    setActiveProduct(null);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 py-1.5 rounded font-sans text-xs text-red-900 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>下架档案</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
