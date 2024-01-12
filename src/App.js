import './App.css';
import ContractUtils from './utils/contractUtils';
import UserUtils from './utils/userUtils';
import { useEffect } from 'react';

import Welcome from './components/welcome/Welcome';
import Navbar from './components/navbar/Navbar';
import RegisterProcess from './components/registerProcess/RegisterProcess';
import Stepper from './components/stepper/Stepper';

function App() {

  const connectedAddress = localStorage.getItem("user_address");
  const contractUtils = (new ContractUtils()).instance;

  useEffect(() => {
    const logCurrentStepAsync = async () => {
      localStorage.setItem('currentStep',Number(await contractUtils.methods.getCurrentStep().call()));
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
