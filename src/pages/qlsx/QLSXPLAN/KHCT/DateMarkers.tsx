import React from 'react';
import { format, eachHourOfInterval, startOfDay, endOfDay } from 'date-fns';
import './DateMarkers.scss';

interface DateMarkersProps {
    startDate: Date;
    endDate: Date;
    width: number;
}

const DateMarkers: React.FC<DateMarkersProps> = ({ startDate, endDate, width }) => {
    // Tạo danh sách các giờ từ startDate đến endDate
    const hours = eachHourOfInterval({ start: startDate, end: endOfDay(endDate) });

    return (
        <div className="date-markers" >
            <div className="eq-name">Date Markers</div>
            {hours.map((hour, index) => (
                <div key={index} className="date-marker" style={{ width: `${width}px` }}>
                    <span>{format(hour, 'HH:mm')}</span>
                </div>
            ))}
        </div>
    );
};

export default DateMarkers;
