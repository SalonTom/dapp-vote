import '../../App.css';
import UserUtils from '../../utils/userUtils';

function Navbar({ connectedAddress }) {

    const logOutAsync = async () => {
        UserUtils.logout();
    };

    return (
        <div className="navbar gradient-container">
            <div className='title'>TRUST!ES</div>
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