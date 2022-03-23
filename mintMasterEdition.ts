import { NodeWallet, actions, programs } from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { pinFileToIPFS, uploadJSONToIpfs } from "./utils/uploadFileToIpfs";
import { mintNft } from "./utils/mintNft";


const fs = require("fs");
const FormData = require('form-data');

const private_key = Uint8Array.from([154,57,248,111,233,72,89,164,3,116,248,85,231,7,87,116,236,34,210,35,51,33,106,23,24,231,82,92,150,20,169,196,111,11,32,103,64,9,246,104,182,179,35,40,149,115,177,45,28,168,161,88,217,75,116,69,109,149,131,219,112,163,228,95]);
const keypair = Keypair.fromSecretKey(private_key);
const myWallet = new NodeWallet(keypair);

function timeout(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); 
var masterEditionHash=''; 

(async() => {
    //requires
    //masterData["image_path"] = image_path
    //masterData["json"] = json_path
    //fractions_arr = array of paths of fractional images
    async function createMasterMint(master_data: any, max_supply: any){
        var file_url = await pinFileToIPFS(master_data["image_path"]);
        master_data["json"]["image"] = file_url;
        master_data["json"]["properties"]["files"]["uri"] = file_url;
        
        var json_url = await uploadJSONToIpfs(master_data["json"]);
        const master_json_url = `https://gateway.pinata.cloud/ipfs/${json_url.data.IpfsHash}`

        //sleeping for files to be uploaded and generate url
        await timeout(1000);
        const mintNFTResponse = await mintNft(connection,myWallet,master_json_url,max_supply);
        console.log("Minted Master Edition:==> ", mintNFTResponse)
    }
    
    const master_image = fs.createReadStream('/Users/saminasaeed/Documents/nft_pipeline_refactor/newNfts/image.png');
    const master_json = require("./newNfts/0.json");
    const dict_data = {"image_path": master_image, "json": master_json}

    await createMasterMint(dict_data, 0);

})();


