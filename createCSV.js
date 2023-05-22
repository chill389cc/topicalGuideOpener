import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const htmlFileDir = "html"
const linkRegex = /(<a).+?(<\/a>)/gm
const innerTextRegex = /(?<=>).+(?=<)/gm
const linkURLRegex = /(?<=href=").+(?=">)/gm
const outputCSVFileName = 'scriptures.csv'
const churchBaseURL = 'https://www.churchofjesuschrist.org'
let prevText = ''

;(async ()=>{
  try {
    // Get the files in src directory as an array
    const files = await fs.promises.readdir(htmlFileDir)
    for (const file of files) {
      const topicName = file.split('.')[0]
      // Get the full paths
      const fromPath = path.join(htmlFileDir, file)

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fromPath)

      if (!stat.isFile()) {
        console.error('expected file in html folder, found directory')
        continue
      }

      const fileStr = fs.readFileSync(path.resolve(__dirname, htmlFileDir+'/'+file), 'utf8')
      const links = fileStr.match(linkRegex)

      for (const link of links) {
        let innerText = link.match(innerTextRegex)[0]
          .replaceAll('–','-') // replace weird dashes
          .replaceAll('&nbsp;',' ') // replace weird spaces
          .replaceAll('&amp;','&') // replace ampersands

        // sometimes the links don't include the book name, so we need to add it
        if (prevText === '' || // if this is the first link \, OR
          !(innerText.match(/.*[a-zA-Z].*/gm) === null) // if the link has text
        ) {
          prevText = innerText.split(' ')[0]
        } else {
          innerText = [prevText, innerText].join(' ')
        }

        const URL = churchBaseURL + link.match(linkURLRegex)

        await writeToCSV(outputCSVFileName, `"${topicName}","${innerText}","${URL}"`)
      }
    }
  }
  catch(e) {
    // Catch anything bad that happens
    console.error('Unexpected Error:', e)
  }
})()

const writeToCSV = async (fileName, string) => {
  // output file in the same folder
  const filename = path.join(__dirname, `${fileName}`);
  // If file doesn't exist, we will create new file and add rows with headers.
  if (!fs.existsSync(filename)) {
    fs.appendFileSync(filename, 'Topic,Scripture,Link');
    fs.appendFileSync(filename, '\r\n');
  }
  // Append file function can create new file too.
  fs.appendFileSync(filename, string);
  // Always add new line if file already exists.
  fs.appendFileSync(filename, '\r\n');
}
