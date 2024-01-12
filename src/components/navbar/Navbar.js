import '../../App.css';
import UserUtils from '../../utils/userUtils';
import ContractUtils from '../../utils/contractUtils';

function Navbar({ connectedAddress }) {

    const contractUtils = (new ContractUtils()).instance;

    const nextStepAsync = async () => {
        UserUtils.checkUserConnected();
        await contractUtils.methods.nextStep().send({ from: connectedAddress });
        window.location.reload();
      }

    const logOutAsync = async () => {
        UserUtils.logout();
    };

    return (
        <div className="navbar gradient-container">
            <div className='title'>TRUST!ES</div>
            <div className='button' onClick={nextStepAsync}>
                NEXT STEP
            </div>
            <div className='navbar-info'>
                <div style={{ display : "flex", alignItems : "center", gap: "4px" }}>
                    <div className='body bold'>Logged in as :</div> 
                    <div>{ connectedAddress }</div>
                </div>
                <div className='logout-button-link' onClick={logOutAsync}>
                    <i className='icon' style={{ mask : "url(./assets/svg/logout.svg)"}}></i>
                    <div>Log out</div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;