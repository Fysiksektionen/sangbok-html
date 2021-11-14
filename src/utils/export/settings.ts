/** A setting that can only be set to a boolean value. */
export type BoolSetting = {
  text: string,
  type: 'bool',
  value: boolean
}

/** A setting that can only be set to a string value. */
export type StringSetting = {
  text: string,
  type: 'string',
  value: string
}

/** A setting that can only be set to a numeric value. */
export type NumberSetting = {
  text: string,
  type: 'number',
  value: number,
  min: number,
  max: number,
  placeholder?: string
}

/** Represents a setting containing either a string, boolean or numeric value. */
export type DownloadSetting = BoolSetting | StringSetting | NumberSetting
