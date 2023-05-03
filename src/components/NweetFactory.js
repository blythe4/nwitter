import { useRef, useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({ userObj }) => {
    const fileinput = useRef();
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }

        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };

        await dbService.collection("nweets").add(nweetObj);
        // await dbService.collection("nweets").add({
        //     text: nweet,
        //     createdAt: Date.now(),
        //     creatorId: userObj.uid,
        // });
        setNweet(""); // 저장 후 빈값
        onClearAttachmentClick();
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0]; // 업로드 파일
        const reader = new FileReader(); // 파일 리더
        reader.onloadend = (finishedEvent) => {
            //  event Listner - 파일 로딩이 끝날 때
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        if (theFile) {
            reader.readAsDataURL(theFile); // 업로드 된 파일의 URL 주소를 얻는다.
        } else {
            onClearAttachmentClick(); // 파일 업로드 취소
        }
    };
    const onClearAttachmentClick = () => {
        setAttachment("");
        fileinput.current.value = null; // 파일 삭제 후 input에 남아 있는 value 삭제
    };
    return (
        <form onSubmit={onSubmit}>
            <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange} ref={fileinput} />
            <input type="submit" value="Nweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" alt="" />
                    <button onClick={onClearAttachmentClick}>Clear</button>
                </div>
            )}
        </form>
    );
};
export default NweetFactory;
