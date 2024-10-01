import bs58 from "bs58"; // To encode as Base58
const privateKey = new Uint8Array([
  226, 110, 106, 217, 128, 237, 13, 191, 137, 203, 232, 65, 103, 208, 91, 182,
  217, 36, 143, 22, 23, 74, 114, 203, 98, 1, 44, 242, 148, 8, 135, 254, 68, 49,
  149, 230, 223, 141, 120, 147, 190, 78, 101, 246, 153, 150, 60, 179, 14, 24,
  194, 90, 212, 18, 194, 154, 44, 144, 86, 254, 189, 121, 37, 12,
]);
const privateKeyString = bs58.encode(privateKey);

console.log("Private Key String:", privateKeyString);
