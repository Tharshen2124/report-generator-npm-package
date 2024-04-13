import fs from 'fs';
import PDFDocument from 'pdfkit'

export default function getCenterAlignCenterPoint(value: number, nextValue: number, width: number): number {
  const widthAfterMinus = (nextValue - value) - width
  const margin = widthAfterMinus / 2
  const point = value + margin
  console.log('whole width after minus: ', widthAfterMinus)
  console.log('Width', width)
  console.log('margin', margin)
  console.log('Point', point)
  return point
}

try {
  // reads file content in utf8 encoding
  const fileContent = fs.readFileSync('../test-folder/script.js', 'utf8')
} catch (error: any) {
  console.error(`Error reading file: ${error.message}`)
}

// Create a new PDF document object
// A4 size is 595.28px x 841.89px
const doc = new PDFDocument({ size: 'A4' })

// create pdf document
doc.pipe(fs.createWriteStream('output.pdf'))

const headerTexts = [
  { text: "Test" },
  { text: "Expected Result" },
  { text: "Actual Result" },
  { text: "Pass" }
]

const columnHeaderPoints = [
  { x: 20, y: 20 },
  { x: 180, y: 20 },
  { x: 340, y: 20 },
  { x: 490, y: 20 },
  { x: 575, y: 20 }
]

const headerColumnHeight = 20
const yStarterPoint = 20

// create header row
for(let i=0; i<columnHeaderPoints.length-1; i++) 
{
  doc.moveTo(columnHeaderPoints[i].x, columnHeaderPoints[i].y)
    .lineTo(columnHeaderPoints[i+1].x, yStarterPoint)
    .lineTo(columnHeaderPoints[i+1].x, yStarterPoint + headerColumnHeight)  
    .lineTo(columnHeaderPoints[i].x, yStarterPoint + headerColumnHeight)
    .lineTo(columnHeaderPoints[i].x, yStarterPoint)
    
    .font('Times-Roman')
    .fillAndStroke("#d9d9d9", "#000")
    .fontSize(12)
    .fillColor('black')
  
  console.log('-----Round ' + [i+1] + '-----')
  console.log("Next Value: ", columnHeaderPoints[i+1].x)
  console.log("Value: ", columnHeaderPoints[i].x)
  console.log('-----------------------------')

  const width = Math.round(doc.widthOfString(headerTexts[i].text))
  doc.text(headerTexts[i].text, getCenterAlignCenterPoint(columnHeaderPoints[i].x, columnHeaderPoints[i+1].x, width), 25)  
  doc.text("hello", 540, 60)
}

doc.stroke()

// finalise the pdf and end the stream
doc.end()