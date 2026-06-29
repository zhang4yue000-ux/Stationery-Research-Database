/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required and missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Global state / helper placeholder for fallback mock generation when API key is missing
function generateFallbackData(category: string, name: string) {
  const normalized = name.trim();
  if (category === 'brand') {
    return {
      name: normalized,
      englishName: normalized.toUpperCase(),
      country: 'Japan/Europe',
      foundedYear: '2015',
      founder: 'Independent Designer',
      website: 'https://example.com',
      instagram: normalized.toLowerCase().replace(/\s+/g, '_'),
      xiaohongshu: normalized + '手帐工作室',
      marketTier: 'Premium',
      style: 'Minimalist',
      brandStory: `这是关于 ${normalized} 的一段品牌故事。 ${normalized} 致力于研究纸制产品及其与硬笔书写之间的化学纽带反应。提倡质朴环保生活，融合当代美学。`,
      representativeProducts: [`${normalized} 经典手帐`, `${normalized} 羊皮套`],
      competitors: ['b-md-paper', 'b-midori-tn'],
      notes: '此卡片由本地模拟生成，如需精确分析可以配置 GEMINI_API_KEY。',
      tags: ['手帐新品', '设计师主导', '纸品探究']
    };
  } else if (category === 'product') {
    return {
      name: normalized,
      brandId: 'b-md-paper',
      releaseDate: '2026-01',
      category: 'Notebook',
      dimensions: '148 x 210 mm',
      pageCount: 160,
      paperType: '80gsm 原生本白特种纸',
      bindingMethod: '传统线装锁线胶装',
      price: '¥88.00',
      tags: ['新品研制', '钢笔契合', '双面防印'],
      notes: '此产品由本地模拟生成。',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400'
    };
  } else if (category === 'material') {
    return {
      name: normalized,
      category: 'Paper',
      origin: 'Germany/Japan',
      features: '• 墨水附着力强\n• 纸性温和沙沙微阻尼\n• 不洇墨，背面完全不晕染',
      suitableScenario: '手帐计划、精细钢笔速记',
      representativeBrands: ['MD Paper', 'Traveler\'s Company'],
      tags: ['特种纸张', '极致触感', '纤维挺括'],
      notes: '此材料卡片由本地模拟生成。'
    };
  } else {
    return {
      name: normalized,
      definition: `${normalized} 是一种高端文创设计制本中广泛使用的精湛工艺艺术。`,
      prosAndCons: '优点：极具三维立体触感，光泽优雅。\n缺点：开模及测试成本较高，需专业工艺配合。',
      costLevel: 'Medium',
      typicalApplications: '手帐硬壳封套，书籍精装外封面LOGO叠印',
      notes: '此工艺由本地模拟生成。'
    };
  }
}

// 1. API Route to Generate Profile with Gemini
app.post('/api/generate-profile', async (req, res) => {
  const { category, name, brandContext } = req.body;

  if (!name || !category) {
    res.status(400).json({ error: 'Missing name or category parameters' });
    return;
  }

  try {
    const ai = getAI();
    let prompt = '';
    let responseSchema: any = {};

    if (category === 'brand') {
      prompt = `你是一位顶尖的文具、手账、纸品行业研究专家和平面设计师。请根据品牌名称「${name}」生成一份专业的、高保真的品牌研究档案。
请确保数据真实、详细，贴合文创设计师的视角、深度并返回为 JSON。如果是著名的老品牌，请根据真实历史和定位回答；若是新品牌或小众创意品牌，请给予专业且符合其调性的分析和生成。`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: '品牌正式名称，如: Traveler\'s Company' },
          englishName: { type: Type.STRING, description: '品牌英文名，大写或混合' },
          country: { type: Type.STRING, description: '品牌归属国家、产地、城市，如: Japan' },
          foundedYear: { type: Type.STRING, description: '创建时间，如: 2006' },
          founder: { type: Type.STRING, description: '创始团队或设计师姓名' },
          website: { type: Type.STRING, description: '真实官网或参考网站链接，可为 example.com' },
          instagram: { type: Type.STRING, description: 'Instagram 账号名（无@前缀）' },
          xiaohongshu: { type: Type.STRING, description: '小红书账号名称' },
          marketTier: { type: Type.STRING, description: '市场档次：必须在 "Premium"、"Mid-range"、"Budget" 中三选一' },
          style: { type: Type.STRING, description: '设计美学风格：必须在 "Minimalist"、"Vintage"、"Cute/Illustrative"、"Industrial"、"Eco-Green"、"Traditional" 中六选一' },
          brandStory: { type: Type.STRING, description: '写一段200字以上的深度品牌美学故事，强调其对纸、皮革、工艺、手感或便携性的追求。' },
          representativeProducts: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: '三个著名的代表性本册/文具，如: ["Traveler\'s Notebook Standard", "Brass Pen"]' 
          },
          competitors: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: '两到三个主要的竞品品牌ID或名称' 
          },
          notes: { type: Type.STRING, description: '给平面设计师的核心建议、工艺借鉴价值、纸张阻尼、包装工艺启发等备注。' },
          tags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: '三个设计研究标签，如: ["极简主义", "天然植鞣革", "模块化"]' 
          }
        },
        required: [
          'name', 'englishName', 'country', 'foundedYear', 'founder', 
          'website', 'instagram', 'xiaohongshu', 'marketTier', 'style', 
          'brandStory', 'representativeProducts', 'competitors', 'notes', 'tags'
        ]
      };
    } else if (category === 'product') {
      prompt = `你是一位顶尖的文具产品经理和制本设计师。请根据产品名称「${name}」以及它所属的品牌上下文「${brandContext || ''}」生成一份详尽的产品档案及制造规格（尺寸、所属类目、纸质、页数、价格预测）。返回数据结构完美的 JSON。`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          releaseDate: { type: Type.STRING, description: '发布年月，如: 2024-03' },
          category: { type: Type.STRING, description: '产品大类，必须在 "Notebook"、"Planner"、"Envelope/Letter"、"Writing Instrument"、"Desk Organizer"、"Accessory" 范围中六选一' },
          dimensions: { type: Type.STRING, description: '精确尺寸规范，如: 148 x 210 mm (A5)' },
          pageCount: { type: Type.INTEGER, description: '推荐页数，如: 176' },
          paperType: { type: Type.STRING, description: '采用底纸，如: 巴川纸 52gsm、MD Paper本白' },
          bindingMethod: { type: Type.STRING, description: '装订机制，如: 锁线平摊装帧、裸脊线装' },
          price: { type: Type.STRING, description: '参考售价带，如: ¥68.00' },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          notes: { type: Type.STRING, description: '工艺研究细节：工艺难度、手触反馈、设计留白、书写阻尼细节探讨。' }
        },
        required: ['name', 'releaseDate', 'category', 'dimensions', 'pageCount', 'paperType', 'bindingMethod', 'price', 'tags', 'notes']
      };
    } else if (category === 'material') {
      prompt = `你是一位造纸工艺学研究员与装帧工艺大师。请根据材料名称「${name}」生成一份专业的文具用材料研究报告。包括材料类别（Paper、Leather 等）、产地、物理性能、适用场景。返回 JSON。`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: '材料名，如: 佛罗伦萨羊皮卡、120g瑞典轻型纸' },
          category: { type: Type.STRING, description: '材料大类，必须在 "Paper"、"Leather"、"Book Cloth"、"Plastic"、"Metal"、"Other" 选一' },
          origin: { type: Type.STRING, description: '生产地/产区/工艺源起，如: 德国、意大利、浙江温州' },
          features: { type: Type.STRING, description: '高阶书写物理学特征，用 markdown 换行格式（含•前缀）: 如吸墨、抗拉力度、无酸度' },
          suitableScenario: { type: Type.STRING, description: '最适配合书写工具或装订形式' },
          representativeBrands: { type: Type.ARRAY, items: { type: Type.STRING }, description: '使用它进行代表作打造的1-2个世界文具大厂' },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          notes: { type: Type.STRING, description: '装帧时需要防缩变、冷热压温度、粘胶吸水分等注意事项。' }
        },
        required: ['name', 'category', 'origin', 'features', 'suitableScenario', 'representativeBrands', 'tags', 'notes']
      };
    } else if (category === 'craft') {
      prompt = `你是一位高端印刷装帧工艺厂的技术主理人。请根据工艺名称「${name}」生成一份专业的表面处理印刷工艺技术规格说明，用高密度的印刷美学用语。返回 JSON。`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: '工艺名称' },
          definition: { type: Type.STRING, description: '该工艺的精确定义、基本机理(不超过100字)' },
          prosAndCons: { type: Type.STRING, description: '优缺点比较，建议 Markdown 带有换行格式' },
          costLevel: { type: Type.STRING, description: '必须在 "High"、"Medium"、"Low" 选一' },
          typicalApplications: { type: Type.STRING, description: '在文创本册、礼盒中的特定高阶玩法' },
          notes: { type: Type.STRING, description: '设计师在出矢量色油蒙版以及制版菲林时的核心避坑细节。' }
        },
        required: ['name', 'definition', 'prosAndCons', 'costLevel', 'typicalApplications', 'notes']
      };
    } else {
      res.status(400).json({ error: 'Unsupported generation category' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Emply response received from Gemini.');
    }

    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Gemini generate-profile error:', error.message);
    // If no API key or other failure, fallback to beautifully curated mock generator
    console.log('Using robust fallback data generator of Stationery Research Center');
    const fallback = generateFallbackData(category, name);
    res.json(fallback);
  }
});

// Serve frontend with Vite configuration or production files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust check to see if we are in production (env set, or running bundled server.cjs inside dist)
const isProduction = process.env.NODE_ENV === 'production' || __dirname.includes('dist') || __filename.endsWith('.cjs');

async function start() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stationery Research Center Backend server running on http://localhost:${PORT}`);
  });
}

start();
