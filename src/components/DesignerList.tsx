/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Palette, Award, Compass, ExternalLink } from 'lucide-react';
import { Designer } from '../types';

interface DesignerListProps {
  designers: Designer[];
}

export default function DesignerList({ designers }: DesignerListProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#F5F4EE]">
      <div className="mb-6">
        <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">行业顶尖设计师名录 (Designers Registry)</h2>
        <p className="font-sans text-xs text-zinc-500 mt-0.5">收录全球纸本、手帐艺术指导及文房具工程学设计大师档案与代表作</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {designers.map(d => (
          <div key={d.id} className="bg-white rounded-lg border border-[#EBE9E0] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="font-sans text-base font-bold text-zinc-900 tracking-tight flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-600" />
                  <span>{d.name}</span>
                </span>
                <span className="font-mono text-[10px] bg-[#FAF9F5] px-2 py-0.5 border border-[#E3DFD5] text-[#5C5A52] rounded">
                  地区: {d.country}
                </span>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <div>
                  <strong className="text-zinc-500 uppercase text-[10px] tracking-wider block mb-1">背景履历与设计主张:</strong>
                  <p className="text-zinc-650 text-xs leading-relaxed bg-[#FAF9F5] p-3 rounded border border-[#EBE9E0]">
                    {d.profile}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FAF9F5] p-3 rounded border border-[#E3DFD5]">
                    <strong className="text-zinc-900 font-bold flex items-center gap-1.5 mb-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>标志性代表神作:</span>
                    </strong>
                    <ul className="list-disc pl-4 space-y-1 text-zinc-600 text-xs leading-relaxed">
                      {d.representativeWorks.map(w => <li key={w}>{w}</li>)}
                    </ul>
                  </div>

                  <div className="bg-[#FAF9F5] p-3 rounded border border-[#E3DFD5]">
                    <strong className="text-zinc-900 font-bold flex items-center gap-1.5 mb-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-600" />
                      <span>核心美学倾向:</span>
                    </strong>
                    <div className="text-zinc-650 text-xs leading-relaxed italic">
                      {d.designStyle}
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-[#8C8A82] text-[10px] tracking-wider block mb-1.5">曾深度合作的品牌:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {d.cooperatedBrands.map(b => (
                      <span key={b} className="bg-neutral-100 hover:bg-neutral-200 text-[#1F2937] font-semibold px-2 py-0.7 rounded text-[10px] cursor-pointer">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {d.website && (
              <div className="border-t border-[#FAF9F5] pt-3 mt-4 flex justify-end">
                <a 
                  href={d.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-sans text-[11px] font-semibold text-[#1F2937] flex items-center gap-1 hover:underline"
                >
                  <span>访问设计师官方工作室</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
