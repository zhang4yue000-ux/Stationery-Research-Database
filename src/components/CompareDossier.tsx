/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scale, ArrowLeft, Trash2, HelpCircle } from 'lucide-react';
import { Product, Brand } from '../types';

interface CompareDossierProps {
  compareList: string[];
  products: Product[];
  brands: Brand[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onNavigateToTab: (tab: any) => void;
}

export default function CompareDossier({
  compareList,
  products,
  brands,
  onRemoveFromCompare,
  onClearCompare,
  onNavigateToTab
}: CompareDossierProps) {
  
  const selectedProducts = products.filter(p => compareList.includes(p.id));

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#F5F4EE]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">纸品与内层规格横向对比 (Side-by-Side Comparison)</h2>
          <p className="font-sans text-xs text-zinc-500 mt-0.5">在多款本册、一日一页日程夹之间进行书写阻尼、页叠克数及平展刚度分析</p>
        </div>
        {selectedProducts.length > 0 && (
          <button
            onClick={onClearCompare}
            className="text-xs text-[#8C8A82] hover:text-red-700 font-sans font-semibold underline"
          >
            清空所有对比本
          </button>
        )}
      </div>

      {selectedProducts.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#EBE9E0] p-12 text-center max-w-2xl mx-auto shadow-sm">
          <Scale className="w-12 h-12 text-[#8C8A82] mx-auto mb-4" />
          <h3 className="font-sans font-bold text-base text-zinc-900 tracking-tight mb-2">对比池当前为空</h3>
          <p className="font-sans text-xs text-[#8C8A82] leading-relaxed mb-6 max-w-md mx-auto">
            您可以前往“产品谱系库”，在喜爱的笔记本、日程手帐卡片右上角勾选“秤盘/对比标志”加入进来，从而进行跨纬度物理性能深度核对。
          </p>
          <button
            onClick={() => onNavigateToTab('products')}
            className="inline-flex items-center gap-1.5 bg-[#1F2937] hover:bg-neutral-800 text-white font-sans text-xs font-semibold px-4 py-2 rounded transition shadow-sm"
          >
            <span>前往产品谱系库选本</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#EBE9E0] shadow-sm overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#EBE9E0]">
                <th className="p-4 font-bold text-[#1F2937] w-48 font-semibold">理化指标维度 (Criteria)</th>
                {selectedProducts.map(p => {
                  const br = brands.find(b => b.id === p.brandId);
                  return (
                    <th key={p.id} className="p-4 border-l border-[#EBE9E0] font-semibold relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[9px] bg-[#EFECE3] text-[#5C5A52] px-2 py-0.5 rounded uppercase">
                            {br?.name || '核心款'}
                          </span>
                          <h4 className="font-bold text-[#1F2937] text-[13px] mt-1.5 leading-snug">{p.name}</h4>
                        </div>
                        <button
                          onClick={() => onRemoveFromCompare(p.id)}
                          className="text-[#8C8A82] hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="移出对比"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Price row */}
              <tr className="border-b border-[#EBE9E0]">
                <td className="p-4 font-semibold text-[#8C8A82] bg-[#FAF9F5]/40 text-[11px] uppercase tracking-wider">估算售价 (Price)</td>
                {selectedProducts.map(p => (
                  <td key={p.id} className="p-4 border-l border-[#EBE9E0] font-mono font-bold text-amber-900 text-sm">
                    {p.price}
                  </td>
                ))}
              </tr>

              {/* Sizing constraints */}
              <tr className="border-b border-[#EBE9E0]">
                <td className="p-4 font-semibold text-[#8C8A82] bg-[#FAF9F5]/40 text-[11px] uppercase tracking-wider">开本裁切 (Dimensions)</td>
                {selectedProducts.map(p => (
                  <td key={p.id} className="p-4 border-l border-[#EBE9E0] text-[#1F2937]">
                    {p.dimensions}
                  </td>
                ))}
              </tr>

              {/* Paper spec */}
              <tr className="border-b border-[#EBE9E0]">
                <td className="p-4 font-semibold text-[#8C8A82] bg-[#FAF9F5]/40 text-[11px] uppercase tracking-wider">原纸纤维克重 (Paper Type)</td>
                {selectedProducts.map(p => (
                  <td key={p.id} className="p-4 border-l border-[#EBE9E0] text-[#1F2937] font-semibold">
                    {p.paperType}
                  </td>
                ))}
              </tr>

              {/* Page loading count */}
              <tr className="border-b border-[#EBE9E0]">
                <td className="p-4 font-semibold text-[#8C8A82] bg-[#FAF9F5]/40 text-[11px] uppercase tracking-wider">厚叠页数 (Pages)</td>
                {selectedProducts.map(p => (
                  <td key={p.id} className="p-4 border-l border-[#EBE9E0] font-mono text-[#1F2937]">
                    {p.pageCount ? `${p.pageCount} p` : '未备注'}
                  </td>
                ))}
              </tr>

              {/* Bound stitch type */}
              <tr className="border-b border-[#EBE9E0]">
                <td className="p-4 font-semibold text-[#8C8A82] bg-[#FAF9F5]/40 text-[11px] uppercase tracking-wider">开贴装订 (Binding Stitch)</td>
                {selectedProducts.map(p => (
                  <td key={p.id} className="p-4 border-l border-[#EBE9E0] text-[#1F2937] leading-relaxed">
                    {p.bindingMethod}
                  </td>
                ))}
              </tr>

              {/* Custom tags */}
              <tr className="border-b border-[#EBE9E0]">
                <td className="p-4 font-semibold text-[#8C8A82] bg-[#FAF9F5]/40 text-[11px] uppercase tracking-wider">核心美学标签 (Styles)</td>
                {selectedProducts.map(p => (
                  <td key={p.id} className="p-4 border-l border-[#EBE9E0]">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map(t => (
                        <span key={t} className="font-sans text-[10px] bg-[#FAF9F5] text-[#8C8A82] border border-[#E3DFD5] px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Technical study notes */}
              <tr>
                <td className="p-4 font-semibold text-[#8C8A82] bg-[#FAF9F5]/40 text-[11px] uppercase tracking-wider">制造要义与触抚阻尼 (Expert Analysis)</td>
                {selectedProducts.map(p => (
                  <td key={p.id} className="p-4 border-l border-[#EBE9E0] text-[#5C5A52] leading-relaxed bg-amber-50/20 italic">
                    {p.notes}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
