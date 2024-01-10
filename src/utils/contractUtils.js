import Web3 from 'web3';
import Voting from "../contracts/Voting.json";
import Address from "../contracts/Address.json";

export default class ContractUtils {

    constructor() {

        const _web3 = new Web3(window.ethereum);
    
        this.instance = new _web3.eth.Contract(
            Voting.abi,
            Address.Voting
        );
    }
}