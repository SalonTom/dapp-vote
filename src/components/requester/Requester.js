function Requester({ requesterId, owner, whitelisted, whitelistAsync }) {

  const currentStep = parseInt(localStorage.getItem("currentStep"), 10);

  const handleOnClick = () => {
    whitelistAsync(requesterId, owner);
  }
  
  return (
    <div className="rounded list-entry" style={ whitelisted ? { backgroundColor : "rgba(255,255,255,0.3)", cursor: "default" } : {} }>
      <div>{owner}</div>
      {whitelisted == true ? (
        <div style={{ margin: "4px 16px" }}>
          <i
            className="icon"
            style={{ mask: "url(./assets/svg/selected.svg)" }}
          ></i>
        </div>
      ) : (
        <>
          {
            currentStep == 0 ? (
              <div className="button" onClick={handleOnClick}>
                <i
                  className="icon"
                  style={{ mask: "url(./assets/svg/assignment_turned.svg)" }}
                ></i>
              </div>
            )
            :
            (
              <div style={{ margin: "4px 16px" }}>
                <i
                  className="icon"
                  style={{ mask: "url(./assets/svg/event_busy.svg)"}}
                ></i>
              </div>
            )
          }
        </>
      )}
    </div>
  );
}
  
  export default Requester;