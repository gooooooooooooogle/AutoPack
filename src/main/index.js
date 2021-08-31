import { app, BrowserWindow, Menu, globalShortcut } from 'electron'
Menu.setApplicationMenu(null) //取消菜单栏
// app.allowRendererProcessReuse = true
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options   
   */
  mainWindow = new BrowserWindow({
    height: 370,
    useContentSize: true,
    width: 680,
    //网页功能的设置
    webPreferences: {   
      nodeIntegration: true,//是否完整的支持 node. 默认值为true
      nodeIntegrationInWorker: true //在页面运行其他脚本之前预先加载指定的脚本 无论页面是否集成Node, 此脚本都可以访问所有Node API 脚本路径为文件的绝对路径
    },
    backgroundColor: '#2e2c29',
    show : false
  })

  // 解决启动白屏问题，在加载页面时，渲染进程第一次完成绘制时，会触发ready-to-show事件 。 在此事件后显示窗口将没有视觉闪烁
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.loadURL(winURL)

  // mainWindow.webContents.openDevTools({ mode: 'bottom' })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 注册快捷键
  globalShortcut.register('CommandOrControl+F12', () => {
    mainWindow.webContents.openDevTools({ mode: 'bottom' })
  })

}



app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


