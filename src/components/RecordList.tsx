/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Plus, 
  MapPin, 
  Calendar, 
  Tag, 
  X, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  HelpCircle,
  FileText,
  Pencil,
  Search,
  Check,
  Upload
} from 'lucide-react';
import { ProductRecord } from '../types';

interface RecordListProps {
  records: ProductRecord[];
  onAddRecord: (newRecord: Omit<ProductRecord, 'id'>) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateRecord: (updatedRecord: ProductRecord) => void;
}

// 3 Realistic default records to pre-populate beautifully
export const initialRecords: ProductRecord[] = [
  {
    id: 'rec-1',
    title: '京都手工店「曝脊锁线」红线手账本',
    brandName: '京都 · 乌丸通手工书坊',
    imageUrl: '', // default fallback placeholder
    notes: '在京都手工纸品展上拍摄。最显眼的是其书画脊梁直接暴露在外的红色多股麻线。不仅每一帖配页都有精密的拉线锁紧，且书脊没有附胶，使得整本书能够 180° 无阻碍完全摊平。封皮采用 300g 熟宣裱贴灰色灰板，极富手持重感。',
    date: '2026-05-18',
    tags: ['锁线裸背', '特种麻线', '完全摊平']
  },
  {
    id: 'rec-2',
    title: '粗粝灰卡原色「空气压凹」植物笔记本',
    brandName: 'Midori 旅行概念快闪店',
    imageUrl: '',
    notes: '封皮选用再生草浆灰卡，边缘刻意保留了不规则的撕纸毛边。logo 处采用深层无色热压工艺（空气压凹），凹陷深度接近 1.2mm，无需油墨就形成了极高质感的光影明暗对比。纸张手感极具颗粒感。',
    date: '2026-06-02',
    tags: ['空气凹印', '草浆灰卡', '光影对比']
  },
  {
    id: 'rec-3',
    title: '高透杜邦纸「揉制褶皱」防水本封套',
    brandName: '东京代官山茑屋书店',
    imageUrl: '',
    notes: '极为独特的杜邦 Tyvek 材质外套。表面通过反复揉捶产生了类似老羊皮纸的自然褶皱。不仅具有极佳的耐撕裂与防水书写保护力，且随着持用时间的推移，手部油脂会让其表面产生迷人的复古色泽，可以说是现代特种材质与触感手控的极致结合。',
    date: '2026-06-12',
    tags: ['杜邦纸', '物理折皱', '轻量化保护']
  }
];

export default function RecordList({ records, onAddRecord, onDeleteRecord, onUpdateRecord }: RecordListProps) {
  const [selectedRecord, setSelectedRecord] = useState<ProductRecord | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state for existing cards
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBrandName, setEditBrandName] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDate, setEditDate] = useState('');

  // Form State for creating new card
  const [title, setTitle] = useState('');
  const [brandName, setBrandName] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageBlob, setImageBlob] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Setup editing fields when card selected
  const handleSelectRecord = (rec: ProductRecord) => {
    setSelectedRecord(rec);
    setIsEditing(false);
    setEditTitle(rec.title || '');
    setEditBrandName(rec.brandName || '');
    setEditNotes(rec.notes || '');
    setEditTags(rec.tags ? rec.tags.join(' ') : '');
    setEditImageUrl(rec.imageUrl || '');
    setEditDate(rec.date || '');
  };

  // Convert uploaded file to base64 for persistent client-side caching
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBlob(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBlob(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit hand-book record
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('请输入记录的灵感/产品名称！');
      return;
    }

    const parsedTags = tagsInput
      .split(/[,，、\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onAddRecord({
      title,
      brandName: brandName.trim() || '随拍记录',
      notes: notes.trim() || '该灵感未添加描述细节。',
      imageUrl: imageBlob,
      tags: parsedTags.length > 0 ? parsedTags : ['日常灵感'],
      date: new Date().toISOString().split('T')[0]
    });

    // Reset Form
    setTitle('');
    setBrandName('');
    setNotes('');
    setTagsInput('');
    setImageBlob('');
    setIsAddOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    if (!editTitle.trim()) {
      alert('请输入记录的灵感/产品名称！');
      return;
    }

    const parsedTags = editTags
      .split(/[,，、\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updated: ProductRecord = {
      id: selectedRecord.id,
      title: editTitle.trim(),
      brandName: editBrandName.trim() || '随拍记录',
      notes: editNotes.trim() || '该灵感未添加描述细节。',
      imageUrl: editImageUrl,
      tags: parsedTags.length > 0 ? parsedTags : ['日常灵感'],
      date: editDate || new Date().toISOString().split('T')[0]
    };

    onUpdateRecord(updated);
    setSelectedRecord(updated); // update details display
    setIsEditing(false);
  };

  const filteredRecords = records.filter(r => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const matchesTitle = r.title.toLowerCase().includes(query);
    const matchesBrand = (r.brandName || '').toLowerCase().includes(query);
    const matchesNotes = r.notes.toLowerCase().includes(query);
    const matchesTags = r.tags.some(tag => tag.toLowerCase().includes(query));
    
    return matchesTitle || matchesBrand || matchesNotes || matchesTags;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 relative">
      {/* Primary Scrollable List Context */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* Header Block with trigger */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div className="flex-1">
            <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">日常灵感库</h2>
            <p className="font-sans text-xs text-zinc-500 mt-1 mb-4">
              留存日常旅行、快闪展览中拍下的优秀产品照片。
            </p>
            {/* Elegant Search Input Box */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="在此搜索灵感本册名称、研判备忘或工艺标签..."
                className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-9 py-2.5 text-xs font-sans text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 border border-white rounded-md p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-805 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm shrink-0 text-white"
          >
            <Camera className="w-4 h-4" />
            <span>添加新名片</span>
          </button>
        </div>

        {/* Dynamic Photo Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map(rec => (
            <div
              key={rec.id}
              onClick={() => handleSelectRecord(rec)}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden flex flex-col cursor-pointer transition-all hover:border-zinc-300 hover:shadow-md bento-card"
            >
              {/* Card Photo Box */}
              <div className="h-44 bg-zinc-100 relative flex items-center justify-center overflow-hidden border-b border-zinc-100">
                {rec.imageUrl ? (
                  <img 
                    src={rec.imageUrl} 
                    alt={rec.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center mb-1">
                      <Camera className="w-5 h-5 text-zinc-500" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wide text-zinc-400 font-bold">Image Sample</span>
                  </div>
                )}
                
                {/* Float Badge Tag */}
                <span className="absolute top-3 left-3 font-sans text-[10px] bg-zinc-900/80 backdrop-blur-md text-white font-bold px-2 py-0.5 rounded-lg">
                  {rec.tags[0] || '日常灵感'}
                </span>
                
                {/* Float Date Tag */}
                <span className="absolute bottom-3 right-3 font-mono text-[9px] bg-white/90 backdrop-blur-md text-zinc-600 font-bold px-2 py-0.5 rounded">
                  {rec.date}
                </span>
              </div>

              {/* Card Text Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-sans text-[10.5px] font-semibold text-zinc-400 truncate">{rec.brandName || '日常发现'}</span>
                  </div>
                  
                  <h3 className="font-sans font-bold text-[14.5px] text-zinc-900 tracking-tight leading-snug line-clamp-1 mb-2">
                    {rec.title}
                  </h3>
                  
                  <p className="font-sans text-xs text-zinc-600 leading-relaxed line-clamp-3 mb-4">
                    {rec.notes}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 border-t border-zinc-100 pt-3">
                  {rec.tags.slice(0, 3).map(t => (
                    <span key={t} className="font-sans text-[10px] bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500 px-2 py-0.5 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredRecords.length === 0 && (
            <div className="col-span-full bg-white text-center py-16 rounded-2xl border border-zinc-200">
              <Camera className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
              <p className="font-sans text-xs text-zinc-400 mb-2">日常灵感库目前没有可查阅的设计灵感记录。</p>
              <button 
                onClick={() => setIsAddOpen(true)}
                className="font-sans text-xs text-zinc-900 font-bold underline border border-white px-2.5 py-1 rounded-lg"
              >
                马上录入记录到的第一个手账设计灵感
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY DIALOG MODAL - Show Record Details / Edit Details */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in"
          onClick={() => {
            if (!isEditing) {
              setSelectedRecord(null);
            }
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Banner */}
            <div className="h-56 bg-zinc-550 relative flex items-center justify-center overflow-hidden border-b border-zinc-200 shrink-0">
              {isEditing ? (
                <div className="relative w-full h-full bg-zinc-100 flex flex-col items-center justify-center">
                  {editImageUrl ? (
                    <img 
                      src={editImageUrl} 
                      alt="Edit Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <Camera className="w-8 h-8 text-zinc-400 mb-1" />
                      <span className="font-sans text-xs text-zinc-500">未设置灵感照片</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 bg-zinc-900/85 hover:bg-zinc-900 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition border border-white"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>更换相片</span>
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={editFileInputRef} 
                    className="hidden" 
                    onChange={handleEditFileChange}
                  />
                </div>
              ) : (
                <>
                  {selectedRecord.imageUrl ? (
                    <img 
                      src={selectedRecord.imageUrl} 
                      alt={selectedRecord.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100 to-zinc-200 flex flex-col items-center justify-center p-4">
                      <Camera className="w-8 h-8 text-zinc-400 mb-1" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Image Sample</span>
                    </div>
                  )}
                  
                  {/* Close Button Float */}
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    className="absolute top-4 right-4 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors border border-white"
                    title="关闭"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">本册/产品名称 *</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900" 
                      placeholder="名称" 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">品牌/地点</label>
                      <input 
                        type="text" 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900" 
                        placeholder="发现地点" 
                        value={editBrandName}
                        onChange={(e) => setEditBrandName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">日期</label>
                      <input 
                        type="date" 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900" 
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">标签</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900" 
                      placeholder="标签" 
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">备注</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 resize-none" 
                      placeholder="灵感笔记" 
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="font-sans text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {selectedRecord.brandName || '随记灵感'}
                      </span>
                      <span className="text-zinc-200">•</span>
                      <span className="font-mono text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {selectedRecord.date}
                      </span>
                    </div>
                    <h3 className="font-sans font-bold text-lg text-zinc-900 leading-snug">{selectedRecord.title}</h3>
                  </div>

                  {/* Observation Detail Notes */}
                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2">
                      产品特征
                    </h4>
                    <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-200 whitespace-pre-line">
                      {selectedRecord.notes}
                    </p>
                  </div>

                  {/* Tag Badges */}
                  <div>
                    <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2.5">
                      标签
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRecord.tags.map(t => (
                        <span key={t} className="bg-zinc-100 text-zinc-700 border border-zinc-200 font-sans text-xs px-2.5 py-1 rounded-xl font-semibold">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer with Actions */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 flex justify-between items-center shrink-0">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-all border border-white"
                  >
                    取消编辑
                  </button>

                  <button 
                    onClick={handleSaveEdit}
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 border border-white"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>保存更新</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (confirm('确定要清除这段随手拍灵感影像吗？')) {
                        onDeleteRecord(selectedRecord.id);
                        setSelectedRecord(null);
                      }
                    }}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-900 font-bold px-3 py-2 rounded-xl text-xs transition border border-white"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-650" />
                    <span>移出记录</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-white bg-white hover:bg-zinc-100 text-zinc-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>修改内容</span>
                    </button>

                    <button 
                      onClick={() => setSelectedRecord(null)}
                      className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm border border-white"
                    >
                      返回名片馆
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY DIALOG MODAL - Add Daily Photography Record */}
      {isAddOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in"
          onClick={() => setIsAddOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-zinc-900" />
                <div>
                  <h3 className="font-sans font-bold text-sm text-zinc-900">灵感手账</h3>
                  <p className="text-[10px] text-zinc-400 font-mono">NEW INSPIRATION PHOTO ARCHIVE</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors border border-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Image Upload Input Box */}
              <div>
                <label className="font-sans text-[11px] font-bold text-zinc-700 mb-1.5 block">产品外观触觉灵感照片（支持拖拉或点击上传） *</label>
                
                <div 
                  ref={dragRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px]"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  {imageBlob ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden">
                      <img src={imageBlob} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageBlob('');
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 border border-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <ImageIcon className="w-8 h-8 text-zinc-400 mx-auto" />
                      <p className="font-sans text-xs text-zinc-500 font-bold">点击选择相片，或将图片拖拽至此</p>
                      <p className="font-sans text-[10px] text-zinc-400">支持 JPG, PNG 等常用格式 (转为本地缓存)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="font-sans text-[11px] font-bold text-zinc-700 mb-1 block">本册/产品名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：京都手作烫金笔记本、粗粝草质本册"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Brand or location */}
              <div>
                <label className="font-sans text-[11px] font-bold text-zinc-700 mb-1 block">品牌/地点</label>
                <input
                  type="text"
                  placeholder="如：代官山茑屋书店、日本 Midori 概念店"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>

              {/* Tags split */}
              <div>
                <label className="font-sans text-[11px] font-bold text-zinc-700 mb-1 block">标签</label>
                <input
                  type="text"
                  placeholder="如：杜邦纸 自然褶皱 脊柱平摊"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              {/* Experience notes */}
              <div>
                <label className="font-sans text-[11px] font-bold text-zinc-700 mb-1 block">备注</label>
                <textarea
                  rows={4}
                  placeholder="详细描述本册的封面细节、触摸特质、内页配水或其它极富创意与启发的工艺点..."
                  className="w-full bg-zinc-55 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-105 hover:bg-zinc-200 text-zinc-700 rounded-xl font-sans text-xs font-bold transition border border-white"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-sans text-xs font-bold transition shadow-sm border border-white"
                >
                  确认载入灵感库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
