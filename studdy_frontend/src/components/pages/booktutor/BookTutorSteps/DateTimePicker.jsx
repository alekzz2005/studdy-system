import React, { useMemo } from 'react';

const DateTimePicker = ({ formData, errors, onChange }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();
  
  // Generate months starting from current month
  const months = useMemo(() => {
    const allMonths = [
      { value: '01', label: 'January' }, { value: '02', label: 'February' },
      { value: '03', label: 'March' }, { value: '04', label: 'April' },
      { value: '05', label: 'May' }, { value: '06', label: 'June' },
      { value: '07', label: 'July' }, { value: '08', label: 'August' },
      { value: '09', label: 'September' }, { value: '10', label: 'October' },
      { value: '11', label: 'November' }, { value: '12', label: 'December' }
    ];
    
    return allMonths.filter(month => {
      const monthNum = parseInt(month.value);
      return monthNum >= currentMonth;
    });
  }, [currentMonth]);
  
  // Generate days based on selected month and year
  const getDaysInMonth = () => {
    if (!formData.sessionMonth || !formData.sessionYear) return 31;
    const month = parseInt(formData.sessionMonth);
    const year = parseInt(formData.sessionYear);
    
    if (month === 2) return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    const thirtyDayMonths = [4, 6, 9, 11];
    return thirtyDayMonths.includes(month) ? 30 : 31;
  };
  
  const generateDays = () => {
    const daysInMonth = getDaysInMonth();
    const days = [];
    
    // Determine starting day
    let startDay = 1;
    const selectedMonth = parseInt(formData.sessionMonth || currentMonth);
    const selectedYear = parseInt(formData.sessionYear || currentYear);
    
    // If it's the current month and current year, start from today
    if (selectedMonth === currentMonth && selectedYear === currentYear) {
      startDay = currentDay;
    }
    
    for (let i = startDay; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, '0');
      days.push({ value: day, label: day });
    }
    
    return days;
  };
  
  const days = generateDays();
  
  // Only current year (no future years)
  const years = [
    { value: currentYear.toString(), label: currentYear.toString() }
  ];
  
  const hours = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, '0'),
    label: (i + 1).toString().padStart(2, '0')
  }));
  
  const minutes = [
    { value: '00', label: '00' }, { value: '15', label: '15' },
    { value: '30', label: '30' }, { value: '45', label: '45' }
  ];
  
  const ampmOptions = [
    { value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }
  ];
  
  const durationOptions = [
    { value: '1', label: '1 hour' }, { value: '1.5', label: '1.5 hours' },
    { value: '2', label: '2 hours' }, { value: '2.5', label: '2.5 hours' },
    { value: '3', label: '3 hours' }
  ];
  
  const handleMonthChange = (value) => {
    onChange('sessionMonth', value);
    // Reset day when month changes
    onChange('sessionDay', '');
  };
  
  return (
    <>
      {/* Session Date */}
      <div className="form-group">
        <label className="form-label">Session Date *</label>
        <div className="horizontal-row">
          <div className="dropdown-wrapper">
            <select
              value={formData.sessionMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className={`form-select ${errors.sessionMonth ? 'error' : ''}`}
            >
              <option value="">Month</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            {errors.sessionMonth && <span className="error-message">{errors.sessionMonth}</span>}
          </div>
          
          <div className="dropdown-wrapper">
            <select
              value={formData.sessionDay}
              onChange={(e) => onChange('sessionDay', e.target.value)}
              className={`form-select ${errors.sessionDay ? 'error' : ''}`}
              disabled={!formData.sessionMonth}
            >
              <option value="">Day</option>
              {days.map(day => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
            {errors.sessionDay && <span className="error-message">{errors.sessionDay}</span>}
          </div>
          
          <div className="dropdown-wrapper">
            <select
              value={formData.sessionYear}
              onChange={(e) => onChange('sessionYear', e.target.value)}
              className={`form-select ${errors.sessionYear ? 'error' : ''}`}
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
            {errors.sessionYear && <span className="error-message">{errors.sessionYear}</span>}
          </div>
        </div>
      </div>
      
      {/* Start Time */}
      <div className="form-group">
        <label className="form-label">Start Time *</label>
        <div className="horizontal-row">
          <div className="dropdown-wrapper">
            <select
              value={formData.startHour}
              onChange={(e) => onChange('startHour', e.target.value)}
              className={`form-select ${errors.startHour ? 'error' : ''}`}
            >
              <option value="">Hour</option>
              {hours.map(hour => (
                <option key={hour.value} value={hour.value}>{hour.label}</option>
              ))}
            </select>
            {errors.startHour && <span className="error-message">{errors.startHour}</span>}
          </div>
          
          <div className="dropdown-wrapper">
            <select
              value={formData.startMinute}
              onChange={(e) => onChange('startMinute', e.target.value)}
              className={`form-select ${errors.startMinute ? 'error' : ''}`}
            >
              <option value="">Minute</option>
              {minutes.map(minute => (
                <option key={minute.value} value={minute.value}>{minute.label}</option>
              ))}
            </select>
            {errors.startMinute && <span className="error-message">{errors.startMinute}</span>}
          </div>
          
          <div className="dropdown-wrapper">
            <select
              value={formData.startAmPm}
              onChange={(e) => onChange('startAmPm', e.target.value)}
              className={`form-select ${errors.startAmPm ? 'error' : ''}`}
            >
              <option value="">AM/PM</option>
              {ampmOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.startAmPm && <span className="error-message">{errors.startAmPm}</span>}
          </div>
        </div>
      </div>
      
      {/* Duration */}
      <div className="form-group">
        <label htmlFor="duration" className="form-label">Session Duration *</label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={(e) => onChange('duration', e.target.value)}
          className={`form-select ${errors.duration ? 'error' : ''}`}
        >
          <option value="">Select duration</option>
          {durationOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors.duration && <span className="error-message">{errors.duration}</span>}
      </div>
    </>
  );
};

export default DateTimePicker;