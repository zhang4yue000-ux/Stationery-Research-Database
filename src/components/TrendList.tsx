/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, Clock, FileText, ChevronRight, Compass } from 'lucide-react';
import { Trend } from '../types';

interface TrendListProps {
  trends: Trend[];
}

export default function TrendList({ trends }: TrendListProps) {
  const [selectedYear, setSelectedYear] = useState<'All' | '2024' | '2025' | '2026'>('All');

  const filteredTrends = trends.filter(t => {
    return selectedYear === 'All' || t.year === selectedYear;
  });

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#F5F4EE]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">文具工业设计趋势观察 (Trend Timeline)</h2>
          <p className="font-sans text-xs text-zinc-500 mt-0.5">跟踪年度最新手帐开本、色彩调性及纸品模块化的行业趋势流变</p>
        </div>
        
        {/* Year Filter buttons */}
        <div className="flex bg-white rounded border border-[#E3DFD5] p-1 shadow-sm">
          {(['All', '2024', '2025', '2026'] as const).map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1 text-xs font-semibold rounded transition ${
                selectedYear === y ? 'bg-[#1F2937] text-white' : 'text-[#8C8A82] hover:text-[#1F2937]'
              }`}
            >
              {y === 'All' ? '全部年份' : `${y}年`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredTrends.map(t => (
          <div key={t.id} className="bg-white rounded-lg border border-[#EBE9E0] p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded font-bold">
                  {t.year} 年
                </span>
                <h3 className="font-sans font-bold text-base text-zinc-900 tracking-tight">
                  {t.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {t.keywords.map(kw => (
                  <span key={kw} className="font-sans text-[10px] bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <p className="font-sans text-xs text-zinc-650 leading-relaxed mb-4 bg-[#FAF9F5] p-4 rounded border border-[#EBE9E0]">
              {t.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <strong className="text-zinc-900 font-bold block mb-1">正在采纳该设计演变的品牌:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {t.caseBrands.map(cb => (
                    <span key={cb} className="bg-neutral-50 border border-[#E3DFD5] px-2 py-1 rounded text-[#1F2937] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#CDA45E] rounded-full"></span>
                      {cb}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong className="text-zinc-900 font-bold block mb-1">给平面设计师的科学启示 (Design Insight):</strong>
                <div className="text-[#5C5A52] leading-relaxed italic bg-amber-50/50 p-2.5 border border-dashed border-amber-200 rounded">
                  {t.notes}
                </div>
              </div>
            </div>

            {t.referenceLink && (
              <div className="border-t border-[#FAF9F5] pt-3 mt-4 flex justify-end">
                <a 
                  href={t.referenceLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-sans text-[11px] font-semibold text-[#1F2937] flex items-center gap-1 hover:underline"
                >
                  <span>查阅行业研究白皮书</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}

        {filteredTrends.length === 0 && (
          <div className="bg-white text-center py-12 rounded border border-[#EBE9E0]">
            <Compass className="w-8 h-8 text-[#8C8A82] mx-auto mb-3" />
            <p className="font-sans text-[13px] text-[#8C8A82]">暂未添加此年份的趋势观察报告，点击侧边栏“智能生成”补充库。</p>
          </div>
        )}
      </div>
    </div>
  );
}
