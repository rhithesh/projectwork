import { generateSigner } from "@metaplex-foundation/umi";
import { create } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import wallet from "./wallet.json";
import {
  createGenericFile,
  createSignerFromKeypair,
  type GenericFile,
  signerIdentity,
} from "@metaplex-foundation/umi";
import bs58 from "bs58";

const umi = createUmi(clusterApiUrl("devnet"));

const asset = generateSigner(umi);
console.log(asset);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

const result = await create(umi, {
  asset: asset,
  name: "Hithesh",
  uri: "https://example.com/my-asset.json",
}).sendAndConfirm(umi);

const [imageUri] = await umi.uploader.upload([imageFile]);
const uri = await umi.uploader.uploadJson({
  name: "My NFT",
  description: "This is my NFT",
  image: imageUri,
  // ...
});

console.log(result);
