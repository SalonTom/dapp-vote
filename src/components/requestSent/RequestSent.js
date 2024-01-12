function RequestSent() {
    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div className='gradient-container rounded'>
                <div className='title'>
                    Your request has been taken into consideration!
                </div>
                <div>
                    The admin of the session should authorize your participation any time now!
                </div>
            </div>
        </div>
    )
}

export default RequestSent;