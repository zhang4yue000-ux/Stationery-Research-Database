/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Maximize, Smartphone, Compass, Layers } from 'lucide-react';
import { Size } from '../types';

interface SizeListProps {
  sizes: Size[];
}

export default function SizeList({ sizes }: SizeListProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#F5F4EE]">
      <div className="mb-8">
        <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">开本开卡与尺寸规范 (Size Guidelines)</h2>
        <p className="font-sans text-xs text-zinc-500 mt-0.5">理顺国际标准白银对折比例（A5, A6）与旅行定制窄窄型比例（TN）的物理握持体验</p>
      </div>

      {/* Visual Proportion Comparator canvas */}
      <div className="bg-white rounded-lg border border-[#EBE9E0] p-6 mb-8 shadow-sm">
        <h3 className="font-sans font-bold text-base text-zinc-900 tracking-tight mb-5 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-amber-600" />
          <span>国际标准开本物理视觉比例板 (Proportional Canvas)</span>
        </h3>
        
        {/* Aspect scale visual boxes */}
        <div className="flex flex-wrap justify-center items-end gap-8 bg-[#FAF9F5] p-8 rounded border border-[#E3DFD5] overflow-x-auto min-h-[280px]">
          {/* A5 */}
          <div className="flex flex-col items-center">
            <div 
              style={{ width: '120px', height: '170px' }} 
              className="bg-zinc-800 text-white rounded border-2 border-zinc-950 flex flex-col justify-between p-3 shadow-md hover:bg-zinc-900 transition select-none"
            >
              <span className="font-mono text-[10px] text-zinc-400">ISO A5</span>
              <div className="text-center">
                <div className="font-sans font-bold text-xs">A5 148x210</div>
                <div className="font-mono text-[9px] text-zinc-400 mt-1">Ratio: 1 : 1.414</div>
              </div>
              <span className="font-mono text-[8px] text-zinc-500 self-end">白银分割</span>
            </div>
            <span className="font-sans text-xs font-semibold text-zinc-850 mt-3">A5 (旗舰手帐规格)</span>
          </div>

          {/* TN Standard */}
          <div className="flex flex-col items-center">
            <div 
              style={{ width: '90px', height: '170px' }} 
              className="bg-[#CDA45E] text-white rounded border-2 border-[#B08842] flex flex-col justify-between p-3 shadow-md hover:-translate-y-0.5 transition select-none"
            >
              <span className="font-mono text-[10px] text-amber-200">TN Standard</span>
              <div className="text-center">
                <div className="font-sans font-bold text-xs">Standard 110x210</div>
                <div className="font-mono text-[9px] text-amber-200 mt-1">Ratio: 1 : 1.909</div>
              </div>
              <span className="font-mono text-[8px] text-amber-300 self-end">黄金窄版</span>
            </div>
            <span className="font-sans text-xs font-semibold text-zinc-850 mt-3">TN 窄版 (流浪者记录)</span>
          </div>

          {/* A6 */}
          <div className="flex flex-col items-center">
            <div 
              style={{ width: '85px', height: '120px' }} 
              className="bg-zinc-700 text-white rounded border-2 border-zinc-850 flex flex-col justify-between p-3.5 shadow-md hover:bg-zinc-850 transition select-none"
            >
              <span className="font-mono text-[9px] text-zinc-300">ISO A6</span>
              <div className="text-center">
                <div className="font-sans font-bold text-[11px]">A6 105x148</div>
                <div className="font-mono text-[8px] text-zinc-400 mt-0.5">Ratio: 1 : 1.414</div>
              </div>
              <span className="font-mono text-[8px] text-zinc-400 self-end">对角线半白</span>
            </div>
            <span className="font-sans text-xs font-semibold text-zinc-850 mt-3">A6 (文库口袋型)</span>
          </div>

          {/* TN Passport */}
          <div className="flex flex-col items-center">
            <div 
              style={{ width: '70px', height: '100px' }} 
              className="bg-amber-900 text-amber-100 rounded border-2 border-amber-950 flex flex-col justify-between p-2.5 shadow-md hover:-translate-y-0.5 transition select-none"
            >
              <span className="font-mono text-[8px] text-amber-300">Passport</span>
              <div className="text-center">
                <div className="font-sans font-bold text-[10px]">Passport 89x124</div>
                <div className="font-mono text-[7px] text-amber-300 mt-0.5">Ratio: 1 : 1.393</div>
              </div>
              <span className="font-mono text-[7px] text-amber-400 self-end">迷你口袋</span>
            </div>
            <span className="font-sans text-xs font-semibold text-zinc-850 mt-3">TN 护照型 (极便携)</span>
          </div>
        </div>
      </div>

      {/* Specs list text details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sizes.map(s => (
          <div key={s.id} className="bg-white rounded-lg border border-[#EBE9E0] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="font-sans font-bold text-base text-zinc-900 tracking-tight flex items-center gap-1.5">
                <Maximize className="w-4 h-4 text-[#8C8A82]" />
                <span>{s.name}</span>
              </span>
              <span className="font-mono text-[10px] bg-[#FAF9F5] hover:bg-neutral-100 px-2 py-0.5 border border-[#E3DFD5] text-[#5C5A52] rounded">
                数学比例: {s.aspectRatio}
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="bg-[#FAF9F5] p-3 rounded border border-[#E3DFD5] flex justify-between items-center">
                <span className="text-[#8C8A82]">精确裁剪尺寸:</span>
                <strong className="text-zinc-900 font-mono text-[13px] font-bold">{s.dimensions}</strong>
              </div>

              <div>
                <strong className="text-zinc-900 font-bold block mb-1">设计师握持与手位场景研判:</strong>
                <p className="text-zinc-650 text-xs leading-relaxed mt-1 bg-[#FAF9F5] p-3 rounded border border-[#EBE9E0]">
                  {s.suitableScenario}
                </p>
              </div>

              <div>
                <strong className="text-zinc-900 font-bold block mb-1">该尺寸在市面的神级代表款:</strong>
                <p className="text-zinc-900 text-xs font-semibold bg-[#EFECE3] px-2.5 py-1.5 rounded inline-block mt-1">
                  {s.typicalProducts}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
