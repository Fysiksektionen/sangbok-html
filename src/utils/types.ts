export type Song = {
  title: string,
  author: string,
  melody: string,
  text: string,
}

export type Chapter = {
  chapter: string,
  prefix: string,
  songs: [Song],
}
