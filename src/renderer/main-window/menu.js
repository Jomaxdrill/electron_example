const  remote  = require('@electron/remote')
const { openDirectory, receiveImages, saveFile, openPreferences, uploadImage, pasteImage } = require('./IpcRendererEvents')

function createMenu(){
    const template = [
        {
            label: 'File',
            submenu: [

                {
                    label: 'open ',
                    click () { openDirectory() }
                },
                {
                    label: 'Save',
                    accelerator: 'Ctrl+Alt+S',
                    click () { saveFile() }
                },
                {
                    label: 'Preferences',
                    click () { openPreferences() }

                },
                {
                    label: 'Close',
                    role: 'quit'
                }

            ]
        },
        {
            label: 'Edit',
            submenu: [
                // {
                //     label: 'Print',
                //     click () { pasteImage() }
                // }
                {
                    label: 'Save Cloud Up',
                    click () { uploadImage() }
                },
                {
                    label: 'Paste',
                    accelerator: 'Ctrl+V',
                    click () { pasteImage() }
                }
            ]
        }
    ]
    const menu = remote.Menu.buildFromTemplate(template)
    remote.Menu.setApplicationMenu(menu)
}
module.exports = createMenu