import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import RequestInput from "./RequestInput";
import RequestOptions from "./RequestOptions";
import RequestOptionsSector from "./RequestOptionsSector";
import TabBar from "./Tabs/TabBar";
import { useDispatch, useSelector } from "react-redux";
import * as tabActions from "../store/modules/tab";
import * as ctabActions from "../store/modules/ctab";
import * as apiActions from "../store/modules/api";
import apiresult, * as resultActions from "../store/modules/apiresult";
import { useAlert } from "react-alert";
import * as loadActions from "../store/modules/load";
import * as statActions from "../store/modules/teststat";

const Content = ({ current }) => {
  const alert = useAlert();
  const { title, description, seq, url, userId, img } = current;
  const tabs = useSelector((state) => state.tab.tabs);
  const request = useSelector((state) => state.api.request);
  const token = useSelector((state) => state.user.token);
  const ctab = useSelector((state) => state.ctab.datas);
  const tstat = useSelector((state) => state.teststat.stat);
  // console.log(ctab);

  // console.log(tstat);

  const dispatch = useDispatch();
  const [requestTabs] = useState(["Params", "Headers", "Body", "Settings"]);
  const [requestTabIndex, setRequestTabIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectTabSeq, setSelectTabSeq] = useState(0);
  const [parsingHeaders, setParsingHeaders] = useState({});
  const [parsingParams, setParsingPrams] = useState({});
  const [parsingBody, setParsingBody] = useState({});

  const handleTabChange = async (index) => {
    dispatch(statActions.setStat("api"));
    dispatch(apiActions.resetParamDatas([]));
    dispatch(apiActions.resetHeaderDatas([]));
    dispatch(apiActions.resetBodyDatas([]));
    dispatch(apiActions.resetAllDatas({}));
    await axios({
      method: "GET",
      url: "/api/tabs/" + tabs[index].seq,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        // console.log(res.data);
        dispatch(resultActions.setResultState([]));
        if (res.data.response.tabDto.params === null) {
          dispatch(ctabActions.resetParamDatas([]));
        } else {
          dispatch(ctabActions.resetParamDatas(res.data.response.tabDto.params));
        }
        if (res.data.response.tabDto.headers === null) {
          dispatch(ctabActions.resetHeaderDatas([]));
        } else {
          dispatch(ctabActions.resetHeaderDatas(res.data.response.tabDto.headers));
        }
        if (res.data.response.tabDto.body === null) {
          dispatch(ctabActions.resetBodyDatas([]));
        } else {
          dispatch(ctabActions.resetBodyDatas(res.data.response.tabDto.body));
        }
        dispatch(ctabActions.setcTabSeq(res.data.response.tabDto.seq));
        dispatch(ctabActions.setAddress(current.url));
        dispatch(ctabActions.setcTabWorkspaceSeq(res.data.response.tabDto.workspaceSeq));
      })
      .catch((error) => {
        if (error.response.status === 500) {
          alert.error("Tab ???????????? ???????????? ?????? ??????????????????. ?????? ??????????????????.");
        }
      });
    setSelectTabSeq(tabs[index].seq);
    setCurrentTab(index);
    // dispatch(tabActions.setTabIndexState(index));
  };
  const handleRequestTabChange = (index) => {
    setRequestTabIndex(index);
  };
  const handleNewTab = async () => {
    if (tabs.length >= 5) {
      alert.info("Tabs already fulls... delete another tabs..");
      return;
    }
    await axios({
      method: "POST",
      url: "/api/tabs",
      data: {
        workspaceSeq: current.seq,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        // console.log(res.data);
        dispatch(tabActions.setTabs(res.data.response.tab));
      })
      .catch((error) => {
        if (error.response.status === 500) {
          alert.error("Tab ????????? ??????????????????.");
        }
      });
  };

  const handleRemoveTab = async (selectTab) => {
    await axios({
      method: "DELETE",
      url: "/api/tabs/" + selectTab.seq,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        window.location.reload();
        // console.log(res.data);
      })

      .catch((error) => {
        if (error.response.status === 500) {
          alert.error("Tab ????????? ??????????????????.");
        }
      });
  };

  const handleSubmit = async () => {
    const paramsJson = request.params;
    if (paramsJson.constructor === Array) {
      paramsJson.forEach((array) => {
        const copied = parsingParams;
        copied[array.paramKey] = array.paramValue;
        setParsingPrams(copied);
      });
    }

    const headersJson = request.headers;
    if (headersJson.constructor === Array) {
      headersJson.forEach((array) => {
        const copied = parsingHeaders;
        copied[array.headerKey] = array.headerValue;
        setParsingHeaders(copied);
      });
    }
    const bodyJson = request.body;
    if (bodyJson.constructor === Array) {
      bodyJson.forEach((array) => {
        const copied = parsingBody;
        copied[array.bodyKey] = array.bodyValue;
        setParsingBody(copied);
      });
    }

    if (tstat === "api") {
      const ctype = {
        "Content-Type": request.contentType,
      };
      const theaders = Object.assign(ctype, parsingHeaders);
      const payload = {
        address: ctab.address,
        httpMethod: request.httpMethod,
        params: parsingParams,
        path: request.path,
        body: parsingBody,
        tabSeq: ctab.seq,
        workspaceSeq: current.seq,
      };
      payload.headers = theaders;
      // console.log("payload", payload);

      await axios({
        method: "POST",
        url: "/api/api-result",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      })
        .then((res) => {
          // console.log(res.data);
          // console.log(res.data.response);
          // let a = JSON.parse(res.data);
          let b = JSON.parse(res.data.response.body);
          dispatch(resultActions.setResultState(b));
          // console.log(a);
        })
        .catch((error) => {
          // console.log(payload);
          if (error.response.status === 500) {
            alert.error("??????????????? ?????? ???????????? ???????????? ?????? ??????????????????.");
          }
          if (error.response.status === 404) {
            alert.error("API ???????????? ?????? ???????????? ???????????? ????????????.");
          }
          // console.log(error.response.data.error);
        });
    } else {
      const ctype = {
        "Content-Type": request.contentType,
      };
      const theaders = Object.assign(ctype, parsingHeaders);

      const payload = {
        address: ctab.address,
        httpMethod: request.httpMethod,
        params: parsingParams,
        path: request.path,
        body: parsingBody,
        tabSeq: ctab.seq,
        workspaceSeq: current.seq,
        loop: request.loop,
        thread: request.thread,
      };
      payload.headers = theaders;
      // console.log("payload", payload);

      await axios({
        method: "POST",
        url: "/api/load-result",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      })
        .then((res) => {
          dispatch(loadActions.addLoadResults(res.data.response.loadResult));
          // console.log(res.data.response);
        })
        .catch((error) => {
          // console.log(error);
          if (error.response.status === 500) {
            alert.error("??????????????? ?????? ???????????? ???????????? ?????? ??????????????????.");
          } else if (error.response.status === 404) {
            alert.error("?????????????????? ?????? ???????????? ???????????? ????????????.");
          } else if (error.response.status === 400) {
            alert.error(
              "??????????????? ????????? ???????????? ?????? ????????? ?????? ????????? ??????????????????.???????????? ??????????????????. "
            );
          }
        });
    }
  };
  return (
    <div className="flex">
      <div className="mx-auto mt-8">
        <div>
          <p className=" font-bold text-3xl">{title} </p>
        </div>
        <div className="mt-1">
          <p className=" text-gray-400 text-sm">{url}</p>
        </div>

        <TabBar
          tabs={tabs}
          tabIndex={currentTab}
          handleTabChange={handleTabChange}
          handleNewTab={handleNewTab}
          handleRemoveTab={handleRemoveTab}
        />
        <RequestInput tabs={selectTabSeq} handleSubmit={handleSubmit} url={url} />
        <RequestOptionsSector
          requestTabs={requestTabs}
          tabIndex={requestTabIndex}
          handleRequestTabChange={(index) => handleRequestTabChange(index)}
        />
        <RequestOptions requestTabIndex={requestTabIndex} />
      </div>
    </div>
  );
};

export default Content;
