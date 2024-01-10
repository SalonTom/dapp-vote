import Web3 from 'web3';

let web3;
let account;

export const MetaMaskConnector = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();
      account = accounts[0];

      window.ethereum.on('accountsChanged', (newAccounts) => {
        account = newAccounts[0];
      });

      return { web3, account };
    } else {
      console.error('MetaMask not detected. Please install MetaMask.');
      return null;
    }
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    return null;
  }
};
