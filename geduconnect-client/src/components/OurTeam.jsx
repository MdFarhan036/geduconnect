import React from 'react'
import { TeamCard } from './TeamCard'

export const OurTeam = () => {
    const teams = [

        {
            teamimg: "/src/assets/hero-slide-1.jpg",
            name: "Sandeep Sharma",
            position: "CEO",
            // position: "CEO, Company A"
        },
        {
            teamimg: "/src/assets/hero-slide-1.jpg",
            name: "Sandeep Sharma",
            position: "CEO",
            // position: "CEO, Company A"
        },
        {
            teamimg: "/src/assets/hero-slide-1.jpg",
            name: "Sandeep Sharma",
            position: "CEO",
            // position: "CEO, Company A"
        },
        {
            teamimg: "/src/assets/hero-slide-1.jpg",
            name: "Sandeep Sharma",
            position: "CEO",
            // position: "CEO, Company A"
        },
    ]
    return (
        <div className='our-team'>
            <div className="section-titles ">
                <h2>OurTeam</h2>

            </div>
            <TeamCard teams={teams} />
        </div>
    )
}
