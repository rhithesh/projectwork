import {
  generateSigner,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  createV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  createSignerFromKeypair,
  type GenericFile,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "./wallet.json";
import { mintV1 } from "@metaplex-foundation/mpl-token-metadata";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

const umi = createUmi(clusterApiUrl("devnet"));
umi.use(mplTokenMetadata());

const asset = generateSigner(umi);
console.log(asset);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));
const mint = generateSigner(umi);
const uri = "https://example.com/my-asset.json";

await createV1(umi, {
  mint,
  authority: signer,
  name: "vibedees",
  uri: "https://devnet.irys.xyz/5QDBw1tTb3sfbW46Uv7a7neBVpoyeNutktgSGE5tDche",
  sellerFeeBasisPoints: percentAmount(0),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);

await mintV1(umi, {
  mint: mint.publicKey,
  authority: signer,
  amount: 1,
  tokenOwner: publicKey("H1V3XkxhGuADph1ajAWmTjwUcY6Y8EVX3PfXosdsP2JM"),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
