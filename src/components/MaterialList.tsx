/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, MapPin, Compass, Sparkles, ChevronRight, HelpCircle, X } from 'lucide-react';
import { Material } from '../types';

interface MaterialListProps {
  materials: Material[];
}

export default function MaterialList({ materials }: MaterialListProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Paper' | 'Leather' | 'Book Cloth' | 'Other'>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const filtered = materials.filter(m => {
    return activeCategory === 'All' || m.category === activeCategory;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 relative">
      {/* Primary List View */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">4. 材质档案库</h2>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            整理收录特种书写纸张、植鞣牛皮封面及裱贴布料的纤维克位与触觉指标。点击材质卡片可深入了解材质详况。
          </p>
        </div>

        {/* Category selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1.5 scrollbar-thin">
          {(['All', 'Paper', 'Leather', 'Book Cloth', 'Other'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-2xl transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              {cat === 'All' ? '全部材质' : cat === 'Paper' ? '日常书写纸张' : cat === 'Leather' ? '植鞣真牛皮' : cat === 'Book Cloth' ? '精质装帧布料' : '其它辅助触材'}
            </button>
          ))}
        </div>

        {/* Grid of material profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(m => (
            <div 
              key={m.id} 
              onClick={() => setSelectedMaterial(m)}
              className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-between cursor-pointer transition-all bento-card hover:border-zinc-300 shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                    {m.category === 'Paper' ? '书写纸' : m.category === 'Leather' ? '封面革' : m.category === 'Book Cloth' ? '装帧布' : '辅助特装'}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{m.origin}</span>
                  </span>
                </div>

                <h3 className="font-sans font-bold text-base text-zinc-900 mb-2">{m.name}</h3>
                
                <p className="font-sans text-xs text-zinc-650 line-clamp-2 leading-relaxed mb-4">
                  {m.features.split('\n')[0]}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMaterial(m);
                  }}
                  className="px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 rounded-xl text-[10px] font-bold border border-zinc-200 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>适用对象</span>
                </button>
                
                <div className="flex items-center gap-1 font-sans text-xs font-bold text-zinc-900">
                  <span>查看材质详情</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-900" />
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full bg-white text-center py-12 rounded-2xl border border-zinc-200">
              <Compass className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <p className="font-sans text-xs text-zinc-400">目前暂未登记此类别特种精选材料。</p>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY DIALOG MODAL - Show Material Specifications */}
      {selectedMaterial && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-start bg-zinc-50/50">
              <div>
                <span className="font-sans text-[10px] text-zinc-400 font-bold uppercase tracking-wider">MATERIAL DOSSIER</span>
                <h3 className="font-sans font-bold text-lg text-zinc-900 mt-1 leading-snug">{selectedMaterial.name}</h3>
                <p className="font-mono text-[10px] text-zinc-400 mt-0.5">Physical Material Profile</p>
              </div>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Structural Parameters */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2">
                  材质特征
                </h4>
                <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-2xl font-sans text-xs text-zinc-600 leading-normal space-y-2.5">
                  <div className="font-bold text-zinc-950 flex items-center gap-1 mb-1 text-[11.5px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>纤维特性研判:</span>
                  </div>
                  {selectedMaterial.features.split('\n').map((line, idx) => (
                    <div key={idx} className="leading-relaxed pl-1 text-zinc-650">
                      • {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suitable writing tools */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2">
                  设计推荐
                </h4>
                <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                  {selectedMaterial.suitableScenario}
                </p>
              </div>

              {/* Adoptor Brands */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2.5">
                  经典采用该材质的品牌
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.representativeBrands.map(b => (
                    <span key={b} className="bg-zinc-100 text-zinc-800 border border-zinc-200 font-sans text-xs px-2.5 py-1 rounded-xl font-semibold">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expert Evaluation Notes */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span>备注</span>
                </h4>
                <p className="font-sans text-xs text-zinc-550 leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60 font-medium whitespace-pre-line">
                  {selectedMaterial.notes}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right">
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
