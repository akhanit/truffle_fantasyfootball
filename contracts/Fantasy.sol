pragma solidity ^0.4.17;

contract Fantasy {


	mapping (string => address) teams;
	string[] teamNames = new string[](12);
	uint kitty;
	uint players; 
	uint min_cost = 0;

	//Constructor
	function Fantasy() {
		kitty = 0;
		players = 0;
	}

	function SubmitPayment(string teamName) payable {

		uint payment = msg.value; 
		address account = msg.sender;

		//Check if payment is valid 
		if(payment < min_cost) {
			//Send error and return payment
		}
		else {
			teams[teamName] = account; 
			kitty += payment; 
			players++;
			teamNames.push(teamName); 
		}

	}
	
	function PayoutPlayers() {
	
		//Structure should be: Conditons, effects, interaction	

		//TODO	
		//Implement Oracle to get season stats from Yahoo API

		//For now iterate over number of players (currently the only condition)
		//and pay out percentages (effects, uinteractions)
		if(players < 0) { 
			//Throw error
		}
		else {	
			for(uint i = 0; i < teamNames.length; i++) {
				string name = teamNames[i];
				uint amount = kitty/4;

				teams[name].transfer(amount);	
			}
		}

	}

	function setKittyValue() public returns(bool) {

		kitty = kitty + 2;
		return true;
	}

	function getKittyValue() public returns(uint) {
		return kitty;
	}

	function getTeamName(uint pos) public returns(string) {
		return teamNames[pos];
	}

	function getTeamAccount(string teamName) public returns(address) {
		return teams[teamName];
	}

	function getNumberOfTeams() public returns(uint) {
		return players;
	}



	//Pay out to players
	//Ensure season end date is valid
	//Read season stats
	//Create rankings and who earns what based on stats
	//Send ether to correct accounts 

}
