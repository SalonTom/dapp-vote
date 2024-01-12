import '../../App.css';

import ContractUtils from '../../utils/contractUtils';
import UserUtils from '../../utils/userUtils';

function AskAccess({ connectedAddress }) {
    const contractUtils = (new ContractUtils()).instance;

    const askAccessAsync = async () => {
        try {
            UserUtils.checkUserConnected();
            await contractUtils.methods.askAccess().send({ from: connectedAddress });
            localStorage.setItem("userIsRequester", true);
            window.location.reload();
        } catch (error) {
            console.error("Error asking for access:", error);
        }
    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div className='gradient-container rounded'>
                <div className='title'>
                    Wait a minute...
                </div>
                <div>
                    You haven't been whitelisted by the admin yet.
                    <br />
                    <br />
                    Hit the “Ask access to the voting session” to notify the admin.
                </div>
                <div>
                    <div className='button' onClick={askAccessAsync}>
                        <div className='body bold'>Ask access to the voting session</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AskAccess;