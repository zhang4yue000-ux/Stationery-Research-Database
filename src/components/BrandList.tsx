/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Link as LinkIcon, 
  Instagram, 
  Compass, 
  Calendar, 
  User, 
  ShieldCheck,
  ChevronRight,
  Edit2,
  Trash2,
  X,
  Sparkles,
  ArrowLeft,
  Upload,
  BookOpen,
  DollarSign,
  Tag,
  Info,
  Check,
  HelpCircle
} from 'lucide-react';
import { Brand, Product, Material } from '../types';

interface BrandListProps {
  brands: Brand[];
  products: Product[];
  materials: Material[];
  onAddTrigger: (category: 'brand', editItem?: Brand) => void;
  onDeleteBrand: (id: string) => void;
  selectedBrandId?: string;
  onClearSelection?: () => void;
  onUpdateProducts?: (updatedProducts: Product[]) => void;
}

export default function BrandList({ 
  brands, 
  products, 
  materials,
  onAddTrigger,
  onDeleteBrand,
  selectedBrandId,
  onClearSelection,
  onUpdateProducts
}: BrandListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSegment, setActiveSegment] = useState<'established' | 'independent'>('established');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // New product addition inline form toggles
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [promoName, setPromoName] = useState('');
  const [promoCategory, setPromoCategory] = useState<'Notebook' | 'Planner' | 'Envelope/Letter' | 'Writing Instrument' | 'Desk Organizer' | 'Accessory'>('Notebook');
  const [promoPrice, setPromoPrice] = useState('¥68.00');
  const [promoDims, setPromoDims] = useState('148 x 210 mm');
  const [promoPaper, setPromoPaper] = useState('特种书写原纸 80gsm');
  const [promoNotes, setPromoNotes] = useState('');
  const [promoImage, setPromoImage] = useState<string>('');
  const [promoDesignStyle, setPromoDesignStyle] = useState('极简');
  const [promoProductFunction, setPromoProductFunction] = useState('自由记录');
  
  const productFileRef = useRef<HTMLInputElement>(null);
  const replaceFileRef = useRef<HTMLInputElement>(null);
  const [targetReplaceProductId, setTargetReplaceProductId] = useState<string | null>(null);

  // Sync selectedBrandId prop if it updates
  React.useEffect(() => {
    if (selectedBrandId) {
      const match = brands.find(b => b.id === selectedBrandId);
      if (match) {
        setSelectedBrand(match);
        // Automatically switch segment to match the selected brand
        if (match.brandType) {
          setActiveSegment(match.brandType);
        }
      }
    }
  }, [selectedBrandId, brands]);

  const filteredBrands = brands.filter(b => {
    const brandTypeVal = b.brandType || 'established';
    const matchesSegment = brandTypeVal === activeSegment;
    
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.englishName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.brandStory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSegment && matchesSearch;
  });

  // Handle direct file upload / base64 reading for adding new product
  const handleProductPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPromoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle replacing image for an existing product
  const handleReplacePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, pId: string) => {
    const file = e.target.files?.[0];
    if (file && onUpdateProducts) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = products.map(p => {
          if (p.id === pId) {
            return { ...p, imageUrl: reader.result as string };
          }
          return p;
        });
        onUpdateProducts(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file-picker for replacing an existing product photo
  const triggerReplacePhoto = (pId: string) => {
    setTargetReplaceProductId(pId);
    setTimeout(() => {
      replaceFileRef.current?.click();
    }, 10);
  };

  // Handle submission of supplementary brand products
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;
    if (!promoName.trim()) {
      alert('请输入代表性产品的名称！');
      return;
    }

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      brandId: selectedBrand.id,
      name: promoName.trim(),
      releaseDate: new Date().getFullYear().toString(),
      category: promoCategory,
      dimensions: promoDims.trim() || 'A5 标准级',
      paperType: promoPaper.trim() || '特种手工纸张',
      materialIds: [],
      bindingMethod: '平抹或锁线传统装订',
      craftIds: [],
      price: promoPrice.trim() || '¥0.00',
      imageUrl: promoImage || undefined,
      tags: ['自主登记', '美照扩充'],
      notes: promoNotes.trim() || '该随手记录本册细节已存入归档纸品。',
      favorited: false,
      designStyle: promoDesignStyle.trim() || undefined,
      productFunction: promoProductFunction.trim() || undefined
    };

    if (onUpdateProducts) {
      onUpdateProducts([newProduct, ...products]);
    }

    // Reset State
    setPromoName('');
    setPromoPrice('¥68.00');
    setPromoDims('148 x 210 mm');
    setPromoPaper('特种书写原纸 80gsm');
    setPromoNotes('');
    setPromoImage('');
    setPromoDesignStyle('极简');
    setPromoProductFunction('自由记录');
    setIsAddProductOpen(false);
  };

  // Handle deletion of an added product photo
  const handleDeleteProduct = (pId: string) => {
    if (confirm('确定要删除这款代表性产品美照吗？这将永久移除此卡页记录。') && onUpdateProducts) {
      onUpdateProducts(products.filter(p => p.id !== pId));
    }
  };

  // Render Full Screen Mode
  if (selectedBrand) {
    const associatedProducts = products.filter(p => p.brandId === selectedBrand.id);

    return (
      <div className="flex-1 flex flex-col bg-zinc-55 overflow-y-auto animate-fade-in relative max-w-full">
        {/* Fullscreen Sticky Nav Header */}
        <div className="sticky top-0 bg-white border-b border-zinc-200 px-8 py-5 flex items-center justify-between z-40 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedBrand(null);
                if (onClearSelection) onClearSelection();
              }}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-sans text-xs font-bold bg-zinc-100 hover:bg-zinc-200 py-2.5 px-4 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回资料库列表</span>
            </button>
            <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{selectedBrand.country}</span>
                <span className="text-zinc-300">•</span>
                <span className="font-sans text-[10px] text-zinc-500 font-bold bg-zinc-100 px-2 py-0.5 rounded-md">
                  {selectedBrand.brandType === 'independent' ? '独立个人创作者' : '市场经典老牌'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onAddTrigger('brand', selectedBrand);
                setSelectedBrand(null);
              }}
              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-2 rounded-xl font-sans text-xs text-amber-900 font-bold transition"
              title="修改卡页内容"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">编辑</span>
            </button>
            <button
              onClick={() => {
                if (confirm('确定要从系统中移出该手帐品牌的完整档案名片吗？移出后不可恢复。')) {
                  onDeleteBrand(selectedBrand.id);
                  setSelectedBrand(null);
                }
              }}
              className="flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl font-sans text-xs text-red-900 font-bold transition"
              title="移出名片库"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">移出档案</span>
            </button>
          </div>
        </div>

        {/* Hidden File Input for Direct Replacing Product Photo */}
        <input 
          type="file" 
          accept="image/*" 
          ref={replaceFileRef}
          className="hidden" 
          onChange={(e) => {
            if (targetReplaceProductId) {
              handleReplacePhotoUpload(e, targetReplaceProductId);
              setTargetReplaceProductId(null);
            }
          }}
        />

        {/* Immersive Main Content */}
        <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 1/3 COLLUMN: BRAND STORY & BIOGRAPHY DOSSIER */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Aesthetic Title Box */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
              <div className="space-y-1 mb-5">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-semibold block">{selectedBrand.style} 设计学派</span>
                <h1 className="font-sans font-extrabold text-2xl text-zinc-900 tracking-tight leading-snug">{selectedBrand.name}</h1>
                <p className="font-mono text-sm text-zinc-500 font-semibold">{selectedBrand.englishName || 'Design Studio Profile'}</p>
              </div>

              {/* Physical Specifications */}
              <div className="space-y-3.5 border-t border-zinc-100 pt-5">
                <div className="flex justify-between items-start text-xs font-sans">
                  <span className="text-zinc-500 flex items-center gap-1.5 shrink-0"><Calendar className="w-4 h-4 text-zinc-400" /> 创立成立年份</span>
                  <strong className="text-zinc-800 font-mono bg-zinc-100 px-2 py-0.5 rounded-md text-[11px] font-bold text-right ml-4">
                    {selectedBrand.foundedYear ? `${selectedBrand.foundedYear} 年` : '独立/新兴'}
                  </strong>
                </div>

                <div className="flex justify-between items-start text-xs font-sans">
                  <span className="text-zinc-500 flex items-center gap-1.5 shrink-0"><User className="w-4 h-4 text-zinc-400" /> 创始人/设计师</span>
                  <strong className="text-zinc-800 font-medium text-right ml-4">{selectedBrand.founder || '独立创作者团队'}</strong>
                </div>

                <div className="flex justify-between items-start text-xs font-sans">
                  <span className="text-zinc-500 flex items-center gap-1.5 shrink-0"><ShieldCheck className="w-4 h-4 text-zinc-400" /> 品牌定位等级</span>
                  <strong className="text-zinc-800 font-medium text-right ml-4">
                    {selectedBrand.marketTier === 'Premium' ? '精奢收藏级' : 
                     selectedBrand.marketTier === 'Mid-range' ? '高质日常级' : '性价比入门级'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Immersive Brand Story Box */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="font-sans font-extrabold text-sm text-zinc-900 border-l-3 border-zinc-300 pl-3">
                品牌美学
              </h3>
              <p className="font-sans text-xs text-zinc-650 leading-relaxed whitespace-pre-line bg-zinc-50 p-4 rounded-2xl border border-white">
                {selectedBrand.brandStory}
              </p>
            </div>

            {/* Links and Platforms */}
            {(selectedBrand.website || selectedBrand.instagram || selectedBrand.xiaohongshu) && (
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-3.5">
                <h3 className="font-sans font-extrabold text-sm text-zinc-900 border-l-3 border-zinc-300 pl-3">
                  官方与社媒平台直连
                </h3>
                <div className="space-y-2">
                  {selectedBrand.website && (
                    <a 
                      href={selectedBrand.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100 border border-white rounded-2xl text-xs font-semibold text-zinc-700 transition-all group"
                    >
                      <span className="flex items-center gap-2">
                        <LinkIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900" />
                        <span>品牌官方网站</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950" />
                    </a>
                  )}

                  {selectedBrand.instagram && (
                    <div className="flex items-center gap-2 p-3 bg-zinc-50 border border-white rounded-2xl text-xs text-zinc-700">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span className="font-mono text-zinc-500 font-medium truncate">{selectedBrand.instagram}</span>
                    </div>
                  )}

                  {selectedBrand.xiaohongshu && (
                    <div className="flex items-center gap-2 p-3 bg-zinc-50 border border-white rounded-2xl text-xs text-zinc-700">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-[8px] font-bold text-white">红</span>
                      <span className="font-sans text-zinc-500 font-medium truncate">{selectedBrand.xiaohongshu}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT 2/3 COLUMN: PRODUCT PHOTOS GALLERY & ADDITION SECTION */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header section with add button */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-bold text-base text-zinc-900 tracking-tight">代表产品</h2>
                <p className="font-sans text-xs text-zinc-500 mt-0.5">收集并上传您自主拍下的该品牌产品</p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                className="flex items-center gap-1 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition"
              >
                {isAddProductOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isAddProductOpen ? '收起填报面板' : '添加产品/照片'}</span>
              </button>
            </div>

            {/* Collapse Inline Adding Form Panel */}
            {isAddProductOpen && (
              <div className="bg-white border-2 border-dashed border-zinc-300 rounded-3xl p-6 shadow-md space-y-5 animate-zoom-in">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-zinc-900">登记该品牌下的代表产品及实拍图</h4>
                    <p className="text-[10px] text-zinc-400">记录您的本册评测、零售价格、装载手持细节</p>
                  </div>
                </div>

                <form onSubmit={handleAddProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Photo drop zone */}
                  <div className="md:col-span-2">
                    <label className="font-sans text-[11px] font-bold text-zinc-700 block mb-1">本芯外观实物抓拍相照 *</label>
                    <div 
                      onClick={() => productFileRef.current?.click()}
                      className="border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px]"
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={productFileRef} 
                        className="hidden" 
                        onChange={handleProductPhotoUpload}
                      />
                      {promoImage ? (
                        <div className="relative w-full h-32 rounded-xl overflow-hidden">
                          <img src={promoImage} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPromoImage('');
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-7 h-7 text-zinc-400 mx-auto" />
                          <p className="font-sans text-xs text-zinc-500 font-bold">点击从本地选择产品实盘摄片</p>
                          <p className="font-sans text-[10px] text-zinc-400">支持主流格式 (转换为强缓存 Base64 段，在浏览器内永久存储)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="font-sans text-[11px] font-bold text-zinc-700 block">本册款式全称 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="如：1天1页英文精装日历本 2026版"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                      value={promoName}
                      onChange={(e) => setPromoName(e.target.value)}
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="font-sans text-[11px] font-bold text-zinc-700 block">参考入手价金</label>
                    <input 
                      type="text" 
                      placeholder="如：¥198.00"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(e.target.value)}
                    />
                  </div>

                  {/* Category dropdown */}
                  <div className="space-y-1">
                    <label className="font-sans text-[11px] font-bold text-zinc-700 block">分类</label>
                    <select
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                      value={promoCategory}
                      onChange={(e) => setPromoCategory(e.target.value as any)}
                    >
                      <option value="Notebook">经典本册</option>
                      <option value="Envelope/Letter">信件便签</option>
                      <option value="Writing Instrument">笔具</option>
                      <option value="Desk Organizer">桌面收纳</option>
                    </select>
                  </div>

                  {/* Dims & size */}
                  <div className="space-y-1">
                    <label className="font-sans text-[11px] font-bold text-zinc-700 block">尺寸规格</label>
                    <input 
                      type="text" 
                      placeholder="如：A6 (105x148 mm)"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                      value={promoDims}
                      onChange={(e) => setPromoDims(e.target.value)}
                    />
                  </div>

                  {/* Paper type */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-sans text-[11px] font-bold text-zinc-700 block">产品材质与工艺</label>
                    <input 
                      type="text" 
                      placeholder="如：新巴川纸 52g/㎡"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                      value={promoPaper}
                      onChange={(e) => setPromoPaper(e.target.value)}
                    />
                  </div>

                  {/* Notes review */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-sans text-[11px] font-bold text-zinc-700 block">产品做工、质感评测</label>
                    <textarea 
                      rows={3}
                      placeholder="详细写下您的手感触感、钢笔打磨摩擦等情况，或对该印刷本面装帧工法的解析..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 resize-none"
                      value={promoNotes}
                      onChange={(e) => setPromoNotes(e.target.value)}
                    />
                  </div>

                  {/* Design Style Selector with custom entry */}
                  <div className="space-y-2 md:col-span-2 bg-zinc-50 p-4 rounded-2xl border border-white">
                    <label className="font-sans text-xs font-extrabold text-zinc-800 block">
                      设计风格
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["复古经典", "创新功能", "可爱甜美", "日系杂货与手作风", "极简", "商务", "不限制风格", "功能性"].map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setPromoDesignStyle(style)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                            promoDesignStyle === style
                              ? 'bg-zinc-900 text-white border-zinc-950 shadow-xs'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-zinc-400 font-sans shrink-0">或自定义输入:</span>
                      <input 
                        type="text" 
                        placeholder="在此处输入自定义风格名称"
                        className="flex-1 bg-white border border-zinc-200 rounded-xl py-1.5 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                        value={promoDesignStyle}
                        onChange={(e) => setPromoDesignStyle(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Product Function Selector with custom entry */}
                  <div className="space-y-2 md:col-span-2 bg-zinc-50 p-4 rounded-2xl border border-white">
                    <label className="font-sans text-xs font-extrabold text-zinc-800 block">
                      产品功能
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["自由记录", "生活记录与复盘", "情绪管理与解压", "目标与项目追踪"].map((func) => (
                        <button
                          key={func}
                          type="button"
                          onClick={() => setPromoProductFunction(func)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                            promoProductFunction === func
                              ? 'bg-zinc-900 text-white border-zinc-950 shadow-xs'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          {func}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-zinc-400 font-sans shrink-0">或自定义输入:</span>
                      <input 
                        type="text" 
                        placeholder="在此处输入自定义产品功能描述"
                        className="flex-1 bg-white border border-zinc-200 rounded-xl py-1.5 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                        value={promoProductFunction}
                        onChange={(e) => setPromoProductFunction(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Submit button line */}
                  <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-white">
                    <button
                      type="button"
                      onClick={() => setIsAddProductOpen(false)}
                      className="py-2 px-4 bg-zinc-100 hover:bg-zinc-250 text-zinc-650 rounded-xl font-sans text-xs font-bold transition-all"
                    >
                      取消填报
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-6 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-sans text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>确认载入本册画廊</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products interactive grid with detailed review logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {associatedProducts.map(p => (
                <div 
                  key={p.id}
                  className="bg-white border border-zinc-200 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col group relative"
                >
                  {/* Photo Top Deck */}
                  <div className="h-48 bg-zinc-50 relative flex items-center justify-center overflow-hidden border-b border-white">
                    {p.imageUrl ? (
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
                        <Compass className="w-8 h-8 text-zinc-300 mb-1" />
                        <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Image Reserve</span>
                        <p className="text-[10px] text-zinc-400 mt-1">目前暂无图样，欢迎补充创意灵感图</p>
                      </div>
                    )}

                    {/* Left corner tag overlay */}
                    <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                      {p.category === 'Notebook' ? '纸本册' : p.category === 'Planner' ? '手帐日历' : '精选配件'}
                    </span>

                    {/* Upload / Edit photo Float hover button */}
                    <button
                      onClick={() => triggerReplacePhoto(p.id)}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-zinc-800 backdrop-blur-md border border-white p-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{p.imageUrl ? '更换实拍' : '上传美照'}</span>
                    </button>
                  </div>

                  {/* Body textual block */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10.5px] font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md">
                          {p.price || '待填'}
                        </span>
                        <span className="font-sans text-[10px] text-zinc-400 font-semibold">{p.dimensions || '标准开本'}</span>
                      </div>

                      <h4 className="font-sans font-bold text-sm text-zinc-900 leading-snug tracking-tight">
                        {p.name}
                      </h4>

                      <p className="font-sans text-xs text-zinc-600 leading-relaxed font-normal bg-zinc-50 p-3 rounded-xl border border-white">
                        {p.notes || '还未写下该款式的实际书写评测笔记。'}
                      </p>
                    </div>

                    {/* Paper & Specs Info */}
                    <div className="border-t border-zinc-100 pt-3.5 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-550 font-sans">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="font-bold">内里材质:</span>
                        <span className="text-zinc-700 truncate">{p.paperType || '通用白纸'}</span>
                      </div>

                      {p.designStyle && (
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-550 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="font-bold">设计风格:</span>
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-amber-250 truncate">{p.designStyle}</span>
                        </div>
                      )}

                      {p.productFunction && (
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-550 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span className="font-bold">产品功能:</span>
                          <span className="bg-indigo-50 text-indigo-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-indigo-250 truncate">{p.productFunction}</span>
                        </div>
                      )}

                      {/* Small Bottom Trigger line */}
                      <div className="flex justify-between items-center text-[10px] pt-1 text-zinc-400">
                        <span>首版年份: {p.releaseDate || '日常收录'}</span>
                        
                        {/* Option to Delete Product Photo Card */}
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-500 hover:text-red-700 hover:underline font-serif"
                          title="移出此款"
                        >
                          移出本款式
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {associatedProducts.length === 0 && (
                <div className="col-span-full bg-white text-center py-16 rounded-3xl border border-zinc-200">
                  <Compass className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="font-sans text-xs text-zinc-500">目前暂未为此名片品牌建立具体的产品美照谱系。</p>
                  <p className="text-[10px] text-zinc-400 mt-1 max-w-sm mx-auto">
                    您可以立刻点击右上角的“添加产品/照片”按钮，补充您身边的本册做工实物拍图。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER PRIMARY LIST VIEW
  // -------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 relative">
      {/* Primary List View */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* Header Block with Segment Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">品牌类别库</h2>
            <p className="font-sans text-xs text-zinc-500 mt-1">收录并分类世界各地精美手工纸品及计划本册品牌，并支持对独立手工工作室的登记档案</p>
          </div>
          
          <button
            id="add-brand-full-btn"
            onClick={() => onAddTrigger('brand')}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>添加新名片</span>
          </button>
        </div>

        {/* Categories Tabs & Search Input */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 mb-6 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Segment Tabs */}
            <div className="flex bg-zinc-100 p-1 rounded-xl w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveSegment('established');
                }}
                className={`flex-1 md:flex-none py-1.5 px-4 rounded-lg font-sans text-xs font-bold transition-all ${
                  activeSegment === 'established'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                经典与知名老牌 ({brands.filter(b => (b.brandType || 'established') === 'established').length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSegment('independent');
                }}
                className={`flex-1 md:flex-none py-1.5 px-4 rounded-lg font-sans text-xs font-bold transition-all ${
                  activeSegment === 'independent'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                独立工作室 & 创作者 ({brands.filter(b => b.brandType === 'independent').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 pl-9 pr-4 font-sans text-xs focus:outline-none focus:border-zinc-955"
                placeholder="搜索品牌名称或故事印记..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Brands Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map(b => (
            <div
              id={`brand-card-${b.id}`}
              key={b.id}
              onClick={() => setSelectedBrand(b)}
              className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-between cursor-pointer transition-all bento-card hover:border-zinc-300 shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider font-semibold">{b.country}</span>
                  </div>
                  <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    b.marketTier === 'Premium' ? 'bg-amber-100 text-amber-800' : 
                    b.marketTier === 'Mid-range' ? 'bg-zinc-100 text-zinc-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {b.marketTier === 'Premium' ? '精奢' : b.marketTier === 'Mid-range' ? '品质' : '实用'}
                  </span>
                </div>

                <div className="space-y-0.5 mb-3">
                  <h3 className="font-sans font-bold text-base text-zinc-900 tracking-tight">{b.name}</h3>
                  <p className="font-mono text-[10px] text-zinc-400 truncate">{b.englishName || 'Creator Profile'}</p>
                </div>

                <p className="font-sans text-xs text-zinc-600 leading-relaxed line-clamp-3 mb-4">
                  {b.brandStory}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {b.tags.slice(0, 3).map(t => (
                    <span key={t} className="font-sans text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-500 px-2 py-0.5 rounded-lg font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-zinc-100 pt-3">
                  <span className="font-mono text-[10px] text-zinc-400">{b.foundedYear ? `Established ${b.foundedYear}` : 'Independent'}</span>
                  <div className="flex items-center gap-1 font-sans text-xs font-bold text-zinc-900">
                    <span>查看详情</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-900" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredBrands.length === 0 && (
            <div className="col-span-full bg-white text-center py-12 rounded-2xl border border-zinc-200">
              <Compass className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <p className="font-sans text-xs text-zinc-400 mb-2">暂未找到符合条件的品牌名片卡。</p>
              <button 
                onClick={() => onAddTrigger('brand')}
                className="font-sans text-xs text-zinc-900 font-bold underline"
              >
                自主录入一张新品牌卡页
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
