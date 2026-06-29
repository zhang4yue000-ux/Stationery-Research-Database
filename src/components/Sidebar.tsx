/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Sparkles,
  Camera
} from 'lucide-react';
import { ViewTab } from '../types';

interface SidebarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  brandsCount: number;
  recordsCount: number;
}

export default function Sidebar({ 
  currentTab, 
  onTabChange, 
  brandsCount,
  recordsCount
}: SidebarProps) {
  
  const navItems = [
    { id: 'brands', label: '品牌类别库', icon: BookOpen },
    { id: 'material_crafts', label: '材料与工艺库', icon: Layers },
    { id: 'simulator', label: '手账模拟与配置库', icon: Sparkles },
    { id: 'records', label: '日常灵感库', icon: Camera },
  ] as const;

  return (
    <aside id="sidebar-container" className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Logo & Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm select-none shrink-0">
            <div className="w-3 h-3 bg-white rotate-45"></div>
          </div>
          <div>
            <h1 className="font-sans font-extrabold text-sm tracking-tight text-zinc-900">文具品牌研究资料库</h1>
            <p className="font-sans text-[9px] text-zinc-400 tracking-widest font-semibold">纸品档案</p>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 px-4 py-2 space-y-1">
        <h3 className="font-sans text-[10px] tracking-widest text-zinc-400 px-3 font-bold mb-4">
          数据库分类
        </h3>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-sans text-xs font-semibold transition-all text-left border border-white ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'brands' && (
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                    {brandsCount}
                  </span>
                )}
                {item.id === 'records' && (
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                    {recordsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simplified Status Widget */}
      <div className="p-4 mt-auto border-t border-white bg-zinc-50/50">
        <div className="p-4 bg-zinc-900 text-white rounded-2xl text-xs shadow-sm">
          <p className="text-[10px] text-zinc-400 font-sans tracking-widest mb-1">已收录灵感</p>
          <div className="font-bold text-[11px] mb-1">
            已备忘跟拍 {recordsCount} 份灵感样本
          </div>
          <p className="text-[10px] text-zinc-450 leading-normal">
            随行搜集街角橱窗与日常碰见的精美装帧及纸品工艺。
          </p>
        </div>
      </div>
    </aside>
  );
}

