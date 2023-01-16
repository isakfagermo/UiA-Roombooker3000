document.body.style.border = "15px solid red";
var successAudio = new Audio(browser.runtime.getURL('Coin.wav'))
var errorAudio = new Audio(browser.runtime.getURL('alarm.wav'))

console.log('Booker started!')
var bookedToday = false

function bookRoom() 
{
    console.log('Booking...')
    var request = new XMLHttpRequest()

    request.addEventListener('load', (e) => 
    {
        if (e.target.status === 200) 
        {
            console.log('Booked!')
            successAudio.play()
            bookedToday = true

            //Load a lighter page to reduce memory usage when idle
            window.open("https://cloud.timeedit.net/uia/web/tp/")
        } else 
        {
            console.error(e.target.status, e.target.responseText)
            if (e.target.responseText === '{"code":-22,"serverCode":1,"messages":["Ikke pålogget."]}') //This means we are logged out, and we have to login again
            {
                console.log('Logged out! Logging in again...')
                
                window.open("https://cloud.timeedit.net/uia/web/timeedit/sso/feide?back=https%3A%2F%2Fcloud.timeedit.net%2Fuia%2Fweb%2Ftp%2Fri1Q59.html")
                
                //Script should never reach this
                console.log('Failed to load login page')
            }else 
            {
                //Play audio to alert me!
                errorAudio.play()
            }
        }
    })

    request.open('POST', 'https://cloud.timeedit.net/uia/web/tp/ri1Q59.html')
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    var date = new Date()
    date.setDate(date.getDate() + 8)
    //Gets date string, coverts to array, reverse array and turns back into string with format: yyyymmdd
    var dateFormated = date.toLocaleDateString('nb', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).split('.').reverse().join('')

    //Example of a payload:
    //kind=reserve&nocache=4&l=nb_NO&o=85.4&aos=&dates=20221003&starttime=08%3A00&endtime=11%3A00&url=https%3A%2F%2Fcloud.timeedit.net%2Fuia%2Fweb%2Ftp%2Fri1Q59.html%230085&fe54=
    var payload = `kind=reserve&nocache=4&l=nb_NO&o=85.4&aos=&dates=${dateFormated}&starttime=12%3A00&endtime=15%3A00&url=https%3A%2F%2Fcloud.timeedit.net%2Fuia%2Fweb%2Ftp%2Fri1Q59.html%230085&fe54=`
    request.send(payload)
}

setInterval(() => 
{
    console.log('Checking...')
    var now = new Date()
    let day = now.getDay() //Dont book a room during the weekend, returns day-number

    if (bookedToday && now.getHours() === 0) { //New day
        bookedToday = false
    }

    if (!bookedToday && now.getHours() >= 21 && day != 5 && day != 6){ //if not booked, its past 21h and its not the weekend
        bookRoom()
    }

}, 180000) //How often the script should check, in ms. 180 000 = 3 min