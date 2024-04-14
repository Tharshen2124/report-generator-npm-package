import { exec } from 'child_process';
import fs from 'fs';
import PDFDocument from 'pdfkit'

function cleanUp(lines: string[], atType: string) {
  const filteredLines = lines.filter((line) => {
    return line.includes(atType)
  })

  const cleanedLines = filteredLines.map((line) => {
    const brokenLines = line.split(':')
    return brokenLines[1];
  })

  return cleanedLines;
}

console.log("Reading your test files...")

  // reads file content in utf8 encoding
  
const fileContent = fs.readFileSync('../test-folder/script.test.js', 'utf8')
const lines = fileContent.split('\n')

const titles = cleanUp(lines, '@title')
const descriptions = cleanUp(lines, '@description')

console.log("Test files read, now running tests...")

exec('npm test', (error, stdout, stderr) => {
  if(error) {
    console.error('error', error)
  } else if(stdout) {
    console.log('stdout', stdout)
  } else if(stderr) {
    console.log("stderr", stderr)
  }
})


console.log("Test ran. Now creating the document...")

// Create a new PDF document object
// A4 size is 595.28px x 841.89px
const doc = new PDFDocument({ size: 'A4' })

// create pdf document
doc.pipe(fs.createWriteStream('output.pdf'))

const headerTexts = [
  "Test",
  "Expected Result",
  "Actual Result",
  "Pass"
]

const columnHeaderPoints = [
  { x: 20, y: 20 },
  { x: 180, y: 20 },
  { x: 340, y: 20 },
  { x: 500, y: 20 },
  { x: 575, y: 20 }
]

const headerColumnHeight = 20

// create header row
for(let i=0; i<columnHeaderPoints.length-1; i++) {
  doc.moveTo(columnHeaderPoints[i].x, columnHeaderPoints[i].y)
    .rect(columnHeaderPoints[i].x, 20, columnHeaderPoints[i+1].x - columnHeaderPoints[i].x, headerColumnHeight)
    .font('Times-Bold')
    .fillAndStroke("#d9d9d9", "#000")
    .fontSize(12)
    .fillColor('black')
    .text(headerTexts[i], columnHeaderPoints[i].x, 25, {width: (columnHeaderPoints[i+1].x-columnHeaderPoints[i].x), align: 'center'})  
}

let y = 40
let otherY = 45
let desY = 60
 
// create rows for data
for(let i=0; i<2; i++) {
  doc.rect(columnHeaderPoints[0].x, y, 160, 100)
    .rect(columnHeaderPoints[1].x, y, 160, 100)
    .rect(columnHeaderPoints[2].x, y, 160, 100)
    .rect(columnHeaderPoints[3].x, y, 75, 100)
    .stroke()
  y += 100
}

for(let i=0; i<2; i++) {
  doc.fontSize(11)
    .font('Times-Bold')
    .text(titles[i], 24, otherY, { 
    width: columnHeaderPoints[1].x - columnHeaderPoints[0].x - 8,
    align: 'left',
    underline: true
  })

  doc.font('Times-Roman')
    .text(descriptions[i], 24, desY, {
      width: columnHeaderPoints[1].x - columnHeaderPoints[0].x - 8,
      align: 'left'
    })
  otherY += 100 
  desY += 100
}

doc.stroke()

// finalise the pdf and end the stream
doc.end()

console.log('Your document is ready!')