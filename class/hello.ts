import {
  generateSigner,
  percentAmount,
  publicKey,
  type Umi,
  type Signer,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";
import {
  createV1,
  TokenStandard,
  mintV1,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";

import {
  updateV1,
  fetchMetadataFromSeeds,
} from "@metaplex-foundation/mpl-token-metadata";

class SolanaNFTMinter {
  private umi: Umi;
  private signer: Signer;
  private mint: Signer;

  constructor(
    walletSecretKey: number[],
    cluster: "devnet" | "mainnet-beta" = "devnet",
  ) {
    // Initialize UMI
    this.umi = createUmi(clusterApiUrl(cluster));
    this.umi.use(mplTokenMetadata());

    // Set up wallet and signer
    const keypair = this.umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(walletSecretKey),
    );
    this.signer = createSignerFromKeypair(this.umi, keypair);
    this.umi.use(signerIdentity(this.signer));

    // Generate mint signer
    this.mint = generateSigner(this.umi);
  }

  async updateNft({
    mint,
    name,
    newName,
  }: {
    mint: string;
    name: string;
    newName: string;
  }) {
    const initialMetadata = await fetchMetadataFromSeeds(this.umi, {
      mint: publicKey(mint),
    });

    console.log(initialMetadata);

    await updateV1(this.umi, {
      mint: publicKey(mint),
      authority: this.signer,
      data: { ...initialMetadata, name: newName },
    }).sendAndConfirm(this.umi);
  }

  async createAndMintNFT(
    name: string,
    uri: string,
    tokenOwner: string,
    sellerFeeBasisPoints: number = 0,
  ) {
    try {
      // Create the NFT metadata
      const createTx = await createV1(this.umi, {
        mint: this.mint,
        authority: this.signer,
        name,
        uri,
        sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints),
        tokenStandard: TokenStandard.NonFungible,
      }).sendAndConfirm(this.umi);

      // Mint the NFT
      const mintTx = await mintV1(this.umi, {
        mint: this.mint.publicKey,
        authority: this.signer,
        amount: 1,
        tokenOwner: publicKey(tokenOwner),
        tokenStandard: TokenStandard.NonFungible,
      }).sendAndConfirm(this.umi);

      return {
        mintAddress: this.mint.publicKey,
        createTx,
        mintTx,
      };
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  }

  getMintAddress() {
    return this.mint.publicKey;
  }

  getSignerAddress() {
    return this.signer.publicKey;
  }
}

export default SolanaNFTMinter;
