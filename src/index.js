const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const axios = require('axios')
const ipc = electron.ipcRenderer

const notifyBtn = document.getElementById('notifyBtn')

notifyBtn.addEventListener('click', function (event) {
    const modalPath = path.join('file://', __dirname, 'add.html')
    let win = new BrowserWindow({
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        width: 400,
        height: 200,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.on('close', function () { win = null })
    win.loadURL(modalPath)
    win.show()
})

var price = document.querySelector('h1')

var targetPrice = document.getElementById('targetPrice')

const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price!'
}

function getBTC() {
    let myNotification = '';

    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
        .then(res => {
            const cryptos = res.data.BTC.USD
            price.innerHTML = '$' + cryptos.toLocaleString('en')

            if (targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD){
                const myNotification = new window.Notification(notification.title, notification);

                myNotification.onclick = () => {
                    console.log('clicked')
                }                
            }
        })
}

getBTC();

setInterval(getBTC, 1000)

ipc.on('update-notify-value', function (event, arg) {
    win.webContents.send('targetPriceVal', arg)
})

var price = document.querySelector('h1')

var targetPriceVal;

var targetPrice = document.getElementById('targetPrice')

ipc.on('targetPriceVal', function (event, arg) {
    targetPriceVal = Number(arg);
    targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en')
})