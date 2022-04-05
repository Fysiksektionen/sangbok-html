const INDEX_MAP: { [key: string]: string } = {
  '✻': 'img/ths_emblem_filled_black.svg'
}


export default function Index({ index }: { index: string }): JSX.Element {
  type ParsedIndex = {
    key?: string,
    image?: string,
    text: string
  }
  
  /**
   * Takes an index, and splits it into an image part and a suffix string part.
   * @param index Index as as a string
   * @returns A ParsedIndex object, containing the index, split into an image and a string part, as well as the matched key.
   */
  function computeData(index: string): ParsedIndex {
    for (const key of Object.keys(INDEX_MAP)) {
      if (index.startsWith(key)) {
        return { key: key, image: INDEX_MAP[key], text: index.slice(key.length) }
      }
    }
    return { text: index }
  }
  

  let data = computeData(index || '');

  return (
      <>
        { data.image && <img src={data.image} class="inline" /> }
        { data.text }
      </>
  )
}