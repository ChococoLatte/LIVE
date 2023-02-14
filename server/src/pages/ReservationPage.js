import { ReservationHouseCardContent } from "../components/HouseCardContent";
import ReservationLeftDiv from "../components/reservation/ReservationLeftDiv";
import ReservationRightDiv from "../components/reservation/ReservationRightDiv";
import ListBox from "../UI/ListBox";
import ReservationSearchBox from "../components/reservation/ReservationSearchBox";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ReservationPage.module.scss";
import { FiAlertCircle } from "react-icons/fi";
import { useLoaderData } from "react-router-dom";
import axiosInstance from "../util/axios";
import {
  registResevation,
  searchRealtorList,
  searchReservationRealtorDetail,
} from "../apis/reservationApis";
import Modal from "../UI/Modal";
import { reservedItemAction } from "../store/reserved-item-slice";

const ReservationPage = () => {
  const [reserveData, setReserveData] = useState({
    sido: "",
    gugun: "",
    dong: "",
    date: new Date(),
  });

  const isMount = useRef(false);

  const sidos = useLoaderData().data.data;

  const [realtorList, setRealtorList] = useState([]);
  const [realtorDetail, setRealtorDetail] = useState(null);

  const [modalActive, setModalActive] = useState(false);
  const dispatch = useDispatch();

  const modalToggleHandler = () => {
    setModalActive(!modalActive);
  };

  //예약 목록
  const selectedItems = useSelector((state) => {
    return state.reserve.selectedItems;
  });

  // console.log(selectedItems);

  //중개사 세부 소환
  const clickRealtorEventHandler = (realtorNo) => {
    const params = {};

    if (!reserveData.gugun) {
      params[`regionCode`] = reserveData.sido.substring(0, 2);
    } else if (!reserveData.dong) {
      params[`regionCode`] = reserveData.gugun.substring(0, 5);
    } else {
      params[`regionCode`] = reserveData.dong;
    }

    (async () => {
      const res = await searchReservationRealtorDetail(realtorNo, params);
      console.log(res);
      const data = res.data;
      setRealtorDetail(data.data);
    })();
  };

  //reserveData 변경
  const clickSearchEventHandler = (sido, gugun, dong, date) => {
    if (!sido) {
      alert(`광역시도는 반드시 입력해야 합니다!`);
    } else if (!date) {
      alert(`날짜는 반드시 입력해야 합니다!`);
    } else {
      setReserveData({ sido, gugun, dong, date });
    }
  };

  //중개사 리스트 검색
  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      return;
    }

    // 뭐 보낼래?
    const params = {};

    if (!reserveData.sido) {
      console.log(`sido is nothing...`);
      return;
    }

    if (!reserveData.gugun) {
      params[`regionCode`] = reserveData.sido.substring(0, 2);
    } else if (!reserveData.dong) {
      params[`regionCode`] = reserveData.gugun.substring(0, 5);
    } else {
      params[`regionCode`] = reserveData.dong;
    }

    (async () => {
      try {
        const result = await searchRealtorList(params);
        console.log(result.data.data);
        setRealtorList(result.data.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [reserveData]);

  const removeItemHandler = (itemNo) => {
    if (window.confirm("매물 목록에서 삭제하겠습니까?")) {
      dispatch(reservedItemAction.removeItem(itemNo));
    }
  };

  //예약 ㄱㄱ
  const registReservationHandler = (detail) => {
    console.log(realtorDetail);
    console.log(selectedItems);

    const data = {};
    data["requirement"] = detail;
    data["status"] = false;
    data["realtorNo"] = realtorDetail.realtorInfo.no;
    data["consultingDate"] = reserveData.date;

    const itemList = [];

    selectedItems.forEach((el) => {
      itemList.push(el.itemNo);
    });

    data["itemList"] = itemList;

    registResevation(data);
  };

  return (
    <>
      <div className={classes.reserveHeader}>
        <h1>예약하기</h1>

        <div className={classes.reservationSearchBoxContainer}>
          <h3>어느 지역을 원하세요?</h3>
          <ReservationSearchBox
            clickSearchEventHandler={clickSearchEventHandler}
            sidos={sidos}
          />
        </div>
      </div>

      <div className={classes.content}>
        <ReservationLeftDiv
          realtors={realtorList}
          clickEventHandler={clickRealtorEventHandler}
        />
        <ReservationRightDiv realtorDetail={realtorDetail} />
      </div>

      <div className={classes.listBox}>
        <h2>내가 선택한 매물</h2>
        <div className={classes.list}>
          <ListBox
            dataArray={selectedItems.length === 0 ? [1] : selectedItems}
            direction={true}
            toStart={true}
          >
            {selectedItems.length === 0 ? (
              <NullCard />
            ) : (
              <ReservationHouseCardContent
                removeItemHandler={removeItemHandler}
              />
            )}
          </ListBox>
        </div>
      </div>

      <div>
        <div className={classes.infomationBox}>
          <div className={classes.iconContainer}>
            <FiAlertCircle />
          </div>
          <div className={classes.ulContainer}>
            <ul>
              <li>
                등록 하신 방은 방 정보와 계정 정보(가입된 아이디, 이름, 연락처
                등)가 함께 노출 됩니다.
              </li>
              <li>
                허위 매물(계약이 완료된 매물, 허위 정보가 기재된 매물) 등록 시
                서비스 이용이 제한될 수 있습니다.
              </li>
            </ul>
          </div>
        </div>
        <div className={classes.reserveBtnContainer}>
          <button onClick={modalToggleHandler}>예약하기</button>
        </div>
      </div>
      {modalActive && (
        <Modal onConfirm={modalToggleHandler}>
          <DoReserve
            registHandler={registReservationHandler}
            modalToggleHandler={modalToggleHandler}
          ></DoReserve>
        </Modal>
      )}
    </>
  );
};

export default ReservationPage;

const DoReserve = (props) => {
  const detail = useRef();

  return (
    <div className={classes.doReserve}>
      <label>요청사항</label>
      <textarea
        ref={detail}
        placeholder={`세부적인 요청사항이 있다면 입력해주세요.`}
      ></textarea>
      <div className={classes.reserveBtnContainer}>
        <button
          onClick={() => {
            props.registHandler(detail.current.value);
            props.modalToggleHandler();
          }}
        >
          예약 요청하기
        </button>
      </div>
    </div>
  );
};

const NullCard = () => {
  return <div className={classes.nullCard}>선택한 매물이 없어요</div>;
};

export const sidoLoader = async () => {
  try {
    return axiosInstance.get("regions", {
      params: {
        regionCode: "",
      },
    });
  } catch {
    throw new Error("sido Loader Error");
  }
};