import React from 'react';
import {Main} from './main/main';
import {Provider} from 'react-redux';
import {Store, Persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
const App = props => {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <Main {...props} />
      </PersistGate>
    </Provider>
  );
};

export default App;
