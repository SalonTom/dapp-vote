import ContractUtils from '../../utils/contractUtils';
import UserUtils from '../../utils/userUtils';

import Welcome from '../../components/welcome/Welcome';
import AdminDashboard from '../../components/adminDashboard/AdminDashboard';
import NextForNextSession from '../../components/nextForNextSession/NextForNextSession';
import RequestSent from '../../components/requestSent/RequestSent';
import AskAccess from '../../components/askAccess/AskAccess';
import WaitForSessionToStart from '../../components/waitForSessionToStart/WaitForSessionToStart';
import ProposalList from '../../components/proposalList/ProposalList';
import { useState } from 'react';

function Stepper({ connectedAddress }) {

    const userIsAdmin = localStorage.getItem("user_role");
    const currentStep = localStorage.getItem("currentStep");
    const isWhiteListed = localStorage.getItem("isWhiteListed");
    const [userIsRequester, setUserIsRequester] = useState(localStorage.getItem("userIsRequester"));

    const contractUtils = (new ContractUtils()).instance;

    const askAccessAsync = async () => {
        try {
            UserUtils.checkUserConnected();
            await contractUtils.methods.askAccess().send({ from: connectedAddress });
            localStorage.setItem("userIsRequester", true);
            setUserIsRequester("true");
        } catch (error) {
            console.error("Error asking for access:", error);
        }
    };

    if (connectedAddress == null) {
        return <Welcome></Welcome>
    }

    if (userIsAdmin == "true") {
        return <AdminDashboard connectedAddress={connectedAddress}></AdminDashboard>
    }

    if (currentStep != 0 && isWhiteListed == "false") {
        return <NextForNextSession></NextForNextSession>
    }

    if (currentStep == 0) {

        if (userIsRequester == "true" && isWhiteListed == "false") {
            return <RequestSent></RequestSent>
        }

        if (isWhiteListed == "false") {
            return <AskAccess askAccessAsync={askAccessAsync}></AskAccess>
        } else {
            return <WaitForSessionToStart></WaitForSessionToStart>
        }

    } else {
        return <ProposalList connecteddAddress={connectedAddress} currentStep={currentStep}></ProposalList>
    }
}

// Si pas connecter, render page login
// Sinon
// Si admin, render admin dashboard
// Sinon

// Si status != 0 && user pas whitelisted, render wait for next session

// Si status == 0 && user pas whitelisted, render ask access
// Si status == 0 && user dans requesters, render request consideration
// Si status == 0 && user whitelisted, render wait for session to start

// Si status == 1, render register proposition
// Si status == 2, render list sans ajout new prop && sans bouton vote
// Si status == 3, render list avec possibilité de vote
// Si status == 4, render list sans possibilité de vote et avec vote si user a voté

// Si status == 5, render list des proposals gagnantes

export default Stepper;