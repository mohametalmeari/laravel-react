import { RouterProvider } from "react-router";
import { RootLayout } from "./layouts";
import { router } from "./router";

function App() {
  return (
    <RootLayout>
      <RouterProvider router={router} />
    </RootLayout>
  );
}

export default App;
