import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { NodeWallet, actions } from '@metaplex/js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

(async () => {
  const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
  );
  let token='';
  const private_key = Uint8Array.from([154,57,248,111,233,72,89,164,3,116,248,85,231,7,87,116,236,34,210,35,51,33,106,23,24,231,82,92,150,20,169,196,111,11,32,103,64,9,246,104,182,179,35,40,149,115,177,45,28,168,161,88,217,75,116,69,109,149,131,219,112,163,228,95]);
  let keypair = Keypair.fromSecretKey(private_key);
  const myWallet = new NodeWallet(keypair);

console.log("Start burning!!!!!!!");
const mintAccount = new PublicKey('2H1wDrMYPzrY3rKDGsLse2FMgEwBGr6m6CNcQE1KEdkw');
const getTokenAccountDetails = await connection.getParsedTokenAccountsByOwner(myWallet.publicKey, { mint: mintAccount });
getTokenAccountDetails.value.forEach((accountInfo) => {
  token = accountInfo.pubkey.toBase58();
  console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
  console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
  console.log(`owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`);
  console.log(`decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`);
  console.log(`amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`);
  console.log("====================");
});

const burnNFT = await actions.burnToken({
  connection,
  wallet:myWallet,
  token:new PublicKey(token),
  mint:mintAccount,
  amount:1,
  owner:myWallet.publicKey,
  close :false,
});
console.log("Result.....", burnNFT);

})();

