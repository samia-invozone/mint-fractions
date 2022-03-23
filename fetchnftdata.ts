import { PublicKey, clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { programs } from "@metaplex/js";
import { metadata } from "@metaplex/js/lib/utils";

const Metaplex = require("@metaplex/js");

const masterEdition_mint = new PublicKey("4ojQPGr2kgKviBgw2JPArFV8Y7jvs7BJrhncJmPzQDxX");
// const edition_mint = new PublicKey("3Ew5uZPsZ7XZ3NsXhbeeSo1oSzN26GTgQwtBDH1PSnFQ");

type EditionData = programs.metadata.EditionData;

(async() => {

    const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed',
      );

    // //getting metadata of master mint
    // const metadata = await Metaplex.programs.metadata.Metadata.load(
    //     connection,
    //     await Metaplex.programs.metadata.Metadata.getPDA(edition_mint)
    // );

    // console.log(metadata);

    // //number of editions
    // if (metadata) {
    //     // We have a valid Metadata account. Try and pull edition data.
    //     const editionInfo = (await Metaplex.programs.metadata.Metadata.getEdition(
    //         connection,
    //         edition_mint
    //     )).data;
    //     console.log(editionInfo as EditionData);
    // }

    //getting editions from master edition
    const masterPDA = await programs.metadata.MasterEdition.getPDA(masterEdition_mint);
    const masterInfo = await programs.core.Account.getInfo(connection, masterPDA);
    // console.log(masterInfo);

    const me = new programs.metadata.MasterEdition(masterPDA, masterInfo);
    console.log(me)
    // const foundEditions = await me.getEditions(connection);
    // console.log(foundEditions);
})();