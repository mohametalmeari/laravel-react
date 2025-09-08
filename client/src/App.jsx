import { RouterProvider } from "react-router";
import { RootLayout } from "./layouts";
import { router } from "./router";
import { StateProvider } from "./contexts/StateProvider";

function App() {
  return (
    <StateProvider>
      <RootLayout>
        <RouterProvider router={router} />
      </RootLayout>
    </StateProvider>
  );
}

export default App;
