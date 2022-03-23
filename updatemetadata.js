var parent_json = require('./nfts/0.json');

await updateMetadata(
    new Data({
      ...updatedMetadata,
      symbol: metadata.symbol,
      name: metadata.name,
      uri: metadataUrl, //arweaveLink,
      sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
      creators: metadata.creators,
    }),
    undefined,
    undefined,
    mintKey,
    payerPublicKey,
    updateInstructions,
    metadataAccount,
  );