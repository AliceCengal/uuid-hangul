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
      bitarray[i] = (code.codePointAt(i) - HANGUL_START)
        .toString(16)
        .padStart(3, "0");
    } else {
      bitarray[i] = (code.codePointAt(i) - HANGUL_START)
        .toString(2)
        .padStart(13, "0");
    }
  }

  const first = bitarray[0];
  const second = bitarray.slice(1, 5).join("");
  const third = bitarray.slice(5, 9).join("");
  const fourth = bitarray[9];

  const output = [
    first + parseInt(second.slice(0, 20), 2).toString(16).padStart(5, "0"),
    parseInt(second.slice(20, 36), 2).toString(16).padStart(4, "0"),
    parseInt(second.slice(36), 2).toString(16).padStart(4, "0"),
    parseInt(third.slice(0, 16), 2).toString(16).padStart(4, "0"),
    parseInt(third.slice(16), 2).toString(16).padStart(9, "0") + fourth,
  ];
  return output.join("-");
}

const mask1 = 0x1fffn;

function parse13(uuid) {
  let v;
  const arr = Array(10).fill(0);
  arr[0] = parseInt(uuid.slice(0, 3), 16);

  v =
    parseInt(uuid.slice(3, 8), 16).toString(2).padStart(20, "0") +
    parseInt(uuid.slice(9, 13), 16).toString(2).padStart(16, "0") +
    parseInt(uuid.slice(14, 18), 16).toString(2).padStart(16, "0");
  arr[1] = parseInt(v.slice(0, 13), 2);
  arr[2] = parseInt(v.slice(13, 26), 2);
  arr[3] = parseInt(v.slice(26, 39), 2);
  arr[4] = parseInt(v.slice(39), 2);

  v =
    parseInt(uuid.slice(19, 23), 16).toString(2).padStart(16, "0") +
    parseInt(uuid.slice(24, 33), 16).toString(2).padStart(36, "0");
  arr[5] = parseInt(v.slice(0, 13), 2);
  arr[6] = parseInt(v.slice(13, 26), 2);
  arr[7] = parseInt(v.slice(26, 39), 2);
  arr[8] = parseInt(v.slice(39), 2);

  arr[9] = parseInt(uuid.slice(33, 36), 16);

  return arr;
}
