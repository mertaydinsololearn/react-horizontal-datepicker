/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import hexToRgb from "../global/helpers/hexToRgb";
import styles from "./DatePicker.module.css"
import { MonthView } from './MonthView';

import { addDays, subDays, addMonths, differenceInMonths, format, isSameDay, lastDayOfMonth, startOfMonth, eachMonthOfInterval } from "date-fns";
const DatePicker = ({
  prevDateGiven,
  endDate,
  locale,
  selectDate,
  getSelectedDay,
  colorGiven,
  labelFormat
}) => {
    const [selectedDate, setSelectedDate] = useState(null);
const next = (event) => {
        event.preventDefault();
        const e = document.getElementById('container');
        const width = e ? e.getBoundingClientRect().width : null;
        e.scrollLeft += width - 60;
    };

    const prev = (event) => {
        event.preventDefault();
        const e = document.getElementById('container');
        const width = e ? e.getBoundingClientRect().width : null;
        e.scrollLeft -= width - 60;
    };

    const primaryColor =  colorGiven? (colorGiven.indexOf("rgb") > 0?colorGiven:hexToRgb(colorGiven)):'rgb(54, 105, 238)';

    const startDate = new Date(selectedDate);
    const backDate = prevDateGiven || null;
    const lastDate = addDays(startDate, endDate || days || 90);
    const prevDate = subDays(startDate, backDate || 90);

    let buttonzIndex = {zIndex: 2};
    let buttonStyle = {background: primaryColor};
    
    const markedStyle = {color: "#8c3737", padding: "2px", fontSize: 12};
    
  const firstSection = {
    marginLeft: '40px'
  };
  const selectedStyle = {
    fontWeight: "bold",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border: `2px solid ${primaryColor}`,
    color: primaryColor
  };
  const labelColor = {
    color: primaryColor
  };

  const getStyles = day => {
    return isSameDay(day, selectedDate) ? selectedStyle : null;
  };

  const getId = day => {
    return isSameDay(day, selectedDate) ? 'selected' : "";
  };

  const renderDays = () => {
    const dayFormat = "E";
    const dateFormat = "d";
    const months = [];
    let days = [];

    const numberOfMonths = eachMonthOfInterval({
      start: prevDate,
      end: startDate
    });
    
  
    for (let i = 0; i < numberOfMonths.length; i++) {
      let start, end;
      const month = startOfMonth(addMonths(prevDate, i));
      start = i === 0 ? Number(format(prevDate, dateFormat)) - 1 : 0;
      end = i ===  numberOfMonths.length - 1 ? Number(format(subDays(startDate, 1), "d")) : Number(format(lastDayOfMonth(month), "d"));

      for (let j = start; j < end; j++) {
        let currentDay = addDays(month, j);
        days.push( /*#__PURE__*/React.createElement("div", {
          id: `${getId(currentDay)}`,
          className: styles.dateDayItem,
          style: getStyles(currentDay),
          key: currentDay.toString() + Math.random(),
          onClick: () => onDateClick(currentDay)
        }, /*#__PURE__*/React.createElement("div", {
          className: styles.dayLabel
        }, format(currentDay, dayFormat, {locale: locale})), /*#__PURE__*/React.createElement("div", {
          className: styles.dateLabel
        }, format(currentDay, dateFormat, {locale: locale}))));
      }

      months.push( /*#__PURE__*/React.createElement("div", {
        className: styles.monthContainer,
        key: month.toString() + Math.random()
      }, /*#__PURE__*/React.createElement("span", {
        className: styles.monthYearLabel,
        style: labelColor
      }, format(month, labelFormat || "MMMM yyyy", {locale: locale})), /*#__PURE__*/React.createElement("div", {
        className: styles.daysContainer,
        style: i === 0 ? firstSection : null
      }, days)));
      days = [];
    }


    for (let i = 0; i <= differenceInMonths(lastDate, startDate); i++) {
      let start, end;
      const month = startOfMonth(addMonths(startDate, i));
      start = i === 0 ? Number(format(startDate, dateFormat)) - 1 : 0;
      end = i === differenceInMonths(lastDate, startDate) ? Number(format(lastDate, "d")) : Number(format(lastDayOfMonth(month), "d"));

      for (let j = start; j < end; j++) {
        let currentDay = addDays(month, j);
        days.push( /*#__PURE__*/React.createElement("div", {
          id: `${getId(currentDay)}`,
          className: styles.dateDayItem,
          style: getStyles(currentDay),
          key: currentDay.toString() + Math.random(),
          onClick: () => onDateClick(currentDay)
        }, /*#__PURE__*/React.createElement("div", {
          className: styles.dayLabel
        }, format(currentDay, dayFormat, {locale: locale})), /*#__PURE__*/React.createElement("div", {
          className: styles.dateLabel
        }, format(currentDay, dateFormat, {locale: locale}))));
      }

      months.push( /*#__PURE__*/React.createElement("div", {
        className: styles.monthContainer,
        key: month.toString() + Math.random() + Math.random(),
      }, /*#__PURE__*/React.createElement("span", {
        className: styles.monthYearLabel,
        style: labelColor
      }, format(month, labelFormat || "MMMM yyyy", {locale: locale})), /*#__PURE__*/React.createElement("div", {
        className: styles.daysContainer,
        style: i === 0 ? firstSection : null
      }, days)));
      days = [];
    }

    return /*#__PURE__*/React.createElement("div", {
      id: "container",
      className: styles.dateListScrollable
    }, months);
  };

  const onDateClick = day => {
    setSelectedDate(day);

    if (getSelectedDay) {
      getSelectedDay(day);
    }
  };

  useEffect(() => {
    if (getSelectedDay) {
      if (selectDate) {
        getSelectedDay(selectDate);
      } else {
        getSelectedDay(startDate);
      }
    }
  }, []);
  useEffect(() => {
    if (selectDate) {
      if (!isSameDay(selectedDate, selectDate)) {
        setSelectedDate(selectDate);
        setTimeout(() => {
          let view = document.getElementById('selected');

          if (view) {
            view.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest"
            });
          }
        }, 20);
      }
    }
  }, [selectDate]);
	
	
	  return /*#__PURE__*/React.createElement("div", {
    className: styles.container
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.buttonWrapper,
    style: buttonzIndex
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.button,
    style: buttonStyle,
    onClick: prev
  }, "<")), 	/*#__PURE__*/React.createElement(React.Fragment, null, renderDays()), /*#__PURE__*/React.createElement("div", {
    className: styles.buttonWrapper,
    style: buttonzIndex
  }, /*#__PURE__*/React.createElement("button", {
    className: styles.button,
    style: buttonStyle,
    onClick: next
  }, ">")));
	

};

export { DatePicker };
