import { useEffect, useState } from "react";
import { authService } from "fbase";
import AppRouter from "components/Router";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            user ? setUserObj(user) : setUserObj(null);
            setInit(true);
        });
    }, []);
    return <>{init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}</>;
}

export default App;
