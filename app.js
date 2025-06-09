// Campaign data
const campaignData = [
    {
        platform: "YouTube",
        impressions: 25000000,
        people: 8000000,
        cookies: 12000000,
        budget: 2500000
    },
    {
        platform: "VK",
        impressions: 18000000,
        people: 12000000,
        cookies: 15000000,
        budget: 1800000
    },
    {
        platform: "MyTarget",
        impressions: 15000000,
        people: 7000000,
        cookies: 9000000,
        budget: 1200000
    },
    {
        platform: "Yandex",
        impressions: 12000000,
        people: 6000000,
        cookies: 8000000,
        budget: 960000
    },
    {
        platform: "RBC",
        impressions: 8000000,
        people: 4000000,
        cookies: 5000000,
        budget: 800000
    },
    {
        platform: "Telegram",
        impressions: 4000000,
        people: 3000000,
        cookies: 3500000,
        budget: 480000
    }
];

const totals = {
    impressions: 82000000,
    uniquePeople: 17000000,
    totalCookies: 36750000,
    totalBudget: 7740000,
    frequency: 2.23,
    cookieOverlap: 17500000,
    cookiesPerPerson: 2.16,
    peopleToLegionsRatio: 0.67
};

// Task completion tracking
let completedTasks = new Set();

// Task definitions with correct answers
const tasks = {
    1: {
        type: 'radio',
        correctAnswer: 'b',
        explanation: "47 млн показов ушли на частоту контакта. 82 млн показов ÷ 36,7 млн кук = 2.23 показа на уника и 2,92 на человека в среднем . Это нормально и эффективно, так как для запоминания бренда нужно несколько контактов с рекламой."
    },
    2: {
        type: 'number',
        correctAnswers: {
            cost: 8845714,
            impressions: 120000000
        },
        explanation: "Показы: 40 млн × 3 = 120 млн показов. CPM из данных: ₽7,740,000 ÷ 82 млн × 1000 = ₽94.4. Стоимость: 120 млн × ₽94.4 ÷ 1000 = ₽8,845,714"
    },
    3: {
        type: 'select',
        correctAnswers: {
            peoplePlatform: "Telegram",
            cookiesPlatform: "VK"
        },
        explanation: "По людям эффективнее Telegram (₽160 за 1000 человек), по кукам - VK (₽120 за 1000 кук). Разница из-за пересечений аудиторий и качества трафика."
    },
    4: {
        type: 'radio',
        correctAnswer: 'b',
        explanation: "Прямое сравнение охватов некорректно из-за разных методик измерения, определений 'человека', целевых аудиторий, площадок и качества контакта. Никогда не сравнивайтесь с конкурентами по общим цифрам - у вас разные бизнесы и методики. Лучше сравниваться в чем-то одном с одной системой измерения."
    },
    5: {
        type: 'number',
        correctAnswers: {
            newReach: 26320000
        },
        explanation: "YouTube потеряет 30% показов: 25млн × 0.7 = 17,5 млн показов. Далее переводим в куки и людей и учитываем пересечения площадок. Общий охват в людях уменьшится: 28 млн - 1,68 млн = 26,32 млн человек."
    },
    6: {
        type: 'number',
        correctAnswers: {
            maxReach: 48375000
        },
        explanation: "Telegram: ₽480,000 ÷ 3 млн = ₽160 за 1000 человек. За весь бюджет: ₽7,740,000 ÷ ₽160 × 1000 = 48.375 млн человек. Но такая концентрация рискованна из-за ограничений площадки и усталости аудитории."
    }
};

// Initialize the application
function init() {
    populateCampaignData();
    updateProgress();
    initTooltips();
}

// Populate campaign data table
function populateCampaignData() {
    const tbody = document.getElementById('campaignTableBody');
    tbody.innerHTML = '';
    
    campaignData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.platform}</strong></td>
            <td class="number-format">${formatNumber(item.impressions)}</td>
            <td class="number-format">${formatNumber(item.cookies)}</td>
            <td class="number-format">${formatNumber(item.people)}</td>
            <td class="number-format">₽${formatNumber(item.budget)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltipBtns = document.querySelectorAll('.tooltip-btn');
    const tooltip = document.getElementById('tooltip');
    
    tooltipBtns.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const tooltipText = e.target.getAttribute('data-tooltip');
            showTooltip(e.target, tooltipText);
        });
        
        btn.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        btn.addEventListener('click', (e) => {
            const tooltipText = e.target.getAttribute('data-tooltip');
            showTooltip(e.target, tooltipText);
            
            // Hide after 3 seconds on click
            setTimeout(() => {
                hideTooltip();
            }, 3000);
        });
    });
}

// Show tooltip
function showTooltip(element, text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = text;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 10) + 'px';
    tooltip.classList.add('show');
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('show');
}

// Format numbers with commas
function formatNumber(num) {
    return num.toLocaleString('ru-RU');
}

// Check answer for a specific task
function checkAnswer(taskId) {
    const task = tasks[taskId];
    let isCorrect = false;
    let userAnswer = '';
    
    switch (task.type) {
        case 'radio':
            const selectedRadio = document.querySelector(`input[name="answer-${taskId}"]:checked`);
            if (selectedRadio) {
                userAnswer = selectedRadio.value;
                isCorrect = userAnswer === task.correctAnswer;
            }
            break;
            
        case 'number':
            if (taskId === 2) {
                const cost = parseInt(document.getElementById(`cost-${taskId}`).value) || 0;
                const impressions = parseInt(document.getElementById(`impressions-${taskId}`).value) || 0;
                isCorrect = checkNumberAnswers(cost, impressions, task.correctAnswers.cost, task.correctAnswers.impressions);
                userAnswer = `Стоимость: ₽${formatNumber(cost)}, Показы: ${formatNumber(impressions)}`;
            } else if (taskId === 5) {
                const newReach = parseInt(document.getElementById(`new-reach-${taskId}`).value) || 0;
                isCorrect = checkSingleNumber(newReach, task.correctAnswers.newReach);
                userAnswer = `Новый охват: ${formatNumber(newReach)}`;
            } else if (taskId === 6) {
                const maxReach = parseInt(document.getElementById(`max-reach-${taskId}`).value) || 0;
                isCorrect = checkSingleNumber(maxReach, task.correctAnswers.maxReach);
                userAnswer = `Максимальный охват: ${formatNumber(maxReach)}`;
            }
            break;
            
        case 'select':
            const peoplePlatform = document.getElementById(`people-platform-${taskId}`).value;
            const cookiesPlatform = document.getElementById(`cookies-platform-${taskId}`).value;
            isCorrect = peoplePlatform === task.correctAnswers.peoplePlatform && 
                       cookiesPlatform === task.correctAnswers.cookiesPlatform;
            userAnswer = `Люди: ${peoplePlatform}, Куки: ${cookiesPlatform}`;
            break;
    }
    
    showFeedback(taskId, isCorrect, userAnswer);
    
    if (isCorrect && !completedTasks.has(taskId)) {
        completedTasks.add(taskId);
        updateTaskStatus(taskId, true);
        updateProgress();
        
        // Add completion animation
        const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
        taskCard.classList.add('completed');
        setTimeout(() => taskCard.classList.remove('completed'), 500);
    } else if (!isCorrect) {
        updateTaskStatus(taskId, false);
    }
}

// Check number answers with tolerance
function checkNumberAnswers(userCost, userImpressions, correctCost, correctImpressions) {
    const costTolerance = correctCost * 0.1; // 10% tolerance
    const impressionsTolerance = correctImpressions * 0.1; // 10% tolerance
    
    const costCorrect = Math.abs(userCost - correctCost) <= costTolerance;
    const impressionsCorrect = Math.abs(userImpressions - correctImpressions) <= impressionsTolerance;
    
    return costCorrect && impressionsCorrect;
}

// Check single number with tolerance
function checkSingleNumber(userNumber, correctNumber) {
    const tolerance = correctNumber * 0.05; // 5% tolerance
    return Math.abs(userNumber - correctNumber) <= tolerance;
}

// Show feedback for answers
function showFeedback(taskId, isCorrect, userAnswer) {
    const feedbackElement = document.getElementById(`feedback-${taskId}`);
    const task = tasks[taskId];
    
    feedbackElement.className = `answer-feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
    
    const icon = isCorrect ? '✅' : '❌';
    const status = isCorrect ? 'Правильно!' : 'Неправильно';
    
    let content = `
        <div class="feedback-header">
            <span>${icon}</span>
            <strong>${status}</strong>
        </div>
        <div class="feedback-content">
    `;
    
    if (!isCorrect && userAnswer) {
        content += `<p><strong>Ваш ответ:</strong> ${userAnswer}</p>`;
    }
    
    if (task.type === 'radio') {
        content += `<h4>Объяснение:</h4>`;
        content += `<p>${task.explanation}</p>`;
    } else if (task.type === 'number') {
        content += `<h4>Правильный ответ:</h4>`;
        if (taskId === 2) {
            content += `<p><strong>Стоимость:</strong> ₽${formatNumber(task.correctAnswers.cost)}</p>`;
            content += `<p><strong>Показы:</strong> ${formatNumber(task.correctAnswers.impressions)}</p>`;
        } else if (taskId === 5) {
            content += `<p><strong>Новый охват:</strong> ${formatNumber(task.correctAnswers.newReach)} человек</p>`;
        } else if (taskId === 6) {
            content += `<p><strong>Максимальный охват:</strong> ${formatNumber(task.correctAnswers.maxReach)} человек</p>`;
        }
        content += `<h4>Объяснение:</h4>`;
        content += `<p>${task.explanation}</p>`;
    } else if (task.type === 'select') {
        content += `<h4>Правильный ответ:</h4>`;
        content += `<p><strong>Самая эффективная для людей:</strong> ${task.correctAnswers.peoplePlatform}</p>`;
        content += `<p><strong>Самая эффективная для кук:</strong> ${task.correctAnswers.cookiesPlatform}</p>`;
        content += `<h4>Объяснение:</h4>`;
        content += `<p>${task.explanation}</p>`;
    }
    
    content += '</div>';
    feedbackElement.innerHTML = content;
}

// Update task status icon
function updateTaskStatus(taskId, isCorrect) {
    const statusElement = document.getElementById(`status-${taskId}`);
    if (isCorrect) {
        statusElement.innerHTML = '<span class="status-correct">✅</span>';
    } else {
        statusElement.innerHTML = '<span class="status-incorrect">❌</span>';
    }
}

// Update progress bar
function updateProgress() {
    const totalTasks = Object.keys(tasks).length;
    const completed = completedTasks.size;
    const percentage = (completed / totalTasks) * 100;
    
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = `${completed} из ${totalTasks} заданий выполнено`;
    
    if (completed === totalTasks) {
        setTimeout(() => {
            alert('🎉 Поздравляем! Вы успешно завершили все задания кейса медиапланера МегаФон!');
        }, 500);
    }
}

// Reset task answers
function resetTask(taskId) {
    const task = tasks[taskId];
    
    // Clear inputs based on task type
    switch (task.type) {
        case 'radio':
            const radioButtons = document.querySelectorAll(`input[name="answer-${taskId}"]`);
            radioButtons.forEach(radio => radio.checked = false);
            break;
            
        case 'number':
            if (taskId === 2) {
                document.getElementById(`cost-${taskId}`).value = '';
                document.getElementById(`impressions-${taskId}`).value = '';
            } else if (taskId === 5) {
                document.getElementById(`new-reach-${taskId}`).value = '';
            } else if (taskId === 6) {
                document.getElementById(`max-reach-${taskId}`).value = '';
            }
            break;
            
        case 'select':
            document.getElementById(`people-platform-${taskId}`).value = '';
            document.getElementById(`cookies-platform-${taskId}`).value = '';
            break;
    }
    
    // Hide feedback
    const feedbackElement = document.getElementById(`feedback-${taskId}`);
    feedbackElement.className = 'answer-feedback';
    feedbackElement.innerHTML = '';
    
    // Clear status
    const statusElement = document.getElementById(`status-${taskId}`);
    statusElement.innerHTML = '';
    
    // Remove from completed tasks
    if (completedTasks.has(taskId)) {
        completedTasks.delete(taskId);
        updateProgress();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
