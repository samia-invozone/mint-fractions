import { NodeWallet, actions, programs } from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { pinFileToIPFS, uploadJSONToIpfs } from "./utils/uploadFileToIpfs";
import { uploadimagefs, uploadjsonfs } from "./utils/fileslackupload";

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

    async function createFractionalMint(masterEditionHash: any, fractions_arr: any, max_supply: any){
        //reading metadata from hash
        const mastermetadatadata = (await programs.metadata.Metadata.load(
            connection,
            await programs.metadata.Metadata.getPDA(masterEditionHash)
        )).data.data;

        const response = await fetch(mastermetadatadata.uri);
        const new_mint_data = await response.json();

        for (let idx = 0; idx < fractions_arr.length; idx++){

            const frac_image = fs.createReadStream(fractions_arr[idx]);
            const frac_img_url = await pinFileToIPFS(frac_image);
            
            new_mint_data["name"] = "Fraction "+idx;
            new_mint_data["image"] = frac_img_url;
            new_mint_data["properties"]["files"]["uri"] = frac_img_url
            new_mint_data["attributes"].push({
                "trait_type": "Edition Number",
                "value": idx+1
            });
            new_mint_data["attributes"].push({
                "trait_type": "Parent Mint Address",
                "value": masterEditionHash
            });
            new_mint_data["attributes"].push({
                "trait_type": "Certificate of ownership",
                "value": ""
            });

            const fraction_json_data = await uploadJSONToIpfs(new_mint_data);
            const fraction_json_url = `https://gateway.pinata.cloud/ipfs/${fraction_json_data.data.IpfsHash}`;
            console.log("Fractional Ipfs Url==> ", fraction_json_url);
        
        }
    }
    
    const masterEditionHash = "GGhbthTseeRxt7Bd47jPBEmeyvjVbRgQPh9977Y7FjEf";
    const fraction_arr = ["./newNfts/frac1.png","./newNfts/frac2.png"];
    await createFractionalMint(masterEditionHash, fraction_arr, 0);

})();


