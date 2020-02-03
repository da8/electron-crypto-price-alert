const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const ipc = require('electron').ipcMain

require('electron-reload')(__dirname)

let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'src/index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  win.on('closed', () => {
    win = null
  })

  var mainMenuTemplate = [
    {
      label: 'Menu',
      submenu: [
        { label: 'Adjust Notification Value' },
        {
          label: 'CoinMarketCap',
          click() {
            shell.openExternal('http://coinmarketcap.com');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Info'
    }
  ]

  if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
      label: 'Developer Toos',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload'
        }
      ]
    });
  }

  var menu = Menu.buildFromTemplate(mainMenuTemplate)

  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipc.on('update-notify-value', function (event, arg) {
  win.webContents.send('targetPriceVal', arg)
})