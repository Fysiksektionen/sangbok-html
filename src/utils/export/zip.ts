import JSZip from 'jszip'

function download (link: string, filename: string) {
  const a = document.createElement('a')
  a.setAttribute('href', link)
  a.setAttribute('download', filename)
  a.setAttribute('target', '_blank')

  a.style.display = 'none'
  document.body.appendChild(a)

  a.click()
  document.body.removeChild(a)
}

export default async function downloadZip(files: { [key: string]: string }): Promise<void> {
  const zip = new JSZip()

  for (const [key, value] of Object.entries(files)) {
    zip.file(key, value)
  }
  zip.generateAsync({ type: 'blob' })
    .then(function (blob) {
      // see FileSaver.js
      const url = window.URL.createObjectURL(blob)
      download(url, 'sangblad.zip')
      window.URL.revokeObjectURL(url)
    })
}
