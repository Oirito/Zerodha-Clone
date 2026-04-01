import React from "react";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">

        <h1 className="mb-3">The Zerodha Universe</h1>
        <p className="text-muted">
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-4 p-4 mt-4">
          <img
            src="media/images/smallcaseLogo.png"
            className="universe-logo"
            alt="smallcase"
          />
          <p className="text-muted mt-3">Thematic investment platform</p>
        </div>

        <div className="col-4 p-4 mt-4">
          <img
            src="media/images/streakLogo.png"
            className="universe-logo"
            alt="streak"
          />
          <p className="text-muted mt-3">Algo & strategy platform</p>
        </div>

        <div className="col-4 p-4 mt-4">
          <img
            src="media/images/sensibullLogo.svg"
            className="universe-logo"
            alt="sensibull"
          />
          <p className="text-muted mt-3">Options trading platform</p>
        </div>

        <div className="col-4 p-4 mt-4">
          <img
            src="media/images/zerodhaFundhouse.png"
            className="universe-logo"
            alt="zerodha fundhouse"
          />
          <p className="text-muted mt-3">Asset management</p>
        </div>

        <div className="col-4 p-4 mt-4">
          <img
            src="media/images/goldenpiLogo.png"
            className="universe-logo"
            alt="goldenpi"
          />
          <p className="text-muted mt-3">Bond trading platform</p>
        </div>

        <div className="col-4 p-4 mt-4">
          <img
            src="media/images/dittoLogo.png"
            className="universe-logo"
            alt="ditto"
          />
          <p className="text-muted mt-3">Insurance</p>
        </div>

        <div className="mt-5 mb-5">
          <button className="btn btn-primary fs-5 px-4 py-2">
            Signup Now
          </button>
        </div>

      </div>
    </div>
  );
}

export default Universe;