import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Theme from "./Theme.tsx";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root.tsx";

const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
});

const route = createBrowserRouter([
    {
        path: "",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <App />,
            },
            {
                path: "/theme",
                element: <Theme />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ApolloProvider client={client}>
        <RouterProvider router={route} />
    </ApolloProvider>
);
