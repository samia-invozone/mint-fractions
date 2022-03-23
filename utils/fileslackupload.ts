import * as filestack from 'filestack-js';
const client = filestack.init('AJxBLaIxOSomyX1JeosTTz');
import axios from "axios";

const token = {}
const fs = require("fs");


const uploadimagefs = async (path: any) => {
    const master_image = fs.readFileSync(path);
    var abc = await client.upload(master_image);
    return abc.url;
}

const uploadjsonfs = async (json: any) => {
    const url = "https://www.filestackapi.com/api/store/S3?key=AJxBLaIxOSomyX1JeosTTz";
    const response = await axios.post(url, json, {
        headers: {
        "Content-Type": 'application/json',
        },
      });
    
      return response.data.url;
}



// (async () => {
//     // const path = '/Users/mp-haidera-pyse-403/Desktop/nft_pipeline/nfts/0.png';
//     // const file_url = await uploadimagefs(path);
//     // console.log(file_url);

//     // var customjson = {"abc": "defg"};
//     // const json_path = await uploadjsonfs(customjson);
//     // console.log(json_path);
// })();

export {uploadimagefs, uploadjsonfs}

