import swal from 'sweetalert'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const downloadExcel = async (urn, fileName) => {
  if (fileName.indexOf('.rvt') === -1) {
    swal({
      title: 'Error',
      text: 'This file is not a Revit file',
      icon: 'error',
      dangerMode: true
    })
    return
  }
  const metadataRes = await fetch('https://localhost:44348/metadata/' + btoa(urn))
  const metadataJson = await metadataRes.json()
  console.log(metadataJson)

  const wb = XLSX.utils.book_new()
  for (const table in metadataJson) {
    const sheet = XLSX.utils.json_to_sheet(metadataJson[table])
    XLSX.utils.book_append_sheet(wb, sheet, table)
  }
  debugger
  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' })
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), fileName.replace('.rvt', '.xlsx'))
}

function s2ab (s) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

export default downloadExcel
