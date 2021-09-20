export default function openInOverleaf(files: {[key: string]: string}): void {
  const form = document.createElement('form')
  form.setAttribute('method', 'post')
  form.setAttribute('action', 'https://www.overleaf.com/docs')
  form.setAttribute('target', '_blank')

  for (const [key, value] of Object.entries(files)) {
    const name = document.createElement('input')
    name.setAttribute('type', 'hidden')
    name.setAttribute('name', 'snip_name[]')
    name.setAttribute('value', key)

    const content = document.createElement('input')
    content.setAttribute('type', 'hidden')
    content.setAttribute('name', 'snip[]')
    content.setAttribute('value', value)

    form.appendChild(name)
    form.appendChild(content)
  }

  document.body.appendChild(form)
  form.submit()
}
