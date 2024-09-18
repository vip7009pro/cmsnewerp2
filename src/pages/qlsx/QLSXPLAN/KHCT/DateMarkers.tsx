import React from 'react';
import { format, eachHourOfInterval, startOfDay, endOfDay } from 'date-fns';
import './DateMarkers.scss';

interface DateMarkersProps {
    startDate: Date;
    endDate: Date;
}

const DateMarkers: React.FC<DateMarkersProps> = ({ startDate, endDate }) => {
    // Tạo danh sách các giờ từ startDate đến endDate
    const hours = eachHourOfInterval({ start: startOfDay(startDate), end: endOfDay(endDate) });

    return (
        <div className="date-markers">
            <div className="eq-name">Date Markers</div>
            {hours.map((hour, index) => (
                <div key={index} className="date-marker">
                    <span>{format(hour, 'HH')}</span>
                </div>
            ))}
        </div>
    );
};

export default DateMarkers;
