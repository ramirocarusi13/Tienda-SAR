import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import { getFormatLengthZero } from '@utils/Utils';

export default function Reloj({ withSeconds = false, className = '' }) {

    const h1 = useRef();
    const ti = () => {
        const fechahora = new Date();
        const hora = fechahora.getHours();
        const minuto = fechahora.getMinutes();
        const segundo = fechahora.getSeconds();

        if (withSeconds) {
            return `${getFormatLengthZero(hora, 2)}:${getFormatLengthZero(minuto, 2)}:${getFormatLengthZero(segundo, 2)}`;
        } else {
            return `${getFormatLengthZero(hora, 2)}:${getFormatLengthZero(minuto, 2)}`;
        }
    };

    useEffect(() => {
        const cl = setInterval(() => {
            h1.current.innerHTML = `${ti()}`;
        }, 1000);

        return () => clearInterval(cl);
    }, []);

    return (
        <h1 className={className} ref={h1}>{ti()}</h1>
    );

}
