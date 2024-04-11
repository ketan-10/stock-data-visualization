/**
 * Instead of storing huge dummy json
 * Generated based on seed. so each time will get same data for same input.
 */
export function genSeededData(symbol: string, period: "daily" | "hourly") {
  const key = hash(symbol) & hash(period);
  const rand = new Random(key);
  return genRandom(rand, period);
}

export function genRandom(rand: Random, period: "daily" | "hourly") {
  const randomFactor = 25 + rand.random() * 25;
  function samplePoint(i: number) {
    return (
      i *
        (0.5 +
          Math.sin(i / 20) * 0.2 +
          Math.sin(i / 500) * 0.2 + // weitht
          Math.sin(i / randomFactor) * 0.5) +
      200
    );
  }

  const res = [];
  const date = new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0));
  const numberOfPoints = 300;
  for (let i = 0; i < numberOfPoints; ++i) {
    const time = date.getTime() / 1000;
    const value = samplePoint(i);

    const randomRanges = [-1 * rand.random(), rand.random(), rand.random()].map(
      (i) => i * 10
    );
    const sign = Math.sin(rand.random() - 0.5);
    res.push({
      time,
      low: value + randomRanges[0],
      high: value + randomRanges[1],
      open: value + sign * randomRanges[2],
      close: samplePoint(i + 1),
      value,
    });

    if(period == 'daily') {
        date.setUTCDate(date.getUTCDate() + 1);
    } else {
        date.setUTCHours(date.getUTCHours() + 1);
    }
  }

  return res;
}

class Random {
  private m_w: number;
  private m_z: number;
  private mask: number;

  constructor(seed: number) {
    this.mask = 0xffffffff;
    this.m_w = (123456789 + seed) & this.mask;
    this.m_z = (987654321 - seed) & this.mask;
  }

  random(): number {
    this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
    this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
    let result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
  }
}

function hash(input: string) {
  let hash = 0,
    i,
    chr;
  if (input.length === 0) return hash;
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}