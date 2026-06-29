/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Check, 
  Calendar, 
  Clock, 
  Tag, 
  Flame, 
  User, 
  HelpCircle,
  Layout, 
  CheckCircle2, 
  ChevronLeft,
  ChevronRight, 
  RotateCcw,
  BookMarked,
  Printer,
  Heart,
  FileText,
  Pencil,
  Plus,
  ImagePlus,
  UploadCloud,
  Upload,
  Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Brand, Product, Material, Binding } from '../types';

interface JournalConfiguratorProps {
  brands: Brand[];
  products: Product[];
  materials: Material[];
}

interface JournalType {
  id: string;
  name: string;
  englishName: string;
  usage: string;
  structure: string;
  behavior: string;
  classicBenchmark: string;
  idealBinding: string;
  bgGrad: string;
  customDimension?: string;
}

const JOURNAL_TYPES: JournalType[] = [
  {
    id: 'daily',
    name: '日计划型手账',
    englishName: 'Daily Planner',
    usage: '一日一页的高密度日程管理、详细日记和长篇文字创作。',
    structure: '左侧设24小时浅色时间轴刻度，右上为迷你月历，下方保留点阵自由书写区与每日一句金句。',
    behavior: '重度效率追求者、热衷记录生活长文或进行晨间写作的深度硬核用户。',
    classicBenchmark: 'Hobonichi Techo & Midori MD 1-Day-1-Page',
    idealBinding: '裸脊锁线装订 (可180°无阻平摊)',
    bgGrad: 'from-amber-50 to-amber-100/40'
  },
  {
    id: 'weekly',
    name: '周计划型手账',
    englishName: 'Weekly Planner',
    usage: '周度时间线概览、关键任务清单跟进与中长期项目进度统筹。',
    structure: '左右跨页逻辑：左页为周一至周日横排时间窗格，右页为完全的点阵或方格自由备忘栏。',
    behavior: '中度日常任务调度、常备习惯打卡印章、讲求周度平衡的工作白领与学生团队。',
    classicBenchmark: 'Hobonichi Weeks & Jibun Techo LITE',
    idealBinding: '精装线装胶钉',
    bgGrad: 'from-blue-50 to-blue-100/40'
  },
  {
    id: 'bullet',
    name: '子弹笔记系统',
    englishName: 'Bullet Journal (BuJo)',
    usage: '基于自定义符号系统的极简快速整理、灵感捕捉与动态任务清单。',
    structure: '全书网格页，首页包含索引页 (Index)、未来规划表 (Future Log) 与标志说明页 (Keys)。',
    behavior: '极简主义者、热衷DIY自我系统、不需要过多框架预设的手脑并用思考师。',
    classicBenchmark: 'Leuchtturm1917 Bullet Journal Edition',
    idealBinding: '锁线胶装带数条书签带',
    bgGrad: 'from-zinc-150 to-zinc-200/40'
  },
  {
    id: 'travel',
    name: '旅行记录型手账',
    englishName: 'Travel Journal',
    usage: '收集登机牌、风景明信片、盖章纪念，记录旅途灵感草图及多介质贴纸杂记。',
    structure: '修长狭窄开本 (如 TN 规格)，内芯往往由数本可更换的便携薄本 (插页式) 串联形成。',
    behavior: '户外背包客、手工作坊爱好者，习惯高频更换差旅任务、剪贴收纳机票的行者。',
    classicBenchmark: 'Traveler\'s Notebook Standard Size',
    idealBinding: '真皮外壳 + 弹力皮筋活扣绳穿 (插页活页)',
    bgGrad: 'from-orange-50 to-orange-100/40'
  },
  {
    id: 'sketchbook',
    name: '绘图与视觉速写型',
    englishName: 'Sketchbook',
    usage: '便携艺术铅笔素描、水彩涂鸦、工业产品设计草图与排线构思。',
    structure: '全空白无印染纸面，克重往往要求在120g以上以防吸水起皱，具备优良的粗糙肌理。',
    behavior: '美术设计师、插画画手、景观手绘画师及所有对网格线条有干扰排斥的视觉探索家。',
    classicBenchmark: 'Moleskine Art Series Sketchbook',
    idealBinding: '重力锁线精装 (通常配弹性橡皮紧固带)',
    bgGrad: 'from-emerald-50 to-emerald-100/40'
  },
  {
    id: 'emotion',
    name: '情绪与冥想日记',
    englishName: 'Emotion & Mindfulness Journal',
    usage: '记录每日心情指数、追踪睡眠周期、进行感恩书写与压力自我对话。',
    structure: '舒缓的高负空间留白，内嵌呼吸引导正念视觉、极简化睡眠色块方圈与习惯成就评级系统。',
    behavior: '注重心理健康和情绪梳理、寻找睡前正念沉静时间的都市减压族。',
    classicBenchmark: 'Leuchtturm1917 Some Lines A Day',
    idealBinding: '软皮平摊缝线',
    bgGrad: 'from-purple-50 to-purple-100/40'
  }
];

export default function JournalConfigurator({ brands, products, materials }: JournalConfiguratorProps) {
  // CONFIGURATION STATES (PRESET VALUES)
  const [selectedType, setSelectedType] = useState<string>('free');
  const [dimension, setDimension] = useState<string>('A5');
  const [layoutFeature, setLayoutFeature] = useState<string>('timeline');
  const [bindingType, setBindingType] = useState<string>('thread-sewn');
  const [pagePeriod, setPagePeriod] = useState<string>('1day1page');
  const [scenario, setScenario] = useState<string>('efficiency');
  const [paperPref, setPaperPref] = useState<string>('weight-80');

  // New Custom combination features: base background patterns
  const [bgPattern, setBgPattern] = useState<string>('grid');
  const [uploadedInnerPage, setUploadedInnerPage] = useState<string | null>(null);
  const innerPageInputRef = useRef<HTMLInputElement>(null);

  // CUSTOM STRING INPUT OVERRIDES
  const [customSelectedType, setCustomSelectedType] = useState<string>('');
  const [customDimension, setCustomDimension] = useState<string>('');
  const [customLayoutFeature, setCustomLayoutFeature] = useState<string>('');
  const [customBindingType, setCustomBindingType] = useState<string>('');
  const [customPagePeriod, setCustomPagePeriod] = useState<string>('');
  const [customScenario, setCustomScenario] = useState<string>('');
  const [customPaperPref, setCustomPaperPref] = useState<string>('');

  // Derived active configurations (use custom values if specified, otherwise fall back to presets)
  const activeSelectedType = customSelectedType.trim() || selectedType;
  const activeDimension = customDimension.trim() || dimension;
  const activeLayoutFeature = customLayoutFeature.trim() || layoutFeature;
  const activeBindingType = customBindingType.trim() || bindingType;
  const activePagePeriod = customPagePeriod.trim() || pagePeriod;
  const activeScenario = customScenario.trim() || scenario;
  const activePaperPref = customPaperPref.trim() || paperPref;

  // Interactive configurations recommendations state
  const [customTitle, setCustomTitle] = useState<string>('我的灵感手帐本方案壹号');
  const [activeTab, setActiveTab] = useState<'types' | 'configurator'>('configurator');
  const [currentSpread, setCurrentSpread] = useState<number>(0);

  // Cover selection and upload
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadedCover, setUploadedCover] = useState<string | null>(null);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedCover(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInnerPageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedInnerPage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderInnerPageContent = (layout: string, isLeft: boolean) => {
    return (
      <div className="w-1/2 flex-1 bg-white rounded-lg p-3 border border-zinc-200/80 flex flex-col justify-between overflow-hidden relative shadow-2xs">
        {/* Uploaded Background Image */}
        {uploadedInnerPage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 z-0" 
            style={{ backgroundImage: `url(${uploadedInnerPage})` }} 
          />
        )}

        {/* Base Texture/Pattern (only drawn if no uploaded background, or overlay on top with opacity) */}
        {!uploadedInnerPage && (
          <>
            {bgPattern === 'grid' && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(116,192,252,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(116,192,252,0.22)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0"></div>
            )}
            {bgPattern === 'lined' && (
              <div className="absolute inset-x-1 inset-y-2 bg-[linear-gradient(to_bottom,rgba(116,192,252,0.25)_1px,transparent_1px)] bg-[size:100%_12px] pointer-events-none z-0"></div>
            )}
            {bgPattern === 'dot-grid' && (
              <div className="absolute inset-0 bg-[radial-gradient(rgba(116,192,252,0.35)_1.2px,transparent_1.2px)] bg-[size:10px_10px] pointer-events-none z-0"></div>
            )}
            {bgPattern === 'blank' && (
              <div className="absolute inset-x-2 inset-y-3 pointer-events-none border border-dashed border-zinc-150 rounded flex items-center justify-center bg-zinc-50/5 z-0">
                <span className="text-[6px] font-sans text-zinc-350 italic">极简空白页</span>
              </div>
            )}
          </>
        )}

        {/* Header line for inner page */}
        <div className="border-b border-zinc-150 pb-1 flex justify-between items-center select-none z-10 relative bg-white/70 backdrop-blur-[0.5px]">
          <span className="text-[7px] font-sans font-black text-sky-700 tracking-wider">
            {uploadedInnerPage ? '📸 自定义底图' : (
              <>
                {bgPattern === 'blank' && '极简空白页'}
                {bgPattern === 'grid' && '蓝白精细方格'}
                {bgPattern === 'lined' && '清新横线内页'}
                {bgPattern === 'dot-grid' && '空灵点阵内芯'}
              </>
            )}
            {layout !== 'none' && ` + ${
              layout === 'timeline' ? '时间轴规' :
              layout === 'weekly' ? '周度计划' :
              layout === 'monthly' ? '月度矩阵' :
              layout === 'tracker' ? '打卡情绪' :
              layout === 'cornell' ? '康奈尔笔记' : layout
            }`}
          </span>
          <span className="text-[6.5px] font-mono text-zinc-400 font-bold">
            {isLeft ? 'PAGE A' : 'PAGE B'}
          </span>
        </div>

        {/* FUNCTIONAL TEMPLATES OVERLAY */}
        <div className="flex-1 relative mt-1.5 min-h-[140px] flex flex-col justify-between">
          
          {layout === 'timeline' && (
            <div className="absolute inset-0 pointer-events-none p-1 flex flex-row h-full z-10">
              {/* Left Timeline scale bar matching Image 1 */}
              <div className="w-[30%] border-r border-sky-300/80 h-full relative pr-1.5 flex flex-col justify-between text-[6.5px] font-mono text-sky-500 font-black">
                {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3, 4].map((hour, idx) => (
                  <div key={idx} className="flex items-center justify-end w-full h-[3.8%] relative">
                    <span className="leading-none scale-90">{hour}</span>
                    <span className="w-1.5 h-px bg-sky-300 ml-1"></span>
                  </div>
                ))}
              </div>
              {/* Right writing area */}
              <div className="flex-1 pl-1 bg-[linear-gradient(to_bottom,rgba(116,192,252,0.12)_1px,transparent_1px)] bg-[size:100%_11px] opacity-75 h-full"></div>
            </div>
          )}

          {layout === 'weekly' && (
            <div className="absolute inset-0 pointer-events-none p-1 flex flex-col justify-between h-full space-y-1 z-10">
              {/* Symmetrical weekly schedule blocks matching Image 3 */}
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div key={day} className="flex-1 border border-sky-150 bg-white/75 rounded flex flex-col justify-between overflow-hidden shadow-4xs">
                  <div className="bg-sky-50/80 border-b border-sky-100 px-1.5 py-0.5 flex justify-between items-center">
                    <span className="font-sans font-black text-[7.5px] text-sky-700 tracking-wider scale-90">{day}</span>
                    <span className="w-2.5 h-2.5 border border-sky-300 rounded bg-white flex items-center justify-center">
                    </span>
                  </div>
                  <div className="flex-1 min-h-[4px]"></div>
                </div>
              ))}
            </div>
          )}

          {layout === 'monthly' && (
            <div className="absolute inset-0 pointer-events-none p-1 flex flex-col h-full space-y-1 z-10">
              {/* Top: 12 months matrix + Month labels matching Image 4 */}
              <div className="flex justify-between items-start h-[16%]">
                <div className="grid grid-cols-6 gap-x-1 gap-y-0.5 border border-sky-200 p-1 bg-white/80 rounded">
                  {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                    <span key={m} className={`text-[4.5px] font-mono font-bold px-0.5 text-center ${m === '06' ? 'bg-sky-500 text-white rounded-xs scale-90' : 'text-sky-500/80'}`}>{m}</span>
                  ))}
                </div>
                <div className="text-right flex flex-col justify-between h-full pr-1">
                  <span className="text-[8px] font-sans font-black text-sky-700 tracking-wider">MONTHLY</span>
                  <span className="text-[4.5px] font-mono text-sky-400">SCHEDULING</span>
                </div>
              </div>
              
              {/* Bottom: sequence-numbered calendar cells */}
              <div className="flex-1 grid grid-cols-7 gap-1 h-[82%]">
                {Array.from({ length: 28 }).map((_, idx) => {
                  const num = String(idx + 1).padStart(2, '0');
                  return (
                    <div key={idx} className="border border-sky-200/80 bg-white/80 rounded-sm flex flex-col justify-between p-0.5 shadow-4xs">
                      <span className="text-[5px] font-mono text-sky-500 font-bold leading-none scale-90 origin-top-left">{num}</span>
                      <div className="flex-grow"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {layout === 'tracker' && (
            <div className="absolute inset-0 pointer-events-none p-1 flex gap-2 flex-row h-full z-10">
              {/* Left Column: S M T W T F S table matching Image 2 */}
              <div className="w-[58%] border border-sky-150 bg-white/85 rounded p-1 flex flex-col h-full shadow-4xs">
                <div className="flex justify-around border-b border-sky-100 pb-1 text-[7px] font-sans font-black text-sky-600 scale-90">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <span key={idx}>{day}</span>
                  ))}
                </div>
                <div className="flex-1 grid grid-cols-7 gap-px pt-1 opacity-70">
                  {Array.from({ length: 49 }).map((_, idx) => (
                    <div key={idx} className="border-b border-r border-sky-50/70 h-[9px]"></div>
                  ))}
                </div>
              </div>

              {/* Right Column: Mood smiley face scale + three tasks checkboxes */}
              <div className="flex-grow flex flex-col justify-between h-full bg-white/85 border border-sky-150 rounded p-1 shadow-4xs">
                {/* Mood emojis row */}
                <div className="flex justify-around items-center border-b border-sky-100 pb-1 pt-0.5">
                  {['😊', '🙁', '😠', '😢', '😐'].map((mood, idx) => (
                    <span key={idx} className="text-[7px] hover:scale-125 transition-transform">{mood}</span>
                  ))}
                </div>

                {/* notes area */}
                <div className="flex-1 my-2 bg-[linear-gradient(to_bottom,rgba(116,192,252,0.1)_1px,transparent_1px)] bg-[size:100%_8px] opacity-75"></div>

                {/* Bottom Task List */}
                <div className="space-y-1 pb-0.5">
                  {[1, 2, 3].map(idx => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 border border-sky-300 bg-white rounded-xs shrink-0"></span>
                      <div className="h-px bg-sky-100 flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {layout === 'cornell' && (
            <div className="absolute inset-0 pointer-events-none p-1 flex flex-col justify-between h-full z-10 bg-white/60">
              <div className="flex-grow flex flex-col min-h-[90px]">
                <div className="flex flex-row h-full">
                  <div className="w-1/4 border-r border-zinc-200 pr-1 h-full font-bold text-[5px] text-zinc-400">提示 Cue</div>
                  <div className="flex-grow pl-1 h-full bg-[linear-gradient(to_bottom,rgba(116,192,252,0.15)_1px,transparent_1px)] bg-[size:100%_11px] opacity-75"></div>
                </div>
              </div>
              <div className="h-[22%] border-t border-zinc-200 mt-1 flex items-center text-[4.5px] text-zinc-400 font-bold uppercase">总结 Summary</div>
            </div>
          )}

          {layout === 'none' && !uploadedInnerPage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <span className="text-[8px] text-sky-400 font-sans tracking-widest uppercase">纯净底纹页</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Recommendation items in editable local state
  const [localRecs, setLocalRecs] = useState<Product[]>([]);
  const [hasEditedRecs, setHasEditedRecs] = useState<boolean>(false);
  
  // Local state for Hand Book Types with initial global constant values
  const [localTypes, setLocalTypes] = useState<JournalType[]>(JOURNAL_TYPES);
  const [selectedTypeObj, setSelectedTypeObj] = useState<JournalType | null>(null);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState<boolean>(false);

  // States for Science Popularization Center
  const [selectedScienceType, setSelectedScienceType] = useState<JournalType | null>(null);
  const [activeTextureId, setActiveTextureId] = useState<string>('blank');

  const handleDeleteType = (id: string) => {
    setLocalTypes(prev => prev.filter(item => item.id !== id));
    setIsTypeModalOpen(false);
    setSelectedTypeObj(null);
  };

  const handleAddNewType = () => {
    const newId = `custom-type-${Date.now()}`;
    const newTypeObj: JournalType = {
      id: newId,
      name: '自定义手账类型',
      englishName: 'Custom Planner Structure',
      usage: '在此写下该手账类型的主要日常用途和书写场景。',
      structure: '详细定义内芯的栅格排版、时间轴线稿和辅栏布局逻辑。',
      behavior: '适合追求独特排版的用户。',
      classicBenchmark: '自主研发方案',
      idealBinding: '锁线胶装装订 (完全无阻平摊)',
      bgGrad: 'from-zinc-50 to-zinc-100',
      customDimension: 'A5'
    };
    setLocalTypes([newTypeObj, ...localTypes]);
    setSelectedTypeObj(newTypeObj);
    setEditTypeName(newTypeObj.name);
    setEditTypeEnglish(newTypeObj.englishName);
    setEditTypeUsage(newTypeObj.usage);
    setEditTypeStructure(newTypeObj.structure);
    setEditTypeBehavior(newTypeObj.behavior);
    setEditTypeBenchmark(newTypeObj.classicBenchmark);
    setEditTypeBinding(newTypeObj.idealBinding);
    setEditTypeDimension('A5');
    setIsTypeModalOpen(true);
  };

  // Type form field states inside the modal
  const [editTypeName, setEditTypeName] = useState<string>('');
  const [editTypeEnglish, setEditTypeEnglish] = useState<string>('');
  const [editTypeUsage, setEditTypeUsage] = useState<string>('');
  const [editTypeStructure, setEditTypeStructure] = useState<string>('');
  const [editTypeBehavior, setEditTypeBehavior] = useState<string>('');
  const [editTypeBenchmark, setEditTypeBenchmark] = useState<string>('');
  const [editTypeBinding, setEditTypeBinding] = useState<string>('');
  const [editTypeDimension, setEditTypeDimension] = useState<string>('');

  // Modal state for selected recommendation card detail & edit
  const [selectedRecItem, setSelectedRecItem] = useState<Product | null>(null);
  const [isRecModalOpen, setIsRecModalOpen] = useState<boolean>(false);

  // Recommendation form field states inside the modal
  const [editRecName, setEditRecName] = useState<string>('');
  const [editRecBrand, setEditRecBrand] = useState<string>('');
  const [editRecPaper, setEditRecPaper] = useState<string>('');
  const [editRecBinding, setEditRecBinding] = useState<string>('');
  const [editRecPrice, setEditRecPrice] = useState<string>('');
  const [editRecNotes, setEditRecNotes] = useState<string>('');
  const [editRecImageUrl, setEditRecImageUrl] = useState<string>('');

  // Handlers for Hand Book Type editing
  const startEditType = (type: JournalType) => {
    setSelectedTypeObj(type);
    setEditTypeName(type.name);
    setEditTypeEnglish(type.englishName);
    setEditTypeUsage(type.usage);
    setEditTypeStructure(type.structure);
    setEditTypeBehavior(type.behavior || '');
    setEditTypeBenchmark(type.classicBenchmark || '');
    setEditTypeBinding(type.idealBinding || '');
    setEditTypeDimension(type.customDimension || 'A5');
    setIsTypeModalOpen(true);
  };

  const handleSaveType = () => {
    if (!selectedTypeObj) return;
    setLocalTypes(prev => prev.map(item => {
      if (item.id === selectedTypeObj.id) {
        return {
          ...item,
          name: editTypeName,
          englishName: editTypeEnglish,
          usage: editTypeUsage,
          structure: editTypeStructure,
          behavior: editTypeBehavior,
          classicBenchmark: editTypeBenchmark,
          idealBinding: editTypeBinding,
          customDimension: editTypeDimension
        };
      }
      return item;
    }));
    setIsTypeModalOpen(false);
    setSelectedTypeObj(null);
  };

  // Trigger dynamic recommendation whenever config parameters shift
  useEffect(() => {
    if (hasEditedRecs) return; // Retain user edits instead of overwriting

    // Score products based on matching configurations
    const scored = products.map(p => {
      let score = 0;

      // 1. Map dimension/size
      if (dimension === 'A6' && p.dimensions.toLowerCase().includes('a6')) score += 3;
      if (dimension === 'A5' && p.dimensions.toLowerCase().includes('a5')) score += 3;
      if (dimension === 'TN' && (p.dimensions.toLowerCase().includes('tn') || p.dimensions.toLowerCase().includes('travel'))) score += 4;
      
      // 2. Map category / type correlation
      if (selectedType === 'daily' && p.category === 'Planner') score += 2;
      if (selectedType === 'weekly' && p.category === 'Planner' && p.name.toLowerCase().includes('week')) score += 4;
      
      // 3. Map paper weights
      if (paperPref === 'weight-52' && p.paperType.toLowerCase().includes('巴川')) score += 3;
      if (paperPref === 'weight-80' && p.paperType.toLowerCase().includes('md')) score += 3;

      // 4. Map binding
      if (bindingType === 'thread-sewn' && (p.bindingMethod.toLowerCase().includes('锁') || p.bindingMethod.toLowerCase().includes('缝线'))) score += 3;
      if (bindingType === 'loose-leaf' && (p.bindingMethod.toLowerCase().includes('活页') || p.bindingMethod.toLowerCase().includes('孔'))) score += 3;
      if (bindingType === 'spiral' && (p.bindingMethod.toLowerCase().includes('圈') || p.bindingMethod.toLowerCase().includes('螺旋'))) score += 3;
      if (bindingType === 'saddle-stitch' && (p.bindingMethod.toLowerCase().includes('钉') || p.bindingMethod.toLowerCase().includes('骑马'))) score += 3;
      if (bindingType === 'hardcover' && (p.bindingMethod.toLowerCase().includes('精装') || p.bindingMethod.toLowerCase().includes('硬皮'))) score += 3;
      if (bindingType === 'glue-bound' && (p.bindingMethod.toLowerCase().includes('胶装') || p.bindingMethod.toLowerCase().includes('胶') || p.bindingMethod.toLowerCase().includes('装订式'))) score += 3;

      return { product: p, score };
    });

    // Sort and grab top 3, fallback if none matches
    const topRecommended = scored
      .filter(item => item.score > 1)
      .sort((a, b) => b.score - a.score)
      .map(item => ({ ...item.product }))
      .slice(0, 3);

    if (topRecommended.length === 0) {
      topRecommended.push({
        id: "placeholder-tomoe",
        brandId: "hobo",
        name: "巴川纸极薄装订式本册 (Tomoe River Cream Grid Book)",
        releaseDate: "2025-01",
        category: "Planner",
        dimensions: "A5",
        paperType: "52gsm 巴川轻质奶油网格特种纸 (防穿透)",
        bindingMethod: "裸书脊180度开摊缝线工艺",
        price: "¥ 68.00",
        tags: ["手账原纸", "巴川纸"],
        notes: "手帐本册界的常青树介质。拥有极薄极平滑的书写面，能承受各类极重钢笔、水性笔墨耐性，不易晕染！",
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
        materialIds: [],
        craftIds: []
      });
    }

    setLocalRecs(topRecommended);
  }, [selectedType, dimension, layoutFeature, bindingType, pagePeriod, scenario, paperPref, products, hasEditedRecs]);

  const currentTypeObj = localTypes.find(j => j.id === activeSelectedType) || {
    id: 'custom',
    name: activeSelectedType,
    englishName: 'Custom Journal Type',
    usage: '自定义专属功能与规划布局。',
    structure: '完全由用户在左侧自定义输入的个性化排线结构设计。',
    behavior: '追求打破成规的书写探索大家。',
    classicBenchmark: '用户独特作品',
    idealBinding: activeBindingType,
    bgGrad: 'from-amber-50 to-amber-100/40'
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50 relative">
      {/* Upper Segment Title (Dynamic Options Tab Bar) */}
      <div className="sticky top-0 bg-white border-b border-zinc-200 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
        <div>
          <h2 className="font-sans font-bold text-2xl text-zinc-900 tracking-tight">手账模拟与配置库</h2>
          <p className="font-sans text-xs text-zinc-500 mt-1 max-w-2xl">
            可视化的手账产品组合模拟，定制您的专属物理介质、装帧形式、开本规格与布局体系，打造专属文创。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <div className="flex bg-zinc-100 p-1 border border-zinc-200/60 rounded-2xl w-fit">
            <button
              id="cfg-tab-types"
              onClick={() => setActiveTab('types')}
              className={`py-2 px-5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'types'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-650 hover:text-zinc-900 hover:bg-zinc-100/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>手帐类型</span>
            </button>
            <button
              id="cfg-tab-custom"
              onClick={() => setActiveTab('configurator')}
              className={`py-2 px-5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'configurator'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-650 hover:text-zinc-900 hover:bg-zinc-100/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>自定义手帐</span>
            </button>
          </div>

          <button
            onClick={handleAddNewType}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-805 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>添加新名片</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-12">
        
        {/* SECTION 1: TYPES SYSTEM LIBRARY (手账类型体系) */}
        {activeTab === 'types' && (
          <div className="space-y-6">
            {/* Grid display list of standard types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localTypes.map(j => (
                <div 
                  key={j.id}
                  onClick={() => {
                    setSelectedScienceType(j);
                    if (j.id === 'daily') setActiveTextureId('timeline');
                    else if (j.id === 'weekly') setActiveTextureId('weekly');
                    else if (j.id === 'bullet') setActiveTextureId('dot-grid');
                    else if (j.id === 'travel') setActiveTextureId('tracker');
                    else if (j.id === 'sketchbook') setActiveTextureId('blank');
                    else if (j.id === 'emotion') setActiveTextureId('cornell');
                    else setActiveTextureId('blank');
                  }}
                  className="group border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-6 transition-all flex flex-col justify-between space-y-5 cursor-pointer relative"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[9px] uppercase tracking-wider bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded font-bold">
                        规格契合: {j.customDimension || (j.id === 'travel' ? '120x210 mm' : 'A5/A6 传统')}
                      </span>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <button
                          title="修改手帐参数"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditType(j);
                          }}
                          className="p-1.5 bg-zinc-50 hover:bg-zinc-150 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors shadow-xs"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 animate-fadeIn">
                      <h4 className="font-sans font-bold text-sm text-zinc-900 group-hover:text-amber-850 transition-colors">{j.name}</h4>
                      <p className="font-mono text-[9px] text-[#A1A1AA] uppercase tracking-widest leading-none">{j.englishName}</p>
                    </div>

                    <p className="font-sans text-xs text-zinc-650 leading-relaxed pt-2">
                      <strong>核心定位:</strong> {j.usage}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-150">
                    <p className="font-sans text-[11px] text-zinc-555 leading-normal">
                      <strong>装订工艺配置:</strong> <span className="text-zinc-855 font-bold">{j.idealBinding}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: SYSTEM CONFIGURATOR WORKSPACE */}
        {activeTab === 'configurator' && (
          <div className="flex flex-col gap-8">
            
            {/* TOP INPUT PARAMETERS PANEL */}
            <div className="w-full flex flex-col">
              <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-5 flex-1 flex flex-col justify-between">
                <div className="border-b border-zinc-150 pb-4">
                  <span className="font-mono text-[9px] text-orange-650 font-extrabold uppercase bg-orange-55 px-2.5 py-1 rounded-lg">
                    CUSTOM SPEC ENGINE
                  </span>
                  <h3 className="font-sans font-extrabold text-[#111827] text-lg mt-1.5">
                    自定义手账
                  </h3>
                  <p className="font-sans text-xs text-zinc-400 mt-1">
                    调整或自定义您的专属文创工艺学性能，观察右侧逻辑模拟线稿纸面的即时极简排线改变。
                  </p>
                </div>
 
                {/* Form Inputs */}
                <div className="space-y-4">
                  {/* Preset Combinations Panel */}
                  <div className="bg-amber-50/40 border border-amber-200/40 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span className="font-sans text-[11px] font-bold text-zinc-800">经典底纹与功能组合 (Click to Apply Preset)</span>
                    </div>
                    <p className="font-sans text-[10px] text-zinc-500 leading-normal">
                      点击以下推荐组合快速设定参数，即刻在右侧预览。
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { 
                          name: '自由探索随手记', 
                          desc: '方格底纹 + 无附加功能',
                          config: { bgPattern: 'grid', layoutFeature: 'none', selectedType: 'free', pagePeriod: 'free-log', customTitle: '自由探索随笔本' }
                        },
                        { 
                          name: '日行一善情绪本', 
                          desc: '点阵底纹 + 情绪打卡',
                          config: { bgPattern: 'dot-grid', layoutFeature: 'tracker', selectedType: 'emotion', pagePeriod: 'free-log', customTitle: '正念情绪打卡本' }
                        },
                        { 
                          name: '一日一页高效本', 
                          desc: '方格底纹 + 24H时间轴',
                          config: { bgPattern: 'grid', layoutFeature: 'timeline', selectedType: 'life', pagePeriod: '1day1page', customTitle: '一日一页效率本' }
                        },
                        { 
                          name: '年度统筹月度计划', 
                          desc: '空白底纹 + 矩阵月计划',
                          config: { bgPattern: 'blank', layoutFeature: 'monthly', selectedType: 'target', pagePeriod: 'free-log', customTitle: '宏观月度计划本' }
                        },
                        { 
                          name: '精炼周度工作记', 
                          desc: '横线底纹 + 7日周计划',
                          config: { bgPattern: 'lined', layoutFeature: 'weekly', selectedType: 'target', pagePeriod: 'weekly-spread', customTitle: '精英周计划复盘账' }
                        }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBgPattern(preset.config.bgPattern);
                            setLayoutFeature(preset.config.layoutFeature);
                            setSelectedType(preset.config.selectedType);
                            setPagePeriod(preset.config.pagePeriod);
                            setCustomTitle(preset.config.customTitle);
                          }}
                          className="p-2 rounded-xl bg-white border border-zinc-200 hover:border-amber-400 hover:bg-amber-50/20 text-left text-zinc-700 transition-all shadow-3xs flex flex-col justify-between min-h-[58px]"
                        >
                          <span className="font-sans text-[10.5px] font-bold text-zinc-900 leading-tight block text-left">{preset.name}</span>
                          <span className="font-sans text-[8.5px] text-zinc-400 leading-tight mt-1 text-right w-full block self-end">{preset.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Standard Type binding dropdown */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-sans text-[11px] font-bold text-zinc-700 block">手账主要功能偏好</label>
                      {customSelectedType && <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">已自定义</span>}
                    </div>
                    <select
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 font-semibold"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="free">自由记录</option>
                      <option value="life">生活记录与复盘</option>
                      <option value="emotion">情绪管理与解压</option>
                      <option value="target">目标与项目追踪</option>
                      <option value="drawing">涂鸦绘画</option>
                    </select>
                    <input
                      type="text"
                      className="w-full bg-[#FCFAF5] border border-amber-200/55 rounded-xl py-1.5 px-3 font-sans text-[10.5px] focus:outline-none focus:border-amber-500 placeholder:text-zinc-400/90 text-amber-900"
                      placeholder="或自定义其它功能偏好 (如：随笔与财务两用)"
                      value={customSelectedType}
                      onChange={(e) => setCustomSelectedType(e.target.value)}
                    />
                  </div>
 
                  {/* Dimension choices */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-sans text-[11px] font-bold text-zinc-700 block">尺寸规格等级</label>
                      {customDimension && <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">已自定义</span>}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {['A6', 'B6', 'A5', 'TN', 'B5'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setDimension(size)}
                          className={`py-1.5 rounded-lg border font-mono text-[11px] font-extrabold text-center transition-all ${
                            dimension === size && !customDimension
                              ? 'bg-zinc-900 text-white border-zinc-900' 
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border-zinc-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#FCFAF5] border border-amber-200/55 rounded-xl py-1.5 px-3 font-sans text-[10.5px] focus:outline-none focus:border-amber-500 placeholder:text-zinc-400/90 text-amber-900"
                      placeholder="或自定义其它规格尺码 (如：140x195mm 变开本)"
                      value={customDimension}
                      onChange={(e) => setCustomDimension(e.target.value)}
                    />
                  </div>

                  {/* Base Paper Pattern / Texture */}
                  <div className="space-y-1.5">
                    <label className="font-sans text-[11px] font-bold text-zinc-700 block">手账底纹背景 (Paper Texture)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'blank', name: '空白页' },
                        { id: 'grid', name: '网格纸' },
                        { id: 'lined', name: '横线纸' },
                        { id: 'dot-grid', name: '点阵纸' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setBgPattern(item.id)}
                          className={`py-2 px-1 rounded-xl border text-center font-sans text-[11px] transition-all ${
                            bgPattern === item.id
                              ? 'bg-zinc-900 text-white border-zinc-900 font-bold' 
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border-zinc-200'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Custom Inner Page Background */}
                  <div className="space-y-1.5 border border-dashed border-sky-250 p-3 bg-sky-50/15 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <label className="font-sans text-[10.5px] font-bold text-zinc-700 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5 text-sky-600" />
                        <span>自定义内页底图上传</span>
                      </label>
                      {uploadedInnerPage && (
                        <button
                          type="button"
                          onClick={() => setUploadedInnerPage(null)}
                          className="text-[9px] font-sans font-bold text-rose-600 hover:underline"
                        >
                          清除上传
                        </button>
                      )}
                    </div>
                    <p className="font-sans text-[9px] text-zinc-400 leading-normal">
                      支持上传自己的图片作背景，并将与所选功能排线完美融合叠加。
                    </p>
                    <div className="flex gap-2 items-center pt-1">
                      <button
                        type="button"
                        onClick={() => innerPageInputRef.current?.click()}
                        className="flex-1 py-1.5 px-3 rounded-xl border border-dashed border-sky-300 hover:border-sky-500 bg-white hover:bg-sky-50/30 text-center font-sans text-[10.5px] text-sky-700 font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <Image className="w-3.5 h-3.5" />
                        {uploadedInnerPage ? '📸 已上传 (点击更换)' : '选择本地图片上传'}
                      </button>
                      <input
                        ref={innerPageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleInnerPageUpload}
                      />
                    </div>
                  </div>

                  {/* Functional Layout Template Overlay */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-sans text-[11px] font-bold text-zinc-700 block">附加功能排线模板 (Functional Overlay)</label>
                      {customLayoutFeature && <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">已自定义</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', name: '无附加功能' },
                        { id: 'timeline', name: '24H日程时间轴' },
                        { id: 'weekly', name: '7日周度规划' },
                        { id: 'monthly', name: '月度日程矩阵' },
                        { id: 'tracker', name: '财务打卡/情绪' },
                        { id: 'cornell', name: '康奈尔笔记' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLayoutFeature(item.id)}
                          className={`py-2 px-3 rounded-xl border text-left font-sans text-xs flex items-center justify-between transition-all ${
                            layoutFeature === item.id && !customLayoutFeature
                              ? 'bg-zinc-900 text-white border-zinc-900 font-bold' 
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border-zinc-200'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {layoutFeature === item.id && !customLayoutFeature && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#FCFAF5] border border-amber-200/55 rounded-xl py-1.5 px-3 font-sans text-[10.5px] focus:outline-none focus:border-amber-500 placeholder:text-zinc-400/90 text-amber-900"
                      placeholder="或自定义其它手账底纹格式 (如：半日日程、五线谱等)"
                      value={customLayoutFeature}
                      onChange={(e) => setCustomLayoutFeature(e.target.value)}
                    />
                  </div>
 
                  {/* Period page logic */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-sans text-[11px] font-bold text-zinc-700 block">跨页周期编排框架</label>
                      {customPagePeriod && <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">已自定义</span>}
                    </div>
                    <div className="flex gap-2">
                      {[
                        { id: '1day1page', name: '一日一纸 L1' },
                        { id: 'weekly-spread', name: '双页跨页 W2' },
                        { id: 'free-log', name: '完全不设周期' }
                      ].map(period => (
                        <button
                          key={period.id}
                          type="button"
                          onClick={() => setPagePeriod(period.id)}
                          className={`flex-1 py-1.5 rounded-lg border font-sans text-[10.5px] font-bold text-center transition-all ${
                            pagePeriod === period.id && !customPagePeriod
                              ? 'bg-zinc-900 text-white border-zinc-900' 
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-500 border-zinc-200'
                          }`}
                        >
                          {period.name}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#FCFAF5] border border-amber-200/55 rounded-xl py-1.5 px-3 font-sans text-[10.5px] focus:outline-none focus:border-amber-500 placeholder:text-zinc-400/90 text-amber-900"
                      placeholder="或自定义其它分册或周期逻辑 (如：按季四册、自填无限制)"
                      value={customPagePeriod}
                      onChange={(e) => setCustomPagePeriod(e.target.value)}
                    />
                  </div>
 
                  {/* Usage scenes */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-sans text-[11px] font-bold text-zinc-700 block">专享功能记录板块</label>
                      {customScenario && <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">已自定义</span>}
                    </div>
                    <select
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-950"
                      value={scenario}
                      onChange={(e) => setScenario(e.target.value)}
                    >
                      <option value="efficiency">专注与自我时间轴、精炼清单</option>
                      <option value="travel">游记插画板、印戳章和票夹插装</option>
                      <option value="emotion">睡前正念日记、日行一善和感恩墙</option>
                      <option value="creative">极致大脑草案、无限大白纸涂鸦速配</option>
                    </select>
                    <input
                      type="text"
                      className="w-full bg-[#FCFAF5] border border-amber-200/55 rounded-xl py-1.5 px-3 font-sans text-[10.5px] focus:outline-none focus:border-amber-500 placeholder:text-zinc-400/90 text-amber-900"
                      placeholder="或自定义其它专享卡片属性 (如：日常开销、读书随行卡)"
                      value={customScenario}
                      onChange={(e) => setCustomScenario(e.target.value)}
                    />
                  </div>
 
                  {/* Binding Method configuration */}
                  <div className="space-y-1.5 border-t border-zinc-100 pt-3">
                    <div className="flex justify-between items-center">
                      <label className="font-sans text-[11px] font-bold text-zinc-700 block">装帧方式工艺</label>
                      {customBindingType && <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">已自定义</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'thread-sewn', name: '锁线胶装' },
                        { id: 'loose-leaf', name: '活页装订' },
                        { id: 'spiral', name: '铁圈/线圈装订' },
                        { id: 'saddle-stitch', name: '骑马钉' },
                        { id: 'hardcover', name: '精装本' },
                        { id: 'glue-bound', name: '胶装' },
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setBindingType(item.id);
                            setCustomBindingType(''); // Reset custom text when presets are clicked
                          }}
                          className={`py-2 px-3 rounded-xl border text-left font-sans text-xs flex items-center justify-between transition-all ${
                            bindingType === item.id && !customBindingType
                              ? 'bg-zinc-900 text-white border-zinc-900 font-bold' 
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border-zinc-200'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {bindingType === item.id && !customBindingType && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#FCFAF5] border border-amber-200/55 rounded-xl py-1.5 px-3 font-sans text-[10.5px] focus:outline-none focus:border-amber-500 placeholder:text-zinc-400/90 text-amber-900"
                      placeholder="或自定义其它装帧工艺 (如：裸线脊半真皮手工背缝)"
                      value={customBindingType}
                      onChange={(e) => setCustomBindingType(e.target.value)}
                    />
                  </div>

                  {/* Paper features and weights */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-sans text-[11px] font-bold text-zinc-700 block">纸张克重与纤维紧重感</label>
                      {customPaperPref && <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-bold">已自定义</span>}
                    </div>
                    <div className="flex bg-zinc-100 p-0.5 rounded-lg">
                      {[
                        { id: 'weight-52', name: '52gsm 极轻薄' },
                        { id: 'weight-80', name: '80gsm 国标硬' },
                        { id: 'weight-120', name: '120gsm 厚重画' }
                      ].map(pw => (
                        <button
                          key={pw.id}
                          type="button"
                          onClick={() => setPaperPref(pw.id)}
                          className={`flex-1 py-1 px-2.5 rounded-md font-sans text-[10.5px] font-bold transition-all ${
                            paperPref === pw.id && !customPaperPref ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500'
                          }`}
                        >
                          {pw.name}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#FCFAF5] border border-amber-200/55 rounded-xl py-1.5 px-3 font-sans text-[10.5px] focus:outline-none focus:border-amber-500 placeholder:text-zinc-400/90 text-amber-900"
                      placeholder="或自定义其它克重纤维材料 (如：160g 极密水彩画纸)"
                      value={customPaperPref}
                      onChange={(e) => setCustomPaperPref(e.target.value)}
                    />
                  </div>
                </div>

                {/* Reset button */}
                <div className="pt-2 border-t border-zinc-150 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 font-mono">ID: {activeSelectedType.toUpperCase().slice(0, 10)}-{activeDimension}</span>
                  <button
                    onClick={() => {
                      setSelectedType('daily');
                      setDimension('A5');
                      setLayoutFeature('timeline');
                      setBindingType('thread-sewn');
                      setPagePeriod('1day1page');
                      setScenario('efficiency');
                      setPaperPref('weight-80');
                      setCustomTitle('我的新构思手册计划');
                      
                      // Reset custom override text inputs
                      setCustomSelectedType('');
                      setCustomDimension('');
                      setCustomLayoutFeature('');
                      setCustomBindingType('');
                      setCustomPagePeriod('');
                      setCustomScenario('');
                      setCustomPaperPref('');
                      
                      // Reset manually edited recommendation cards
                      setHasEditedRecs(false);
                    }}
                    className="text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 font-sans text-xs font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>恢复工厂初始配方</span>
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM BLUEPRINT CANVAS & EXPLAINER */}
            <div className="w-full flex flex-col">
              
              {/* VIRTUAL LAYOUT LITE SKETCH BLUEPRINT (改成白色线稿) */}
              <div className="bg-white text-zinc-800 rounded-3xl p-6 shadow-xs border border-zinc-200 flex-1 flex flex-col justify-between space-y-6">
                
                {/* Structure blueprint header */}
                <div className="flex border-b border-zinc-150 pb-4 justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-sans font-extrabold text-[#111827] text-md">{customTitle}</h3>
                    <p className="font-sans text-xs text-zinc-500">
                      尺寸规格: <span className="font-bold text-zinc-800">{dimension} ({dimension === 'A5' ? '148x210 mm' : dimension === 'A6' ? '105x148 mm' : dimension === 'TN' ? '110x210 mm' : '标准型'})</span>
                    </p>
                  </div>
                </div>

                {/* THE MINI SKETCH WIREFRAME: Left page and Right page mockup */}
                <div className="bg-zinc-50/50 rounded-2xl p-6 border border-zinc-200 relative flex flex-col justify-between items-center flex-1">
                  
                  {/* Aspect Ratio bounding box wrapper based on dimensions */}
                  <div className={`w-full ${dimension === 'TN' ? 'aspect-[1.1]' : dimension === 'A6' ? 'aspect-[1.3]' : 'aspect-[1.4]'} bg-white border border-zinc-200/80 rounded-xl p-4 flex gap-3 relative shadow-xs transition-all duration-300`}>
                    
                    {/* HARDCOVER COVER UNDERLAY BACKING */}
                    {activeBindingType === 'hardcover' && (
                      <div className={`absolute -inset-2 border-[5px] ${
                        selectedType === 'daily' ? 'border-[#232426]' :
                        selectedType === 'weekly' ? 'border-[#1F3323]' :
                        selectedType === 'bullet' ? 'border-[#202E3D]' :
                        selectedType === 'travel' ? 'border-[#543F33]' :
                        selectedType === 'sketchbook' ? 'border-[#542129]' :
                        'border-[#43354C]'
                      } rounded-2xl pointer-events-none select-none z-0 shadow-lg`} />
                    )}

                    {/* Spine Folding Line indicator */}
                    <div className="absolute top-0 bottom-0 left-1/2 -ml-px border-l border-dashed border-zinc-350 z-20" />

                    {/* PHYSICAL BINDING RINGS/STITCHES OVERLAYS */}
                    {activeBindingType === 'loose-leaf' && (
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-2.5 z-30 flex flex-col justify-around py-4 pointer-events-none select-none h-full bg-transparent">
                        {[1, 2, 3, 4, 5, 6].map(idx => (
                          <div 
                            key={idx} 
                            className="w-5 h-2.5 bg-gradient-to-r from-zinc-300 via-white to-zinc-400 rounded-md border border-zinc-350 shadow-xs"
                          />
                        ))}
                      </div>
                    )}

                    {activeBindingType === 'spiral' && (
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-2.5 z-30 flex flex-col justify-between py-2 pointer-events-none select-none h-full bg-transparent">
                        {Array.from({ length: 24 }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className="w-5 h-1.5 bg-gradient-to-r from-zinc-400 via-zinc-150 to-zinc-500 rounded-full border border-zinc-300 shadow-2xs origin-center rotate-12" 
                          />
                        ))}
                      </div>
                    )}

                    {activeBindingType === 'thread-sewn' && (
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-px w-px z-30 flex flex-col justify-around py-4 pointer-events-none select-none h-full">
                        <div className="h-full border-l border-dashed border-amber-600/70" />
                      </div>
                    )}

                    {activeBindingType === 'saddle-stitch' && (
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-1 w-2 z-30 flex flex-col justify-around py-10 pointer-events-none select-none h-full">
                        <div className="w-1.5 h-4 bg-zinc-300 border border-zinc-400 rounded-sm shadow-2xs" />
                        <div className="w-1.5 h-4 bg-zinc-300 border border-zinc-400 rounded-sm shadow-2xs" />
                      </div>
                    )}

                    {activeBindingType === 'glue-bound' && (
                      <div className="absolute top-0 bottom-0 left-1/2 -ml-0.5 w-1 z-30 bg-neutral-200 border-x border-neutral-350 opacity-90 pointer-events-none" />
                    )}

                    {/* Outer margin guides */}
                    <div className="absolute inset-2 border border-zinc-200/10 pointer-events-none rounded"></div>

                    {/* PAGES CONTENT ENGINE WITH MOTION TRANSITION */}
                    <div className="flex-1 flex gap-3 relative overflow-hidden h-full z-10 bg-transparent rounded-lg">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSpread}
                          initial={{ opacity: 0, rotateY: 10, scale: 0.98 }}
                          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                          exit={{ opacity: 0, rotateY: -10, scale: 0.98 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="absolute inset-0 flex gap-3 bg-transparent h-full w-full"
                        >
                          {/* SPREAD PAGES ENGINE RENDERING */}
                          {currentSpread === 0 ? (
                            <>
                              {/* PAGE 1: EMPTY BACKING spacer (LEFT) - "封面的展示只需要右边的线框" */}
                              <div className="w-1/2 flex-1 bg-transparent opacity-0 pointer-events-none" />

                              {/* PAGE 2: INTERACTIVE CUSTOM COVER DESIGN (RIGHT) */}
                              <div className="w-1/2 flex-1 relative overflow-hidden bg-white rounded-lg border border-zinc-200/85 shadow-2xs z-20 group">
                                <input 
                                  type="file" 
                                  ref={coverInputRef} 
                                  onChange={handleCoverUpload} 
                                  accept="image/*" 
                                  className="hidden" 
                                />
                                
                                <div 
                                  onClick={() => coverInputRef?.current?.click()}
                                  className="absolute inset-0 p-4 rounded-lg flex flex-col justify-between shadow-inner transition-all duration-300 pointer-events-auto cursor-pointer"
                                >
                                  {uploadedCover ? (
                                    <>
                                      {/* Uploaded background image Cover cover-fill */}
                                      <div 
                                        className="absolute inset-0 bg-cover bg-center rounded-lg z-0" 
                                        style={{ backgroundImage: `url(${uploadedCover})` }} 
                                      />
                                      {/* High quality overlay styling for text readability */}
                                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent h-2/3 rounded-b-lg z-10 pointer-events-none" />
                                      
                                      <div className="space-y-1 pt-1 z-25 relative text-white">
                                        <span className="text-[7.5px] font-mono tracking-widest text-amber-400 font-extrabold uppercase block bg-white/10 w-fit px-1.5 py-0.5 rounded select-none">
                                          CUSTOM COVER
                                        </span>
                                        <h3 className="font-sans font-black text-[12px] text-zinc-100 leading-snug tracking-wide line-clamp-2 mt-1 drop-shadow-md">
                                          {customTitle}
                                        </h3>
                                      </div>

                                      <div className="z-25 relative text-zinc-300 pb-1 flex flex-col justify-end">
                                        <div className="border-t border-white/15 pt-2 flex justify-between items-center text-[7px] font-mono">
                                          <span>DIMENSION: {activeDimension}</span>
                                          <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-sm hover:bg-amber-500/30 font-sans">
                                            更换封面
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    // Default premium wireframe cover styles
                                    <div className="absolute inset-0 bg-zinc-50/15 group-hover:bg-zinc-100/30 transition-colors rounded-lg flex flex-col justify-between p-4">
                                      {/* Wireframe border */}
                                      <div className="absolute inset-2 border border-dashed border-zinc-200 rounded-md pointer-events-none group-hover:border-zinc-300 transition-colors"></div>
                                      <div className="absolute inset-2.5 border border-zinc-205/30 rounded-md pointer-events-none"></div>

                                      <div className="space-y-1.5 pt-1">
                                        <span className="text-[7.5px] font-mono tracking-widest text-zinc-400 font-extrabold uppercase block bg-zinc-100 w-fit px-1.5 py-0.5 rounded select-none">
                                          CLICK TO DESIGN
                                        </span>
                                        <h3 className="font-sans font-black text-[11px] text-zinc-800 leading-snug tracking-wide line-clamp-2 mt-1">
                                          {customTitle}
                                        </h3>
                                        <p className="text-[6px] font-mono text-zinc-450 uppercase tracking-widest leading-none select-none">
                                          {selectedType.toUpperCase()} ARCHITECTURE
                                        </p>
                                      </div>

                                      <div className="flex-grow flex flex-col items-center justify-center p-2 text-center select-none">
                                        <div className="w-8 h-8 rounded-full border border-dashed border-zinc-300 flex items-center justify-center bg-zinc-100/50 group-hover:bg-zinc-100 group-hover:scale-105 transition-all">
                                          <UploadCloud className="w-4 h-4 text-zinc-400 group-hover:text-zinc-650 transition-colors" />
                                        </div>
                                        <span className="text-[7px] font-sans font-black text-zinc-400 mt-2 block">
                                          点击上传自定义封面图片
                                        </span>
                                      </div>

                                      <div className="space-y-1 pt-1.5 border-t border-zinc-150 select-none text-zinc-500">
                                        <div className="flex justify-between items-center text-[7px]">
                                          <span className="font-sans">尺寸:</span>
                                          <span className="font-mono font-bold text-zinc-700">{activeDimension}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[7px]">
                                          <span className="font-sans">装帧:</span>
                                          <span className="font-bold text-zinc-700 truncate max-w-[80px]">
                                            {activeBindingType === 'thread-sewn' ? '锁线胶装' : 
                                             activeBindingType === 'loose-leaf' ? '活页装订' : 
                                             activeBindingType === 'spiral' ? '线圈装订' : 
                                             activeBindingType === 'saddle-stitch' ? '骑马钉' : 
                                             activeBindingType === 'hardcover' ? '精装本' : 
                                             activeBindingType === 'glue-bound' ? '纯胶装' : activeBindingType}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* PAGE 3 & PAGE 4: SYMMETRICAL INNER PAGES (LEFT & RIGHT) - "内页的左右保持一致" */}
                              {renderInnerPageContent(activeLayoutFeature, true)}
                              {renderInnerPageContent(activeLayoutFeature, false)}
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                  </div>
                  {/* PAGE NAVIGATION CONTROLS */}
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 px-2 select-none">
                    <button
                      type="button"
                      disabled={currentSpread === 0}
                      onClick={() => setCurrentSpread(prev => Math.max(prev - 1, 0))}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all border border-zinc-200 bg-white shadow-3xs text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>上一页</span>
                    </button>

                    {/* Page indicators */}
                    <div className="flex gap-2 text-center justify-center">
                      {[
                        { title: '手帐封面', desc: 'Cover Design' },
                        { title: '手帐内页', desc: 'Inner Spread' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentSpread(idx)}
                          className={`flex flex-col items-center px-4 py-1.5 rounded-xl transition-all border cursor-pointer ${
                            currentSpread === idx
                              ? 'bg-zinc-900 text-white border-zinc-900 font-bold shadow-xs'
                              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-500 border-zinc-205'
                          }`}
                        >
                          <span className="text-[9.5px] font-sans font-black">{item.title}</span>
                          <span className="text-[7px] font-mono opacity-80 mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={currentSpread === 1}
                      onClick={() => setCurrentSpread(prev => Math.min(prev + 1, 1))}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all border border-zinc-200 bg-white shadow-3xs text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>下一页</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* DYNAMIC COMPONENT SPEC SHEET (整个黑色的模块从封面中轴线移到了页面预览下方) */}
                <div className={`p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-stretch gap-6 relative overflow-hidden transition-all duration-350 shadow-inner select-none ${
                  selectedType === 'daily' ? 'bg-[#1E1F21] text-zinc-100' :
                  selectedType === 'weekly' ? 'bg-[#0F1E12] text-zinc-100' :
                  selectedType === 'bullet' ? 'bg-[#121A21] text-zinc-100' :
                  selectedType === 'travel' ? 'bg-[#3E281F] text-zinc-100' :
                  selectedType === 'sketchbook' ? 'bg-[#3E1119] text-zinc-100' :
                  'bg-[#2C1E34] text-zinc-100'
                }`}>
                  {/* Subtle debossed borders */}
                  <div className="absolute inset-2 border border-white/5 rounded-md pointer-events-none"></div>
                  <div className="absolute inset-2.5 border border-amber-500/10 rounded-md pointer-events-none"></div>

                  <div className="flex-1 space-y-2 z-10 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans font-black text-[14px] text-amber-50 leading-snug tracking-wide line-clamp-2 mt-1.55">
                        {customTitle}
                      </h3>
                      <p className="text-[6.5px] font-mono text-zinc-400 uppercase tracking-widest leading-none select-none mt-1">
                        {selectedType.toUpperCase()} JOURNAL SPECIFICATION
                      </p>
                    </div>
                  </div>

                  {/* Right side: Detailed Specs list */}
                  <div className="sm:w-64 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-5 flex flex-col justify-center space-y-1.5 z-10">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-zinc-400 font-sans">尺寸 AEST:</span>
                      <span className="font-mono font-bold text-amber-300">{activeDimension}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-zinc-400 font-sans">装帧 METHOD:</span>
                      <span className="font-sans font-bold text-amber-300 truncate max-w-[120px]">
                        {activeBindingType === 'thread-sewn' ? '锁线胶装' : 
                         activeBindingType === 'loose-leaf' ? '活页装订' : 
                         activeBindingType === 'spiral' ? '线圈装订' : 
                         activeBindingType === 'saddle-stitch' ? '骑马钉' : 
                         activeBindingType === 'hardcover' ? '精装本' : 
                         activeBindingType === 'glue-bound' ? '纯胶装' : activeBindingType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-zinc-400 font-sans">纸张 SPEC:</span>
                      <span className="font-sans font-bold text-amber-300 truncate max-w-[120px]">
                        {activePaperPref === 'weight-52' ? '52gsm 巴川纸' : 
                         activePaperPref === 'weight-80' ? '80gsm MD棉纸' : 
                         activePaperPref === 'weight-120' ? '120gsm 水彩纸' : activePaperPref}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* RECOMMENDATION ITEM DETAIL & EDIT MODAL (品牌与物理材料详述编辑) */}
      {isRecModalOpen && selectedRecItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left Column: Image preview & presets */}
            <div className="md:w-5/12 bg-zinc-50 border-r border-zinc-200 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
              <div>
                <span className="font-mono text-[9px] text-[#A1A1AA] uppercase tracking-widest font-black block mb-2">图片封面与视觉形象</span>
                <div className="aspect-[1.5] rounded-2xl bg-zinc-200 overflow-hidden relative border border-zinc-300 shadow-inner">
                  <img 
                    src={editRecImageUrl || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"}
                    alt={editRecName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
 
                {/* Image presets chips */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] text-zinc-400 font-bold block">快速选择封面素材图库:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "经典黑巴川", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
                      { name: "硬皮淡黄棉", url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80" },
                      { name: "棕套随行本", url: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80" },
                      { name: "马卡龙手帐", url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80" }
                    ].map(img => (
                      <button
                        key={img.name}
                        onClick={() => setEditRecImageUrl(img.url)}
                        className={`text-[10px] py-1.5 px-2.5 rounded-xl border text-left truncate transition-all ${
                          editRecImageUrl === img.url 
                            ? 'bg-zinc-900 border-zinc-900 text-white font-bold' 
                            : 'bg-white hover:bg-zinc-100 text-zinc-650 border-zinc-200'
                        }`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
 
              {/* Manual URL entry field */}
              <div className="space-y-1.5 pt-4 border-t border-zinc-200/65">
                <label className="text-[10px] text-zinc-500 font-bold block">自定义外部图片地址</label>
                <input 
                  type="text"
                  className="w-full bg-white border border-zinc-200 rounded-lg py-1.5 px-3 font-sans text-[11px] focus:outline-none focus:border-zinc-900 focus:bg-white text-zinc-700"
                  value={editRecImageUrl}
                  onChange={(e) => setEditRecImageUrl(e.target.value)}
                  placeholder="可贴入任意可展示的 https 格式图片路径"
                />
              </div>
            </div>
 
            {/* Right Column: Editable content form */}
            <div className="md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
              
              {/* Header */}
              <div className="border-b border-zinc-100 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="font-sans font-black text-base text-zinc-900">修改推荐方案与物理细部</h3>
                  <p className="font-sans text-xs text-zinc-400 mt-1">您在此处的所有修改都会应用到下面的产品比较图版中</p>
                </div>
                <button 
                  onClick={() => setIsRecModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-900 font-mono text-lg font-bold p-1 bg-zinc-100 hover:bg-zinc-200 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
 
              {/* Form container */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">1. 推荐方案/本册全称 Name</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all focus:ring-1 focus:ring-zinc-900"
                    value={editRecName}
                    onChange={(e) => setEditRecName(e.target.value)}
                  />
                </div>
 
                {/* Brand name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">2. 品牌/研发方 Brand</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all focus:ring-1 focus:ring-zinc-900"
                    value={editRecBrand}
                    onChange={(e) => setEditRecBrand(e.target.value)}
                  />
                </div>
 
                {/* Estimated Price */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">3. 预算指导价 Price</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all focus:ring-1 focus:ring-zinc-900"
                    value={editRecPrice}
                    onChange={(e) => setEditRecPrice(e.target.value)}
                  />
                </div>
 
                {/* Paper details */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">4. 纸张材料</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all focus:ring-1 focus:ring-zinc-900"
                    value={editRecPaper}
                    onChange={(e) => setEditRecPaper(e.target.value)}
                  />
                </div>
 
                {/* Binding method */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">5. 物理装订工艺</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all focus:ring-1 focus:ring-zinc-900"
                    value={editRecBinding}
                    onChange={(e) => setEditRecBinding(e.target.value)}
                  />
                </div>
 
                {/* Notes/Tips */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10.5px] font-extrabold text-[#D97706] select-none block">品牌帖士</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 font-sans text-xs focus:outline-none focus:border-zinc-900 focus:bg-white transition-all focus:ring-1 focus:ring-dashed focus:ring-amber-500 text-zinc-750 font-medium"
                    value={editRecNotes}
                    onChange={(e) => setEditRecNotes(e.target.value)}
                  />
                </div>
              </div>
 
              {/* Bottom buttons */}
              <div className="border-t border-zinc-100 pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    // Remove current item
                    setLocalRecs(prev => prev.filter(x => x.id !== selectedRecItem.id));
                    setHasEditedRecs(true);
                    setIsRecModalOpen(false);
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-700 transition-colors font-sans text-xs font-bold px-4 py-2.5 rounded-xl border border-red-200/50"
                >
                  删除此推荐册
                </button>
 
                <button
                  type="button"
                  onClick={() => {
                    // Save local edit state back to localRecs array
                    setLocalRecs(prev => prev.map(item => {
                      if (item.id === selectedRecItem.id) {
                        return {
                          ...item,
                          name: editRecName,
                          brandId: editRecBrand,
                          paperType: editRecPaper,
                          bindingMethod: editRecBinding,
                          price: editRecPrice,
                          notes: editRecNotes,
                          imageUrl: editRecImageUrl
                        };
                      }
                      return item;
                    }));
                    setHasEditedRecs(true);
                    setIsRecModalOpen(false);
                  }}
                  className="bg-zinc-900 hover:bg-zinc-950 text-white transition-all font-sans text-xs font-black px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md"
                >
                  保存修改并同步图表
                </button>
              </div>
 
            </div>
 
          </div>
        </div>
      )}

      {/* Hand Book Type Edit Modal */}
      {isTypeModalOpen && selectedTypeObj && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white border border-zinc-200 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <div className="flex justify-between items-center pb-3 border-b border-zinc-150">
              <div>
                <span className="font-mono text-[9px] text-amber-650 font-extrabold tracking-wider uppercase block">
                  SYSTEM SCHEMA SPEC
                </span>
                <h4 className="font-sans font-extrabold text-[#111827] text-md mt-0.5">
                  编辑手帐分类逻辑体系: {selectedTypeObj.name}
                </h4>
              </div>
              <button 
                onClick={() => setIsTypeModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full p-1.5 transition-colors text-sm w-8 h-8 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Type Chinese Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">体系分类中文名称</label>
                <input 
                  type="text"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3.5 font-sans text-xs focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-xs"
                  value={editTypeName}
                  onChange={(e) => setEditTypeName(e.target.value)}
                />
              </div>

              {/* Core Positioning / Usage */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">核心定位与生活应用</label>
                <input 
                  type="text"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3.5 font-sans text-xs focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-xs"
                  value={editTypeUsage}
                  onChange={(e) => setEditTypeUsage(e.target.value)}
                />
              </div>

              {/* Content Structure Science */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">内芯结构排线理学</label>
                <textarea 
                  rows={2}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3.5 font-sans text-xs focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-xs"
                  value={editTypeStructure}
                  onChange={(e) => setEditTypeStructure(e.target.value)}
                />
              </div>

              {/* Ideal Binding Recommendation */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">匹配工艺与物理装订配置</label>
                <input 
                  type="text"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3.5 font-sans text-xs focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-xs"
                  value={editTypeBinding}
                  onChange={(e) => setEditTypeBinding(e.target.value)}
                />
              </div>

              {/* Custom Dimension Size Option */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">自主限定开本尺寸等级</label>
                <input 
                  type="text"
                  placeholder="如: A5, B6, TN 尺寸 或 自定义 135x190mm"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3.5 font-sans text-xs focus:outline-none focus:border-zinc-400 focus:bg-white transition-all shadow-xs"
                  value={editTypeDimension}
                  onChange={(e) => setEditTypeDimension(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-zinc-150 pt-3 flex justify-between items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleDeleteType(selectedTypeObj.id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 font-sans text-xs font-bold rounded-xl transition-all border border-red-200/50"
              >
                删除卡片
              </button>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-sans text-xs font-bold rounded-xl transition-all"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveType}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-805 text-white font-sans text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
