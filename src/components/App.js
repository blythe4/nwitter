import { useEffect, useState } from "react";
import { authService } from "fbase";
import AppRouter from "components/Router";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged(async (user) => {
            if (user) {
                if (user.displayName === null) {
                    const ind = user.email.indexOf("@");
                    const end = user.email.substring(0, ind);
                    await user.updateProfile({
                        displayName: end,
                    });
                }
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    updateProfile: (args) => user.updateProfile(args),
                });
                // setUserObj(user);
            } else {
                setUserObj(null);
            }
            setInit(true);
        });
    }, []);
    const refreshUser = () => {
        /**
         * 데이터를 감지하여 업데이트 여부를 판단한다.
         * 다만 데이터의 양이 많을 경우 react.js에서 판단하기 어려우므로 필요한 값을 따로 선언하여 업데이트 해준다.
         */
        const user = authService.currentUser;
        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args),
        });
        // setUserObj(Object.assign({}, user)); // 비어있는 Object를 생성하고 user를 복사하여 새로운 Object로 만든다.
    };
    return (
        <>
            {init ? (
                <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />
            ) : (
                "Initializing..."
            )}
        </>
    );
}

export default App;
