import React, { Component } from 'react'
import FantasyContract from '../build/contracts/Fantasy.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

var fantasyInstance, teamsList;

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      kittVal: 0,
      storageValue: 0,
      web3: null,
      account: null,
      teams: [],
      teamName: ""
    }

    this.instantiateContract = this.instantiateContract.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      console.log(this.state.web3)
      var web3 = this.state.web3

      web3.eth.getAccounts((err, res) => {
        this.setState({account: res[0]}); 
      })

      //Sadly, this is the only way I can ensure the account variable detects a metamask account change, but this doesn't seem efficient
      setInterval(() => {
        web3.eth.getAccounts((err, res) => {
          if(res[0] !== this.state.account)
            this.setState({account: res[0]}); 
        })
      }, 100)

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })  
    .catch((err) => {
      console.log('Error finding web3.')
      console.log(err);
    })
  }


  async instantiateContract() {

    const contract = require('truffle-contract');
    const fantasy = contract(FantasyContract);
    fantasy.setProvider(this.state.web3.currentProvider)

    try {
      fantasyInstance = await fantasy.deployed();
    } catch(err) {
      console.log("error deploying contract");
      console.log(err);
    }
    console.log(fantasyInstance);

   this.getVars()

  }

  async getVars() {

    console.log("in get Vars");

    var val = await fantasyInstance.getKittyValue.call();
    this.setState({kittVal: val.c[0]})
    console.log(this.state.kittVal);

    var teams = this.state.teams
    teamsList = teams.map((teams) => <li>{teams}</li>)

  }

  handleChange(event) {
    console.log("In handle change")
    this.setState({teamName: event.target.value})
  }

  async handlePayment(event) {
    console.log("Button clicked");
    event.preventDefault()
    
    console.log(this.state.teamName); 
    var name = this.state.teamName;

    try { 
      await fantasyInstance.SubmitPayment(name, {from: this.state.accounts[0], value: 500}) 
    } catch(err) {
      console.log("There has been an error submitting your payment");
      console.log(err);
    }

    var val = await fantasyInstance.getKittyValue.call(this.state.accounts[0]);
    this.setState({kittVal: val.c[0]})

    this.updateTeams()

  }

  async updateTeams() {
    console.log("in Update Teams")
    try { 
      var call_data = await fantasyInstance.getTeamName(10, {from: this.state.accounts[0], value: 500});
    } catch(err) {
      console.log("Error");
      console.log(err);
    }
    console.log(call_data);

  }


  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Fantasy Football</h1>
              <p>Welcome to the Fantasy Football pilot smart contract.</p>
              <br/>
              <br/>
              <form onSubmit={this.handlePayment}>
                <p>Team name</p><input type="text" value={this.state.teamName} onChange={this.handleChange} />
                <button>Buy in!</button>
              </form>
              <h2>Example</h2>
              <p>The value of the kitty is: {this.state.kittVal}</p>
              <p>Teams</p>
              <ul>{teamsList}</ul>

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
