import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { XCircleIcon } from "@heroicons/react/solid";
import bg from "../img/bg.png";
import { useDispatch } from "react-redux";
import * as currentActions from "../store/modules/current";
import Aos from "aos";
import "aos/dist/aos.css";

// import { useSelector } from "react-redux";
const MediumCard = ({ seq, title, url, description, img, createDate, index, length, userId }) => {
  const myLoader = ({ src, width, height }) => {
    return `https://testsman.s3.ap-northeast-2.amazonaws.com/images/${userId}/${src}?w=${width}&h=${height}`;
  };
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(createDate);
  const router = useRouter();
  const [titleCategory, setTitleCategory] = useState(4);
  const dispatch = useDispatch();
  const data = {
    seq: seq,
    userId: userId,
    title: title,
    url: url,
    description: description,
    img: img,
    createDate: createDate,
  };
  // console.log(data);
  // console.log(seq);

  useEffect(() => {
    dateForm();
    Aos.init({ duration: 1000 });
  }, [date]);
  const dateForm = () => {
    setDate(createDate.slice(0, 11));
  };

  const pageRouting = () => {
    dispatch(currentActions.setCurrentProject(data));
    router.push("/TestPage");
  };
  // console.log(img);
  return (
    <>
      <div data-aos="fade-zoom-in" className="mt-2 cursor-pointer " onClick={pageRouting}>
        <div className="card shadow-md rounded-2xl ">
          <div className="relative min-h-[300px] ">
            <Image
              loader={myLoader}
              src={img}
              layout="responsive"
              objectFit="cover"
              width={450}
              height={300}
            />
          </div>
          <div className="card-body">
            <h2 className="card-title">
              {title}
              {/* <div className={index === length - 1 ? "badge mx-2 badge-secondary" : "hidden"}>
                NEW
              </div> */}
            </h2>
            <h3 className="mt-[-2px]">{url}</h3>
            <p className="h-[57px]">{description}</p>
            <div className="justify-end card-actions">
              <button className="btn glass bg-secondary hover:bg-secondary ">
                created at {date}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  // return (
  //   <>
  //     <div
  //       // data-aos="fade-zoom-in"
  //       className="mb-8 cursor-pointer hover:scale-105 transform transition duration-500 ease-out shadow-md rounded-sm sm:mx-2 md:mx-3 bg-white"
  //       onClick={pageRouting}
  //     >
  //       {/* <img className="w-full bg-gray-200" src="${bg}" /> */}
  //       <div className="relative h-[248px] sm:h-[310px] md:h-[250px] lg:h-[310px] xl:h-[312px] bg-gray-200 ">
  //         <Image src={bg} layout="fill" objectFit="contain" />
  //       </div>
  //       <div className="py-2 px-4 w-full flex justify-between bg-indigo-700">
  //         <p className="text-sm text-white font-semibold tracking-wide">{title}</p>
  //         <p className="text-sm text-white font-semibold tracking-wide">{date}</p>
  //       </div>
  //       <div className="bg-white px-3  lg:px-6 py-4 rounded-bl-3xl rounded-br-3xl">
  //         <h1 className="text-lg text-gray-900 font-semibold tracking-wider">{url}</h1>
  //         <p className="text-gray-700 text-sm  lg:text-base  lg:leading-8 pr-4 tracking-wide mt-2">
  //           {description}
  //         </p>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default MediumCard;
