import React, { useState } from 'react'


export const PartnersCard = ({ item: { id, partnerImg } }) => {


    return (
        <>
            <div className="partners-item" key={id}>
                <img src={partnerImg} alt='Partners Image' />
            </div>
        </>


    )
}
