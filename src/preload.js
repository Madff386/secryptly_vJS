const { Titlebar, Color} = require("custom-electron-titlebar");
const i18n = require('./UI/i18n');

window.addEventListener('DOMContentLoaded', () => {
  new Titlebar({
    backgroundColor: Color.fromHex("#303032"),
    itemBackgroundColor: Color.fromHex("#3A3A3C"),
    svgColor: Color.fromHex("#677078"),
    icon: "../static/images/icon-transparent.ico",
  });
})

const {	contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
	"api", {
      ipcComm: {
          send: (channel, data) => {
          ipcRenderer.send(channel, data);
        },
        on: (channel, callback) => {
          // Remove `event` parameter (the underscore parameter) as the UI doesn't need it
          ipcRenderer.on(channel, (_, ...args) => {
            callback(...args);
          });
        },
        removeAllListeners: (channel) => {
          ipcRenderer.removeAllListeners(channel);
        },
        invoke: (channel, data) => {
          return ipcRenderer.invoke(channel, data);
        }
    },
    i18n: {
      t: (text) => {
        return i18n.t(text);
      }
    }
	}
);

