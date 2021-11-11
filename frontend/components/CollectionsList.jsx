import React, { useEffect, useState } from "react";
import axios from "axios";

const CollectionsList = (props) => {
  const collectionList = props.collectionList
  const clickCollections = async() => {
    await axios({
      method: "get",
      url: `/api/collections/${props.key}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data.response)
      })
      .catch((error) => {
        console.log(error)
      })

  }
  return (
    <>
    {!props ? (
      <div>
        no collections
      </div>
    ):(
      <div className="pt-2 h-10 w-full border-t">
      <div className="text-1xl ml-3" onclick={clickCollections}>
        {collectionList.map((item, i) => (
          <div key={i}> {item.name}</div>
        ))}
      </div>
    </div>
    )
  }
  </>
  );
};

export default CollectionsList;
