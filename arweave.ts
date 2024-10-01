import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import wallet from "./wallet.json";
import path from "path";
import mime from "mime-types";
import fs from "fs";

import {
  createGenericFile,
  createSignerFromKeypair,
 type GenericFile,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createMetadataAccountV3,

 type CreateMetadataAccountV3InstructionAccounts,
 type CreateMetadataAccountV3InstructionArgs,
 type DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";
 
const mint = new PublicKey("HykgUZFtfw79GK7h1GpH2MTbwhaVNM49iuqkyaa4gnCp");

// UMI connection
const umi = createUmi(clusterApiUrl("devnet"));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
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

    const uri = (await umi.uploader.upload([umiJsonFile]))[0].replace('arweave.net','gateway.iryz.xyz');
    console.log(`Your metadata uri: ${uri}`);

    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      // @ts-ignore
      mint,
      mintAuthority: signer,
    };
    let data: DataV2Args = {
      name: "Explore JAPAN",
      symbol: "EXJAP",
      uri: uri[0],
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: true,
      collectionDetails: null,
    };
    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });
    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
    // 52DSqJHtUc1Y1eFpSYuEtPR93LLEa3X1EqVjA872nKYGDgq3rmuMdzbAbNQrmUE11xTiMyRdGW2jygUzVGdg98hE
  } catch (error) {
    console.log(error);
  }
})();
