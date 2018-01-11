Fantasy.deployed().then (
function(instance) {
return instance.SubmitPayment ("cams_shoes", { from:web3.eth.accounts[0], value:10})})