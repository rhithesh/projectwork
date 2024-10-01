import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));

umi.use(irysUploader());
