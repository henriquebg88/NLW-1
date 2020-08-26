import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import home from './Pages/Home';
import CreatePoint from './Pages/CreatePoint';

const Routes = () => {
    return(
        <BrowserRouter>
            <Route path='/create-point' component={CreatePoint} />
            <Route path='/' component={home} exact/>
        </BrowserRouter>
    )
}

export default Routes;