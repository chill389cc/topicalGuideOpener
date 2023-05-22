import fs from 'fs'
import path from 'path'
import enquirer from 'enquirer'
import open from 'open'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const csvFileName = 'scriptures.csv'
;(async ()=> {
  let i
  try {
    const fileStr = fs.readFileSync(path.resolve(__dirname, csvFileName), 'utf8')
    const rows = fileStr.split('\r\n')
    const response = await enquirer.prompt({
      type: 'input', name: 'index',
      message: 'What index do you want to start at?'
    });
    const index = parseInt(response.index)
    if ( index < 1 || index >= rows.length ) {
      console.error(`Index out of bounds, must be at least 1 and no more than ${rows.length - 1}}`)
      return
    }
    for (i = index; i < rows.length; i++) {
      const url = new URL(rows[i].split(',')[2].replaceAll('"',''))
      await open(url.toString())
      const prompt = new enquirer.Toggle({
        message: `You just viewed scripture ${i}. View another?`,
        disabled: 'Yes',
        enabled: 'No, quit.'
      });
      const wantsToQuit = await prompt.run()
      if (wantsToQuit) {
        break
      }
      console.clear()
    }
    printBold(`You finished on index ${i}. Continue one index ${i+1} next time.`)
  } catch (e) {
    console.error('Unexpected Error:', e)
  }

})()

function printBold(string) { // used to mimic the text style used by 'enquirer'
  console.log('\x1b[1m%s\x1b[0m', string)
}