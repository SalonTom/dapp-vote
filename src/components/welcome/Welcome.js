import '../../App.css';
import ContractUtils from '../../utils/contractUtils';
import { MetaMaskConnector } from '../../connector/MetaMaskConnector';

function Welcome() {

    const contractUtils = (new ContractUtils()).instance;

    const handleConnect = async () => {
        try {
            const connection = await MetaMaskConnector();
            if (connection) {
                const { account } = connection;
                localStorage.setItem('isWhiteListed', await contractUtils.methods.isUserWhitelisted(account).call())
                localStorage.setItem("user_address", account.toLocaleLowerCase());
                localStorage.setItem("user_role", await contractUtils.methods.owner().call() == account);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            alert("Error when connecting to metamask...");
        }
    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div className="gradient-container rounded" style={{ textAlign: "center" }}>
                <div style={{ display : "flex", gap : "36px", flexDirection : "column", alignItems : "center" }}>
                    <div style={{ display : "flex", gap : "8px", flexDirection : "column" }}>
                        <div className="title">Welcome to TRUST!ES</div>
                        <div className="body">The voting dApp between friends</div>
                    </div>
                    <div className='button' onClick={handleConnect}>
                        <i className='icon' style={{ mask : "url(./assets/svg/wallet.svg)"}}></i>
                        <div className='body bold'>Connect wallet</div>
                    </div>
                    <div className="body bold">Your opinion matters !</div>
                </div>
            </div>
        </div>
    )
}

export default Welcome;