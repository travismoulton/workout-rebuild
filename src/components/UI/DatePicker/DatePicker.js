import React from 'react';
import { useState, useEffect, useRef } from 'react';

import classes from './DatePicker.module.css';

export default function DatePicker({ onChange }) {
  const daysMap = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const monthsMap = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const DATE = new Date();

  const todayTimeStamp = new Date(
    DATE.getFullYear(),
    DATE.getMonth(),
    DATE.getDate()
  ).getTime();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [stateLevelYear, setStateLevelYear] = useState(DATE.getFullYear());
  const [stateLevelMonth, setStateLevelMonth] = useState(DATE.getMonth());
  const [selectedDay, setSelectedDay] = useState(todayTimeStamp);
  const [monthDetails, setMonthDetails] = useState(
    getMonthDetails(DATE.getFullYear(), DATE.getMonth())
  );
  const inputRef = useRef(null);
  const calendarRef = useRef(null);

  const hideDatePicker = (e) => {
    if (calendarRef.current)
      if (showDatePicker && !calendarRef.current.contains(e.target))
        setShowDatePicker(false);
  };

  useEffect(() => {
    window.addEventListener('click', hideDatePicker);

    return () => window.removeEventListener('click', hideDatePicker);
  });

  function getNumberOfDays(year, month) {
    return 40 - new Date(year, month, 40).getDate();
  }

  function getDayDetails(args) {
    const date = args.index - args.firstDay;
    const day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year - 1;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }

    const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);

    const _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;

    const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    const timeStamp = new Date(args.year, args.month, _date).getTime();

    return {
      date: _date,
      day,
      year: args.year,
      month,
      timeStamp,
      dayString: daysMap[day],
    };
  }

  function getMonthDetails(year, month) {
    const firstDay = new Date(year, month).getDay();
    const numberOfDays = getNumberOfDays(year, month);
    const monthArr = [];
    const rows = 6;
    const columns = 7;
    let currentDay = null;
    let index = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        currentDay = getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArr.push(currentDay);
        index++;
      }
    }

    return monthArr;
  }

  const isCurrentDay = (day) => day.timeStamp === todayTimeStamp;

  const isSelectedDay = (day) => day.timeStamp === selectedDay;

  const getDateFromDateString = (dateValue) => {
    const dateDetails = dateValue.split('-').map((d) => parseInt(d, 10));
    if (dateDetails.length < 3) return null;

    const [year, month, date] = dateDetails;

    return { year, month, date };
  };

  const getMonthStr = (month) =>
    monthsMap[Math.max(Math.min(11, month), 0)] || 'Month';

  const getDateStringFromTimestamp = (timeStamp) => {
    const dateObj = new Date(timeStamp);
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();

    return `${dateObj.getFullYear()}-${month < 10 ? '0' + month : month}-${
      date < 10 ? '0' + date : date
    } `;
  };

  const setDate = (dateDetails) => {
    const date = new Date(
      dateDetails.year,
      dateDetails.month - 1,
      dateDetails.date
    ).getTime();

    setSelectedDay(date);

    // Not sure about this. I believe it's so I can pass the date to parent component
    // if (props.onChange) props.onChange(date);
  };

  const updateDateFromInput = () => {
    const dateValue = inputRef.current.value;
    const dateDetails = getDateFromDateString(dateValue);

    if (dateDetails) {
      setDate(dateDetails);
      setStateLevelYear(dateDetails.year);
      setStateLevelMonth(dateDetails.month - 1);
      setMonthDetails(getMonthDetails(dateDetails.year, dateDetails.month - 1));
    }
  };

  const setDateToInput = (timeStamp) => {
    const dateString = getDateStringFromTimestamp(timeStamp);
    inputRef.current.value = dateString;
  };

  const onDateClick = (day) => {
    setSelectedDay(day.timeStamp);
    setDateToInput(day.timeStamp);

    onChange(new Date(day.timeStamp));
    setShowDatePicker(false);
  };

  const setYear = (offset) => {
    const year = stateLevelYear + offset;
    setStateLevelYear(year);
    setMonthDetails(getMonthDetails(year, stateLevelMonth));
  };

  const setMonth = (offset) => {
    let month = stateLevelMonth + offset;
    let year = stateLevelYear;

    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }

    setStateLevelMonth(month);
    setMonthDetails(getMonthDetails(year, month));
    if (year !== stateLevelYear) setStateLevelYear(year);
  };

  const renderCalendar = () => {
    const days = monthDetails.map((day, i) => (
      <div
        className={`${classes.CDayContainer} ${
          day.month !== 0 ? classes.Disabled : ''
        } ${isCurrentDay(day) ? classes.Highlight : ''} ${
          isSelectedDay(day) ? classes.HighlightGreen : ''
        }`}
        key={i}
      >
        <div className={classes.CdcDay}>
          <span onClick={() => onDateClick(day)}>{day.date}</span>
        </div>
      </div>
    ));

    const daysArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
      <div className={classes.CalendarContainer}>
        <div className={classes.Head}>
          {daysArr.map((day, i) => (
            <div key={i} className={classes.Head__name}>
              {day}
            </div>
          ))}
        </div>
        <div className={classes.Body}>{days}</div>
      </div>
    );
  };

  return (
    <div className={classes.DatePicker}>
      <div
        className={classes.Input}
        onClick={() => setShowDatePicker(true)}
        data-testid="datePicker"
      >
        <input
          type="text"
          onChange={updateDateFromInput}
          ref={inputRef}
          placeholder="MM/DD/YYYY"
          className={classes.ClickableInput}
          value={inputRef.current ? inputRef.current.value.trim() : ''}
          data-testid="datePickerInput"
        />
      </div>
      {showDatePicker && (
        <div
          className={classes.Container}
          ref={calendarRef}
          data-testid="datePickerContainer"
        >
          <div className={classes.Container__head}>
            <div className={classes.Container__head__btn}>
              <div
                className={classes.Container__head__btn__inner}
                onClick={() => setYear(-1)}
              >
                <span className={classes.LeftArrows}></span>
              </div>
            </div>
            <div className={classes.Container__head__btn}>
              <div
                className={classes.Container__head__btn__inner}
                onClick={() => setMonth(-1)}
              >
                <span className={classes.LeftArrow}></span>
              </div>
            </div>
            <div className={classes.Container__head__inner}>
              <div className={classes.Container__head__inner__year}>
                {stateLevelYear}
              </div>
              <div className={classes.Container__head__inner__month}>
                {getMonthStr(stateLevelMonth)}
              </div>
            </div>
            <div className={classes.Container__head__btn}>
              <div
                className={classes.Container__head__btn__inner}
                onClick={() => setMonth(1)}
              >
                <span className={classes.RightArrow}></span>
              </div>
            </div>
            <div className={classes.Container__head__btn}>
              <div
                className={classes.Container__head__btn__inner}
                onClick={() => setYear(1)}
              >
                <span className={classes.RightArrows}></span>
              </div>
            </div>
          </div>
          <div className={classes.Container__body}>{renderCalendar()}</div>
        </div>
      )}
    </div>
  );
}
