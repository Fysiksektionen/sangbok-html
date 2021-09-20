export type BoolSetting = {
  text: string,
  type: 'bool',
  value: boolean
}

export type StringSetting = {
  text: string,
  type: 'string',
  value: string
}

export type NumberSetting = {
  text: string,
  type: 'number',
  value: number,
  min: number,
  max: number,
  placeholder?: string
}

export type DownloadSetting = BoolSetting | StringSetting | NumberSetting
