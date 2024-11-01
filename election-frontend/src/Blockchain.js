import { ethers } from "ethers";
import Election from "./artifacts/contracts/Election.sol/Election.json";

const connectToBlockchain = async () => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(0x512eAa98d0C438bbD6fa9288f7F8C95DBf55124D, Election.abi, signer);
        return { contract };
    } else {
        console.log("Please install MetaMask");
        return null;
    }
};

export default connectToBlockchain;
