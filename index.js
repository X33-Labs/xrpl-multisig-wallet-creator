const xrpl = require('xrpl');

var masterMultiSigAccountSecret = "" //secret key for the multisig wallet
var accountSigners = ["","",""]; //Add new array items if more signers are needed
var numOfSigners = 3; //number of signers must match what is in the accountSigners array
var publicServer = "wss://s.altnet.rippletest.net:51233"; //RPC server
var fee = "10000"; //Fee to pay in Drops

const signerEntry = {
    "SignerEntry": {
        "Account": "",
        "SignerWeight": 1
    }
}

const signerset = {
    "Flags": 0,
    "TransactionType": "SignerListSet",
    "Account": "",
    "Fee": fee,
    "SignerQuorum": numOfSigners,
    "SignerEntries": [
    ]
}

const disable_masterKey = {
    "TransactionType": "AccountSet",
    "Account": "",
    "SetFlag": 4
  }

async function main()
{
    try{
        const client = new xrpl.Client(publicServer);  
        await client.connect();
        console.log("connected");
        const masterWallet = xrpl.Wallet.fromSeed(masterMultiSigAccountSecret);
        console.log("wallet connected: " + masterWallet.address);
        console.log("creating payload...");
        let signerPayload = signerset;
        signerPayload.Account = masterWallet.address;
        for(let i=0;i<accountSigners.length;i++)
        {
            let signerEntryPayload = signerEntry;
            signerEntryPayload.SignerEntry.Account = accountSigners[i];
            signerPayload.SignerEntries.push(JSON.parse(JSON.stringify(signerEntryPayload)));
        }
        const cst_prepared = await client.autofill(signerPayload);
        const cst_signed = await masterWallet.sign(cst_prepared);

        console.log("creating multisig wallet with " + numOfSigners + " signers...");
        const ts_result = await client.submitAndWait(cst_signed.tx_blob);
        if(ts_result.result.meta.TransactionResult == "tesSUCCESS")
        {
            console.log("Multisig wallet creation successful!");
        } else {
            console.log("Error in multisig wallet creation");
        }

        console.log("disabling masterkey");
        let disableMasterKeyPayload = disable_masterKey;
        disableMasterKeyPayload.Account = masterWallet.address;
        const cst_prepared_disableMasterKey = await client.autofill(disableMasterKeyPayload);
        const cst_signed_disableMasterKey = await masterWallet.sign(cst_prepared_disableMasterKey);
        const ts_result_disableMasterKey = await client.submitAndWait(cst_signed_disableMasterKey.tx_blob);
        if(ts_result_disableMasterKey.result.meta.TransactionResult == "tesSUCCESS")
        {
            console.log("Disabling masterKey successful!");
        } else {
            console.log("Error in disabling masterkey");
        }
        await client.disconnect();
    } catch(error)
    {
       console.log("Error: " + error);
    }
}

main()