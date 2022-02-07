# xrpl-multisig-wallet-creator

X33 Labs has created an easy test script to generate a multisig wallet on the XRPL with any number of signers

To Run Script:

1. Install Node JS and NPM:

        (https://nodejs.org/en/download/)

2. Open index.js in VS Code or Notepad and change the setting variables at the top of the file:

        var masterMultiSigAccountSecret = "" //secret key for the multisig wallet
        var accountSigners = ["","",""]; //Add new array items if more signers are needed
        var numOfSigners = 3; //number of signers must match what is in the accountSigners array
        var publicServer = "wss://s.altnet.rippletest.net:51233"; //RPC server
        var fee = "10000"; //Fee to pay in Drops

3. Open a command prompt, powershell or terminal window. Navigate to the script folder and issue the npm install command:

        npm install

3. Start the script:

        node index.js
