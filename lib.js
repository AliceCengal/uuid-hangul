const HANGUL_START = 44032;

export function encode(uuidv4) {
  const bitarray = parse12(uuidv4);
  const output = Array(bitarray.length).fill(1);
  for (const i in bitarray) {
    output[i] = String.fromCodePoint(HANGUL_START + bitarray[i]);
  }
  return output.join("");
}

export function decode(code) {
  const bitarray = Array(code.length).fill(0);
  for (const i in code) {
    bitarray[i] = (code.codePointAt(i) - HANGUL_START).toString(16);
    if (i % 3 !== 0) {
      bitarray[i] = bitarray[i].padStart(3, "0");
    } else {
      bitarray[i] = bitarray[i].padStart(2, "0");
    }
  }

  return [
    bitarray[0] + bitarray[1] + bitarray[2],
    bitarray[3] + bitarray[4].slice(0, 2),
    bitarray[4].slice(2) + bitarray[5],
    bitarray[6] + bitarray[7].slice(0, 2),
    bitarray[7].slice(2) +
    bitarray[8] +
    bitarray[9] +
    bitarray[10] +
    bitarray[11],
    // ];
  ].join("-");
}

function parse12(uuid) {
  let v;
  const arr = Array(12).fill(0);

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = (v >>> 12) & 0xfff;
  arr[2] = v & 0xfff;

  arr[3] = (v = parseInt(uuid.slice(9, 13) + uuid.slice(14, 18), 16)) >>> 24;
  arr[4] = (v >>> 12) & 0xfff;
  arr[5] = v & 0xfff;

  arr[6] = (v = parseInt(uuid.slice(19, 23) + uuid.slice(24, 28), 16)) >>> 24;
  arr[7] = (v >>> 12) & 0xfff;
  arr[8] = v & 0xfff;

  arr[9] = (v = parseInt(uuid.slice(28, 36), 16)) >>> 24;
  arr[10] = (v >>> 12) & 0xfff;
  arr[11] = v & 0xfff;

  return arr;
}