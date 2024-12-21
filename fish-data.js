// 鱼类推荐数据
const fishRecommendations = {
    commercial: {
        high: [
            {
                id: 'carp',
                name: '鲤鱼',
                icon: 'images/fish/carp.svg',
                image: 'images/鲤鱼.png',
                suitable: {
                    temperature: '18-28℃',
                    ph: '6.5-8.5',
                    oxygen: '0.3-0.5mg/L'
                },
                profit: {
                    min: 12000,
                    max: 15000
                },
                cycle: '6-8个月',
                description: "杂食性，喜欢在淡水环境中生活。广泛分布于全球各地的淡水环境。适应性强，生长快，肉质鲜美。",
                tips: [
                    "适宜温度为20-28℃，pH值为6.5-9.0",
                    "需要充足的光照和氧气",
                    "养殖周期一般1-2年可达到市场规格",
                    "重要的食用鱼和观赏鱼"
                ],
                marketPrice: "40",
                marketDemand: "需求稳定，市场广阔",
                marketTrend: "根据大小和品质不同，价格有所差异"
            },
            {
                id: 'grass_carp',
                name: '草鱼',
                icon: 'images/fish/grass_carp.svg',
                image: 'images/草鱼.png',
                suitable: {
                    temperature: '20-30℃',
                    ph: '6.5-8.5',
                    oxygen: '0.3-0.5mg/L'
                },
                profit: {
                    min: 15000,
                    max: 20000
                },
                cycle: '8-10个月',
                description: "主要以植物为食，生活在淡水中。亚洲地区尤其是中国较为常见。",
                tips: [
                    "适宜温度为20-30℃，pH值6.5-8.5",
                    "需充足光照和氧气",
                    "养殖周期约2-3年",
                    "重要的食用鱼种"
                ],
                marketPrice: "35",
                marketDemand: "市场需求量大",
                marketTrend: "受市场需求影响，价格波动较大"
            },
            {
                id: 'silver_carp',
                name: '鲢鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/鲢鱼.png ',
                suitable: {
                    temperature: '20-30℃',
                    ph: '6.5-8.5',
                    oxygen: '0.2-0.4mg/L'
                },
                profit: {
                    min: 10000,
                    max: 13000
                },
                cycle: '8-10个月',
                description: "滤食性，以浮游生物为主要食物。主要分布在亚洲的淡水湖泊和河流中。",
                tips: [
                    "适宜温度为20-30℃，pH值6.5-8.5",
                    "需要良好的水质环境",
                    "养殖周期通常需要2-3年",
                    "作为食用鱼具有较高的经济价值"
                ],
                marketPrice: "30",
                marketDemand: "市场需求稳定",
                marketTrend: "因地区而异，但普遍受欢迎"
            },
            {
                id: 'bighead_carp',
                name: '鳙鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/鳙鱼.png ',
                suitable: {
                    temperature: '20-30℃',
                    ph: '6.5-8.5',
                    oxygen: '0.3-0.5mg/L'
                },
                profit: {
                    min: 18000,
                    max: 25000
                },
                cycle: '10-12个月',
                description: "滤食性，主食浮游动物。亚洲地区特别是中国的淡水环境中多见。",
                tips: [
                    "适宜温度为20-30℃，pH值6.5-8.5",
                    "要求水质良好",
                    "养殖周期大约需要3年左右",
                    "重要的食用鱼之一"
                ],
                marketPrice: "25",
                marketDemand: "需求稳定",
                marketTrend: "随行就市，价格适中"
            },
            {
                id: 'black_carp',
                name: '青鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/青鱼.png ',
                suitable: {
                    temperature: '20-30℃',
                    ph: '6.5-8.5',
                    oxygen: '0.3-0.5mg/L'
                },
                profit: {
                    min: 20000,
                    max: 30000
                },
                cycle: '12-15个月',
                description: "肉食性，捕食小鱼小虾。主要在中国长江流域及其支流中发现。",
                tips: [
                    "适宜温度为22-28℃，pH值7.0-8.5",
                    "需要清洁的水环境",
                    "养殖周期约需3-4年才能成熟",
                    "珍贵的食用鱼及观赏鱼"
                ],
                marketPrice: "30",
                marketDemand: "市场需求持续",
                marketTrend: "较高，尤其是野生品种更珍贵"
            },
            {
                id: 'tilapia',
                name: '罗非鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/罗非鱼.png ',
                suitable: {
                    temperature: '20-35℃',
                    ph: '6.0-8.5',
                    oxygen: '0.2-0.4mg/L'
                },
                profit: {
                    min: 25000,
                    max: 35000
                },
                cycle: '4-6个月',
                description: "杂食性，适应性强。原生于非洲东部湖泊，现已引入世界各地。",
                tips: [
                    "适宜温度为24-30℃，pH值7.0-8.5",
                    "耐低氧环境",
                    "养殖周期6个月至1年即可上市销售",
                    "重要的淡水养殖鱼类之一"
                ],
                marketPrice: "60",
                marketDemand: "需求量大",
                marketTrend: "相对较低，适合大规模生产"
            },
            {
                id: 'catfish',
                name: '鲶鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/鲶鱼.png ',
                suitable: {
                    temperature: '20-32℃',
                    ph: '6.5-8.5',
                    oxygen: '0.2-0.4mg/L'
                },
                profit: {
                    min: 16000,
                    max: 22000
                },
                cycle: '6-8个月',
                description: "肉食性或杂食性，底栖生活。几乎遍布全球所有温暖地区的淡水系统。",
                tips: [
                    "适宜温度为22-28℃，pH值6.0-8.5",
                    "需要足够的氧气供应",
                    "养殖周期一般1-2年可以出售",
                    "重要的食品资源，也有观赏价值"
                ],
                marketPrice: "50",
                marketDemand: "市场需求稳定",
                marketTrend: "根据种类不同而有较大差异"
            },
            {
                id: 'snakehead',
                name: '黑鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/黑鱼.png ',
                suitable: {
                    temperature: '20-30℃',
                    ph: '6.5-7.5',
                    oxygen: '0.3-0.5mg/L'
                },
                profit: {
                    min: 30000,
                    max: 40000
                },
                cycle: '8-10个月',
                description: "肉食性，喜欢栖息于淡水湖泊、河流等处。原产于北美洲，现被引入其他国家。",
                tips: [
                    "适宜温度为18-25℃，pH值6.0-8.5",
                    "需充足氧气",
                    "养殖周期通常需要1-2年时间成长",
                    "高价值的食用鱼和垂钓对象"
                ],
                marketPrice: "40",
                marketDemand: "高端市场需求稳定",
                marketTrend: "价格较高，尤其是大型个体更受欢迎"
            },
            {
                id: 'eel',
                name: '鳗鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/鳗鱼.png',
                suitable: {
                    temperature: '23-28℃',
                    ph: '6.5-7.5',
                    oxygen: '0.3-0.5mg/L'
                },
                profit: {
                    min: 50000,
                    max: 80000
                },
                cycle: '12-18个月',
                description: "洄游性鱼类，成体在淡水中生活，幼体则在海洋中度过一段时间再返回淡水繁殖。广泛分布于世界各地的河流与湖泊之中。",
                tips: [
                    "适宜温度为18-25℃，pH值6.0-8.0",
                    "需要良好的水质管理",
                    "养殖周期从卵孵化到成鱼大约需要3-5年",
                    "因其独特的口感被视为高档食材"
                ],
                marketPrice: "80",
                marketDemand: "出口需求稳定",
                marketTrend: "非常昂贵，特别是野生品种更加稀有且价格高昂"
            },
            {
                id: 'silver_arowana',
                name: '银龙鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/银龙鱼.png',
                suitable: {
                    temperature: '24-28℃',
                    ph: '6.5-7.5',
                    oxygen: '0.3-0.5mg/L'
                },
                profit: {
                    min: 40000,
                    max: 60000
                },
                cycle: '18-24个月',
                description: "银龙鱼是名贵观赏鱼，也可食用，养殖技术要求高，市场价值大。",
                tips: [
                    "严格控制水质参数",
                    "投喂优质饵料",
                    "注意防应激和防病",
                    "加强日常管理和观察"
                ],
                marketPrice: "200-500",
                marketDemand: "高端市场需求稳定",
                marketTrend: "价格维持高位，养殖风险较大"
            }
        ]
    },
    ornamental: {
        high: [
            {
                id: 'arowana',
                name: '龙鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/龙鱼.png',
                suitable: {
                    temperature: '26-30℃',
                    ph: '6.5-7.5',
                    oxygen: '0.3-0.5mg/L'
                },
                difficulty: '高',
                value: '极高',
                description: "肉食性，常在水面附近活动寻找猎物。东南亚特有种，如马来西亚、印尼等地。",
                tips: [
                    "适宜温度为26-30℃，pH值6.5-7.5",
                    "要求高水质标准",
                    "养殖周期一般需要3年以上",
                    "极具观赏性的热带鱼，也有食用价值"
                ],
                marketPrice: "500",
                marketDemand: "高端市场需求稳定",
                marketTrend: "极高，尤其是红色系更为珍贵",
                cycle: '3-5年',
                profit: {
                    min: 50000,
                    max: 100000
                }
            },
            {
                id: 'flowerhorn',
                name: '罗汉鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/罗汉鱼.png',
                suitable: {
                    temperature: '24-28℃',
                    ph: '7.0左右',
                    oxygen: '0.2-0.4mg/L'
                },
                difficulty: '中等',
                value: '较高',
                description: "杂食性，性情凶猛，领地意识强。人工培育出来的品种，源自东南亚地区。",
                tips: [
                    "适宜温度为24-28℃，pH值7.0左右",
                    "需要定期换水保持水质新鲜",
                    "养殖周期约1年可长成漂亮体型",
                    "主要用于观赏目的"
                ],
                marketPrice: "60",
                marketDemand: "养鱼爱好者喜爱",
                marketTrend: "相对较高，但具体取决于外观特征",
                cycle: '1-2年',
                profit: {
                    min: 20000,
                    max: 40000
                }
            },
            {
                id: 'koi',
                name: '锦鲤',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/锦鲤.png ',
                suitable: {
                    temperature: '20-28℃',
                    ph: '7.0-8.0',
                    oxygen: '0.3-0.5mg/L'
                },
                difficulty: '中等',
                value: '高',
                description: "杂食性，色彩斑斓美丽动人。原产地为中国及日本，后传入欧美成为流行物。",
                tips: [
                    "适宜温度为20-28℃，pH值7.0-8.0",
                    "需大量空间供其游动",
                    "随着年龄增长颜色会更加鲜艳夺目",
                    "除观赏外还具有特殊文化意义"
                ],
                marketPrice: "30",
                marketDemand: "市场需求持续增长",
                marketTrend: "根据品种和颜色差异较大，优质品种价格很高",
                cycle: '2-3年',
                profit: {
                    min: 15000,
                    max: 30000
                }
            },
            {
                id: 'goldfish',
                name: '金鱼',
                icon: 'images/fish/goldfish.svg',
                image: 'images/金鱼.png ',
                suitable: {
                    temperature: '18-24℃',
                    ph: '7.0左右',
                    oxygen: '0.3-0.5mg/L'
                },
                difficulty: '低',
                value: '中等',
                description: "杂食性，性格温顺易于照顾。起源于中国，现已遍布全世界各个角落。",
                tips: [
                    "适宜温度为18-24℃，pH值7.0左右",
                    "避免直射阳光照射",
                    "从出生到成年只需几个月",
                    "最常见的观赏鱼之一"
                ],
                marketPrice: "5",
                marketDemand: "大众市场广泛欢迎",
                marketTrend: "价格亲民，几乎人人都能负担",
                cycle: '3-6个月',
                profit: {
                    min: 5000,
                    max: 10000
                }
            },
            {
                id: 'guppy',
                name: '孔雀鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/孔雀鱼.png ',
                suitable: {
                    temperature: '22-28℃',
                    ph: '7.0左右',
                    oxygen: '0.2-0.4mg/L'
                },
                difficulty: '低',
                value: '中等',
                description: "小型热带鱼，活泼好动喜欢群居生活。原产自南美洲亚马河流域。",
                tips: [
                    "适宜温度为22-28℃，pH值7.0左右",
                    "需要适量光照促进健康生长",
                    "繁殖能力强，很快产生后代",
                    "适合新手尝试养殖"
                ],
                marketPrice: "10",
                marketDemand: "入门级市场需求大",
                marketTrend: "价格实惠，适合新手入门",
                cycle: '2-3个月',
                profit: {
                    min: 3000,
                    max: 8000
                }
            },
            {
                id: 'angelfish',
                name: '神仙鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/神仙鱼.png ',
                suitable: {
                    temperature: '24-28℃',
                    ph: '7.0左右',
                    oxygen: '0.3-0.5mg/L'
                },
                difficulty: '中等',
                value: '较高',
                description: "温和的热带鱼种，喜欢安静地待在水族箱里。原本生活在东南亚的淡水流域内。",
                tips: [
                    "适宜温度为24-28℃，pH值7.0左右",
                    "需要提供遮蔽阳光处",
                    "常情况下可以存活数年",
                    "家庭装饰的理想选择"
                ],
                marketPrice: "20",
                marketDemand: "市场认可度高",
                marketTrend: "中等偏上的价位区间",
                cycle: '6-12个月',
                profit: {
                    min: 8000,
                    max: 15000
                }
            },
            {
                id: 'discus',
                name: '七彩神仙鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/七彩神仙鱼.png ',
                suitable: {
                    temperature: '28-30℃',
                    ph: '5.5-7.0',
                    oxygen: '0.3-0.5mg/L'
                },
                difficulty: '高',
                value: '高',
                description: "性格害羞敏感，偏好平静无扰的环境。南美洲亚马逊盆地特有的物种。",
                tips: [
                    "适宜温度为28-30℃，pH值5.5-7.0",
                    "必须严格控制水质参数",
                    "成长速度较慢，需要几年精心照料",
                    "极高的观赏和收藏价值"
                ],
                marketPrice: "50",
                marketDemand: "高端市场青睐",
                marketTrend: "珍品种价格昂贵",
                cycle: '1-2年',
                profit: {
                    min: 25000,
                    max: 50000
                }
            },
            {
                id: 'betta',
                name: '斗鱼',
                icon: 'images/fish/silver_carp.svg',
                image: 'images/斗鱼.png ',
                suitable: {
                    temperature: '24-28℃',
                    ph: '6.5-7.5',
                    oxygen: '0.2-0.4mg/L'
                },
                difficulty: '低',
                value: '中等',
                description: "好斗且领地意识强烈，雄性之间经常会发生激烈争斗。泰国及周边国家的传统宠物。",
                tips: [
                    "适宜温度为24-28℃，pH值6.5-7.5",
                    "对水中含氧量要求很高",
                    "单独饲养避免打斗",
                    "独特个性和丰富色彩变化"
                ],
                marketPrice: "10",
                marketDemand: "观赏市场稳定",
                marketTrend: "特别品种价格较高",
                cycle: '3-6个月',
                profit: {
                    min: 5000,
                    max: 12000
                }
            }
        ]
    }
}; 

// 从 fishRecommendations 中提取所有鱼类数据构建 fishData 数组
const fishData = [
    ...fishRecommendations.commercial.high,
    ...fishRecommendations.ornamental.high
];

// 确保数据在全局范围内可用
window.fishData = fishData; 