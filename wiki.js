// 合并商业和观赏鱼类数据
const allFish = [
    ...fishRecommendations.commercial.high.map(fish => ({...fish, type: 'commercial', difficulty: 'medium'})),
    ...fishRecommendations.ornamental.high.map(fish => ({...fish, type: 'ornamental', difficulty: getDifficulty(fish)}))
];

// 根据鱼类信息确定难度
function getDifficulty(fish) {
    if (fish.difficulty === '高') return 'hard';
    if (fish.difficulty === '中等') return 'medium';
    return 'easy';
}

// 渲染鱼类卡片
function renderFishCards(fishes) {
    const container = document.getElementById('wikiContainer');
    container.innerHTML = fishes.map(fish => `
        <div class="fish-card" onclick="showFishDetail('${fish.id}')">
            <div class="fish-image">
                <img src="${fish.image || getDefaultFishImage(fish.type)}" alt="${fish.name}">
            </div>
            <div class="fish-header">
                <div class="fish-icon">
                    <img src="${fish.icon || getDefaultFishIcon(fish.type)}" alt="${fish.name}">
                </div>
                <div class="fish-title">
                    <h3>${fish.name}</h3>
                    <p>${fish.type === 'commercial' ? '商业养殖' : '观赏鱼类'}</p>
                </div>
            </div>
            <div class="fish-info">
                <h4>适养条件</h4>
                <div class="fish-params">
                    <div class="param-item">
                        <div class="param-label">水温</div>
                        <div class="param-value">${fish.suitable?.temperature || fish.temperature}</div>
                    </div>
                    <div class="param-item">
                        <div class="param-label">pH值</div>
                        <div class="param-value">${fish.suitable?.ph || fish.ph}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 获取鱼类图标
function getFishEmoji(type) {
    return type === 'commercial' ? '🐟' : '🐠';
}

// 显示鱼类详情
function showFishDetail(fishId) {
    const fish = allFish.find(f => f.id === fishId) || fishData.find(f => f.id === fishId);
    if (!fish) return;
    
    const modalContent = document.getElementById('fishDetailContent');
    const modal = document.getElementById('fishDetailModal');
    
    modalContent.innerHTML = `
        <div class="fish-detail-card">
            <h2>${fish.name}</h2>
            <img src="${fish.image}" alt="${fish.name}" class="fish-detail-image">
            <div class="fish-info">
                <p><strong>类型:</strong> ${fish.type === 'commercial' ? '商业养殖' : '观赏鱼类'}</p>
                <p><strong>适宜温度:</strong> ${fish.suitable?.temperature || fish.temperature}</p>
                <p><strong>pH值:</strong> ${fish.suitable?.ph || fish.ph}</p>
                <p><strong>耗氧量:</strong> ${fish.suitable?.oxygen}</p>
                
                ${fish.type === 'commercial' ? `
                    <p><strong>养殖周期:</strong> ${fish.cycle}</p>
                    <p><strong>预期利润:</strong> ${
                        fish.profit?.min ? 
                        `${fish.profit.min}-${fish.profit.max}元/年` : 
                        '未知'
                    }</p>
                ` : `
                    <p><strong>养殖难度:</strong> ${fish.difficulty}</p>
                    <p><strong>养殖周期:</strong> ${fish.cycle || '未知'}</p>
                    <p><strong>预期利润:</strong> ${fish.profit ? `${fish.profit.min}-${fish.profit.max}元/年` : '视规模而定'}</p>
                `}
                
                <p><strong>市场价格:</strong> ${fish.marketPrice}元/${fish.type === 'commercial' ? 'kg' : '条'}</p>
                <p><strong>市场需求:</strong> ${fish.marketDemand}</p>
                <p><strong>市场趋势:</strong> ${fish.marketTrend}</p>
                
                ${fish.description ? `
                    <div class="fish-description">
                        <strong>详细描述:</strong>
                        <p>${fish.description}</p>
                    </div>
                ` : ''}
                
                ${fish.tips ? `
                    <div class="fish-tips">
                        <strong>养殖建议:</strong>
                        <ul>
                            ${fish.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 关闭详情弹窗
function closeModal() {
    document.getElementById('fishDetailModal').style.display = 'none';
}

// 搜索和筛选功能
function filterFish() {
    const searchText = document.getElementById('searchBox').value.toLowerCase();
    const selectedType = document.querySelector('#typeFilter .filter-option.active').dataset.type;
    const selectedDifficulty = document.querySelector('#difficultyFilter .filter-option.active').dataset.difficulty;
    
    const filteredFish = allFish.filter(fish => {
        const matchesSearch = fish.name.toLowerCase().includes(searchText);
        const matchesType = selectedType === 'all' || fish.type === selectedType;
        const matchesDifficulty = selectedDifficulty === 'all' || fish.difficulty === selectedDifficulty;
        return matchesSearch && matchesType && matchesDifficulty;
    });
    
    renderFishCards(filteredFish);
}

// 初始化页面
function initializePage() {
    // 渲染初始鱼类列表
    renderFishCards(allFish);
    
    // 添加搜索监听
    document.getElementById('searchBox').addEventListener('input', filterFish);
    
    // 添加筛选器点击事件
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function() {
            // 移除同组其他选项的active类
            this.parentElement.querySelectorAll('.filter-option').forEach(opt => {
                opt.classList.remove('active');
            });
            // 添加当前选项的active类
            this.classList.add('active');
            // 更新筛选结果
            filterFish();
        });
    });
    
    // 添加点击模态框外部关闭功能
    window.onclick = function(event) {
        const modal = document.getElementById('fishDetailModal');
        if (event.target === modal) {
            closeModal();
        }
    };
}

// 页加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage);

// 获取默认鱼类图标
function getDefaultFishIcon(type) {
    return type === 'commercial' ? 
        'images/fish/default-commercial.svg' : 
        'images/fish/default-ornamental.svg';
}

// 获取默认鱼类图片
function getDefaultFishImage(type) {
    return type === 'commercial' ? 
        'images/fish/default-commercial.jpg' : 
        'images/fish/default-ornamental.jpg';
}

function calculateProfit(fish) {
    if (fish.profit?.min && fish.profit?.max) {
        return `${fish.profit.min}-${fish.profit.max}`;
    }
    
    // 如果是使用稀有度计算的情况
    const rarityMultiplier = {
        '普通': 1.2,
        '稀有': 1.5,
        '史诗': 2.0,
        '传说': 3.0
    };
    
    if (fish.price && fish.rarity) {
        const baseProfit = fish.price * (rarityMultiplier[fish.rarity] || 1);
        return Math.floor(baseProfit);
    }
    
    return fish.profit || '未知';
} 