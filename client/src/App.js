import { useEffect } from 'react';
import Home from './Views/Home/Home'

function App() 
{
  useEffect(() => 
  {
    fetch
    (
      '/backend'
    )
    .then(res =>
    {
      return res.json();
    })
    .then(data =>
    {
      console.log(data.express);
    });
  });

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
