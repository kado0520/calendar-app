// index2.html用の処理
document.addEventListener('DOMContentLoaded', () => {
    const goToPage1Button = document.getElementById('go-to-page1');
    if (goToPage1Button) {
        goToPage1Button.addEventListener('click', () => {
            window.location.href = 'index.html'; // 画面1に戻る
        });
    }
});
const timechoice = () => {
    $('.text').timepicker({ 'timeFormat': 'H:i' });
};

window.addEventListener('DOMContentLoaded', () => {
    const selectedDate = JSON.parse(localStorage.getItem('selectedDate'));  // ローカルストレージからデータを取得
    if (selectedDate) {
        console.log("Selected date info:", selectedDate);  // コンソールでデバッグ
        document.getElementById('dateInfo').textContent = `Selected Date: ${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`;
    } else {
        console.log("No date selected.");
    }
});


const toggleInput = document.getElementById('toggle');
const statusText = document.getElementById('status');

toggleInput.addEventListener('change', () => {
    const status = toggleInput.checked ? 1 : 0; // オンが1、オフが0
    statusText.textContent = `Current Status: ${status}`; // ステータスを表示
});

// script.js
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const calendar = document.getElementById('calendar');
    const selectedDateText = document.getElementById('selected-date');

    dateInput.addEventListener('click', () => {
        calendar.style.display = calendar.style.display === 'block' ? 'none' : 'block';
        renderCalendar();
    });

    function renderCalendar() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const calendarHtml = `
            <table>
                <thead>
                    <tr>
                        <th>日</th>
                        <th>月</th>
                        <th>火</th>
                        <th>水</th>
                        <th>木</th>
                        <th>金</th>
                        <th>土</th>
                    </tr>
                </thead>
                <tbody>
                    ${createCalendarRows(firstDay, daysInMonth)}
                </tbody>
            </table>
        `;
        calendar.innerHTML = calendarHtml;
    }

    function createCalendarRows(firstDay, daysInMonth) {
        let rows = '';
        let dayOfWeek = firstDay.getDay();
        let days = '';

        // 空白を挿入
        for (let i = 0; i < dayOfWeek; i++) {
            days += '<td></td>';
        }

        // 日付を挿入
        for (let day = 1; day <= daysInMonth; day++) {
            days += `<td class="day" data-date="${day}">${day}</td>`;
            dayOfWeek++;
            if (dayOfWeek === 7) {
                rows += `<tr>${days}</tr>`;
                days = '';
                dayOfWeek = 0;
            }
        }

        // 最後の行を追加
        if (days) {
            rows += `<tr>${days}</tr>`;
        }

        return rows;
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('day')) {
            const selectedDay = event.target.getAttribute('data-date');
            const date = new Date();
            const month = date.getMonth() + 1; // 0始まりなので +1
            const year = date.getFullYear();
            dateInput.value = `${year}-${month}-${selectedDay}`; // YYYY-MM-DD形式で設定
            selectedDateText.textContent = `選択された日付: ${year}-${month}-${selectedDay}`;
            calendar.style.display = 'none'; // カレンダーを非表示にする
        } else if (!event.target.closest('.date-picker-container')) {
            calendar.style.display = 'none'; // カレンダーを非表示にする
        }
    });
});


