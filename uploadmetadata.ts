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
import {
  createMetadataAccountV3,
  type CreateMetadataAccountV3InstructionAccounts,
  type CreateMetadataAccountV3InstructionArgs,
  type DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";
import data from "./data.json";

const mint = new PublicKey("HykgUZFtfw79GK7h1GpH2MTbwhaVNM49iuqkyaa4gnCp");
console.log(data);

// UMI connection
const umi = createUmi(clusterApiUrl("devnet"));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    const update = await Promise.all(
      data.map(async (e) => {
        const metadata = {
          symbol: "COOL",
          ...e,
          image: e.image_url,
          creators: [
            {
              address: "H1V3XkxhGuADph1ajAWmTjwUcY6Y8EVX3PfXosdsP2JM",
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
          "devnet.irys.xyz",
        );
        //@ts-ignore
        e.uri = uri;

        return e;
      }),
    );

    console.log(update);
    fs.writeFileSync("answer.json", JSON.stringify(update, null, 2));
  } catch (error) {
    console.log(error);
  }
})();
