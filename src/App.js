import { Suspense } from 'react';
import './App.css';
import AppRouter from './AppRouter';
//antD
import 'antd/dist/antd.css';
import { ConfigProvider, Spin } from 'antd';
import esEs from 'antd/lib/locale/es_ES';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
// Redux
import { PersistGate } from 'redux-persist/integration/react'

const { persistor, store } = configureStore();

function App() {
 

  return (
    <ConfigProvider locale={esEs}>
      <Suspense fallback={<Spin />}>
        <Provider store={store}>
          <PersistGate loading={<Spin />} persistor={persistor}>
            <AppRouter />
          </PersistGate>
        </Provider>
      </Suspense>
    </ConfigProvider>
  );
}

export default App;
