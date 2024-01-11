import './App.css';
import ContractUtils from './utils/contractUtils';
import UserUtils from './utils/userUtils';

import Welcome from './components/welcome/Welcome';
import Navbar from './components/navbar/Navbar';
import RegisterProcess from './components/registerProcess/RegisterProcess';

function App() {

  const connectedAddress = localStorage.getItem("user_address");
  const contractUtils = (new ContractUtils()).instance;

  const logCurrentStepAsync = async () => {
    localStorage.setItem('currentStep',Number(await contractUtils.methods.getCurrentStep().call()));
  }

  const nextStepAsync = async () => {
    UserUtils.checkUserConnected();
    await contractUtils.methods.nextStep().send({ from: connectedAddress });
  }
  logCurrentStepAsync();
  return (
    <div className="App">
      {
        connectedAddress != null ?
        <>
          <Navbar connectedAddress={connectedAddress}></Navbar>
          <RegisterProcess connectedAddress={connectedAddress}></RegisterProcess>
        </>
        :
        <Welcome></Welcome>
      }
    </div>
  );
}

export default App;
