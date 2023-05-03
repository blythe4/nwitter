import Nweet from "components/Nweet";
import { dbService } from "fbase";
import { useEffect, useState } from "react";

const MyNweet = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);
    const getMyNweets = async () => {
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt", "desc")
            .get();
        const nweetArray = nweets.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setNweets(nweetArray);
    };
    useEffect(() => {
        getMyNweets();
    });

    return (
        <div style={{ marginTop: 50 }}>
            <h4 className="title">My Nweet List</h4>
            {nweets.map((nweet) => (
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
            ))}
        </div>
    );
};

export default MyNweet;
