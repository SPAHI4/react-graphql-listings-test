import './spinner.css';

function Spinner(): JSX.Element {
  // taken from https://loading.io/css/
  return <div className="lds-dual-ring"></div>;
}

export default Spinner;
