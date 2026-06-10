import { AuthProvider } from '@hooks/useAuth';
import './App.css';

import { ConfigProvider } from 'antd';
import { BrowserRouter } from "react-router-dom";

import MainRouter from "@router/MainRouter";

import esES from 'antd/es/locale/es_ES';
// import dayjs from 'dayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


// import 'dayjs/locale/es-mx';
// dayjs.locale('es-mx');

const queryClient = new QueryClient()

function App() {

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ConfigProvider
            locale={esES}
            theme={{
              components: {
                Switch: {
                  // handleBg: '#EDC495',
                  // handleShadow: '#E3F4D7'
                },
                Select: {
                  // optionSelectedColor: "red",
                  // optionSelectedBg: "yellow",
                  optionActiveBg: "#EDC495"
                },
                Table: {
                  rowHoverBg: '#E3F4D7',
                  rowSelectedBg: '#E3F4D7',
                  rowSelectedHoverBg: '#E3F4D7'
                }
              },
              token: {
                // Seed Token
                colorPrimary: 'transparent', //'#FFD625',
                colorPrimaryBg: "transparent",

                // borderRadius: 2,

                // Alias Token
                // colorBgContainer: 'red',
              },
            }}
          >
            <MainRouter />
          </ConfigProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter >

  )
}

export default App
