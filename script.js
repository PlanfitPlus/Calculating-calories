// تحديث شريط التقدم
function updateProgressBar(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((s, index) => {
        if (index < step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

function calculateCalories() {
    // التحقق من المدخلات
    const age = parseFloat(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    // التحقق من صحة المدخلات
    if (!validateInputs(age, weight, height)) {
        showResult('<div class="error"><i class="fas fa-exclamation-circle"></i> الرجاء إدخال قيم صحيحة لجميع الحقول</div>');
        return;
    }

    // حساب معدل الأيض الأساسي (BMR)
    let bmr;
    if (gender === 'male') {
        // معادلة هاريس-بينيدكت للرجال
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        // معادلة هاريس-بينيدكت للنساء
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // حساب السعرات الحرارية اليومية المطلوبة
    const dailyCalories = Math.round(bmr * activity);
    
    // حساب احتياج الماء اليومي (مل)
    const waterNeeds = Math.round(weight * 30); // 30 مل لكل كيلوغرام من وزن الجسم
    
    // حساب نسب العناصر الغذائية الموصى بها
    const protein = Math.round(dailyCalories * 0.3 / 4); // 30% من السعرات الحرارية، 4 سعرات لكل غرام
    const carbs = Math.round(dailyCalories * 0.5 / 4);   // 50% من السعرات الحرارية، 4 سعرات لكل غرام
    const fats = Math.round(dailyCalories * 0.2 / 9);    // 20% من السعرات الحرارية، 9 سعرات لكل غرام
    
    // تحديث شريط التقدم
    updateProgressBar(2);

    // عرض النتائج
    displayResults(dailyCalories, bmr, protein, carbs, fats, waterNeeds / 1000);
}

function displayResults(calories, bmr, protein, carbs, fats, water) {
    const resultSection = document.querySelector('.result');
    resultSection.style.display = 'block';
    
    // إنشاء العناصر الرئيسية
    const mainMetrics = `
        <div class="result-header">
            <i class="fas fa-chart-pie"></i>
            <h3>نتائج حساب السعرات الحرارية</h3>
        </div>
        <div class="result-content">
            <div class="main-metrics">
                <div class="metric-card">
                    <i class="fas fa-fire"></i>
                    <div class="metric-value">${calories.toFixed(0)}</div>
                    <div class="metric-label">السعرات الحرارية اليومية</div>
                </div>
                <div class="metric-card">
                    <i class="fas fa-heartbeat"></i>
                    <div class="metric-value">${bmr.toFixed(0)}</div>
                    <div class="metric-label">معدل الأيض الأساسي</div>
                </div>
            </div>

            <div class="nutrition-circle">
                <div class="nutrition-header">
                    <h4>توزيع العناصر الغذائية</h4>
                </div>
                <div class="nutrition-content">
                    <div class="chart-container">
                        <canvas id="nutritionChart"></canvas>
                    </div>
                    <div class="nutrition-details">
                        <div class="nutrition-item protein">
                            <i class="fas fa-drumstick-bite"></i>
                            <div class="nutrition-item-content">
                                <div class="nutrition-item-label">البروتين</div>
                                <div class="nutrition-item-value">${protein.toFixed(0)} جرام</div>
                            </div>
                        </div>
                        <div class="nutrition-item carbs">
                            <i class="fas fa-bread-slice"></i>
                            <div class="nutrition-item-content">
                                <div class="nutrition-item-label">الكربوهيدرات</div>
                                <div class="nutrition-item-value">${carbs.toFixed(0)} جرام</div>
                            </div>
                        </div>
                        <div class="nutrition-item fats">
                            <i class="fas fa-cheese"></i>
                            <div class="nutrition-item-content">
                                <div class="nutrition-item-label">الدهون</div>
                                <div class="nutrition-item-value">${fats.toFixed(0)} جرام</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="water-needs">
                <div class="water-content">
                    <div class="water-icon">
                        <i class="fas fa-tint"></i>
                    </div>
                    <div class="water-info">
                        <h4>احتياجات الماء اليومية</h4>
                        <div class="water-value">${water.toFixed(1)} لتر</div>
                        <div class="water-tips">
                            <ul>
                                <li>اشرب الماء بانتظام على مدار اليوم</li>
                                <li>زيد كمية الماء خلال التمارين</li>
                                <li>راقب لون البول للتأكد من كفاية شرب الماء</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    resultSection.innerHTML = mainMetrics;

    // إنشاء الرسم البياني للعناصر الغذائية
    const ctx = document.getElementById('nutritionChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['البروتين', 'الكربوهيدرات', 'الدهون'],
            datasets: [{
                data: [protein, carbs, fats],
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
                borderWidth: 0,
                borderRadius: 5
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

    // تمرير إلى النتائج بشكل سلس
    smoothScroll('.result');
}

function validateInputs(age, weight, height) {
    return (
        !isNaN(age) && age > 0 && age < 120 &&
        !isNaN(weight) && weight > 0 && weight < 300 &&
        !isNaN(height) && height > 0 && height < 300
    );
}

function showResult(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = message;
    resultDiv.style.display = 'block';
    resultDiv.classList.add('show');
    
    // تمرير إلى النتائج
    smoothScroll('#result');
}

// إضافة دالة للتمرير السلس
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// إضافة مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحديث شريط التقدم عند البداية
    updateProgressBar(1);
    
    // إضافة التحقق من المدخلات أثناء الكتابة
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    });
});
