/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Scissors, 
  BookMarked, 
  MapPin, 
  Compass, 
  Sparkles, 
  ChevronRight, 
  HelpCircle, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Search,
  BookOpen,
  Pencil,
  Edit,
  Plus,
  ArrowLeft,
  Trash2,
  Image
} from 'lucide-react';
import { Material, Craft, Binding } from '../types';

interface MaterialCraftsSystemProps {
  materials: Material[];
  crafts: Craft[];
  bindings: Binding[];
  onSaveMaterial?: (material: Material) => void;
  onSaveCraft?: (craft: Craft) => void;
  onSaveBinding?: (binding: Binding) => void;
}

export default function MaterialCraftsSystem({ 
  materials, 
  crafts, 
  bindings,
  onSaveMaterial,
  onSaveCraft,
  onSaveBinding
}: MaterialCraftsSystemProps) {
  // Available sub-sections of the Materials & Crafts System
  type SubSystem = 'material' | 'craft' | 'binding';
  const [activeTab, setActiveTab] = useState<SubSystem>('material');
  
  // States for category filter in materials
  const [activeMaterialCat, setActiveMaterialCat] = useState<'All' | 'Paper' | 'Leather' | 'Book Cloth' | 'Other'>('All');
  
  // Search state across elements
  const [searchTerm, setSearchTerm] = useState('');

  // Selected item modal states
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [selectedBinding, setSelectedBinding] = useState<Binding | null>(null);

  // Editing state mappings
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingCraft, setEditingCraft] = useState<Craft | null>(null);
  const [editingBinding, setEditingBinding] = useState<Binding | null>(null);

  // Field states for the item being edited
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<'Paper' | 'Leather' | 'Book Cloth' | 'Other'>('Paper');
  const [editOrigin, setEditOrigin] = useState('');
  const [editFeatures, setEditFeatures] = useState('');
  const [editSuitableScenario, setEditSuitableScenario] = useState('');
  const [editRepresentativeBrands, setEditRepresentativeBrands] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Craft fields
  const [editDefinition, setEditDefinition] = useState('');
  const [editProsAndCons, setEditProsAndCons] = useState('');
  const [editCostLevel, setEditCostLevel] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [editTypicalApplications, setEditTypicalApplications] = useState('');

  // Binding field
  const [editStructure, setEditStructure] = useState('');

  // Editable tags state
  const [editingTag, setEditingTag] = useState<{ materialId: string, tagIndex: number, value: string } | null>(null);

  // States for Editing 适用对象 & Reference Images
  const [activeApplicableMaterial, setActiveApplicableMaterial] = useState<Material | null>(null);
  const [tempSuitableScenario, setTempSuitableScenario] = useState('');
  const [tempReferenceImages, setTempReferenceImages] = useState<string[]>([]);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // Add new card based on current active tab
  const handleAddNewCard = () => {
    const uniqueId = `item-${activeTab}-${Date.now()}`;
    if (activeTab === 'material') {
      const newMaterial: Material = {
        id: uniqueId,
        name: '未命名新材质',
        category: 'Paper',
        origin: '中国',
        features: '• 特性一\n• 特性二',
        suitableScenario: '最合适书写工具说明',
        representativeBrands: ['代表作品/品牌'],
        tags: ['新材质'],
        notes: '设计师建议'
      };
      setEditingMaterial(newMaterial);
      setEditName(newMaterial.name);
      setEditCategory(newMaterial.category as any);
      setEditOrigin(newMaterial.origin);
      setEditFeatures(newMaterial.features);
      setEditSuitableScenario(newMaterial.suitableScenario);
      setEditRepresentativeBrands(newMaterial.representativeBrands.join(', '));
      setEditTags(newMaterial.tags.join(', '));
      setEditNotes(newMaterial.notes || '');
    } else if (activeTab === 'craft') {
      const newCraft: Craft = {
        id: uniqueId,
        name: '未命名新印刷工艺',
        definition: '工艺定义或机理说明',
        prosAndCons: '• 优点: \n• 缺点: ',
        costLevel: 'Medium',
        typicalApplications: '高定/量产等应用玩法',
        notes: '设计师菲林/避坑细节备注'
      };
      setEditingCraft(newCraft);
      setEditName(newCraft.name);
      setEditDefinition(newCraft.definition);
      setEditProsAndCons(newCraft.prosAndCons);
      setEditCostLevel(newCraft.costLevel);
      setEditTypicalApplications(newCraft.typicalApplications);
      setEditNotes(newCraft.notes || '');
    } else if (activeTab === 'binding') {
      const newBinding: Binding = {
        id: uniqueId,
        name: '未命名新装帧工法',
        structure: '物理层结构、结合件分布细节说明',
        prosAndCons: '• 优点: \n• 缺点: ',
        suitableScenario: '适用阅读与物理阻尼等阻写工具匹配',
        notes: '生产时书脊折页与冷胶压实避坑备注'
      };
      setEditingBinding(newBinding);
      setEditName(newBinding.name);
      setEditStructure(newBinding.structure);
      setEditProsAndCons(newBinding.prosAndCons);
      setEditSuitableScenario(newBinding.suitableScenario);
      setEditNotes(newBinding.notes || '');
    }
  };

  // English Cleanup Regex
  const cleanName = (name: string): string => {
    return name.replace(/\s*\([A-Za-z0-0\s/'’\\,.-]*\)/g, '').trim();
  };

  // Switch triggers
  const startEditMaterial = (m: Material) => {
    setEditingMaterial(m);
    setEditName(cleanName(m.name));
    setEditCategory(m.category as any);
    setEditOrigin(m.origin);
    setEditFeatures(m.features);
    setEditSuitableScenario(m.suitableScenario);
    setEditRepresentativeBrands((m.representativeBrands || []).join(', '));
    setEditTags((m.tags || []).join(', '));
    setEditNotes(m.notes || '');
  };

  const saveMaterialEdit = () => {
    if (!editingMaterial || !onSaveMaterial) return;
    const updated: Material = {
      ...editingMaterial,
      name: editName,
      category: editCategory,
      origin: editOrigin,
      features: editFeatures,
      suitableScenario: editSuitableScenario,
      representativeBrands: editRepresentativeBrands.split(',').map(s => s.trim()).filter(Boolean),
      tags: editTags.split(',').map(s => s.trim()).filter(Boolean),
      notes: editNotes
    };
    onSaveMaterial(updated);
    setEditingMaterial(null);
    if (selectedMaterial && selectedMaterial.id === updated.id) {
      setSelectedMaterial(updated);
    }
  };

  const handleSaveApplicable = () => {
    if (!activeApplicableMaterial || !onSaveMaterial) return;
    const updated: Material = {
      ...activeApplicableMaterial,
      suitableScenario: tempSuitableScenario,
      referenceImages: tempReferenceImages
    };
    onSaveMaterial(updated);
    setActiveApplicableMaterial(null);
    if (selectedMaterial && selectedMaterial.id === updated.id) {
      setSelectedMaterial(updated);
    }
  };

  const startEditCraft = (c: Craft) => {
    setEditingCraft(c);
    setEditName(cleanName(c.name));
    setEditDefinition(c.definition);
    setEditProsAndCons(c.prosAndCons);
    setEditCostLevel(c.costLevel);
    setEditTypicalApplications(c.typicalApplications);
    setEditNotes(c.notes || '');
  };

  const saveCraftEdit = () => {
    if (!editingCraft || !onSaveCraft) return;
    const updated: Craft = {
      ...editingCraft,
      name: editName,
      definition: editDefinition,
      prosAndCons: editProsAndCons,
      costLevel: editCostLevel,
      typicalApplications: editTypicalApplications,
      notes: editNotes
    };
    onSaveCraft(updated);
    setEditingCraft(null);
    if (selectedCraft && selectedCraft.id === updated.id) {
      setSelectedCraft(updated);
    }
  };

  const startEditBinding = (b: Binding) => {
    setEditingBinding(b);
    setEditName(cleanName(b.name));
    setEditStructure(b.structure);
    setEditProsAndCons(b.prosAndCons);
    setEditSuitableScenario(b.suitableScenario);
    setEditNotes(b.notes || '');
  };

  const saveBindingEdit = () => {
    if (!editingBinding || !onSaveBinding) return;
    const updated: Binding = {
      ...editingBinding,
      name: editName,
      structure: editStructure,
      prosAndCons: editProsAndCons,
      suitableScenario: editSuitableScenario,
      notes: editNotes
    };
    onSaveBinding(updated);
    setEditingBinding(null);
    if (selectedBinding && selectedBinding.id === updated.id) {
      setSelectedBinding(updated);
    }
  };

  // Filters
  const filteredMaterials = materials.filter(m => {
    const matchesCat = activeMaterialCat === 'All' || m.category === activeMaterialCat;
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.features.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (m.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const filteredCrafts = crafts.filter(c => {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           c.definition.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredBindings = bindings.filter(b => {
    return b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           b.structure.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 relative">
      {/* Scrollable Sub-container */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* Unified Title Dashboard */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-sans font-extrabold text-2xl text-zinc-900 tracking-tight">
              材料与工艺库
            </h2>
            <p className="font-sans text-xs text-zinc-500 mt-1 max-w-2xl">
              该系统作为手帐产品的物理属性层存在。定义本册所触及的纤维纸张介质、表面修饰菲林及书脊重力阻尼。在此挑选的每种材质或装帧形态，都将直连并赋能手账模拟配置器。
            </p>
          </div>
          <button
            onClick={handleAddNewCard}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-805 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>添加新名片</span>
          </button>
        </div>

        {/* Master Selector Segment Tabs & General Search */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6 space-y-4 shadow-xs">
          {/* Search at the very top */}
          <div className="relative w-full">
            <input
              type="text"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-11 pr-4 font-sans text-xs focus:outline-none focus:border-zinc-950 focus:bg-white transition-all shadow-inner"
              placeholder="在材料与工艺库中快速搜索物理特性、材质档案、装订特征、工艺说明主旨等..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 py-1.5 px-2.5 rounded-lg border border-zinc-250 transition-colors"
              >
                清除
              </button>
            )}
          </div>

          {/* Sub Categories and Tabs below the search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-zinc-100 pt-4">
            {/* Main Tabs */}
            <div className="flex bg-zinc-100 p-1 rounded-xl w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('material');
                }}
                className={`flex-1 md:flex-none py-2 px-5 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'material'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>材质档案库 ({materials.length})</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setActiveTab('craft');
                }}
                className={`flex-1 md:flex-none py-2 px-5 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'craft'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>印刷工艺库 ({crafts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('binding');
                }}
                className={`flex-1 md:flex-none py-2 px-5 rounded-lg font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'binding'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>装帧工艺库 ({bindings.length})</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-zinc-400 font-semibold self-center hidden md:block">
              筛选到 {activeTab === 'material' ? filteredMaterials.length : activeTab === 'craft' ? filteredCrafts.length : filteredBindings.length} 个结果
            </div>
          </div>


        </div>

        {/* Dynamic Inner Grid Rendering */}
        {activeTab === 'material' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in font-sans">
            {filteredMaterials.map(m => (
              <div 
                key={m.id} 
                onClick={() => setSelectedMaterial(m)}
                className="bg-white rounded-2xl border border-white p-5 flex flex-col justify-between cursor-pointer transition-all hover:border-white shadow-sm group hover:shadow-md relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-h-[16px]"></div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-zinc-400 flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{m.origin === 'Japan' ? '日本' : m.origin === 'Italy' ? '意大利' : m.origin}</span>
                      </span>
                      <button
                        title="编辑材质"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditMaterial(m);
                        }}
                        className="p-1.5 bg-zinc-50 hover:bg-zinc-150 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors shadow-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-sans font-bold text-base text-zinc-900 mb-2 group-hover:text-amber-900 transition-colors">{cleanName(m.name)}</h3>
                  <p className="font-sans text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                    {m.features.split('\n')[0]}
                  </p>

                  {/* 4移动标签位置，把所有的标签都在放在名片信息的最下面 */}
                  <div className="flex flex-wrap gap-1.5 mt-3 mb-1">
                    {m.tags && m.tags.map((t, tIndex) => {
                      const isEditingThisTag = editingTag && editingTag.materialId === m.id && editingTag.tagIndex === tIndex;
                      return isEditingThisTag ? (
                        <input
                          key={`edit-tag-${tIndex}`}
                          type="text"
                          className="font-sans text-[10px] bg-white border border-amber-400 text-zinc-800 px-2 py-0.5 rounded-lg focus:outline-none w-16"
                          value={editingTag ? editingTag.value : ''}
                          onChange={(e) => setEditingTag(prev => prev ? { ...prev, value: e.target.value } : null)}
                          onBlur={() => {
                            if (editingTag) {
                              const updatedTags = [...(m.tags || [])];
                              const trimmedVal = editingTag.value.trim();
                              if (trimmedVal === '') {
                                updatedTags.splice(tIndex, 1);
                              } else {
                                updatedTags[tIndex] = trimmedVal;
                              }
                              if (onSaveMaterial) {
                                onSaveMaterial({ ...m, tags: updatedTags });
                              }
                            }
                            setEditingTag(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (editingTag) {
                                const updatedTags = [...(m.tags || [])];
                                const trimmedVal = editingTag.value.trim();
                                if (trimmedVal === '') {
                                  updatedTags.splice(tIndex, 1);
                                } else {
                                  updatedTags[tIndex] = trimmedVal;
                                }
                                if (onSaveMaterial) {
                                  onSaveMaterial({ ...m, tags: updatedTags });
                                }
                              }
                              setEditingTag(null);
                            } else if (e.key === 'Escape') {
                              setEditingTag(null);
                            }
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span 
                          key={`tag-${t}-${tIndex}`} 
                          title="点击可直接编辑此标签"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTag({ materialId: m.id, tagIndex: tIndex, value: t });
                          }}
                          className="font-sans text-[10px] bg-zinc-50 border border-zinc-200 text-zinc-500 px-2 py-0.5 rounded-lg font-medium cursor-pointer hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition"
                        >
                          #{t}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-3.5 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTempSuitableScenario(m.suitableScenario);
                      setTempReferenceImages(m.referenceImages || (m.imageUrl ? [m.imageUrl] : []));
                      setNewImageUrlInput('');
                      setActiveApplicableMaterial(m);
                    }}
                    className="px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 rounded-xl text-[10px] font-bold border border-zinc-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>适用对象</span>
                  </button>
                  <span className="font-sans text-[10px] text-zinc-500 font-medium">
                    {m.category === 'Paper' ? '高摩擦钢笔/墨水' : '精奢礼盒本封面'}
                  </span>
                </div>
              </div>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="col-span-full bg-white text-center py-16 rounded-2xl border border-zinc-200">
                <Compass className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <p className="font-sans text-xs text-zinc-500">目前暂未登记该分类的特装精美纸材。</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'craft' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in font-sans">
            {filteredCrafts.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedCraft(c)}
                className="bg-white rounded-2xl border border-white p-5 flex flex-col justify-between cursor-pointer transition-all hover:border-zinc-150 shadow-sm group hover:shadow-md relative"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-sans text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <Scissors className="w-4 h-4 text-zinc-800" />
                      <span>{cleanName(c.name)}</span>
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5" title="工艺成本级别">
                        <span className="font-mono text-[9px] text-zinc-405 mr-1">打样耗用:</span>
                        {[1, 2, 3].map(step => {
                          const activeCount = c.costLevel === 'High' ? 3 : c.costLevel === 'Medium' ? 2 : 1;
                          return (
                            <span 
                              key={step} 
                              className={`w-1.5 h-1.5 rounded-full ${step <= activeCount ? 'bg-amber-600' : 'bg-zinc-255'}`} 
                            />
                          );
                        })}
                      </div>
                      <button
                        title="编辑工艺"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditCraft(c);
                        }}
                        className="p-1.5 bg-zinc-50 hover:bg-zinc-150 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors shadow-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                    {c.definition}
                  </p>
                </div>

                <div className="border-t border-zinc-100 pt-3.5 flex justify-between items-center">
                  <span className="font-mono text-[9px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold uppercase">
                    {c.costLevel === 'High' ? '高定珍藏要求' : c.costLevel === 'Medium' ? '中等印制成本' : '低廉量产工序'}
                  </span>
                  <div className="min-h-5"></div>
                </div>
              </div>
            ))}

            {filteredCrafts.length === 0 && (
              <div className="col-span-full bg-white text-center py-16 rounded-2xl border border-zinc-200">
                <Compass className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <p className="font-sans text-xs text-zinc-500">无法在海量菲林库中检索到该关键词装折工艺。</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'binding' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in font-sans">
            {filteredBindings.map(b => (
              <div 
                key={b.id} 
                onClick={() => setSelectedBinding(b)}
                className="bg-white rounded-2xl border border-white p-5 flex flex-col justify-between cursor-pointer transition-all hover:border-zinc-150 shadow-sm group hover:shadow-md relative"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-sans text-xs font-bold text-zinc-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-zinc-800" />
                      <span>{cleanName(b.name)}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[8px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg font-bold">
                        脊骨力学核心
                      </span>
                      <button
                        title="编辑装帧"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditBinding(b);
                        }}
                        className="p-1.5 bg-zinc-50 hover:bg-zinc-150 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors shadow-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
                    {b.structure}
                  </p>
                </div>

                <div className="border-t border-zinc-100 pt-3.5 flex justify-between items-center">
                  <span className="font-sans text-[10px] text-zinc-400 font-bold">
                    展开开度: <span className="text-zinc-800 font-semibold">180° 无阻力舒平</span>
                  </span>
                  <div className="min-h-5"></div>
                </div>
              </div>
            ))}

            {filteredBindings.length === 0 && (
              <div className="col-span-full bg-white text-center py-16 rounded-2xl border border-zinc-200">
                <Compass className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                <p className="font-sans text-xs text-zinc-500">暂未查到相关脊骨物理开合技术工艺。</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OVERLAY DIALOG MODAL - Show Material Specifications */}
      {selectedMaterial && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in font-sans"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-start bg-zinc-50/50">
              <div>
                <h3 className="font-sans font-bold text-lg text-zinc-900 leading-snug">{cleanName(selectedMaterial.name)}</h3>
                <span className="font-mono text-[9px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider mt-1.5 inline-block">
                  {selectedMaterial.category === 'Paper' ? '内页' : selectedMaterial.category === 'Leather' ? '封面' : selectedMaterial.category === 'Book Cloth' ? '书布' : '配件'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  title="编辑材质档案"
                  onClick={() => {
                    const temp = selectedMaterial;
                    setSelectedMaterial(null);
                    startEditMaterial(temp);
                  }}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 text-xs"
                >
                  <Pencil className="w-4 h-4" />
                  <span>编辑</span>
                </button>
                <button 
                  onClick={() => setSelectedMaterial(null)}
                  className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Structural Parameters */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2">
                  材质特征
                </h4>
                <div className="bg-zinc-50 p-3.5 rounded-2xl font-sans text-xs text-zinc-650 leading-normal space-y-2.5">
                  {selectedMaterial.features.split('\n').filter(Boolean).map((line, idx) => (
                    <div key={idx} className="leading-relaxed pl-1 text-zinc-650">
                      • {line.trim().replace(/^•\s*/, '')}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suitable writing tools */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2">
                  设计推荐
                </h4>
                <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl">
                  {selectedMaterial.suitableScenario}
                </p>
              </div>

              {/* Adoptor Brands */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2.5">
                  采用该材质的品牌
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.representativeBrands.map(b => (
                    <span key={b} className="bg-zinc-100 text-zinc-800 font-sans text-[11px] px-2.5 py-1 rounded-xl font-bold">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expert Evaluation Notes */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span>备注</span>
                </h4>
                <p className="font-sans text-xs text-zinc-550 leading-relaxed bg-amber-50/55 p-3.5 rounded-2xl font-medium whitespace-pre-line">
                  {selectedMaterial.notes}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right">
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-805 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY DIALOG MODAL - Show Craft Specifications */}
      {selectedCraft && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in font-sans"
          onClick={() => setSelectedCraft(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-start bg-zinc-50/50 font-sans">
              <div>
                <h3 className="font-sans font-bold text-lg text-zinc-900 leading-snug">{cleanName(selectedCraft.name)}</h3>
                <span className="font-mono text-[9px] bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md font-bold uppercase mt-1.5 inline-block">
                  {selectedCraft.costLevel === 'High' ? '高定珍藏工种' : selectedCraft.costLevel === 'Medium' ? '中等成本工序' : '标准量产印艺'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  title="编辑印艺工艺"
                  onClick={() => {
                    const temp = selectedCraft;
                    setSelectedCraft(null);
                    startEditCraft(temp);
                  }}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 text-xs"
                >
                  <Pencil className="w-4 h-4" />
                  <span>编辑</span>
                </button>
                <button 
                  onClick={() => setSelectedCraft(null)}
                  className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Technical Definition */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2">
                  材质特征
                </h4>
                <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl">
                  {selectedCraft.definition}
                </p>
              </div>

              {/* Pros and Cons Splits */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2">
                  加工优缺点与磨损极限
                </h4>
                
                <div className="bg-zinc-50 rounded-2xl p-4 space-y-3.5">
                  <div>
                    <div className="font-sans text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>设计优越性</span>
                    </div>
                    <p className="font-sans text-xs text-zinc-600 leading-normal pl-4.5">
                      {selectedCraft.prosAndCons.split('缺点：')[0].replace('优点：', '')}
                    </p>
                  </div>

                  <div className="border-t border-zinc-200 pt-3">
                    <div className="font-sans text-xs font-bold text-red-800 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>工艺局限性与耗损点</span>
                    </div>
                    <p className="font-sans text-xs text-zinc-650 leading-normal pl-4.5">
                      {selectedCraft.prosAndCons.includes('缺点：') ? selectedCraft.prosAndCons.split('缺点：')[1] : '大货生产摩擦耐受力有容差限制。'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced typical applications */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2">
                  应用案例
                </h4>
                <div className="bg-zinc-50 p-3.5 rounded-2xl font-sans text-xs text-zinc-600 leading-relaxed">
                  <div className="font-bold text-zinc-900 mb-1 flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>应用案例:</span>
                  </div>
                  {selectedCraft.typicalApplications}
                </div>
              </div>

              {/* Production Notes */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span>备注</span>
                </h4>
                <p className="font-sans text-xs text-zinc-500 leading-relaxed bg-amber-50/55 p-3.5 rounded-2xl font-medium">
                  {selectedCraft.notes}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right">
              <button 
                onClick={() => setSelectedCraft(null)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-805 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY DIALOG MODAL - Show Binding Specifications */}
      {selectedBinding && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in font-sans"
          onClick={() => setSelectedBinding(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-start bg-zinc-50/50 font-sans">
              <div>
                <h3 className="font-sans font-bold text-lg text-zinc-900 leading-snug">{cleanName(selectedBinding.name)}</h3>
                <span className="font-mono text-[8px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg font-bold mt-1.5 inline-block">
                  脊骨力学核心
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  title="编辑装帧工艺"
                  onClick={() => {
                    const temp = selectedBinding;
                    setSelectedBinding(null);
                    startEditBinding(temp);
                  }}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 text-xs"
                >
                  <Pencil className="w-4 h-4" />
                  <span>编辑</span>
                </button>
                <button 
                  onClick={() => setSelectedBinding(null)}
                  className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Technical Structure */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2">
                  材质特征
                </h4>
                <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl">
                  {selectedBinding.structure}
                </p>
              </div>

              {/* Pros and Cons */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2">
                  强度、耐久度与书写寿命折损评判
                </h4>
                
                <div className="bg-zinc-50 rounded-2xl p-4 space-y-3">
                  <div>
                    <div className="font-sans text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>开度长处与拉推书写感</span>
                    </div>
                    <p className="font-sans text-xs text-zinc-650 leading-normal pl-4.5">
                      {selectedBinding.prosAndCons.split('缺点：')[0].replace('优点：', '')}
                    </p>
                  </div>

                  <div className="border-t border-zinc-200 pt-3">
                    <div className="font-sans text-xs font-bold text-red-800 flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>工艺缺陷与高厚爬移风险</span>
                    </div>
                    <p className="font-sans text-xs text-zinc-650 leading-normal pl-4.5">
                      {selectedBinding.prosAndCons.includes('缺点：') ? selectedBinding.prosAndCons.split('缺点：')[1] : '加厚款式反复开折书本容易产生中间松垂脱落。'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Suitable Scenarios */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2">
                  设计匹配
                </h4>
                <p className="font-sans text-xs text-zinc-650 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl">
                  {selectedBinding.suitableScenario}
                </p>
              </div>

              {/* Expert Evaluation Notes */}
              <div>
                <h4 className="font-sans font-bold text-xs text-zinc-900 border-l-2 border-zinc-300 pl-2 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span>备注</span>
                </h4>
                <p className="font-sans text-xs text-zinc-550 leading-relaxed bg-amber-50/55 p-3.5 rounded-2xl font-medium">
                  {selectedBinding.notes}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right">
              <button 
                onClick={() => setSelectedBinding(null)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-805 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}


      {/* EDIT MODALS FOR HIGHLY INTERACTIVE UPDATES */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-sans font-bold text-lg text-zinc-900">编辑特种材质档案</h3>
              <button 
                onClick={() => setEditingMaterial(null)}
                className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">材质名称</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="材质名称"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-zinc-700 font-bold">分类类型</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  >
                    <option value="Paper">内页</option>
                    <option value="Leather">封面</option>
                    <option value="Book Cloth">书布</option>
                    <option value="Other">配件</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-zinc-700 font-bold">原产地域</label>
                  <input 
                    type="text" 
                    value={editOrigin}
                    onChange={(e) => setEditOrigin(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                    placeholder="例如: 日本 / 意大利"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">材质特征</label>
                <textarea 
                  rows={4}
                  value={editFeatures}
                  onChange={(e) => setEditFeatures(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all font-sans text-xs"
                  placeholder="每行输入一项物化属性指标"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">设计推荐</label>
                <textarea 
                  rows={2}
                  value={editSuitableScenario}
                  onChange={(e) => setEditSuitableScenario(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="匹配笔尖墨水或装合环境"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">专属核心标签 (多个用英文逗号分隔)</label>
                <input 
                  type="text" 
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="例如: 护眼, 阻抗力, 零挂纸"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">采用该材质的品牌(用逗号分隔)</label>
                <input 
                  type="text" 
                  value={editRepresentativeBrands}
                  onChange={(e) => setEditRepresentativeBrands(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="经典品牌"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">备注</label>
                <textarea 
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="给后生及制造端的风险忠告..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right flex justify-end gap-2 text-xs">
              <button 
                onClick={() => setEditingMaterial(null)}
                className="px-4 py-2 border border-zinc-200 rounded-xl font-bold bg-white text-zinc-700 hover:bg-zinc-100 transition-all shadow-xs"
              >
                取消
              </button>
              <button 
                onClick={saveMaterialEdit}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                保存更新
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCraft && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-sans font-bold text-lg text-zinc-900">编辑特殊印刷工艺</h3>
              <button 
                onClick={() => setEditingCraft(null)}
                className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">工艺名称</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="工艺名称"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">成本档次级别</label>
                <select
                  value={editCostLevel}
                  onChange={(e) => setEditCostLevel(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                >
                  <option value="Low">低成本量产级别</option>
                  <option value="Medium">中等印制成本级别</option>
                  <option value="High">高定珍藏艺术级别</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">材质特征</label>
                <textarea 
                  rows={3}
                  value={editDefinition}
                  onChange={(e) => setEditDefinition(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="说明工艺的作用与外观表现"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">加工优缺点以及耗损表现</label>
                <textarea 
                  rows={3}
                  value={editProsAndCons}
                  onChange={(e) => setEditProsAndCons(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="示例：优点：美观大方。缺点：反复物理摩擦容易变浅。"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">应用案例</label>
                <textarea 
                  rows={2}
                  value={editTypicalApplications}
                  onChange={(e) => setEditTypicalApplications(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="例如: 烫金书封、艺术外礼盒..."
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">备注</label>
                <textarea 
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="针对印刷车间制作人员的提示..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right flex justify-end gap-2 text-xs">
              <button 
                onClick={() => setEditingCraft(null)}
                className="px-4 py-2 border border-zinc-200 rounded-xl font-bold bg-white text-zinc-700 hover:bg-zinc-100 transition-all shadow-xs"
              >
                取消
              </button>
              <button 
                onClick={saveCraftEdit}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                保存更新
              </button>
            </div>
          </div>
        </div>
      )}

      {editingBinding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-sans font-bold text-lg text-zinc-900">编辑脊骨装帧工艺</h3>
              <button 
                onClick={() => setEditingBinding(null)}
                className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">装帧名称</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="装帧工艺名称"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">材质特征</label>
                <textarea 
                  rows={3}
                  value={editStructure}
                  onChange={(e) => setEditStructure(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="说明脊骨结构如何结合，以及平摊性能"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">强度、拉扭、使用寿命优点和风险分析</label>
                <textarea 
                  rows={3}
                  value={editProsAndCons}
                  onChange={(e) => setEditProsAndCons(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="示例：优点：牢固。缺点：加厚容易折断。"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">设计匹配</label>
                <textarea 
                  rows={2}
                  value={editSuitableScenario}
                  onChange={(e) => setEditSuitableScenario(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="针对人群的物理习惯推荐..."
                />
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-700 font-bold">备注</label>
                <textarea 
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs"
                  placeholder="工艺评估重点提示..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right flex justify-end gap-2 text-xs">
              <button 
                onClick={() => setEditingBinding(null)}
                className="px-4 py-2 border border-zinc-200 rounded-xl font-bold bg-white text-zinc-700 hover:bg-zinc-100 transition-all shadow-xs"
              >
                取消
              </button>
              <button 
                onClick={saveBindingEdit}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                保存更新
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY DIALOG MODAL - Edit Suitable Scenario & Reference Images */}
      {activeApplicableMaterial && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in font-sans"
          onClick={() => setActiveApplicableMaterial(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-zinc-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 flex justify-between items-start bg-zinc-50/50">
              <div>
                <h3 className="font-sans font-bold text-lg text-zinc-900 leading-snug">
                  编辑适用对象 & 参考案例
                </h3>
                <span className="font-mono text-[9px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider mt-1.5 inline-block">
                  {activeApplicableMaterial.name}
                </span>
              </div>
              <button 
                onClick={() => setActiveApplicableMaterial(null)}
                className="p-1.5 hover:bg-zinc-150 rounded-xl text-zinc-400 hover:text-zinc-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Editable suitable scenario textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-700">适用对象描述 (Design Recommend)</label>
                <textarea 
                  rows={3}
                  value={tempSuitableScenario}
                  onChange={(e) => setTempSuitableScenario(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all text-xs leading-relaxed"
                  placeholder="请输入该材质最适宜的应用对象及场景说明..."
                />
              </div>

              {/* Reference Images List and Add */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">参考案例图片 (Reference Images)</label>
                  <p className="text-[10px] text-zinc-400">可以添加多张图片的 URL 作为该材质在实际成品中的案例呈现。</p>
                </div>

                {/* Grid of existing reference images */}
                <div className="grid grid-cols-3 gap-3">
                  {tempReferenceImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 group bg-zinc-50">
                      <img 
                        src={imgUrl} 
                        alt={`Reference ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setTempReferenceImages(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="删除此图片"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {tempReferenceImages.length === 0 && (
                    <div className="col-span-full border border-dashed border-zinc-250 rounded-2xl p-6 text-center text-zinc-400 flex flex-col items-center justify-center gap-1.5">
                      <Image className="w-6 h-6 text-zinc-300" />
                      <span className="text-[10px]">暂无参考案例图片</span>
                    </div>
                  )}
                </div>

                {/* Add new image input bar */}
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="粘贴新的案例图片 URL..."
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3.5 font-sans text-xs focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newImageUrlInput.trim()) {
                          setTempReferenceImages(prev => [...prev, newImageUrlInput.trim()]);
                          setNewImageUrlInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrlInput.trim()) {
                        setTempReferenceImages(prev => [...prev, newImageUrlInput.trim()]);
                        setNewImageUrlInput('');
                      }
                    }}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50 text-right flex justify-end gap-2 text-xs">
              <button 
                onClick={() => setActiveApplicableMaterial(null)}
                className="px-4 py-2 border border-zinc-200 rounded-xl font-bold bg-white text-zinc-700 hover:bg-zinc-100 transition-all shadow-xs"
              >
                取消
              </button>
              <button 
                onClick={handleSaveApplicable}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                保存更新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
