/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scissors, Sparkles, AlertTriangle, CheckCircle, ChevronRight, HelpCircle, X } from 'lucide-react';
import { Craft } from '../types';

interface CraftListProps {
  crafts: Craft[];
}

export default function CraftList({ crafts }: CraftListProps) {
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 relative">
      {/* Primary List View */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">2. 印刷工艺库</h2>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            收录并解析极制本册常用的表面处理与印后工艺。点击任意工艺卡片即可查阅详细工艺说明。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crafts.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedCraft(c)}
              className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-between cursor-pointer transition-all bento-card hover:border-zinc-300 shadow-sm"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-zinc-800" />
                    <span>{c.name.split(' (')[0]}</span>
                  </span>
                  
                  <div className="flex items-center gap-0.5" title="工艺成本级别">
                    <span className="font-mono text-[9px] text-zinc-400 mr-1">成本:</span>
                    {[1, 2, 3].map(step => {
                      const activeCount = c.costLevel === 'High' ? 3 : c.costLevel === 'Medium' ? 2 : 1;
                      return (
                        <span 
                          key={step} 
                          className={`w-1.5 h-1.5 rounded-full ${step <= activeCount ? 'bg-zinc-800' : 'bg-zinc-200'}`} 
                        />
                      );
                    })}
                  </div>
                </div>

                <p className="font-sans text-xs text-zinc-650 line-clamp-2 mb-4 leading-relaxed">
                  {c.definition}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
                <span className="font-mono text-[9px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold uppercase">
                  {c.costLevel === 'High' ? '高精要求' : c.costLevel === 'Medium' ? '中端合规' : '基础平价'}
                </span>
                
                <div className="flex items-center gap-1 font-sans text-xs font-bold text-zinc-900">
                  <span>查看工艺详情</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-900" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAY DIALOG MODAL - Show Craft Specifications */}
      {selectedCraft && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in"
          onClick={() => setSelectedCraft(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-start bg-zinc-50/50">
              <div>
                <span className="font-sans text-[10px] text-zinc-400 font-bold uppercase tracking-wider">DETAIL DOSSIER</span>
                <h3 className="font-sans font-bold text-lg text-zinc-900 mt-1 leading-snug">{selectedCraft.name}</h3>
                <p className="font-mono text-[10px] text-zinc-400 mt-0.5">Printing Craft Profile</p>
              </div>
              <button 
                onClick={() => setSelectedCraft(null)}
                className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Technical Definition */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2">
                  工艺描述与技术机理
                </h4>
                <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                  {selectedCraft.definition}
                </p>
              </div>

              {/* Pros and Cons Splits */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2">
                  设计研判评级 (Specs)
                </h4>
                
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-3.5">
                  <div>
                    <div className="font-sans text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>设计优越性 (Pros)</span>
                    </div>
                    <p className="font-sans text-xs text-zinc-600 leading-normal pl-4.5">
                      {selectedCraft.prosAndCons.split('缺点：')[0].replace('优点：', '')}
                    </p>
                  </div>

                  <div className="border-t border-zinc-200/60 pt-3">
                    <div className="font-sans text-xs font-bold text-red-800 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>工艺局限性与避坑 (Cons)</span>
                    </div>
                    <p className="font-sans text-xs text-zinc-600 leading-normal pl-4.5">
                      {selectedCraft.prosAndCons.includes('缺点：') ? selectedCraft.prosAndCons.split('缺点：')[1] : '生产调合容差大，打样成本相对较高。'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced typical applications */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2">
                  经典工艺融合理念
                </h4>
                <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-2xl font-sans text-xs text-zinc-600 leading-relaxed">
                  <div className="font-bold text-zinc-900 mb-1 flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>经典本册实操示范:</span>
                  </div>
                  {selectedCraft.typicalApplications}
                </div>
              </div>

              {/* Production Notes / Pre-flight Pitfalls */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span>佐藤卓制菲林避坑笔记</span>
                </h4>
                <p className="font-sans text-xs text-zinc-500 leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60 font-medium">
                  {selectedCraft.notes}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right">
              <button 
                onClick={() => setSelectedCraft(null)}
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
