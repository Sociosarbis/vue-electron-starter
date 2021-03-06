import { app, BrowserWindow, Menu, MenuItem } from 'electron'
import * as path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

function createMainWindow() {
  const window = new BrowserWindow({
    title: 'vue-starter',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(
    `file://${path.join(__dirname, './index.html').replace(/\\/g, '/')}`
    )
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

Menu.setApplicationMenu(Menu.buildFromTemplate([
  new MenuItem(
    {
      label: '快捷键',
      submenu: [
        {
          role: 'toggleDevTools',
          label: '打开开发者工具',
          accelerator: 'F12',
          click: () => mainWindow && mainWindow.webContents.toggleDevTools()
        }
      ],
    }
  ),
]))