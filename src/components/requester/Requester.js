import ContractUtils from '../../utils/contractUtils';

function Requester({ owner, whitelisted }) {

    const contractUtils = (new ContractUtils()).instance;
    const connecteddAddress = localStorage.getItem("user_address");

    const whitelistAsync = async () => {
      await contractUtils.methods
        .registerVoter(owner)
        .send({ from: connecteddAddress });
      window.location.reload();
    };
  
    return (
      <div
        className="rounded"
        style={{
          border: "1px white solid",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>{owner}</div>
        {whitelisted == true ? (
          <div>
            <i
              className="icon"
              style={{ mask: "url(./assets/svg/selected.svg)" }}
            ></i>
          </div>
        ) : (
          <div className="button" onClick={whitelistAsync}>
            <i
              className="icon"
              style={{ mask: "url(./assets/svg/vote.svg)" }}
            ></i>
          </div>
        )}
      </div>
    );
  }
  
  export default Requester;