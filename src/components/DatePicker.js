/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import { addDays, subDays } from "date-fns";
import hexToRgb from "../global/helpers/hexToRgb";
import styles from "./DatePicker.module.css"
import { DateView } from "./DateView";
import { MonthView } from './MonthView';
import styles from "./DatePicker.module.css"
import {
    addDays,
    addMonths,
    differenceInMonths,
    format,
    isSameDay,
    lastDayOfMonth,
    startOfMonth
} from "date-fns";


const DatePicker = ({startDate, lastDate, prevDate, locale, selectDate, getSelectedDay, labelFormat,  primaryColor, marked}) => {
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

    const primaryColor = props.color? (props.color.indexOf("rgb") > 0?props.color:hexToRgb(props.color)):'rgb(54, 105, 238)';

    const startDate = props.startDate || new Date();
    const backDate = props.prevDate || null;
    const lastDate = addDays(startDate, props.endDate || props.days || 90);
    const prevDate = subDays(startDate, backDate || 90);

    let buttonzIndex = {zIndex: 2};
    let buttonStyle = {background: primaryColor};
    
    const [selectedDate, setSelectedDate] = useState(null);
    const firstSection = {marginLeft: '40px'};
    const selectedStyle = {fontWeight:"bold",width:"45px",height:"45px",borderRadius:"50%",border:`2px solid ${primaryColor}`,color:primaryColor};
    const labelColor = {color: primaryColor};
    const markedStyle = {color: "#8c3737", padding: "2px", fontSize: 12};

    const getStyles = (day) => {
        return isSameDay(day, selectedDate)?selectedStyle:null;
    };

    const getId = (day) => {
        return isSameDay(day, selectedDate)?'selected':"";
    };

    const getMarked = (day) => {
        let markedRes = marked?.find(i => isSameDay(i.date, day));
        if (markedRes) {
            if (!markedRes?.marked) {
                return;
            }

            return <div style={{ ...markedRes?.style ?? markedStyle }} className={styles.markedLabel}>
                {markedRes.text}
            </div>;
        }

        return "";
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
      

        // const styleItemMarked = marked ? styles.dateDayItemMarked : styles.dateDayItem;
        for (let i = 0; i < numberOfMonths.length; i++) {
            let start, end;
            const month = startOfMonth(addMonths(prevDate, i));

            start = i === 0 ? Number(format(prevDate, dateFormat, {locale: locale})) - 1 : 0;
            end = i ===  numberOfMonths.length - 1 ? Number(format(subDays(startDate, 1), "d")) : Number(format(lastDayOfMonth(month), "d"));

            for (let j = start; j < end; j++) {
                let currentDay = addDays(month, j);

                days.push(
                    <div id={`${getId(currentDay)}`}
                         className={marked ? styles.dateDayItemMarked : styles.dateDayItem}
                         style={getStyles(currentDay)}
                         key={currentDay.toString() + Math.random()}
                         onClick={() => onDateClick(currentDay)}
                    >
                        <div className={styles.dayLabel}>{format(currentDay, dayFormat, {locale: locale})}</div>
                        <div className={styles.dateLabel}>{format(currentDay, dateFormat, {locale: locale})}</div>
                        {getMarked(currentDay)}
                    </div>
                );
            }
            months.push(
                <div className={styles.monthContainer}
                     key={month.toString() + Math.random()}
                >
                    <span className={styles.monthYearLabel} style={labelColor}>
                        {format(month, labelFormat || "MMMM yyyy", {locale: locale})}
                    </span>
                    <div className={styles.daysContainer} style={i===0?firstSection:null}>
                        {days}
                    </div>
                </div>
            );
            days = [];

        }

        

        for (let i = 0; i <= differenceInMonths(lastDate, startDate); i++) {
            let start, end;
            const month = startOfMonth(addMonths(startDate, i));

            start = i === 0 ? Number(format(startDate, dateFormat, {locale: locale})) - 1 : 0;
            end = i === differenceInMonths(lastDate, startDate) ? Number(format(lastDate, "d", {locale:locale})) : Number(format(lastDayOfMonth(month), "d", {locale: locale}));

            for (let j = start; j < end; j++) {
                let currentDay = addDays(month, j);

                days.push(
                    <div id={`${getId(currentDay)}`}
                         className={marked ? styles.dateDayItemMarked : styles.dateDayItem}
                         style={getStyles(currentDay)}
                         key={currentDay.toString() + Math.random()}
                         onClick={() => onDateClick(currentDay)}
                    >
                        <div className={styles.dayLabel}>{format(currentDay, dayFormat, {locale: locale})}</div>
                        <div className={styles.dateLabel}>{format(currentDay, dateFormat, {locale: locale})}</div>
                        {getMarked(currentDay)}
                    </div>
                );
            }
            months.push(
                <div className={styles.monthContainer}
                     key={month.toString() + Math.random()}
                >
                    <span className={styles.monthYearLabel} style={labelColor}>
                        {format(month, labelFormat || "MMMM yyyy", {locale: locale})}
                    </span>
                    <div className={styles.daysContainer} style={i===0?firstSection:null}>
                        {days}
                    </div>
                </div>
            );
            days = [];

        }

        return <div id={"container"} className={styles.dateListScrollable}>{months}</div>;
    }

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
                        view.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"});
                    }
                }, 20);
            }
        }
    }, [selectDate]);
        useEffect(() => {
        if (selectedDate) {
                    let view = document.getElementById('selected');
                    if (view) {
                        view.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"});
                    }
                };
    }, [selectedDate]);

    return(
      <div className={styles.container}>
            <div className={styles.buttonWrapper} style={buttonzIndex}>
                <button className={styles.button} style={buttonStyle} onClick={prev}>&lt;</button>
            </div>
    			 <React.Fragment>{renderDays()}</React.Fragment>
            <div className={styles.buttonWrapper} style={buttonzIndex}>
                <button className={styles.button} style={buttonStyle} onClick={next}>&gt;</button>
            </div>
        </div>
    );

}




export { DatePicker }
