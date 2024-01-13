import '../../App.css';

function AskAccess({ askAccessAsync }) {

    const handleOnClick = () => {
        askAccessAsync();
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div className='gradient-container rounded'>
                <div className='title'>
                    Wait a minute...
                </div>
                <div style={{ marginTop: "12px" }}>
                    You haven't been whitelisted by the admin yet.
                    <br />
                    <br />
                    Hit the “Ask access to the voting session” to notify the admin.
                </div>
                <div className='button' onClick={handleOnClick} style={{ marginTop: "36px", marginLeft : "auto", marginRight : "auto"}}>
                    <div className='body bold'>Ask access to the voting session</div>
                </div>
            </div>
        </div>
    )
}

export default AskAccess;