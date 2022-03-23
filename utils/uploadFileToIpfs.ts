import axios from "axios";
import { NodeWallet, actions, programs } from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
const FormData = require('form-data');

const uploadFileToIpfs = async (formData: any) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //we gather a local file from the API for this example, but you can gather the file from anywhere

  const response = await axios.post(url, formData, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: `8af1d1411a935b0672e1`,
      pinata_secret_api_key: `84916ac417630f9b19d25ab9d62a918e3640ff391a7323d13bdf91b2846c7725`,
    },
  });

  return response;
};

const uploadJSONToIpfs = async (data: any) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //we gather a local file from the API for this example, but you can gather the file from anywhere

  const response = await axios.post(url, data, {
    headers: {
      pinata_api_key: `8af1d1411a935b0672e1`,
      pinata_secret_api_key: `84916ac417630f9b19d25ab9d62a918e3640ff391a7323d13bdf91b2846c7725`,
    },
  });

  return response;
};

const pinFileToIPFS = async (file: any): Promise<string> => {
  let data: any = new FormData();
  data.append("file", file);
  const fileData: any = await uploadFileToIpfs(data);
  const fileUrl: string = `https://gateway.pinata.cloud/ipfs/${fileData.data.IpfsHash}`;
  return fileUrl;
};

export { uploadFileToIpfs, uploadJSONToIpfs , pinFileToIPFS};