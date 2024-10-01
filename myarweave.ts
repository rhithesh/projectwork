import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import wallet from "./wallet.json";
import path from "path";
import fs from "fs";

import {
  createGenericFile,
  createSignerFromKeypair,
  type GenericFile,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// UMI connection
const umi = createUmi(clusterApiUrl("devnet"));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(irysUploader());
umi.use(signerIdentity(signer));

const metadata = {
  name: "Explore JAPAN",
  symbol: "EXJAP",
  description: "test token",
  uri: "https://github.com/user-attachments/assets/25a464d5-c602-4cac-b2ec-16ff28ea9786",
  creators: [
    {
      address: "CeYv5PsCftUeXgTEq1A6HGYUENfzboB5uPCeRanfFH8u",
    },
  ],
};

const umiJsonFile = createGenericFile(
  JSON.stringify(metadata),
  "explore-japan-metadata",
  {
    tags: [{ name: "Content-Type", value: "JSON" }],
  },
);

const uri = (await umi.uploader.upload([umiJsonFile]))[0].replace(
  "arweave.net",
  "gateway.iryz.xyz",
);
console.log(`Your metadata uri: ${uri}`);
