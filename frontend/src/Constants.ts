export const BASE_URL = '/stock-data-visualization/'

export type ChartResponse = {
  time: number
  low: number
  high: number
  open: number
  close: number
  value: number
}


export function dataCsvToJson(inputCsv: string){
  const lines = inputCsv.split("\n")

  return lines.map(l => {
    const record = l.split(",")

    const time = record[0];
    const date = new Date(parseInt(time.substring(4,6)) + 2000, parseInt(time.substring(2,4)) - 1, parseInt(time.substring(0,2)));
    return {
      time: date.getTime() / 1000,
      open: parseInt(record[3]),
      high: parseInt(record[4]),
      low: parseInt(record[5]),
      close: parseInt(record[6]),
      value: parseInt(record[7]),
      date: date
    }
  }).filter(a => a.time).sort((a, b) => a.date- b.date)

}

export async function fetchStream(res: Response, callback: (res: any[]) => void) {

    if (!res.ok || !res.body) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    const csvToJson = (line: string) => {
        // You can replace this with any processing logic you need
        const record = line.split(",")
        return {
          'id': record[0],
          'name': record[1],
          'symbol': record[2],
          'ISIN': record[3],
        }
    };
    
    let buffer = '';
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += value;

        const lines = buffer.split('\n');
        const jsonOp = lines.map(l => csvToJson(l));
        let before = 0;
        const elements = 500;
        for(let i=elements; i< jsonOp.length;i = i+elements){
          await new Promise(r => setTimeout(r, 1000))
          callback(jsonOp.slice(before,i))
          before = i;
        }
        // set buffer to last line only 
        buffer = lines[lines.length - 1];
    }
    // last remaining line
    if (buffer) {
        callback([csvToJson(buffer)]);
    }
}

// Safari does not supports returning new stream: 
/**

async function fetchStream(res: Response) {

  if (!res.ok || !res.body) {
      throw new Error(`HTTP error! status: ${res.status}`);
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  const csvToJson = (line: string) => {
      // You can replace this with any processing logic you need
      const record = line.split(",")
      return {
        'id': record[0],
        'name': record[1],
        'symbol': record[2],
        'ISIN': record[3],
      }
  };

  return new ReadableStream({
    start(controller){
      let buffer = '';
      return pump()
      function pump(): any {
        return reader.read().then(({done, value}) => {
          if (done) {
            if(buffer) {
              controller.enqueue(csvToJson(buffer));
            } 
            controller.close();
            return;
          }
          
          buffer += value;

          const lines = buffer.split('\n');
          const jsonOp = lines.map(l => csvToJson(l));
          controller.enqueue(jsonOp)
          // set buffer to last line only 
          buffer = lines[lines.length - 1];

          return pump()
        })
      }
    }
  })
    
}

const fetchingAsync = async () => {
  const res = await fetch("https://raw.githubusercontent.com/ketan-10/stock-data-visualization/master/cron/Equity.csv");
  if(!res.body) return; 
  //for await (const chunk of res.body) {
  //   console.log(chunk)
  // }
  for await (const chunk of fetchStream(res)) {
      console.log(chunk)
  }
}
fetchingAsync() 

*/
