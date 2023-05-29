import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AnotherPage from './AnotherPage';

function App() {
  const [facility, setFacilities] = useState(false);
  useEffect(() => {
    getFacility();
  }, []);
  
  function getFacility() {
    fetch('http://localhost:3002')
      .then(response => {
        return response.text();
      })
      .then(data => {
        setFacilities(data);
      });
  }
  
  function createFacility() {
	let name = prompt('Enter facility name');
	let location = prompt('Enter facility location');
	let phonenumber = prompt('Enter facility phonenumber');
    let email = prompt('Enter facility email');
    fetch('http://localhost:3002/facility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name,location,phonenumber,email}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getFacility();
      });
  }
  
  function deleteFacility() {
    let id = prompt('Enter facility id');
    fetch(`http://localhost:3002/facility/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getFacility();
      });
  }
  
  return (
	<Router>
		<div style={{display: 'flex', flexDirection: 'column' }}>
			<header style={{ backgroundColor: 'red', left: '0', right: '0', paddingTop: '20px', paddingBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '0 0 50px 50px' }}>
				<h1>JINDAN</h1>
			</header>
			<main>
				{facility ? facility : 'There is no facility data available'}
				<br />
				<br />
				<br />
				<button onClick={createFacility} style={{ backgroundColor: 'red', borderRadius: '10px', color: 'white', padding: '10px', marginLeft: '250px' , marginRight: '100px' }}> Add facility</button>
				<button onClick={deleteFacility} style={{ backgroundColor: 'red', borderRadius: '10px', color: 'white', padding: '10px', marginLeft: '100px' ,marginRight: '100px' }}>Delete facility</button>
				<button onClick={() => {window.location.href = 'AnotherPage.js'}} style={{ backgroundColor: 'red', borderRadius: '10px', color: 'white', padding: '10px', marginLeft: '100px' }}>
				Go to Another Page
				</button>
				<br />
			</main>
			<footer style={{ position: 'fixed', bottom: '0', left: '0', right: '0', backgroundColor: 'red', padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50px 50px 0 0' }}>
		<p>Blood Management System</p>
	  </footer>
			
		</div>
	</Router>
  );
}
export default App;