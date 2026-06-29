/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BrandList from './components/BrandList';
import ProductList from './components/ProductList';
import MaterialCraftsSystem from './components/MaterialCraftsSystem';
import JournalConfigurator from './components/JournalConfigurator';
import SizeList from './components/SizeList';
import TrendList from './components/TrendList';
import InspirationList from './components/InspirationList';
import DesignerList from './components/DesignerList';
import CompareDossier from './components/CompareDossier';
import KnowledgeGraph from './components/KnowledgeGraph';
import FormModal from './components/FormModal';
import RecordList, { initialRecords } from './components/RecordList';

// Seed data and persistent localStorage hooks
import { 
  initialBrands, 
  initialProducts, 
  initialMaterials, 
  initialCrafts, 
  initialBindings, 
  initialSizes, 
  initialTrends, 
  initialInspirations, 
  initialDesigners,
  getSavedData, 
  saveData 
} from './data';
import { Brand, Product, Material, Craft, Binding, ProductRecord } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // 1. Core Databases State synced to localStorage
  const [brands, setBrands] = useState<Brand[]>(() => {
    const data = getSavedData('stationery_brands', initialBrands);
    return data.map((b: Brand) => {
      if (!b.brandType) {
        if (b.id === 'b-notefor' || !['b-midori-tn', 'b-hobonichi', 'b-md-paper', 'b-rhodia', 'b-kokuyo'].includes(b.id)) {
          return { ...b, brandType: 'independent' };
        } else {
          return { ...b, brandType: 'established' };
        }
      }
      return b;
    });
  });
  const [products, setProducts] = useState<Product[]>(() => getSavedData('stationery_products', initialProducts));
  const [materials, setMaterials] = useState<Material[]>(() => getSavedData('stationery_materials', initialMaterials));
  const [crafts, setCrafts] = useState<Craft[]>(() => getSavedData('stationery_crafts', initialCrafts));
  const [bindings, setBindings] = useState<Binding[]>(() => getSavedData('stationery_bindings', initialBindings));
  const [records, setRecords] = useState<ProductRecord[]>(() => getSavedData('stationery_records', initialRecords));

  // 2. Active Tab State ('brands' is default)
  const [activeTab, setActiveTab] = useState<string>('brands');
  
  // Highlighting selection IDs when clicking from dashboard/internal linkages
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);

  // 3. Comparison lists state (contains Product IDs)
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stationery_compare_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast alert notify overlay state
  const [toastMessage, setToastMessage] = useState<string>('');

  // 4. Form Creation Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<'brand' | 'product' | 'material' | 'craft'>('brand');
  const [modalEditItem, setModalEditItem] = useState<any>(null);

  // Sync state mutations to localStorage whenever state modifies
  useEffect(() => {
    saveData('stationery_brands', brands);
  }, [brands]);

  useEffect(() => {
    saveData('stationery_products', products);
  }, [products]);

  useEffect(() => {
    saveData('stationery_materials', materials);
  }, [materials]);

  useEffect(() => {
    saveData('stationery_crafts', crafts);
  }, [crafts]);

  useEffect(() => {
    saveData('stationery_bindings', bindings);
  }, [bindings]);

  useEffect(() => {
    saveData('stationery_records', records);
  }, [records]);

  useEffect(() => {
    localStorage.setItem('stationery_compare_list', JSON.stringify(compareList));
  }, [compareList]);

  // Toast auto-clearing timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // 5. App callbacks handlers
  const handleAddRecord = (newRec: Omit<ProductRecord, 'id'>) => {
    const record: ProductRecord = {
      ...newRec,
      id: `rec-${Date.now()}`
    };
    setRecords([record, ...records]);
    triggerToast(`成功登记日常灵感: ${newRec.title}`);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    triggerToast('创意灵感记录已移出');
  };

  const handleUpdateRecord = (updated: ProductRecord) => {
    setRecords(records.map(r => r.id === updated.id ? updated : r));
    triggerToast(`成功更新创意灵感: ${updated.title}`);
  };

  const handleToggleFavorite = (pId: string) => {
    const updated = products.map(p => {
      if (p.id === pId) {
        const nextState = !p.favorited;
        triggerToast(nextState ? `已成功收藏 ${p.name}` : `已取消收藏 ${p.name}`);
        return { ...p, favorited: nextState };
      }
      return p;
    });
    setProducts(updated);
  };

  const handleCompareSelect = (pId: string) => {
    let nextList: string[];
    if (compareList.includes(pId)) {
      nextList = compareList.filter(id => id !== pId);
      triggerToast('已将该商品移出对比池。');
    } else {
      nextList = [...compareList, pId];
      triggerToast('已成功推入对比池，请前往横向对比页面查对。');
    }
    setCompareList(nextList);
  };

  const handleRemoveCompare = (pId: string) => {
    setCompareList(compareList.filter(id => id !== pId));
    triggerToast('已移出对比池');
  };

  const handleClearCompare = () => {
    setCompareList([]);
    triggerToast('已清空全部对比款型');
  };

  const handleDeleteBrand = (bId: string) => {
    setBrands(brands.filter(b => b.id !== bId));
    // Cascade delete or sever products linkage
    setProducts(products.map(p => p.brandId === bId ? { ...p, brandId: '' } : p));
    triggerToast('品牌档案已下架');
  };

  const handleDeleteProduct = (pId: string) => {
    setProducts(products.filter(p => p.id !== pId));
    setCompareList(compareList.filter(id => id !== pId));
    triggerToast('产品款式已删除');
  };

  // Save brand/product/material after adding or editing
  const handleSaveItem = (cat: string, item: any) => {
    if (cat === 'brand') {
      const exists = brands.some(b => b.id === item.id);
      if (exists) {
        setBrands(brands.map(b => b.id === item.id ? item : b));
        triggerToast(`成功更新品牌档案: ${item.name}`);
      } else {
        setBrands([item, ...brands]);
        triggerToast(`成功创建品牌档案: ${item.name}`);
      }
    } else if (cat === 'product') {
      const exists = products.some(p => p.id === item.id);
      if (exists) {
        setProducts(products.map(p => p.id === item.id ? item : p));
        triggerToast(`成功更新产品模型: ${item.name}`);
      } else {
        setProducts([item, ...products]);
        triggerToast(`成功登记产品档案: ${item.name}`);
      }
    } else if (cat === 'material') {
      const exists = materials.some(m => m.id === item.id);
      if (exists) {
        setMaterials(materials.map(m => m.id === item.id ? item : m));
        triggerToast(`成功更新新特材质: ${item.name}`);
      } else {
        setMaterials([item, ...materials]);
        triggerToast(`成功收录特种材质: ${item.name}`);
      }
    }
  };

  const handleSaveMaterialDirect = (item: Material) => {
    if (materials.some(m => m.id === item.id)) {
      setMaterials(materials.map(m => m.id === item.id ? item : m));
      triggerToast(`材质档案更新成功: ${item.name}`);
    } else {
      setMaterials([item, ...materials]);
      triggerToast(`成功录入特种材质: ${item.name}`);
    }
  };

  const handleSaveCraftDirect = (item: Craft) => {
    if (crafts.some(c => c.id === item.id)) {
      setCrafts(crafts.map(c => c.id === item.id ? item : c));
      triggerToast(`印刷工艺更新成功: ${item.name}`);
    } else {
      setCrafts([item, ...crafts]);
      triggerToast(`成功录入印刷工艺: ${item.name}`);
    }
  };

  const handleSaveBindingDirect = (item: Binding) => {
    if (bindings.some(b => b.id === item.id)) {
      setBindings(bindings.map(b => b.id === item.id ? item : b));
      triggerToast(`装帧工艺更新成功: ${item.name}`);
    } else {
      setBindings([item, ...bindings]);
      triggerToast(`成功录入装帧工艺: ${item.name}`);
    }
  };

  const handleAddTrigger = (category: 'brand' | 'product' | 'material' | 'craft', editItem?: any) => {
    setModalCategory(category);
    setModalEditItem(editItem || null);
    setIsModalOpen(true);
  };

  // Handle bidirectional navigation from knowledge nodes or cards jump
  const handleNavigateToTab = (tab: string, selectedId?: string) => {
    setActiveTab(tab);
    if (tab === 'brands' && selectedId) {
      setSelectedBrandId(selectedId);
    } else if (tab === 'products' && selectedId) {
      setSelectedProductId(selectedId);
    }
  };

  // Render target sub-view tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'brands':
        return (
          <BrandList 
            brands={brands}
            products={products}
            materials={materials}
            onAddTrigger={handleAddTrigger}
            onDeleteBrand={handleDeleteBrand}
            selectedBrandId={selectedBrandId}
            onClearSelection={() => setSelectedBrandId(undefined)}
            onUpdateProducts={(updatedProducts) => {
              setProducts(updatedProducts);
              triggerToast('已更新本册产品库与相册档案');
            }}
          />
        );
      case 'material_crafts':
        return (
          <MaterialCraftsSystem 
            materials={materials} 
            crafts={crafts} 
            bindings={bindings} 
            onSaveMaterial={handleSaveMaterialDirect}
            onSaveCraft={handleSaveCraftDirect}
            onSaveBinding={handleSaveBindingDirect}
          />
        );
      case 'simulator':
        return (
          <JournalConfigurator 
            brands={brands} 
            products={products} 
            materials={materials} 
          />
        );
      case 'records':
        return (
          <RecordList 
            records={records}
            onAddRecord={handleAddRecord}
            onDeleteRecord={handleDeleteRecord}
            onUpdateRecord={handleUpdateRecord}
          />
        );
      default:
        return (
          <BrandList 
            brands={brands}
            products={products}
            materials={materials}
            onAddTrigger={handleAddTrigger}
            onDeleteBrand={handleDeleteBrand}
            selectedBrandId={selectedBrandId}
            onClearSelection={() => setSelectedBrandId(undefined)}
            onUpdateProducts={(updatedProducts) => {
              setProducts(updatedProducts);
              triggerToast('已更新本册产品库与相册档案');
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex text-zinc-900 bg-zinc-50">
      {/* Dynamic Toast Feedback Notification Card */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-zinc-900 text-white shadow-xl rounded-2xl px-5 py-3 border border-zinc-800 z-50 flex items-center gap-2.5 transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-sans text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Primary Left Navigation Rail (Sticky Sidebar) */}
      <Sidebar 
        currentTab={activeTab as any} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Auto clean selected filters
          setSelectedBrandId(undefined);
          setSelectedProductId(undefined);
        }}
        brandsCount={brands.length}
        recordsCount={records.length}
      />

      {/* Main Core Desktop Canvas Section (Single-View Frame Boundary) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Soft elegant header bar */}
        <header className="h-14 bg-white border-b border-zinc-200 px-8 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
          </div>

          <div className="flex items-center gap-3">
          </div>
        </header>

        {/* Dynamic viewport card stack */}
        {renderActiveView()}
      </div>

      {/* Overlay Create/Edit Form Modal with Sparks Gemini pre-fill */}
      <FormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={modalCategory}
        editItem={modalEditItem}
        onSave={handleSaveItem}
        brands={brands}
      />
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
