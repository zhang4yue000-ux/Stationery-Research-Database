/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Brand, Product, Material, Craft } from '../types';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'brand' | 'product' | 'material' | 'craft';
  editItem?: any; // If editing
  onSave: (category: string, item: any) => void;
  brands: Brand[]; // Context for product associate
}

export default function FormModal({
  isOpen,
  onClose,
  category,
  editItem,
  onSave,
  brands
}: FormModalProps) {
  
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Core Fields State management
  // Brand Fields
  const [bName, setBName] = useState(editItem?.name || '');
  const [bEng, setBEng] = useState(editItem?.englishName || '');
  const [bCountry, setBCountry] = useState(editItem?.country || 'Japan');
  const [bFounder, setBFounder] = useState(editItem?.founder || '');
  const [bYear, setBYear] = useState(editItem?.foundedYear || '');
  const [bWebsite, setBWebsite] = useState(editItem?.website || '');
  const [bInstagram, setBInstagram] = useState(editItem?.instagram || '');
  const [bXiaohongshu, setBXiaohongshu] = useState(editItem?.xiaohongshu || '');
  const [bStory, setBStory] = useState(editItem?.brandStory || '');
  const [bTier, setBTier] = useState<any>(editItem?.marketTier || 'Premium');
  const [bStyle, setBStyle] = useState<any>(editItem?.style || 'Minimalist');
  const [bTagsStr, setBTagsStr] = useState(editItem?.tags ? editItem.tags.join(', ') : '');
  const [bType, setBType] = useState<'established' | 'independent'>(
    editItem?.brandType || (editItem?.id ? 'established' : 'independent')
  );
  const [bNotes, setBNotes] = useState(editItem?.notes || '');

  // Product Fields
  const [pBrandId, setPBrandId] = useState(editItem?.brandId || (brands[0]?.id || ''));
  const [pName, setPName] = useState(editItem?.name || '');
  const [pDate, setPDate] = useState(editItem?.releaseDate || '2025-01');
  const [pCat, setPCat] = useState<any>(editItem?.category || 'Notebook');
  const [pDims, setPDims] = useState(editItem?.dimensions || '148 x 210 mm');
  const [pPages, setPPages] = useState(editItem?.pageCount || 160);
  const [pPaper, setPPaper] = useState(editItem?.paperType || 'MD 纸本白');
  const [pBinding, setPBinding] = useState(editItem?.bindingMethod || '锁线胶装');
  const [pPrice, setPPrice] = useState(editItem?.price || '¥68.00');
  const [pNotes, setPNotes] = useState(editItem?.notes || '');
  const [pTagsStr, setPTagsStr] = useState(editItem?.tags ? editItem.tags.join(', ') : '');

  // Material Fields
  const [mName, setMName] = useState(editItem?.name || '');
  const [mCat, setMCat] = useState<any>(editItem?.category || 'Paper');
  const [mOrigin, setMOrigin] = useState(editItem?.origin || '');
  const [mFeatures, setMFeatures] = useState(editItem?.features || '');
  const [mScenario, setMScenario] = useState(editItem?.suitableScenario || '');
  const [mNotes, setMNotes] = useState(editItem?.notes || '');
  const [mTagsStr, setMTagsStr] = useState(editItem?.tags ? editItem.tags.join(', ') : '');

  // Sparkle AI Auto Generative Pre-fill triggers
  const handleAIGenerate = async () => {
    const queryName = category === 'brand' ? bName : category === 'product' ? pName : mName;
    if (!queryName.trim()) {
      setErrorMsg('请输入卡片名称，以便 AI 检索真实物理规格！');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/generate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          name: queryName,
          brandContext: category === 'product' ? brands.find(b => b.id === pBrandId)?.name : undefined
        })
      });

      if (!response.ok) {
        throw new Error('AI Generation failed');
      }

      const parsed = await response.json();
      
      // Map AI parameters directly to inputs
      if (category === 'brand') {
        setBEng(parsed.englishName || '');
        setBCountry(parsed.country || 'Japan');
        setBFounder(parsed.founder || '');
        setBYear(parsed.foundedYear || '');
        setBWebsite(parsed.website || '');
        setBInstagram(parsed.instagram || '');
        setBXiaohongshu(parsed.xiaohongshu || '');
        setBStory(parsed.brandStory || '');
        setBTier(parsed.marketTier || 'Premium');
        setBStyle(parsed.style || 'Minimalist');
        setBTagsStr(parsed.tags ? parsed.tags.join(', ') : '');
        setBNotes(parsed.notes || '');
      } else if (category === 'product') {
        setPDate(parsed.releaseDate || '2025-01');
        setPCat(parsed.category || 'Notebook');
        setPDims(parsed.dimensions || 'A5');
        setPPages(parsed.pageCount || 160);
        setPPaper(parsed.paperType || '');
        setPBinding(parsed.bindingMethod || '');
        setPPrice(parsed.price || '¥68');
        setPTagsStr(parsed.tags ? parsed.tags.join(', ') : '');
        setPNotes(parsed.notes || '');
      } else if (category === 'material') {
        setMCat(parsed.category || 'Paper');
        setMOrigin(parsed.origin || '');
        setMFeatures(parsed.features || '');
        setMScenario(parsed.suitableScenario || '');
        setMNotes(parsed.notes || '');
        setMTagsStr(parsed.tags ? parsed.tags.join(', ') : '');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('未配置服务器端口密钥或连接超时，已启动本地模型引擎生成。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (category === 'brand') {
      if (!bName.trim()) return;
      onSave('brand', {
        id: editItem?.id || `b-${Date.now()}`,
        name: bName,
        englishName: bEng,
        country: bCountry,
        founder: bFounder,
        foundedYear: bYear,
        website: bWebsite,
        instagram: bInstagram,
        xiaohongshu: bXiaohongshu,
        brandStory: bStory,
        marketTier: bTier,
        style: bStyle,
        representativeProducts: editItem?.representativeProducts || [],
        competitors: editItem?.competitors || [],
        tags: bTagsStr.split(',').map(s => s.trim()).filter(Boolean),
        notes: bNotes || '新增记录。',
        brandType: bType
      });
    } else if (category === 'product') {
      if (!pName.trim()) return;
      onSave('product', {
        id: editItem?.id || `p-${Date.now()}`,
        brandId: pBrandId,
        name: pName,
        releaseDate: pDate,
        category: pCat,
        dimensions: pDims,
        pageCount: Number(pPages),
        paperType: pPaper,
        bindingMethod: pBinding,
        price: pPrice,
        notes: pNotes,
        tags: pTagsStr.split(',').map(s => s.trim()).filter(Boolean),
        materialIds: editItem?.materialIds || [],
        craftIds: editItem?.craftIds || [],
        favorited: editItem?.favorited || false
      });
    } else if (category === 'material') {
      if (!mName.trim()) return;
      onSave('material', {
        id: editItem?.id || `m-${Date.now()}`,
        name: mName,
        category: mCat,
        origin: mOrigin,
        features: mFeatures,
        suitableScenario: mScenario,
        representativeBrands: editItem?.representativeBrands || ['MD Paper'],
        notes: mNotes,
        tags: mTagsStr.split(',').map(s => s.trim()).filter(Boolean)
      });
    }

    onClose();
  };

  const titlePrefix = editItem ? '修改' : '智能新建';
  const labelText = category === 'brand' ? '品牌档案' : category === 'product' ? '产品款型' : '理化材质';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-lg border border-[#EBE9E0] shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EBE9E0] flex justify-between items-center bg-[#FAF9F5]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-sans font-bold text-[#1F2937] text-md">
              {titlePrefix}{labelText} ({category.toUpperCase()})
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-neutral-150 transition">
            <X className="w-5 h-5 text-[#8C8A82]" />
          </button>
        </div>

        {/* Action Error info message */}
        {errorMsg && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Form Scroll body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Sparkly Generative Trigger Header: Only shown on creation */}
          {!editItem && (
            <div className="bg-neutral-50 rounded border border-[#EBE9E0] p-4 flex justify-between items-center gap-4">
              <div className="flex-1">
                <h4 className="font-sans text-[12px] font-bold text-[#1F2937] flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI 智能前置生成档案 (Instant Pre-fill)</span>
                </h4>
                <p className="font-sans text-[11px] text-[#8C8A82] mt-0.5">
                  输入名称，点击右侧 sparkles 按钮。Gemini 将自动检索背景故事、物理厚度、官网及价格规范，直接为您填下所有复杂的专业输入框。
                </p>
              </div>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isLoading}
                className="flex items-center gap-1.5 bg-[#1F2937] hover:bg-[#374151] text-white disabled:bg-neutral-300 font-sans text-xs font-semibold px-4 py-2.5 rounded transition whitespace-nowrap"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{isLoading ? 'AI 智能填表中...' : 'AI 智能填卡'}</span>
              </button>
            </div>
          )}

          {category === 'brand' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">品牌名称</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#ffffff] rounded px-3 py-1.8 font-sans text-xs focus:outline-none focus:border-[#1F2937]"
                    placeholder="如: Hobonichi"
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">官方英文学名, 外号</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: HOBONICHI TECHO"
                    value={bEng}
                    onChange={(e) => setBEng(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1.5 block">品牌类别</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBType('established')}
                    className={`py-2 px-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      bType === 'established'
                        ? 'border-zinc-900 bg-zinc-900 text-white font-semibold shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <span className="text-xs">经典老牌 & 知名文具品牌</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBType('independent')}
                    className={`py-2 px-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      bType === 'independent'
                        ? 'border-zinc-900 bg-zinc-900 text-white font-semibold shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <span className="text-xs">独立工作室&个人创作者</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">国家/归属地区</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: Japan"
                    value={bCountry}
                    onChange={(e) => setBCountry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">创始人/设计师</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: 糸井重里"
                    value={bFounder}
                    onChange={(e) => setBFounder(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">成立年份</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: 2001"
                    value={bYear}
                    onChange={(e) => setBYear(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">设计风格定义</label>
                  <select
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded py-1.5 px-3 font-sans text-xs text-[#1F2937]"
                    value={bStyle}
                    onChange={(e) => setBStyle(e.target.value as any)}
                  >
                    <option value="Minimalist">极简简素</option>
                    <option value="Vintage">复古中古</option>
                    <option value="Cute/Illustrative">萌系插画</option>
                    <option value="Industrial">工业战术</option>
                    <option value="Eco-Green">绿色环保</option>
                    <option value="Traditional">传统古典</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">市场等级与溢价</label>
                  <select
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded py-1.5 px-3 font-sans text-xs text-[#1F2937]"
                    value={bTier}
                    onChange={(e) => setBTier(e.target.value as any)}
                  >
                    <option value="Premium">电商高价/奢侈</option>
                    <option value="Mid-range">中等偏高质感线</option>
                    <option value="Budget">入门大众高性价比</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">官方主站 Website</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="example.com"
                    value={bWebsite}
                    onChange={(e) => setBWebsite(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">Instagram 官方号</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="travelers_company"
                    value={bInstagram}
                    onChange={(e) => setBInstagram(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">小红书主号</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="本册研究院"
                    value={bXiaohongshu}
                    onChange={(e) => setBXiaohongshu(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">品牌美学</label>
                <textarea
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded p-3 font-sans text-xs focus:outline-none h-28"
                  placeholder="写一段该大厂的制造信仰，以及每年联名特色（不得少于 80 字）"
                  value={bStory}
                  onChange={(e) => setBStory(e.target.value)}
                />
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">品牌帖士</label>
                <textarea
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded p-3 font-sans text-xs focus:outline-none h-20"
                  placeholder="如：该品牌与其主力纸品有强绑定，裸书脊机制开摊180度不受限..."
                  value={bNotes}
                  onChange={(e) => setBNotes(e.target.value)}
                />
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">交叉印记标签 (Tags, 用英文逗号隔离)</label>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                  placeholder="如: 巴川纸, 裸脊装订, 手帐控"
                  value={bTagsStr}
                  onChange={(e) => setBTagsStr(e.target.value)}
                />
              </div>
            </div>
          )}

          {category === 'product' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">所属总牌档案馆 (Brand Link)</label>
                  <select
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded py-1.5 px-3 font-sans text-xs text-[#1F2937]"
                    value={pBrandId}
                    onChange={(e) => setPBrandId(e.target.value)}
                    required
                  >
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">产品正式品名</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: Weeks 便携日程手账"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">分类</label>
                  <select
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded py-1.5 px-3 font-sans text-xs text-[#1F2937]"
                    value={pCat}
                    onChange={(e) => setPCat(e.target.value as any)}
                  >
                    <option value="Notebook">笔记本</option>
                    <option value="Writing Instrument">书写硬笔</option>
                    <option value="Envelope/Letter">信件信封</option>
                    <option value="Desk Organizer">桌面理纳</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">第一季上市年月</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    value={pDate}
                    onChange={(e) => setPDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">市面推荐定价带</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: ¥68.00"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">精确尺寸 dimensions</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: 148 x 210 mm"
                    value={pDims}
                    onChange={(e) => setPDims(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">叠页页数 (Pages)</label>
                  <input
                    type="number"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    value={pPages}
                    onChange={(e) => setPPages(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">原页用纤维纸质</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: 巴川纸 52g"
                    value={pPaper}
                    onChange={(e) => setPPaper(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">书脊锁线装订机制</label>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                  placeholder="如: 裸脊锁线, 骑马钉"
                  value={pBinding}
                  onChange={(e) => setPBinding(e.target.value)}
                />
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">设计师体验研判点评 (Notes)</label>
                <textarea
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded p-3 font-sans text-xs focus:outline-none h-24"
                  placeholder="写写书写阻尼、平展刚度、边缘手抚咯不咯手等研习细节。"
                  value={pNotes}
                  onChange={(e) => setPNotes(e.target.value)}
                />
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">核心标签 (Tags)</label>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                  placeholder="钢笔御用, 180完全铺平, 极致阻尼"
                  value={pTagsStr}
                  onChange={(e) => setPTagsStr(e.target.value)}
                />
              </div>
            </div>
          )}

          {category === 'material' && (
            <div className="space-y-4">
              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">纸品/皮革物理材料名</label>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                  placeholder="如: 三善巴川纸"
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">材料核心分类</label>
                  <select
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded py-1.5 px-3 font-sans text-xs text-[#1F2937]"
                    value={mCat}
                    onChange={(e) => setMCat(e.target.value as any)}
                  >
                    <option value="Paper">Paper 纸制</option>
                    <option value="Leather">Leather 动物植鞣皮革</option>
                    <option value="Book Cloth">Book Cloth 编织装帧面料</option>
                    <option value="Plastic">Plastic 复合工业塑料</option>
                    <option value="Metal">Metal 铜制拉丝金属</option>
                    <option value="Other">Other 混合物</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">工艺源产地 Region</label>
                  <input
                    type="text"
                    className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                    placeholder="如: 日本国 富士山原浆"
                    value={mOrigin}
                    onChange={(e) => setMOrigin(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">纤维物理抗渗透特征 (Features, 段落)</label>
                <textarea
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded p-3 font-sans text-xs focus:outline-none h-24"
                  placeholder="• 52gsm/68gsm超轻量：不退不洇墨\n• 钢笔抗出血..."
                  value={mFeatures}
                  onChange={(e) => setMFeatures(e.target.value)}
                />
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">最舒适搭配书写笔尖</label>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                  placeholder="如: F或EF级钢笔，色彩雫重度 sheen 墨水"
                  value={mScenario}
                  onChange={(e) => setMScenario(e.target.value)}
                />
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">装帧拉力、冷粘切折注意事项</label>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                />
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold text-[#1F2937] mb-1 block">标签 (逗号隔离)</label>
                <input
                  type="text"
                  className="w-full bg-[#FAF9F5] border border-[#E3DFD5] rounded px-3 py-1.8 font-sans text-xs focus:outline-none"
                  value={mTagsStr}
                  onChange={(e) => setMTagsStr(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="border-t border-[#EBE9E0] pt-4 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-100 hover:bg-neutral-200 text-[#5C5A52] font-sans text-xs font-semibold px-4 py-2 rounded transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-[#1F2937] hover:bg-neutral-800 text-white font-sans text-xs font-semibold px-5 py-2 rounded transition shadow-sm"
            >
              提交保存
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
