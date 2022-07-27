import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import baseUrl from '../../utils/baseUrl';
import axios from 'axios';
import { ListItem } from '@mui/material';

const OurDoctors = () => {

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const url = `${baseUrl}/api/doctors`;
        axios.get(url)
        .then( (res) => {
            setDoctors(res.data);
        })
        .catch ( (err) => {
            NotificationManager.error('Error message', 'Something went wrong');
        });
    }, [])

    return (
        <div className="doctors-area ptb-100">
            <div className="container">
                <div className="section-title">
                    <h2>Meet Our Doctors</h2>
                </div>

                <div className="row justify-content-center">
                    {
                        doctors.map((doctor, idx) => {
                            if(idx < 3) {
                                let aptLink = `/appointment/${doctor._id}`;
                                let detailLink = `/doctor-details/${doctor._id}`;
                                return(
                                    <div className="col-sm-6 col-lg-4" key={idx}>
                                        <div className="doctor-item">
                                            <div className="doctor-top">
                                                <img src={baseUrl + '/' + doctor.imagePath} alt="Doctor" />
                                                <Link href={aptLink}>
                                                    <a>Get Appointment</a>
                                                </Link>
                                            </div>
                                            <div className="doctor-bottom">
                                                <h3>
                                                    <Link href={detailLink}>
                                                        <a>{doctor.firstname + ' ' + doctor.lastname}</a>
                                                    </Link>
                                                </h3>
                                                <span>{doctor.major}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>

                <div className="doctor-btn">
                    <Link href="/doctors">
                        <a>See All</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OurDoctors;