import React, { useEffect, useState } from 'react';
import '../../App.css';
import UserUtils from '../../utils/userUtils';
import ContractUtils from '../../utils/contractUtils';

function RegisterProcess({ connectedAddress }) {

    const contractUtils = (new ContractUtils()).instance;
    const [content, setContent] = useState(null);

    const askAccessAsync = async () => {
        try {
            await UserUtils.checkUserConnected();
            await contractUtils.methods.askAccess().send({ from: connectedAddress });
            window.location.reload();
        } catch (error) {
            console.error("Error asking for access:", error);
            // Handle errors appropriately
        }
    };

    useEffect(() => {
        const getContent = async () => {
            try {
                let newContent;
                const currentStep = localStorage.getItem("currentStep");

                switch (parseInt(currentStep, 10)) {
                    case 0:
                        const isRequester = (await contractUtils.methods.getRequesters().call()).map(address => address.toLocaleLowerCase()).includes(connectedAddress);

                        newContent = !isRequester ? (
                            <>
                                <div className='title'>
                                    Wait a minute...
                                </div>
                                <div>
                                    You haven't been whitelisted by the admin yet.
                                    <br />
                                    <br />
                                    Hit the “Ask access to the voting session” to notify the admin.
                                </div>
                                <div>
                                    <div className='button' onClick={askAccessAsync}>
                                        <div className='body bold'>Ask access to the voting session</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='title'>
                                    Your request has been taken into consideration!
                                </div>
                                <div>
                                    The admin of the session should authorize your participation any time now!
                                </div>
                            </>
                        );
                        break;
                    case 1:
                        // Add content for currentState 1
                        break;
                    case 2:
                        // Add content for currentState 2
                        break;
                    default:
                        // Add default content
                        break;
                }

                setContent((prevContent) => {
                    // Only update the content if it's different from the previous content
                    return prevContent !== newContent ? newContent : prevContent;
                });
            } catch (error) {
                console.error("Error getting content:", error);
                // Handle errors appropriately
            }
        };

        getContent();
    }, []);

    return (
        <div className="gradient-container">
            {content}
        </div>
    );
}

export default RegisterProcess;
