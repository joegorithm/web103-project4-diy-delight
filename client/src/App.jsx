import React from 'react';
import { useRoutes } from 'react-router-dom';
import Navigation from './components/Navigation'
import ViewPizzas from './pages/ViewPizzas';
import EditPizza from './pages/EditPizza';
import CreatePizza from './pages/CreatePizza';
import PizzaDetails from './pages/PizzaDetails';
import './App.css';

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <CreatePizza title='BOLT BUCKET | Customize' />
    },
    {
      path:'/pizzas',
      element: <ViewPizzas title='BOLT BUCKET | Custom Cars' />
    },
    {
      path: '/pizzas/:id',
      element: <PizzaDetails title='BOLT BUCKET | View' />
    },
    {
      path: '/edit/:id',
      element: <EditPizza title='BOLT BUCKET | Edit' />
    }
  ]);

  return (
    <div className='app'>
      <Navigation />
      { element }
    </div>
  );
}

export default App;