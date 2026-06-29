/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, ArrowRight, BookOpen, Layers, Scissors, Info } from 'lucide-react';
import { Brand, Product, Material, Craft } from '../types';

interface KnowledgeGraphProps {
  brands: Brand[];
  products: Product[];
  materials: Material[];
  crafts: Craft[];
  onNavigateToTab: (tab: any, selectedId?: string) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'brand' | 'material' | 'craft' | 'product';
  x: number;
  y: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
}

export default function KnowledgeGraph({
  brands,
  products,
  materials,
  crafts,
  onNavigateToTab
}: KnowledgeGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Hardcode beautiful pre-calculated positions to ensure a balanced, graphic-designer-worthy layout
  // Center is width: 500, height: 400
  const nodes: GraphNode[] = [
    // Brands (Core Center-Inner circle)
    { id: 'b-midori-tn', label: 'Traveler\'s Co.', type: 'brand', x: 220, y: 180, color: '#CDA45E' },
    { id: 'b-hobonichi', label: 'ほぼ日手帐', type: 'brand', x: 380, y: 180, color: '#DC2626' },
    { id: 'b-md-paper', label: 'MD Paper', type: 'brand', x: 300, y: 300, color: '#1F2937' },
    { id: 'b-kokuyo', label: 'KOKUYO 国誉', type: 'brand', x: 180, y: 320, color: '#4F46E5' },
    { id: 'b-rhodia', label: 'Rhodia 罗地亚', type: 'brand', x: 420, y: 300, color: '#EA580C' },

    // Materials (Top Outer boundary)
    { id: 'm-tomoe-river', label: '巴川纸 (Tomoe River)', type: 'material', x: 420, y: 80, color: '#059669' },
    { id: 'm-md-paper', label: 'MD 书写纸 (MD)', type: 'material', x: 300, y: 60, color: '#059669' },
    { id: 'm-v-leather', label: '原色植鞣革 (Leather)', type: 'material', x: 140, y: 100, color: '#059669' },
    { id: 'm-bookcloth', label: '重磅装帧布 (Cloth)', type: 'material', x: 480, y: 220, color: '#059669' },

    // Crafts (Bottom Outer boundary)
    { id: 'cr-foil-stamp', label: '烫金/烫银 (Foil)', type: 'craft', x: 460, y: 400, color: '#B45309' },
    { id: 'cr-deboss', label: '冷热压凹工艺 (Deboss)', type: 'craft', x: 100, y: 240, color: '#B45309' },
    { id: 'cr-spotuv', label: '局部UV光油 (UV)', type: 'craft', x: 120, y: 400, color: '#B45309' },
    { id: 'cr-pantone', label: '高纯专色印刷 (Pantone)', type: 'craft', x: 300, y: 440, color: '#B45309' },
  ];

  // Map manual links between elements representing mutual dependencies in initial seed datasets
  const links: GraphLink[] = [
    // Brands used by Materials
    { source: 'm-tomoe-river', target: 'b-hobonichi' },
    { source: 'm-tomoe-river', target: 'b-kokuyo' },
    { source: 'm-md-paper', target: 'b-md-paper' },
    { source: 'm-md-paper', target: 'b-midori-tn' },
    { source: 'm-v-leather', target: 'b-midori-tn' },
    { source: 'm-bookcloth', target: 'b-hobonichi' },
    { source: 'm-bookcloth', target: 'b-rhodia' },

    // Brands associated with Crafts
    { source: 'b-hobonichi', target: 'cr-foil-stamp' },
    { source: 'b-hobonichi', target: 'cr-pantone' },
    { source: 'b-midori-tn', target: 'cr-deboss' },
    { source: 'b-md-paper', target: 'cr-deboss' },
    { source: 'b-kokuyo', target: 'cr-spotuv' },
    { source: 'b-kokuyo', target: 'cr-deboss' },
    { source: 'b-rhodia', target: 'cr-spotuv' },
  ];

  // Helper check if selected node links to another node
  const isLinked = (id1: string, id2: string) => {
    if (id1 === id2) return true;
    return links.some(l => 
      (l.source === id1 && l.target === id2) || 
      (l.source === id2 && l.target === id1)
    );
  };

  const activeNode = nodes.find(n => n.id === selectedNodeId);

  // Link details sidebar info
  const getDetailStats = () => {
    if (!activeNode) return null;
    
    if (activeNode.type === 'brand') {
      const bObj = brands.find(b => b.id === activeNode.id);
      return {
        title: bObj?.name || activeNode.label,
        sub: bObj?.englishName || '',
        story: bObj?.brandStory || '',
        category: '品牌主体',
        tab: 'brands' as const
      };
    } else if (activeNode.type === 'material') {
      const mObj = materials.find(m => m.id === activeNode.id);
      return {
        title: mObj?.name || activeNode.label,
        sub: `Origin: ${mObj?.origin || ''}`,
        story: mObj?.notes || '',
        category: '理化特性材质',
        tab: 'materials' as const
      };
    } else {
      const cObj = crafts.find(c => c.id === activeNode.id);
      return {
        title: cObj?.name || activeNode.label,
        sub: `模切成本: ${cObj?.costLevel || ''}`,
        story: cObj?.definition || '',
        category: '表面精装印刷工艺',
        tab: 'crafts' as const
      };
    }
  };

  const drawerInfo = getDetailStats();

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F5F4EE]">
      {/* Network Canvas Section */}
      <div className="flex-1 p-8 flex flex-col justify-between">
        <div>
          <h2 className="font-sans font-bold text-2xl text-[#1F2937]">双向关联行业知识图谱 (Knowledge Network)</h2>
          <p className="font-sans text-[12px] text-[#8C8A82] mt-0.5">
            解构品牌、特种材质、印刷物理表面工艺的咬合链路。点击任一节点高亮查看关联。
          </p>
        </div>

        {/* SVG viewport Canvas wrapper */}
        <div className="flex-1 min-h-[460px] bg-white rounded-lg border border-[#EBE9E0] shadow-sm relative overflow-hidden flex items-center justify-center p-4 my-4">
          <svg className="w-full h-full max-w-[620px] max-h-[500px]" viewBox="0 0 600 500">
            {/* Draw Links/Edges */}
            <g>
              {links.map((link, idx) => {
                const sNode = nodes.find(n => n.id === link.source);
                const tNode = nodes.find(n => n.id === link.target);
                if (!sNode || !tNode) return null;

                const isHighlighted = selectedNodeId === null || 
                  selectedNodeId === link.source || 
                  selectedNodeId === link.target;

                const isPathActive = selectedNodeId !== null && 
                  (selectedNodeId === link.source || selectedNodeId === link.target);

                return (
                  <line
                    key={idx}
                    x1={sNode.x}
                    y1={sNode.y}
                    x2={tNode.x}
                    y2={tNode.y}
                    stroke={isPathActive ? '#1F2937' : '#EBE9E0'}
                    strokeWidth={isPathActive ? 2.5 : 1.2}
                    strokeDasharray={isPathActive ? 'none' : '4,4'}
                    opacity={isHighlighted ? 0.9 : 0.15}
                    transition="all 0.3s"
                    style={{ transition: 'all 0.25s ease' }}
                  />
                );
              })}
            </g>

            {/* Draw Node group circles & labels */}
            <g>
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isHighlighted = selectedNodeId === null || isLinked(selectedNodeId, node.id);
                
                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer select-none"
                    onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                  >
                    {/* Outer pulse shadow for selected */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        fill="transparent"
                        stroke={node.color}
                        strokeWidth={1.5}
                        strokeDasharray="3,3"
                        className="animate-spin"
                        style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '6s' }}
                      />
                    )}

                    {/* Main Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 10 : 7.5}
                      fill={node.color}
                      opacity={isHighlighted ? 1 : 0.2}
                      transition="all 0.25s"
                      style={{ transition: 'all 0.25s ease' }}
                    />

                    {/* Node label anchor text */}
                    <text
                      x={node.x}
                      y={node.y - (isSelected ? 16 : 13)}
                      textAnchor="middle"
                      fill={isSelected ? '#1F2937' : '#5C5A52'}
                      fontSize={isSelected ? 11 : 9.5}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                      opacity={isHighlighted ? 1 : 0.22}
                      transition="all 0.25s"
                      style={{ transition: 'all 0.25s ease' }}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Quick Graph Legend */}
          <div className="absolute bottom-4 left-4 bg-[#FAF9F5]/90 border border-[#E3DFD5] rounded p-2.5 space-y-1 text-[10px] font-sans">
            <div className="flex items-center gap-1.5 font-bold mb-1 border-b border-[#E3DFD5] pb-1 uppercase">Legend</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F2937]"></span>
              <span>文创品牌主体 (Brands)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
              <span>理化特性特种纸 (Materials)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]"></span>
              <span>大厂开版印刷工艺 (Crafts)</span>
            </div>
          </div>
        </div>

        {/* Tip info bar */}
        <div className="bg-[#FAF9F5] border border-[#E3DFD5] p-3 rounded text-[11px] font-sans text-[#8C8A82]">
          提示: 双向关联旨在打破普通笔记、文章的割裂感。当您在工艺或材质库检索到某一种材料时（如巴川纸），图谱可立刻映射其下游对应的手账大厂（Hobonichi/MD），达成交叉快速印证决策。
        </div>
      </div>

      {/* Edge context drawer info */}
      {drawerInfo && (
        <div className="w-80 bg-white border-l border-[#EBE9E0] flex flex-col h-screen sticky top-0 shadow-md">
          <div className="p-6 border-b border-[#EBE9E0] bg-[#FAF9F5]">
            <span className="font-mono text-[9px] bg-[#EFECE3] px-2 py-0.5 rounded text-[#5C5A52] font-semibold">
              {drawerInfo.category}
            </span>
            <h3 className="font-sans font-bold text-[16px] text-[#1F2937] leading-snug mt-1.5">{drawerInfo.title}</h3>
            <p className="font-mono text-[10px] text-[#8C8A82] mt-0.5">{drawerInfo.sub}</p>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-sans text-[11px] font-bold text-[#8C8A82] uppercase mb-2 tracking-wider">设计工艺特征档案:</h4>
              <p className="font-sans text-[12px] text-[#5C5A52] leading-relaxed bg-[#FAF9F5] p-3 rounded border border-[#E3DFD5]">
                {drawerInfo.story}
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab(drawerInfo.tab, activeNode.id)}
              className="w-full flex items-center justify-center gap-1.5 bg-[#1F2937] hover:bg-neutral-800 text-white font-sans text-xs font-semibold py-2 rounded.md shadow-sm transition py-2.5"
            >
              <span>查看该卡片的关联体系</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
