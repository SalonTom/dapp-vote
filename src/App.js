import './App.css';
import Welcome from './welcome/Welcome';
import ContractUtils from './utils/contractUtils';

function App() {

  const connectedAddress = localStorage.getItem("user_address");
  const contractUtils = (new ContractUtils()).instance;

  const logCurrentStepAsync = async () => {
    console.log(await contractUtils.methods.getCurrentStep().call());
  }

  const nextStepAsync = async () => {
    await contractUtils.methods.nextStep().send({ from: connectedAddress });
  }

  return (
    <div className="App">
      {
        connectedAddress != null ?
        <>
          <h2>Connected as { connectedAddress }</h2>

          <button onClick={logCurrentStepAsync}>get current step</button>
          <button onClick={nextStepAsync}>Test next step</button>
        </>
        :
        <Welcome></Welcome>
      }
    </div>
  );
}

export default App;
