import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Helper to check if two dates are the same day
    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    // Mock booked dates
    const getMockBookedDates = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        return [
            new Date(year, month, 24),
            new Date(year, month, 29),
            new Date(year, month + 1, 2),
            new Date(year, month, 15),
        ];
    };

    const bookedDates = getMockBookedDates();

    const isBooked = (date: Date) => {
        return bookedDates.some(d => isSameDay(d, date));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Generate calendar grid days
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const daysInMonth = lastDayOfMonth.getDate();
        let firstDayOfWeek = firstDayOfMonth.getDay();
        let startingSlot = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingSlot - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        // Next month days to fill 42 cells (6 rows)
        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="bg-primary-background rounded-2xl shadow-sm p-6 h-full font-sans flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-full relative">
                    <h2 className="text-xl font-bold text-text-primary">Event Catering Bookings</h2>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-xl font-bold text-text-primary">
                    {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-4">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={30} className="text-blue-600" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronRight size={30} className="text-blue-600" />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-4">
                {weekDays.map((day) => (
                    <div key={day} className="text-center text-gray-400 font-bold text-xs">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 mb-8 flex-1">
                {calendarDays.map((dayItem, index) => {
                    const booked = isBooked(dayItem.date);
                    const isSelected = isSameDay(dayItem.date, selectedDate);

                    return (
                        <div
                            key={index}
                            className={`
                                flex items-center justify-center h-8 w-8 mx-auto rounded-lg text-xs font-medium
                                ${!dayItem.isCurrentMonth ? 'text-gray-300' : 'text-text-primary'}
                                ${booked ? 'bg-primary text-text-primary' : ''}
                                ${isSelected && !booked ? 'bg-text-primary/15' : ''}
                                cursor-pointer hover:bg-text-primary/20 transition-colors relative
                            `}
                            onClick={() => setSelectedDate(dayItem.date)}
                        >
                            {dayItem.date.getDate()}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 pt-4 mt-auto">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-text-secondary">Days Booked</span>
                    <div className="w-8 h-4 bg-primary rounded-sm"></div>
                </div>
            </div>
        </div>
    );
};
