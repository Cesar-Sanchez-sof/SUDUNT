import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/unt_logo.png"
            alt="SUDUNT Logo"
            className={className}
            {...props}
        />
    );
}
