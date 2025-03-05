//import React from 'react'
import moment from "moment";
import { MdOutlineClose } from "react-icons/md";

const FilterInfoTitle = ({filterType, filterDates, onClear }) => {
  const DateRangeChip = ({ date }) => {
    const startDate = date?.from
      ? moment(date.from).format("MMM DD, YYYY")
      : "N/A";
    const endDate = date.to ? moment(date.to).format("MMM DD, YYYY") : "N/A";

    return (
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded">
        <p className="text-xs font-medium">
          {startDate} - {endDate}
        </p>

        <button onClick={onClear}>
          <MdOutlineClose />
        </button>
      </div>
    );
  };

  return (
    filterType && (
      <div className="md-5">
        {filterType === "search" ? (
          <h3 className="text-lg font-medium">Search Results</h3>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Stories from</h3>

            <DateRangeChip date={filterDates} />
          </div>
        )}
      </div>
    )
  );
};

export default FilterInfoTitle;
