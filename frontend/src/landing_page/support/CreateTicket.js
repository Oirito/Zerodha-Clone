import React from "react";

function CreateTicket() {
  const linkStyle = {
    textDecoration: "none",
    lineHeight: "2.5",
    color: "#387ED1",
  };

  return (
    <div className="container">
      <div className="row p-5 mb-5 border-top">
        <h1>To create a ticket, select a relevant topic</h1>
      </div>

      {/* ROW 1 */}
      <div className="row">
        <div className="col-4 p-5">
          <h4>
            <i className="fa fa-plus-circle"></i> Account Opening
          </h4>
          <br />
          <a href="" style={linkStyle}>
            Offline Account Opening
          </a>
          <br />
          <a href="" style={linkStyle}>
            Company, Partnership and HUF Account
          </a>
          <br />
          <a href="" style={linkStyle}>
            Online Account Opening
          </a>
          <br />
          <a href="" style={linkStyle}>
            Opening
          </a>
          <br />
          <a href="" style={linkStyle}>
            Charges at Zerodha
          </a>
          <br />
          <a href="" style={linkStyle}>
            Zerodha IDFC FIRST Bank 3-in-1 Account
          </a>
          <br />
          <a href="" style={linkStyle}>
            Getting Started
          </a>
        </div>

        <div className="col-4 p-5">
          <h4>
            <i className="fa fa-user"></i> Your Zerodha Account
          </h4>
          <br />
          <a href="" style={linkStyle}>
            Login credentials
          </a>
          <br />
          <a href="" style={linkStyle}>
            Account Modification and Segment Addition
          </a>
          <br />
          <a href="" style={linkStyle}>
            DP ID and bank details
          </a>
          <br />
          <a href="" style={linkStyle}>
            Your Profile
          </a>
          <br />
          <a href="" style={linkStyle}>
            Transfer and conversion of shares
          </a>
        </div>

        <div className="col-4 p-5">
          <h4>
            <i className="fa fa-bar-chart"></i> Your Zerodha Account
          </h4>
          <br />
          <a href="" style={linkStyle}>
            Margin/leverage, Product and Order types
          </a>
          <br />
          <a href="" style={linkStyle}>
            Kite Web and Mobile
          </a>
          <br />
          <a href="" style={linkStyle}>
            Trading FAQs
          </a>
          <br />
          <a href="" style={linkStyle}>
            Corporate Actions
          </a>
          <br />
          <a href="" style={linkStyle}>
            Sentinel
          </a>
          <br />
          <a href="" style={linkStyle}>
            Kite API
          </a>
          <br />
          <a href="" style={linkStyle}>
            Pi and other platforms
          </a>
          <br />
          <a href="" style={linkStyle}>
            GTT
          </a>
          <br />
          <a href="" style={linkStyle}>
            Stockreports+
          </a>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="row">
        <div className="col-4 p-5">
          <h4>
            <i className="fa fa-credit-card"></i> Funds
          </h4>
          <br />
          <a href="" style={linkStyle}>
            Adding Funds
          </a>
          <br />
          <a href="" style={linkStyle}>
            Fund Withdrawal
          </a>
          <br />
          <a href="" style={linkStyle}>
            eMandates
          </a>
          <br />
          <a href="" style={linkStyle}>
            Adding Bank Accounts
          </a>
        </div>

        <div className="col-4 p-5">
          <h4>
            <i className="fa fa-circle-o-notch"></i> Console
          </h4>
          <br />
          <a href="" style={linkStyle}>
            Reports
          </a>
          <br />
          <a href="" style={linkStyle}>
            Ledger
          </a>
          <br />
          <a href="" style={linkStyle}>
            Portfolio
          </a>
          <br />
          <a href="" style={linkStyle}>
            60 Day Challenge
          </a>
          <br />
          <a href="" style={linkStyle}>
            IPO
          </a>
          <br />
          <a href="" style={linkStyle}>
            Referral Program
          </a>
        </div>

        <div className="col-4 p-5">
          <h4>
            <i className="fa fa-circle-thin"></i> Coin
          </h4>
          <br />
          <a href="" style={linkStyle}>
            Understanding Mutual Funds
          </a>
          <br />
          <a href="" style={linkStyle}>
            About Coin
          </a>
          <br />
          <a href="" style={linkStyle}>
            Buying and Selling through Coin
          </a>
          <br />
          <a href="" style={linkStyle}>
            Starting an SIP
          </a>
          <br />
          <a href="" style={linkStyle}>
            Managing your Portfolio
          </a>
          <br />
          <a href="" style={linkStyle}>
            Coin App
          </a>
          <br />
          <a href="" style={linkStyle}>
            Moving to Coin
          </a>
          <br />
          <a href="" style={linkStyle}>
            Government Securities
          </a>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
