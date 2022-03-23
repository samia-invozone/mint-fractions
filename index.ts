import {
  uploadFileToIpfs,
  uploadJSONToIpfs,
} from "./utils/uploadFileToIpfs";

import { NodeWallet, actions } from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
const solanaWeb3 = require('@solana/web3.js');

const fs = require("fs");
const FormData = require('form-data');

const private_key = Uint8Array.from([207, 152, 175, 176, 30, 38, 8, 150, 17, 45, 253, 151, 206, 32, 51, 18, 118, 59, 117, 90, 151, 21, 31, 33, 52, 234, 17, 127, 171, 145, 36, 137, 158, 59, 254, 121, 219, 214, 245, 124, 214, 242, 208, 81, 235, 35, 189, 21, 141, 29, 130, 18, 49, 247, 49, 81, 80, 156, 149, 33, 227, 159, 162, 130]);
let keypair = Keypair.fromSecretKey(private_key);
const myWallet = new NodeWallet(keypair);

const image = fs.createReadStream('/Users/mp-haidera-pyse-403/Desktop/nft_pipeline/nfts/0.png');

function timeout(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


(async () => {
  const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
  );

  const pinFileToIPFS = async (file: any): Promise<string> => {
    let data: any = new FormData();
    data.append("file", file);
    const fileData: any = await uploadFileToIpfs(data);
    const fileUrl: string = `https://gateway.pinata.cloud/ipfs/${fileData.data.IpfsHash}`;
    return fileUrl;
  };


  var file_url = await pinFileToIPFS(image);

  const metadataContent = {
    collection: {
      name: "newcollection",
      description: "hello description",
      id: "123",
    },
    name: "mynft",
    symbol: "cyu",
    description: "nothing here",
    seller_fee_basis_points: 1000,
    image: file_url,
    animation_url: undefined,
    attributes: undefined,
    artistName: "nobody",
    properties: {
      hello_world: {"i am nobody": "yes you are right"},
      files: {
        "uri": file_url,
        "type": "image/png"
      },
      creators: [{ "address": "BegUZruVk9j3bQ3fU29uzLsNeqkpEdqsz2AXbrLcweem", "share": 100 }],
    },
  };

  const uploadingJson = await uploadJSONToIpfs(metadataContent);

  console.log("taking a small nap");
  await timeout(2000);
  console.log("waking up! lets go");

  const mintNFTResponse = await actions.mintNFT({
    connection,
    wallet: new NodeWallet(keypair),
    uri: `https://gateway.pinata.cloud/ipfs/${uploadingJson.data.IpfsHash}`,
    maxSupply: 10,
  });

  console.log("============ wallet nft public keys, acc");
  console.log(mintNFTResponse);
  console.log(mintNFTResponse.mint.toBase58());
  console.log(mintNFTResponse.edition.toBase58());

  console.log(myWallet.publicKey);


  console.log("taking a small nap");
  await timeout(5000);
  console.log("waking up! lets go");

  const mintResponse = await actions.mintEditionFromMaster({
    connection: connection,
    wallet: new NodeWallet(keypair),
    masterEditionMint: new solanaWeb3.PublicKey(mintNFTResponse.mint),
    updateAuthority: myWallet.publicKey
  })

  console.log("============ edition");
  console.log(mintResponse.mint.toBase58());
  console.log(mintResponse.edition.toBase58());
})();
