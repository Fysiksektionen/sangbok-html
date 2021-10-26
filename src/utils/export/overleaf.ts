/**
 * Given a dict of filenames and their respective contents (as a string),
 * creates a POST-request to open these files in overleaf.
 * @param files
 */
export default function openInOverleaf(files: {[key: string]: string}): void {
  // Create form, and set target.
  const form = document.createElement('form')
  form.setAttribute('method', 'post')
  form.setAttribute('action', 'https://www.overleaf.com/docs')
  form.setAttribute('target', '_blank')

  // Loop over files
  for (const [key, value] of Object.entries(files)) {
    // Add filename to form
    const name = document.createElement('input')
    name.setAttribute('type', 'hidden')
    name.setAttribute('name', 'snip_name[]')
    name.setAttribute('value', key)
    form.appendChild(name)

    // Add file content to form
    const content = document.createElement('input')
    content.setAttribute('type', 'hidden')
    content.setAttribute('name', 'snip[]')
    content.setAttribute('value', value)
    form.appendChild(content)
  }

  // Add the form to the body, and submit.
  document.body.appendChild(form)
  form.submit()
}
