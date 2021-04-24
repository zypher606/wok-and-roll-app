import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Login from './screens/Login/Login';
import { withAuth } from './hocs/withAuth';
import Dashboard from './screens/Dashboard/Dashboard';

function App(props: any) {

  const { authenticated } = props;
  
  return (
    <div>
      {
        !authenticated &&
        <Login />
      }

      {
        authenticated &&
        <Dashboard />
      }
    </div>
  );
}

export default withAuth(App);
