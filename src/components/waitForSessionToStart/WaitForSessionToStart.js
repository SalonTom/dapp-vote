function WaitForSessionToStart() {
    return <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <div className='gradient-container rounded'>
            <div className='title'>
                The session hasn't started yet :/
            </div>
            <br/>
            <div>
                The admin is still letting new voters to the session.
            </div>
        </div>
    </div>
}

export default WaitForSessionToStart;