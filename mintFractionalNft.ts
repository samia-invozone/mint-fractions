import { NodeWallet} from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { mintNft } from "./utils/mintNft";

const fs = require("fs");
const fetch = require("node-fetch");
const FormData = require('form-data');

const private_key = Uint8Array.from([154,57,248,111,233,72,89,164,3,116,248,85,231,7,87,116,236,34,210,35,51,33,106,23,24,231,82,92,150,20,169,196,111,11,32,103,64,9,246,104,182,179,35,40,149,115,177,45,28,168,161,88,217,75,116,69,109,149,131,219,112,163,228,95]);
const keypair = Keypair.fromSecretKey(private_key);
const myWallet = new NodeWallet(keypair);

function timeout(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');  

(async() => {
    // to mint fractional nft
    const fractionNftMetadata = "https://gateway.pinata.cloud/ipfs/QmeZfpcoHRXX6a8YQdFTYamYBLAKAaYdgZcniZbMpcNt21";
    const mintFractionalNft = await mintNft(connection,myWallet,fractionNftMetadata,0);
    console.log("Fractional NFT Minted==>", mintFractionalNft);
    
})();


