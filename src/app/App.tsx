import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "@app/router";

import {ProgressProvider} from '@bprogress/react';
import {AntdProvider} from "@app/providers/AntdProvider.tsx";
import {QueryProvider} from "@app/providers/QueryProvider.tsx";

import '@app/styles/globals.css'

export default function App() {
    return (
        <AntdProvider>
            <QueryProvider>
                <BrowserRouter>
                    <ProgressProvider options={{showSpinner: false}}>
                        <AppRoutes/>
                    </ProgressProvider>
                </BrowserRouter>
            </QueryProvider>
        </AntdProvider>
    )
}
