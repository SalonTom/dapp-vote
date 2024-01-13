import './App.css';
import ContractUtils from './utils/contractUtils';
import { useEffect } from 'react';

import Navbar from './components/navbar/Navbar';
import Stepper from './components/stepper/Stepper';

function App() {

  const connectedAddress = localStorage.getItem("user_address");
  const contractUtils = (new ContractUtils()).instance;

  useEffect(() => {
    const logCurrentStepAsync = async () => {
      localStorage.setItem('currentStep',Number(await contractUtils.methods.getCurrentStep().call()));
      localStorage.setItem('isWhiteListed', await contractUtils.methods.isUserWhitelisted(account).call());
    };

    logCurrentStepAsync();
  }, []);

  return (
    <div className="App">
      {
        connectedAddress != null ?
        <div style={{ width : "100%" }}>
          <Navbar connectedAddress={connectedAddress}></Navbar>
        </div>
        :
        <></>
      }

      <div style={{ flex : 1, width: "100%", overflowY : "auto"}}>
        <Stepper connectedAddress={connectedAddress}></Stepper>
      </div>
    </div>
  );
}

export default App;
