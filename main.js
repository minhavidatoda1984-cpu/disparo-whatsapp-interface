const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "MG Sender Pro",
        icon: path.join(__dirname, 'assets/icon.png'), // Vamos providenciar um ícone depois
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Permite usar recursos do Node no front se precisar
            webSecurity: false // Permite carregar arquivos locais sem bloqueio de CORS (importante para o Excel/Imagens)
        },
        autoHideMenuBar: true,
        backgroundColor: '#0f172a' // Cor de fundo do seu tema para não piscar branco
    });

    win.loadFile('index.html');

    // Abrir links externos no navegador padrão e não dentro do app
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
