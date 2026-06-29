/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lightbulb, Layers, Search, Code, CheckCircle, HelpCircle } from 'lucide-react';
import { Inspiration } from '../types';

interface InspirationListProps {
  inspirations: Inspiration[];
}

export default function InspirationList({ inspirations }: InspirationListProps) {
  const [catFilter, setCatFilter] = useState<'All' | 'Architecture' | 'Books' | 'Exhibition' | 'Packaging' | 'Other'>('All');

  const filtered = inspirations.filter(ins => {
    return catFilter === 'All' || ins.category === catFilter;
  });

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#F5F4EE]">
      <div className="mb-6">
        <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">跨界美学灵感库 (Inspiration Moodboard)</h2>
        <p className="font-sans text-xs text-zinc-500 mt-0.5">跨越建筑合缝、精美书籍装帧或者清酒瓶标签触感工艺，为未来的文具研发输送外脑养分</p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['All', 'Architecture', 'Books', 'Exhibition', 'Packaging', 'Other'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
              catFilter === cat 
                ? 'bg-[#1F2937] text-white shadow-sm' 
                : 'bg-white text-[#5C5A52] border border-[#EBE9E0] hover:bg-[#EFECE3]'
            }`}
          >
            {cat === 'All' ? '全部跨界品类' : cat === 'Architecture' ? '空间与建筑结构' : cat === 'Books' ? '先锋图书装帧' : cat === 'Exhibition' ? '策展与光影' : cat === 'Packaging' ? '高端瓶贴包装' : '其它工艺艺术'}
          </button>
        ))}
      </div>

      {/* Inspiration cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(ins => (
          <div key={ins.id} className="bg-white rounded-lg border border-[#EBE9E0] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[9px] bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">
                  {ins.category}
                </span>
                <span className="font-sans text-[11px] text-[#8C8A82] font-semibold">
                  源起: {ins.source}
                </span>
              </div>

              <h3 className="font-sans font-bold text-base text-zinc-900 tracking-tight mb-2 leading-snug">
                {ins.title}
              </h3>

              <div className="flex flex-wrap gap-1 mb-4">
                {ins.keywords.map(kw => (
                  <span key={kw} className="font-sans text-[9px] bg-[#FAF9F5] text-[#8C8A82] border border-[#E3DFD5] px-2 py-0.5 rounded">
                     #{kw}
                  </span>
                ))}
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div>
                  <strong className="text-zinc-900 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></span>
                    跨界美学要义 analysis (Cross-over Concept)
                  </strong>
                  <p className="text-zinc-650 text-xs leading-relaxed mt-1.5 bg-[#FAF9F5] p-3 rounded border border-[#EBE9E0]">
                    {ins.designAnalysis}
                  </p>
                </div>

                <div className="bg-amber-50/40 border border-dashed border-amber-200 rounded p-3.5">
                  <strong className="text-amber-950 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>文具与本册平面设计的实际落地借鉴:</span>
                  </strong>
                  <p className="text-amber-900 text-xs leading-relaxed mt-1.5 font-medium">
                    {ins.stationeryLessons}
                  </p>
                </div>
              </div>
            </div>

            {ins.notes && (
              <div className="border-t border-[#FAF9F5] pt-3 mt-4 text-[10px] text-[#8C8A82] text-right font-sans">
                灵感采风归档备忘: {ins.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
