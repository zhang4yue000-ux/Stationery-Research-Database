/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Brand, Product, Material, Craft, Binding, Size, Trend, Inspiration, Designer } from './types';

// Seed Brands Data
export const initialBrands: Brand[] = [
  {
    id: 'b-midori-tn',
    name: 'Traveler\'s Company',
    englishName: 'TRAVELER\'S COMPANY (MIDORI)',
    country: 'Japan',
    foundedYear: '2006',
    founder: 'Designphil Inc.',
    website: 'https://www.travelers-company.com',
    instagram: 'travelers_company',
    xiaohongshu: 'TRAVELER\'S COMPANY',
    marketTier: 'Premium',
    style: 'Vintage',
    brandStory: '原来是Midori旗下的产品线，后独立为主牌，专注于支持旅行者在日常与旅行中记录的皮质手帐。皮套产自泰国清迈，采用无化学染料、自然环保粗犷风的植鞣牛皮；手帐芯纸采用日本制MD高品质书写纸，高度模块化的配件可以自由拼装组合。在全球范围有着庞大拥趸。',
    representativeProducts: ['Traveler\'s Notebook (Standard)', 'Traveler\'s Notebook (Passport)', 'Brass Rollerball Pen'],
    competitors: ['b-hobonichi', 'b-moleskine'],
    notes: '核心在于“岁月的痕迹”。植鞣革用久了会产生独特的包浆和色泽变化，深受Vintage爱好者与旅行手帐党的狂热喜爱。',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    tags: ['皮套手账', '复古', '模块化', '旅行日志']
  },
  {
    id: 'b-hobonichi',
    name: 'ほぼ日',
    englishName: 'Hobonichi',
    country: 'Japan',
    foundedYear: '2001',
    founder: '糸井重里 (Shigesato Itoi)',
    website: 'https://www.1101.com/store/techo/pc/zh_CN/',
    instagram: 'hobonichi_techo_official',
    xiaohongshu: 'ほぼ日手帐官方',
    marketTier: 'Premium',
    style: 'Cute/Illustrative',
    brandStory: '“ほぼ日手帐”源于日本《每日ほぼ日刊新闻》。糸井重里希望打造一本“可以180度平摊，自由写下生活日常”的一日一页手帐本。它凭借巴川纸优秀的吸墨性与轻薄感，以及每年发布上百款与顶尖插画师（如松本大洋、幡野广志、Mina Perhonen）联名的精美手帐衣，一跃成为全球手帐文化的巅峰代名词。',
    representativeProducts: ['Hobonichi Techo Planner (A6)', 'Hobonichi Weeks', 'Hobonichi Cousin (A5)'],
    competitors: ['b-midori-tn', 'b-kokuyo'],
    notes: '核心竞争力在于每年更新的联名外衣库、轻巧到极致却坚韧不漏墨的巴川书写底纸。',
    imageUrl: 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&q=80&w=400',
    tags: ['一日一页', '插画联名', '巴川纸', '日用计划']
  },
  {
    id: 'b-md-paper',
    name: 'MD Paper',
    englishName: 'Midori MD Paper',
    country: 'Japan',
    foundedYear: '1960',
    founder: 'Designphil Inc.',
    website: 'https://www.midori-japan.co.jp/md/',
    instagram: 'midori_designphil',
    xiaohongshu: 'MIDORI国誉日本',
    marketTier: 'Mid-range',
    style: 'Minimalist',
    brandStory: 'Midori于1960年代自主研发的MD书写纸。为纪念其卓越品质，推出了全裸书脊装帧的“MD Notebook”系列。去除了所有冗余的设计装饰，只保留蜡油纸包裹和一根书签带，让纸张本身回归书写的原点。阻尼感偏温暖沙沙声，深受书法、速写与纯粹书写爱好者的膜拜。',
    representativeProducts: ['MD Notebook A5 (Grid)', 'MD Notebook Cotton', 'MD Paper Pad'],
    competitors: ['b-moleskine', 'b-rhodia'],
    notes: '平面设计史上极有标杆意义的“简素主义”设计。裸脊可以完全呈180°铺平，是本册产品结构设计的范本。',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
    tags: ['极简书写', '裸脊装订', '沙沙阻尼', '本册本白']
  },
  {
    id: 'b-rhodia',
    name: 'Rhodia',
    englishName: 'Rhodia',
    country: 'France',
    foundedYear: '1934',
    founder: 'Henri Verilhac & Robert Verilhac',
    website: 'https://www.bloc-rhodia.com',
    instagram: 'rhodia_officiel',
    xiaohongshu: 'Rhodia罗地亚',
    marketTier: 'Mid-range',
    style: 'Minimalist',
    brandStory: '诞生于浪漫的法国里昂，标志性的经典“橙黑配色”与双冷杉LOGO在世界范围极具辨识度。最初作为纸厂，其发明的“翻折本”采用钉装顶部、卡纸背面高频裁切点线（Micro-perforated）结构，纸质顺滑无比，不仅是手绘建筑师、交互设计师草图板的御用，也是无数欧美名作家与设计师的灵感集散地。',
    representativeProducts: ['Rhodia Block No.11', 'Rhodia Webnotebook', 'Rhodia Rhodiarama'],
    competitors: ['b-md-paper', 'b-moleskine'],
    notes: '高频切割点线几乎是快撕草皮本技术里的皇冠，撕口极其平整。使用80gsm紫标滑面 Clairefontaine 纸张。',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=400',
    tags: ['点阵快撕', '橙黑经典', '顺滑防洇', '专业草图']
  },
  {
    id: 'b-kokuyo',
    name: 'Kokuyo',
    englishName: 'KOKUYO',
    country: 'Japan',
    foundedYear: '1905',
    founder: '黑田善太郎',
    website: 'https://www.kokuyo.co.jp',
    instagram: 'kokuyo_st',
    xiaohongshu: '国誉文具官方',
    marketTier: 'Mid-range',
    style: 'Industrial',
    brandStory: '日本百年国民级综合文具巨头。起步于账簿封面制作，后推出红遍全日中小学的“Campus 笔记本”系列，总共售出超过30亿册。kokuyo极其重视工程美学与无障碍设计，长期举办“国誉设计奖（KOKUYO DESIGN AWARD）”，把无数优秀的设计师概念转化为了量产级的神作（如：角角擦、两折无脊裁线本）。',
    representativeProducts: ['Campus Smart Ring Binder', 'Perpanep Notebook', 'Jibun Techo'],
    competitors: ['b-hobonichi', 'b-md-paper'],
    notes: '将工业设计与文具制造逻辑研究得最透彻的品牌之一，针对左撇子、弱光环境等皆有专业本册。',
    imageUrl: 'https://images.unsplash.com/photo-1606166325012-7da4a091172c?auto=format&fit=crop&q=80&w=400',
    tags: ['功能主义', 'Campus', '活页新研', '工业人机']
  },
  {
    id: 'b-notefor',
    name: 'Note for',
    englishName: 'Note for',
    country: 'China',
    foundedYear: '2016',
    founder: '国内青年独立设计师群',
    website: 'https://notefor.taobao.com',
    instagram: 'notefor_stationery',
    xiaohongshu: 'notefor手帐工作室',
    marketTier: 'Budget',
    style: 'Cute/Illustrative',
    brandStory: '中国本土原创文具手帐新锐先锋品牌。从独立插画印制开始，Note for 致力于将高水准插画以平易近人的性价比带给国内手帐、文创受众。品牌本册多采用双胶纸、重磅艺术卡封面配烫金，兼顾本册的收纳功能。以各种具有设计温度的主题风（如：森系计划、时光重读）引领国产原创手帐新潮流。',
    representativeProducts: ['「一日一页·云霓」插画本', '「盐系格纹」旅行记录夹', '手帐装饰拼贴胶带'],
    competitors: ['b-md-paper', 'b-kokuyo'],
    notes: '国潮文创浪潮的核心代表之一，工艺成本控制到极高水准下的极高性价比产物，适合入门级日常手帐。',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    tags: ['国潮先锋', '高性价比', '插画设计', '自制模切']
  }
];

// Seed Products Data
export const initialProducts: Product[] = [
  {
    id: 'p-tn-std',
    brandId: 'b-midori-tn',
    name: '旅行者笔记本 (标准型 Traveler\'s Notebook Standard)',
    releaseDate: '2006-03',
    category: 'Notebook',
    dimensions: '220 x 120 mm (外皮); 210 x 110 mm (内芯)',
    sizeId: 's-tn-std',
    pageCount: 64,
    paperType: 'MD 纸本白 (Midori MD Paper Cream)',
    materialIds: ['m-v-leather', 'm-md-paper'],
    bindingMethod: '皮橡皮筋穿孔弹力绳固定，内芯采用骑马钉缝线',
    bindingId: 'bind-saddle',
    craftIds: ['cr-deboss'],
    price: '¥368.00',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.travelers-company.com/products/trnote',
    purchaseUrl: 'https://travelers-company.taobao.com',
    tags: ['复古皮套', '插页设计', '高度定制', '收藏级'],
    notes: '清迈手工植鞣牛皮，无任何修面的痕迹，出汗或者摩擦留下的擦痕会赋予它生命。支持内芯用绑带多合一扩容。',
    favorited: true,
    designStyle: '复古风',
    productFunction: '自由记录'
  },
  {
    id: 'p-hobo-planner-a6',
    brandId: 'b-hobonichi',
    name: 'Hobonichi 一日一页英文黑皮日历手帐 Planner A6',
    releaseDate: '2013',
    category: 'Planner',
    dimensions: '148 x 105 mm',
    sizeId: 's-a6',
    pageCount: 448,
    paperType: '日本新巴川纸 (Sanzen Tomoe River Paper 52gsm)',
    materialIds: ['m-tomoe-river', 'm-bookcloth'],
    bindingMethod: '穿线式锁线胶装 (180°完全平摊结构)',
    bindingId: 'bind-smyth',
    craftIds: ['cr-foil-stamp', 'cr-pantone'],
    price: '¥220.00',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.1101.com/store/techo/en/planner/',
    purchaseUrl: 'https://hobonichi.tmall.com',
    tags: ['一日一页', '手帐衣搭配', '防洇轻量', '全平摊'],
    notes: '手帐史上的黄金里程碑。内页布局为全英文，由著名设计师奥山清行进行字体、排版艺术指导。红本黑壳封，质感无敌。',
    favorited: true,
    designStyle: '文艺风',
    productFunction: '生活记录与复盘'
  },
  {
    id: 'p-md-notebook-a5-grid',
    brandId: 'b-md-paper',
    name: 'MD Notebook A5 方格笔记本',
    releaseDate: '2008',
    category: 'Notebook',
    dimensions: '210 x 148 mm',
    sizeId: 's-a5',
    pageCount: 176,
    paperType: 'MD 纸本白 80gsm (MD Paper Cream)',
    materialIds: ['m-md-paper'],
    bindingMethod: '传统线装裸脊 (Cheese Cloth Mesh Back Cover)',
    bindingId: 'bind-openspine',
    craftIds: ['cr-deboss'],
    price: '¥68.00',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.midori-japan.co.jp/md/products/mdnote/',
    purchaseUrl: 'https://detail.tmall.com',
    tags: ['纯文字速写', '网格控', '质朴留白', '无修饰'],
    notes: '不采用任何封面，仅在坚固书脊的缝线网纱部分加固。自带附赠极简主义索引贴。极其平坦，没有任何咯手的段差。',
    favorited: false,
    designStyle: '极简风',
    productFunction: '自由记录'
  },
  {
    id: 'p-perpanep-a5',
    brandId: 'b-kokuyo',
    name: 'Perpanep A5 纸笔协同方格本 (TSURU 面)',
    releaseDate: '2021-04',
    category: 'Notebook',
    dimensions: '210 x 148 mm',
    sizeId: 's-a5',
    pageCount: 120,
    paperType: '日本制国誉特制高级原纸 TSURU (超滑面)',
    materialIds: ['m-md-paper'],
    bindingMethod: '无脊硬卡热压锁线装 (Flat Flat Binding)',
    bindingId: 'bind-smyth',
    craftIds: ['cr-spotuv', 'cr-deboss'],
    price: '¥55.00',
    imageUrl: 'https://images.unsplash.com/photo-1606166325012-7da4a091172c?auto=format&fit=crop&q=80&w=400',
    websiteUrl: 'https://www.kokuyo-st.co.jp/stationery/perpanep/',
    purchaseUrl: 'https://kokuyo.tmall.com',
    tags: ['纸笔协同', '钢笔专用', '顺滑防透', '极简灰色'],
    notes: 'Perpanep系列强调“纸”与“笔”的灵魂契合。TSURU采用极其顺滑的滑度涂布，写钢笔几乎零阻尼，极其畅快。',
    favorited: false,
    designStyle: '现代商务风',
    productFunction: '目标与项目追踪'
  }
];

// Seed Materials Data
export const initialMaterials: Material[] = [
  {
    id: 'm-tomoe-river',
    name: '巴川纸 (Sanzen Tomoe River Paper)',
    category: 'Paper',
    origin: 'Japan',
    features: '• 52gsm/68gsm超轻量：即使400页本册，厚度也不到1.5cm\n• 水彩与钢笔圣物：完全不透不洇墨，极易析出墨水高光(Sheen)与渐变(Shading)\n• 触感细沙般温润、书写纸沙沙响但阻尼顺滑。',
    suitableScenario: '手帐一日一页笔记本、重磅墨水评测本、极致轻量便携日程本。',
    representativeBrands: ['ほぼ日 Hobonichi', '国誉 Peri-Perpanep'],
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=400',
    tags: ['神速干', '轻薄防透', 'Sheen神器', '日本造'],
    notes: '旧巴川制纸厂已于2021年关闭改组，现由三善纸业(Sanzen Paper)继承其工艺配方，推出了三善巴川纸，克数、吸水量略有优化。'
  },
  {
    id: 'm-md-paper',
    name: 'MD 书写纸 (MD Paper Cream)',
    category: 'Paper',
    origin: 'Japan (Designphil)',
    features: '• 具有独特的奶黄色(温暖、不刺眼、利眼)\n• 表面带有恰到好处的天然植物微阻尼纤维(即“沙沙声阻尼感”)\n• 克数多为80-90gsm，吸墨和耐磨损性达到工程级优越。',
    suitableScenario: '极简日常手稿、素描绘画、钢笔硬笔书法、网格构思。',
    representativeBrands: ['MD Paper', 'TRAVELER\'S COMPANY'],
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    tags: ['阻尼书写', '不反光奶黄', '中性无酸', '百年原纸'],
    notes: '于1960年诞生迄今无调整配方，除了提供普通纸款，还额外开发了棉纤维纸 MD Notebook Cotton，加入了20%棉纤维。'
  },
  {
    id: 'm-v-leather',
    name: '原色植鞣牛皮 (Vegetable-Tanned Cow Leather)',
    category: 'Leather',
    origin: 'Thailand (Chiang Mai)',
    features: '• 使用植物丹宁酸浸泡，不含化学染色重金属\n• 具有强烈的原始天然肌理、干爽的触感以及诱人的天然香气\n• 随使用时间，皮革中的油脂、日光和汗水赋予其深古铜色包浆。',
    suitableScenario: '收藏级本册封皮、坚固的耐久工具袋、战术风外封。',
    representativeBrands: ['TRAVELER\'S COMPANY'],
    imageUrl: 'https://images.unsplash.com/photo-1524386361292-7b0cf5d49a0c?auto=format&fit=crop&q=80&w=400',
    tags: ['岁月痕迹', '自然植鞣', '越用越亮', '坚硬防损'],
    notes: '每一块TN皮革在清迈都采用传统单张手工裁切，厚度一般在2.5-3mm，几乎能陪伴设计师终身。'
  },
  {
    id: 'm-bookcloth',
    name: '重磅亚麻装帧布 (Heavy Linen Book Cloth)',
    category: 'Book Cloth',
    origin: 'Europe / China',
    features: '• 精织棉麻复合背胶纸制成，纹理凹凸鲜明\n• 耐磨性高、抗刮擦、上色牢固\n• 极其优雅的温情触感，散发浓郁的书卷气。',
    suitableScenario: '精装硬封本本册、高端书籍书套、礼盒外封。',
    representativeBrands: ['ほぼ日 Hobonichi', 'Rhodia Webnote'],
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=400',
    tags: ['编织纹理', '坚固硬封', '经典装帧', '雅致手感'],
    notes: '印刷行业内名贵包装材料，一般支持进行直接热压无色凹痕、或配合高硬度重金属模版进行冷热烫金，成品古典高雅。'
  }
];

// Seed Crafts Data
export const initialCrafts: Craft[] = [
  {
    id: 'cr-foil-stamp',
    name: '精密温度烫金/烫银 (Hot Foil Stamping)',
    definition: '利用金属凸版或者雕刻印版，将特定的电化铝箔（Foil）通过高温(如110℃-150℃)和精准压紧力，粘附转印到纸张或皮革封面的成型工艺。',
    prosAndCons: '优点：金属光泽极其耀眼耀夺，极具质感和三维浮雕立体感。\n缺点：模版雕刻及调校成本昂贵，受纸张纹理粗细影响，极细线条易出现糊边缺损。',
    costLevel: 'Medium',
    typicalApplications: '书籍封皮经典烫金标题、手账边框烫金属亮铜条、高逼格LOGO印刷。',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    notes: '若在厚纸板上结合“烫金一体击凹”，则能同时实现金属闪耀与下陷质感，是封面设计的杀手锏工艺。'
  },
  {
    id: 'cr-deboss',
    name: '冷/热压凹印工艺',
    definition: '通过高压（不附加任何印刷墨水和金属膜箔）直接用模具压按纸面或皮革。利用皮革的皮纤维延展性或书写纸的微松厚度，留下极其自然的凹槽和阴影。',
    prosAndCons: '优点：视觉极端内敛、高级低调；手抚摸感觉凹凸美妙、永不褪色。\n缺点：只适合偏厚或纤维丰富的材料(如植鞣、棉卡纸)；纸太薄(如52g巴川)不明显、无法反面着力。',
    costLevel: 'Low',
    typicalApplications: 'MD Notebook 封面上的隐形小LOGO标志、TN皮夹封皮的皮纹印花。',
    imageUrl: 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&q=80&w=400',
    notes: '在120g以上的棉纸或厚重植鞣革上使用冷压凹工艺，其自然的物理暗影在暖色展光下能产生无与伦比的设计舒适度。'
  },
  {
    id: 'cr-spotuv',
    name: '局部UV光油工艺',
    definition: '在完成普通哑色覆膜印刷后，利用紫外线固化光油（UV Varnish），在封面的某些图案字样或特定质感（如雨滴、水波、特殊纹理）处堆积一层亮泽丰润的透明膜。',
    prosAndCons: '优点：明暗反差强烈；视觉在亚光与反光间来回横跳，质感极富现代交互张力。\n缺点：固化油容易在反复曲折弯叠的手帐脊、折角处引发折痕断裂开胶。',
    costLevel: 'Medium',
    typicalApplications: '国誉Perpanep系列封面极浅灰色几何网格、数码手帐闪光图形点缀。',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=400',
    notes: '用局部微堆起凸UV（3D UV）能在哑光特种卡纸上实现神级盲文，或模拟雨滴落在牛皮纸上的微动态。'
  },
  {
    id: 'cr-pantone',
    name: '专色印刷',
    definition: '不使用CMYK四色网点混合网点，而是调配好特定Pantone编号的专门预定无水混色单重油墨。直接均匀大面积压印纸张，达到发色百分百纯正饱满、无丝毫网沙杂质的印刷表现。',
    prosAndCons: '优点：色彩极度精准，杜绝一切偏色杂网；大色块一铺到底、平滑至极。\n缺点：多印一个拼色，就需要多制一个专有印版，清洗墨槽及机器人工开机费高昂。',
    costLevel: 'High',
    typicalApplications: 'Hobonichi Planner 内部精美的每日红色星期天字符、小清新本册高饱和小盐系马卡龙纯大色快底色。',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400',
    notes: '由于巴川纸和MD纸底色偏米乳色，其天然本白偏暖会削弱亮冷蓝色调。设计前期必须打样品专色去抵充米色底所产生的光学衍射偏黄。'
  }
];

// Seed Bindings Data
export const initialBindings: Binding[] = [
  {
    id: 'bind-smyth',
    name: '线装穿锁线胶装',
    structure: '将书页按16页或32页一叠划分为签名(Signature)折页叠；用高拉力丝光穿线机穿针引线交叉缝制把所有签名锁合在一起，在脊背部刮抹热熔树脂软胶，贴衬防沙纱布。',
    prosAndCons: '优点：能够跨越中间完全180度平整展开，绝对无咯手断段，寿命极其持久，不掉页。\n缺点：厚度极大的时候中间会有微弱缝纫微针孔显露；书帖折页和线缝成本偏高。',
    suitableScenario: '一日一页手账、厚重插图绘画本、大像素草图本、MD Notebook。',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
    notes: '几乎是当今高端手账本极具信仰度的必备标配级装订艺术。'
  },
  {
    id: 'bind-openspine',
    name: '裸脊锁线装帧',
    structure: '锁线胶装的特殊进化态，把刮抹软胶和贴背加固白纱的过程转变成了带有强力造型和色彩的彩线（红、白、金）缝线外露，不另外加裱贴普通书脊硬外套。',
    prosAndCons: '优点：能达成空前未有的裸视结构美、骨感艺术力；比普通锁线展开性能更自由无拘束，毫无回弹力。\n缺点：由于脊部完全赤裸裸没有保护，极易沾灰、受潮开线、若彩线不结实极易导致大裂缝。',
    suitableScenario: '手造艺术家速写本、无修饰留白本、Midori MD 纪念版。',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    notes: '由于脊部直接呈现多层签名折线结构，设计师一般专门在第一签名折页使用高纯Pantone拼贴纸，让侧边展现迷人的色带跳跃。'
  },
  {
    id: 'bind-saddle',
    name: '马鞍/骑马钉装',
    structure: '将本子中间直接置于骑马跨架折线之上，直接用2枚或3枚特殊防刮伤金属钉针穿入折线处向内合并扣死固封。',
    prosAndCons: '优点：成本低廉，出货速度狂暴快捷；纸厚度低时可以很好平躺。\n缺点：只适合低页数便携本(48p以内)。太厚则中间多叠会导致裁口不齐(爬移爬阶)、久用金属锈蚀烂纸。',
    suitableScenario: '口袋小护照本、旅行插页分册芯、速记日志分册。',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=400',
    notes: '为了提升骑马钉寿命，中高端品牌（如Rhodia）的马鞍钉部分通常使用不锈钢镀镍合金，边缘裁切进行重击打磨防止钩挂高级包里衬。'
  }
];

// Seed Sizes Data
export const initialSizes: Size[] = [
  {
    id: 's-a5',
    name: 'A5 (标准本册尺寸)',
    dimensions: '148 x 210 mm',
    aspectRatio: '1 : 1.414 (白银分割比例)',
    suitableScenario: '每日手稿、会议全记录、桌面插图绘制、Cousin尺寸。',
    typicalProducts: 'Hobonichi Cousin, MD Notebook A5, Kokuyo Campus A5',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's-a6',
    name: 'A6 (文库本尺寸 Pocket)',
    dimensions: '105 x 148 mm',
    aspectRatio: '1 : 1.414 (标准黄金对折比例)',
    suitableScenario: '单手持握高频随记、口袋日常计划日志、文库故事载体书。',
    typicalProducts: 'Hobonichi Techo Planner A6, MD Notebook A6, 国誉Campus Smart Ring Pocket',
    imageUrl: 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's-tn-std',
    name: 'TN Standard (窄版黄金流浪尺寸)',
    dimensions: '110 x 210 mm',
    aspectRatio: '接近 1 : 1.9 (高瘦挺拔感)',
    suitableScenario: '放入各种飞机票根、一维导览纸折幅、手绘旅途建筑速写。',
    typicalProducts: 'Traveler\'s Notebook Standard Refills',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 's-tn-passport',
    name: 'TN Passport (护照对齐装便携版)',
    dimensions: '89 x 124 mm',
    aspectRatio: '1 : 1.4 (契合标准海关护照)',
    suitableScenario: '单衣口袋随身、超强登机快速随笔、卡片零钱折叠夹合体。',
    typicalProducts: 'Traveler\'s Notebook Passport Mini Refills',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=400'
  }
];

// Seed Trends Data
export const initialTrends: Trend[] = [
  {
    id: 'tr-modular',
    year: '2025',
    title: '手帐模块化系统化自由定义生态',
    keywords: ['多芯插拔', '磁流卡扣', '收纳一体', '无限外挂'],
    description: '现代人计划和书写的载体正在呈现破碎化状态，因此“单一本子管一年”的需求在裂解。用户希望工作格网本、生活草图本、记账账簿和日历大表可以随意地用一个高弹性搭扣或磁引夹进行快速模块化换合。',
    caseBrands: ['TRAVELER\'S COMPANY (TN插页组件)', 'Lamy & 几乎日复合计划架也正在涉足'],
    referenceLink: 'https://www.travelers-factory.com',
    notes: '给设计师的启示：未来设计本册不是设计孤立封面，而是设计一套完整的1+N卡扣与功能拼合槽体系。'
  },
  {
    id: 'tr-colors',
    year: '2024',
    title: '高阻尼灰色系与天然植物低饱和小盐调',
    keywords: ['莫兰迪色', '植物纤维染', '低反差纸面', '眼部零压力'],
    description: '极度洁白（加有荧光增白剂）的笔记本纸张正因刺激眼睛、冰冷感被主流年轻一代手帐圈边缘化。带有些许草浆碎、茶枯杂质点线以及奶黄色、莫兰迪色特种卡封面正成为中高端手帐设计的主旋律。纸不只用来印刷，更是大自然的微波抚摸。',
    caseBrands: ['MD Notebook Cotton', '国誉 Peri-Perpanep', 'Note For 的「时光信柬」'],
    referenceLink: 'https://www.midori-japan.co.jp',
    notes: '设计启发：选用未漂白的温质艺术纸，不要追求耀眼白度，依靠不透明度以及纤维纹路本身建立产品独特格调。'
  },
  {
    id: 'tr-minimalism',
    year: '2026',
    title: '无印刷多功能裸纸本 (The Raw Notebook Revolution)',
    keywords: ['全留白', '无边界格式', '热压盲雕封面', '去多余包装'],
    description: '重度文创人群的书写习惯发生了从“死守格子”向“随意发散思维”的跃迁。这促使大量品牌推出极细点阵(如0.3mm)、隐形UV浅灰格，甚至是完全无条线格子的无印刷纯粹白本。这类产品注重通过烫印隐蔽微凹槽建立产品边缘指代感，极其高冷和具有设计师品味。',
    caseBrands: ['Midori MD Notebook 新纪元', 'Rhodia Blend Pad', '南韩 indie stationery 品牌 Analog Keeper'],
    referenceLink: 'https://analogkeeper.com',
    notes: '设计启发：弱化版心线条的颜色深度，设计不干扰书写的隐藏式骨架格布局。'
  }
];

// Seed Inspirations Data
export const initialInspirations: Inspiration[] = [
  {
    id: 'ins-suntory-packaging',
    title: '三得利「伊右卫门」绿茶竹节起伏压纹标签工艺分析',
    source: '日本食品包装工业设计 2023 展览会',
    category: 'Packaging',
    keywords: ['竹节肌理', '触感材质', '无彩色雕花', '日式和风'],
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    designAnalysis: '虽然是批量塑料包装，但三得利通过精密拉模工艺，在PET标签薄塑料膜表面创造了类似古法毛竹表皮的竹节多段凸起压纹（凹凸触感极为逼真），手指持握时具有沙沙回弹力。',
    stationeryLessons: '本册设计师在设计「森林系」或「自然工学」书衣时，可以用同样的哑光光油局部堆起UV工艺来印刷封面的树叶脉络或竹简切层，实现让指尖瞬间入静入定的大脑抚摩快感。',
    notes: '包装跨领域借鉴，工艺比单纯平面烫印上色高明、灵动十倍。'
  },
  {
    id: 'ins-brutalist-museum',
    title: '安藤忠雄「成羽美术馆」清水混凝土拼合微接缝对齐美学',
    source: '建筑摄影与空间肌理积累',
    category: 'Architecture',
    keywords: ['清水混凝土', '1:1.414段差', '精密对齐缝', '粗糙质感'],
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=400',
    designAnalysis: '安藤忠雄依靠极度苛刻的水泥现浇浇灌拉索螺钉孔对位，让混凝土面板的拼缝处形成一条高精度2mm内深0.8mm的黑影阴阳缝。水泥那种细腻沙面却坚实如风的工业硬派感被这条工整极简格线完美升华。',
    stationeryLessons: '对于工业战术风或者科技未来风手账的拼缝、双层封套折折边，不应多加明缝车线。而是可以通过热熔折折边，流露类似清水混凝土接缝的纯物理内嵌槽。这种隐藏性边界是高水平平面极简美学的灵魂体现。',
    notes: '建筑中对骨架、秩序、对线的研究，可以直接移植为内芯表格0.25pt浅灰色细线排布的数学公式。'
  }
];

// Seed Designers Data
export const initialDesigners: Designer[] = [
  {
    id: 'des-taku-satoh',
    name: '佐藤卓 (Taku Satoh)',
    country: 'Japan',
    profile: '日本中生代最具洞察力的平面设计巨匠、艺术指导、21_21 DESIGN SIGHT 馆长。佐藤卓擅长以“纯水般的溶入法”做设计。经典作包括明治牛奶包装、乐天口香糖，以及代表日本文具设计最高美学高度的：1960年国誉 Campus 三代纪念本整合设计、MD Notebook 20周年经典白色套系设计指导。',
    representativeWorks: ['明治美味牛奶包装设计', 'MD Notebook 十周年企划「简素」版主导', 'ISSEY MIYAKE PLEATS PLEASE 视觉包装'],
    designStyle: '融于自然、不着痕迹、极致的版骨对位、细节微米雕刻。',
    cooperatedBrands: ['MD Paper (Midori)', 'KOKUYO', 'Issey Miyake'],
    website: 'https://www.tsdo.jp',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    notes: '佐藤卓有一句名言：“设计不是创造一个精美的异物，而是调整水与杯子的相处形态。”这在文具极简本册本白度设计、脊背白纱贴糊的设计上有极其透彻的践行。'
  }
];

// Functions for managing LocalStorage state seamlessly
export function getSavedData<T>(key: string, backup: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as T[];
    }
  } catch (e) {
    console.error(`Error loading data from localStorage for ${key}`, e);
  }
  return backup;
}

export function saveData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving data to localStorage for ${key}`, e);
  }
}
