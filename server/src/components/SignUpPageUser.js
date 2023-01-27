import React, { useState, useRef } from "react";
import Card from "../UI/Card";

const SignUpPageUser = () => {
  const onChange = (e) => {
    console.log(e.target.value.user_id);
  };

  const [userId, setUserId] = useState("");
  const [userPass, setUserPass] = useState("");
  const [userPassCheck, setUserPassCheck] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // 에러 메세지
  const [userIdError, setUserIdError] = useState(false);
  const [userPassError, setUserPassError] = useState(false);
  const [userPassCheckError, setUserPassCheckError] = useState(false);
  const [userEmailError, setUserEmailError] = useState(false);

  const onChangeUserId = (e) => {
    if (e.target.value.length > 16 || e.target.value.length < 3)
      setUserIdError(true);
    else setUserIdError(false);

    setUserId(e.target.value);
  };

  const onChangeUserPass = (e) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$^*+=-])(?=.*[0-9]){9,16}/;
    if (!e.target.value || passwordRegex.test(e.target.value))
      setUserPassError(false);
    else setUserPassError(true);

    if (!userPassCheck || e.target.value === userPassCheck)
      setUserPassCheckError(false);
    else setUserPassCheckError(true);

    setUserPass(e.target.value);
  };

  const onChangeUserPassCheck = (e) => {
    if (userPass === e.target.value) setUserPassCheckError(false);
    else setUserPassCheckError(true);

    setUserPassCheck(e.target.value);
  };

  const onChangeEmail = (e) => {
    if (e.target.value.includes("@")) setUserEmailError(false);
    else setUserEmailError(true);

    setUserEmail(e.target.value);
  };

  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();

  // 이미지 업로드 input의 onChange
  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
    console.log(file);
  };

  const deleteImage = () => {
    setImgFile({
      imgFile: "",
    });
  };

  return (
    <Card>
      <form>
        <div>
          <label htmlFor="userId">아이디 </label>
          <input
            id="userId"
            name="userId"
            type="text"
            value={userId}
            onChange={onChangeUserId}
          />
          {userIdError && (
            <div style={{ color: "red" }}>
              최소 3자부터 최대 16자까지 입력가능합니다.
            </div>
          )}
          <button>중복확인</button>
        </div>
        <div>
          <label htmlFor="userPass">비밀번호 </label>
          <input
            id="userPass"
            name="userPass"
            type="password"
            value={userPass}
            onChange={onChangeUserPass}
          />
          {userPassError && (
            <div style={{ color: "red" }}>
              비밀번호는 문자,숫자,특수문자를 조합하여 9자이상 16자 이내이어야
              합니다.
            </div>
          )}
        </div>
        <div>
          <label htmlFor="userPassCheck">비밀번호 확인 </label>
          <input
            id="userPassCheck"
            name="userPassCheck"
            type="password"
            value={userPassCheck}
            onChange={onChangeUserPassCheck}
          />
          {userPassCheckError && (
            <div style={{ color: "red" }}>비밀번호 입력값이 다릅니다!</div>
          )}
        </div>
        <div>
          <label htmlFor="userName">이름 </label>
          <input id="userName" name="userName" type="text" />
        </div>
        <div>
          <label htmlFor="userEmail">이메일 </label>
          <input
            id="userEmail"
            name="userEmail"
            type="email"
            value={userEmail}
            onChange={onChangeEmail}
          />
          {userEmailError && (
            <div style={{ color: "red" }}>올바른 이메일 형식이 아닙니다!</div>
          )}
        </div>
        <div>
          <label htmlFor="userPhone">전화번호 </label>
          <input id="userPhone" name="userPhone" type="text" />
        </div>
        <div>
          <h4>사진등록</h4>
          <div>
            <img
              src={imgFile ? imgFile : `/images/icon/user.png`}
              alt="프로필 이미지"
            />
          </div>
          <br />
          <div>
            <input
              type="file"
              accept="image/*"
              id="profileImg"
              onChange={saveImgFile}
              ref={imgRef}
            />
          </div>
          <div>
            <button onClick={deleteImage}>삭제</button>
          </div>
        </div>
        <button>회원가입</button>
      </form>
    </Card>
  );
};

export default SignUpPageUser;
