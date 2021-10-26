import JSZip from 'jszip'

/**
 * Downloads a file, given by an ObjectURL, with the given filename.
 * @param link An ObjectURL string with file contents.
 * @param filename The file name of the download.
 */
function download (link: string, filename: string) {
  // Create a link
  const a = document.createElement('a')
  a.setAttribute('href', link)
  a.setAttribute('download', filename)
  a.setAttribute('target', '_blank')

  // Add it to the body, hidden
  a.style.display = 'none'
  document.body.appendChild(a)

  // Click the link, and remove it
  a.click()
  document.body.removeChild(a)
}

/**
 * Generates a zip file from the given file-content dictionary, and downloads it.
 * @param files A dictionary with filenames and contents (as string).
 */
export default async function downloadZip(files: { [key: string]: string }): Promise<void> {
  const zip = new JSZip()

  for (const [key, value] of Object.entries(files)) { zip.file(key, value) }

  zip.generateAsync({ type: 'blob' })
    .then(function (blob) {
      const url = window.URL.createObjectURL(blob)
      download(url, 'sangblad.zip')
      window.URL.revokeObjectURL(url)
    })
}
