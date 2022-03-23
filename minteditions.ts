import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { NodeWallet, actions } from '@metaplex/js';

const masterEdition_mint = new PublicKey("9xpXp5xKFzrqmPVteCvJnzM6LjgCXMXWjxyu823TcfB6");
const private_key = Uint8Array.from([154,57,248,111,233,72,89,164,3,116,248,85,231,7,87,116,236,34,210,35,51,33,106,23,24,231,82,92,150,20,169,196,111,11,32,103,64,9,246,104,182,179,35,40,149,115,177,45,28,168,161,88,217,75,116,69,109,149,131,219,112,163,228,95]);

let keypair = Keypair.fromSecretKey(private_key);
const myWallet = new NodeWallet(keypair);

const solanaWeb3 = require('@solana/web3.js');


(async() => {
    const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed',
      );
      console.log(myWallet);
      console.log(masterEdition_mint);
      console.log(masterEdition_mint.toBase58());

      const mintResponse = await actions.mintEditionFromMaster({
        connection: connection,
        wallet: myWallet,
        masterEditionMint: masterEdition_mint,
        updateAuthority: myWallet.publicKey
      })
    
      console.log("============ edition");
      console.log(mintResponse.mint.toBase58());
      console.log(mintResponse.edition.toBase58());

})();