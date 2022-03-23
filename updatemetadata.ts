import { NodeWallet, actions, programs } from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';

const private_key = Uint8Array.from([207, 152, 175, 176, 30, 38, 8, 150, 17, 45, 253, 151, 206, 32, 51, 18, 118, 59, 117, 90, 151, 21, 31, 33, 52, 234, 17, 127, 171, 145, 36, 137, 158, 59, 254, 121, 219, 214, 245, 124, 214, 242, 208, 81, 235, 35, 189, 21, 141, 29, 130, 18, 49, 247, 49, 81, 80, 156, 149, 33, 227, 159, 162, 130]);
let keypair = Keypair.fromSecretKey(private_key);
const myWallet = new NodeWallet(keypair);

const masterEdition_mint = new PublicKey("CbNxtXSWwPXDXLs5n8E8SUf8bgSLreCjE9A2g1Ngbqrr");

const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
  );

const new_uri = "https://raw.githubusercontent.com/HaiderInvo/blockchain_learning/main/newjson.js";
const old_uri = "https://gateway.pinata.cloud/ipfs/QmNweve93mW9LJeQMFWj4iv1GMXLFW23cp6eq8PkUK4Ysc";

(async() => {
    //getting metadata of master mint
    const metadatadatadata = (await programs.metadata.Metadata.load(
        connection,
        await programs.metadata.Metadata.getPDA(masterEdition_mint)
    )).data.data;


    console.log(typeof metadatadatadata["creators"]);
    // metadatadatadata["uri"] = old_uri;

    // // console.log(metadatadatadata);
    // const result = await actions.updateMetadata({connection, wallet: myWallet, editionMint: masterEdition_mint, newMetadataData:metadatadatadata});
    // console.log(result);
    // programs.metadata.UpdateMetadata
})();