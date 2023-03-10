const HANGUL_START = 44032;

export function encode(uuidv4) {
  const bitarray = parse13(uuidv4);
  const output = Array(bitarray.length).fill(1);
  for (const i in bitarray) {
    output[i] = String.fromCodePoint(HANGUL_START + bitarray[i]);
  }
  return output.join("");
}

export function decode(code) {
  const bitarray = Array(10).fill("");
  for (const i in code) {
    if (i == 0 || i == 9) {
      bitarray[i] = (code.codePointAt(i) - HANGUL_START).toString(16).padStart(3, '0')
    } else {
      bitarray[i] = (code.codePointAt(i) - HANGUL_START).toString(2).padStart(13, '0');
    }
  }

  const first = bitarray[0]
  const second = BigInt("0b" + bitarray.slice(1, 5).join("")).toString(16).padStart(13, '0')
  const third = BigInt("0b" + bitarray.slice(5, 9).join("")).toString(16).padStart(13, '0')
  const fourth = bitarray[9]

  const output = [
    first + second.slice(0, 5),
    second.slice(5, 9),
    second.slice(9, 13),
    third.slice(0, 4),
    third.slice(4) + fourth,
  ]
  return output.join("-")
}

const mask1 = 0x1fffn;

function parse13(uuid) {
  let v;
  const arr = Array(10).fill(0)
  arr[0] = parseInt(uuid.slice(0, 3), 16)

  arr[1] = Number((v = BigInt("0x" + uuid.slice(3, 8) + uuid.slice(9, 13) + uuid.slice(14, 18))) >> 39n);
  arr[2] = Number((v >> 26n) & mask1);
  arr[3] = Number((v >> 13n) & mask1);
  arr[4] = Number(v & mask1);

  arr[5] = Number((v = BigInt("0x" + uuid.slice(19, 23) + uuid.slice(24, 33), 16)) >> 39n);
  arr[6] = Number((v >> 26n) & mask1);
  arr[7] = Number((v >> 13n) & mask1);
  arr[8] = Number(v & mask1);

  arr[9] = parseInt(uuid.slice(33, 36), 16)

  return arr;
}
