// 页面加载完成后初始化内容
document.addEventListener('DOMContentLoaded', function() {
    initializeNews();
    initializeTips();
    initializeMarket();
    initializeCases();
    updateLoginStatus();
});

// 检查登录状态并更新UI
function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginLink = document.getElementById('loginStatus');
    const profileText = document.getElementById('navProfileName');
    
    if (isLoggedIn) {
        const username = localStorage.getItem('username');
        loginLink.textContent = '退出登录';
        loginLink.title = '点击退出登录';
        profileText.textContent = username;
    } else {
        loginLink.textContent = '登录';
        loginLink.title = '点击登录';
        profileText.textContent = '个人中心';
    }
}

// 处理登录/退出点击
function handleLoginClick() {
    if (localStorage.getItem('isLoggedIn')) {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            updateLoginStatus();
        }
    } else {
        window.location.href = 'login/login.html';
    }
}

// 检查登录状态
function checkLogin(event) {
    if (!localStorage.getItem('isLoggedIn')) {
        event.preventDefault();
        alert('请先登录！');
        return false;
    }
    return true;
}

// 初始化新闻资讯
function initializeNews() {
    const newsContainer = document.getElementById('newsContainer');
    const news = [
        {
            title: '2024年水产养殖行业发展趋势分析',
            date: '2024-03-15',
            image: 'https://picsum.photos/800/400?random=1',
            summary: '专家解读最新行业政策和发展方向，展望未来养殖业发展前景。'
        },
        {
            title: '智能养殖技术在传统鱼塘中的应用',
            date: '2024-03-14',
            image: 'https://picsum.photos/800/400?random=2',
            summary: '探讨如何利用现代科技提升传统养殖效率，实现降本增效。'
        },
        {
            title: '水产品市场供需分析报告',
            date: '2024-03-13',
            image: 'https://picsum.photos/800/400?random=3',
            summary: '最新市场调研数据显示，优质水产品需求持续增长。'
        }
    ];

    newsContainer.innerHTML = news.map(item => `
        <div class="news-card">
            <img src="${item.image}" alt="${item.title}" class="news-image">
            <div class="news-content">
                <h3>${item.title}</h3>
                <p class="news-date">${item.date}</p>
                <p>${item.summary}</p>
            </div>
        </div>
    `).join('');
}

// 初始化养殖技巧
function initializeTips() {
    const tipsCarousel = document.getElementById('tipsCarousel');
    const tips = [
        {
            title: '水质管理要点',
            content: '定期检测水质参数，保持水体稳定是成功养殖的关键。'
        },
        {
            title: '科学投喂方法',
            content: '根据不同生长阶段调整饲料种类和投喂量，避免过量投喂。'
        },
        {
            title: '疾病防控措施',
            content: '做好日常消毒工作，建立完善的防疫体系。'
        }
    ];

    tipsCarousel.innerHTML = tips.map(tip => `
        <div class="tip-card">
            <h3>${tip.title}</h3>
            <p>${tip.content}</p>
        </div>
    `).join('');
}

// 初始化市场行情
function initializeMarket() {
    const marketTable = document.getElementById('marketTable').getElementsByTagName('tbody')[0];
    const marketData = [
        {
            fish: '草鱼',
            price: '15.8元/kg',
            trend: '↑',
            supply: '供不应求'
        },
        {
            fish: '鲤鱼',
            price: '12.5元/kg',
            trend: '→',
            supply: '供需平衡'
        },
        {
            fish: '鲫鱼',
            price: '16.2元/kg',
            trend: '↑',
            supply: '供不应求'
        }
    ];

    marketTable.innerHTML = marketData.map(item => `
        <tr>
            <td>${item.fish}</td>
            <td>${item.price}</td>
            <td>${item.trend}</td>
            <td>${item.supply}</td>
        </tr>
    `).join('');
}

// 初始化成功案例
function initializeCases() {
    const casesContainer = document.querySelector('.cases-grid');
    const cases = [
        {
            title: '智能化改造助力传统鱼塘增产30%',
            image: 'https://picsum.photos/800/400?random=4',
            description: '通过引入智能监测系统，实现精准投喂和水质调控，显著提升产量。'
        },
        {
            title: '生态养殖模式创新案例',
            image: 'https://picsum.photos/800/400?random=5',
            description: '采用生态养殖模式，打造绿色养殖示范基地。'
        }
    ];

    casesContainer.innerHTML = cases.map(item => `
        <div class="case-card">
            <img src="${item.image}" alt="${item.title}" class="case-image">
            <div class="case-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');
}

function showFishDetail(fish) {
    const modal = document.getElementById('fishDetailModal');
    
    // 填充数据
    document.getElementById('modalFishImage').src = fish.imageUrl;
    document.getElementById('modalFishName').textContent = fish.name;
    document.getElementById('modalScientificName').textContent = fish.scientificName;
    document.getElementById('modalTemperature').textContent = fish.temperature;
    document.getElementById('modalCycle').textContent = fish.cycle;
    document.getElementById('modalPH').textContent = fish.ph;
    document.getElementById('modalDifficulty').textContent = fish.difficulty;
    document.getElementById('modalProfit').textContent = `${fish.profit} 元/亩/年`;
    document.getElementById('modalDescription').textContent = fish.description;
    
    // 清空并添加养殖建议
    const tipsList = document.getElementById('modalTips');
    tipsList.innerHTML = '';
    fish.tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
    
    modal.style.display = 'block';
}

function closeFishModal() {
    document.getElementById('fishDetailModal').style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('fishDetailModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
} 