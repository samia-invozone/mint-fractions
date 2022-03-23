import { actions } from '@metaplex/js';

const mintNft = async (connection:any, myWallet:any, NftMetadataUrl:any, max_supply:any): Promise<string> => {
    const mintNFTResponse = await actions.mintNFT({
      connection,
      wallet: myWallet,
      uri: NftMetadataUrl,
      maxSupply: max_supply,
    });
    return mintNFTResponse.mint.toBase58();
  };
export {mintNft};
