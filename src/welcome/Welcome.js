import '../App.css'

function Welcome() {
    return (
        <div className="gradient-container rounded" style={{ textAlign: "center" }}>
            <div style={{ display : "flex", gap : "36px", flexDirection : "column", alignItems : "center" }}>
                <div style={{ display : "flex", gap : "8px", flexDirection : "column" }}>
                    <div className="title">Welcome to TRUST!ES</div>
                    <div className="body">The voting dApp between friends</div>
                </div>
                <div className='button'>
                    <i className='icon' style={{ mask : "url(./assets/svg/wallet.svg)"}}></i>
                    <div className='body bold'>Connect wallet</div>
                </div>
                <div className="body bold">The voting dApp between friends</div>
            </div>
        </div>
    )
}

export default Welcome;