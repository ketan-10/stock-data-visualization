export const BASE_URL = '/stock-data-visualization/'

export type ChartResponse = {
  time: number
  low: number
  high: number
  open: number
  close: number
  value: number
}

export function dataCsvToJson(inputCsv: string) {
  const lines = inputCsv.split('\n')

  return lines
    .map((l) => {
      const record = l.split(',')

      const time = record[0]
      const date = new Date(
        parseInt(time.substring(4, 6)) + 2000,
        parseInt(time.substring(2, 4)) - 1,
        parseInt(time.substring(0, 2))
      )
      return {
        time: date.getTime() / 1000,
        open: parseInt(record[3]),
        high: parseInt(record[4]),
        low: parseInt(record[5]),
        close: parseInt(record[6]),
        value: parseInt(record[7])
      }
    })
    .filter((a) => a.time)
    .sort((a, b) => a.time - b.time)
}

export type CompanyInfo = {
  id: string
  name: string
  symbol: string
  ISIN: string
}

export async function fetchStream(res: Response, callback: (res: CompanyInfo[]) => void) {
  if (!res.ok || !res.body) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
  const csvToJson = (line: string) => {
    // You can replace this with any processing logic you need
    const record = line.split(',')
    return {
      id: record[0],
      name: record[1],
      symbol: record[2],
      ISIN: record[3]
    }
  }

  let buffer = ''
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += value

    const lines = buffer.split('\n')
    const jsonOp = lines.slice(0, -1).map((l) => csvToJson(l))
    callback(jsonOp)
    // set buffer to last line only
    buffer = lines[lines.length - 1]
  }
  // last remaining line
  if (buffer) {
    callback([csvToJson(buffer)])
  }
}
