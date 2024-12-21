// 全局变量声明
let currentPond;
let ponds = [];
let currentPondId;
let charts = {};
let dataGenerationCount = 0;
let currentAbnormalParam = 'ph';
const paramOrder = ['ph', 'oxygen', 'ammonia', 'temperature'];
let paramIndex = 0;
let pondLogs = [];
let backgroundMonitoring = {};

// 常量定义
const LogType = {
    WARNING: 'warning',
    ADJUSTMENT: 'adjustment',
    SYSTEM: 'system'
};

// 初始化页面
async function initializePond() {
    const urlParams = new URLSearchParams(window.location.search);
    currentPondId = urlParams.get('id');
    
    ponds = JSON.parse(localStorage.getItem('ponds')) || [];
    currentPond = ponds[currentPondId];
    
    if (!currentPond) {
        alert('鱼塘不存在！');
        window.location.href = 'index.html';
        return;
    }

    // 检查是否需要选择新鱼种
    if (!currentPond.fish || currentPond.needsFishSelection) {
        showFishSelectionDialog();
        return;
    }

    document.getElementById('pondName').textContent = currentPond.name;
    initializeCharts();
    startDataSimulation();
}

// 添加日志记录
function addLog(type, param, details) {
    const log = {
        id: Date.now(),
        type,
        param,
        details,
        timestamp: new Date().toISOString(),
        pondId: new URLSearchParams(window.location.search).get('id')
    };
    
    // 添加到内存中的日志数组
    pondLogs.push(log);
    
    // 保存到localStorage
    saveLogs();
    
    return log;
}

// 保存日志到localStorage
function saveLogs() {
    const allLogs = JSON.parse(localStorage.getItem('pondLogs') || '{}');
    const pondId = new URLSearchParams(window.location.search).get('id');
    allLogs[pondId] = pondLogs;
    localStorage.setItem('pondLogs', JSON.stringify(allLogs));
}

// 加载日志
function loadLogs() {
    const allLogs = JSON.parse(localStorage.getItem('pondLogs') || '{}');
    const pondId = new URLSearchParams(window.location.search).get('id');
    pondLogs = allLogs[pondId] || [];
}

// 显示日志对话框
function showLogDialog() {
    const dialog = document.getElementById('logDialog');
    dialog.style.display = 'block';
    renderLogs();
}

// 关闭日志对话框
function closeLogDialog() {
    document.getElementById('logDialog').style.display = 'none';
}

// 渲染日志列表
function renderLogs(typeFilter = 'all', paramFilter = 'all') {
    const logList = document.getElementById('logList');
    const filteredLogs = pondLogs.filter(log => {
        const typeMatch = typeFilter === 'all' || log.type === typeFilter;
        const paramMatch = paramFilter === 'all' || log.param === paramFilter;
        return typeMatch && paramMatch;
    });
    
    logList.innerHTML = filteredLogs.reverse().map(log => `
        <div class="log-entry ${log.type}" onclick="showLogDetail(${log.id})">
            <div class="log-icon">${getLogIcon(log.type)}</div>
            <div class="log-content">
                <div class="log-time">${formatLogTime(log.timestamp)}</div>
                <div class="log-title">${getLogTitle(log)}</div>
                <div class="log-details">${log.details}</div>
            </div>
            <div class="log-arrow">›</div>
        </div>
    `).join('');
}

// 获取日志图标
function getLogIcon(type) {
    switch(type) {
        case LogType.WARNING: return '⚠️';
        case LogType.ADJUSTMENT: return '🔧';
        case LogType.SYSTEM: return '🔄';
        default: return '📝';
    }
}

// 获取日志标题
function getLogTitle(log) {
    const paramName = {
        ph: 'pH值',
        oxygen: '溶解氧',
        ammonia: '氨氮',
        temperature: '水温'
    }[log.param] || log.param;
    
    switch(log.type) {
        case LogType.WARNING:
            return `${paramName}异常警告`;
        case LogType.ADJUSTMENT:
            return `${paramName}自动调节`;
        case LogType.SYSTEM:
            return '系统操作';
        default:
            return '其他事件';
    }
}

// 格式化日志时间
function formatLogTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

// 过滤日志
function filterLogs() {
    const typeFilter = document.getElementById('logTypeFilter').value;
    const paramFilter = document.getElementById('logParamFilter').value;
    renderLogs(typeFilter, paramFilter);
}

// 导出日志
function exportLogs() {
    const typeFilter = document.getElementById('logTypeFilter').value;
    const paramFilter = document.getElementById('logParamFilter').value;
    const filteredLogs = pondLogs.filter(log => {
        const typeMatch = typeFilter === 'all' || log.type === typeFilter;
        const paramMatch = paramFilter === 'all' || log.param === paramFilter;
        return typeMatch && paramMatch;
    });
    
    const csv = [
        ['时间', '类型', '参数', '详细信息'],
        ...filteredLogs.map(log => [
            formatLogTime(log.timestamp),
            getLogTitle(log),
            log.param,
            log.details
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pond_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 修改现有的警告和调节函数，添加日志记录
function showWarningDialog(param, value, warningInfo) {
    // 添加警告日志
    addLog(LogType.WARNING, param, `${param}值异常：${value}，正常范围：${standards[param].min}-${standards[param].max}`);
    
    // 原有的警告显示代码...
}

function autoCorrectParameter(param, currentValue) {
    // 添加调节开始日志
    addLog(LogType.ADJUSTMENT, param, `开始自动调节${param}值，初始值：${currentValue}`);
    
    // 原有的调节代码...
    
    // 在调节完成时添加日志
    if (steps <= 0) {
        addLog(LogType.ADJUSTMENT, param, `调节完成，最终值：${targetValue}`);
    }
}

// 在页面加载时初始化日志
document.addEventListener('DOMContentLoaded', () => {
    initializePond();
    loadLogs();
});

// 初始化图表
function initializeCharts() {
    // 销毁现有的图表实例
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    
    const parameters = ['ph', 'oxygen', 'ammonia', 'temperature'];
    const colors = {
        normal: 'rgba(54, 162, 235, 1)',
        warning: 'rgba(255, 99, 132, 1)'
    };

    parameters.forEach(param => {
        const ctx = document.getElementById(`${param}Chart`).getContext('2d');
        // 获取最新值
        const currentValue = currentPond.data[currentPond.data.length - 1][param];
        // 获取单位
        const unit = getParamUnit(param);
        
        charts[param] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: currentPond.data.map(d => formatDate(new Date(d.date))),
                datasets: [{
                    label: param.charAt(0).toUpperCase() + param.slice(1),
                    data: currentPond.data.map(d => d[param]),
                    borderColor: colors.normal,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: unit,
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        reverse: false,
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: `当前值：${currentValue.toFixed(1)}${unit}`,
                        padding: {
                            top: 10,
                            bottom: 30
                        },
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: currentValue < standards[param].min || currentValue > standards[param].max ? 
                            colors.warning : colors.normal
                    }
                }
            }
        });
    });
}

// 添加获取参数单位的函数
function getParamUnit(param) {
    switch(param) {
        case 'ph':
            return '';  // pH值没有单位
        case 'oxygen':
            return 'mg/L';
        case 'ammonia':
            return 'mg/L';
        case 'temperature':
            return '℃';
        default:
            return '';
    }
}

// 更新图表数据
function updateCharts() {
    Object.keys(charts).forEach(param => {
        const chart = charts[param];
        const currentValue = currentPond.data[currentPond.data.length - 1][param];
        const unit = getParamUnit(param);
        
        chart.data.labels = currentPond.data.map(d => formatDate(new Date(d.date)));
        chart.data.datasets[0].data = currentPond.data.map(d => d[param]);
        
        // 更新当前值显示
        chart.options.plugins.title.text = `当前值：${currentValue.toFixed(1)}${unit}`;
        chart.options.plugins.title.color = currentValue < standards[param].min || 
            currentValue > standards[param].max ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';
        
        chart.update();
        
        checkWarning(param);
    });
}

// 检查警告
function checkWarning(param) {
    const latestValue = currentPond.data[currentPond.data.length - 1][param];
    const warning = document.getElementById(`${param}Warning`);
    const chartContainer = warning.parentElement;
    
    if (latestValue < standards[param].min || latestValue > standards[param].max) {
        warning.classList.add('active');
        chartContainer.classList.add('warning');
        const warningInfo = generateWarningMessage(param, latestValue);
        warning.innerHTML = warningInfo.shortMessage;
        
        // 显示警告弹窗
        showWarningDialog(param, latestValue, warningInfo);
    } else {
        warning.classList.remove('active');
        chartContainer.classList.remove('warning');
        warning.innerHTML = '';
    }
}

// 生成详细的警告信息
function generateWarningMessage(param, value) {
    const messages = {
        ph: {
            low: {
                shortMessage: '水体偏酸，需要调节pH值',
                title: 'pH值过低警告',
                cause: [
                    '水体有机物分解产生酸性物质',
                    '投喂量过大导致残饵腐败',
                    '藻类大量死亡分解',
                    '雨水导致的酸性积累'
                ],
                solution: [
                    '添加适量石灰或碳酸氢钠调节pH值',
                    '减少投喂量，清理残饵',
                    '增加水体交换率',
                    '定期检测水质参数'
                ],
                autoCorrect: true
            },
            high: {
                shortMessage: '水体偏碱，需要调节pH值',
                title: 'pH值过高警告',
                cause: [
                    '藻类光合作用过强',
                    '水体钙质含量过高',
                    '施肥不当',
                    '水体溶解氧过饱和'
                ],
                solution: [
                    '添加适量有机酸调节pH值',
                    '控制水体藻类数量',
                    '调整施肥方案',
                    '增加水体交换率'
                ],
                autoCorrect: true
            }
        },
        oxygen: {
            low: {
                shortMessage: '溶解氧不足，鱼类可能缺氧',
                title: '溶解氧不足警告',
                cause: [
                    '水温过高导致溶解氧降低',
                    '生物耗氧量过大',
                    '水体有机物含量过高',
                    '增氧设备故障'
                ],
                solution: [
                    '立即开启增氧设备',
                    '减少投喂量',
                    '清除底部淤泥',
                    '检查并维修增氧设备'
                ],
                autoCorrect: true
            },
            high: {
                shortMessage: '溶解氧过高，需要调节',
                title: '溶解氧过高警告',
                cause: [
                    '增氧设备运行时间过长',
                    '藻类光合作用过强',
                    '水温过低导致溶解氧升高'
                ],
                solution: [
                    '适当减少增氧设备运行时间',
                    '控制水体藻类数量',
                    '监测水温变化'
                ],
                autoCorrect: true
            }
        },
        ammonia: {
            high: {
                shortMessage: '氨氮浓度过高，鱼类可能中毒',
                title: '氨氮浓度过高警告',
                cause: [
                    '投喂量过大',
                    '水体交换不足',
                    '底部淤泥积累',
                    '生物过滤系统效率低下'
                ],
                solution: [
                    '立即减少投喂量',
                    '增加水体交换率',
                    '清理池底淤泥',
                    '检查生物过滤系统'
                ],
                autoCorrect: true
            }
        },
        temperature: {
            low: {
                shortMessage: '水温过低,需要升温',
                title: '水温过低警告',
                cause: [
                    '天气变化导致水温下降',
                    '深水区温度过低',
                    '加热设备故障'
                ],
                solution: [
                    '开启加热设备',
                    '使用保温设施',
                    '调整水深',
                    '检查加热设备'
                ],
                autoCorrect: true
            },
            high: {
                shortMessage: '水温过高，需要降温',
                title: '水温过高警告',
                cause: [
                    '阳光直射导致水温过高',
                    '水体交换不足',
                    '水深不够'
                ],
                solution: [
                    '增加遮阳设施',
                    '增加水体交换率',
                    '开启增氧设备降温',
                    '调整水深'
                ],
                autoCorrect: true
            }
        }
    };

    const standard = standards[param];
    const type = value < standard.min ? 'low' : 'high';
    return messages[param][type] || {
        shortMessage: `${param}值异常: ${value}`,
        title: '参数异常警告',
        cause: ['未知原因'],
        solution: ['请联系技术人员检查']
    };
}

// 显示警告弹窗
function showWarningDialog(param, value, warningInfo) {
    // 创建弹窗元素
    const dialog = document.createElement('div');
    dialog.className = 'warning-dialog';
    dialog.innerHTML = `
        <div class="warning-content">
            <h2>${warningInfo.title}</h2>
            <p class="warning-value">当前值：${value}</p>
            <p class="warning-range">正常范围：${standards[param].min} - ${standards[param].max}</p>
            
            <div class="warning-section">
                <h3>可能原因：</h3>
                <ul>
                    ${warningInfo.cause.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>
            
            <div class="warning-section">
                <h3>解决方案：</h3>
                <ul>
                    ${warningInfo.solution.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            
            <div class="warning-buttons">
                ${warningInfo.autoCorrect ? 
                    `<button onclick="autoCorrectParameter('${param}', ${value})">自动调节</button>` : 
                    ''}
                <button onclick="closeWarningDialog(this.parentElement.parentElement.parentElement)">确认</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

// 关闭警告弹窗
function closeWarningDialog(dialog) {
    dialog.remove();
}

// 自动调节参数
function autoCorrectParameter(param, currentValue) {
    const standard = standards[param];
    // 根据不同参数设置目标值
    let targetValue;
    switch(param) {
        case 'ph':
            targetValue = 7.2;  // pH值调节到较理想的7.2
            break;
        case 'oxygen':
            targetValue = standard.max * 0.8;  
        case 'ammonia':
            targetValue = standard.min + (standard.max - standard.min) * 0.3;  // 氨氮调节到较低水平
            break;
        case 'temperature':
            targetValue = (standard.max + standard.min) / 2;  // 温度调节到中间值
            break;
        default:
            targetValue = (standard.max + standard.min) / 2;
    }
    
    // 固定3步完成调节
    let steps = 3;
    
    // 显示调节进度提示
    const progressDialog = document.createElement('div');
    progressDialog.className = 'progress-dialog';
    progressDialog.innerHTML = `
        <div class="progress-content">
            <h3>正在调节${param === 'ph' ? 'pH' : param}值</h3>
            <p class="progress-text">正在进行自动调节...</p>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    `;
    document.body.appendChild(progressDialog);
    
    let interval = setInterval(() => {
        const diff = (targetValue - currentValue) / steps;
        currentValue += diff;
        
        // 更新最新的数据点
        currentPond.data[currentPond.data.length - 1][param] = parseFloat(currentValue.toFixed(1));
        
        // 更新图表
        updateCharts();
        
        // 更新进度条
        const progress = ((3 - steps + 1) / 3) * 100;
        progressDialog.querySelector('.progress-fill').style.width = `${progress}%`;
        
        steps--;
        if (steps <= 0) {
            clearInterval(interval);
            // 更新localStorage
            const ponds = JSON.parse(localStorage.getItem('ponds'));
            const pondId = new URLSearchParams(window.location.search).get('id');
            ponds[pondId] = currentPond;
            localStorage.setItem('ponds', JSON.stringify(ponds));
            
            // 关闭所有警告弹窗和进度弹窗
            document.querySelectorAll('.warning-dialog').forEach(dialog => dialog.remove());
            progressDialog.remove();
            
            // 显示调节完成的详细信息
            const resultDialog = document.createElement('div');
            resultDialog.className = 'warning-dialog';
            resultDialog.innerHTML = `
                <div class="warning-content adjustment-result">
                    <h2><span class="success-icon">✓</span> 参数调节完成</h2>
                    <div class="result-details">
                        <div class="parameter-change">
                            <p class="old-value">原始值：${currentValue.toFixed(1)}</p>
                            <span class="arrow">→</span>
                            <p class="new-value">调节后：${targetValue.toFixed(1)}</p>
                        </div>
                        <div class="standard-range">
                            <p>标准范围：${standards[param].min} - ${standards[param].max}</p>
                        </div>
                        <div class="adjustment-tips">
                            <h3>维护建议：</h3>
                            <ul>
                                ${getMaintenanceTips(param)}
                            </ul>
                        </div>
                    </div>
                    <div class="warning-buttons">
                        <button onclick="closeWarningDialog(this.parentElement.parentElement.parentElement)">确认</button>
                    </div>
                </div>
            `;
            document.body.appendChild(resultDialog);
        }
    }, 1000);  // 每步1秒，总共3秒完成
}

// 获取维护建议
function getMaintenanceTips(param) {
    const tips = {
        ph: [
            '定期检测pH值，建议每天检测1-2次',
            '保持水质稳定，避免大幅波动',
            '适时调节投喂量，减少有机物积累'
        ],
        oxygen: [
            '保持增氧设备正常运行',
            '观察鱼类活动状态',
            '控制养殖密度，避免过度拥挤'
        ],
        ammonia: [
            '保持适量换水，稀释氨氮浓度',
            '合理投喂，避免残饵沉积',
            '定期清理池底，减少有机物积累'
        ],
        temperature: [
            '避免水温剧烈变化',
            '根据季节调整水深',
            '做好防暑降温或保温措施'
        ]
    };
    
    return tips[param].map(tip => `<li>${tip}</li>`).join('');
}

// 模拟数据更新
function startDataSimulation() {
    // 确保有初始数据
    if (!currentPond.data || currentPond.data.length === 0) {
        currentPond.data = generateInitialData();
    }
    
    // 保存上一次的数据值，用于生成平滑变化
    let lastValues = {
        ph: currentPond.data[currentPond.data.length - 1].ph,
        oxygen: currentPond.data[currentPond.data.length - 1].oxygen,
        ammonia: currentPond.data[currentPond.data.length - 1].ammonia,
        temperature: currentPond.data[currentPond.data.length - 1].temperature
    };
    
    dataGenerationCount = currentPond.data.length;
    
    // 记录当前鱼塘的监测间隔ID
    const pondId = new URLSearchParams(window.location.search).get('id');
    backgroundMonitoring[pondId] = window.dataSimulationInterval;
    
    window.dataSimulationInterval = setInterval(() => {
        // 每七次更新一次异常参数
        if (dataGenerationCount % 7 === 0) {
            paramIndex = (paramIndex + 1) % paramOrder.length;
            currentAbnormalParam = paramOrder[paramIndex];
        }
        
        // 移除最旧的数据
        currentPond.data.shift();
        
        // 获取最后一个数据点的日期并转换为Date对象
        const lastDate = new Date(currentPond.data[currentPond.data.length - 1].date);
        
        // 生成新数据（基于上一次的值进行小幅度波动）
        const newData = {
            ph: generateSmoothedValue(lastValues.ph, standards.ph.min, standards.ph.max),
            oxygen: generateSmoothedValue(lastValues.oxygen, standards.oxygen.min, standards.oxygen.max),
            ammonia: generateSmoothedValue(lastValues.ammonia, standards.ammonia.min, standards.ammonia.max),
            temperature: generateSmoothedValue(lastValues.temperature, standards.temperature.min, standards.temperature.max),
            date: new Date(lastDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        // 更新上一次的值
        lastValues = {
            ph: newData.ph,
            oxygen: newData.oxygen,
            ammonia: newData.ammonia,
            temperature: newData.temperature
        };
        
        // 加新生成的数据
        currentPond.data.push(newData);

        // 更新图表
        updateCharts();
        
        // 检查是否有异常值并记录到日志
        Object.keys(newData).forEach(param => {
            if (param !== 'date') {
                const value = newData[param];
                const standard = standards[param];
                if (value < standard.min || value > standard.max) {
                    addLog(LogType.WARNING, param, 
                        `${param}值异常：${value}，正常范围：${standard.min}-${standard.max}`);
                }
            }
        });
        
        // 更新localStorage
        const ponds = JSON.parse(localStorage.getItem('ponds'));
        ponds[pondId] = currentPond;
        localStorage.setItem('ponds', JSON.stringify(ponds));
        
        // 触发后台数据更新事件
        dispatchBackgroundUpdate(pondId, newData);
    }, 5000); // 每5秒更新一次，代表一天的变化
}

// 生成平滑变化的数值
function generateSmoothedValue(lastValue, min, max) {
    dataGenerationCount++;
    
    const range = max - min;
    const random = Math.random();
    
    // 每七次生成一次常值，且每次只有一个参数异常
    if (dataGenerationCount % 7 === 0) {
        // 确定这一次哪个参数会出现异常
        const paramType = min === standards[currentAbnormalParam].min;
        if (paramType) {
            switch(true) {
                case min === standards.ph.min:
                    return Math.random() < 0.5 ? min - 0.2 : max + 0.2;
                case min === standards.ammonia.min:
                    return max + range * 0.5;  // 氨氮只往高处超标
                case min === standards.oxygen.min:
                    return Math.random() < 0.7 ? min - 0.5 : max + 1;  // 更可能缺氧
                case min === standards.temperature.min:
                    return Math.random() < 0.5 ? min - 2 : max + 2;
                default:
                    return min + random * range;
            }
        }
    }
    
    let variation;
    switch(true) {
        case min === standards.ph.min:  // pH值
            variation = (Math.random() - 0.5) * 0.3;  // 增加波动范围
            break;
        case min === standards.ammonia.min:  // 氨氮
            variation = (Math.random() - 0.3) * 0.1;  // 允许上下波动但偏向上升
            break;
        case min === standards.oxygen.min:  // 溶氧量
            variation = (Math.random() - 0.5) * 0.8;  // 大的波动
            break;
        case min === standards.temperature.min:  // 温度
            variation = (Math.random() - 0.5) * 0.6;  // 中等波动
            break;
        default:
            variation = (Math.random() - 0.5) * 0.5;
    }
    
    let newValue = lastValue + variation;
    
    // 确保新值在合理范围内
    if (newValue < min) {
        newValue = min + Math.random() * (max - min) * 0.2;  // 增加回弹幅度
    } else if (newValue > max) {
        newValue = max - Math.random() * (max - min) * 0.2;  // 增加回弹幅度
    }
    
    // 保留一位小数
    return Math.round(newValue * 10) / 10;
}

// 格式化日期显示
function formatDate(date) {
    // 确保date是Date对象
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
}

// 生成初始数据时也需要修改
function generateInitialData() {
    dataGenerationCount = 0;
    
    const data = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i)); // 每个数据点代表一天
        data.unshift({
            ph: generateRandomValue(standards.ph.min, standards.ph.max),
            oxygen: generateRandomValue(standards.oxygen.min, standards.oxygen.max),
            ammonia: generateRandomValue(standards.ammonia.min, standards.ammonia.max),
            temperature: generateRandomValue(standards.temperature.min, standards.temperature.max),
            date: date.toISOString()
        });
    }
    return data;
}

// 生成初始数据时的随机值生成也需要调整
function generateRandomValue(min, max) {
    const range = max - min;
    const random = Math.random();
    dataGenerationCount++;
    
    // 每七次生成一次异常值
    if (dataGenerationCount % 7 === 0) {
        switch(true) {
            case min === standards.ph.min:
                return Math.random() < 0.5 ? min - 0.2 : max + 0.2;
            case min === standards.ammonia.min:
                return max + range * 0.5;  // 氨氮只往高处超标
            case min === standards.oxygen.min:
                return Math.random() < 0.7 ? min - 0.5 : max + 1;  // 更可能缺氧
            case min === standards.temperature.min:
                return Math.random() < 0.5 ? min - 2 : max + 2;
            default:
                return min + random * range;
        }
    }
    
    let value;
    switch(true) {
        case min === standards.ph.min:  // pH值
            value = min + range * 0.3 + random * range * 0.4;  // 集中在中间范围
            break;
        case min === standards.ammonia.min:  // 氨氮
            value = min + random * range * 0.6;  // 偏向较低值
            break;
        case min === standards.oxygen.min:  // 溶氧量
            value = min + range * 0.4 + random * range * 0.5;  // 偏向中高值
            break;
        case min === standards.temperature.min:  // 温度
            value = min + range * 0.2 + random * range * 0.6;  // 较均匀分布
            break;
        default:
            value = min + random * range;
    }
    
    return Math.round(value * 10) / 10;  // 保留一位小数
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initializePond); 

// 清塘操作
function clearPond() {
    if (confirm('确定要清塘吗？这将清除所有养殖数据，但保留鱼塘基本信息。')) {
        // 获取所有鱼塘数据
        const ponds = JSON.parse(localStorage.getItem('ponds')) || [];
        
        // 更新当前鱼塘数据
        ponds[currentPondId] = {
            ...currentPond,
            fish: null,
            data: [],
            needsFishSelection: true
        };
        
        // 保存更新
        localStorage.setItem('ponds', JSON.stringify(ponds));
        
        // 添加系统日志
        addLog(LogType.SYSTEM, null, '鱼塘已清空，等待重新选择鱼种');
        
        // 显示提示并跳转回鱼塘管理页面
        alert('清塘成功！即将返回鱼塘管理页面。');
        window.location.href = 'ponds.html';
    }
}

// 删除鱼塘
function confirmDelete() {
    if (confirm('确定要删除这个鱼塘吗？此操作不可恢复。')) {
        // 获取所有鱼塘数据
        const ponds = JSON.parse(localStorage.getItem('ponds')) || [];
        
        // 删除当前鱼塘
        ponds.splice(currentPondId, 1);
        
        // 保存更新
        localStorage.setItem('ponds', JSON.stringify(ponds));
        
        // 清除相关日志
        const allLogs = JSON.parse(localStorage.getItem('pondLogs') || '{}');
        delete allLogs[currentPondId];
        localStorage.setItem('pondLogs', JSON.stringify(allLogs));
        
        // 显示提示并跳转回鱼塘管理页面
        alert('鱼塘已删除！');
        window.location.href = 'ponds.html';
    }
}

// 显示鱼种选择对话框
function showFishSelectionDialog() {
    document.getElementById('fishSelectionDialog').style.display = 'block';
    const pond = ponds[currentPondId];
    const pondType = pond.type || 'commercial';
    
    // 更新鱼类推荐
    const recommendations = fishRecommendations[pondType].high;
    const recommendationSection = document.getElementById('fishRecommendation');
    
    recommendationSection.innerHTML = `
        <h3>推荐养殖鱼类</h3>
        <div class="fish-recommendation">
            ${recommendations.map(fish => `
                <div class="fish-item">
                    <div class="fish-detail-btn" onclick="event.stopPropagation(); showFishDetail('${fish.id}')">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="fish-content" onclick="selectFish('${fish.id}')">
                        <h4>${fish.name}</h4>
                        <p>适宜条件：</p>
                        <ul>
                            <li>水温: ${fish.suitable.temperature}</li>
                            <li>pH值: ${fish.suitable.ph}</li>
                            <li>耗氧量: ${fish.suitable.oxygen}</li>
                        </ul>
                        ${pondType === 'commercial' ? 
                            `<p>预期利润: ${fish.profit.min}-${fish.profit.max}元/年</p>
                             <p>养殖周期: ${fish.cycle}</p>` :
                            `<p>养殖难度: ${fish.difficulty}</p>
                             <p>经济价值: ${fish.value}</p>`
                        }
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // 更新鱼种选择
    const fishSelection = document.getElementById('fishSelection');
    const fishSelectionGrid = fishSelection.querySelector('.fish-selection-grid');
    fishSelectionGrid.innerHTML = recommendations.map(fish => `
        <div class="fish-option" data-fish-id="${fish.id}" 
            onclick="selectFish(this)" 
            ondblclick="selectFishAndConfirm(this)">
            <h4>${fish.name}</h4>
            <ul>
                <li>水温: ${fish.suitable.temperature}</li>
                <li>pH值: ${fish.suitable.ph}</li>
                <li>溶解氧: ${fish.suitable.oxygen}</li>
                ${pondType === 'commercial' ? 
                    `<li>预期利润: ${fish.profit}</li>
                     <li>养殖周期: ${fish.cycle}</li>` :
                    `<li>养殖难度: ${fish.difficulty}</li>
                     <li>经济价值: ${fish.value}</li>`
                }
            </ul>
        </div>
    `).join('');
    
    // 重置选择状态
    document.getElementById('confirmBtn').disabled = true;
}

// 选择鱼种
function selectFish(element) {
    document.querySelectorAll('#fishSelectionDialog .fish-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');
    document.getElementById('confirmBtn').disabled = false;
}

// 双击选择并确认
function selectFishAndConfirm(element) {
    selectFish(element);
    confirmFishSelection();
}

// 修改确认鱼种选择函数
function confirmFishSelection() {
    const selectedFish = document.querySelector('.fish-option.selected');
    
    if (!selectedFish) {
        alert('请选择鱼种！');
        return;
    }
    
    const fishId = selectedFish.dataset.fishId;
    const fishData = fishRecommendations[currentPond.type].high.find(fish => fish.id === fishId);
    
    // 获取所有鱼塘数据
    const ponds = JSON.parse(localStorage.getItem('ponds')) || [];
    
    // 更新鱼数据
    ponds[currentPondId] = {
        ...currentPond,
        fish: {
            id: fishId,
            name: fishData.name,
            suitable: fishData.suitable
        },
        needsFishSelection: false,  // 清除选择鱼种的标记
        data: generateInitialData()
    };
    
    // 更新localStorage
    localStorage.setItem('ponds', JSON.stringify(ponds));
    
    // 关闭对话框
    closeFishSelectionDialog();
    
    // 显示成功消息
    alert('鱼种选择成功！即将开始监测数据记录。');
    
    // 刷新页面以开始新的监测
    window.location.reload();
}

// 关闭鱼种选择对话框
function closeFishSelectionDialog() {
    const dialog = document.getElementById('fishSelectionDialog');
    dialog.style.display = 'none';
    document.getElementById('confirmBtn').disabled = true;
    dialog.querySelector('.fish-option.selected')?.classList.remove('selected');
}

// 显示日志详细信息
function showLogDetail(logId) {
    const log = pondLogs.find(l => l.id === logId);
    if (!log) return;
    
    let dialogContent;
    switch(log.type) {
        case LogType.WARNING:
            // 获取警告信息
            const warningInfo = generateWarningMessage(log.param, parseFloat(log.details.split('：')[1]));
            dialogContent = `
                <div class="warning-content">
                    <h2>${warningInfo.title}</h2>
                    <p class="warning-value">${log.details}</p>
                    
                    <div class="warning-section">
                        <h3>可能原因：</h3>
                        <ul>
                            ${warningInfo.cause.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="warning-section">
                        <h3>解决方案：</h3>
                        <ul>
                            ${warningInfo.solution.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            break;
            
        case LogType.ADJUSTMENT:
            // 解析调节前后的值
            const values = log.details.match(/[\d.]+/g);
            const [initialValue, finalValue] = values || [0, 0];
            dialogContent = `
                <div class="warning-content adjustment-result">
                    <h2><span class="success-icon">✓</span> 参数调节记录</h2>
                    <div class="result-details">
                        <div class="parameter-change">
                            <p class="old-value">调节前：${initialValue}</p>
                            <span class="arrow">→</span>
                            <p class="new-value">调节后：${finalValue}</p>
                        </div>
                        <div class="standard-range">
                            <p>标准范围：${standards[log.param].min} - ${standards[log.param].max}</p>
                        </div>
                        <div class="adjustment-tips">
                            <h3>维护建议：</h3>
                            <ul>
                                ${getMaintenanceTips(log.param)}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        default:
            dialogContent = `
                <div class="warning-content">
                    <h2>系统记录</h2>
                    <p class="log-time">${formatLogTime(log.timestamp)}</p>
                    <p class="log-details">${log.details}</p>
                </div>
            `;
    }
    
    // 创建并显示弹窗
    const dialog = document.createElement('div');
    dialog.className = 'warning-dialog';
    dialog.innerHTML = `
        <div class="warning-content">
            ${dialogContent}
            <div class="warning-buttons">
                <button onclick="closeWarningDialog(this.parentElement.parentElement.parentElement)">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

// 添加后台数据更新事件
function dispatchBackgroundUpdate(pondId, newData) {
    const event = new CustomEvent('pondDataUpdate', {
        detail: { pondId, data: newData }
    });
    window.dispatchEvent(event);
}

// 修改页面卸载事件
window.addEventListener('beforeunload', () => {
    // 保存当前的监测状态
    localStorage.setItem('backgroundMonitoring', JSON.stringify(backgroundMonitoring));
});

// 在页面加载时恢复后台监测
window.addEventListener('load', () => {
    const savedMonitoring = JSON.parse(localStorage.getItem('backgroundMonitoring') || '{}');
    
    // 恢复所有鱼塘的后台监测
    Object.keys(savedMonitoring).forEach(pondId => {
        if (!backgroundMonitoring[pondId]) {
            const ponds = JSON.parse(localStorage.getItem('ponds'));
            const pond = ponds[pondId];
            if (pond) {
                startBackgroundMonitoring(pond, pondId);
            }
        }
    });
});

// 后台监测函数
function startBackgroundMonitoring(pond, pondId) {
    backgroundMonitoring[pondId] = setInterval(() => {
        // 获取最新数据
        const ponds = JSON.parse(localStorage.getItem('ponds'));
        const currentPond = ponds[pondId];
        
        if (!currentPond) {
            clearInterval(backgroundMonitoring[pondId]);
            delete backgroundMonitoring[pondId];
            return;
        }
        
        // 生成新数据
        const lastData = currentPond.data[currentPond.data.length - 1];
        const lastDate = new Date(lastData.date);
        
        const newData = {
            ph: generateSmoothedValue(lastData.ph, standards.ph.min, standards.ph.max),
            oxygen: generateSmoothedValue(lastData.oxygen, standards.oxygen.min, standards.oxygen.max),
            ammonia: generateSmoothedValue(lastData.ammonia, standards.ammonia.min, standards.ammonia.max),
            temperature: generateSmoothedValue(lastData.temperature, standards.temperature.min, standards.temperature.max),
            date: new Date(lastDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        // 更新数据
        currentPond.data.shift();
        currentPond.data.push(newData);
        
        // 检查异常值
        Object.keys(newData).forEach(param => {
            if (param !== 'date') {
                const value = newData[param];
                const standard = standards[param];
                if (value < standard.min || value > standard.max) {
                    addLog(LogType.WARNING, param, 
                        `${param}值异常：${value}，正常范围：${standard.min}-${standard.max}`);
                }
            }
        });
        
        // 保存更新
        ponds[pondId] = currentPond;
        localStorage.setItem('ponds', JSON.stringify(ponds));
        
        // 触发更新事件
        dispatchBackgroundUpdate(pondId, newData);
    }, 5000);
}

// 清空日志
function clearLogs() {
    if (confirm('确定要清空所有日志记录吗？此操作不可恢复。')) {
        const pondId = new URLSearchParams(window.location.search).get('id');
        
        // 清空内存中的日志
        pondLogs = [];
        
        // 清空localStorage中的日志
        const allLogs = JSON.parse(localStorage.getItem('pondLogs') || '{}');
        allLogs[pondId] = [];
        localStorage.setItem('pondLogs', JSON.stringify(allLogs));
        
        // 重新渲染日志列表
        renderLogs();
        
        // 添加系统日志
        addLog(LogType.SYSTEM, null, '日志已清空');
    }
}

// 渲染鱼类选择卡片
function renderFishCards(fishes) {
    const container = document.getElementById('fishSelectionContainer');
    container.innerHTML = fishes.map(fish => `
        <div class="fish-card">
            <div class="fish-detail-btn" onclick="showFishDetail('${fish.id}')">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="fish-card-content" onclick="selectFish('${fish.id}')">
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
            </div>
        </div>
    `).join('');
}

// 更新鱼种选择
function updateFishSelection(pondType) {
    const fishSelection = document.getElementById('fishSelection');
    const fishSelectionGrid = fishSelection.querySelector('.fish-selection-grid');
    
    // 获取对应类型的鱼类数据
    const fishList = fishRecommendations[pondType].high;
    
    fishSelectionGrid.innerHTML = fishList.map(fish => `
        <div class="fish-selection-card" onclick="selectFish('${fish.id}')">
            <div class="fish-detail-btn" onclick="event.stopPropagation(); showFishDetail('${fish.id}')">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="fish-card-content">
                <img src="${fish.image || getDefaultFishImage(pondType)}" alt="${fish.name}" class="fish-image">
                <div class="fish-info">
                    <h3>${fish.name}</h3>
                    <p class="fish-type">${pondType === 'commercial' ? '商业养殖' : '观赏鱼类'}</p>
                    <div class="fish-params">
                        <span>水温: ${fish.suitable.temperature}</span>
                        <span>pH值: ${fish.suitable.ph}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
} 