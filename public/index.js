const weeks = ['日', '月', '火', '水', '木', '金', '土']
const date = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
const today = date.getDate()
const thisYear = year
const thisMonth = month
const stage = document.getElementById("stage")
const squareTemplate = document.getElementById("square-template")
const weekConteiner = document.getElementById("week")

// 月切り替え用の要素
const prevMonth = document.getElementById("prev-month")
const nextMonth = document.getElementById("next-month")
const check = document.getElementById("check")

// メニューダイヤログの要素達
const dialog = document.getElementById("dialog")
const cancel = document.getElementById("cancel")
const schedule = document.getElementById("schedule")
// const memo = document.getElementById("memo")

// 予定のダイヤログの要素達
const scheduleDialog = document.getElementById("schedule-dialog")
const title = document.getElementById("title")
const detail = document.getElementById("detail")
const back = document.getElementById("back")

const allDay = document.getElementById("all-day")
const overDay = document.getElementById("over-day")
const allDayS = document.getElementById("all-day-s")
const overDayS = document.getElementById("over-day-s")
let allDayState = 0 // トグルスイッチの状態
let overDayState = 0

const setTime = document.getElementById("set-time")
const startTime = document.getElementById("start-time")
const endTime = document.getElementById("end-time")

const setDayTime = document.getElementById("set-day-time")
const startDateTime = document.getElementById("start-date-time")
const endDateTime = document.getElementById("end-date-time")

const setDay = document.getElementById("set-day")
const start = document.getElementById("start-date")
const end = document.getElementById("end-date")

const deside = document.getElementById("decide")

const preview = document.getElementById("preview")

let str = []
let en = []

let yearMonthDate = '' //選択した年月日を記録
let box = [] //　日付を格納
let squares = [] // マスを格納
let obj = {} // 仮情報保存用
let count = 0
let ele = null
let eleBox = []
let pBox = []
let clickElementNumber = 0
let squareNumber = 0

// new dialog element
const previewDialog = document.getElementById("preview-dialog")
const previewDetail = document.getElementById("detail-preview")
const removeButton = document.getElementById("remove")
const editButton = document.getElementById("edit")
const exitButton = document.getElementById("exit")
let state = 0
let state2 = 0
let data = {}

const save = document.getElementById("save")
const call = document.getElementById("call")
const clearButton = document.getElementById("clear")
const pass = document.getElementById("pass")
const allClear = document.getElementById("all-clear")

const createDateArray = () => {
    const dateArray = {}; // 年をキーとするオブジェクト

    // 2020年から2050年までの各年
    for (let year = 2020; year <= 2050; year++) {
        dateArray[year] = {}; // 年ごとのオブジェクトを作成

        // 各年の月を1から12までループ
        for (let month = 1; month <= 12; month++) {
            dateArray[year][month] = []; // 月ごとの配列を作成

            // 各月の日数を取得
            const daysInMonth = new Date(year, month, 0).getDate();

            // 各月の日をオブジェクト化
            for (let day = 1; day <= daysInMonth; day++) {
                dateArray[year][month][day] = {
                    year: year,
                    month: month,
                    day: day
                };
            }
        }
    }
    return dateArray;
};

let dateObjects = createDateArray();
// console.log(dateObjects);

const creatWeekHeader = () => {
    weeks.forEach(day => {
        const dayElement = document.createElement('div')
        dayElement.classList.add('week-day')
        dayElement.textContent = day

        if (day === '土') {
            dayElement.style.color = '#64B5F6'
        } else if (day === '日') {
            dayElement.style.color = 'red'
        }
        weekConteiner.appendChild(dayElement)
    })
}

const createPreview = (s, t) => {
    for (let i = 0; i < 100; i++) {
        const p = s + i
        if (dateObjects[year][month][box[t]].hasOwnProperty(p)) {
            const previewSchedule = dateObjects[year][month][box[t]][p]
            const previewElement = document.createElement('h2')
            previewElement.textContent = '・' + previewSchedule.title
            preview.appendChild(previewElement)
            count++
            eleBox[count] = previewSchedule
            pBox[count] = p
            previewElement.id = 'p' + count
            previewElement.style.cursor = 'pointer'

            //ホバーされたときにクラスを追加
            previewElement.addEventListener('mouseenter', () => {
                previewElement.classList.add('previewElement-hovered'); // 'hovered' クラスを追加
            });
            // ホバーが外れたときにクラスを削除
            previewElement.addEventListener('mouseleave', () => {
                previewElement.classList.remove('previewElement-hovered'); // 'hovered' クラスを削除
            });





        }
    }

}


const clickSquareEvent = (index) => { // マスをクリックされると呼び出される、indexはマスの番号

    if (box[index] === 0) {
        alert("日付はありません")
        return
    }
    if (box[index] < 10) {
        yearMonthDate = selecter() + '-0' + box[index]  // inputタグは文字列でYYYY-MMの形のため月は"-0"を入れとく
    } else {
        yearMonthDate = selecter() + '-' + box[index] // HTML inputタグ用に文字列で選択した年月日を記録
    }
    // console.log(yearMonthDate)

    // 選択した年月日をダイヤログに表示
    document.getElementById("dialog-label").textContent = year + '/' + month + '/' + box[index]
    document.getElementById("select-date").textContent = year + '/' + month + '/' + box[index]

    count = 0
    ele = null
    clickElementNumber = 0
    squareNumber = index
    state = 0

    createPreview('longSchedule', index)
    createPreview('shortSchedule', index)

    scrollLock()
    dialog.showModal() //メニューダイヤログを開く 

    for (let i = 1; i <= count; i++) { // ダイヤログに詳細を表示するときはifで四パターンやる long short allDay
        ele = document.getElementById("p" + i) // 調べ方はプロパティの有無 eleBox[i]でクリックしたオブジェクト取得
        ele.addEventListener("click", () => {  // pBox[i]にプロパティ名を入れたからこれを使い削除編集を行う 
            clickElementNumber = i
            state = 1
            console.log(dateObjects[year][month][box[index]])
            createDetail(eleBox[i])      // 削除するときのメッセージはconfirm(本当に削除しますか？)でおけ
            previewDialog.showModal()
            dialog.close()       // 編集は初期状態を現在の予定に合わせて予定入力ダイヤログを開く
        })                                     // 開いた時に現在入ってるshortSchedule,longScheduleは削除して、新しく入れる
    }                                          // 元の情報は仮のオブジェクトに保存してキャンセルされたらそいつらを入れる
}
// すごい見づらいけどダイヤログ内のプレビューの表示
const createDetail = (idx) => {
    const pre = idx
    const previewTitle = document.createElement('h2')
    previewTitle.textContent = 'タイトル:' + pre.title
    previewDetail.appendChild(previewTitle)
    if (!pre.hasOwnProperty("sDate") && !pre.hasOwnProperty("shour")) {
        const previewDate = document.createElement('h3')
        previewDate.textContent = '日付:' + pre.year + '/' + pre.month + '/' + pre.date
        previewDetail.appendChild(previewDate)
        const previewTime = document.createElement('h3')
        previewTime.textContent = '時間:終日'
        previewDetail.appendChild(previewTime)
    } else if (!pre.hasOwnProperty("sDate") && pre.hasOwnProperty("shour")) {
        const previewDate = document.createElement('h3')
        previewDate.textContent = '日付:' + pre.year + '/' + pre.month + '/' + pre.date
        previewDetail.appendChild(previewDate)
        const previewTime = document.createElement('h3')
        previewTime.textContent = '時間:' + pre.shour + '時' + pre.sminutes + '分～' + pre.ehour + '時' + pre.eminutes + '分'
        previewDetail.appendChild(previewTime)
    } else if (pre.hasOwnProperty("sDate") && !pre.hasOwnProperty("shour")) {
        const previewStart = document.createElement('h3')
        previewStart.textContent = '開始日:' + pre.sYear + '/' + pre.sMonth + '/' + pre.sDate
        previewDetail.appendChild(previewStart)
        const previewEnd = document.createElement('h3')
        previewEnd.textContent = '終了日:' + pre.eYear + '/' + pre.eMonth + '/' + pre.eDate
        previewDetail.appendChild(previewEnd)
    } else {
        const previewStart = document.createElement('h3')
        previewStart.textContent = '開始日時:' + pre.sYear + '/' + pre.sMonth + '/' + pre.sDate + '-' + pre.shour + '時' + pre.sminutes + '分'
        previewDetail.appendChild(previewStart)
        const previewEnd = document.createElement('h3')
        previewEnd.textContent = '終了日時:' + pre.eYear + '/' + pre.eMonth + '/' + pre.eDate + '-' + pre.ehour + '時' + pre.eminutes + '分'
        previewDetail.appendChild(previewEnd)
    }


    if (pre.hasOwnProperty("detail")) {
        const previewD = document.createElement('h1')
        previewD.textContent = '詳細:' + pre.detail
        previewDetail.appendChild(previewD)
    }
}

// ダイヤログの管理
const dialogControl = () => {

    document.addEventListener("keydown", (e) => {
        if (e.key === 'Escape') {
            if (state2 === 1) {
                intoObjects(data)
                state2 = 0
            }
            scrollUnlock()
            preview.textContent = null
            previewDetail.textContent = null
            pushHTMLElement()
        }
    })
    cancel.addEventListener("click", () => { //メニューダイヤログを閉じる
        dialog.close()
        scrollUnlock()
        preview.textContent = null
        pushHTMLElement()
    })
    dialog.addEventListener("click", (event) => {
        if (!event.target.closest('#dialog .inner')) {
            dialog.close()
            scrollUnlock()
            preview.textContent = null
            setDialogState()
            pushHTMLElement()
        }
    })

    schedule.addEventListener("click", () => { // スケジュール入力ダイヤログを開く
        dialog.close()
        setDialogState()
        scheduleDialog.showModal()
        // setDialogState()

    })
    allDay.addEventListener("click", () => { //　終日on off切り替え
        allDayState = Math.abs(allDayState - 1)
        checker(allDay, allDayS) // ダイヤログ表示切り替え
    })
    overDay.addEventListener("click", () => { // 日またぎon off切り替え
        overDayState = Math.abs(overDayState - 1)
        checker(overDay, overDayS) // ダイヤログ表示切り替え
    })
    back.addEventListener("click", () => { //スケジュール入力ダイヤログを閉じてメニューに戻る
        if (state === 1) {
            intoObjects(data)
            previewDialog.showModal()
        }
        setDialogState() //ダイアログを初期状態にセット
        preview.textContent = null
        // previewDetail.textContent = null
        scheduleDialog.close()
        state2 = 0
        if (state === 0) {
            clickSquareEvent(squareNumber)
        }
        // clickSquareEvent(squareNumber)
    })
    // scheduleDialog.addEventListener("click", (e) => {
    //     if(!e.target.closest('#schedule-dialog .inner2')) {
    //         setDialogState()
    //         scheduleDialog.close()
    //         scrollUnlock()
    //     }
    // })
    deside.addEventListener("click", () => { // 決定ボタンを押した時の処理

        // 終日か日またぎか4通りで処理
        // 共通で予定の名前、時間を入れないと不可でreturn
        // スタートが終了よりも遅い場合も不可return
        // 正しく入力されたら仮のオブジェクトに内容を保存
        // obj{}を引数にして情報を保存するための関数intoObjectsを起動
        // 初期状態に戻してダイヤログは閉じる

        if (allDayState === 1 && overDayState === 1) {
            if (!end.value || !start.value) {
                alert("日付を入れてください")
                return
            } else if (!checkSection(start, end)) { // 終了日が開始日より早くないか検証
                alert('終了日は開始日より後を入力してください')
                return
            } else if (str[0] < 2020 || str[0] > 2050 || en[0] < 2020 || en[0] > 2050) {
                alert('2020年から2050年までを指定してください')
                return
            } else if (!title.value) {
                alert('予定名を入力してください')
                return
            }
            // if(state === 0) {
            //     yearMonthDateSplit()
            // }      
            obj.title = title.value // 仮の情報の入れ物に保存
            obj.sYear = str[0]
            obj.sMonth = str[1]
            obj.sDate = str[2]
            obj.eYear = en[0]
            obj.eMonth = en[1]
            obj.eDate = en[2]
            if (detail.value) {
                obj.detail = detail.value
            }


        } else if (allDayState === 1 && overDayState === 0) {
            if (!title.value) {
                alert('予定名を入力してください')
                return
            }
            // if(state === 0) {
            //     yearMonthDateSplit()
            // }                       // 年月日を文字列から配列に入れ込む関数
            obj.title = title.value // 仮の情報の入れ物に保存
            obj.year = year
            obj.month = month
            obj.date = box[squareNumber]
            if (detail.value) {
                obj.detail = detail.value
            }

        } else if (allDayState === 0 && overDayState === 1) {

            if (!startDateTime.value || !endDateTime.value) {
                alert('日時を入れてください')
                return
            } else if (!checkSection(startDateTime, endDateTime)) { // 終了日時と開始日時が正しいか検証
                alert('終了日時は開始日時より後を入力してください')
                return
            } else if (str[0] < 2020 || str[0] > 2050 || en[0] < 2020 || en[0] > 2050) {
                alert('2020年から2050年までを指定してください')
                return
            } else if (!title.value) {
                alert('予定名を入力してください')
                return
            }

            // if(state === 0) {
            //     yearMonthDateSplit()
            // }      
            if (str[0] === en[0] && str[1] === en[1] && str[2] === en[2]) {
                obj.title = title.value // 仮の情報の入れ物に保存
                obj.year = str[0]
                obj.month = str[1]
                obj.date = str[2]
                obj.shour = str[3]
                obj.sminutes = str[4]
                obj.ehour = en[3]
                obj.eminutes = en[4]
                if (detail.value) {
                    obj.detail = detail.value
                }
            } else {
                obj.title = title.value // 仮の入れ物に保存
                obj.sYear = str[0]
                obj.sMonth = str[1]
                obj.sDate = str[2]
                obj.shour = str[3]
                obj.sminutes = str[4]
                obj.eYear = en[0]
                obj.eMonth = en[1]
                obj.eDate = en[2]
                obj.ehour = en[3]
                obj.eminutes = en[4]
                if (detail.value) {
                    obj.detail = detail.value
                }
            }


        } else if (allDayState === 0 && overDayState === 0) {
            // console.log(startTime.value,endTime.value)
            if (!startTime.value || !endTime.value) {
                alert('時刻を入力してください')
                return
            } else if (!checkSection(startTime, endTime)) { // 開始時間が終了時間より早いか検証
                alert('終了時刻は開始時刻より後を入力してください')
                return
            } else if (!title.value) {
                alert('予定名を入力してください')
                return
            }
            // if(state === 0) {
            //     yearMonthDateSplit()
            // }                     // 年月日を文字列から配列に入れ込む関数
            obj.title = title.value // 仮の情報の入れ物に保存
            obj.year = year
            obj.month = month
            obj.date = box[squareNumber]
            obj.shour = str[0]
            obj.sminutes = str[1]
            obj.ehour = en[0]
            obj.eminutes = en[1]
            if (detail.value) {
                obj.detail = detail.value
            }


        }
        intoObjects(obj)
        scheduleDialog.close()
        pushHTMLElement()
        scrollUnlock()
        setDialogState() // 初期状態にもどす
        if (state === 0) {
            preview.textContent = null
            previewDetail.textContent = null
        } else {
            previewDetail.textContent = null
            createDetail(obj)
            previewDialog.showModal()
        }
        eleBox[clickElementNumber] = obj
        state2 = 0
        obj = {} // 渡し終えたら空にしておく
    })

    removeButton.addEventListener("click", () => {
        if (confirm("本当に削除しますか？")) {
            removeSchedule()
            pushHTMLElement()
            previewDialog.close()
            preview.textContent = null
            previewDetail.textContent = null
            setDialogState()
            clickSquareEvent(squareNumber)
        }
    })
    editButton.addEventListener("click", () => {
        data = eleBox[clickElementNumber]
        state2 = 1
        removeSchedule()
        editDialogState()
        previewDialog.close()
        scheduleDialog.showModal()
        // console.log(dateObjects[year][month][box[squareNumber]])
    })
    exitButton.addEventListener("click", () => {
        previewDialog.close()
        preview.textContent = null
        previewDetail.textContent = null
        setDialogState()
        clickSquareEvent(squareNumber)
    })
}
// 編集するときのダイヤログの初期状態
// 無駄にでかくなったのは文字列に0を入れるための場合分けが必要だったからすまん
const editDialogState = () => {
    setDialogState()
    title.value = data.title
    if (data.hasOwnProperty("detail")) {
        detail.value = data.detail
    }
    if (!data.hasOwnProperty("sDate") && !data.hasOwnProperty("shour")) {
        allDayState = 1
        overDayState = 0
        setTime.classList.add("none")
        setDayTime.classList.add("none")
        setDay.classList.add("none")
        allDay.classList.add("active")
        allDayS.classList.add("active")
    } else if (!data.hasOwnProperty("sDate") && data.hasOwnProperty("shour")) {
        allDayState = 0
        overDayState = 0
        setTime.classList.remove("none")
        setDayTime.classList.add("none")
        setDay.classList.add("none")

        if (data.shour < 10 && data.sminutes < 10) {
            startTime.value = '0' + data.shour + ':0' + data.sminutes
        } else if (data.shour > 9 && data.sminutes < 10) {
            startTime.value = data.shour + ':0' + data.sminutes
        } else if (data.shour < 10 && data.sminutes > 9) {
            startTime.value = '0' + data.shour + ':' + data.sminutes
        } else {
            startTime.value = data.shour + ':' + data.sminutes
        }
        if (data.ehour < 10 && data.eminutes < 10) {
            endTime.value = '0' + data.ehour + ':0' + data.eminutes
        } else if (data.ehour > 9 && data.eminutes < 10) {
            endTime.value = data.ehour + ':0' + data.eminutes
        } else if (data.ehour < 10 && data.eminutes > 9) {
            endTime.value = '0' + data.ehour + ':' + data.eminutes
        } else {
            endTime.value = data.ehour + ':' + data.eminutes
        }

    } else if (data.hasOwnProperty("sDate") && !data.hasOwnProperty("shour")) {
        allDayState = 1
        overDayState = 1
        setTime.classList.add("none")
        setDayTime.classList.add("none")
        setDay.classList.remove("none")
        allDay.classList.add("active")
        allDayS.classList.add("active")
        overDay.classList.add("active")
        overDayS.classList.add("active")

        if (data.sMonth < 10 && data.sDate < 10) {
            start.value = data.sYear + '-0' + data.sMonth + '-0' + data.sDate
        } else if (data.sMonth > 9 && data.sDate < 10) {
            start.value = data.sYear + '-' + data.sMonth + '-0' + data.sDate
        } else if (data.sMonth < 10 && data.sDate > 9) {
            start.value = data.sYear + '-0' + data.sMonth + '-' + data.sDate
        } else {
            start.value = data.sYear + '-' + data.sMonth + '-' + data.sDate
        }
        if (data.eMonth < 10 && data.eDate < 10) {
            end.value = data.eYear + '-0' + data.eMonth + '-0' + data.eDate
        } else if (data.eMonth > 9 && data.eDate < 10) {
            end.value = data.eYear + '-' + data.eMonth + '-0' + data.eDate
        } else if (data.eMonth < 10 && data.eDate > 9) {
            end.value = data.eYear + '-0' + data.eMonth + '-' + data.eDate
        } else {
            end.value = data.eYear + '-' + data.eMonth + '-' + data.eDate
        }
    } else {
        allDayState = 0
        overDayState = 1
        setTime.classList.add("none")
        setDayTime.classList.remove("none")
        setDay.classList.add("none")
        overDay.classList.add("active")
        overDayS.classList.add("active")

        if (data.sMonth < 10 && data.sDate < 10) {
            if (data.shour < 10 && data.sminutes < 10) {
                startDateTime.value = data.sYear + '-0' + data.sMonth + '-0' + data.sDate + 'T0' + data.shour + ':0' + data.sminutes
            } else if (data.shour > 9 && data.sminutes < 10) {
                startDateTime.value = data.sYear + '-0' + data.sMonth + '-0' + data.sDate + 'T' + data.shour + ':0' + data.sminutes
            } else if (data.shour < 10 && data.sminutes > 9) {
                startDateTime.value = data.sYear + '-0' + data.sMonth + '-0' + data.sDate + 'T0' + data.shour + ':' + data.sminutes
            } else {
                startDateTime.value = data.sYear + '-0' + data.sMonth + '-0' + data.sDate + 'T' + data.shour + ':' + data.sminutes
            }
        } else if (data.sMonth > 9 && data.sDate < 10) {
            if (data.shour < 10 && data.sminutes < 10) {
                startDateTime.value = data.sYear + '-' + data.sMonth + '-0' + data.sDate + 'T0' + data.shour + ':0' + data.sminutes
            } else if (data.shour > 9 && data.sminutes < 10) {
                startDateTime.value = data.sYear + '-' + data.sMonth + '-0' + data.sDate + 'T' + data.shour + ':0' + data.sminutes
            } else if (data.shour < 10 && data.sminutes > 9) {
                startDateTime.value = data.sYear + '-' + data.sMonth + '-0' + data.sDate + 'T0' + data.shour + ':' + data.sminutes
            } else {
                startDateTime.value = data.sYear + '-' + data.sMonth + '-0' + data.sDate + 'T' + data.shour + ':' + data.sminutes
            }
        } else if (data.sMonth < 10 && data.sDate > 9) {
            if (data.shour < 10 && data.sminutes < 10) {
                startDateTime.value = data.sYear + '-0' + data.sMonth + '-' + data.sDate + 'T0' + data.shour + ':0' + data.sminutes
            } else if (data.shour > 9 && data.sminutes < 10) {
                startDateTime.value = data.sYear + '-0' + data.sMonth + '-' + data.sDate + 'T' + data.shour + ':0' + data.sminutes
            } else if (data.shour < 10 && data.sminutes > 9) {
                startDateTime.value = data.sYear + '-0' + data.sMonth + '-' + data.sDate + 'T0' + data.shour + ':' + data.sminutes
            } else {
                startDateTime.value = data.sYear + '-0' + data.sMonth + '-' + data.sDate + 'T' + data.shour + ':' + data.sminutes
            }
        } else {
            if (data.shour < 10 && data.sminutes < 10) {
                startDateTime.value = data.sYear + '-' + data.sMonth + '-' + data.sDate + 'T0' + data.shour + ':0' + data.sminutes
            } else if (data.shour > 9 && data.sminutes < 10) {
                startDateTime.value = data.sYear + '-' + data.sMonth + '-' + data.sDate + 'T' + data.shour + ':0' + data.sminutes
            } else if (data.shour < 10 && data.sminutes > 9) {
                startDateTime.value = data.sYear + '-' + data.sMonth + '-' + data.sDate + 'T0' + data.shour + ':' + data.sminutes
            } else {
                startDateTime.value = data.sYear + '-' + data.sMonth + '-' + data.sDate + 'T' + data.shour + ':' + data.sminutes
            }
        }
        if (data.eMonth < 10 && data.eDate < 10) {
            if (data.ehour < 10 && data.eminutes < 10) {
                endDateTime.value = data.eYear + '-0' + data.eMonth + '-0' + data.eDate + 'T0' + data.ehour + ':0' + data.eminutes
            } else if (data.ehour > 9 && data.eminutes < 10) {
                endDateTime.value = data.eYear + '-0' + data.eMonth + '-0' + data.eDate + 'T' + data.ehour + ':0' + data.eminutes
            } else if (data.ehour < 10 && data.eminutes > 9) {
                endDateTime.value = data.eYear + '-0' + data.eMonth + '-0' + data.eDate + 'T0' + data.ehour + ':' + data.eminutes
            } else {
                endDateTime.value = data.eYear + '-0' + data.eMonth + '-0' + data.eDate + 'T' + data.ehour + ':' + data.eminutes
            }
        } else if (data.eMonth > 9 && data.eDate < 10) {
            if (data.ehour < 10 && data.eminutes < 10) {
                endDateTime.value = data.eYear + '-' + data.eMonth + '-0' + data.eDate + 'T0' + data.ehour + ':0' + data.eminutes
            } else if (data.ehour > 9 && data.eminutes < 10) {
                endDateTime.value = data.eYear + '-' + data.eMonth + '-0' + data.eDate + 'T' + data.ehour + ':0' + data.eminutes
            } else if (data.ehour < 10 && data.eminutes > 9) {
                endDateTime.value = data.eYear + '-' + data.eMonth + '-0' + data.eDate + 'T0' + data.ehour + ':' + data.eminutes
            } else {
                endDateTime.value = data.eYear + '-' + data.eMonth + '-0' + data.eDate + 'T' + data.ehour + ':' + data.eminutes
            }
        } else if (data.eMonth < 10 && data.eDate > 9) {
            if (data.ehour < 10 && data.eminutes < 10) {
                endDateTime.value = data.eYear + '-0' + data.eMonth + '-' + data.eDate + 'T0' + data.ehour + ':0' + data.eminutes
            } else if (data.ehour > 9 && data.eminutes < 10) {
                endDateTime.value = data.eYear + '-0' + data.eMonth + '-' + data.eDate + 'T' + data.ehour + ':0' + data.eminutes
            } else if (data.ehour < 10 && data.eminutes > 9) {
                endDateTime.value = data.eYear + '-0' + data.eMonth + '-' + data.eDate + 'T0' + data.ehour + ':' + data.eminutes
            } else {
                endDateTime.value = data.eYear + '-0' + data.eMonth + '-' + data.eDate + 'T' + data.ehour + ':' + data.eminutes
            }
        } else {
            if (data.ehour < 10 && data.eminutes < 10) {
                endDateTime.value = data.eYear + '-' + data.eMonth + '-' + data.eDate + 'T0' + data.ehour + ':0' + data.eminutes
            } else if (data.ehour > 9 && data.eminutes < 10) {
                endDateTime.value = data.eYear + '-' + data.eMonth + '-' + data.eDate + 'T' + data.ehour + ':0' + data.eminutes
            } else if (data.ehour < 10 && data.eminutes > 9) {
                endDateTime.value = data.eYear + '-' + data.eMonth + '-' + data.eDate + 'T0' + data.ehour + ':' + data.eminutes
            } else {
                endDateTime.value = data.eYear + '-' + data.eMonth + '-' + data.eDate + 'T' + data.ehour + ':' + data.eminutes
            }
        }
    }

}

// 予定を削除するとこ
// いろいろ場合分けして肥大化したけど開始から終了まで調べて消してるだけ
// ほぼintoObjectと同じ
const removeSchedule = () => {
    const object = dateObjects[year][month][box[squareNumber]] // shortの場合はok
    if (!eleBox[clickElementNumber].hasOwnProperty('sYear')) {
        delete object[pBox[clickElementNumber]]
        // console.log(object)
    } else { // longの場合↓
        const ob = eleBox[clickElementNumber]
        if (ob.sYear === ob.eYear) {
            if (ob.sMonth === ob.eMonth) {
                for (let i = ob.sDate; i <= ob.eDate; i++) {
                    delete dateObjects[ob.sYear][ob.sMonth][i][pBox[clickElementNumber]]
                    // console.log(dateObjects[ob.sYear][ob.sMonth][i])
                }
            } else {
                for (let j = ob.sMonth; j <= ob.eMonth; j++) {
                    const endDay = new Date(ob.sYear, j, 0).getDate()
                    if (j === ob.sMonth) {
                        for (let k = ob.sDate; k <= endDay; k++) {
                            delete dateObjects[ob.sYear][j][k][pBox[clickElementNumber]]
                            // console.log(dateObjects[ob.sYear][j][k])
                        }
                    } else if (j > ob.sMonth && j < ob.eMonth) {
                        for (let l = 1; l <= endDay; l++) {
                            delete dateObjects[ob.sYear][j][l][pBox[clickElementNumber]]
                            // console.log(dateObjects[ob.sYear][j][l])
                        }
                    } else {
                        for (let m = 1; m <= ob.eDate; m++) {
                            delete dateObjects[ob.sYear][j][m][pBox[clickElementNumber]]
                            // console.log(dateObjects[ob.sYear][j][m])
                        }
                    }
                }
            }
        } else {
            for (let n = ob.sYear; n <= ob.eYear; n++) {
                if (n === ob.sYear) {
                    for (let o = ob.sMonth; o <= 12; o++) {
                        const endDay = new Date(n, o, 0).getDate()
                        if (o === ob.sMonth) {
                            for (let p = ob.sDate; p <= endDay; p++) {
                                delete dateObjects[n][o][p][pBox[clickElementNumber]]
                                // console.log(dateObjects[n][o][p])
                            }
                        } else {
                            for (let q = 1; q <= endDay; q++) {
                                delete dateObjects[n][o][q][pBox[clickElementNumber]]
                                // console.log(dateObjects[n][o][q])
                            }
                        }
                    }
                } else if (n > ob.sYear && n < ob.eYear) {
                    for (let r = 1; r <= 12; r++) {
                        const endDay = new Date(n, r, 0).getDate()
                        for (let s = 1; s <= endDay; s++) {
                            delete dateObjects[n][r][s][pBox[clickElementNumber]]
                            // console.log(dateObjects[n][r][s])
                        }
                    }
                } else {
                    for (let t = 1; t <= ob.eMonth; t++) {
                        if (t < ob.eMonth) {
                            const endDay = new Date(n, t, 0).getDate()
                            for (let u = 1; u <= endDay; u++) {
                                delete dateObjects[n][t][u][pBox[clickElementNumber]]
                                // console.log(dateObjects[n][t][u])
                            }
                        } else {
                            for (let v = 1; v <= ob.eDate; v++) {
                                delete dateObjects[n][t][v][pBox[clickElementNumber]]
                                // console.log(dateObjects[n][t][v])
                            }
                        }
                    }
                }
            }
        }
    }
}
// いらなくなった
// const yearMonthDateSplit = () => { // 年月日を文字列から数字で配列に格納
//     yearMonthDate = yearMonthDate.split(/[-]/)
//         for(let i = 0; i < 3; i++) {
//             yearMonthDate[i] = parseInt(yearMonthDate[i])
//         }
// }

const intoObjects = (o) => { // 仮の入れ物の情報を一致する年月日のオブジェクトに格納

    // 日をまたぐ場合はlongSchedule当日のみはshortScheduleをプロパティ名として保存
    // 予定が重なる場合は入れた順番で1,2,3…と番号を振る
    // 予定が取り除かれた場合あいている若い番号から入れる

    if ('sYear' in o) { // longかshortかの判断
        let objBox = []

        if (o.sYear === o.eYear) {
            if (o.sMonth === o.eMonth) {
                for (let i = o.sDate; i <= o.eDate; i++) {
                    objBox.push(dateObjects[o.sYear][o.sMonth][i])
                }
            } else {
                for (let j = o.sMonth; j <= o.eMonth; j++) {
                    if (j === o.sMonth) {
                        const endDay = new Date(o.sYear, o.sMonth, 0).getDate()
                        for (let k = o.sDate; k <= endDay; k++) {
                            objBox.push(dateObjects[o.sYear][o.sMonth][k])
                        }
                    } else if (j > o.sMonth && j < o.eMonth) {
                        const endDay = new Date(o.sYear, j, 0).getDate()
                        for (let l = 1; l <= endDay; l++) {
                            objBox.push(dateObjects[o.sYear][j][l])
                        }
                    } else if (j === o.eMonth) {
                        for (let m = 1; m <= o.eDate; m++) {
                            objBox.push(dateObjects[o.sYear][o.eMonth][m])
                        }
                    }
                }
            }
        } else {
            for (let n = o.sYear; n <= o.eYear; n++) {
                if (n === o.sYear) {
                    for (let p = o.sMonth; p <= 12; p++) {
                        const endDay = new Date(o.sYear, p, 0).getDate()
                        if (p === o.sMonth) {
                            for (let q = o.sDate; q <= endDay; q++) {
                                objBox.push(dateObjects[o.sYear][p][q])
                            }
                        } else {
                            for (let w = 1; w <= endDay; w++) {
                                objBox.push(dateObjects[n][p][w])
                            }
                        }
                    }
                } else if (n > o.sYear && n < o.eYear) {
                    for (let r = 1; r <= 12; r++) {
                        const endDay = new Date(n, r, 0).getDate()
                        for (let s = 1; s <= endDay; s++) {
                            objBox.push(dateObjects[n][r][s])
                        }
                    }
                } else {
                    for (let t = 1; t <= o.eMonth; t++) {
                        if (t < o.eMonth) {
                            const endDay = new Date(n, t, 0).getDate()
                            for (let u = 1; u <= endDay; u++) {
                                objBox.push(dateObjects[n][t][u])
                            }
                        } else {
                            for (let v = 1; v <= o.eDate; v++) {
                                objBox.push(dateObjects[n][t][v])
                            }
                        }
                    }
                }
            }
        }

        for (let l = 1; l < 100; l++) {
            const property = 'longSchedule' + l
            if (objBox.every(item => !item.hasOwnProperty(property))) {
                objBox.forEach(it => { // すべてに入っていないプロパティにするため配列すべてを検証
                    it[property] = o
                    // console.log(it)
                })
                pBox[clickElementNumber] = property
                break
            }
        }

    } else {
        for (let i = 1; i < 100; i++) {
            const property = 'shortSchedule' + i
            if (!dateObjects[o.year][o.month][o.date].hasOwnProperty(property)) { // プロパティ名が重複しないよう検証
                dateObjects[o.year][o.month][o.date][property] = o
                // console.log(dateObjects[o.year][o.month][o.date])
                pBox[clickElementNumber] = property
                break
            }
        }
    }

}

// ダイヤログの初期状態のセット
const setDialogState = () => {
    title.value = null // 予定名空
    detail.value = null // 詳細空
    allDayState = 0
    overDayState = 0 // 終日と日またぎのトグルスイッチoff
    start.value = yearMonthDate // 日付などの選択項目は選択日の0時0分に固定
    end.value = yearMonthDate
    startDateTime.value = yearMonthDate + "T00:00"
    endDateTime.value = yearMonthDate + "T00:00"
    startTime.value = "00:00"
    endTime.value = "00:00"

    allDay.classList.remove("active")
    allDayS.classList.remove("active")
    overDay.classList.remove("active")
    overDayS.classList.remove("active") // トグルスイッチの見た目をoff状態にする

    setTime.classList.remove("none") // トグルスイッチの初期状態に合わせた選択項目を表示
    setDay.classList.add("none")     // 初期はすべてoff 時間のみの選択にする
    setDayTime.classList.add("none")
}

const checker = (outer, sw) => { // トグルスイッチの状態切り替えと画面切り替え

    outer.classList.toggle("active") // 選択したトグルスイッチをoffならonに、onならoffにする
    sw.classList.toggle("active")

    if (allDayState === 1 && overDayState === 1) { // トグルスイッチの状態に合わせた画面を表示
        setTime.classList.add("none")             //表示するものはclass="none"を取り除く
        setDayTime.classList.add("none")
        setDay.classList.remove("none")
    } else if (allDayState === 1 && overDayState === 0) {
        setTime.classList.add("none")
        setDayTime.classList.add("none")
        setDay.classList.add("none")
    } else if (allDayState === 0 && overDayState === 1) {
        setTime.classList.add("none")
        setDayTime.classList.remove("none")
        setDay.classList.add("none")
    } else {
        setTime.classList.remove("none")
        setDayTime.classList.add("none")
        setDay.classList.add("none")
    }
}

const checkSection = (s, e) => { // 選択された開始と終了が正しく入力されているかのチェック

    str = s.value.split(/[-:T]/) // 開始と終了を年、月、日、時、分の順番に配列にする
    en = e.value.split(/[-:T]/) // 終日の場合は年、月、日のみ、時間のみも同様

    let checkStart = ''
    let checkEnd = ''

    for (let i = 0; i < str.length; i++) {
        checkStart = checkStart + str[i] // 年月日時分をすべて横並びにした12桁の数字の文字列にする
        checkEnd = checkEnd + en[i] // 終日の場合は年月日のみを並べた8桁、時間のみも同様

        str[i] = parseInt(str[i]) // 文字列を数字に直す
        en[i] = parseInt(en[i])
    }
    if (checkEnd <= checkStart) { // 終了<=開始の場合正しく入力できていないためfalseを返す
        return false
    }

    return true

}

const pushHTMLElement = () => { //入れ込み方模索中...最低限予定のあるとこを可視化した

    for (let a = 0; a < 42; a++) {
        document.getElementById("schedule" + a).textContent = null
    }
    const endDay = new Date(year, month, 0).getDate()
    const startday = new Date(year, month - 1, 1).getDay()
    for (let j = 1; j <= endDay; j++) {
        for (let i = 0; i < 100; i++) {
            const lProperty = "longSchedule" + i
            const sProperty = "shortSchedule" + i
            if (dateObjects[year][month][j].hasOwnProperty(lProperty) || dateObjects[year][month][j].hasOwnProperty(sProperty)) {
                const elem = document.createElement('div')
                elem.classList.add("d")
                document.getElementById("schedule" + (j + startday - 1)).appendChild(elem)
                break
            }
        }
    }
}

const createSquare = () => { // いつもの

    for (let i = 0; i < 42; i++) {
        const square = squareTemplate.cloneNode(true)
        square.removeAttribute("id")
        square.id = "square" + i
        stage.appendChild(square)

        squares.push(square)

        square.addEventListener('click', () => { // マスをクリックしたときそのマスの番号を引数にしてclickSquareEvent起動

            clickSquareEvent(i)
        })

        square.addEventListener('mouseover', () => {

            square.classList.add("on-cursor")
        })
        square.addEventListener('mouseout', () => {

            square.classList.remove("on-cursor")
        })

    }

    for (let j = 0; j < 42; j++) { // 日付を入れ込む要素とスケジュールを入れ込む要素にuniqueなidを与える
        const element = document.getElementById("element")
        element.id = "day" + j
        // element.classList.add("day" + j)
        const scheduleStage = document.getElementById("schedule-stage")
        scheduleStage.id = "schedule" + j

        if (j % 7 === 0) { // 土日の色替え
            document.getElementById("day" + j).style.color = 'red'
        } else if (j % 7 === 6) {
            document.getElementById("day" + j).style.color = '#64B5F6'
        }

    }

    creatWeekHeader()
    createCalendar()

}

const createCalendar = () => { // 年と月を与えるとsquareに日付が入る

    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month, 0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得



    document.getElementById('yearmonth').textContent = year + "/" + month

    for (let k = 0; k < 42; k++) {
        box[k] = 0
    }

    let j = 1

    for (let i = startDay; i < startDay + endDayCount; i++) {

        document.getElementById('day' + i).textContent = j
        box[i] = j

        if (j === today && year === thisYear && month === thisMonth) {
            document.getElementById('square' + i).classList.add('today')
        }

        j++
    }

    pushHTMLElement()
}

const removedDay = () => { // 現在はいっている日を取り除く
    for (let i = 0; i < 42; i++) {
        document.getElementById("square" + i).classList.remove('today')
        document.getElementById("day" + i).textContent = null
    }
}

const createPrevMonth = () => { // 前月ボタン処理

    if (year == 2020 && month == 1) {
        alert("これ以上戻れません")
        return
    } else if (month == 1) {
        month = 12
        year--
    } else {
        month--
    }

    document.querySelector('input[type="month"]').value = selecter() // 年月選択ボックスも一緒に切り替え
    removedDay()
    createCalendar()
}

const createNextMonth = () => { // 次月ボタン処理

    if (year == 2050 && month == 12) {
        alert("これ以上進めません")
        return
    }
    if (month == 12) {
        month = 1
        year++
    } else {
        month++
    }

    document.querySelector('input[type="month"]').value = selecter() // 年月選択ボックスも一緒に切り替え
    removedDay()
    createCalendar()
}

const selecter = () => { // 現在の年月を文字列として返す（YYYY-MM）

    let textYearMonth = ''

    if (month < 10) {
        textYearMonth = year + '-0' + month
    } else {
        textYearMonth = year + '-' + month
    }

    return textYearMonth
}

const createSelectYearMonth = () => { // 選択ボタンを押した際の処理

    const selectYearMonth = document.getElementById("select")
    if (!selectYearMonth.value) { // 選択されていないときは押せない
        alert('選択できません')
        return
    }
    const select = selectYearMonth.value.split('-') // 選択されている年月を文字列から年、月に分け配列に

    select[0] = parseInt(select[0]) //　年、月を整数に直す
    select[1] = parseInt(select[1])

    year = select[0]
    month = select[1]

    if (year < 2020 || year > 2050) { // 想定されている範囲のみ選択可能に
        alert("選択できません")
        return
    }

    // 正しく入力されたら日付を取り除いて新しく入れる
    removedDay()
    createCalendar()
}

const menuOpen = document.querySelector('#menu-open');
const menuClose = document.querySelector('#menu-close');
const menuPanel = document.querySelector('#menu-panel');

// メニューを開く
menuOpen.addEventListener('click', () => {
    menuPanel.style.transform = 'translateX(0)'; // メニューをスライドイン
});

// メニューを閉じる
menuClose.addEventListener('click', () => {
    menuPanel.style.transform = 'translateX(100%)'; // メニューをスライドアウト
});


const scrollLock = () => { // スクロールをロック
    // const scrollY = window.scrollY
    // document.body.style.position = 'fixed'
    // document.body.style.top = '-${scrollY}px'
    // document.body.style.left = '0'
    // document.body.style.width = '100%'
    // document.body.style.overflowY = 'scroll'
    document.body.style.overflow = 'hidden'
}

const scrollUnlock = () => { // スクロールをアンロック
    // const scrollY = document.body.style.top
    // document.body.style.position = ''
    // document.body.style.top = ''
    // document.body.style.left = ''
    // document.body.style.width = ''
    // document.body.style.overflowY = ''
    // window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
    document.body.style.overflow = ''
}


window.onload = () => {
    createSquare()
    dialogControl()

    document.querySelector('input[type="month"]').value = selecter() // 初期状態を現在の年と月でセット

    prevMonth.addEventListener("click", createPrevMonth) // 前月ボタン
    nextMonth.addEventListener("click", createNextMonth) // 次月ボタン
    check.addEventListener("click", createSelectYearMonth) // 選択ボタン


    // 保存はlocalStrageを用いる
    save.addEventListener("click", () => { // 保存する
        if (!pass.value) {
            alert('passを入力してください')
            return
        }
        alert('パス: ' + pass.value + ' が保存されました');
        localStorage.removeItem(pass.value)
        let localObj = JSON.stringify(dateObjects)
        localStorage.setItem(pass.value, localObj)
    })
    call.addEventListener("click", () => { // 保存されたデータをよびだす
        if (!pass.value) {
            alert('passを入力してください')
            return
        }
        const jsonObj = localStorage.getItem(pass.value)
        const localObj = JSON.parse(jsonObj)
        if (!localObj) {
            alert('保存されているデータはありません')
            return
        }
        dateObjects = localObj
        pushHTMLElement()
    })
    clearButton.addEventListener("click", () => { // passの保存されたデータを削除
        if (!pass.value) {
            alert('passを入力してください')
            return
        }
        if (confirm('pass:' + pass.value + 'に保存したデータを削除しますか？')) {
            localStorage.removeItem(pass.value)
            // dateObjects = createDateArray()
            // pushHTMLElement()
            alert('削除しました')
        }
    })
    allClear.addEventListener("click", () => { // 初期化したら保存しているデータをすべて消す
        if (confirm('初期化を行うとすべての保存されたデータが削除されます。\n本当に初期化を行いますか？')) {
            localStorage.clear()
            dateObjects = createDateArray()
            pass.value = null
            pushHTMLElement()
            alert('初期化しました')
        }
    })


}
