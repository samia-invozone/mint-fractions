import { NodeWallet, actions, programs } from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { pinFileToIPFS, uploadJSONToIpfs } from "./utils/uploadFileToIpfs";
import { uploadimagefs, uploadjsonfs } from "./utils/fileslackupload";

const fs = require("fs");
const FormData = require('form-data');

const private_key = Uint8Array.from([207, 152, 175, 176, 30, 38, 8, 150, 17, 45, 253, 151, 206, 32, 51, 18, 118, 59, 117, 90, 151, 21, 31, 33, 52, 234, 17, 127, 171, 145, 36, 137, 158, 59, 254, 121, 219, 214, 245, 124, 214, 242, 208, 81, 235, 35, 189, 21, 141, 29, 130, 18, 49, 247, 49, 81, 80, 156, 149, 33, 227, 159, 162, 130]);
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

        console.log("minted master edition: ", mintNFTResponse.mint.toBase58())

          //waiting to mint and update on solana server so we can mint edition on it
          await timeout(3000);

        const mastermetadatadata = (await programs.metadata.Metadata.load(
            connection,
            await programs.metadata.Metadata.getPDA(mintNFTResponse.mint)
        )).data.data;

        for (let idx = 0; idx < fractions_arr.length; idx++){

            const frac_image = fs.createReadStream(fractions_arr[idx]);
            const frac_img_url = await pinFileToIPFS(frac_image);

            const new_mint_data = JSON.parse(JSON.stringify(master_data["json"]));
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

            mastermetadatadata["uri"] = fraction_json_url;

            const result = await actions.updateMetadata({
                connection,
                wallet: myWallet, 
                editionMint: new PublicKey(mintNFTResponse.mint.toBase58()), 
                newMetadataData: mastermetadatadata
            });

            //sleeping for files to be uploaded and generate url
            await timeout(1000);

            const mintResponse = await actions.mintEditionFromMaster({
                connection: connection,
                wallet: myWallet,
                masterEditionMint: new PublicKey(mintNFTResponse.mint),
                updateAuthority: myWallet.publicKey
            });

            console.log("minted child edition: ", mintResponse.mint.toBase58())
        }

        mastermetadatadata["uri"] = master_json_url

        const result = await actions.updateMetadata({
            connection,
            wallet: myWallet, 
            editionMint: new PublicKey(mintNFTResponse.mint.toBase58()), 
            newMetadataData: mastermetadatadata
        });
        console.log("reverted master edition, everything done");
    }
    
    const master_image = fs.createReadStream('/Users/mp-haidera-pyse-403/Desktop/nft_pipeline/nfts/0.png');
    const master_json = require("./nfts/0.json");
    const dict_data = {"image_path": master_image, "json": master_json}

    const fraction_arr = ["./nfts/frac1.png","./nfts/frac2.png","./nfts/frac3.png","./nfts/frac4.png","./nfts/frac5.png","./nfts/frac6.png"];
    await createFractionalMint(dict_data, fraction_arr, 6);

})();


