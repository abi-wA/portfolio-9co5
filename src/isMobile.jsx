import { useState, useEffect } from 'react'

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera
            const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
            const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
            setIsMobile(isTouch && isMobileUA)
        }

        checkMobile()
    }, [])

    return isMobile
}