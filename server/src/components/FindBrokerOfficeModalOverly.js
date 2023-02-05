import classes from "./FindBrokerOfficeModalOverlay.modules.scss";
import { useRef, useState } from "react";

const FindBrokerOfficeModalOverlay = (props) => {
  const modalBusinessCorpRef = useRef();
  const modalRealtorName = useRef();

  const [realtorList, setRealtorList] = useState([]);

  const modalStateChangeHandler = () => {
    props.onModalStateChange();
  };

  const onClickHandler = () => {
    const bsnmCmpnm = modalBusinessCorpRef.current.value;
    const brkrNm = modalRealtorName.current.value;

    const url = `https://apis.data.go.kr/1611000/nsdi/EstateBrkpgService/attr/getEBOfficeInfo?bsnmCmpnm= ${bsnmCmpnm} 
    &brkrNm=${brkrNm} 
    &format=json&SttusSeCode=1&ServiceKey=WJW00Su3vUYQxWl%2FCdTWnPqgt4dnBsErjbqIqeo9I7%2BWiVcC4HDx26kL%2BYDc0MRTL%2BjZ6RC1BWUVlf9Z8rWQPg%3D%3D`;

    fetch(url)
      .then((result) => result.json())
      .then((json) => {
        const realtorList = json.EBOffices.field;
        setRealtorList(realtorList);
      });
  };

  return (
    <div>
      <button
        onClick={modalStateChangeHandler}
        style={{
          textDecoration: "none",
          fontSize: "large",
        }}
      >
        X
      </button>
      <h2>중개사무소 찾기</h2>
      <div>
        <form>
          <div>
            <label htmlFor="businesscorp">사업자 상호 </label>
            <input type="text" id="businesscorp" ref={modalBusinessCorpRef} />
          </div>
          <div>
            <label htmlFor="realtorname">중개업자 명 </label>
            <input type="text" id="realtorname" ref={modalRealtorName} />
          </div>
        </form>
      </div>
      <button onClick={onClickHandler}>찾기</button>
      {realtorList.map((item) => {
        return (
          <div>
            <div>{item.ldCodeNm}</div>
            <div>{item.bsnmCmpnm}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FindBrokerOfficeModalOverlay;