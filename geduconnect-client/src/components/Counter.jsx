import React, { useState, useEffect } from 'react';

const countersData = [
    { label: "Students Enrolled", target: 100000 },
   
    { label: "Years of Experience", target: 17 },
    { label: "Consultant Network", target: 500 },
    
    { label: "Universities Partners", target: 25 },
    { label: "Publications", target: 10 },
];

const duration = 5000; // 5 seconds for all counters to reach their limit

const Counter = () => {
    const [counters, setCounters] = useState(
        countersData.map(() => ({ value: 0, animate: false }))
    );

    useEffect(() => {
        const intervals = countersData.map((counter, index) => {
            const incrementAmount = counter.target / (duration / 100); // Calculate increment per interval
            return setInterval(() => {
                setCounters((prevCounters) => {
                    const newCounters = [...prevCounters];
                    if (newCounters[index].value < counter.target) {
                        newCounters[index].value = Math.min(newCounters[index].value + incrementAmount, counter.target);
                        newCounters[index].animate = true;
                    }
                    return newCounters;
                });

                // Stop animation after each step
                setTimeout(() => {
                    setCounters((prevCounters) => {
                        const newCounters = [...prevCounters];
                        newCounters[index].animate = false;
                        return newCounters;
                    });
                }, 300); // Animation duration (matches the CSS transition)
            }, 100); // Update every 100ms
        });

        // Clear intervals when component unmounts
        return () => {
            intervals.forEach(clearInterval);
        };
    }, []);

    return (
        <div className="multi-counter-container">
            {countersData.map((counter, index) => (
                <div key={index} className="counter-box">
                    <div className={`counter ${counters[index].animate ? 'animate' : ''}`}>
                        {Math.floor(counters[index].value)}+
                    </div>
                    <div className="label">{counter.label}</div>

                </div>
            ))}
        </div>
    );
};

export default Counter;
