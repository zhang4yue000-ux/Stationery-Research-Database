/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, ChevronRight, HelpCircle, X } from 'lucide-react';
import { Binding } from '../types';

interface BindingListProps {
  bindings: Binding[];
}

export default function BindingList({ bindings }: BindingListProps) {
  const [selectedBinding, setSelectedBinding] = useState<Binding | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 relative">
      {/* Primary List View */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">3. 装帧工艺库</h2>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            剖析锁线胶装、裸背缝帖、骑马装订等装订方式的脊背骨架与展开特性。点击工艺卡片可查看其物理结构及限制。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bindings.map(b => (
            <div 
              key={b.id} 
              onClick={() => setSelectedBinding(b)}
              className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-between cursor-pointer transition-all bento-card hover:border-zinc-300 shadow-sm"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-zinc-800" />
                    <span>{b.name.split(' (')[0]}</span>
                  </span>
                  <span className="font-mono text-[9px] text-zinc-400 uppercase bg-zinc-100 px-2 py-0.5 rounded-lg font-bold">
                    物理开叠脊梁
                  </span>
                </div>

                <p className="font-sans text-xs text-zinc-650 line-clamp-2 mb-4 leading-relaxed">
                  {b.structure}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
                <span className="font-sans text-[10px] text-zinc-500 font-bold">
                  展开角: <span className="text-zinc-900 font-semibold">180° 完全平摊</span>
                </span>
                
                <div className="flex items-center gap-1 font-sans text-xs font-bold text-zinc-900">
                  <span>查看装帧特性</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-900" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAY DIALOG MODAL - Show Binding Specifications */}
      {selectedBinding && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in"
          onClick={() => setSelectedBinding(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-start bg-zinc-50/50">
              <div>
                <span className="font-sans text-[10px] text-zinc-400 font-bold uppercase tracking-wider">BINDING DOSSIER</span>
                <h3 className="font-sans font-bold text-lg text-zinc-900 mt-1 leading-snug">{selectedBinding.name}</h3>
                <p className="font-mono text-[10px] text-zinc-400 mt-0.5">Bookbinding Mechanics</p>
              </div>
              <button 
                onClick={() => setSelectedBinding(null)}
                className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Technical Structure */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2">
                  物理叠开构造 (Rigidity Structure)
                </h4>
                <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                  {selectedBinding.structure}
                </p>
              </div>

              {/* Pros and Cons */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2">
                  适用性能研判
                </h4>
                
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 space-y-3">
                  <div>
                    <div className="font-sans text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>核心长处与可取性</span>
                    </div>
                    <p className="font-sans text-xs text-zinc-650 leading-normal pl-4.5">
                      {selectedBinding.prosAndCons.split('缺点：')[0].replace('优点：', '')}
                    </p>
                  </div>

                  <div className="border-t border-zinc-200/60 pt-3">
                    <div className="font-sans text-xs font-bold text-red-800 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>工艺短板与物理限制</span>
                    </div>
                    <p className="font-sans text-xs text-zinc-650 leading-normal pl-4.5">
                      {selectedBinding.prosAndCons.includes('缺点：') ? selectedBinding.prosAndCons.split('缺点：')[1] : '较厚本册叠合处容易产生爬变。'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Suitable Scenarios */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2">
                  推荐装帧应用场景
                </h4>
                <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                  {selectedBinding.suitableScenario}
                </p>
              </div>

              {/* Expert designer notes */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-900 pl-2 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span>装帧研判批注</span>
                </h4>
                <p className="font-sans text-xs text-zinc-500 leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60 font-medium whitespace-pre-line">
                  {selectedBinding.notes}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right">
              <button 
                onClick={() => setSelectedBinding(null)}
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
