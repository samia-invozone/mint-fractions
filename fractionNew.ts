import { NodeWallet, actions, programs } from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { pinFileToIPFS, uploadJSONToIpfs } from "./utils/uploadFileToIpfs";
import { uploadimagefs, uploadjsonfs } from "./utils/fileslackupload";

const fs = require("fs");
const FormData = require('form-data');

const private_key = Uint8Array.from([154,57,248,111,233,72,89,164,3,116,248,85,231,7,87,116,236,34,210,35,51,33,106,23,24,231,82,92,150,20,169,196,111,11,32,103,64,9,246,104,182,179,35,40,149,115,177,45,28,168,161,88,217,75,116,69,109,149,131,219,112,163,228,95]);
const keypair = Keypair.fromSecretKey(private_key);
const myWallet = new NodeWallet(keypair);

function timeout(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');  

(async() => {
    //requires
    //masterData["image_path"] = image_path
    //masterData["json"] = json_path
    //fractions_arr = array of paths of fractional images
    async function createFractionalMint(master_data: any, fractions_arr: any, max_supply: any){
        if (max_supply < fractions_arr.length){
            throw new Error('invalid max_supply');
        }

        var file_url = await pinFileToIPFS(master_data["image_path"]);
        master_data["json"]["image"] = file_url;
        master_data["json"]["properties"]["files"]["uri"] = file_url;
        
        var json_url = await uploadJSONToIpfs(master_data["json"]);
        const master_json_url = `https://gateway.pinata.cloud/ipfs/${json_url.data.IpfsHash}`

        //sleeping for files to be uploaded and generate url
        await timeout(1000);

        const mintNFTResponse = await actions.mintNFT({
            connection,
            wallet: myWallet,
            uri: master_json_url,
            maxSupply: max_supply,
          });

        console.log("Minted Master Edition: ", mintNFTResponse.mint.toBase58())

          //waiting to mint and update on solana server so we can mint edition on it
        await timeout(3000);

        for (let idx = 0; idx < fractions_arr.length; idx++){

            const frac_image = fs.createReadStream(fractions_arr[idx]);
            const frac_img_url = await pinFileToIPFS(frac_image);

            const new_mint_data = JSON.parse(JSON.stringify(master_data["json"]));
            new_mint_data["name"] = "Fraction "+idx;
            new_mint_data["image"] = frac_img_url;
            new_mint_data["properties"]["files"]["uri"] = frac_img_url
            new_mint_data["attributes"].push({
                "trait_type": "Edition Number",
                "value": idx+1
            });
            new_mint_data["attributes"].push({
                "trait_type": "Parent Mint Address",
                "value": mintNFTResponse.mint.toBase58()
            });
            new_mint_data["attributes"].push({
                "trait_type": "Certificate of ownership",
                "value": ""
            });

            const fraction_json_data = await uploadJSONToIpfs(new_mint_data);
            const fraction_json_url = `https://gateway.pinata.cloud/ipfs/${fraction_json_data.data.IpfsHash}`;

            const mintFNFTResponse = await actions.mintNFT({
                connection,
                wallet: myWallet,
                uri: fraction_json_url,
                maxSupply: max_supply,
              });
    
            console.log("Minted Fractional NFT: ", mintFNFTResponse.mint.toBase58())

            //sleeping for files to be uploaded and generate url
            await timeout(1000);
        }
    }
    
    const master_image = fs.createReadStream('/Users/saminasaeed/Documents/nft_pipeline_refactor/nfts/0.png');
    const master_json = require("./nfts/0.json");
    const dict_data = {"image_path": master_image, "json": master_json}

    const fraction_arr = ["./nfts/frac1.png","./nfts/frac2.png","./nfts/frac3.png","./nfts/frac4.png"];
    
    await createFractionalMint(dict_data, fraction_arr, 4);

})();


