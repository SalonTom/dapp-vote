function RequestSent() {
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div className='gradient-container rounded'>
                <span className='title'>
                    Your request has been taken into consideration!
                </span>
                <br/>
                <br/>
                The admin of the session should authorize your participation any time now!
            </div>
        </div>
    )
}

export default RequestSent;