import {
  updateV1,
  fetchMetadataFromSeeds,
} from "@metaplex-foundation/mpl-token-metadata";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";
import {
  generateSigner,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import {
  createGenericFile,
  createSignerFromKeypair,
  type GenericFile,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "./wallet.json";

const umi = createUmi(clusterApiUrl("devnet"));
umi.use(mplTokenMetadata());

const asset = generateSigner(umi);
console.log(asset);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

const initialMetadata = await fetchMetadataFromSeeds(umi, {
  mint: publicKey("1LYEqo6WuCevapNDQi5a8zKnUwS8nvrUyA2bQauRMFR"),
});

console.log(initialMetadata);
var c = initialMetadata;
c.sellerFeeBasisPoints = 0;
await updateV1(umi, {
  mint: publicKey("1LYEqo6WuCevapNDQi5a8zKnUwS8nvrUyA2bQauRMFR"),
  authority: signer,
  data: { ...c, name: "randi" },
}).sendAndConfirm(umi);
