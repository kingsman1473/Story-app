//import React from 'react'
import moment from "moment";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

const ViewStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
  return (
    <div>
      <div className="relative">
        <div className="flex items-center justify-end">
          <div>
            <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
              <button
                className="btn-small flex items-center gap-1 text-xs font-medium bg-cyan-50 text-blue-300 shadow-cyan-100/0 border border-cyan-100 hover:bg-blue-300 hover:text-white rounded px-3 py-[3px]"
                onClick={onEditClick}
              >
                <MdUpdate className="text-lg" /> Update Story
              </button>

              <button
                className="btn-small flex items-center gap-1 text-xs font-medium bg-cyan-50 text-blue-300 shadow-cyan-100/0 border border-cyan-100 hover:bg-blue-300 hover:text-white rounded px-3 py-[3px] btn-delete bg-rose-50 text-rose-500 shadow-rose-100/0 border border-rose-100 hover:bg-rose-500 hover:text-white"
                onClick={onDeleteClick}
              >
                <MdDeleteOutline className="text-lg" /> Delete Story
              </button>

              <button className="" onClick={onClose}>
                <MdClose className="text-xl text-slate-400" />
              </button>
            </div>
          </div>
              </div>
              
        <div>
          <div className="flex-1 flex flex-col gap-2 py-4">
            <h1 className="text-2xl text-slate-950">
              {storyInfo && storyInfo.title}
            </h1>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {storyInfo &&
                  moment(storyInfo.visitedDate).format("Do MMM YYYY")}
              </span>

              <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 pt-1">
                <GrMapLocation className="text-sm" />
                {storyInfo &&
                  storyInfo.visitedLocation.map((item, index) =>
                    storyInfo.visitedLocation.length == index + 1
                      ? `${item}`
                      : `${item}, `
                  )}
              </div>
            </div>
          </div>
          <img
            src={storyInfo && storyInfo.imageUrl}
            alt="Selected"
            className="w-full h-[300px] object-cover rounded-lg"
                  />
                  <div className="mt-4">
                        <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
                            { storyInfo.storyn}
                      </p>
                      </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStory;
